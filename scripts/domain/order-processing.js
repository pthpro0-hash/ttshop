export function completeBypassPayment({ cart, store, payment }) {
  // 데모 결제의 중심 트랜잭션.
  // PG 결제창만 우회하고, 주문 생성/재고 차감/포인트 사용/추천 링크/대리점 정산 장부는 실제 store에 반영한다.
  const member = store.members.find((item) => item.id === payment.memberId);
  if (!member) {
    throw new Error("결제 처리 대상 회원을 찾을 수 없습니다.");
  }

  const paidProductAmount = cart.reduce(
    (sum, item) => sum + item.sale * item.qty,
    0,
  );
  const shippingAmount =
    paidProductAmount > 0 && paidProductAmount < 50000 ? 3000 : 0;
  const pointUseLimit = calculatePointUseLimit({
    paidProductAmount,
    memberPoints: member.points,
    maxPointUseRate: store.settings.maxPointUseRate,
  });
  const pointUsed = normalizePointUsed(payment.pointUsed, pointUseLimit);
  const paidAmount = paidProductAmount + shippingAmount - pointUsed;
  const pointRate = store.settings.purchasePointRate;
  const earnedPoints = calculatePurchasePoints(paidProductAmount, pointRate);
  const orderId = createId("order", store.orders.length + 1);
  const paidAt = new Date().toISOString().slice(0, 10);
  const agencyIdAtOrder = member.agencyId || getHeadquartersAgency(store)?.id;
  const referralSourceType = payment.referralSourceType || "none";
  const shippingSnapshot = normalizeShippingSnapshot(
    payment.shippingSnapshot,
    member,
  );

  const order = {
    id: orderId,
    memberId: member.id,
    agencyIdAtOrder,
    referralSourceType,
    paidProductAmount,
    shippingAmount,
    paidAmount,
    pointUsed,
    pointUseLimit,
    pointEarned: earnedPoints,
    status: "paid",
    confirmedAt: "",
    shippingStatus: "preparing",
    courier: "",
    trackingNumber: "",
    shippedAt: "",
    deliveredAt: "",
    shippingMemo: "",
    shippingAddress: shippingSnapshot,
    paymentMethod: shippingSnapshot.paymentMethod || "",
    paidAt,
    items: cart.map((item) => ({
      productId: item.id,
      productName: item.name,
      productKo: item.ko,
      sale: item.sale,
      qty: item.qty,
      option: item.option,
      variantSku: item.variantSku || "",
    })),
  };

  store.orders.unshift(order);
  decrementProductStock(store, cart);
  member.points = Math.max(0, Number(member.points || 0) - pointUsed);
  if (pointUsed > 0) {
    store.pointLedger.unshift({
      id: createId("point", store.pointLedger.length + 1),
      memberId: member.id,
      orderId,
      type: "purchase_use",
      amount: -pointUsed,
      baseAmount: paidProductAmount,
      rate: store.settings.maxPointUseRate,
      note: "결제 시 보유 포인트 사용",
      createdAt: paidAt,
    });
  }
  store.pointLedger.unshift({
    id: createId("point", store.pointLedger.length + 1),
    memberId: member.id,
    orderId,
    type: "purchase_pending",
    amount: earnedPoints,
    baseAmount: paidProductAmount,
    rate: pointRate,
    note: "구매확정 후 적립 예정",
    createdAt: paidAt,
  });

  const referralLinks = createPurchasedProductReferralLinks({
    cart,
    memberId: member.id,
    orderId,
    store,
  });
  store.personalReferralLinks.unshift(...referralLinks);

  const agencyProcessing = createAgencyProcessing({ order, store });
  if (agencyProcessing) {
    store.agencySettlementLedger.unshift(agencyProcessing);
  }

  return {
    order,
    member,
    earnedPoints,
    referralLinks,
    agencyProcessing,
    totals: {
      paidProductAmount,
      shippingAmount,
      paidAmount,
      pointUsed,
      pointUseLimit,
    },
  };
}

export function confirmPurchase(store, orderId, confirmedBy = "member") {
  // 포인트는 결제 직후 바로 적립하지 않고 purchase_pending으로 둔다.
  // 회원 구매확정 또는 14일 자동확정 시 purchase_earn으로 전환하며 실제 보유 포인트에 더한다.
  const order = store.orders.find((item) => item.id === orderId);
  if (!order || order.confirmedAt) return false;

  const member = store.members.find((item) => item.id === order.memberId);
  if (!member) return false;

  const confirmedAt = new Date().toISOString().slice(0, 10);
  order.confirmedAt = confirmedAt;
  order.status = "completed";

  const alreadyEarnedPoint = store.pointLedger.find(
    (point) => point.orderId === order.id && point.type === "purchase_earn",
  );
  if (alreadyEarnedPoint) {
    // 기존 DB에 이미 실제 적립된 주문이 있을 수 있어 중복 적립을 방지한다.
    alreadyEarnedPoint.note = alreadyEarnedPoint.note || "구매확정 완료 적립";
    return true;
  }

  let pendingPoint = store.pointLedger.find(
    (point) => point.orderId === order.id && point.type === "purchase_pending",
  );
  if (!pendingPoint && Number(order.pointEarned || 0) > 0) {
    pendingPoint = {
      id: createId("point", store.pointLedger.length + 1),
      memberId: member.id,
      orderId: order.id,
      type: "purchase_pending",
      amount: Number(order.pointEarned || 0),
      baseAmount: Number(order.paidProductAmount || 0),
      rate: store.settings.purchasePointRate,
      note: "구매확정 후 적립 예정",
      createdAt: order.paidAt || confirmedAt,
    };
    store.pointLedger.unshift(pendingPoint);
  }

  if (pendingPoint && pendingPoint.type === "purchase_pending") {
    pendingPoint.type = "purchase_earn";
    pendingPoint.note =
      confirmedBy === "auto"
        ? "구매일 14일 경과 자동 구매확정 적립"
        : "구매확정 완료 적립";
    pendingPoint.createdAt = confirmedAt;
    member.points += Number(pendingPoint.amount || 0);
  }

  return true;
}

export function autoConfirmEligibleOrders(store, today = new Date()) {
  // 앱 시작 시 호출되어 구매일 기준 14일이 지난 미확정 주문을 자동 구매확정한다.
  let changed = false;
  (store.orders || []).forEach((order) => {
    if (order.confirmedAt || !order.paidAt) return;
    const baseDate = new Date(`${order.paidAt}T00:00:00`);
    const elapsedDays = Math.floor(
      (today.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (elapsedDays >= 14) {
      changed = confirmPurchase(store, order.id, "auto") || changed;
    }
  });
  return changed;
}

function normalizeShippingSnapshot(snapshot = {}, member = {}) {
  // 주문 당시 배송지를 스냅샷으로 저장한다.
  // 회원이 나중에 주소를 바꿔도 과거 주문의 수령인/주소는 그대로 유지되어야 한다.
  const fallback = member.address || {};

  return {
    recipient: snapshot.recipient || member.name || "",
    phone: snapshot.phone || member.phone || "",
    postcode: snapshot.postcode || fallback.postcode || "",
    address: snapshot.address || fallback.address || "",
    addressDetail: snapshot.addressDetail || fallback.addressDetail || "",
    paymentMethod: snapshot.paymentMethod || member.paymentMethod || "",
  };
}

function decrementProductStock(store, cart) {
  cart.forEach((item) => {
    const product = (store.products || []).find(
      (productItem) => productItem.id === item.id,
    );
    if (!product) return;

    product.stock = Math.max(0, Number(product.stock || 0) - item.qty);
    const variant =
      (product.variants || []).find(
        (variantItem) =>
          variantItem.sku === item.variantSku ||
          variantItem.optionName === item.option,
      ) || product.variants?.[0];

    if (variant) {
      variant.stock = Math.max(0, Number(variant.stock || 0) - item.qty);
    }
    if (product.stock <= 0) product.status = "soldout";
  });
}

function createPurchasedProductReferralLinks({
  cart,
  memberId,
  orderId,
  store,
}) {
  // 개인 추천 링크 정책: 주문 안에서 상품 1종당 링크 1개만 만든다.
  // 같은 상품을 여러 개 구매해도 링크는 1개, 서로 다른 상품이면 각각 1개다.
  const links = [];
  const nextNumber = store.personalReferralLinks.length + 1;
  const uniqueProducts = new Map();

  cart.forEach((item) => {
    if (!uniqueProducts.has(item.id)) uniqueProducts.set(item.id, item);
  });

  uniqueProducts.forEach((item) => {
    const sequence = nextNumber + links.length;
    links.push({
      id: createId("ref", sequence),
      ownerMemberId: memberId,
      productId: item.id,
      orderId,
      unitIndex: 1,
      code: `${item.id.toUpperCase().replace(/[^A-Z0-9]/g, "-")}-${sequence.toString().padStart(3, "0")}`,
      status: "active",
    });
  });

  return links;
}

function createAgencyProcessing({ order, store }) {
  // 개인 상품 추천 링크 구매가 대리점 정산보다 우선한다.
  // 개인 추천 구매가 아닌 주문만 대리점 영업비 정산 장부에 올라간다.
  if (order.referralSourceType === "personal_product") return null;

  const agency = store.agencies.find(
    (item) => item.id === order.agencyIdAtOrder,
  );
  if (!agency) return null;

  const commissionAmount = Math.floor(
    (order.paidProductAmount * agency.commissionRate) / 100,
  );

  return {
    id: createId("agency-settlement", store.agencySettlementLedger.length + 1),
    agencyId: agency.id,
    orderId: order.id,
    baseAmount: order.paidProductAmount,
    commissionRate: agency.commissionRate,
    commissionAmount,
    status: "pending_next_month_15",
    updatedAt: "",
    statusUpdatedBy: "",
    statusNote: "",
    statusHistory: [],
    note: "개인 추천링크 구매가 아니므로 대리점 전월 매출 정산 대상",
    createdAt: order.paidAt,
  };
}

function getHeadquartersAgency(store) {
  return store.agencies.find((agency) => agency.isHeadquarters);
}

export function calculatePurchasePoints(amount, rate) {
  return Math.floor(
    (Math.max(0, Number(amount) || 0) * getPercent(rate)) / 100,
  );
}

export function calculatePointUseLimit({
  paidProductAmount,
  memberPoints,
  maxPointUseRate,
}) {
  const productLimit = Math.floor(
    (Math.max(0, Number(paidProductAmount) || 0) *
      getPercent(maxPointUseRate)) /
      100,
  );

  return Math.min(productLimit, Math.max(0, Number(memberPoints) || 0));
}

function normalizePointUsed(pointUsed, pointUseLimit) {
  return Math.min(
    Math.max(0, Math.floor(Number(pointUsed) || 0)),
    Math.max(0, Number(pointUseLimit) || 0),
  );
}

function getPercent(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

function createId(prefix, sequence) {
  return `${prefix}-${sequence.toString().padStart(3, "0")}`;
}

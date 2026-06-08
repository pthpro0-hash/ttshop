export function completeBypassPayment({ cart, store, payment }) {
  // Central order transaction for the demo checkout.
  // The PG step is bypassed, but business side effects are real in the store:
  // order creation, stock decrement, point use/earn, referral links, and agency settlement.
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
  member.points += earnedPoints;
  store.pointLedger.unshift({
    id: createId("point", store.pointLedger.length + 1),
    memberId: member.id,
    orderId,
    type: "purchase_earn",
    amount: earnedPoints,
    baseAmount: paidProductAmount,
    rate: pointRate,
    note: "배송비 제외 실결제 상품금액 기준 구매 적립",
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

function normalizeShippingSnapshot(snapshot = {}, member = {}) {
  // Persist a point-in-time shipping snapshot on the order.
  // Member addresses can change later, but past orders should keep the original recipient/address.
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
  // Referral policy: one personal referral link per unique product in an order.
  // Buying the same product multiple times still creates only one product link.
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
  // Personal product referral purchases bypass agency commission.
  // All other paid product amounts become agency settlement ledger candidates.
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

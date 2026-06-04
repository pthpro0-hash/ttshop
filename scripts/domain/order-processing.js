export function completeBypassPayment({ cart, store, payment }) {
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
  const paidAmount = paidProductAmount + shippingAmount;
  const pointRate = store.settings.purchasePointRate;
  const earnedPoints = calculatePurchasePoints(paidProductAmount, pointRate);
  const orderId = createId("order", store.orders.length + 1);
  const paidAt = new Date().toISOString().slice(0, 10);
  const agencyIdAtOrder = member.agencyId || getHeadquartersAgency(store)?.id;
  const referralSourceType = payment.referralSourceType || "none";

  const order = {
    id: orderId,
    memberId: member.id,
    agencyIdAtOrder,
    referralSourceType,
    paidProductAmount,
    shippingAmount,
    paidAmount,
    pointEarned: earnedPoints,
    status: "paid",
    paidAt,
    items: cart.map((item) => ({
      productId: item.id,
      productName: item.name,
      productKo: item.ko,
      sale: item.sale,
      qty: item.qty,
      option: item.option,
    })),
  };

  store.orders.unshift(order);
  decrementProductStock(store, cart);
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
    },
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
        (variantItem) => variantItem.optionName === item.option,
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

function getPercent(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

function createId(prefix, sequence) {
  return `${prefix}-${sequence.toString().padStart(3, "0")}`;
}

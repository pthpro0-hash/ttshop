export const STORE_KEY = "beauty-ref-demo-store-v1";

export const defaultStore = {
  settings: {
    purchasePointRate: 5,
    maxPointUseRate: 50,
    friendSignupPoint: 3000,
    personalReferrerRewardRate: 10,
    personalBuyerBonusRate: 5,
  },
  agencies: [
    {
      id: "agency-hq",
      name: "본사",
      code: "HQ",
      linkSlug: "hq",
      commissionRate: 0,
      status: "active",
      isHeadquarters: true,
    },
    {
      id: "agency-gangnam",
      name: "강남 뷰티 대리점",
      code: "GNBEAUTY",
      linkSlug: "gangnam-beauty",
      commissionRate: 12,
      status: "active",
      isHeadquarters: false,
    },
  ],
  members: [
    {
      id: "member-a",
      name: "홍길동",
      phone: "010-0000-0000",
      agencyId: "agency-gangnam",
      points: 18000,
      status: "active",
    },
  ],
  orders: [
    {
      id: "order-001",
      memberId: "member-a",
      agencyIdAtOrder: "agency-gangnam",
      referralSourceType: "none",
      paidProductAmount: 76000,
      shippingAmount: 0,
      status: "paid",
      paidAt: "2026-05-29",
    },
  ],
  personalReferralLinks: [
    {
      id: "ref-led-001",
      ownerMemberId: "member-a",
      productId: "device-led",
      orderId: "order-001",
      unitIndex: 1,
      code: "LED-A-001",
      status: "active",
    },
  ],
};

export function cloneDefaultStore() {
  return JSON.parse(JSON.stringify(defaultStore));
}

export function loadStore() {
  const saved = localStorage.getItem(STORE_KEY);
  if (!saved) return cloneDefaultStore();

  try {
    return { ...cloneDefaultStore(), ...JSON.parse(saved) };
  } catch {
    return cloneDefaultStore();
  }
}

export function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

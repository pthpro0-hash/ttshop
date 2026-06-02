export const STORE_KEY = "beauty-ref-demo-store-v1";

export const defaultStore = {
  currentMemberId: "",
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
      userId: "beauty_user",
      passwordHash: "5a93782c",
      authProvider: "password",
      name: "홍길동",
      phone: "010-0000-0000",
      email: "beauty@example.com",
      agencyId: "agency-gangnam",
      points: 18000,
      status: "active",
      joinedAt: "2026-05-29",
      address: {
        postcode: "06236",
        address: "서울시 강남구 테헤란로 000",
        addressDetail: "",
      },
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
      paidAmount: 76000,
      pointEarned: 3800,
      status: "paid",
      paidAt: "2026-05-29",
      items: [
        {
          productId: "device-led",
          productName: "LED Skin Lifting Device",
          productKo: "LED 스킨 리프팅 디바이스",
          sale: 76000,
          qty: 1,
          option: "1ea / Warm White",
        },
      ],
    },
  ],
  pointLedger: [
    {
      id: "point-001",
      memberId: "member-a",
      orderId: "order-001",
      type: "purchase_earn",
      amount: 3800,
      baseAmount: 76000,
      rate: 5,
      note: "배송비 제외 실결제 상품금액 기준 구매 적립",
      createdAt: "2026-05-29",
    },
  ],
  agencySettlementLedger: [
    {
      id: "agency-settlement-001",
      agencyId: "agency-gangnam",
      orderId: "order-001",
      baseAmount: 76000,
      commissionRate: 12,
      commissionAmount: 9120,
      status: "pending_next_month_15",
      note: "개인 추천링크 구매가 아니므로 대리점 전월 매출 정산 대상",
      createdAt: "2026-05-29",
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

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function loadStore() {
  const storage = getStorage();
  const saved = storage?.getItem(STORE_KEY);
  if (!saved) return cloneDefaultStore();

  try {
    return { ...cloneDefaultStore(), ...JSON.parse(saved) };
  } catch {
    return cloneDefaultStore();
  }
}

export function saveStore(store) {
  getStorage()?.setItem(STORE_KEY, JSON.stringify(store));
}

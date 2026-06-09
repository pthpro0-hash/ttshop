import { products as catalogProducts } from "./catalog.js";

export const STORE_KEY = "beauty-ref-demo-store-v1";
const DB_NAME = "beauty-ref-local-db";
const DB_VERSION = 1;
const DB_STORE = "app-state";
const DB_STATE_KEY = "store";

// Canonical in-memory shape for the whole demo.
// Server mode persists this object into SQLite. File:// mode stores the same
// shape in IndexedDB/localStorage so the UI can run without a backend.
export const defaultStore = {
  currentMemberId: "",
  settings: {
    purchasePointRate: 5,
    maxPointUseRate: 50,
    friendSignupPoint: 3000,
    personalReferrerRewardRate: 10,
    personalBuyerBonusRate: 5,
  },
  products: catalogProducts.map((product, index) => ({
    ...product,
    detailImages: normalizeDetailImages(product),
    sku: product.id.toUpperCase().replace(/[^A-Z0-9]/g, "-"),
    status: "selling",
    displayStatus: "displayed",
    stock: 100 - index * 3,
    safetyStock: 5,
    supplyPrice: Math.floor(product.sale * 0.65),
    cost: Math.floor(product.sale * 0.55),
    taxType: "taxable",
    shippingType: "default",
    shippingFee: 3000,
    pointRateOverride: "",
    manufacturer: "BEAUTY REF.",
    supplier: "본사 물류",
    origin: "Korea",
    brand: "BEAUTY REF.",
    barcode: "",
    searchKeywords: `${product.name}, ${product.ko}, ${product.category}`,
    variants: [
      {
        id: `${product.id}-default`,
        optionName: product.option,
        sku: `${product.id.toUpperCase().replace(/[^A-Z0-9]/g, "-")}-STD`,
        priceDelta: 0,
        stock: 100 - index * 3,
        status: "selling",
      },
    ],
  })),
  agencies: [
    {
      id: "agency-hq",
      name: "본사",
      code: "HQ",
      linkSlug: "hq",
      commissionRate: 0,
      status: "active",
      isHeadquarters: true,
      contractStart: "2026-01-01",
      contractEnd: "",
      managerName: "본사",
      managerPhone: "02-0000-0000",
      settlementAccount: "본사 내부 정산",
      loginUserId: "",
      loginPasswordHash: "",
    },
    {
      id: "agency-gangnam",
      name: "강남 뷰티 대리점",
      code: "GNBEAUTY",
      linkSlug: "gangnam-beauty",
      commissionRate: 12,
      status: "active",
      isHeadquarters: false,
      contractStart: "2026-05-01",
      contractEnd: "",
      managerName: "김담당",
      managerPhone: "010-1111-2222",
      settlementAccount: "테스트은행 123-456-789 홍길동",
      loginUserId: "gangnam01",
      loginPasswordHash: "fdc96a92",
    },
  ],
  members: [
    {
      id: "member-a",
      userId: "beauty01",
      passwordHash: "9a92be01",
      authProvider: "password",
      name: "홍길동",
      phone: "010-0000-0000",
      email: "beauty@example.com",
      agencyId: "agency-gangnam",
      role: "agency_manager",
      points: 18000,
      status: "active",
      joinedAt: "2026-05-29",
      address: {
        postcode: "06236",
        address: "서울시 강남구 테헤란로 000",
        addressDetail: "",
      },
      shippingAddresses: [
        {
          id: "addr-member-a-default",
          label: "기본 배송지",
          recipient: "홍길동",
          phone: "010-0000-0000",
          postcode: "06236",
          address: "서울시 강남구 테헤란로 000",
          addressDetail: "",
          isDefault: true,
        },
      ],
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
      pointUsed: 0,
      pointUseLimit: 18000,
      pointEarned: 3800,
      status: "paid",
      confirmedAt: "2026-05-29",
      shippingStatus: "preparing",
      courier: "",
      trackingNumber: "",
      shippedAt: "",
      deliveredAt: "",
      shippingMemo: "결제 확인 후 출고 준비",
      shippingAddress: {
        recipient: "홍길동",
        phone: "010-0000-0000",
        postcode: "06236",
        address: "서울시 강남구 테헤란로 000",
        addressDetail: "",
      },
      paymentMethod: "신용카드",
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
      updatedAt: "",
      statusUpdatedBy: "",
      statusNote: "",
      statusHistory: [],
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

function normalizeDetailImages(product) {
  if (Array.isArray(product.detailImages) && product.detailImages.length) {
    return product.detailImages.slice(0, 5);
  }

  return [product.image].filter(Boolean);
}

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

export async function loadStore() {
  // Priority:
  // 1. Local server SQLite API when the app is opened through localhost.
  // 2. IndexedDB snapshot for file:// or offline fallback.
  // 3. localStorage legacy backup.
  // Local product edits may be merged into a fresh server seed so admin-created
  // products are not lost when switching between file and server preview.
  const serverStore = await loadStoreFromServer();
  if (serverStore) {
    const localStore = await getBestLocalStore();
    const mergedProductStore = mergeLocalProductsIntoServer(
      serverStore,
      localStore,
    );
    const shouldMigrate = shouldMigrateLocalStoreToServer(
      mergedProductStore,
      localStore,
    );
    const snapshot = shouldMigrate
      ? normalizeStore(localStore)
      : normalizeStore(mergedProductStore);

    if (shouldMigrate || mergedProductStore !== serverStore) {
      await saveStoreToServer(snapshot);
    }
    getStorage()?.setItem(STORE_KEY, JSON.stringify(snapshot));
    await saveStoreToDatabase(snapshot);
    return snapshot;
  }

  const databaseStore = await loadStoreFromDatabase();
  if (databaseStore) {
    const snapshot = normalizeStore(databaseStore);
    getStorage()?.setItem(STORE_KEY, JSON.stringify(snapshot));
    return snapshot;
  }

  const legacyStore = loadStoreFromLegacyStorage();
  await saveStore(legacyStore);
  return normalizeStore(legacyStore);
}

export async function saveStore(store) {
  // Keep localStorage as a lightweight compatibility backup even when the
  // SQLite API is available. Tests and file preview use this same fallback path.
  const snapshot = normalizeStore(store);
  getStorage()?.setItem(STORE_KEY, JSON.stringify(snapshot));

  if (await saveStoreToServer(snapshot)) return;

  await saveStoreToDatabase(snapshot);
}

function loadStoreFromLegacyStorage() {
  const storage = getStorage();
  const saved = storage?.getItem(STORE_KEY);
  if (!saved) return cloneDefaultStore();

  try {
    return { ...cloneDefaultStore(), ...JSON.parse(saved) };
  } catch {
    return cloneDefaultStore();
  }
}

async function getBestLocalStore() {
  const databaseStore = await loadStoreFromDatabase();
  const legacyStore = loadStoreFromLegacyStorage();

  if (getStoreWeight(databaseStore) >= getStoreWeight(legacyStore)) {
    return databaseStore;
  }

  return legacyStore;
}

function shouldMigrateLocalStoreToServer(serverStore, localStore) {
  if (!localStore) return false;
  return getStoreWeight(localStore) > getStoreWeight(serverStore);
}

function mergeLocalProductsIntoServer(serverStore, localStore) {
  if (!localStore?.products?.length) return serverStore;

  const serverSnapshot = normalizeStore(serverStore);
  const localSnapshot = normalizeStore(localStore);
  const serverProductIds = new Set(
    serverSnapshot.products.map((product) => product.id),
  );
  const missingProducts = localSnapshot.products.filter(
    (product) => !serverProductIds.has(product.id),
  );

  if (!missingProducts.length) return serverStore;

  return {
    ...serverSnapshot,
    products: [...serverSnapshot.products, ...missingProducts],
  };
}

function getStoreWeight(store) {
  if (!store) return 0;
  const snapshot = normalizeStore(store);

  return (
    snapshot.members.length * 10 +
    snapshot.orders.length * 8 +
    snapshot.pointLedger.length * 5 +
    snapshot.agencySettlementLedger.length * 4 +
    snapshot.personalReferralLinks.length * 3 +
    snapshot.products.length * 2 +
    snapshot.agencies.length +
    (snapshot.currentMemberId ? 2 : 0) +
    (snapshot.pendingAgencySlug ? 1 : 0)
  );
}

function normalizeStore(store) {
  return {
    ...cloneDefaultStore(),
    ...store,
    settings: { ...cloneDefaultStore().settings, ...store?.settings },
    agencies: store?.agencies || cloneDefaultStore().agencies,
    products: store?.products || cloneDefaultStore().products,
    members: store?.members || cloneDefaultStore().members,
    orders: store?.orders || cloneDefaultStore().orders,
    pointLedger: store?.pointLedger || cloneDefaultStore().pointLedger,
    agencySettlementLedger:
      store?.agencySettlementLedger ||
      cloneDefaultStore().agencySettlementLedger,
    personalReferralLinks:
      store?.personalReferralLinks || cloneDefaultStore().personalReferralLinks,
  };
}

async function loadStoreFromServer() {
  if (!shouldUseServerStore()) return null;

  try {
    const response = await fetchWithTimeout("/api/store", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function saveStoreToServer(store) {
  if (!shouldUseServerStore()) return false;

  try {
    const response = await fetchWithTimeout("/api/store", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(store),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function shouldUseServerStore() {
  const browserWindow = globalThis.window || null;
  return Boolean(
    browserWindow &&
    !browserWindow.__BEAUTY_DISABLE_SERVER_STORE &&
    browserWindow.location?.protocol !== "file:" &&
    browserWindow.fetch,
  );
}

function fetchWithTimeout(url, options = {}) {
  const browserWindow = globalThis.window;
  const controller = new AbortController();
  const timeout = browserWindow.setTimeout(() => controller.abort(), 800);

  return browserWindow
    .fetch(url, { ...options, signal: controller.signal })
    .finally(() => browserWindow.clearTimeout(timeout));
}

async function loadStoreFromDatabase() {
  const database = await openDatabase();
  if (!database) return null;

  return new Promise((resolve) => {
    const transaction = database.transaction(DB_STORE, "readonly");
    const request = transaction.objectStore(DB_STORE).get(DB_STATE_KEY);

    request.onsuccess = () => resolve(request.result?.value || null);
    request.onerror = () => resolve(null);
  });
}

async function saveStoreToDatabase(store) {
  const database = await openDatabase();
  if (!database) return;

  await new Promise((resolve) => {
    const transaction = database.transaction(DB_STORE, "readwrite");
    transaction.objectStore(DB_STORE).put({
      id: DB_STATE_KEY,
      value: store,
      updatedAt: new Date().toISOString(),
    });
    transaction.oncomplete = resolve;
    transaction.onerror = resolve;
  });
}

function openDatabase() {
  if (!globalThis.indexedDB) return Promise.resolve(null);

  return new Promise((resolve) => {
    const request = globalThis.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(DB_STORE)) {
        database.createObjectStore(DB_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

function loadJsdom() {
  const moduleDir = process.env.JSDOM_NODE_MODULES;
  if (!moduleDir) {
    throw new Error(
      "Set JSDOM_NODE_MODULES to a node_modules directory containing jsdom.",
    );
  }

  return require(path.join(moduleDir, "jsdom"));
}

async function createDom() {
  const { JSDOM, VirtualConsole } = loadJsdom();
  const root = path.resolve(__dirname, "..");
  const html = fs
    .readFileSync(path.join(root, "index.html"), "utf8")
    .replace(/<link[^>]+href="style\.css\?v=20260604-product-groups"[^>]*>/, "")
    .replace(
      /<script[\s\S]*?src="scripts\/app\.bundle\.js\?v=20260604-product-groups"[\s\S]*?<\/script>/,
      "",
    );
  const errors = [];
  const virtualConsole = new VirtualConsole();

  virtualConsole.on("error", (message) => errors.push(String(message)));
  virtualConsole.on("jsdomError", (error) => errors.push(error.message));

  const dom = new JSDOM(html, {
    resources: "usable",
    runScripts: "dangerously",
    url: "http://127.0.0.1:8000/",
    virtualConsole,
  });

  dom.window.scrollTo = () => {};
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};

  await new Promise((resolve) => {
    dom.window.addEventListener("load", resolve, { once: true });
    setTimeout(resolve, 1000);
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  global.scrollTo = dom.window.scrollTo;

  const appUrl =
    pathToFileURL(path.join(root, "scripts", "app.js")).href +
    `?test=${Date.now()}`;
  await import(appUrl);
  await dom.window.__beautyAppReady;

  return { dom, errors };
}

function createMemoryStorage() {
  const values = new Map();

  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
  };
}

function createMemoryIndexedDb() {
  const databases = new Map();

  return {
    open(name) {
      const request = {};

      setTimeout(() => {
        if (!databases.has(name)) {
          databases.set(name, { stores: new Map() });
        }

        const databaseState = databases.get(name);
        const database = {
          objectStoreNames: {
            contains: (storeName) => databaseState.stores.has(storeName),
          },
          createObjectStore: (storeName) => {
            databaseState.stores.set(storeName, new Map());
          },
          transaction: (storeName) => {
            const store = databaseState.stores.get(storeName);
            const transaction = {
              objectStore() {
                return {
                  get(key) {
                    const getRequest = {};
                    setTimeout(() => {
                      getRequest.result = store.get(key);
                      getRequest.onsuccess?.();
                    });
                    return getRequest;
                  },
                  put(value) {
                    store.set(value.id, value);
                  },
                };
              },
            };

            setTimeout(() => transaction.oncomplete?.());
            return transaction;
          },
        };

        request.result = database;
        if (!database.objectStoreNames.contains("app-state")) {
          request.onupgradeneeded?.();
        }
        request.onsuccess?.();
      });

      return request;
    },
  };
}

async function createFileDom() {
  const { JSDOM, VirtualConsole } = loadJsdom();
  const root = path.resolve(__dirname, "..");
  const indexPath = path.join(root, "index.html");
  const errors = [];
  const virtualConsole = new VirtualConsole();

  virtualConsole.on("error", (message) => errors.push(String(message)));
  virtualConsole.on("jsdomError", (error) => errors.push(error.message));

  const dom = await JSDOM.fromFile(indexPath, {
    resources: "usable",
    runScripts: "dangerously",
    url: pathToFileURL(indexPath).href,
    virtualConsole,
  });

  dom.window.scrollTo = () => {};
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};

  await waitFor(
    () => dom.window.document.querySelectorAll(".product-card").length === 10,
    "file URL should render product cards",
  );

  return { dom, errors };
}

async function waitFor(predicate, message) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 3000) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error(message);
}

function click(window, element) {
  element.dispatchEvent(
    new window.MouseEvent("click", { bubbles: true, cancelable: true }),
  );
}

function input(element, value) {
  element.value = value;
  element.dispatchEvent(
    new element.ownerDocument.defaultView.Event("input", {
      bubbles: true,
    }),
  );
}

(async () => {
  const root = path.resolve(__dirname, "..");
  const expectedFiles = [
    "scripts/app.js",
    "scripts/data/catalog.js",
    "scripts/data/demo-store.js",
    "scripts/ui/shop.js",
    "scripts/ui/auth.js",
    "scripts/ui/management.js",
    "scripts/utils/format.js",
    "scripts/app.bundle.js",
  ];

  for (const file of expectedFiles) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
  }

  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.doesNotMatch(html, /type="module"/);
  assert.match(
    html,
    /src="scripts\/app\.bundle\.js\?v=20260604-product-groups"/,
  );
  assert.match(html, /id="managementView"/);

  const { STORE_KEY, cloneDefaultStore, loadStore, saveStore } = await import(
    pathToFileURL(path.join(root, "scripts", "data", "demo-store.js")).href +
      `?domain=${Date.now()}`
  );
  const { completeBypassPayment } = await import(
    pathToFileURL(path.join(root, "scripts", "domain", "order-processing.js"))
      .href + `?domain=${Date.now()}`
  );
  const domainStore = cloneDefaultStore();
  const domainResult = completeBypassPayment({
    store: domainStore,
    payment: { memberId: "member-a", referralSourceType: "none" },
    cart: [
      {
        id: "device-led",
        name: "LED Skin Lifting Device",
        ko: "LED 스킨 리프팅 디바이스",
        sale: 76000,
        qty: 3,
        option: "1ea / Warm White",
      },
      {
        id: "cosmetic-serum",
        name: "Serum",
        ko: "세럼",
        sale: 30000,
        qty: 2,
        option: "1ea",
      },
    ],
  });
  assert.equal(
    domainResult.referralLinks.length,
    2,
    "referral links should be generated once per distinct product",
  );
  assert.deepEqual(
    domainResult.referralLinks.map((link) => link.productId).sort(),
    ["cosmetic-serum", "device-led"],
  );

  const originalIndexedDb = global.indexedDB;
  const originalLocalStorage = global.localStorage;
  global.indexedDB = createMemoryIndexedDb();
  global.localStorage = createMemoryStorage();

  const persistentStore = cloneDefaultStore();
  persistentStore.members.push({
    id: "member-db",
    userId: "persist01",
    passwordHash: "abc123",
    authProvider: "password",
    name: "DB유지",
    phone: "010-3333-4444",
    email: "persist@example.com",
    agencyId: "agency-hq",
    points: 0,
    status: "active",
    joinedAt: "2026-06-02",
    address: { postcode: "", address: "", addressDetail: "" },
  });
  await saveStore(persistentStore);
  global.localStorage.clear();

  const databaseBackedStore = await loadStore();
  assert.equal(
    databaseBackedStore.members.some((member) => member.userId === "persist01"),
    true,
    "store should load member data from IndexedDB after localStorage is cleared",
  );
  assert.match(
    global.localStorage.getItem(STORE_KEY),
    /persist01/,
    "IndexedDB load should mirror the latest store into localStorage backup",
  );

  if (originalIndexedDb === undefined) {
    delete global.indexedDB;
  } else {
    global.indexedDB = originalIndexedDb;
  }
  if (originalLocalStorage === undefined) {
    delete global.localStorage;
  } else {
    global.localStorage = originalLocalStorage;
  }

  const { dom, errors } = await createDom();
  const { document } = dom.window;

  assert.equal(
    document.querySelectorAll(".product-card").length,
    10,
    "shop should render 10 products",
  );
  assert.equal(
    document.querySelectorAll(".site-header [data-management-link]").length,
    0,
    "management links should not be in the global header",
  );
  assert.equal(
    document.querySelector("#loginLink").classList.contains("is-hidden"),
    false,
    "fresh session should show login link",
  );
  assert.equal(
    document.querySelector("#logoutButton").classList.contains("is-hidden"),
    true,
    "fresh session should hide logout",
  );

  click(
    dom.window,
    document.querySelector(".product-card[data-id='device-led']"),
  );
  click(dom.window, document.querySelector("#addCart"));
  assert.equal(
    document.querySelector("#bagButton").textContent,
    "0",
    "logged-out users should not be able to add products to cart",
  );
  assert.equal(
    document.querySelector("#authView").classList.contains("is-hidden"),
    false,
    "logged-out purchase attempt should open login view",
  );
  click(dom.window, document.querySelector("#authClose"));

  click(dom.window, document.querySelector("#loginLink"));
  assert.equal(
    document.querySelectorAll("#authView [data-management-link]").length,
    3,
    "management links should be inside the auth view",
  );
  let loginForm = document.querySelector('[data-auth-form="login"]');
  input(loginForm.querySelector('[name="userId"]'), "unknown_user");
  input(loginForm.querySelector('[name="password"]'), "whatever");
  click(dom.window, loginForm.querySelector('[type="submit"]'));
  assert.match(
    document.querySelector("[data-auth-error]").textContent,
    /아이디 또는 비밀번호/,
    "login should reject unknown credentials",
  );
  assert.equal(
    document.querySelector("#authView").classList.contains("is-hidden"),
    false,
    "auth modal should stay open after failed login",
  );
  click(dom.window, document.querySelector('[data-auth-mode="signup"]'));
  const signupForm = document.querySelector('[data-auth-form="signup"]');
  input(signupForm.querySelector('[name="userId"]'), "bad_id");
  input(signupForm.querySelector('[name="password"]'), "password123");
  click(dom.window, signupForm.querySelector('[type="submit"]'));
  assert.match(
    document.querySelector("[data-auth-error]").textContent,
    /영문 및 숫자/,
    "signup should reject non-alphanumeric user ids",
  );
  input(signupForm.querySelector('[name="userId"]'), "newbeauty01");
  input(signupForm.querySelector('[name="password"]'), "password");
  click(dom.window, signupForm.querySelector('[type="submit"]'));
  assert.match(
    document.querySelector("[data-auth-error]").textContent,
    /영문과 숫자/,
    "signup should require passwords with letters and numbers",
  );
  input(signupForm.querySelector('[name="userId"]'), "newbeauty01");
  input(signupForm.querySelector('[name="password"]'), "password123");
  input(signupForm.querySelector('[name="name"]'), "김신규");
  input(signupForm.querySelector('[name="phone"]'), "010-1111-2222");
  input(signupForm.querySelector('[name="email"]'), "new@example.com");
  input(signupForm.querySelector('[name="agencyCode"]'), "GNBEAUTY");
  click(dom.window, signupForm.querySelector('[type="submit"]'));
  assert.equal(
    document.querySelector("#authView").classList.contains("is-hidden"),
    true,
    "auth modal should close after signup",
  );
  assert.equal(
    document.querySelector("#sessionUser").textContent,
    "김신규님",
    "header should show logged-in member name after signup",
  );
  assert.equal(
    document.querySelector("#loginLink").classList.contains("is-hidden"),
    true,
    "login link should be hidden after login",
  );
  assert.equal(
    document.querySelector("#logoutButton").classList.contains("is-hidden"),
    false,
    "logout should be visible after login",
  );
  click(dom.window, document.querySelector("#sessionUser"));
  assert.match(
    document.querySelector("#authView").textContent,
    /내정보|구매이력|포인트 적립\/사용 이력/,
    "member name should open my information modal",
  );
  assert.ok(
    document.querySelector('[data-profile-form] [name="userId"]').readOnly,
    "profile user id should be read only",
  );
  assert.ok(
    document.querySelector("[data-password-form]"),
    "profile should include password change form",
  );
  assert.ok(
    document.querySelector('[data-profile-section="points"]'),
    "profile point summary should be clickable",
  );
  assert.ok(
    document.querySelector('[data-profile-section="orders"]'),
    "profile order summary should be clickable",
  );
  assert.ok(
    document.querySelector('[data-profile-section="links"]'),
    "profile referral summary should be clickable",
  );
  assert.equal(
    document.querySelector("[data-member-memo-form]"),
    null,
    "member profile should not expose internal memo",
  );
  const profileForm = document.querySelector("[data-profile-form]");
  input(profileForm.querySelector('[name="name"]'), "김수정");
  input(profileForm.querySelector('[name="phone"]'), "010-9999-0000");
  input(profileForm.querySelector('[name="postcode"]'), "04524");
  input(
    profileForm.querySelector('[name="address"]'),
    "서울시 중구 세종대로 110",
  );
  click(dom.window, profileForm.querySelector('[type="submit"]'));
  assert.equal(
    document.querySelector("#sessionUser").textContent,
    "김수정님",
    "saving profile should update the header member name",
  );
  const passwordForm = document.querySelector("[data-password-form]");
  input(
    passwordForm.querySelector('[name="currentPassword"]'),
    "wrong-password",
  );
  input(passwordForm.querySelector('[name="newPassword"]'), "newpass123");
  input(passwordForm.querySelector('[name="confirmPassword"]'), "newpass123");
  click(dom.window, passwordForm.querySelector('[type="submit"]'));
  assert.match(
    document.querySelector("[data-password-error]").textContent,
    /기존 비밀번호/,
    "password change should verify current password",
  );
  input(passwordForm.querySelector('[name="currentPassword"]'), "password123");
  input(passwordForm.querySelector('[name="newPassword"]'), "newpass123");
  input(passwordForm.querySelector('[name="confirmPassword"]'), "newpass123");
  click(dom.window, passwordForm.querySelector('[type="submit"]'));
  assert.equal(
    document.querySelector("[data-password-error]").textContent,
    "",
    "password change should clear error after success",
  );
  click(dom.window, document.querySelector('[data-profile-section="links"]'));
  assert.ok(
    document.querySelector('[data-profile-history="links"]'),
    "profile referral section should render",
  );
  click(dom.window, document.querySelector("#profileClose"));

  click(dom.window, document.querySelector("#logoutButton"));
  assert.equal(
    document.querySelector("#loginLink").classList.contains("is-hidden"),
    false,
    "logout should return to logged-out header state",
  );
  click(dom.window, document.querySelector("#loginLink"));
  loginForm = document.querySelector('[data-auth-form="login"]');
  input(loginForm.querySelector('[name="userId"]'), "newbeauty01");
  input(loginForm.querySelector('[name="password"]'), "wrong-password");
  click(dom.window, loginForm.querySelector('[type="submit"]'));
  assert.match(
    document.querySelector("[data-auth-error]").textContent,
    /아이디 또는 비밀번호/,
    "login should reject the wrong password for an existing member",
  );
  input(loginForm.querySelector('[name="password"]'), "password123");
  click(dom.window, loginForm.querySelector('[type="submit"]'));
  assert.match(
    document.querySelector("[data-auth-error]").textContent,
    /아이디 또는 비밀번호/,
    "login should reject the old password after password change",
  );
  input(loginForm.querySelector('[name="password"]'), "newpass123");
  click(dom.window, loginForm.querySelector('[type="submit"]'));
  assert.equal(
    document.querySelector("#authView").classList.contains("is-hidden"),
    true,
    "auth modal should close after valid credential login",
  );
  assert.equal(
    document.querySelector("#sessionUser").textContent,
    "김수정님",
    "valid login should restore the saved member profile",
  );

  click(dom.window, document.querySelector("#addCart"));
  assert.match(
    document.querySelector("#cartSummary").textContent,
    /적립 예정\s*3,800P/,
    "cart summary should preview purchase points using the configured rate",
  );
  click(dom.window, document.querySelector("#bagButton"));
  click(dom.window, document.querySelector("#checkoutButton"));
  assert.ok(
    document.querySelector("#checkoutLedDetail"),
    "LED checkout detail should still render",
  );
  assert.match(
    document.querySelector("#detailView").textContent,
    /적립 예정\s*3,800P/,
    "checkout summary should preview purchase points using the configured rate",
  );
  click(dom.window, document.querySelector("#finalPay"));
  assert.ok(
    document.querySelector("#paymentResult"),
    "payment bypass should render completion result",
  );
  assert.match(
    document.querySelector("#paymentResult").textContent,
    /적립 포인트\s*3,800P/,
    "payment result should show purchase points",
  );
  assert.match(
    document.querySelector("#paymentResult").textContent,
    /구매 상품 종류 기준/,
    "payment result should explain product-level referral links",
  );
  assert.ok(
    document.querySelector("#paymentResult [data-copy-referral]"),
    "payment result should expose referral link copy buttons",
  );

  click(dom.window, document.querySelector('[data-management-link="admin"]'));
  assert.doesNotMatch(
    document.querySelector("#managementView").textContent,
    /상세 리스트 보기/,
    "admin dashboard cards should not show detail helper text",
  );
  assert.match(
    document.querySelector("#managementView").textContent,
    /상품 수\s*10|이달의 주문|76,000원|이달의 적립금|3,800P/,
    "admin dashboard should show monthly order and point totals",
  );
  const settingsForm = document.querySelector("[data-admin-settings-form]");
  input(settingsForm.querySelector('[name="purchasePointRate"]'), "7");
  input(settingsForm.querySelector('[name="maxPointUseRate"]'), "45");
  click(dom.window, settingsForm.querySelector('[type="submit"]'));
  assert.equal(
    JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1")).settings
      .purchasePointRate,
    7,
    "admin settings form should persist purchase point rate",
  );
  assert.equal(
    document.querySelector(
      '[data-admin-settings-form] [name="purchasePointRate"]',
    ).value,
    "7",
    "admin settings form should rerender with the saved value",
  );
  assert.equal(
    document.querySelector("#adminDetailModal").classList.contains("is-open"),
    false,
    "admin detail modal should start closed",
  );
  assert.equal(
    document.querySelector("#adminDetailModal").hidden,
    true,
    "admin detail modal should start hidden",
  );
  click(dom.window, document.querySelector('[data-admin-detail="orders"]'));
  assert.equal(
    document.querySelector("#adminDetailModal").classList.contains("is-open"),
    true,
    "admin detail modal should open after clicking a dashboard card",
  );
  assert.equal(
    document.querySelector("#adminDetailModal").hidden,
    false,
    "admin detail modal should become visible after clicking a dashboard card",
  );
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /이달의 주문 상세|강남 뷰티 대리점|누적 상품금액|76,000원/,
    "admin should show monthly agency sales totals",
  );
  click(
    dom.window,
    document.querySelector("#adminDetailModal [data-modal-close]"),
  );
  click(dom.window, document.querySelector('[data-admin-detail="points"]'));
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /이달의 포인트 상세|이달 적립포인트|3,800P|이달 사용포인트|0P/,
    "admin should show monthly earned and used point totals",
  );
  click(
    dom.window,
    document.querySelector("#adminDetailModal [data-modal-close]"),
  );
  assert.equal(
    document.querySelector("#adminDetailModal").classList.contains("is-open"),
    false,
    "admin detail modal should close",
  );
  assert.equal(
    document.querySelector("#adminDetailModal").hidden,
    true,
    "admin detail modal should be hidden after close",
  );
  click(dom.window, document.querySelector('[data-admin-detail="members"]'));
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /회원 상세 리스트|홍길동|내부 대리점/,
    "admin member card should show member detail list",
  );
  click(
    dom.window,
    document.querySelector(
      '#adminModalContent [data-member-detail="member-a"]',
    ),
  );
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /Admin member|beauty01|배송지|구매이력|포인트 적립\/사용 이력/,
    "admin member name should open member detail view",
  );
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /내부 대리점|강남 뷰티 대리점/,
    "admin member detail should include internal agency ownership",
  );
  const adminMemoForm = document.querySelector("[data-member-memo-form]");
  input(
    adminMemoForm.querySelector('[name="internalMemo"]'),
    "관리자 확인 메모",
  );
  click(dom.window, adminMemoForm.querySelector('[type="submit"]'));
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /관리자 확인 메모/,
    "admin should be able to save member memo",
  );
  click(dom.window, document.querySelector("[data-member-detail-back]"));
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /회원 상세 리스트|홍길동/,
    "member detail back should return to admin member list",
  );
  click(
    dom.window,
    document.querySelector("#adminDetailModal [data-modal-close]"),
  );
  click(dom.window, document.querySelector('[data-admin-detail="products"]'));
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /상품관리|기본 정보|이미지 등록|가격 \/ 판매 \/ 재고|배송 \/ 정책 \/ 공급|옵션 \/ SKU|Daily Tone Up Sunscreen/,
    "admin product card should show grouped product management form and list",
  );
  assert.ok(
    document.querySelector("[data-product-image-preview]"),
    "product management should include image preview",
  );
  assert.ok(
    document.querySelector("[data-product-image-file]"),
    "product management should include local image registration control",
  );
  assert.equal(
    document.querySelectorAll("[data-product-category-filter]").length,
    4,
    "product management should expose all/category filters",
  );
  click(
    dom.window,
    document.querySelector('[data-product-category-filter="화장품"]'),
  );
  assert.equal(
    document
      .querySelector('[data-product-category-card="미용기구"]')
      .classList.contains("is-filtered-out"),
    true,
    "category filter should hide products from other categories",
  );
  assert.equal(
    document
      .querySelector('[data-product-category-card="화장품"]')
      .classList.contains("is-filtered-out"),
    false,
    "category filter should keep matching category products visible",
  );
  click(
    dom.window,
    document.querySelector('[data-product-category-filter="all"]'),
  );
  click(dom.window, document.querySelector("[data-product-image-sample]"));
  assert.match(
    document.querySelector('[data-product-form] [name="image"]').value,
    /^https:\/\/images\.unsplash\.com\//,
    "sample image button should populate the image field",
  );
  click(dom.window, document.querySelector('[data-product-edit="cos-sun"]'));
  const productForm = document.querySelector("[data-product-form]");
  input(productForm.querySelector('[name="sale"]'), "24000");
  input(productForm.querySelector('[name="stock"]'), "33");
  input(
    productForm.querySelector('[name="variants"]'),
    "50ml / SPF50+ PA++++ | COS-SUN-STD | 33 | 0 | selling",
  );
  click(dom.window, productForm.querySelector("[data-product-submit]"));
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /데일리 톤업 선스크린|24,000원|33개/,
    "admin should update product price and stock",
  );
  assert.equal(
    JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1")).products.find(
      (product) => product.id === "cos-sun",
    ).sale,
    24000,
    "product management should persist product sale price",
  );
  click(
    dom.window,
    document.querySelector('[data-product-visibility="cos-sun"]'),
  );
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /숨김 상품\s*1|데일리 톤업 선스크린|hidden \/ selling|노출/,
    "admin should keep hidden products manageable in the product list",
  );
  assert.equal(
    JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1")).products.find(
      (product) => product.id === "cos-sun",
    ).displayStatus,
    "hidden",
    "product visibility toggle should persist hidden status",
  );
  click(
    dom.window,
    document.querySelector('[data-product-visibility="cos-sun"]'),
  );
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /숨김 상품\s*0|displayed \/ selling|숨김/,
    "admin should restore hidden products to displayed status",
  );
  click(
    dom.window,
    document.querySelector("#adminDetailModal [data-modal-close]"),
  );
  click(dom.window, document.querySelector("#logoHome"));
  assert.match(
    document.querySelector(".product-card[data-id='cos-sun']").textContent,
    /할인판매가 :\s*24,000원/,
    "shop product card should render updated admin product data",
  );
  click(dom.window, document.querySelector('[data-admin-detail="agencies"]'));
  const agencyForm = document.querySelector("[data-agency-form]");
  input(agencyForm.querySelector('[name="name"]'), "부산 뷰티 대리점");
  assert.equal(
    agencyForm.querySelector('[name="code"]').value,
    "BUSANBYUTI",
    "agency code should be generated from the agency name",
  );
  assert.equal(
    agencyForm.querySelector('[name="linkSlug"]').value,
    "busan-byuti",
    "agency link slug should be generated from the agency name",
  );
  input(agencyForm.querySelector('[name="code"]'), "BUSANBEAUTY");
  input(agencyForm.querySelector('[name="linkSlug"]'), "busan-beauty");
  input(agencyForm.querySelector('[name="commissionRate"]'), "15");
  click(dom.window, agencyForm.querySelector("[data-agency-submit]"));
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /부산 뷰티 대리점|BUSANBEAUTY|15%/,
    "admin should create a new agency",
  );
  assert.ok(
    document.querySelector(".agency-table-row"),
    "agency list should render compact table rows",
  );
  assert.match(
    document.querySelector("#managementView").textContent,
    /대리점 수\s*3/,
    "admin dashboard should refresh agency count after create",
  );
  click(
    dom.window,
    document.querySelector('[data-agency-edit^="agency-busan-beauty"]'),
  );
  const editForm = document.querySelector("[data-agency-form]");
  input(editForm.querySelector('[name="name"]'), "부산 프리미엄 대리점");
  input(editForm.querySelector('[name="commissionRate"]'), "18");
  click(dom.window, editForm.querySelector("[data-agency-submit]"));
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /부산 프리미엄 대리점|18%/,
    "admin should update an agency",
  );
  click(
    dom.window,
    document.querySelector('[data-agency-delete^="agency-busan-beauty"]'),
  );
  assert.doesNotMatch(
    document.querySelector("#adminModalContent").textContent,
    /부산 프리미엄 대리점/,
    "admin should delete an agency",
  );
  assert.match(
    document.querySelector("#managementView").textContent,
    /대리점 수\s*2/,
    "admin dashboard should refresh agency count after delete",
  );
  click(
    dom.window,
    document.querySelector('[data-admin-detail="settlements"]'),
  );
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /대리점 정산 대기 상세 리스트|지급 예정/,
    "admin settlement card should show settlement detail list",
  );
  click(dom.window, document.querySelector('[data-management-link="agency"]'));
  assert.match(
    document.querySelector("#managementView").textContent,
    /영업비 예정|Settlement queue|18,240원/,
    "agency should show settlement queue after bypass payment",
  );
  assert.equal(
    document.querySelectorAll("[data-agency-detail]").length,
    7,
    "agency dashboard cards should be clickable",
  );
  click(dom.window, document.querySelector('[data-agency-detail="members"]'));
  assert.equal(
    document.querySelector("#agencyDetailModal").classList.contains("is-open"),
    true,
    "agency detail modal should open after clicking a dashboard card",
  );
  assert.match(
    document.querySelector("#agencyModalContent").textContent,
    /소속 고객 상세|홍길동/,
    "agency member card should show customer detail modal",
  );
  click(
    dom.window,
    document.querySelector(
      '#agencyModalContent [data-member-detail="member-a"]',
    ),
  );
  assert.match(
    document.querySelector("#agencyModalContent").textContent,
    /Agency member|beauty01|배송지|구매이력|포인트 적립\/사용 이력/,
    "agency member name should open member detail view",
  );
  assert.doesNotMatch(
    document.querySelector("#agencyModalContent").textContent,
    /내부 대리점/,
    "agency member detail should not expose internal ownership label",
  );
  const agencyMemoForm = document.querySelector("[data-member-memo-form]");
  assert.match(
    agencyMemoForm.querySelector('[name="internalMemo"]').value,
    /관리자 확인 메모/,
    "agency should see saved internal memo",
  );
  input(
    agencyMemoForm.querySelector('[name="internalMemo"]'),
    "대리점 상담 메모",
  );
  click(dom.window, agencyMemoForm.querySelector('[type="submit"]'));
  assert.match(
    document.querySelector("#agencyModalContent").textContent,
    /대리점 상담 메모/,
    "agency should be able to update member memo",
  );
  click(dom.window, document.querySelector("[data-member-detail-back]"));
  assert.match(
    document.querySelector("#agencyModalContent").textContent,
    /소속 고객 상세|홍길동/,
    "member detail back should return to agency customer list",
  );
  click(
    dom.window,
    document.querySelector("#agencyDetailModal [data-modal-close]"),
  );
  assert.equal(
    document.querySelector("#agencyDetailModal").hidden,
    true,
    "agency detail modal should close",
  );
  click(
    dom.window,
    document.querySelector('[data-agency-detail="commission"]'),
  );
  assert.match(
    document.querySelector("#agencyModalContent").textContent,
    /영업비 예정 상세|지급 예정/,
    "agency commission card should show settlement detail modal",
  );
  click(dom.window, document.querySelector('[data-management-link="member"]'));
  assert.match(
    document.querySelector("#managementView").textContent,
    /3,800P|Point history/,
    "member should show updated points after payment",
  );
  click(dom.window, document.querySelector('[data-management-link="agency"]'));
  click(dom.window, document.querySelector('[data-agency-detail="link"]'));
  click(
    dom.window,
    document.querySelector("#agencyModalContent [data-agency-join-link]"),
  );
  assert.equal(
    document.querySelector('[data-auth-form="signup"] [name="agencyCode"]')
      .value,
    "GNBEAUTY",
    "agency join link should open signup with agency code prefilled",
  );

  assert.deepEqual(errors, []);

  const { dom: fileDom, errors: fileErrors } = await createFileDom();
  assert.equal(
    fileDom.window.document.querySelectorAll(".product-card").length,
    10,
    "file URL should render 10 products with the bundled script",
  );
  assert.deepEqual(fileErrors, []);

  console.log("Stage 1 management foundation test passed");
})();

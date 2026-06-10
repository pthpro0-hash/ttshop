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
      /<script[\s\S]*?src="scripts\/app\.bundle\.js\?v=20260607-shipping-tracking"[\s\S]*?<\/script>/,
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

function submitManagementLogin(window, role, userId, password) {
  let link = document.querySelector(`[data-management-link="${role}"]`);
  if (!link) {
    click(window, document.querySelector("#loginLink"));
    link = document.querySelector(`[data-management-link="${role}"]`);
  }
  click(window, link);
  const form = document.querySelector(`[data-management-login="${role}"]`);
  if (role === "admin") {
    assert.equal(
      form.querySelector('[name="userId"]').value,
      "adminChang",
      "admin login should prefill the development admin id",
    );
    assert.equal(
      form.querySelector('[name="password"]').value,
      "Chang$0909",
      "admin login should prefill the development admin password",
    );
  }
  input(form.querySelector('[name="userId"]'), userId);
  input(form.querySelector('[name="password"]'), password);
  click(window, form.querySelector('[type="submit"]'));
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
    /src="scripts\/app\.bundle\.js\?v=20260607-shipping-tracking"/,
  );
  assert.match(html, /id="managementView"/);

  const { STORE_KEY, cloneDefaultStore, loadStore, saveStore } = await import(
    pathToFileURL(path.join(root, "scripts", "data", "demo-store.js")).href +
      `?domain=${Date.now()}`
  );
  const { autoConfirmEligibleOrders, completeBypassPayment } = await import(
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
  assert.equal(
    domainStore.pointLedger[0].type,
    "purchase_pending",
    "domain checkout should keep purchase points pending before confirmation",
  );
  domainResult.order.paidAt = "2026-05-20";
  assert.equal(
    autoConfirmEligibleOrders(domainStore, new Date("2026-06-04T00:00:00")),
    true,
    "orders should auto-confirm 14 days after purchase date",
  );
  assert.equal(domainResult.order.status, "completed");
  assert.ok(domainResult.order.confirmedAt);
  assert.equal(
    domainStore.pointLedger.find(
      (point) => point.orderId === domainResult.order.id,
    ).type,
    "purchase_earn",
    "auto confirmation should convert pending points to earned points",
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
  assert.ok(
    document.querySelector(".product-detail-image-stack"),
    "product detail page should render detail images below customer review area",
  );
  assert.ok(
    document.querySelector(".product-review-list"),
    "product detail page should render expandable review detail list",
  );
  assert.match(
    document.querySelector(".review-strip").textContent,
    /Customer review|상세 리뷰 보기/,
    "product detail page should show review summary and detail button",
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
    2,
    "only admin and agency links should be inside the auth view",
  );
  assert.equal(
    document.querySelector('#authView [data-management-link="member"]'),
    null,
    "login footer should not expose the old member management shortcut",
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
  click(dom.window, signupForm.querySelector("[data-address-search]"));
  click(dom.window, signupForm.querySelector("[data-address-result]"));
  assert.equal(
    signupForm.querySelector('[name="postcode"]').value,
    "06236",
    "signup address lookup should fill postcode",
  );
  assert.match(
    signupForm.querySelector('[name="address"]').value,
    /테헤란로/,
    "signup address lookup should fill address",
  );
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
  assert.equal(
    document
      .querySelector('[data-profile-panel="orders"]')
      .classList.contains("is-hidden"),
    false,
    "member profile should open purchase history first",
  );
  click(dom.window, document.querySelector('[data-profile-tab="account"]'));
  assert.ok(
    document.querySelector('[data-profile-form] [name="userId"]').readOnly,
    "profile user id should be read only",
  );
  assert.ok(
    document.querySelector("[data-password-form]"),
    "profile should include password change form",
  );
  assert.ok(
    document.querySelector(".profile-top-nav"),
    "profile should use a top tab menu",
  );
  assert.ok(
    document.querySelector(".profile-wallet-overview"),
    "profile should show a customer friendly wallet overview",
  );
  assert.equal(
    document.querySelectorAll(".profile-field-card").length,
    5,
    "profile account tab should group fields into service-style cards",
  );
  assert.ok(
    document.querySelector(".profile-field-split"),
    "profile account tab should split address list and extra address form",
  );
  assert.ok(
    document.querySelector(".profile-preference-grid"),
    "profile account tab should group shopping preferences separately",
  );
  assert.equal(
    document.querySelector(".profile-side-nav"),
    null,
    "profile should not render the old duplicated side menu",
  );
  assert.equal(
    document.querySelectorAll(".profile-top-nav [data-profile-tab]").length,
    5,
    "profile top menu should expose the five member sections",
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
  assert.doesNotMatch(
    document.querySelector("#authView").textContent,
    /강남 뷰티 대리점|내부 대리점|영업비|정산/,
    "member profile should not expose internal agency or settlement data",
  );
  const profileForm = document.querySelector("[data-profile-form]");
  click(
    dom.window,
    profileForm.querySelector('[data-address-prefix="extraAddress"]'),
  );
  click(
    dom.window,
    profileForm.querySelector(
      '[data-address-result][data-address-prefix="extraAddress"]',
    ),
  );
  assert.equal(
    profileForm.querySelector('[name="extraAddressPostcode"]').value,
    "06236",
    "profile extra address lookup should fill postcode",
  );
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
    /상세 안내|결제 전 상품별 상세 이미지/,
    "checkout page should render product detail guide content",
  );
  assert.match(
    document.querySelector("#detailView").textContent,
    /적립 예정\s*3,800P/,
    "checkout summary should preview purchase points using the configured rate",
  );
  click(dom.window, document.querySelector("[data-checkout-address-search]"));
  click(dom.window, document.querySelector("[data-checkout-address-result]"));
  assert.equal(
    document.querySelector("#zipCode").value,
    "06236",
    "checkout address lookup should fill postcode",
  );
  input(document.querySelector("#addressDetail"), "테스트 101호");
  click(dom.window, document.querySelector("#finalPay"));
  assert.ok(
    document.querySelector("#paymentResult"),
    "payment bypass should render completion result",
  );
  assert.match(
    document.querySelector("#paymentResult").textContent,
    /적립 예정 포인트\s*3,800P/,
    "payment result should show pending purchase points",
  );
  assert.match(
    document.querySelector("#paymentResult").textContent,
    /구매 상품 종류 기준/,
    "payment result should explain product-level referral links",
  );
  assert.doesNotMatch(
    document.querySelector("#paymentResult").textContent,
    /대리점|영업비|정산|Admin|Agency/,
    "member payment result should not expose agency or settlement data",
  );
  assert.ok(
    document.querySelector("#paymentResult [data-copy-referral]"),
    "payment result should expose referral link copy buttons",
  );
  const latestOrder = JSON.parse(
    localStorage.getItem("beauty-ref-demo-store-v1"),
  ).orders[0];
  assert.equal(
    latestOrder.shippingAddress.addressDetail,
    "테스트 101호",
    "payment should persist checkout shipping detail",
  );
  assert.equal(
    latestOrder.confirmedAt,
    "",
    "newly paid order should wait for purchase confirmation",
  );
  assert.equal(
    JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1")).pointLedger[0]
      .type,
    "purchase_pending",
    "checkout should create pending point ledger before confirmation",
  );
  click(dom.window, document.querySelector("#sessionUser"));
  click(dom.window, document.querySelector('[data-profile-section="orders"]'));
  click(dom.window, document.querySelector("[data-profile-order-detail]"));
  assert.match(
    document.querySelector("#profileOrderDetail").textContent,
    /적립 예정|구매확정/,
    "member order detail should show pending point and confirm button",
  );
  click(dom.window, document.querySelector("[data-confirm-order]"));
  const confirmedStore = JSON.parse(
    localStorage.getItem("beauty-ref-demo-store-v1"),
  );
  assert.ok(
    confirmedStore.orders[0].confirmedAt,
    "purchase confirmation should set confirmed date",
  );
  assert.equal(
    confirmedStore.pointLedger.find((point) => point.orderId === latestOrder.id)
      .type,
    "purchase_earn",
    "purchase confirmation should convert pending points into earned points",
  );
  assert.match(
    document.querySelector("#profileOrderDetail").textContent,
    /Product review|리뷰 등록/,
    "purchase confirmation should open the review writer in order detail",
  );
  const reviewForm = document.querySelector("[data-review-form]");
  assert.ok(reviewForm, "confirmed order detail should expose review form");
  input(reviewForm.querySelector('[name="rating"]'), "5");
  input(reviewForm.querySelector('[name="title"]'), "테스트 리뷰");
  input(
    reviewForm.querySelector('[name="content"]'),
    "구매확정 후 작성한 리뷰입니다.",
  );
  click(dom.window, reviewForm.querySelector('[type="submit"]'));
  await waitFor(
    () =>
      JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1"))
        .productReviews?.[0]?.title === "테스트 리뷰",
    "review should be stored after submit",
  );
  const reviewStore = JSON.parse(
    localStorage.getItem("beauty-ref-demo-store-v1"),
  );
  assert.equal(
    reviewStore.productReviews[0].title,
    "테스트 리뷰",
    "confirmed member should be able to save a product review",
  );
  click(dom.window, document.querySelector("#logoHome"));
  click(
    dom.window,
    document.querySelector(
      `.product-card[data-id="${latestOrder.items[0].productId}"]`,
    ),
  );
  assert.match(
    document.querySelector(".review-strip").textContent,
    /테스트 리뷰|상세 리뷰 보기/,
    "saved product review should appear on the product detail summary",
  );

  submitManagementLogin(dom.window, "admin", "adminChang", "Chang$0909");
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
  click(dom.window, document.querySelector("#logoHome"));
  assert.equal(
    document.querySelector("#homeView").classList.contains("is-hidden"),
    false,
    "admin can leave the management view for the shop screen",
  );
  click(dom.window, document.querySelector("#sessionUser"));
  assert.equal(
    document.querySelector("#managementView").classList.contains("is-hidden"),
    false,
    "clicking admin name should reopen the admin dashboard instead of member profile",
  );
  assert.match(
    document.querySelector("#managementView").textContent,
    /Admin Control|Admin settings/,
    "admin name click should route back to admin management",
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
    /일자별 주문 \/ 송장 관리|강남 뷰티 대리점|누적 상품금액|76,000원|상태 소팅|송장 미등록|결제일별 송장 관리/,
    "admin should show monthly agency sales totals and daily shipment controls",
  );
  click(
    dom.window,
    document.querySelector('[data-admin-shipment-filter="missing_tracking"]'),
  );
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /송장 미등록|결제일|2026-/,
    "admin shipment controls should support missing tracking filtering by paid date",
  );
  const shipmentForm = document.querySelector("[data-shipment-form]");
  input(shipmentForm.querySelector('[name="shippingStatus"]'), "shipping");
  input(shipmentForm.querySelector('[name="courier"]'), "CJ대한통운");
  input(shipmentForm.querySelector('[name="trackingNumber"]'), "1234567890");
  click(dom.window, shipmentForm.querySelector('[type="submit"]'));
  assert.equal(
    JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1")).orders[0]
      .trackingNumber,
    "1234567890",
    "admin shipment form should persist tracking number",
  );
  assert.equal(
    JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1")).orders[0]
      .shippingStatus,
    "shipping",
    "admin shipment form should persist shipping status",
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
  const memberShipmentForm = document.querySelector(
    '[data-shipment-member="member-a"]',
  );
  assert.ok(
    memberShipmentForm,
    "admin member detail should expose shipment update controls",
  );
  input(
    memberShipmentForm.querySelector('[name="shippingStatus"]'),
    "shipping",
  );
  input(memberShipmentForm.querySelector('[name="courier"]'), "");
  input(memberShipmentForm.querySelector('[name="trackingNumber"]'), "");
  click(dom.window, memberShipmentForm.querySelector('[type="submit"]'));
  assert.match(
    memberShipmentForm.querySelector("[data-shipment-message]").textContent,
    /택배사와 송장번호/,
    "shipment update should require courier and tracking for shipping status",
  );
  input(memberShipmentForm.querySelector('[name="courier"]'), "롯데택배");
  input(memberShipmentForm.querySelector('[name="trackingNumber"]'), "5551234");
  click(dom.window, memberShipmentForm.querySelector('[type="submit"]'));
  assert.equal(
    JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1")).orders.find(
      (order) => order.id === "order-001",
    ).trackingNumber,
    "5551234",
    "admin member detail shipment form should persist tracking number",
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
    /상품관리|필수 등록 정보|기본 정보|이미지 등록|가격 \/ 판매 \/ 재고|배송 \/ 정책 \/ 공급|옵션 \/ SKU|Daily Tone Up Sunscreen/,
    "admin product card should show grouped product management form and list",
  );
  assert.ok(
    document.querySelector(".product-required-group"),
    "product management should visually separate the minimum required fields",
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
    document.querySelectorAll("[data-product-detail-image-input]").length,
    5,
    "product management should expose five detail image slots",
  );
  assert.equal(
    document.querySelectorAll("[data-product-detail-image-file]").length,
    5,
    "product management should expose five local detail image controls",
  );
  assert.equal(
    document.querySelectorAll("[data-product-category-filter]").length,
    4,
    "product management should expose all/category filters",
  );
  assert.ok(
    document.querySelector("[data-product-list-search]"),
    "product management should expose product search",
  );
  assert.ok(
    document.querySelector("[data-product-status-filter]"),
    "product management should expose status filters",
  );
  assert.ok(
    document.querySelector("[data-product-sort]"),
    "product management should expose product sorting",
  );
  input(document.querySelector("[data-product-list-search]"), "sunscreen");
  assert.equal(
    document
      .querySelector('[data-product-category-card="미용기구"]')
      .classList.contains("is-filtered-out"),
    true,
    "product search should hide non-matching products",
  );
  input(document.querySelector("[data-product-list-search]"), "");
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
  click(dom.window, document.querySelector("[data-product-image-clear]"));
  assert.equal(
    document.querySelector('[data-product-form] [name="image"]').value,
    "",
    "representative image clear should empty the image field",
  );
  let productForm = document.querySelector("[data-product-form]");
  click(dom.window, productForm.querySelector("[data-product-reset]"));
  click(dom.window, productForm.querySelector("[data-product-defaults]"));
  assert.equal(
    productForm.querySelector('[name="manufacturer"]').value,
    "BEAUTY REF.",
    "product defaults should fill the manufacturer field",
  );
  assert.equal(
    productForm.querySelector('[name="supplier"]').value,
    "본사 물류",
    "product defaults should fill the supplier field",
  );
  assert.equal(
    productForm.querySelector('[name="origin"]').value,
    "Korea",
    "product defaults should fill the origin field",
  );
  assert.equal(
    productForm.querySelector('[name="shippingFee"]').value,
    "3000",
    "product defaults should fill the default shipping fee",
  );
  click(dom.window, productForm.querySelector("[data-product-submit]"));
  assert.match(
    document.querySelector("[data-product-form-message]").textContent,
    /필수/,
    "product form should show a visible validation message for missing required fields",
  );
  input(productForm.querySelector('[name="ko"]'), "신규 코스메틱 미스트");
  input(productForm.querySelector('[name="category"]'), "화장품");
  input(productForm.querySelector('[name="type"]'), "Mist");
  input(productForm.querySelector('[name="badge"]'), "New");
  input(productForm.querySelector('[name="price"]'), "21000");
  input(productForm.querySelector('[name="sale"]'), "17000");
  input(productForm.querySelector('[name="stock"]'), "0");
  input(productForm.querySelector('[name="short"]'), "테스트 신규 화장품");
  input(
    productForm.querySelector('[name="desc"]'),
    "관리자가 등록한 신규 화장품입니다.",
  );
  input(productForm.querySelector('[name="option"]'), "100ml");
  click(dom.window, productForm.querySelector("[data-product-submit]"));
  assert.match(
    document.querySelector("[data-product-form-message]").textContent,
    /재고를 1개 이상/,
    "selling product registration should require positive stock",
  );
  input(productForm.querySelector('[name="stock"]'), "44");
  input(productForm.querySelector('[name="sku"]'), "COS-SUN");
  click(dom.window, productForm.querySelector("[data-product-submit]"));
  assert.match(
    document.querySelector("[data-product-form-message]").textContent,
    /이미 사용 중인 SKU/,
    "product registration should reject an existing product SKU",
  );
  input(productForm.querySelector('[name="sku"]'), "COS-MIST-NEW");
  click(dom.window, productForm.querySelector("[data-product-submit]"));
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /신규 코스메틱 미스트|화장품/,
    "admin should show newly registered cosmetic products",
  );
  assert.equal(
    JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1")).products.some(
      (product) =>
        product.ko === "신규 코스메틱 미스트" &&
        product.sku === "COS-MIST-NEW" &&
        product.category === "화장품" &&
        product.displayStatus === "displayed" &&
        product.manufacturer === "BEAUTY REF." &&
        product.supplier === "본사 물류",
    ),
    true,
    "new cosmetic product should persist with defaults in the store",
  );
  click(dom.window, document.querySelector('[data-product-edit="cos-sun"]'));
  productForm = document.querySelector("[data-product-form]");
  input(productForm.querySelector('[name="sale"]'), "24000");
  input(productForm.querySelector('[name="stock"]'), "33");
  input(
    productForm.querySelector('[name="detailImage1"]'),
    "https://example.com/cos-sun-detail-1.jpg",
  );
  input(
    productForm.querySelector('[name="detailImage2"]'),
    "https://example.com/cos-sun-detail-2.jpg",
  );
  assert.ok(
    productForm.querySelector("[data-variant-editor]"),
    "product management should expose option SKU table editor",
  );
  click(dom.window, productForm.querySelector("[data-variant-add]"));
  const variantRows = productForm.querySelectorAll("[data-variant-row]");
  input(
    variantRows[0].querySelector("[data-variant-option]"),
    "50ml / SPF50+ PA++++",
  );
  input(variantRows[0].querySelector("[data-variant-sku]"), "COS-SUN-STD");
  input(variantRows[0].querySelector("[data-variant-stock]"), "33");
  input(variantRows[0].querySelector("[data-variant-price-delta]"), "0");
  input(variantRows[1].querySelector("[data-variant-option]"), "100ml 대용량");
  input(variantRows[1].querySelector("[data-variant-sku]"), "COS-SUN-STD");
  input(variantRows[1].querySelector("[data-variant-stock]"), "12");
  input(variantRows[1].querySelector("[data-variant-price-delta]"), "5000");
  input(variantRows[1].querySelector("[data-variant-status]"), "selling");
  click(dom.window, productForm.querySelector("[data-product-submit]"));
  assert.match(
    document.querySelector("[data-product-form-message]").textContent,
    /SKU가 중복되었습니다/,
    "product management should reject duplicated option SKU values inside one product",
  );
  input(variantRows[1].querySelector("[data-variant-sku]"), "COS-SUN-LARGE");
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
  assert.equal(
    JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1")).products.find(
      (product) => product.id === "cos-sun",
    ).variants.length,
    2,
    "product management should persist table-based option SKU rows",
  );
  assert.deepEqual(
    JSON.parse(localStorage.getItem("beauty-ref-demo-store-v1")).products.find(
      (product) => product.id === "cos-sun",
    ).detailImages,
    [
      "https://example.com/cos-sun-detail-1.jpg",
      "https://example.com/cos-sun-detail-2.jpg",
    ],
    "product management should persist product detail images",
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
  click(dom.window, document.querySelector(".product-card[data-id='cos-sun']"));
  input(document.querySelector("#optionSelect"), "1");
  assert.match(
    document.querySelector("#stockStatus").value,
    /12개/,
    "product detail should show selected option SKU stock",
  );
  click(dom.window, document.querySelector("#addCart"));
  click(dom.window, document.querySelector("#bagButton"));
  assert.match(
    document.querySelector("#cartList").textContent,
    /100ml 대용량|29,000원/,
    "cart should keep selected option SKU and adjusted option price",
  );
  click(dom.window, document.querySelector("#cartClose"));
  click(dom.window, document.querySelector('[data-admin-detail="agencies"]'));
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /대리점 운영 현황|이달 매출|영업비 예정|총회원수/,
    "agency admin should show the agency list before the form",
  );
  assert.doesNotMatch(
    document.querySelector(".agency-admin-list").textContent,
    /GNBEAUTY|gangnam-beauty/,
    "agency list should hide agency codes and links",
  );
  click(dom.window, document.querySelector("[data-agency-create]"));
  const agencyForm = document.querySelector("[data-agency-form]");
  assert.equal(
    agencyForm.classList.contains("is-hidden"),
    false,
    "agency create form should open only after clicking the add button",
  );
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /필수 계약 정보|운영 정보|대리점명, 대리점 코드, 전용 링크, 영업비율/,
    "agency admin form should separate required and optional operating fields",
  );
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
  input(agencyForm.querySelector('[name="contractStart"]'), "2026-06-01");
  input(agencyForm.querySelector('[name="managerName"]'), "김담당");
  input(
    agencyForm.querySelector('[name="settlementAccount"]'),
    "테스트은행 123",
  );
  input(agencyForm.querySelector('[name="loginUserId"]'), "busan01");
  input(agencyForm.querySelector('[name="loginPassword"]'), "agency123");
  click(dom.window, agencyForm.querySelector("[data-agency-submit]"));
  assert.match(
    document.querySelector(".agency-admin-list").textContent,
    /부산 뷰티 대리점|0원|0명|15%|로그인 등록/,
    "admin should create a new agency and show list metrics",
  );
  assert.doesNotMatch(
    document.querySelector(".agency-admin-list").textContent,
    /BUSANBEAUTY|busan-beauty/,
    "agency code and link should stay out of the list row",
  );
  assert.ok(
    document.querySelector(".agency-table-row"),
    "agency list should render compact table rows",
  );
  click(
    dom.window,
    document.querySelector('[data-agency-admin-detail^="agency-busan-beauty"]'),
  );
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /부산 뷰티 대리점|대리점 코드|BUSANBEAUTY|전용 링크|busan-beauty|로그인 ID|busan01/,
    "agency detail should expose code, link, login and detailed metrics",
  );
  click(dom.window, document.querySelector("[data-agency-list-back]"));
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
    /대리점 정산 대기 상세 리스트|지급 예정|상태 변경|확정|지급완료/,
    "admin settlement card should show settlement status controls",
  );
  click(
    dom.window,
    document.querySelector(
      '#adminModalContent [data-settlement-status="agency-settlement-001"][data-status-value="confirmed"]',
    ),
  );
  assert.match(
    document.querySelector("#adminModalContent").textContent,
    /order-001|confirmed/,
    "admin should be able to confirm an agency settlement item",
  );
  click(dom.window, document.querySelector("#logoutButton"));
  assert.equal(
    document.querySelector("#homeView").classList.contains("is-hidden"),
    false,
    "admin logout should return to the main shop view",
  );
  submitManagementLogin(dom.window, "agency", "gangnam01", "agency123");
  assert.match(
    document.querySelector("#managementView").textContent,
    /정산매출 \/ 영업비|Settlement queue|링크 성과|18,240원/,
    "agency should show settlement queue after bypass payment",
  );
  assert.equal(
    document.querySelectorAll("[data-agency-detail]").length,
    7,
    "agency dashboard cards should be clickable",
  );
  click(
    dom.window,
    document.querySelector('[data-agency-detail="settlement"]'),
  );
  assert.match(
    document.querySelector("#agencyModalContent").textContent,
    /최근 6개월 정산매출 \/ 영업비|영업비|정산매출/,
    "agency settlement card should show recent six month sales and commission together",
  );
  assert.equal(
    document.querySelectorAll("#agencyModalContent [data-agency-month]").length,
    6,
    "agency sales summary should expose six clickable months",
  );
  const agencyMonthButton = document.querySelector(
    "#agencyModalContent [data-agency-month]",
  );
  const selectedAgencyMonth = agencyMonthButton.dataset.agencyMonth;
  click(dom.window, agencyMonthButton);
  assert.match(
    document.querySelector("#agencyModalContent").textContent,
    new RegExp(`${selectedAgencyMonth} 정산 상세|월별 주문|월별 정산 장부`),
    "agency month card should open month-specific settlement detail",
  );
  click(dom.window, document.querySelector("[data-agency-month-back]"));
  assert.match(
    document.querySelector("#agencyModalContent").textContent,
    /최근 6개월 정산매출 \/ 영업비/,
    "agency month detail back should return to the six month summary",
  );
  click(
    dom.window,
    document.querySelector('[data-agency-detail="performance"]'),
  );
  assert.match(
    document.querySelector("#agencyModalContent").textContent,
    /대리점 링크 성과|대리점 코드 귀속 회원|구매 전환 회원|정산 대상 주문/,
    "agency performance card should show link attribution metrics",
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
  assert.doesNotMatch(
    document.querySelector("#agencyModalContent").textContent,
    /상태 변경/,
    "agency settlement summary should not expose admin settlement controls",
  );
  click(dom.window, document.querySelector("#sessionUser"));
  assert.match(
    document.querySelector("#managementView").textContent,
    /Agency desk|강남 뷰티 대리점|정산매출/,
    "clicking agency manager name should reopen agency management instead of member profile",
  );
  submitManagementLogin(dom.window, "agency", "gangnam01", "agency123");
  click(dom.window, document.querySelector('[data-agency-detail="link"]'));
  assert.ok(
    document.querySelector("#agencyModalContent [data-copy-agency-link]"),
    "agency link detail should expose a copy button",
  );
  assert.match(
    document.querySelector("#agencyModalContent [data-copy-agency-link]")
      .dataset.copyAgencyLink,
    /^http:\/\/127\.0\.0\.1:8000\/\?agency=gangnam-beauty#signup$/,
    "agency copy button should keep a full http URL",
  );
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
  click(dom.window, document.querySelector("#authClose"));
  click(dom.window, document.querySelector("#logoutButton"));
  assert.equal(
    document.querySelector("#homeView").classList.contains("is-hidden"),
    false,
    "agency logout should return to the main shop view",
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

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
    .replace(
      /<script[\s\S]*?src="scripts\/app\.bundle\.js\?v=20260601-session-auth"[\s\S]*?<\/script>/,
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

  return { dom, errors };
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
  assert.match(html, /src="scripts\/app\.bundle\.js\?v=20260601-session-auth"/);
  assert.match(html, /id="managementView"/);

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
  click(dom.window, document.querySelector("#authBack"));

  click(dom.window, document.querySelector("#loginLink"));
  assert.equal(
    document.querySelectorAll("#authView [data-management-link]").length,
    3,
    "management links should be inside the auth view",
  );
  click(dom.window, document.querySelector('[data-auth-mode="signup"]'));
  const signupForm = document.querySelector('[data-auth-form="signup"]');
  input(signupForm.querySelector('[name="userId"]'), "new_beauty_member");
  input(signupForm.querySelector('[name="password"]'), "password123");
  input(signupForm.querySelector('[name="name"]'), "김신규");
  input(signupForm.querySelector('[name="phone"]'), "010-1111-2222");
  input(signupForm.querySelector('[name="email"]'), "new@example.com");
  input(signupForm.querySelector('[name="agencyCode"]'), "GNBEAUTY");
  click(dom.window, signupForm.querySelector('[type="submit"]'));
  assert.match(
    document.querySelector("#authView").textContent,
    /김신규님은 강남 뷰티 대리점 고객/,
    "signup should create and login a member under the agency code",
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
  click(dom.window, document.querySelector("#loginLink"));

  for (const [selector, expected] of [
    ['#authView [data-management-link="admin"]', "Admin Control"],
    ['#authView [data-management-link="agency"]', "Agency Desk"],
    ['#authView [data-management-link="member"]', "My Beauty"],
  ]) {
    click(dom.window, document.querySelector(selector));
    assert.match(
      document.querySelector("#managementView").textContent,
      new RegExp(expected),
    );
  }

  click(dom.window, document.querySelector("#loginLink"));
  click(
    dom.window,
    document.querySelector('#authView [data-management-link="member"]'),
  );
  const memberText = document.querySelector("#managementView").textContent;
  assert.doesNotMatch(
    memberText,
    /GNBEAUTY|강남 뷰티 대리점/,
    "member page must not expose agency ownership",
  );

  click(
    dom.window,
    document.querySelector(".product-card[data-id='device-led']"),
  );
  click(dom.window, document.querySelector("#addCart"));
  click(dom.window, document.querySelector("#bagButton"));
  click(dom.window, document.querySelector("#checkoutButton"));
  assert.ok(
    document.querySelector("#checkoutLedDetail"),
    "LED checkout detail should still render",
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

  click(dom.window, document.querySelector('[data-management-link="admin"]'));
  assert.doesNotMatch(
    document.querySelector("#managementView").textContent,
    /상세 리스트 보기/,
    "admin dashboard cards should not show detail helper text",
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
    /상품 실결제|포인트 적립|대리점 영업비/,
    "admin should show order processing ledger",
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
    document.querySelector("#adminDetailModal [data-modal-close]"),
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

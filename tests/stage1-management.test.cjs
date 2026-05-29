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
      /<script[\s\S]*?src="scripts\/app\.js\?v=20260529-admin-foundation"[\s\S]*?<\/script>/,
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

function click(window, element) {
  element.dispatchEvent(
    new window.MouseEvent("click", { bubbles: true, cancelable: true }),
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
  ];

  for (const file of expectedFiles) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
  }

  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /type="module"/);
  assert.match(html, /src="scripts\/app\.js\?v=20260529-admin-foundation"/);
  assert.match(html, /id="managementView"/);

  const { dom, errors } = await createDom();
  const { document } = dom.window;

  assert.equal(
    document.querySelectorAll(".product-card").length,
    10,
    "shop should render 10 products",
  );

  for (const [selector, expected] of [
    ['[data-management-link="admin"]', "Admin Control"],
    ['[data-management-link="agency"]', "Agency Desk"],
    ['[data-management-link="member"]', "My Beauty"],
  ]) {
    click(dom.window, document.querySelector(selector));
    assert.match(
      document.querySelector("#managementView").textContent,
      new RegExp(expected),
    );
  }

  click(dom.window, document.querySelector('[data-management-link="member"]'));
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

  assert.deepEqual(errors, []);
  console.log("Stage 1 management foundation test passed");
})();

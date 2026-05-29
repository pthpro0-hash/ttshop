# Admin Agency Member Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first reviewable foundation for admin, agency, and member management without implementing point settlement math yet.

**Architecture:** Keep the project as a pure static HTML/CSS/JS demo, but split `main.js` into focused ES modules so future admin, agency, points, settlement, and referral logic do not accumulate in one file. Stage 1 creates routing, shared store, mock domain data, and reviewable screens for Admin / Agency / Member roles. Follow-up stages will add real business calculations behind these module boundaries.

**Tech Stack:** Native HTML, CSS, JavaScript ES modules, browser `localStorage` for demo persistence, no external framework.

---

## Scope Boundary

This plan intentionally implements only Stage 1.

Stage 1 includes:

- Module split from single `main.js`
- Basic hash/router view switching
- Shared demo store
- Admin / Agency / Member dashboard shell screens
- Navigation entry points
- Mock entities for headquarters agency, one agency, one member, one order, one product referral link
- Verification that existing shop, auth, cart, and checkout flows still work

Stage 1 does not include:

- Point accrual calculation
- Point payment calculation
- Agency monthly settlement generation
- Referral reward posting
- Product option editor
- Real authentication
- Backend database

Those must be implemented as separate reviewed stages after this foundation is approved.

---

## Target File Structure

Create:

- `scripts/data/catalog.js`  
  Owns product/category data currently embedded in `main.js`.
- `scripts/data/demo-store.js`  
  Owns demo members, agencies, settings, orders, point ledger seed data, and read/write helpers.
- `scripts/utils/format.js`  
  Owns shared formatting helpers such as money formatting.
- `scripts/ui/shop.js`  
  Owns home product rendering, detail page rendering, cart, and checkout.
- `scripts/ui/auth.js`  
  Owns login/signup demo UI.
- `scripts/ui/management.js`  
  Owns Admin / Agency / Member shell screens.
- `scripts/app.js`  
  Owns DOM references, router, bootstrapping, and cross-module wiring.

Modify:

- `index.html`  
  Change script tag to `type="module"` and point to `scripts/app.js`. Add a management view root.
- `style.css`  
  Add role dashboard shell styles. Keep existing shopping/auth visual tone.
- `README.md`  
  Document module structure and Stage 1 management demo scope.

Keep:

- Existing shopping design tone.
- Current product count and categories.
- Current auth screen behavior.
- Current cart and checkout behavior.

---

## Stage Roadmap

Stage 1: Management foundation and module split  
Review goal: screens and module boundaries are right.

Stage 2: Product and option management  
Review goal: category/product/option admin screens model beauty-product option complexity.

Stage 3: Point ledger and payment limits  
Review goal: purchase reward, point use cap, friend signup reward, and audit ledger are correct.

Stage 4: Agency ownership and agency customer management  
Review goal: agency link registration, headquarters fallback, immutable customer assignment, termination migration.

Stage 5: Personal product referral links  
Review goal: one link per purchased unit, one-time use, priority over agency settlement.

Stage 6: Settlement management  
Review goal: previous-month paid product amount, shipping excluded, personal-referral orders excluded, paid on next month day 15.

Stage 7: Admin QA and demo hardening  
Review goal: cross-flow scenarios, edge cases, docs, and commit cleanup.

---

## Stage 1 Acceptance Criteria

- `main.js` is replaced by focused ES modules under `scripts/`.
- `index.html` loads `scripts/app.js` with `type="module"`.
- Header includes entry points for `Admin`, `Agency`, and `Member` or a management selector reachable from the UI.
- Admin screen shows:
  - settings summary: purchase point rate 5%, max point use 50%, personal referrer reward 10%, buyer bonus 5%
  - agency summary including headquarters agency
  - latest order/referral summary
- Agency screen shows:
  - agency code/link
  - estimated sales block
  - customer count
  - settlement status summary card showing the text `정산 준비중`
- Member screen shows:
  - owned points
  - order summary
  - purchased-unit referral link summary card using the seeded `LED-A-001` code
  - no agency ownership disclosure
- Existing flows still pass:
  - product list renders 10 items
  - category filter works
  - product card opens detail
  - Add to cart / quantity / checkout works
  - LED checkout detail appears only for LED checkout
  - Login screen has two top tabs: login/signup

---

### Task 1: Create Module Skeleton

**Files:**

- Create: `scripts/data/catalog.js`
- Create: `scripts/data/demo-store.js`
- Create: `scripts/utils/format.js`
- Create: `scripts/ui/shop.js`
- Create: `scripts/ui/auth.js`
- Create: `scripts/ui/management.js`
- Create: `scripts/app.js`
- Modify: `index.html`

- [ ] **Step 1: Create directories**

Run:

```powershell
New-Item -ItemType Directory -Force -Path scripts\data,scripts\utils,scripts\ui
```

Expected: directories exist.

- [ ] **Step 2: Create minimal module exports**

Create `scripts/utils/format.js`:

```js
export const formatMoney = (value) =>
  `${Number(value).toLocaleString("ko-KR")}원`;
```

Create `scripts/data/catalog.js`:

```js
export const CATEGORIES = ["미용기구", "미용재료", "화장품"];

export const products = [
  // Move the existing 10 product objects here unchanged.
];

export const categoryCopy = {
  // Move the existing categoryCopy object here unchanged.
};

export const getProduct = (id) => products.find((item) => item.id === id);
```

Create `scripts/data/demo-store.js`:

```js
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

export function loadStore() {
  const saved = localStorage.getItem(STORE_KEY);
  if (!saved) return structuredClone(defaultStore);

  try {
    return { ...structuredClone(defaultStore), ...JSON.parse(saved) };
  } catch {
    return structuredClone(defaultStore);
  }
}

export function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}
```

Create bootstrap modules:

`scripts/ui/shop.js`

```js
export function initShop() {}
```

`scripts/ui/auth.js`

```js
export function openAuth() {}
```

`scripts/ui/management.js`

```js
export function openManagement() {}
```

`scripts/app.js`

```js
import { loadStore, saveStore } from "./data/demo-store.js";

const store = loadStore();
saveStore(store);
```

- [ ] **Step 3: Update `index.html` script tag**

Replace:

```html
<script src="main.js?v=20260529-led-checkout"></script>
```

With:

```html
<script type="module" src="scripts/app.js?v=20260529-admin-foundation"></script>
```

- [ ] **Step 4: Run syntax check**

Run:

```powershell
node --check scripts/app.js
node --check scripts/data/catalog.js
node --check scripts/data/demo-store.js
node --check scripts/utils/format.js
```

Expected: no output and exit code `0`.

- [ ] **Step 5: Commit module skeleton**

Run:

```powershell
git add index.html scripts
git commit -m "Start management module foundation"
```

Expected: commit succeeds.

---

### Task 2: Move Existing Shop Logic Into `scripts/ui/shop.js`

**Files:**

- Modify: `scripts/ui/shop.js`
- Modify: `scripts/app.js`
- Modify: `scripts/data/catalog.js`
- Modify: `index.html`
- Delete: `main.js` after migration is complete and verified.

- [ ] **Step 1: Move product data**

Move the complete existing `products` array and `categoryCopy` object from `main.js` into `scripts/data/catalog.js`.

Expected:

- `products.length === 10`
- categories remain `미용기구`, `미용재료`, `화장품`
- no product text changes

- [ ] **Step 2: Move shop state and rendering**

In `scripts/ui/shop.js`, implement exports:

```js
import { categoryCopy, getProduct, products } from "../data/catalog.js";
import { formatMoney } from "../utils/format.js";

export function createShopController(dom) {
  const state = {
    activeCategory: "all",
    cart: [],
  };

  function getTotals() {
    const subtotal = state.cart.reduce(
      (sum, item) => sum + item.sale * item.qty,
      0,
    );
    const shipping = subtotal > 0 && subtotal < 50000 ? 3000 : 0;

    return {
      subtotal,
      shipping,
      reward: Math.floor(subtotal * 0.03),
      total: subtotal + shipping,
      count: state.cart.reduce((sum, item) => sum + item.qty, 0),
    };
  }

  return {
    state,
    getTotals,
    renderProducts,
    openDetail,
    openCart,
    closeCart,
    updateCart,
    openCheckout,
    bindShopEvents,
  };

  // Move existing shop functions here, replacing direct global dom references
  // with the dom argument passed into createShopController.
}
```

Implementation requirement:

- Preserve the current generated HTML for product cards, detail pages, cart, checkout, and LED checkout detail.
- `openCheckout()` must still call `createCheckoutLedDetail()` and show it only when `state.cart` includes `device-led`.
- `bindShopEvents()` must bind category buttons, product grid clicks, cart drawer, logo home, and home links.

- [ ] **Step 3: Wire shop controller in `scripts/app.js`**

Implement:

```js
import { createShopController } from "./ui/shop.js";
import { loadStore, saveStore } from "./data/demo-store.js";

const dom = {
  grid: document.querySelector("#productGrid"),
  home: document.querySelector("#homeView"),
  detail: document.querySelector("#detailView"),
  auth: document.querySelector("#authView"),
  management: document.querySelector("#managementView"),
  count: document.querySelector("#categoryCount"),
  bag: document.querySelector("#bagButton"),
  cartList: document.querySelector("#cartList"),
  cartSummary: document.querySelector("#cartSummary"),
  toast: document.querySelector("#toast"),
};

const store = loadStore();
saveStore(store);

const shop = createShopController(dom);
shop.bindShopEvents();
shop.renderProducts();
shop.updateCart();
```

- [ ] **Step 4: Add management root**

In `index.html`, add this after `authView`:

```html
<main class="management-view is-hidden" id="managementView"></main>
```

- [ ] **Step 5: Verify existing shopping behavior**

Run the existing jsdom flow test updated to load `scripts/app.js`.

Expected:

- product count is 10
- add to cart works
- checkout opens
- LED checkout section appears for LED order
- non-LED checkout does not show LED section

- [ ] **Step 6: Delete old `main.js`**

Delete `main.js` only after all migrated flows pass.

- [ ] **Step 7: Commit shop module migration**

Run:

```powershell
git add index.html scripts main.js
git commit -m "Split shop flow into modules"
```

Expected: commit succeeds.

---

### Task 3: Move Auth UI Into `scripts/ui/auth.js`

**Files:**

- Modify: `scripts/ui/auth.js`
- Modify: `scripts/app.js`

- [ ] **Step 1: Implement auth controller**

In `scripts/ui/auth.js`, implement:

```js
export function createAuthController({ dom, showHome, closeCart, showToast }) {
  function openAuth(mode = "login") {
    closeCart();
    dom.auth.innerHTML = createAuthView(mode);
    showAuthView();
    bindAuthEvents();
  }

  function showAuthView() {
    dom.home.classList.add("is-hidden");
    dom.detail.classList.add("is-hidden");
    dom.management.classList.add("is-hidden");
    dom.auth.classList.remove("is-hidden");
    scrollTo({ top: 0, behavior: "smooth" });
  }

  return { openAuth, showAuthView };

  // Move the current auth rendering helpers here:
  // createAuthView, createAuthTab, createAuthPanel, createSignupPanel,
  // createGeneralSignupPanel, createLoginPanel, createAuthCompletePanel,
  // createSocialButton, createAddressFields, bindAuthEvents.
}
```

Implementation requirement:

- Top tabs remain only `로그인` and `회원가입`.
- Login screen shows normal login and simple login together.
- Signup screen shows simple signup and general signup together.
- `BEAUTY REF. 간편가입` is not present.
- Delivery address fields are present only in general signup.

- [ ] **Step 2: Wire auth in `scripts/app.js`**

Add:

```js
import { createAuthController } from "./ui/auth.js";

const auth = createAuthController({
  dom,
  showHome: shop.showHome,
  closeCart: shop.closeCart,
  showToast: shop.showToast,
});

document.querySelector("#loginLink").addEventListener("click", (event) => {
  event.preventDefault();
  auth.openAuth("login");
});
```

If `shop.showHome` and `shop.showToast` are not exported yet, expose them from `createShopController`.

- [ ] **Step 3: Verify auth behavior**

Run jsdom test:

Expected:

- Login opens auth view
- only 2 top tabs
- login has normal and simple login
- signup has simple and general signup
- address only appears on signup

- [ ] **Step 4: Commit auth module migration**

Run:

```powershell
git add scripts
git commit -m "Split auth flow into module"
```

Expected: commit succeeds.

---

### Task 4: Add Management Shell Views

**Files:**

- Modify: `index.html`
- Modify: `scripts/ui/management.js`
- Modify: `scripts/app.js`
- Modify: `style.css`

- [ ] **Step 1: Add header links**

In `index.html`, add management links inside `.nav-right` before `Login`:

```html
<a href="#admin" data-management-link="admin">Admin</a>
<a href="#agency" data-management-link="agency">Agency</a>
<a href="#member" data-management-link="member">Member</a>
```

- [ ] **Step 2: Implement management controller**

In `scripts/ui/management.js`, implement:

```js
export function createManagementController({ dom, store, closeCart }) {
  function openManagement(role = "admin") {
    closeCart();
    dom.management.innerHTML = createManagementView(role, store);
    dom.home.classList.add("is-hidden");
    dom.detail.classList.add("is-hidden");
    dom.auth.classList.add("is-hidden");
    dom.management.classList.remove("is-hidden");
    scrollTo({ top: 0, behavior: "smooth" });
  }

  return { openManagement };
}
```

- [ ] **Step 3: Add admin shell**

In `scripts/ui/management.js`, add:

```js
function createAdminDashboard(store) {
  const hq = store.agencies.find((agency) => agency.isHeadquarters);
  const agencyCount = store.agencies.length;
  const memberCount = store.members.length;
  const latestOrder = store.orders[0];

  return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Admin / Headquarters</div>
          <h1 class="detail-title">Admin<br />Control.</h1>
        </div>
        <p>포인트, 대리점, 상품, 추천링크, 정산을 단계별로 관리하기 위한 관리자 화면 골격입니다.</p>
      </div>
      <div class="management-grid">
        <article><span>본사 대리점</span><strong>${hq.name}</strong></article>
        <article><span>대리점 수</span><strong>${agencyCount}</strong></article>
        <article><span>회원 수</span><strong>${memberCount}</strong></article>
        <article><span>최근 주문</span><strong>${latestOrder.id}</strong></article>
      </div>
      ${createSettingsPanel(store)}
    </section>
  `;
}
```

- [ ] **Step 4: Add agency shell**

Add:

```js
function createAgencyDashboard(store) {
  const agency = store.agencies.find((item) => !item.isHeadquarters);
  const members = store.members.filter(
    (member) => member.agencyId === agency.id,
  );

  return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Agency / ${agency.code}</div>
          <h1 class="detail-title">Agency<br />Desk.</h1>
        </div>
        <p>대리점 링크, 소속 고객, 매출, 정산 예정액을 확인하는 대리점 화면 골격입니다.</p>
      </div>
      <div class="management-grid">
        <article><span>전용 코드</span><strong>${agency.code}</strong></article>
        <article><span>전용 링크</span><strong>/join/${agency.linkSlug}</strong></article>
        <article><span>소속 고객</span><strong>${members.length}명</strong></article>
        <article><span>영업비율</span><strong>${agency.commissionRate}%</strong></article>
      </div>
    </section>
  `;
}
```

- [ ] **Step 5: Add member shell**

Add:

```js
function createMemberDashboard(store) {
  const member = store.members[0];
  const memberOrders = store.orders.filter(
    (order) => order.memberId === member.id,
  );
  const links = store.personalReferralLinks.filter(
    (link) => link.ownerMemberId === member.id,
  );

  return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Member / My page</div>
          <h1 class="detail-title">My<br />Beauty.</h1>
        </div>
        <p>회원에게는 대리점 소속을 노출하지 않고 포인트, 주문, 상품별 추천링크만 보여줍니다.</p>
      </div>
      <div class="management-grid">
        <article><span>보유 포인트</span><strong>${member.points.toLocaleString("ko-KR")}P</strong></article>
        <article><span>주문 수</span><strong>${memberOrders.length}건</strong></article>
        <article><span>추천 링크</span><strong>${links.length}개</strong></article>
        <article><span>고객 상태</span><strong>${member.status}</strong></article>
      </div>
    </section>
  `;
}
```

- [ ] **Step 6: Add router wiring**

In `scripts/app.js`:

```js
import { createManagementController } from "./ui/management.js";

const management = createManagementController({
  dom,
  store,
  closeCart: shop.closeCart,
});

document.querySelectorAll("[data-management-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    management.openManagement(link.dataset.managementLink);
  });
});
```

- [ ] **Step 7: Add management CSS**

In `style.css`, add:

```css
.management-view {
  width: min(var(--max), calc(100% - 44px));
  margin: 0 auto;
  padding: 34px 0 84px;
}
.management-dashboard {
  border-top: 1px solid var(--line);
  padding-top: 22px;
}
.management-head {
  display: grid;
  grid-template-columns: 1fr minmax(260px, 520px);
  gap: 24px;
  align-items: end;
  margin-bottom: 22px;
}
.management-head p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.75;
}
.management-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}
.management-grid article {
  min-height: 140px;
  padding: 22px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: var(--paper);
}
.management-grid span {
  display: block;
  margin-bottom: 14px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}
.management-grid strong {
  font-size: 24px;
  line-height: 1.25;
}
@media (max-width: 1100px) {
  .management-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 760px) {
  .management-view {
    width: min(100% - 24px, var(--max));
  }
  .management-head,
  .management-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 8: Verify management views**

Run browser or jsdom checks:

Expected:

- Admin opens and shows Admin Control
- Agency opens and shows Agency Desk
- Member opens and shows My Beauty
- Member screen does not show agency name or agency code
- Returning to Shop still works

- [ ] **Step 9: Commit management shell**

Run:

```powershell
git add index.html style.css scripts README.md
git commit -m "Add management dashboard shells"
```

Expected: commit succeeds.

---

### Task 5: Update README and Final Stage 1 Verification

**Files:**

- Modify: `README.md`

- [ ] **Step 1: Document new module structure**

Add:

```markdown
## Module Structure

- `scripts/app.js`: bootstraps DOM, store, shop, auth, and management controllers
- `scripts/data/catalog.js`: product and category data
- `scripts/data/demo-store.js`: demo admin, agency, member, order, settings, referral-link data
- `scripts/ui/shop.js`: product, cart, checkout, LED checkout detail
- `scripts/ui/auth.js`: login/signup demo screens
- `scripts/ui/management.js`: admin, agency, member dashboard shells
- `scripts/utils/format.js`: shared formatting helpers
```

- [ ] **Step 2: Document Stage 1 scope**

Add:

```markdown
## Management Demo Scope

Stage 1 adds only the management foundation. Point calculation, agency settlement, referral rewards, and product option administration are assigned to separately reviewed follow-up stages.
```

- [ ] **Step 3: Run all verification commands**

Run:

```powershell
node --check scripts/app.js
node --check scripts/data/catalog.js
node --check scripts/data/demo-store.js
node --check scripts/ui/shop.js
node --check scripts/ui/auth.js
node --check scripts/ui/management.js
node --check scripts/utils/format.js
npx --yes prettier --check index.html style.css scripts/**/*.js README.md
```

Expected: all commands pass.

- [ ] **Step 4: Browser smoke test**

Open:

```text
http://127.0.0.1:8000/?v=admin-foundation
```

Verify:

- home page renders
- Login opens auth
- Admin opens admin
- Agency opens agency
- Member opens member
- LED checkout detail still works

- [ ] **Step 5: Commit docs and verification cleanup**

Run:

```powershell
git add README.md
git commit -m "Document management foundation scope"
```

Expected: commit succeeds if README changed.

---

## Stage 1 Review Checklist

Before moving to Stage 2, confirm:

- [ ] Does the Admin screen expose the correct high-level management concepts?
- [ ] Does the Agency screen avoid giving agency users too much control?
- [ ] Does the Member screen hide agency ownership as required?
- [ ] Are modules split clearly enough to continue without growing one large file?
- [ ] Should Stage 2 start with product/option management or point ledger?

Recommended next stage after approval: **Stage 2: Product and Option Management**, because product option complexity affects checkout, referral links, point calculation, and settlement line items.

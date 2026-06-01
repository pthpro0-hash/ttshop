import { loadStore, saveStore } from "./data/demo-store.js";
import { createAuthController } from "./ui/auth.js";
import { createManagementController } from "./ui/management.js";
import { createShopController } from "./ui/shop.js";

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
  loginLink: document.querySelector("#loginLink"),
  sessionUser: document.querySelector("#sessionUser"),
  logoutButton: document.querySelector("#logoutButton"),
};

const store = loadStore();
saveStore(store);

const shop = createShopController({
  dom,
  store,
  persistStore: saveStore,
  requireLogin,
});
const auth = createAuthController({
  dom,
  store,
  persistStore: saveStore,
  updateSessionUi,
  showHome: shop.showHome,
  closeCart: shop.closeCart,
  showToast: shop.showToast,
});
const management = createManagementController({
  dom,
  store,
  closeCart: shop.closeCart,
  persistStore: saveStore,
});

shop.validateCatalog();
shop.bindShopEvents();
shop.renderProducts();
shop.updateCart();

dom.loginLink.addEventListener("click", (event) => {
  event.preventDefault();
  auth.openAuth("login");
});
dom.logoutButton.addEventListener("click", () => {
  store.currentMemberId = "";
  saveStore(store);
  updateSessionUi();
  shop.showToast("로그아웃되었습니다.");
});

document.addEventListener("click", (event) => {
  const agencyJoinLink = event.target.closest("[data-agency-join-link]");
  if (agencyJoinLink) {
    event.preventDefault();
    store.pendingAgencySlug = agencyJoinLink.dataset.agencyJoinLink;
    saveStore(store);
    auth.openAuth("signup");
    return;
  }

  const link = event.target.closest("[data-management-link]");
  if (!link) return;

  event.preventDefault();
  management.openManagement(link.dataset.managementLink);
});

initializeAgencyJoinContext();
updateSessionUi();

function initializeAgencyJoinContext() {
  const params = new URLSearchParams(window.location.search);
  const agencySlug =
    params.get("agency") || window.location.hash.match(/^#join\/(.+)$/)?.[1];
  if (!agencySlug) return;

  store.pendingAgencySlug = decodeURIComponent(agencySlug);
  saveStore(store);
  auth.openAuth("signup");
}

function getCurrentMember() {
  return store.members.find((member) => member.id === store.currentMemberId);
}

function updateSessionUi() {
  const member = getCurrentMember();
  dom.loginLink.classList.toggle("is-hidden", Boolean(member));
  dom.sessionUser.classList.toggle("is-hidden", !member);
  dom.logoutButton.classList.toggle("is-hidden", !member);
  dom.sessionUser.textContent = member ? `${member.name}님` : "";
}

function requireLogin() {
  if (getCurrentMember()) return true;

  shop.showToast("로그인 후 구매할 수 있습니다.");
  auth.openAuth("login");
  return false;
}

import { loadStore, saveStore } from "./data/demo-store.js";
import { createAuthController } from "./ui/auth.js";
import { createManagementController } from "./ui/management.js";
import { createShopController } from "./ui/shop.js";

// App entry point.
// - Loads one shared store object from SQLite API or browser fallback storage.
// - Wires the three UI controllers: shop, auth/profile, admin/agency management.
// - Keeps session state in store.currentMemberId so every module reads the same member.
const appReady = initializeApp();
window.__beautyAppReady = appReady;

async function initializeApp() {
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

  // The store is intentionally passed by reference to every controller.
  // After each mutation, controllers call saveStore() so SQLite and fallback storage stay synced.
  const store = await loadStore();
  await saveStore(store);

  const getCurrentMember = () =>
    store.members.find((member) => member.id === store.currentMemberId);

  let shop;
  let auth;
  let activeManagementRole = "";

  function updateSessionUi() {
    const member = getCurrentMember();
    dom.loginLink.classList.toggle("is-hidden", Boolean(member));
    dom.sessionUser.classList.toggle("is-hidden", !member);
    dom.logoutButton.classList.toggle("is-hidden", !member);
    dom.sessionUser.textContent = member ? `${member.name}님` : "";
  }

  function requireLogin() {
    // Purchase actions share this guard. It prevents cart/checkout/pay flows
    // from progressing when there is no active member session.
    const member = getCurrentMember();
    if (member?.status === "active") return true;
    if (member) {
      store.currentMemberId = "";
      saveStore(store);
      updateSessionUi();
      shop.showToast("구매 가능한 회원 상태가 아닙니다. 다시 로그인해주세요.");
      auth.openAuth("login");
      return false;
    }

    shop.showToast("로그인 후 구매할 수 있습니다.");
    auth.openAuth("login");
    return false;
  }

  shop = createShopController({
    dom,
    store,
    persistStore: saveStore,
    requireLogin,
  });
  auth = createAuthController({
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
  dom.sessionUser.addEventListener("click", () => {
    auth.openProfile();
  });
  dom.logoutButton.addEventListener("click", () => {
    store.currentMemberId = "";
    saveStore(store);
    updateSessionUi();
    auth.closeAuth();
    activeManagementRole = "";
    shop.showHome();
    dom.management.classList.add("is-hidden");
    dom.detail.classList.add("is-hidden");
    dom.home.classList.remove("is-hidden");
    window.location.hash = "";
    shop.showToast("로그아웃되었습니다.");
  });

  document.addEventListener("click", (event) => {
    // Management links are rendered inside auth modals and dashboard content.
    // A single delegated handler keeps Admin/Agency entry behavior consistent.
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
    const role = link.dataset.managementLink;
    if (role === "admin" || role === "agency") {
      auth.openManagementLogin(role, (managementRole) => {
        activeManagementRole = managementRole;
        management.openManagement(managementRole);
      });
      return;
    }

    auth.closeAuth();
    activeManagementRole = role;
    management.openManagement(role);
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
}

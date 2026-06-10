import { loadStore, saveStore } from "./data/demo-store.js";
import { autoConfirmEligibleOrders } from "./domain/order-processing.js";
import { createAuthController } from "./ui/auth.js";
import { createManagementController } from "./ui/management.js";
import { createShopController } from "./ui/shop.js";

// 앱 진입점.
// - SQLite API 또는 브라우저 fallback 저장소에서 하나의 store 객체를 읽는다.
// - 쇼핑, 회원/내정보, Admin/Agency 관리 컨트롤러를 같은 store에 연결한다.
// - 로그인 세션은 store.currentMemberId 하나로 관리해 모든 화면이 동일한 회원 상태를 본다.
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

  // store는 일부러 참조로 공유한다.
  // 각 컨트롤러가 변경 후 saveStore()를 호출하면 SQLite와 브라우저 fallback 저장소가 함께 동기화된다.
  const store = await loadStore();
  autoConfirmEligibleOrders(store);
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

  function getCurrentManagementRole() {
    const member = getCurrentMember();
    if (activeManagementRole === "admin" || activeManagementRole === "agency") {
      return activeManagementRole;
    }
    if (member?.role === "admin") return "admin";
    if (member?.id?.startsWith("member-agency-")) return "agency";
    return "";
  }

  function requireLogin() {
    // 장바구니, 바로구매, 결제 진입이 공통으로 사용하는 로그인 가드.
    // 활성 회원 세션이 없으면 구매 흐름을 진행하지 않고 로그인 팝업을 연다.
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
    const managementRole = getCurrentManagementRole();
    if (managementRole) {
      auth.closeAuth();
      activeManagementRole = managementRole;
      management.openManagement(managementRole);
      return;
    }

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
    // Admin/Agency 진입 링크는 로그인 팝업과 관리 화면 내부에 모두 렌더링될 수 있다.
    // 문서 레벨 위임 이벤트로 묶어 어디서 눌러도 동일한 로그인/관리 화면 흐름을 유지한다.
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

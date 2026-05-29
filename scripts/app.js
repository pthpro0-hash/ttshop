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
};

const store = loadStore();
saveStore(store);

const shop = createShopController(dom);
const auth = createAuthController({
  dom,
  showHome: shop.showHome,
  closeCart: shop.closeCart,
  showToast: shop.showToast,
});
const management = createManagementController({
  dom,
  store,
  closeCart: shop.closeCart,
});

shop.validateCatalog();
shop.bindShopEvents();
shop.renderProducts();
shop.updateCart();

document.querySelector("#loginLink").addEventListener("click", (event) => {
  event.preventDefault();
  auth.openAuth("login");
});

document.querySelectorAll("[data-management-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    management.openManagement(link.dataset.managementLink);
  });
});

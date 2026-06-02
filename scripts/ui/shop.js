import {
  CATEGORIES,
  categoryCopy,
  getProduct,
  products,
} from "../data/catalog.js";
import {
  calculatePurchasePoints,
  completeBypassPayment,
} from "../domain/order-processing.js";
import { formatMoney } from "../utils/format.js";

export function createShopController({
  dom,
  store,
  persistStore,
  requireLogin = () => true,
}) {
  const state = {
    activeCategory: "all",
    cart: [],
  };

  const getQuantity = () =>
    Math.max(1, Number(document.querySelector("#quantity")?.value || 1));

  const getPurchasePointRate = () =>
    Math.max(0, Number(store.settings.purchasePointRate || 0));

  const getPurchasePoints = (amount) =>
    calculatePurchasePoints(amount, getPurchasePointRate());

  const formatPoints = (points) => `${points.toLocaleString("ko-KR")}P`;

  function getTotals() {
    const subtotal = state.cart.reduce(
      (sum, item) => sum + item.sale * item.qty,
      0,
    );
    const shipping = subtotal > 0 && subtotal < 50000 ? 3000 : 0;

    return {
      subtotal,
      shipping,
      reward: getPurchasePoints(subtotal),
      total: subtotal + shipping,
      count: state.cart.reduce((sum, item) => sum + item.qty, 0),
    };
  }

  function renderProducts(category = "all") {
    state.activeCategory = category;

    document.querySelectorAll(".category-btn").forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.category === category,
      );
    });

    const list =
      category === "all"
        ? products
        : products.filter((product) => product.category === category);
    dom.count.textContent =
      category === "all"
        ? `All products · ${list.length} items`
        : `${category} · ${list.length} items`;

    dom.grid.innerHTML = list.map(createProductCard).join("");
  }

  function createProductCard(product) {
    return `
    <article class="product-card" tabindex="0" data-id="${product.id}">
      <div class="image-wrap">
        <div class="badge">${product.badge}</div>
        <img src="${product.image}" alt="${product.ko}" />
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}<br />ㅣ${product.ko}</h3>
        <p class="price-row"><strong>분류 :</strong> ${product.category}</p>
        <p class="price-row"><strong>타입 :</strong> ${product.type}</p>
        <p class="price-row"><strong>판매가 :</strong> ${formatMoney(product.price)}</p>
        <p class="price-row sale"><strong>할인판매가 :</strong> ${formatMoney(product.sale)}</p>
        <p class="desc">${product.short}</p>
        <div class="click-line">Buy now →</div>
      </div>
    </article>
  `;
  }

  function openDetail(product) {
    if (!product) return;

    const copy = categoryCopy[product.category];
    dom.detail.innerHTML = `
    <div class="breadcrumb">
      <button class="back-button" id="backToShop">← Back to shop</button>
      <span>Home / Shop / ${product.ko}</span>
    </div>
    <section class="detail-layout">
      <div class="detail-gallery">
        <figure class="large"><img src="${product.image}" alt="${product.ko}" /></figure>
        <figure><img src="${product.image}" alt="${product.ko}" /></figure>
        <figure><img src="${product.image}" alt="${product.ko}" /></figure>
      </div>
      <aside class="purchase-panel">
        <div class="product-category">${product.category} / ${product.type}</div>
        <h1 class="detail-title">${product.name}</h1>
        <p class="detail-subtitle">${product.desc}</p>
        ${createPriceBox(product)}
        <div class="option-box">
          <label class="option-label" for="optionSelect">Option</label>
          <select class="option-select" id="optionSelect">
            <option>${product.option}</option>
            <option>Gift wrap 추가 +3,000원</option>
          </select>
          <div class="quantity-row">
            <div>
              <label class="option-label" for="quantity">Quantity</label>
              <input class="quantity-input" id="quantity" type="number" value="1" min="1" max="20" />
            </div>
            <div>
              <label class="option-label" for="stockStatus">Stock</label>
              <input class="quantity-input" id="stockStatus" value="Available" readonly />
            </div>
          </div>
        </div>
        <div class="buy-actions">
          <button class="buy-button" id="buyNow">Buy now</button>
          <button class="cart-button" id="addCart">Add to cart</button>
        </div>
        <p class="detail-note">
          결제 기능은 샘플 UI입니다. 실제 쇼핑몰에서는 PG 결제, 재고, 배송 정책,
          회원/비회원 구매 플로우를 연결하면 됩니다.
        </p>
      </aside>
    </section>
    ${createDetailContent(copy)}
  `;

    showDetailView();
    document.querySelector("#backToShop").addEventListener("click", showHome);
    document
      .querySelector("#addCart")
      .addEventListener("click", () => addToCart(product));
    document.querySelector("#buyNow").addEventListener("click", () => {
      if (
        addToCart(product, "상품을 장바구니에 담고 주문 요약을 열었습니다.")
      ) {
        openCart();
      }
    });
  }

  function createPriceBox(product) {
    return `
    <div class="detail-price-box">
      <div class="detail-price-item"><span>판매가</span><strong>${formatMoney(product.price)}</strong></div>
      <div class="detail-price-item"><span>할인판매가</span><strong>${formatMoney(product.sale)}</strong></div>
      <div class="detail-price-item"><span>배송</span><strong>3,000원 / 5만원 이상 무료</strong></div>
      <div class="detail-price-item"><span>적립</span><strong>구매금액 ${getPurchasePointRate()}%</strong></div>
    </div>
  `;
  }

  function createDetailContent(copy) {
    return `
    <section class="detail-content">
      <div class="content-block">
        <h3>Key Benefits</h3>
        <ul>${copy.benefits.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="content-block">
        <h3>Ingredients / Material</h3>
        <p>${copy.material}</p>
      </div>
      <div class="content-block">
        <h3>How to Use</h3>
        <p>${copy.usage}</p>
      </div>
    </section>
    <section class="review-strip" id="review">
      <div>
        <div class="review-score">4.8</div>
        <div class="small-label">Customer review</div>
      </div>
      <div class="review-copy">
        “${copy.review}”<br />
        미니멀한 상세 구조 안에서 제품 효능, 사용법, 리뷰, 구매 버튼을 한 화면에서 확인할 수 있게 구성했습니다.
      </div>
    </section>
  `;
  }

  function addToCart(product, message) {
    if (!requireLogin()) return false;

    const quantity = getQuantity();
    const item = state.cart.find((cartItem) => cartItem.id === product.id);

    if (item) {
      item.qty += quantity;
    } else {
      state.cart.push({ ...product, qty: quantity });
    }

    updateCart();
    showToast(
      message || `${product.ko} ${quantity}개가 장바구니에 담겼습니다.`,
    );
    return true;
  }

  function updateCart() {
    const totals = getTotals();
    dom.bag.textContent = totals.count;
    dom.cartList.innerHTML = state.cart.length
      ? state.cart.map(createCartItem).join("")
      : createEmptyCart();
    dom.cartSummary.innerHTML = createCartSummary(totals);
    document.querySelector("#checkoutButton").addEventListener("click", () => {
      state.cart.length
        ? openCheckout()
        : showToast("장바구니에 상품을 먼저 담아주세요.");
    });
  }

  function createCartItem(item) {
    return `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.ko}" />
      <div>
        <h3>${item.name}<br />ㅣ${item.ko}</h3>
        <p>${item.category} / ${item.type}</p>
        <p>${item.option}</p>
        <div class="cart-item-bottom">
          <div class="qty-control">
            <button data-id="${item.id}" data-d="-1" aria-label="${item.ko} 수량 줄이기">−</button>
            <span>${item.qty}</span>
            <button data-id="${item.id}" data-d="1" aria-label="${item.ko} 수량 늘리기">+</button>
          </div>
          <strong>${formatMoney(item.sale * item.qty)}</strong>
        </div>
      </div>
    </div>
  `;
  }

  function createEmptyCart() {
    return '<div class="cart-empty">장바구니가 비어 있습니다.<br />Shop에서 상품을 선택해보세요.</div>';
  }

  function createCartSummary({ subtotal, shipping, reward, total }) {
    return `
    <div class="summary-row"><span>상품금액</span><strong>${formatMoney(subtotal)}</strong></div>
    <div class="summary-row"><span>배송비</span><strong>${shipping ? formatMoney(shipping) : "무료"}</strong></div>
    <div class="summary-row"><span>적립 예정</span><strong>${formatPoints(reward)}</strong></div>
    <div class="summary-row total"><span>결제예정금액</span><strong>${formatMoney(total)}</strong></div>
    <button class="checkout-button" id="checkoutButton">Checkout</button>
  `;
  }

  function openCheckout() {
    if (!requireLogin()) return;

    closeCart();
    const totals = getTotals();

    dom.detail.innerHTML = `
    <div class="breadcrumb">
      <button class="back-button" id="backToShop">← Back to shop</button>
      <span>Home / Checkout</span>
    </div>
    <section class="detail-layout">
      <div class="purchase-panel static-panel">
        <div class="product-category">Checkout / Order Form</div>
        <h1 class="detail-title">Payment<br />Page.</h1>
        <p class="detail-subtitle">주문자 정보, 배송지, 결제수단을 확인하는 샘플 결제 페이지입니다.</p>
        <div class="option-box">
          <label class="option-label" for="customerName">주문자명</label>
          <input class="quantity-input" id="customerName" value="홍길동" />
          <div class="quantity-row">
            <div>
              <label class="option-label" for="customerPhone">연락처</label>
              <input class="quantity-input" id="customerPhone" value="010-0000-0000" />
            </div>
            <div>
              <label class="option-label" for="zipCode">우편번호</label>
              <input class="quantity-input" id="zipCode" value="06236" />
            </div>
          </div>
          <label class="option-label" for="address">배송지</label>
          <input class="quantity-input" id="address" value="서울시 강남구 테헤란로 000" />
          <label class="option-label" for="paymentMethod">결제수단</label>
          <select class="option-select" id="paymentMethod">
            <option>신용카드</option>
            <option>카카오페이</option>
            <option>네이버페이</option>
            <option>무통장입금</option>
          </select>
        </div>
        <div class="buy-actions">
          <button class="buy-button" id="finalPay">Pay now</button>
          <button class="cart-button" id="openCartAgain">Cart</button>
        </div>
        <p class="detail-note">
          샘플 화면입니다. 실제 운영 시 PG사 결제창, 주문번호 생성, 재고 차감,
          배송지 검증 로직을 연결하면 됩니다.
        </p>
      </div>
      <aside class="purchase-panel static-panel">
        <div class="product-category">Order Summary</div>
        <div class="order-list">${state.cart.map(createCheckoutItem).join("")}</div>
        ${createCheckoutTotals(totals)}
      </aside>
    </section>
    ${createCheckoutLedDetail()}
  `;

    showDetailView();
    document.querySelector("#backToShop").addEventListener("click", showHome);
    document
      .querySelector("#openCartAgain")
      .addEventListener("click", openCart);
    document
      .querySelector("#finalPay")
      .addEventListener("click", completeCheckoutBypass);
  }

  function completeCheckoutBypass() {
    if (!requireLogin()) return;

    if (!state.cart.length) {
      showToast("장바구니에 상품을 먼저 담아주세요.");
      return;
    }

    const result = completeBypassPayment({
      cart: state.cart,
      store,
      payment: {
        memberId: store.currentMemberId,
        referralSourceType: "none",
      },
    });
    state.cart = [];
    persistStore(store);
    updateCart();
    openPaymentResult(result);
    showToast(
      `결제 완료: ${result.earnedPoints.toLocaleString("ko-KR")} 포인트가 적립되었습니다.`,
    );
  }

  function openPaymentResult(result) {
    dom.detail.innerHTML = `
    <div class="breadcrumb">
      <button class="back-button" id="backToShop">← Back to shop</button>
      <span>Home / Checkout / Complete</span>
    </div>
    <section class="payment-result" id="paymentResult">
      <div class="management-head">
        <div>
          <div class="product-category">Payment bypass / Paid</div>
          <h1 class="detail-title">Order<br />Complete.</h1>
        </div>
        <p>
          PG 결제창은 우회 처리했고, 배송비를 제외한 실결제 상품금액 기준으로
          포인트 적립과 대리점 정산 대기 장부를 생성했습니다.
        </p>
      </div>
      <div class="management-grid">
        <article><span>주문번호</span><strong>${result.order.id}</strong></article>
        <article><span>실결제 상품금액</span><strong>${formatMoney(result.totals.paidProductAmount)}</strong></article>
        <article><span>배송비</span><strong>${result.totals.shippingAmount ? formatMoney(result.totals.shippingAmount) : "무료"}</strong></article>
        <article><span>적립 포인트</span><strong>${result.earnedPoints.toLocaleString("ko-KR")}P</strong></article>
        <article><span>대리점 정산 기준</span><strong>${formatMoney(result.agencyProcessing?.baseAmount || 0)}</strong></article>
        <article><span>영업비 예정</span><strong>${formatMoney(result.agencyProcessing?.commissionAmount || 0)}</strong></article>
        <article><span>추천 링크 생성</span><strong>${result.referralLinks.length}개</strong></article>
        <article><span>처리 상태</span><strong>완료</strong></article>
      </div>
      <div class="payment-process">
        <div><strong>01 주문 생성</strong><span>${result.order.id} 주문을 paid 상태로 저장했습니다.</span></div>
        <div><strong>02 포인트 적립</strong><span>${result.order.paidProductAmount.toLocaleString("ko-KR")}원 × ${store.settings.purchasePointRate}% = ${result.earnedPoints.toLocaleString("ko-KR")}P</span></div>
        <div><strong>03 대리점 처리</strong><span>개인 추천링크 구매가 아니므로 ${result.agencyProcessing ? "대리점 정산 대기 장부에 반영했습니다." : "대리점 정산 대상에서 제외했습니다."}</span></div>
        <div><strong>04 개인 추천링크</strong><span>구매 상품 종류 기준으로 ${result.referralLinks.length}개 링크를 생성했습니다.</span></div>
      </div>
      ${createReferralCopyPanel(result.referralLinks)}
      <div class="buy-actions result-actions">
        <button class="buy-button" type="button" data-management-link="admin">Admin 처리 확인</button>
        <button class="cart-button" type="button" data-management-link="agency">Agency 정산 확인</button>
        <button class="cart-button" type="button" data-management-link="member">Member 포인트 확인</button>
      </div>
    </section>
  `;

    showDetailView();
    document.querySelector("#backToShop").addEventListener("click", showHome);
    bindReferralCopyButtons();
  }

  function createReferralCopyPanel(links) {
    if (!links.length) return "";

    return `
    <section class="referral-copy-panel">
      <div class="product-category">Personal referral links</div>
      <div class="profile-list">
        ${links
          .map(
            (link) => `
            <article class="profile-row referral-row">
              <div><strong>${link.code}</strong><span>${link.productId}</span></div>
              <div>
                <span>${createReferralUrl(link.code)}</span>
                <button class="cart-button mini-button" type="button" data-copy-referral="${createReferralUrl(link.code)}">링크 복사</button>
              </div>
            </article>
          `,
          )
          .join("")}
      </div>
    </section>
  `;
  }

  function bindReferralCopyButtons() {
    document.querySelectorAll("[data-copy-referral]").forEach((button) => {
      button.addEventListener("click", async () => {
        await copyText(button.dataset.copyReferral);
        showToast("추천 링크가 복사되었습니다.");
      });
    });
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function createReferralUrl(code) {
    return `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(code)}`;
  }

  function createCheckoutLedDetail() {
    const ledItem = state.cart.find((item) => item.id === "device-led");
    if (!ledItem) return "";

    const product = getProduct("device-led");
    return `
    <section class="checkout-product-detail" id="checkoutLedDetail">
      <div class="checkout-detail-media">
        <img src="${product.image}" alt="${product.ko} 상세 이미지" />
        <div class="visual-caption">
          <span>Only for checkout</span>
          <span>${product.badge}</span>
        </div>
      </div>
      <div class="checkout-detail-copy">
        <div class="product-category">${product.category} / ${product.type}</div>
        <h2>LED Skin<br />Lifting Device</h2>
        <p>
          결제 전 한 번 더 확인할 수 있도록 LED 스킨 리프팅 디바이스 전용 상세 정보를
          결제 화면 하단에 배치했습니다. 홈케어 루틴, 사용 편의성, 배송 정보를
          한 화면에서 확인할 수 있습니다.
        </p>
        <div class="checkout-detail-grid">
          <div>
            <strong>구매 수량</strong>
            <span>${ledItem.qty}개</span>
          </div>
          <div>
            <strong>상품 금액</strong>
            <span>${formatMoney(product.sale * ledItem.qty)}</span>
          </div>
          <div>
            <strong>옵션</strong>
            <span>${product.option}</span>
          </div>
          <div>
            <strong>추천 루틴</strong>
            <span>세안 후 5분 탄력 홈케어</span>
          </div>
        </div>
        <div class="checkout-care-list">
          <div><strong>01</strong> 피부 탄력 케어와 데일리 홈케어 루틴에 적합합니다.</div>
          <div><strong>02</strong> 손에 잡히는 슬림한 형태로 보관과 사용이 간편합니다.</div>
          <div><strong>03</strong> 사용 후에는 마른 천으로 닦아 건조한 곳에 보관하세요.</div>
        </div>
      </div>
    </section>
  `;
  }

  function createCheckoutItem(item) {
    return `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.ko}" />
      <div>
        <h3>${item.name}<br />ㅣ${item.ko}</h3>
        <p>${item.category} / ${item.type}</p>
        <p>수량 ${item.qty}</p>
        <div class="cart-item-bottom">
          <span>${item.option}</span>
          <strong>${formatMoney(item.sale * item.qty)}</strong>
        </div>
      </div>
    </div>
  `;
  }

  function createCheckoutTotals({ subtotal, shipping, reward, total }) {
    return `
    <div class="detail-price-box">
      <div class="detail-price-item"><span>상품금액</span><strong>${formatMoney(subtotal)}</strong></div>
      <div class="detail-price-item"><span>배송비</span><strong>${shipping ? formatMoney(shipping) : "무료"}</strong></div>
      <div class="detail-price-item"><span>적립 예정</span><strong>${formatPoints(reward)}</strong></div>
      <div class="detail-price-item"><span>결제예정금액</span><strong>${formatMoney(total)}</strong></div>
    </div>
  `;
  }

  function showHome() {
    dom.detail.classList.add("is-hidden");
    dom.auth.classList.add("is-hidden");
    dom.management?.classList.add("is-hidden");
    dom.home.classList.remove("is-hidden");
    renderProducts(state.activeCategory);
    setTimeout(
      () =>
        document.querySelector("#shop").scrollIntoView({ behavior: "smooth" }),
      0,
    );
  }

  function showDetailView() {
    dom.home.classList.add("is-hidden");
    dom.auth.classList.add("is-hidden");
    dom.management?.classList.add("is-hidden");
    dom.detail.classList.remove("is-hidden");
    scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCart() {
    updateCart();
    document.body.classList.add("cart-open");
  }

  function closeCart() {
    document.body.classList.remove("cart-open");
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add("is-open");
    setTimeout(() => dom.toast.classList.remove("is-open"), 2300);
  }

  function bindShopEvents() {
    document.querySelectorAll(".category-btn").forEach((button) => {
      button.addEventListener("click", () =>
        renderProducts(button.dataset.category),
      );
    });

    dom.grid.addEventListener("click", (event) => {
      const card = event.target.closest(".product-card");
      if (card) openDetail(getProduct(card.dataset.id));
    });

    dom.grid.addEventListener("keydown", (event) => {
      const card = event.target.closest(".product-card");
      if (!card || (event.key !== "Enter" && event.key !== " ")) return;

      event.preventDefault();
      openDetail(getProduct(card.dataset.id));
    });

    dom.cartList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-id]");
      if (!button) return;

      const item = state.cart.find(
        (cartItem) => cartItem.id === button.dataset.id,
      );
      if (!item) return;

      item.qty += Number(button.dataset.d);
      state.cart = state.cart.filter((cartItem) => cartItem.qty > 0);
      updateCart();
    });

    dom.bag.addEventListener("click", openCart);
    document.querySelector("#cartOverlay").addEventListener("click", closeCart);
    document.querySelector("#cartClose").addEventListener("click", closeCart);
    document.querySelector("#logoHome").addEventListener("click", () => {
      dom.detail.classList.add("is-hidden");
      dom.auth.classList.add("is-hidden");
      dom.home.classList.remove("is-hidden");
      renderProducts(state.activeCategory);
      scrollTo({ top: 0, behavior: "smooth" });
    });

    document.querySelectorAll("[data-home-link]").forEach((link) => {
      link.addEventListener("click", () => {
        dom.detail.classList.add("is-hidden");
        dom.auth.classList.add("is-hidden");
        dom.home.classList.remove("is-hidden");
        renderProducts(state.activeCategory);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeCart();
    });
  }

  function validateCatalog() {
    const categorySet = new Set(products.map((product) => product.category));
    const hasRequiredCategories = CATEGORIES.every((category) =>
      categorySet.has(category),
    );

    if (products.length !== 10 || !hasRequiredCategories) {
      console.warn(
        "상품 데이터는 총 10개와 지정된 3개 카테고리를 유지해야 합니다.",
      );
    }
  }

  return {
    state,
    renderProducts,
    openDetail,
    addToCart,
    updateCart,
    openCart,
    closeCart,
    openCheckout,
    completeCheckoutBypass,
    showHome,
    showToast,
    bindShopEvents,
    validateCatalog,
  };
}

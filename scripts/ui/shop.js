import { CATEGORIES, categoryCopy } from "../data/catalog.js";
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

  const getProducts = () =>
    (store.products || []).filter(
      (product) =>
        product.displayStatus !== "hidden" && product.status !== "deleted",
    );

  const getProduct = (id) =>
    getProducts().find((product) => product.id === id) ||
    (store.products || []).find((product) => product.id === id);

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

    const visibleProducts = getProducts();
    const list =
      category === "all"
        ? visibleProducts
        : visibleProducts.filter((product) => product.category === category);
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

    const copy = categoryCopy[product.category] || categoryCopy["화장품"];
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
          ${createOptionSelect(product)}
          <div class="quantity-row">
            <div>
              <label class="option-label" for="quantity">Quantity</label>
              <input class="quantity-input" id="quantity" type="number" value="1" min="1" max="20" />
            </div>
            <div>
              <label class="option-label" for="stockStatus">Stock</label>
              <input class="quantity-input" id="stockStatus" value="${createStockLabel(product)}" readonly />
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
    ${createDetailContent(copy, product)}
  `;

    showDetailView();
    document.querySelector("#backToShop").addEventListener("click", showHome);
    document
      .querySelector("#addCart")
      .addEventListener("click", () => addToCart(product));
    ["input", "change"].forEach((eventName) => {
      document
        .querySelector("#optionSelect")
        ?.addEventListener(eventName, () => {
          updateSelectedOptionStock(product);
        });
    });
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

  function createDetailContent(copy, product) {
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
    ${createProductDetailImageStack(product)}
  `;
  }

  function createProductDetailImageStack(product) {
    const detailImages = getProductDetailImages(product);
    if (!detailImages.length) return "";

    return `
    <section class="product-detail-image-stack" aria-label="${product.ko} 상세 이미지">
      ${detailImages
        .map(
          (image, index) => `
          <figure>
            <img src="${image}" alt="${product.ko} 상세 이미지 ${index + 1}" />
          </figure>
        `,
        )
        .join("")}
    </section>
  `;
  }

  function addToCart(product, message) {
    if (!requireLogin()) return false;

    const quantity = getQuantity();
    const variant = getSelectedVariant(product);
    const stockLimit = getPurchasableStock(product, variant);
    const sale = getVariantSalePrice(product, variant);
    const cartKey = createCartKey(product, variant);
    if (
      product.status !== "selling" ||
      variant.status !== "selling" ||
      stockLimit <= 0
    ) {
      showToast(
        product.status !== "selling" || variant.status !== "selling"
          ? "현재 판매중인 상품이 아닙니다."
          : "재고가 없어 구매할 수 없습니다.",
      );
      return false;
    }
    const item = state.cart.find((cartItem) => cartItem.cartKey === cartKey);
    const nextQuantity = (item?.qty || 0) + quantity;
    if (nextQuantity > stockLimit) {
      showToast(
        `선택 옵션 재고는 ${stockLimit.toLocaleString("ko-KR")}개까지 구매할 수 있습니다.`,
      );
      return false;
    }

    if (item) {
      item.qty += quantity;
    } else {
      state.cart.push({
        ...product,
        cartKey,
        option: variant.optionName,
        variantSku: variant.sku,
        sale,
        qty: quantity,
      });
    }

    updateCart();
    showToast(
      message || `${product.ko} ${quantity}개가 장바구니에 담겼습니다.`,
    );
    return true;
  }

  function createStockLabel(product) {
    if (product.status !== "selling") return "Not selling";
    const stock = getPurchasableStock(product, getDefaultVariant(product));
    return stock > 0 ? `${stock.toLocaleString("ko-KR")}개` : "Sold out";
  }

  function createOptionSelect(product) {
    const variants = getSellingVariants(product);
    return `
      <select class="option-select" id="optionSelect">
        ${variants
          .map(
            (variant, index) => `
            <option value="${index}" ${variant.status !== "selling" || Number(variant.stock || 0) <= 0 ? "disabled" : ""}>
              ${escapeHtml(variant.optionName)}${variant.priceDelta ? ` / +${formatMoney(variant.priceDelta)}` : ""}${variant.stock <= 0 ? " / 품절" : ""}
            </option>
          `,
          )
          .join("")}
      </select>
    `;
  }

  function getSellingVariants(product) {
    return (product.variants || []).length
      ? product.variants
      : [
          {
            optionName: product.option || "기본 옵션",
            sku: product.sku || product.id,
            stock: product.stock,
            priceDelta: 0,
            status: product.status,
          },
        ];
  }

  function getDefaultVariant(product) {
    return (
      getSellingVariants(product).find(
        (variant) =>
          variant.status === "selling" && Number(variant.stock || 0) > 0,
      ) || getSellingVariants(product)[0]
    );
  }

  function getSelectedVariant(product) {
    const variants = getSellingVariants(product);
    const select = document.querySelector("#optionSelect");
    const index = Number(select?.value || 0);
    return variants[index] || getDefaultVariant(product);
  }

  function getVariantSalePrice(product, variant) {
    return Number(product.sale || 0) + Number(variant?.priceDelta || 0);
  }

  function getPurchasableStock(product, variant) {
    const productStock = Number(product.stock || 0);
    const variantStock =
      variant?.stock === undefined ? productStock : Number(variant.stock || 0);
    return Math.max(0, Math.min(productStock, variantStock));
  }

  function createCartKey(product, variant) {
    return `${product.id}::${variant?.sku || variant?.optionName || "default"}`;
  }

  function updateSelectedOptionStock(product) {
    const stockStatus = document.querySelector("#stockStatus");
    if (!stockStatus) return;
    const variant = getSelectedVariant(product);
    if (variant.status !== "selling") {
      stockStatus.value = "Not selling";
      return;
    }
    const stock = getPurchasableStock(product, variant);
    stockStatus.value =
      stock > 0 ? `${stock.toLocaleString("ko-KR")}개` : "Sold out";
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
            <button data-key="${item.cartKey}" data-d="-1" aria-label="${item.ko} 수량 줄이기">−</button>
            <span>${item.qty}</span>
            <button data-key="${item.cartKey}" data-d="1" aria-label="${item.ko} 수량 늘리기">+</button>
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
    ${createCheckoutProductDetails()}
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

  function createCheckoutProductDetails() {
    const uniqueItems = state.cart.filter(
      (item, index, items) =>
        items.findIndex((candidate) => candidate.id === item.id) === index,
    );
    if (!uniqueItems.length) return "";

    return `
    <section class="checkout-detail-section">
      <div class="management-head compact">
        <div>
          <div class="product-category">Product detail guide</div>
          <h2>상세 안내</h2>
        </div>
        <p>결제 전 상품별 상세 이미지, 옵션, 사용 안내를 확인할 수 있습니다.</p>
      </div>
      ${uniqueItems.map(createCheckoutProductDetail).join("")}
    </section>
  `;
  }

  function createCheckoutProductDetail(item) {
    const product = getProduct(item.id) || item;
    const detailImages = getProductDetailImages(product);
    const sectionId =
      product.id === "device-led" ? ' id="checkoutLedDetail"' : "";

    return `
    <article class="checkout-product-detail"${sectionId}>
      <div class="checkout-detail-media-grid">
        ${detailImages
          .map(
            (image, index) => `
            <figure class="${index === 0 ? "is-main" : ""}">
              <img src="${image}" alt="${product.ko} 상세 이미지 ${index + 1}" />
            </figure>
          `,
          )
          .join("")}
      </div>
      <div class="checkout-detail-copy">
        <div class="product-category">${product.category} / ${product.type}</div>
        <h2>${product.name}</h2>
        <p>
          ${product.desc || product.short || "상품 상세 안내를 확인하고 구매를 진행하세요."}
        </p>
        <div class="checkout-detail-grid">
          <div>
            <strong>구매 수량</strong>
            <span>${item.qty}개</span>
          </div>
          <div>
            <strong>상품 금액</strong>
            <span>${formatMoney(product.sale * item.qty)}</span>
          </div>
          <div>
            <strong>옵션</strong>
            <span>${product.option}</span>
          </div>
          <div>
            <strong>배송</strong>
            <span>${product.shippingFee ? `${formatMoney(product.shippingFee)} / 5만원 이상 무료` : "무료 배송"}</span>
          </div>
        </div>
        <div class="checkout-care-list">
          ${createCheckoutGuideItems(product).join("")}
        </div>
      </div>
    </article>
  `;
  }

  function getProductDetailImages(product) {
    const images = Array.isArray(product.detailImages)
      ? product.detailImages.filter(Boolean)
      : [];
    return (images.length ? images : [product.image])
      .filter(Boolean)
      .slice(0, 5);
  }

  function createCheckoutGuideItems(product) {
    const copy = categoryCopy[product.category] || categoryCopy["화장품"];
    return [
      `<div><strong>01</strong> ${copy.usage}</div>`,
      `<div><strong>02</strong> ${copy.material}</div>`,
      `<div><strong>03</strong> ${product.short || copy.benefits[0]}</div>`,
    ];
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
      const button = event.target.closest("button[data-key]");
      if (!button) return;

      const item = state.cart.find(
        (cartItem) => cartItem.cartKey === button.dataset.key,
      );
      if (!item) return;

      const product = getProduct(item.id);
      const variant = (product?.variants || []).find(
        (variantItem) => variantItem.sku === item.variantSku,
      );
      const nextQuantity = item.qty + Number(button.dataset.d);
      if (
        nextQuantity > getPurchasableStock(product || item, variant || item)
      ) {
        showToast("선택 옵션 재고를 초과할 수 없습니다.");
        return;
      }
      item.qty = nextQuantity;
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
    const productList = store.products || [];
    const categorySet = new Set(productList.map((product) => product.category));
    const hasRequiredCategories = CATEGORIES.every((category) =>
      categorySet.has(category),
    );

    if (productList.length < 10 || !hasRequiredCategories) {
      console.warn(
        "상품 데이터는 최소 10개와 지정된 3개 카테고리를 유지해야 합니다.",
      );
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
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

import { CATEGORIES, categoryCopy } from "../data/catalog.js";
import {
  calculatePointUseLimit,
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
  // Demo-only address lookup used on checkout. The profile/signup module has
  // the same shape so a real postcode API can replace both with one adapter later.
  const ADDRESS_LOOKUP_PRESETS = [
    {
      label: "기본 배송지",
      postcode: "06236",
      address: "서울시 강남구 테헤란로 000",
    },
    {
      label: "성수 물류센터",
      postcode: "04783",
      address: "서울시 성동구 연무장길 00",
    },
    {
      label: "마포 사무실",
      postcode: "04157",
      address: "서울시 마포구 양화로 00",
    },
    {
      label: "부산 센텀점",
      postcode: "48059",
      address: "부산시 해운대구 센텀중앙로 00",
    },
  ];
  const state = {
    // UI-only cart state. Persisted business records are created only after Pay now.
    activeCategory: "all",
    cart: [],
    pointToUse: 0,
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
    // All point calculations use product amount only.
    // Shipping fee is included in paidAmount but excluded from point earn/use limits.
    const subtotal = state.cart.reduce(
      (sum, item) => sum + item.sale * item.qty,
      0,
    );
    const shipping = subtotal > 0 && subtotal < 50000 ? 3000 : 0;
    const member = getCurrentMember();
    const pointUseLimit = calculatePointUseLimit({
      paidProductAmount: subtotal,
      memberPoints: member?.points || 0,
      maxPointUseRate: store.settings.maxPointUseRate,
    });
    const pointUsed = Math.min(
      Math.max(0, Math.floor(Number(state.pointToUse) || 0)),
      pointUseLimit,
    );
    state.pointToUse = pointUsed;

    return {
      subtotal,
      shipping,
      reward: getPurchasePoints(subtotal),
      pointBalance: member?.points || 0,
      pointUseLimit,
      pointUsed,
      total: subtotal + shipping - pointUsed,
      count: state.cart.reduce((sum, item) => sum + item.qty, 0),
    };
  }

  function getCurrentMember() {
    return store.members.find((member) => member.id === store.currentMemberId);
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
    document.querySelector("#addCart").addEventListener("click", () => {
      if (addToCart(product)) openCart();
    });
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
        <div class="cart-item-head">
          <h3>${item.name}<br />ㅣ${item.ko}</h3>
          <button class="cart-remove-button" type="button" data-remove-key="${escapeAttribute(item.cartKey)}" aria-label="${item.ko} 삭제">삭제</button>
        </div>
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

  function createCartSummary({
    subtotal,
    shipping,
    reward,
    pointBalance,
    pointUseLimit,
    pointUsed,
    total,
  }) {
    return `
    <div class="summary-row"><span>상품금액</span><strong>${formatMoney(subtotal)}</strong></div>
    <div class="summary-row"><span>배송비</span><strong>${shipping ? formatMoney(shipping) : "무료"}</strong></div>
    <div class="summary-row"><span>보유 포인트</span><strong>${formatPoints(pointBalance)}</strong></div>
    <label class="point-use-control">
      <span>사용 포인트 · 최대 ${formatPoints(pointUseLimit)}</span>
      <input class="quantity-input" id="cartPointUse" type="number" min="0" step="100" max="${pointUseLimit}" value="${pointUsed}" ${pointUseLimit ? "" : "disabled"} />
    </label>
    <div class="summary-row"><span>포인트 사용</span><strong>${pointUsed ? `-${formatPoints(pointUsed)}` : "0P"}</strong></div>
    <div class="summary-row"><span>적립 예정</span><strong>${formatPoints(reward)}</strong></div>
    <div class="summary-row total"><span>결제예정금액</span><strong>${formatMoney(total)}</strong></div>
    <button class="checkout-button" id="checkoutButton">Checkout</button>
  `;
  }

  function openCheckout() {
    // Checkout reads the current member's default shipping address once and
    // lets the user override it before completeBypassPayment stores an order snapshot.
    if (!requireLogin()) return;

    closeCart();
    const totals = getTotals();
    const member = getCurrentMember();
    const defaultAddress = getDefaultShippingAddress(member);

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
          <input class="quantity-input" id="customerName" value="${escapeAttribute(defaultAddress.recipient || member?.name || "")}" />
          <div class="quantity-row">
            <div>
              <label class="option-label" for="customerPhone">연락처</label>
              <input class="quantity-input" id="customerPhone" value="${escapeAttribute(defaultAddress.phone || member?.phone || "")}" />
            </div>
            <div>
              <label class="option-label" for="zipCode">우편번호</label>
              <div class="address-input-pair">
                <input class="quantity-input" id="zipCode" value="${escapeAttribute(defaultAddress.postcode || "")}" />
                <button class="cart-button address-search" type="button" data-checkout-address-search>조회</button>
              </div>
            </div>
          </div>
          <div class="checkout-address-actions">
            <button class="cart-button" type="button" data-checkout-saved-toggle>배송지 목록</button>
            <button class="cart-button" type="button" data-checkout-address-register-toggle>배송지 등록</button>
          </div>
          ${createCheckoutAddressLookup()}
          ${createCheckoutSavedAddresses(member)}
          ${createCheckoutAddressRegister(member)}
          <label class="option-label" for="address">배송지</label>
          <input class="quantity-input" id="address" value="${escapeAttribute(defaultAddress.address || "")}" />
          <label class="option-label" for="addressDetail">상세주소</label>
          <input class="quantity-input" id="addressDetail" value="${escapeAttribute(defaultAddress.addressDetail || "")}" />
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
    document
      .querySelector("#checkoutPointUse")
      ?.addEventListener("input", (event) => {
        state.pointToUse = event.currentTarget.value;
        openCheckout();
      });
    bindCheckoutAddressEvents();
  }

  function completeCheckoutBypass() {
    // This bypasses PG only. The resulting order, points, stock, referrals,
    // agency settlement, and shipping snapshot are persisted through the domain layer.
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
        pointUsed: getTotals().pointUsed,
        shippingSnapshot: readCheckoutShippingSnapshot(),
      },
    });
    state.cart = [];
    state.pointToUse = 0;
    persistStore(store);
    updateCart();
    openPaymentResult(result);
    showToast(
      `결제 완료: ${result.earnedPoints.toLocaleString("ko-KR")} 포인트가 적립 예정입니다.`,
    );
  }

  function createCheckoutAddressLookup() {
    return `
    <div class="address-lookup-panel checkout-address-lookup is-hidden" data-checkout-address-panel>
      <div class="address-lookup-head">
        <strong>배송지 조회 결과</strong>
        <span>선택하면 우편번호와 기본 주소가 자동 입력됩니다.</span>
      </div>
      <div class="address-lookup-list">
        ${ADDRESS_LOOKUP_PRESETS.map(
          (item) => `
          <button class="address-result-button" type="button" data-checkout-address-result data-postcode="${item.postcode}" data-address="${escapeAttribute(item.address)}">
            <strong>${item.label}</strong>
            <span>${item.postcode} ${item.address}</span>
          </button>
        `,
        ).join("")}
      </div>
    </div>
  `;
  }

  function createCheckoutSavedAddresses(member) {
    const addresses = normalizeShippingAddresses(member);
    if (!addresses.length) return "";

    return `
    <div class="checkout-saved-addresses is-hidden" data-checkout-saved-panel>
      <div class="address-lookup-head">
        <strong>저장 배송지</strong>
        <span>주문에 사용할 배송지를 선택하세요.</span>
      </div>
      <div class="address-lookup-list">
        ${addresses
          .map(
            (address) => `
            <button class="address-result-button" type="button" data-checkout-saved-address data-recipient="${escapeAttribute(address.recipient)}" data-phone="${escapeAttribute(address.phone)}" data-postcode="${escapeAttribute(address.postcode)}" data-address="${escapeAttribute(address.address)}" data-address-detail="${escapeAttribute(address.addressDetail)}">
              <strong>${escapeHtml(address.label)}${address.isDefault ? " · 기본" : ""}</strong>
              <span>${escapeHtml(address.postcode)} ${escapeHtml(address.address)} ${escapeHtml(address.addressDetail)}</span>
            </button>
          `,
          )
          .join("")}
      </div>
    </div>
  `;
  }

  function createCheckoutAddressRegister(member) {
    return `
    <div class="checkout-address-register is-hidden" data-checkout-address-register-panel>
      <div class="address-lookup-head">
        <strong>배송지 등록</strong>
        <span>자주 쓰는 배송지를 저장하고 현재 주문에 바로 적용합니다.</span>
      </div>
      <div class="checkout-register-grid">
        <label>배송지명<input class="quantity-input" id="newAddressLabel" value="추가 배송지" /></label>
        <label>수령인<input class="quantity-input" id="newAddressRecipient" value="${escapeAttribute(member?.name || "")}" /></label>
        <label>연락처<input class="quantity-input" id="newAddressPhone" value="${escapeAttribute(member?.phone || "")}" /></label>
        <label>우편번호<input class="quantity-input" id="newAddressPostcode" /></label>
        <label class="checkout-register-wide">배송지<input class="quantity-input" id="newAddressAddress" /></label>
        <label class="checkout-register-wide">상세주소<input class="quantity-input" id="newAddressDetail" /></label>
      </div>
      <div class="checkout-address-actions">
        <button class="cart-button" type="button" data-checkout-register-lookup>등록 주소 조회</button>
        <button class="buy-button" type="button" data-checkout-save-address>배송지 저장</button>
      </div>
      <div class="address-lookup-panel checkout-register-lookup is-hidden" data-checkout-register-lookup-panel>
        <div class="address-lookup-head">
          <strong>등록 주소 조회 결과</strong>
          <span>선택하면 등록 폼에 우편번호와 주소가 입력됩니다.</span>
        </div>
        <div class="address-lookup-list">
          ${ADDRESS_LOOKUP_PRESETS.map(
            (item) => `
            <button class="address-result-button" type="button" data-checkout-register-result data-postcode="${item.postcode}" data-address="${escapeAttribute(item.address)}">
              <strong>${item.label}</strong>
              <span>${item.postcode} ${item.address}</span>
            </button>
          `,
          ).join("")}
        </div>
      </div>
    </div>
  `;
  }

  function bindCheckoutAddressEvents() {
    // Saved address buttons and lookup result buttons both write to the same
    // checkout fields, keeping the order snapshot source simple.
    document
      .querySelector("[data-checkout-address-search]")
      ?.addEventListener("click", () => {
        document
          .querySelector("[data-checkout-address-panel]")
          ?.classList.toggle("is-hidden");
      });

    document
      .querySelector("[data-checkout-saved-toggle]")
      ?.addEventListener("click", () => {
        document
          .querySelector("[data-checkout-saved-panel]")
          ?.classList.toggle("is-hidden");
      });

    document
      .querySelector("[data-checkout-address-register-toggle]")
      ?.addEventListener("click", () => {
        document
          .querySelector("[data-checkout-address-register-panel]")
          ?.classList.toggle("is-hidden");
      });

    document
      .querySelector("[data-checkout-register-lookup]")
      ?.addEventListener("click", () => {
        document
          .querySelector("[data-checkout-register-lookup-panel]")
          ?.classList.toggle("is-hidden");
      });

    document
      .querySelectorAll("[data-checkout-address-result]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          setCheckoutField("#zipCode", button.dataset.postcode);
          setCheckoutField("#address", button.dataset.address);
          document
            .querySelector("[data-checkout-address-panel]")
            ?.classList.add("is-hidden");
          document.querySelector("#addressDetail")?.focus();
        });
      });

    document
      .querySelectorAll("[data-checkout-saved-address]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          setCheckoutField("#customerName", button.dataset.recipient);
          setCheckoutField("#customerPhone", button.dataset.phone);
          setCheckoutField("#zipCode", button.dataset.postcode);
          setCheckoutField("#address", button.dataset.address);
          setCheckoutField("#addressDetail", button.dataset.addressDetail);
        });
      });

    document
      .querySelectorAll("[data-checkout-register-result]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          setCheckoutField("#newAddressPostcode", button.dataset.postcode);
          setCheckoutField("#newAddressAddress", button.dataset.address);
          document
            .querySelector("[data-checkout-register-lookup-panel]")
            ?.classList.add("is-hidden");
          document.querySelector("#newAddressDetail")?.focus();
        });
      });

    document
      .querySelector("[data-checkout-save-address]")
      ?.addEventListener("click", saveCheckoutAddress);
  }

  function saveCheckoutAddress() {
    const member = getCurrentMember();
    if (!member) return;

    const address = {
      id: `addr-${Date.now()}`,
      label:
        document.querySelector("#newAddressLabel")?.value.trim() ||
        "추가 배송지",
      recipient:
        document.querySelector("#newAddressRecipient")?.value.trim() ||
        member.name ||
        "",
      phone:
        document.querySelector("#newAddressPhone")?.value.trim() ||
        member.phone ||
        "",
      postcode:
        document.querySelector("#newAddressPostcode")?.value.trim() || "",
      address: document.querySelector("#newAddressAddress")?.value.trim() || "",
      addressDetail:
        document.querySelector("#newAddressDetail")?.value.trim() || "",
      isDefault: false,
    };

    if (!address.postcode || !address.address) {
      showToast("배송지 조회 후 우편번호와 배송지를 입력해주세요.");
      return;
    }

    member.shippingAddresses = normalizeShippingAddresses(member);
    member.shippingAddresses.push(address);
    persistStore(store);
    setCheckoutField("#customerName", address.recipient);
    setCheckoutField("#customerPhone", address.phone);
    setCheckoutField("#zipCode", address.postcode);
    setCheckoutField("#address", address.address);
    setCheckoutField("#addressDetail", address.addressDetail);
    showToast("배송지를 등록하고 주문 배송지에 적용했습니다.");
    openCheckout();
    document
      .querySelector("[data-checkout-saved-panel]")
      ?.classList.remove("is-hidden");
  }

  function setCheckoutField(selector, value = "") {
    const field = document.querySelector(selector);
    if (field) field.value = value || "";
  }

  function readCheckoutShippingSnapshot() {
    return {
      recipient: document.querySelector("#customerName")?.value.trim() || "",
      phone: document.querySelector("#customerPhone")?.value.trim() || "",
      postcode: document.querySelector("#zipCode")?.value.trim() || "",
      address: document.querySelector("#address")?.value.trim() || "",
      addressDetail:
        document.querySelector("#addressDetail")?.value.trim() || "",
      paymentMethod: document.querySelector("#paymentMethod")?.value || "",
    };
  }

  function getDefaultShippingAddress(member) {
    const address = normalizeShippingAddresses(member).find(
      (item) => item.isDefault,
    );
    if (address) return address;

    return {
      recipient: member?.name || "",
      phone: member?.phone || "",
      postcode: member?.address?.postcode || "",
      address: member?.address?.address || "",
      addressDetail: member?.address?.addressDetail || "",
    };
  }

  function normalizeShippingAddresses(member) {
    const addresses = Array.isArray(member?.shippingAddresses)
      ? member.shippingAddresses
      : [];
    if (addresses.length) return addresses;
    if (!member?.address) return [];

    return [
      {
        label: "기본 배송지",
        recipient: member.name || "",
        phone: member.phone || "",
        postcode: member.address.postcode || "",
        address: member.address.address || "",
        addressDetail: member.address.addressDetail || "",
        isDefault: true,
      },
    ].filter((address) => address.postcode || address.address);
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
          PG 결제창은 우회 처리했고, 주문 금액과 포인트 적립 내역을 저장했습니다.
        </p>
      </div>
      <div class="management-grid">
        <article><span>주문번호</span><strong>${result.order.id}</strong></article>
        <article><span>실결제 상품금액</span><strong>${formatMoney(result.totals.paidProductAmount)}</strong></article>
        <article><span>배송비</span><strong>${result.totals.shippingAmount ? formatMoney(result.totals.shippingAmount) : "무료"}</strong></article>
        <article><span>포인트 사용</span><strong>${result.totals.pointUsed ? `-${result.totals.pointUsed.toLocaleString("ko-KR")}P` : "0P"}</strong></article>
        <article><span>적립 예정 포인트</span><strong>${result.earnedPoints.toLocaleString("ko-KR")}P</strong></article>
        <article><span>추천 링크 생성</span><strong>${result.referralLinks.length}개</strong></article>
        <article><span>처리 상태</span><strong>완료</strong></article>
      </div>
      <div class="payment-process">
        <div><strong>01 주문 생성</strong><span>${result.order.id} 주문을 paid 상태로 저장했습니다.</span></div>
        <div><strong>02 적립 예정</strong><span>${result.order.paidProductAmount.toLocaleString("ko-KR")}원 × ${store.settings.purchasePointRate}% = ${result.earnedPoints.toLocaleString("ko-KR")}P, 구매확정 후 실제 적립됩니다.</span></div>
        <div><strong>03 개인 추천링크</strong><span>구매 상품 종류 기준으로 ${result.referralLinks.length}개 링크를 생성했습니다.</span></div>
      </div>
      ${createReferralCopyPanel(result.referralLinks)}
      <div class="buy-actions result-actions">
        <button class="buy-button" type="button" id="resultBackToShop">Shop 계속 보기</button>
      </div>
    </section>
  `;

    showDetailView();
    document.querySelector("#backToShop").addEventListener("click", showHome);
    document
      .querySelector("#resultBackToShop")
      ?.addEventListener("click", showHome);
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

  function createCheckoutTotals({
    subtotal,
    shipping,
    reward,
    pointBalance,
    pointUseLimit,
    pointUsed,
    total,
  }) {
    return `
    <div class="detail-price-box">
      <div class="detail-price-item"><span>상품금액</span><strong>${formatMoney(subtotal)}</strong></div>
      <div class="detail-price-item"><span>배송비</span><strong>${shipping ? formatMoney(shipping) : "무료"}</strong></div>
      <div class="detail-price-item"><span>보유 포인트</span><strong>${formatPoints(pointBalance)}</strong></div>
      <div class="detail-price-item"><span>사용 가능</span><strong>${formatPoints(pointUseLimit)}</strong></div>
      <div class="detail-price-item point-input-item">
        <span>포인트 사용</span>
        <input class="quantity-input" id="checkoutPointUse" type="number" min="0" step="100" max="${pointUseLimit}" value="${pointUsed}" ${pointUseLimit ? "" : "disabled"} />
        <em>보유 ${formatPoints(pointBalance)} 중 최대 ${formatPoints(pointUseLimit)}까지 사용할 수 있습니다.</em>
      </div>
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
      const removeButton = event.target.closest("button[data-remove-key]");
      if (removeButton) {
        state.cart = state.cart.filter(
          (cartItem) => cartItem.cartKey !== removeButton.dataset.removeKey,
        );
        if (!state.cart.length) state.pointToUse = 0;
        updateCart();
        showToast("상품을 구매 목록에서 삭제했습니다.");
        return;
      }

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
      if (!state.cart.length) state.pointToUse = 0;
      updateCart();
    });

    dom.cartSummary.addEventListener("input", (event) => {
      if (event.target?.id !== "cartPointUse") return;
      state.pointToUse = event.target.value;
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

  function escapeAttribute(value) {
    return escapeHtml(value);
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

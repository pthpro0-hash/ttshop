const CATEGORIES = ["미용기구", "미용재료", "화장품"];

const products = [
  {
    id: "device-led",
    name: "LED Skin Lifting Device",
    ko: "LED 스킨 리프팅 디바이스",
    category: "미용기구",
    type: "Home Beauty Device",
    badge: "Best",
    price: 89000,
    sale: 76000,
    option: "1ea / Warm White",
    short: "집에서도 간편하게 사용하는 홈케어 미용기기.",
    desc: "피부 탄력 케어와 데일리 홈케어 루틴을 위해 설계한 감각적인 LED 미용기기입니다.",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "device-brush",
    name: "Scalp Massage Brush",
    ko: "스칼프 마사지 브러시",
    category: "미용기구",
    type: "Scalp Care Tool",
    badge: "New",
    price: 18000,
    sale: 15000,
    option: "1ea / Soft Silicone",
    short: "두피를 부드럽게 마사지해주는 실리콘 브러시.",
    desc: "샴푸와 함께 사용하면 두피를 개운하게 케어할 수 있는 소프트 실리콘 마사지 브러시입니다.",
    image:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "device-nail",
    name: "Nail Care Tool Set",
    ko: "네일 케어 툴 세트",
    category: "미용기구",
    type: "Nail Tool Set",
    badge: "Hot",
    price: 22000,
    sale: 18000,
    option: "3pcs Set / Silver",
    short: "셀프 네일 관리를 위한 기본 툴 세트.",
    desc: "큐티클 정리와 손톱 라인 케어를 집에서도 깔끔하게 할 수 있는 기본 네일 툴 구성입니다.",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mat-ampoule",
    name: "Salon Hair Ampoule Pack",
    ko: "살롱 헤어 앰플 팩",
    category: "미용재료",
    type: "Hair Treatment Material",
    badge: "Best",
    price: 32000,
    sale: 27000,
    option: "10ea / Repair",
    short: "손상 모발 집중 케어용 살롱 앰플.",
    desc: "거칠고 푸석한 모발에 영양감을 채워주는 살롱 스타일의 집중 헤어 케어 앰플 팩입니다.",
    image:
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mat-glue",
    name: "Professional Eyelash Glue",
    ko: "프로페셔널 속눈썹 글루",
    category: "미용재료",
    type: "Eyelash Material",
    badge: "New",
    price: 16000,
    sale: 13000,
    option: "5ml / Clear",
    short: "속눈썹 연장과 셀프 연출을 위한 전용 글루.",
    desc: "깔끔한 마무리와 안정적인 고정감을 고려한 속눈썹 전용 글루입니다.",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mat-pack",
    name: "Moisture Modeling Pack",
    ko: "모이스처 모델링 팩",
    category: "미용재료",
    type: "Esthetic Pack Material",
    badge: "Hot",
    price: 28000,
    sale: 23000,
    option: "5ea / Hydration",
    short: "에스테틱 느낌의 고보습 모델링 팩.",
    desc: "피부에 쿨링감과 수분감을 빠르게 전달하는 홈 에스테틱용 모델링 팩입니다.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cos-cream",
    name: "Calm Dew Barrier Cream",
    ko: "캄 듀 배리어 크림",
    category: "화장품",
    type: "Skincare Cream",
    badge: "Best",
    price: 38000,
    sale: 32000,
    option: "50ml / 무향",
    short: "속건조와 장벽 케어를 위한 촉촉한 데일리 크림.",
    desc: "민감한 피부도 매일 편안하게 사용할 수 있도록 무겁지 않은 보습막을 남기는 장벽 케어 크림입니다.",
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cos-serum",
    name: "Glass Skin Glow Serum",
    ko: "글래스 스킨 글로우 세럼",
    category: "화장품",
    type: "Skincare Serum",
    badge: "New",
    price: 42000,
    sale: 36000,
    option: "30ml / 윤광 케어",
    short: "피부결과 광채를 매끄럽게 정돈하는 수분 세럼.",
    desc: "끈적임 없이 흡수되는 워터 젤 텍스처로 피부결을 정돈하고 은은한 윤기를 더해주는 데일리 세럼입니다.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cos-lip",
    name: "Velvet Tint Balm",
    ko: "벨벳 틴트 밤",
    category: "화장품",
    type: "Makeup Lip Balm",
    badge: "Hot",
    price: 24000,
    sale: 19000,
    option: "03 Rose Fig",
    short: "입술은 편안하게, 컬러는 분위기 있게 남기는 틴트 밤.",
    desc: "밤처럼 부드럽게 발리면서 은은한 컬러가 남아 데일리 메이크업에 어울리는 립 제품입니다.",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cos-sun",
    name: "Daily Tone Up Sunscreen",
    ko: "데일리 톤업 선스크린",
    category: "화장품",
    type: "Sun Care SPF",
    badge: "Best",
    price: 30000,
    sale: 25000,
    option: "50ml / SPF50+ PA++++",
    short: "백탁은 줄이고 피부톤은 자연스럽게 정돈하는 선크림.",
    desc: "스킨케어 마지막 단계에서 피부톤을 자연스럽게 밝혀주고 자외선 차단까지 돕는 데일리 선케어입니다.",
    image:
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=80",
  },
];

const categoryCopy = {
  미용기구: {
    benefits: [
      "간편한 홈케어 루틴",
      "깔끔한 디자인과 보관성",
      "초보자도 쉬운 사용감",
    ],
    material: "미용기기 본체, 전용 패키지, 사용 설명서",
    usage:
      "세안 또는 샴푸 후 필요한 부위에 부드럽게 사용하세요. 사용 후에는 마른 천으로 닦아 보관합니다.",
    review:
      "디자인이 깔끔하고 집에서 관리하기 좋아 매일 손이 간다는 반응이 많습니다.",
  },
  미용재료: {
    benefits: [
      "살롱급 케어 루틴",
      "전문적인 사용감",
      "홈케어와 매장 사용 모두 적합",
    ],
    material: "전문 미용재료 베이스, 보습/케어 성분, 전용 패키지",
    usage:
      "제품 특성에 맞게 적정량을 덜어 사용하고, 필요한 경우 충분히 헹궈 마무리합니다.",
    review:
      "집에서도 관리받은 듯한 느낌이 나고 사용법이 어렵지 않다는 후기가 많습니다.",
  },
  화장품: {
    benefits: ["데일리 뷰티 루틴", "촉촉하고 편안한 사용감", "감각적인 패키지"],
    material: "보습 성분, 피부 컨디셔닝 성분, 식물 유래 추출물",
    usage:
      "기초 루틴 또는 메이크업 단계에 맞춰 적당량을 부드럽게 펴 발라주세요.",
    review: "발림성이 좋고 매일 쓰기 부담 없는 제품이라는 반응이 많습니다.",
  },
};

const state = {
  activeCategory: "all",
  cart: [],
};

const dom = {
  grid: document.querySelector("#productGrid"),
  home: document.querySelector("#homeView"),
  detail: document.querySelector("#detailView"),
  count: document.querySelector("#categoryCount"),
  bag: document.querySelector("#bagButton"),
  cartList: document.querySelector("#cartList"),
  cartSummary: document.querySelector("#cartSummary"),
  toast: document.querySelector("#toast"),
};

const formatMoney = (value) => `${Number(value).toLocaleString("ko-KR")}원`;
const getProduct = (id) => products.find((item) => item.id === id);
const getQuantity = () =>
  Math.max(1, Number(document.querySelector("#quantity")?.value || 1));

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

function renderProducts(category = "all") {
  state.activeCategory = category;

  document.querySelectorAll(".category-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === category);
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
    addToCart(product, "상품을 장바구니에 담고 주문 요약을 열었습니다.");
    openCart();
  });
}

function createPriceBox(product) {
  return `
    <div class="detail-price-box">
      <div class="detail-price-item"><span>판매가</span><strong>${formatMoney(product.price)}</strong></div>
      <div class="detail-price-item"><span>할인판매가</span><strong>${formatMoney(product.sale)}</strong></div>
      <div class="detail-price-item"><span>배송</span><strong>3,000원 / 5만원 이상 무료</strong></div>
      <div class="detail-price-item"><span>적립</span><strong>구매금액 3%</strong></div>
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
  const quantity = getQuantity();
  const item = state.cart.find((cartItem) => cartItem.id === product.id);

  if (item) {
    item.qty += quantity;
  } else {
    state.cart.push({ ...product, qty: quantity });
  }

  updateCart();
  showToast(message || `${product.ko} ${quantity}개가 장바구니에 담겼습니다.`);
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
    <div class="summary-row"><span>적립 예정</span><strong>${formatMoney(reward)}</strong></div>
    <div class="summary-row total"><span>결제예정금액</span><strong>${formatMoney(total)}</strong></div>
    <button class="checkout-button" id="checkoutButton">Checkout</button>
  `;
}

function openCheckout() {
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
  `;

  showDetailView();
  document.querySelector("#backToShop").addEventListener("click", showHome);
  document.querySelector("#openCartAgain").addEventListener("click", openCart);
  document
    .querySelector("#finalPay")
    .addEventListener("click", () =>
      showToast("결제가 완료되는 샘플 액션입니다."),
    );
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
      <div class="detail-price-item"><span>적립 예정</span><strong>${formatMoney(reward)}</strong></div>
      <div class="detail-price-item"><span>결제예정금액</span><strong>${formatMoney(total)}</strong></div>
    </div>
  `;
}

function showHome() {
  dom.detail.classList.add("is-hidden");
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

function bindEvents() {
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
    dom.home.classList.remove("is-hidden");
    renderProducts(state.activeCategory);
    scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll("[data-home-link]").forEach((link) => {
    link.addEventListener("click", () => {
      dom.detail.classList.add("is-hidden");
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

function init() {
  validateCatalog();
  bindEvents();
  renderProducts();
  updateCart();
}

init();

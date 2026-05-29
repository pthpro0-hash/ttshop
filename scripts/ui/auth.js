export function createAuthController({ dom, showHome, closeCart, showToast }) {
  function openAuth(mode = "login") {
    closeCart();
    dom.auth.innerHTML = createAuthView(mode);
    showAuthView();
    bindAuthEvents();
  }

  function createAuthView(mode) {
    const modeLabel = {
      login: "로그인",
      signup: "회원가입",
      complete: "Welcome",
    };

    return `
    <section class="auth-layout">
      <aside class="auth-brand">
        <button class="back-button" id="authBack">← Back to shop</button>
        <div>
          <div class="eyebrow">Beauty membership</div>
          <h1 class="auth-title">Join<br />The<br />Routine.</h1>
          <p class="auth-copy">
            첫 구매 쿠폰, 관심 카테고리 추천, 배송지 저장을 위한 쇼핑몰 회원 화면입니다.
            간편 가입은 외부 연동 없이 데모 화면 이동만 제공합니다.
          </p>
        </div>
        <div class="auth-benefits">
          <span>Welcome coupon</span>
          <span>Beauty picks</span>
          <span>Saved address</span>
        </div>
      </aside>
      <section class="auth-card">
        <div class="auth-tabs" aria-label="회원 메뉴">
          ${createAuthTab("login", "로그인", mode)}
          ${createAuthTab("signup", "회원가입", mode)}
        </div>
        <div class="auth-mode-label">${modeLabel[mode]}</div>
        ${createAuthPanel(mode)}
        ${mode !== "complete" ? createManagementAccess() : ""}
      </section>
    </section>
  `;
  }

  function createAuthTab(mode, label, activeMode) {
    return `<button class="auth-tab ${mode === activeMode ? "is-active" : ""}" data-auth-mode="${mode}">${label}</button>`;
  }

  function createAuthPanel(mode) {
    if (mode === "signup") return createSignupPanel();
    if (mode === "complete") return createAuthCompletePanel();

    return createLoginPanel();
  }

  function createSignupPanel() {
    return `
    <div class="signup-grid">
      <section class="signup-simple auth-panel">
        <div class="auth-intro">
          <strong>간편회원가입</strong>
          <p>자주 사용하는 계정으로 빠르게 가입하세요. 버튼 클릭 시 완료 화면으로 이동합니다.</p>
        </div>
        <div class="social-stack">
          ${createSocialButton("kakao", "카카오로 회원가입", "●")}
          ${createSocialButton("naver", "네이버로 회원가입", "N")}
          ${createSocialButton("apple", "Apple로 계속하기", "")}
        </div>
      </section>
      <section class="signup-general">
        ${createGeneralSignupPanel()}
      </section>
    </div>
  `;
  }

  function createGeneralSignupPanel() {
    return `
    <form class="auth-form" data-auth-form="signup">
      <label>아이디<input class="quantity-input" name="userId" placeholder="beauty_user" /></label>
      <label>비밀번호<input class="quantity-input" name="password" type="password" placeholder="8자 이상" /></label>
      <label>이름<input class="quantity-input" name="name" placeholder="홍길동" /></label>
      <label>휴대폰<input class="quantity-input" name="phone" placeholder="010-0000-0000" /></label>
      <label>이메일<input class="quantity-input" name="email" placeholder="beauty@example.com" /></label>
      ${createAddressFields()}
      <label class="auth-check"><input type="checkbox" checked /> 뷰티 혜택 및 첫 구매 쿠폰 안내 받기</label>
      <button class="buy-button auth-submit" type="submit">일반회원가입 완료</button>
      <p class="auth-note">비밀번호는 데모 화면용 입력값이며 저장/인증 로직은 구현하지 않았습니다.</p>
    </form>
  `;
  }

  function createLoginPanel() {
    return `
    <form class="auth-form login-form" data-auth-form="login">
      <div class="login-section-title">일반 로그인</div>
      <div class="login-box">
        <div class="login-visual" aria-hidden="true">
          <span></span>
        </div>
        <div class="login-fields">
          <label class="sr-only" for="loginUserId">아이디</label>
          <input class="quantity-input" id="loginUserId" name="userId" placeholder="아이디를 입력하세요." />
          <label class="sr-only" for="loginPassword">비밀번호</label>
          <input class="quantity-input" id="loginPassword" name="password" type="password" placeholder="비밀번호를 입력하세요." />
        </div>
        <button class="buy-button login-submit" type="submit">로그인</button>
      </div>
      <div class="login-options">
        <label class="login-save"><input type="checkbox" /> 아이디 저장</label>
        <div>
          <button type="button" data-auth-complete="아이디 찾기">아이디 찾기</button>
          <span>|</span>
          <button type="button" data-auth-complete="비밀번호 찾기">비밀번호 찾기</button>
        </div>
      </div>
      <div class="quick-login-row">
        ${createSocialButton("kakao", "카카오 로그인", "●")}
        ${createSocialButton("naver", "네이버 로그인", "N")}
        ${createSocialButton("apple", "Apple 로그인", "")}
        ${createSocialButton("google", "Google 로그인", "G")}
      </div>
      <div class="signup-callout">
        <div>
          <strong>잠깐! 아직 회원이 아니신가요?</strong>
          <p>첫 구매 쿠폰과 회원 전용 혜택을 받을 수 있습니다.</p>
        </div>
        <button class="buy-button" type="button" data-auth-mode="signup">회원가입</button>
      </div>
      <p class="auth-note">실제 로그인 검증 없이 다음 화면으로 이동하는 데모입니다.</p>
    </form>
  `;
  }

  function createAuthCompletePanel() {
    return `
    <div class="auth-complete">
      <div class="auth-mark">B</div>
      <h2>가입/로그인이 완료되었습니다.</h2>
      <p>BEAUTY REF.의 상품과 장바구니, 결제 화면을 계속 둘러볼 수 있습니다.</p>
      <button class="buy-button auth-submit" id="authGoShop">Shop 보러가기</button>
    </div>
  `;
  }

  function createManagementAccess() {
    return `
    <div class="auth-management" aria-label="관리 메뉴">
      <a href="#admin" data-management-link="admin">Admin</a>
      <a href="#agency" data-management-link="agency">Agency</a>
      <a href="#member" data-management-link="member">Member</a>
    </div>
  `;
  }

  function createSocialButton(provider, label, mark) {
    return `
    <button class="social-button social-${provider}" type="button" data-auth-complete="${label}">
      <span>${mark}</span>${label}
    </button>
  `;
  }

  function createAddressFields() {
    return `
    <div class="address-box">
      <div class="address-title">선택 배송지</div>
      <div class="quantity-row">
        <label>우편번호<input class="quantity-input" name="postcode" placeholder="06236" /></label>
        <button class="cart-button address-search" type="button">검색</button>
      </div>
      <label>배송지<input class="quantity-input" name="address" placeholder="서울시 강남구 테헤란로 000" /></label>
      <label>상세주소<input class="quantity-input" name="addressDetail" placeholder="동/호수 또는 요청사항" /></label>
    </div>
  `;
  }

  function bindAuthEvents() {
    document.querySelector("#authBack").addEventListener("click", showHome);
    document.querySelectorAll("[data-auth-mode]").forEach((button) => {
      button.addEventListener("click", () => openAuth(button.dataset.authMode));
    });
    document.querySelectorAll("[data-auth-complete]").forEach((button) => {
      button.addEventListener("click", () => {
        openAuth("complete");
        showToast(`${button.dataset.authComplete} 화면 이동이 완료되었습니다.`);
      });
    });
    document.querySelectorAll("[data-auth-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        openAuth("complete");
        showToast("데모 회원 화면 이동이 완료되었습니다.");
      });
    });
    document.querySelector("#authGoShop")?.addEventListener("click", showHome);
    document.querySelectorAll(".address-search").forEach((button) => {
      button.addEventListener("click", () =>
        showToast("우편번호 검색 UI 샘플입니다."),
      );
    });
  }

  function showAuthView() {
    dom.home.classList.add("is-hidden");
    dom.detail.classList.add("is-hidden");
    dom.management?.classList.add("is-hidden");
    dom.auth.classList.remove("is-hidden");
    scrollTo({ top: 0, behavior: "smooth" });
  }

  return { openAuth, showAuthView };
}

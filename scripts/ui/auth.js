export function createAuthController({
  dom,
  store,
  persistStore,
  updateSessionUi = () => {},
  showHome,
  closeCart,
  showToast,
}) {
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
    const pendingAgency = getPendingAgency();

    return `
    <form class="auth-form" data-auth-form="signup">
      <label>아이디<input class="quantity-input" name="userId" placeholder="beauty_user" /></label>
      <label>비밀번호<input class="quantity-input" name="password" type="password" placeholder="8자 이상" /></label>
      <label>이름<input class="quantity-input" name="name" placeholder="홍길동" /></label>
      <label>휴대폰<input class="quantity-input" name="phone" placeholder="010-0000-0000" /></label>
      <label>이메일<input class="quantity-input" name="email" placeholder="beauty@example.com" /></label>
      <label>대리점코드<input class="quantity-input" name="agencyCode" value="${pendingAgency?.code || ""}" placeholder="예: GNBEAUTY" /></label>
      ${createAddressFields()}
      <label class="auth-check"><input type="checkbox" checked /> 뷰티 혜택 및 첫 구매 쿠폰 안내 받기</label>
      <button class="buy-button auth-submit" type="submit">일반회원가입 완료</button>
      <p class="auth-note">대리점코드가 없거나 일치하지 않으면 본사 대리점 고객으로 등록됩니다.</p>
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
      <p class="auth-note">아이디가 기존 회원과 일치하면 해당 회원으로 로그인됩니다.</p>
    </form>
  `;
  }

  function createAuthCompletePanel() {
    const member = getCurrentMember();
    const agency = getMemberAgency(member);

    return `
    <div class="auth-complete">
      <div class="auth-mark">B</div>
      <h2>가입/로그인이 완료되었습니다.</h2>
      <p>${member?.name || "회원"}님은 ${agency?.name || "본사"} 고객으로 쇼핑을 진행합니다.</p>
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
        ensureQuickMember(button.dataset.authComplete);
        showToast(`${button.dataset.authComplete} 화면 이동이 완료되었습니다.`);
        openAuth("complete");
      });
    });
    document.querySelectorAll("[data-auth-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (form.dataset.authForm === "signup") {
          registerMember(form);
          showToast("회원가입이 완료되었습니다.");
        } else {
          loginMember(form);
          showToast("로그인이 완료되었습니다.");
        }
        openAuth("complete");
      });
    });
    document.querySelector("#authGoShop")?.addEventListener("click", showHome);
    document.querySelectorAll(".address-search").forEach((button) => {
      button.addEventListener("click", () =>
        showToast("우편번호 검색 UI 샘플입니다."),
      );
    });
  }

  function registerMember(form) {
    const agency =
      findAgencyByCode(getFormValue(form, "agencyCode")) ||
      getPendingAgency() ||
      getHeadquartersAgency();
    const memberId = `member-${Date.now()}`;
    const userId =
      getFormValue(form, "userId") || `user_${store.members.length + 1}`;

    store.members.push({
      id: memberId,
      userId,
      name: getFormValue(form, "name") || userId || "신규회원",
      phone: getFormValue(form, "phone"),
      email: getFormValue(form, "email"),
      agencyId: agency.id,
      points: 0,
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
      address: {
        postcode: getFormValue(form, "postcode"),
        address: getFormValue(form, "address"),
        addressDetail: getFormValue(form, "addressDetail"),
      },
    });
    store.currentMemberId = memberId;
    store.pendingAgencySlug = "";
    persistStore(store);
    updateSessionUi();
  }

  function loginMember(form) {
    const userId = getFormValue(form, "userId");
    const member =
      store.members.find((item) => item.userId === userId) ||
      store.members.find((item) => item.id === store.currentMemberId) ||
      store.members[0];

    store.currentMemberId = member.id;
    persistStore(store);
    updateSessionUi();
  }

  function getFormValue(form, name) {
    return String(form.querySelector(`[name="${name}"]`)?.value || "").trim();
  }

  function ensureQuickMember(label) {
    const existing = getCurrentMember();
    if (existing) return;

    const agency = getPendingAgency() || getHeadquartersAgency();
    const memberId = `member-${Date.now()}`;
    store.members.push({
      id: memberId,
      userId: `quick_${store.members.length + 1}`,
      name: label,
      phone: "",
      email: "",
      agencyId: agency.id,
      points: 0,
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
      address: {},
    });
    store.currentMemberId = memberId;
    persistStore(store);
    updateSessionUi();
  }

  function getCurrentMember() {
    return store.members.find((member) => member.id === store.currentMemberId);
  }

  function getMemberAgency(member) {
    return store.agencies.find((agency) => agency.id === member?.agencyId);
  }

  function findAgencyByCode(code) {
    const normalized = String(code || "")
      .trim()
      .toUpperCase();
    if (!normalized) return null;
    return store.agencies.find(
      (agency) => agency.code.toUpperCase() === normalized,
    );
  }

  function getPendingAgency() {
    const slug = store.pendingAgencySlug;
    if (!slug) return null;
    return store.agencies.find(
      (agency) => agency.linkSlug === slug || agency.code === slug,
    );
  }

  function getHeadquartersAgency() {
    return store.agencies.find((agency) => agency.isHeadquarters);
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

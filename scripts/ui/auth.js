import { formatMoney } from "../utils/format.js";

export function createAuthController({
  dom,
  store,
  persistStore,
  updateSessionUi = () => {},
  showHome,
  closeCart,
  showToast,
}) {
  migrateMemberAuthDefaults();

  function openAuth(mode = "login") {
    closeCart();
    dom.auth.innerHTML = createAuthView(mode);
    showAuthView();
    bindAuthEvents();
  }

  function closeAuth() {
    dom.auth.classList.add("is-hidden");
    dom.auth.innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  function openProfile() {
    const member = getCurrentMember();
    if (!member) {
      openAuth("login");
      return;
    }

    closeCart();
    dom.auth.innerHTML = createProfileView(member);
    showAuthView();
    bindProfileEvents();
  }

  function createAuthView(mode) {
    const modeLabel = {
      login: "로그인",
      signup: "회원가입",
      complete: "Welcome",
    };

    return `
    <section class="auth-dialog" role="dialog" aria-modal="true" aria-label="${modeLabel[mode]}">
      <button class="cart-close auth-close" id="authClose" type="button" aria-label="회원 팝업 닫기">×</button>
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
      <p class="auth-error" data-auth-error aria-live="polite"></p>
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
      <p class="auth-error" data-auth-error aria-live="polite"></p>
      <p class="auth-note">회원가입한 아이디와 비밀번호가 일치해야 로그인됩니다.</p>
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

  function createProfileView(member) {
    const orders = store.orders.filter((order) => order.memberId === member.id);
    const points = store.pointLedger.filter(
      (point) => point.memberId === member.id,
    );
    const links = store.personalReferralLinks.filter(
      (link) => link.ownerMemberId === member.id,
    );

    return `
    <section class="auth-dialog profile-dialog" role="dialog" aria-modal="true" aria-label="내정보">
      <button class="cart-close auth-close" id="profileClose" type="button" aria-label="내정보 닫기">×</button>
      <section class="auth-card profile-card">
        <div class="profile-head">
          <div>
            <div class="product-category">Member / My information</div>
            <h2>내정보</h2>
          </div>
          <p>아이디는 변경할 수 없습니다. 배송지, 연락처, 수신 설정은 쇼핑몰 주문 기준 정보로 저장됩니다.</p>
        </div>
        <form class="profile-form" data-profile-form>
          <div class="profile-form-grid">
            <label>아이디<input class="quantity-input" name="userId" value="${escapeAttribute(member.userId || member.id)}" readonly /></label>
            <label>이름<input class="quantity-input" name="name" value="${escapeAttribute(member.name)}" /></label>
            <label>휴대폰<input class="quantity-input" name="phone" value="${escapeAttribute(member.phone)}" /></label>
            <label>이메일<input class="quantity-input" name="email" value="${escapeAttribute(member.email)}" /></label>
            <label>우편번호<input class="quantity-input" name="postcode" value="${escapeAttribute(member.address?.postcode)}" /></label>
            <label class="profile-wide">배송지<input class="quantity-input" name="address" value="${escapeAttribute(member.address?.address)}" /></label>
            <label class="profile-wide">상세주소<input class="quantity-input" name="addressDetail" value="${escapeAttribute(member.address?.addressDetail)}" /></label>
            <label>기본 결제수단
              <select class="option-select" name="paymentMethod">
                ${createOption("신용카드", member.paymentMethod)}
                ${createOption("카카오페이", member.paymentMethod)}
                ${createOption("네이버페이", member.paymentMethod)}
                ${createOption("무통장입금", member.paymentMethod)}
              </select>
            </label>
            <label>관심 카테고리
              <select class="option-select" name="favoriteCategory">
                ${createOption("미용기구", member.favoriteCategory)}
                ${createOption("미용재료", member.favoriteCategory)}
                ${createOption("화장품", member.favoriteCategory)}
              </select>
            </label>
            <label class="auth-check profile-wide"><input type="checkbox" name="marketingOptIn" ${member.marketingOptIn === false ? "" : "checked"} /> 쇼핑 혜택 및 배송 알림 수신</label>
          </div>
          <div class="buy-actions profile-actions">
            <button class="buy-button" type="submit">내정보 저장</button>
            <button class="cart-button" type="button" data-profile-close>닫기</button>
          </div>
        </form>
        <div class="profile-summary-grid">
          <article><span>보유 포인트</span><strong>${member.points.toLocaleString("ko-KR")}P</strong></article>
          <article><span>구매이력</span><strong>${orders.length}건</strong></article>
          <article><span>추천 링크</span><strong>${links.length}개</strong></article>
        </div>
        <div class="profile-history-grid">
          <section>
            <div class="product-category">구매이력</div>
            <div class="profile-list">
              ${orders.map(createProfileOrderRow).join("") || '<div class="admin-detail-empty">구매이력이 없습니다.</div>'}
            </div>
          </section>
          <section>
            <div class="product-category">포인트 적립/사용 이력</div>
            <div class="profile-list">
              ${points.map(createProfilePointRow).join("") || '<div class="admin-detail-empty">포인트 이력이 없습니다.</div>'}
            </div>
          </section>
        </div>
      </section>
    </section>
  `;
  }

  function createOption(value, selectedValue) {
    return `<option value="${value}" ${value === selectedValue ? "selected" : ""}>${value}</option>`;
  }

  function createProfileOrderRow(order) {
    const firstItem = order.items?.[0];

    return `
    <article class="profile-row">
      <div><strong>${order.id}</strong><span>${order.paidAt} · ${order.status}</span></div>
      <div><span>${firstItem?.productKo || "상품"}</span><strong>${formatMoney(order.paidProductAmount)}</strong></div>
    </article>
  `;
  }

  function createProfilePointRow(point) {
    const typeLabel = point.amount >= 0 ? "적립" : "사용";

    return `
    <article class="profile-row">
      <div><strong>${typeLabel} ${Math.abs(point.amount).toLocaleString("ko-KR")}P</strong><span>${point.note}</span></div>
      <div><span>기준 금액</span><strong>${formatMoney(point.baseAmount)}</strong></div>
    </article>
  `;
  }

  function bindProfileEvents() {
    document
      .querySelector("#profileClose")
      ?.addEventListener("click", closeAuth);
    dom.auth.addEventListener("click", (event) => {
      if (event.target === dom.auth) closeAuth();
    });
    document
      .querySelector("[data-profile-close]")
      ?.addEventListener("click", closeAuth);
    document
      .querySelector("[data-profile-form]")
      ?.addEventListener("submit", (event) => {
        event.preventDefault();
        saveProfile(event.currentTarget);
        persistStore(store);
        updateSessionUi();
        showToast("내정보가 저장되었습니다.");
        openProfile();
      });
  }

  function saveProfile(form) {
    const member = getCurrentMember();
    if (!member) return;

    member.name = getFormValue(form, "name") || member.name;
    member.phone = getFormValue(form, "phone");
    member.email = getFormValue(form, "email");
    member.paymentMethod = getFormValue(form, "paymentMethod");
    member.favoriteCategory = getFormValue(form, "favoriteCategory");
    member.marketingOptIn = Boolean(
      form.querySelector('[name="marketingOptIn"]')?.checked,
    );
    member.address = {
      postcode: getFormValue(form, "postcode"),
      address: getFormValue(form, "address"),
      addressDetail: getFormValue(form, "addressDetail"),
    };
  }

  function bindAuthEvents() {
    document.querySelector("#authClose")?.addEventListener("click", closeAuth);
    dom.auth.addEventListener("click", (event) => {
      if (event.target === dom.auth) closeAuth();
    });
    document.querySelectorAll("[data-auth-mode]").forEach((button) => {
      button.addEventListener("click", () => openAuth(button.dataset.authMode));
    });
    document.querySelectorAll("[data-auth-complete]").forEach((button) => {
      button.addEventListener("click", () => {
        ensureQuickMember(button.dataset.authComplete);
        showToast(`${button.dataset.authComplete} 화면 이동이 완료되었습니다.`);
        closeAuth();
      });
    });
    document.querySelectorAll("[data-auth-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        let isValid = false;
        if (form.dataset.authForm === "signup") {
          isValid = registerMember(form);
          if (isValid) showToast("회원가입이 완료되었습니다.");
        } else {
          isValid = loginMember(form);
          if (isValid) showToast("로그인이 완료되었습니다.");
        }
        if (!isValid) return;

        closeAuth();
      });
    });
    document.querySelector("#authGoShop")?.addEventListener("click", closeAuth);
    document.querySelectorAll(".address-search").forEach((button) => {
      button.addEventListener("click", () =>
        showToast("우편번호 검색 UI 샘플입니다."),
      );
    });
  }

  function registerMember(form) {
    clearFormError(form);
    const userId = normalizeUserId(getFormValue(form, "userId"));
    const password = getFormValue(form, "password");

    if (!userId) {
      setFormError(form, "아이디를 입력해주세요.");
      return false;
    }
    if (password.length < 8) {
      setFormError(form, "비밀번호는 8자 이상 입력해주세요.");
      return false;
    }
    if (findMemberByUserId(userId)) {
      setFormError(
        form,
        "이미 가입된 아이디입니다. 다른 아이디를 입력해주세요.",
      );
      return false;
    }

    const agency =
      findAgencyByCode(getFormValue(form, "agencyCode")) ||
      getPendingAgency() ||
      getHeadquartersAgency();
    const memberId = `member-${Date.now()}`;

    store.members.push({
      id: memberId,
      userId,
      passwordHash: hashPassword(userId, password),
      authProvider: "password",
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
    return true;
  }

  function loginMember(form) {
    clearFormError(form);
    const userId = normalizeUserId(getFormValue(form, "userId"));
    const password = getFormValue(form, "password");
    const member = findMemberByUserId(userId);

    if (!userId || !password) {
      setFormError(form, "아이디와 비밀번호를 모두 입력해주세요.");
      return false;
    }
    if (
      !member ||
      member.status !== "active" ||
      !member.passwordHash ||
      member.passwordHash !== hashPassword(userId, password)
    ) {
      setFormError(form, "아이디 또는 비밀번호가 일치하지 않습니다.");
      return false;
    }

    store.currentMemberId = member.id;
    persistStore(store);
    updateSessionUi();
    return true;
  }

  function getFormValue(form, name) {
    return String(form.querySelector(`[name="${name}"]`)?.value || "").trim();
  }

  function setFormError(form, message) {
    const error = form.querySelector("[data-auth-error]");
    if (error) error.textContent = message;
  }

  function clearFormError(form) {
    setFormError(form, "");
  }

  function normalizeUserId(userId) {
    return String(userId || "")
      .trim()
      .toLowerCase();
  }

  function findMemberByUserId(userId) {
    const normalized = normalizeUserId(userId);
    return store.members.find(
      (member) => normalizeUserId(member.userId) === normalized,
    );
  }

  function hashPassword(userId, password) {
    const source = `${normalizeUserId(userId)}:${password}:beauty-ref-demo-v1`;
    let hash = 2166136261;

    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  function migrateMemberAuthDefaults() {
    let changed = false;
    store.members.forEach((member) => {
      if (member.userId === "beauty_user" && !member.passwordHash) {
        member.passwordHash = hashPassword(member.userId, "password123");
        member.authProvider = "password";
        changed = true;
      }
      if (!member.authProvider) {
        member.authProvider = member.passwordHash ? "password" : "social";
        changed = true;
      }
    });
    if (changed) persistStore(store);
  }

  function escapeAttribute(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
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
      authProvider: "social",
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
    dom.auth.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
  }

  return { openAuth, openProfile, closeAuth, showAuthView };
}

import { formatMoney } from "../utils/format.js";
import { confirmPurchase } from "../domain/order-processing.js";

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
  // Demo-only address lookup data. Replace this list with a postcode API adapter
  // when connecting to a real shipping address service.
  const ADDRESS_LOOKUP_PRESETS = [
    {
      label: "강남 쇼룸",
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
    // Member self-service is opened from the header member name.
    // Admin/Agency management links are reserved for back-office roles only.
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

  function openManagementLogin(role, onSuccess = () => {}) {
    closeCart();
    dom.auth.innerHTML = createManagementLoginView(role);
    showAuthView();
    bindManagementLoginEvents(role, onSuccess);
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
      <label>아이디<input class="quantity-input" name="userId" placeholder="beauty01" /></label>
      <label>비밀번호<input class="quantity-input" name="password" type="password" placeholder="영문+숫자 8자 이상" /></label>
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

    return `
    <div class="auth-complete">
      <div class="auth-mark">B</div>
      <h2>가입/로그인이 완료되었습니다.</h2>
      <p>${member?.name || "회원"}님, 쇼핑을 계속 진행할 수 있습니다.</p>
      <button class="buy-button auth-submit" id="authGoShop">Shop 보러가기</button>
    </div>
  `;
  }

  function createManagementAccess() {
    // Keep this footer limited to back-office entry points.
    // The old Member shortcut was removed to avoid duplicate member navigation.
    return `
    <div class="auth-management" aria-label="관리 메뉴">
      <a href="#admin" data-management-link="admin">Admin</a>
      <a href="#agency" data-management-link="agency">Agency</a>
    </div>
  `;
  }

  function createManagementLoginView(role) {
    const isAdmin = role === "admin";
    const title = isAdmin ? "Admin Login" : "Agency Login";
    const label = isAdmin ? "관리자 로그인" : "대리점 로그인";
    const note = isAdmin
      ? "관리자 전용 아이디와 비밀번호로 접속합니다."
      : "Admin에서 발급한 대리점별 아이디와 비밀번호로 접속합니다.";
    const defaultUserId = isAdmin ? "adminChang" : "";
    const defaultPassword = isAdmin ? "Chang$0909" : "";

    return `
    <section class="auth-dialog" role="dialog" aria-modal="true" aria-label="${label}">
      <button class="cart-close auth-close" id="authClose" type="button" aria-label="${label} 닫기">×</button>
      <section class="auth-card management-login-card">
        <div class="profile-head">
          <div>
            <div class="product-category">${title}</div>
            <h2>${label}</h2>
          </div>
          <p>${note}</p>
        </div>
        <form class="auth-form login-form" data-management-login="${role}">
          <div class="login-box">
            <div class="login-visual" aria-hidden="true"><span></span></div>
            <div class="login-fields">
              <label class="sr-only" for="managementUserId">아이디</label>
              <input class="quantity-input" id="managementUserId" name="userId" value="${defaultUserId}" placeholder="아이디를 입력하세요." />
              <label class="sr-only" for="managementPassword">비밀번호</label>
              <input class="quantity-input" id="managementPassword" name="password" type="password" value="${defaultPassword}" placeholder="비밀번호를 입력하세요." />
            </div>
            <button class="buy-button login-submit" type="submit">${label}</button>
          </div>
          <p class="auth-error" data-auth-error aria-live="polite"></p>
          <p class="auth-note">${note}</p>
        </form>
        ${createManagementAccess()}
      </section>
    </section>
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
        <button class="cart-button address-search" type="button" data-address-search>배송지 조회</button>
      </div>
      ${createAddressLookupPanel()}
      <label>배송지<input class="quantity-input" name="address" placeholder="서울시 강남구 테헤란로 000" /></label>
      <label>상세주소<input class="quantity-input" name="addressDetail" placeholder="동/호수 또는 요청사항" /></label>
    </div>
  `;
  }

  function createAddressLookupPanel(prefix = "") {
    return `
    <div class="address-lookup-panel is-hidden" data-address-panel="${prefix}">
      <div class="address-lookup-head">
        <strong>배송지 조회 결과</strong>
        <span>주소를 선택하면 우편번호와 배송지가 자동 입력됩니다.</span>
      </div>
      <div class="address-lookup-list">
        ${ADDRESS_LOOKUP_PRESETS.map(
          (item) => `
          <button class="address-result-button" type="button" data-address-result data-address-prefix="${prefix}" data-postcode="${item.postcode}" data-address="${escapeAttribute(item.address)}">
            <strong>${item.label}</strong>
            <span>${item.postcode} ${item.address}</span>
          </button>
        `,
        ).join("")}
      </div>
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
    const stats = createProfileStats({ member, orders, points, links });
    const extraAddress =
      (member.shippingAddresses || []).find((address) => !address.isDefault) ||
      {};

    // 상단 탭을 단일 내비게이션으로 유지해 개인회원 화면의 중복 메뉴를 막는다.
    return `
    <section class="auth-dialog profile-dialog" role="dialog" aria-modal="true" aria-label="내정보">
      <button class="cart-close auth-close" id="profileClose" type="button" aria-label="내정보 닫기">×</button>
      <section class="auth-card profile-card">
        <div class="profile-service-head">
          <div class="profile-member-main">
            <div class="profile-avatar" aria-hidden="true">${escapeHtml(createMemberInitial(member))}</div>
            <div class="profile-identity">
              <div class="product-category">Member / My page</div>
              <h2>${escapeHtml(member.name || member.userId || "회원")}님</h2>
              <p>
                ${member.joinedAt || "가입일 없음"} 가입 ·
                ${createMemberStatusLabel(member.status)}
              </p>
            </div>
          </div>
          <div class="profile-quick-actions">
            <button class="buy-button" type="button" data-profile-close>닫기</button>
          </div>
        </div>
        <section class="profile-wallet-overview">
          <div class="profile-wallet-main">
            <span>사용 가능 포인트</span>
            <strong>${member.points.toLocaleString("ko-KR")}P</strong>
            <em>예정 ${stats.pendingPoints.toLocaleString("ko-KR")}P · 이번달 적립 ${stats.monthEarned.toLocaleString("ko-KR")}P · 사용 ${stats.monthUsed.toLocaleString("ko-KR")}P</em>
          </div>
          <div class="profile-next-action">
            <span>최근 주문</span>
            <strong>${stats.latestOrder?.id || "주문 없음"}</strong>
            <em>${stats.latestOrder ? `${stats.latestOrder.paidAt} · ${formatMoney(stats.latestOrder.paidAmount)}` : "첫 주문을 기다리고 있습니다."}</em>
          </div>
        </section>
        <nav class="profile-top-nav" aria-label="내정보 메뉴">
          ${createProfileTabButton("account", "계정/배송지", true)}
          ${createProfileTabButton("orders", "구매 내역", false)}
          ${createProfileTabButton("points", "포인트 관리", false)}
          ${createProfileTabButton("links", "추천 링크", false)}
          ${createProfileTabButton("security", "보안", false)}
        </nav>
        <div class="profile-summary-grid">
          <button type="button" data-profile-section="orders" data-profile-tab="orders"><span>주문</span><strong>${orders.length}건</strong><em>누적 ${formatMoney(stats.totalPaid)}</em></button>
          <button type="button" data-profile-section="points" data-profile-tab="points"><span>포인트</span><strong>${member.points.toLocaleString("ko-KR")}P</strong><em>예정 ${stats.pendingPoints.toLocaleString("ko-KR")}P</em></button>
          <button type="button" data-profile-section="links" data-profile-tab="links"><span>추천</span><strong>${links.length}개</strong><em>활성 ${stats.activeLinks}개</em></button>
          <div class="profile-status-card"><span>이번달</span><strong>${formatMoney(stats.monthPaid)}</strong><em>${stats.monthOrderCount}건 결제</em></div>
        </div>
        <div class="profile-service-layout">
          <div class="profile-tab-panels">
            <section class="profile-tab-panel" data-profile-panel="account">
              <div class="profile-section-head">
                <div>
                  <div class="product-category">Account</div>
                  <h3>계정과 배송지</h3>
                </div>
                <p>아이디는 변경할 수 없습니다. 주문과 배송에 필요한 기본 정보를 관리합니다.</p>
              </div>
              <form class="profile-form" data-profile-form>
                <div class="profile-form-stack">
                  <section class="profile-field-card profile-field-card--primary">
                    <div class="profile-field-title">
                      <span>기본 정보</span>
                      <em>로그인 아이디는 변경할 수 없습니다.</em>
                    </div>
                    <div class="profile-form-grid">
                      <label>아이디<input class="quantity-input" name="userId" value="${escapeAttribute(member.userId || member.id)}" readonly /></label>
                      <label>이름<input class="quantity-input" name="name" value="${escapeAttribute(member.name)}" /></label>
                      <label>휴대폰<input class="quantity-input" name="phone" value="${escapeAttribute(member.phone)}" /></label>
                      <label>이메일<input class="quantity-input" name="email" value="${escapeAttribute(member.email)}" /></label>
                    </div>
                  </section>

                  <section class="profile-field-card">
                    <div class="profile-field-title">
                      <span>기본 배송지</span>
                      <em>주문서에 우선 적용되는 배송 정보입니다.</em>
                    </div>
                    <div class="profile-form-grid profile-address-grid">
                      <label>우편번호
                        <span class="address-input-pair">
                          <input class="quantity-input" name="postcode" value="${escapeAttribute(member.address?.postcode)}" />
                          <button class="cart-button address-search" type="button" data-address-search>조회</button>
                        </span>
                      </label>
                      <label class="profile-wide">배송지<input class="quantity-input" name="address" value="${escapeAttribute(member.address?.address)}" /></label>
                      <label class="profile-wide">상세주소<input class="quantity-input" name="addressDetail" value="${escapeAttribute(member.address?.addressDetail)}" /></label>
                      <div class="profile-address-lookup">${createAddressLookupPanel()}</div>
                    </div>
                  </section>

                  <div class="profile-field-split">
                    <section class="profile-field-card profile-address-overview">
                      <div class="profile-field-title">
                        <span>배송지 목록</span>
                        <em>저장된 배송지를 확인합니다.</em>
                      </div>
                      ${createShippingAddressList(member)}
                    </section>
                    <section class="profile-field-card profile-extra-address">
                      <div class="profile-field-title">
                        <span>추가 배송지</span>
                        <em>자택, 매장, 회사 등 자주 쓰는 주소를 등록합니다.</em>
                      </div>
                      <div class="profile-form-grid nested">
                        <label>배송지명<input class="quantity-input" name="extraAddressLabel" value="${escapeAttribute(extraAddress.label)}" placeholder="자택 / 매장 / 회사" /></label>
                        <label>수령인<input class="quantity-input" name="extraAddressRecipient" value="${escapeAttribute(extraAddress.recipient)}" /></label>
                        <label>연락처<input class="quantity-input" name="extraAddressPhone" value="${escapeAttribute(extraAddress.phone)}" /></label>
                        <label>우편번호
                          <span class="address-input-pair">
                            <input class="quantity-input" name="extraAddressPostcode" value="${escapeAttribute(extraAddress.postcode)}" />
                            <button class="cart-button address-search" type="button" data-address-search data-address-prefix="extraAddress">조회</button>
                          </span>
                        </label>
                        <label class="profile-wide">배송지<input class="quantity-input" name="extraAddressAddress" value="${escapeAttribute(extraAddress.address)}" /></label>
                        <label class="profile-wide">상세주소<input class="quantity-input" name="extraAddressDetail" value="${escapeAttribute(extraAddress.addressDetail)}" /></label>
                        <div class="profile-wide">${createAddressLookupPanel("extraAddress")}</div>
                      </div>
                    </section>
                  </div>

                  <section class="profile-field-card profile-preference-card">
                    <div class="profile-field-title">
                      <span>쇼핑 설정</span>
                      <em>결제와 혜택 안내에 사용할 기본 설정입니다.</em>
                    </div>
                    <div class="profile-form-grid profile-preference-grid">
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
                  </section>
                </div>
                <div class="buy-actions profile-actions">
                  <button class="buy-button" type="submit">변경사항 저장</button>
                </div>
              </form>
            </section>
            <section class="profile-tab-panel is-hidden" data-profile-panel="orders">
              ${createProfileOrderDashboard(sortOrderHistory(orders), stats)}
              ${createExpandableProfileSection("orders", "구매 내역", sortOrderHistory(orders), createProfileOrderRow, "구매이력이 없습니다.")}
              <section class="profile-order-detail is-hidden" id="profileOrderDetail" aria-live="polite"></section>
            </section>
            <section class="profile-tab-panel is-hidden" data-profile-panel="points">
              ${createProfilePointDashboard(points, stats)}
              ${createExpandableProfileSection("points", "포인트 적립/사용 이력", sortPointHistory(points), createProfilePointRow, "포인트 이력이 없습니다.")}
            </section>
            <section class="profile-tab-panel is-hidden" data-profile-panel="links">
              ${createProfileReferralDashboard(links)}
              ${createExpandableProfileSection("links", "추천 링크", links, createProfileLinkRow, "추천 링크가 없습니다.")}
            </section>
            <section class="profile-tab-panel is-hidden" data-profile-panel="security">
              <div class="profile-section-head">
                <div>
                  <div class="product-category">Security</div>
                  <h3>비밀번호 변경</h3>
                </div>
                <p>기존 비밀번호 검증 후 새 비밀번호를 저장합니다.</p>
              </div>
              <form class="profile-form password-form" data-password-form>
                <div class="profile-form-grid password-grid">
                  <label>기존 비밀번호<input class="quantity-input" name="currentPassword" type="password" /></label>
                  <label>새 비밀번호<input class="quantity-input" name="newPassword" type="password" placeholder="영문+숫자 8자 이상" /></label>
                  <label>새 비밀번호 확인<input class="quantity-input" name="confirmPassword" type="password" /></label>
                  <button class="buy-button" type="submit">비밀번호 변경</button>
                </div>
                <p class="auth-error" data-password-error aria-live="polite"></p>
              </form>
            </section>
          </div>
        </div>
      </section>
    </section>
  `;
  }

  function createProfileStats({ member, orders, points, links }) {
    const monthPrefix = new Date().toISOString().slice(0, 7);
    const monthOrders = orders.filter((order) =>
      String(order.paidAt || "").startsWith(monthPrefix),
    );
    const earnedPoints = points
      .filter((point) => Number(point.amount) > 0 && !isPendingPoint(point))
      .reduce((sum, point) => sum + Number(point.amount || 0), 0);
    const pendingPoints = points
      .filter(isPendingPoint)
      .reduce((sum, point) => sum + Number(point.amount || 0), 0);
    const usedPoints = points
      .filter((point) => Number(point.amount) < 0)
      .reduce((sum, point) => sum + Math.abs(Number(point.amount || 0)), 0);
    const monthEarned = points
      .filter(
        (point) =>
          Number(point.amount) > 0 &&
          !isPendingPoint(point) &&
          String(point.createdAt || "").startsWith(monthPrefix),
      )
      .reduce((sum, point) => sum + Number(point.amount || 0), 0);
    const monthUsed = points
      .filter(
        (point) =>
          Number(point.amount) < 0 &&
          String(point.createdAt || "").startsWith(monthPrefix),
      )
      .reduce((sum, point) => sum + Math.abs(Number(point.amount || 0)), 0);
    const latestOrder = sortOrderHistory(orders)[0];

    return {
      activeLinks: links.filter((link) => link.status === "active").length,
      earnedPoints,
      latestOrder,
      monthEarned,
      monthOrderCount: monthOrders.length,
      monthPaid: monthOrders.reduce(
        (sum, order) => sum + Number(order.paidAmount || 0),
        0,
      ),
      monthUsed,
      pendingPoints,
      totalPaid: orders.reduce(
        (sum, order) => sum + Number(order.paidAmount || 0),
        0,
      ),
      usedPoints,
    };
  }

  function createProfileTabButton(tab, label, isActive) {
    return `
    <button class="${isActive ? "is-active" : ""}" type="button" data-profile-tab="${tab}">
      ${label}
    </button>
  `;
  }

  function createMemberInitial(member) {
    return String(member.name || member.userId || "M")
      .trim()
      .slice(0, 1);
  }

  function createProfileOrderDashboard(orders, stats) {
    return `
    <div class="profile-section-head">
      <div>
        <div class="product-category">Orders</div>
        <h3>구매 내역</h3>
      </div>
      <p>최근 주문 상태와 결제 금액을 확인하고, 주문별 상세 내역을 열어볼 수 있습니다.</p>
    </div>
    <div class="profile-insight-grid">
      <article><span>최근 주문</span><strong>${stats.latestOrder?.id || "-"}</strong><em>${stats.latestOrder?.paidAt || "주문 없음"}</em></article>
      <article><span>누적 결제</span><strong>${formatMoney(stats.totalPaid)}</strong><em>배송비 포함 결제금액</em></article>
      <article><span>이번달 주문</span><strong>${stats.monthOrderCount}건</strong><em>${formatMoney(stats.monthPaid)}</em></article>
    </div>
    <div class="profile-order-status-strip">
      ${createOrderStatusCount(orders, "preparing", "상품준비")}
      ${createOrderStatusCount(orders, "shipping", "배송중")}
      ${createOrderStatusCount(orders, "delivered", "배송완료")}
      ${createOrderStatusCount(orders, "returned", "취소/반품")}
    </div>
  `;
  }

  function createOrderStatusCount(orders, status, label) {
    const count = orders.filter(
      (order) => (order.shippingStatus || "preparing") === status,
    ).length;

    return `<div><span>${label}</span><strong>${count}</strong></div>`;
  }

  function createProfilePointDashboard(points, stats) {
    return `
    <div class="profile-section-head">
      <div>
        <div class="product-category">Points</div>
        <h3>포인트 관리</h3>
      </div>
      <p>구매확정 전에는 예정 포인트로 표시하고, 구매확정 후 실제 보유 포인트에 반영합니다.</p>
    </div>
    <div class="profile-point-ledger-summary">
      <article><span>총 적립</span><strong>${stats.earnedPoints.toLocaleString("ko-KR")}P</strong><em>이번달 ${stats.monthEarned.toLocaleString("ko-KR")}P</em></article>
      <article><span>적립 예정</span><strong>${stats.pendingPoints.toLocaleString("ko-KR")}P</strong><em>구매확정 대기</em></article>
      <article><span>총 사용</span><strong>${stats.usedPoints.toLocaleString("ko-KR")}P</strong><em>이번달 ${stats.monthUsed.toLocaleString("ko-KR")}P</em></article>
      <article><span>최근 변동</span><strong>${points[0] ? `${Number(points[0].amount).toLocaleString("ko-KR")}P` : "0P"}</strong><em>${points[0]?.createdAt || "이력 없음"}</em></article>
    </div>
  `;
  }

  function createProfileReferralDashboard(links) {
    const activeLinks = links.filter((link) => link.status === "active");
    const productCount = new Set(links.map((link) => link.productId)).size;

    return `
    <div class="profile-section-head">
      <div>
        <div class="product-category">Referral</div>
        <h3>추천 링크</h3>
      </div>
      <p>구매한 상품별로 발급된 개인 추천 링크를 복사해 공유할 수 있습니다.</p>
    </div>
    <div class="profile-insight-grid">
      <article><span>활성 링크</span><strong>${activeLinks.length}개</strong><em>복사 가능</em></article>
      <article><span>상품 수</span><strong>${productCount}개</strong><em>상품별 1개 링크</em></article>
      <article><span>최근 링크</span><strong>${links[0]?.code || "-"}</strong><em>${links[0]?.productId || "링크 없음"}</em></article>
    </div>
  `;
  }

  function createOption(value, selectedValue) {
    return `<option value="${value}" ${value === selectedValue ? "selected" : ""}>${value}</option>`;
  }

  function createShippingAddressList(member) {
    const addresses = normalizeMemberShippingAddresses(member);
    if (!addresses.length) {
      return `<div class="admin-detail-empty compact">저장된 배송지가 없습니다.</div>`;
    }

    return `
    <div class="profile-address-list">
      ${addresses
        .map(
          (address) => `
          <article>
            <strong>${escapeHtml(address.label)}${address.isDefault ? " · 기본" : ""}</strong>
            <span>${escapeHtml(address.recipient || member.name || "")} / ${escapeHtml(address.phone || member.phone || "")}</span>
            <span>${escapeHtml(address.postcode)} ${escapeHtml(address.address)} ${escapeHtml(address.addressDetail)}</span>
          </article>
        `,
        )
        .join("")}
    </div>
  `;
  }

  function createProfileOrderRow(order) {
    const firstItem = order.items?.[0];
    const itemCount = (order.items || []).reduce(
      (sum, item) => sum + Number(item.qty || 0),
      0,
    );

    return `
    <article class="profile-row profile-order-row">
      <div>
        <strong>${order.id}</strong>
        <span>${order.paidAt} · ${createShippingStatusLabel(order.shippingStatus)}</span>
      </div>
      <div>
        <strong>${firstItem?.productKo || "상품"}</strong>
        <span>${itemCount}개 · 상품금액 ${formatMoney(order.paidProductAmount)}</span>
      </div>
      <div>
        <strong>${formatMoney(order.paidAmount || order.paidProductAmount)}</strong>
        <span>사용 ${Math.abs(order.pointUsed || 0).toLocaleString("ko-KR")}P · ${order.confirmedAt ? "적립" : "적립 예정"} ${(order.pointEarned || 0).toLocaleString("ko-KR")}P</span>
      </div>
      <div class="profile-row-actions">
        <button class="buy-button mini-button" type="button" data-profile-order-detail="${order.id}">주문 상세</button>
        <button class="cart-button mini-button" type="button" data-profile-tab="orders">문의 준비</button>
      </div>
    </article>
  `;
  }

  function createProfileOrderDetail(order) {
    const address = order.shippingAddress || {};

    return `
    <div class="profile-history-head">
      <div>
        <div class="product-category">Order detail</div>
        <h3>${order.id}</h3>
      </div>
      <button class="cart-button mini-button" type="button" data-profile-order-detail-close>닫기</button>
    </div>
    <div class="profile-order-summary-grid">
      <div><span>주문일</span><strong>${order.paidAt}</strong></div>
      <div><span>배송상태</span><strong>${createShippingStatusLabel(order.shippingStatus)}</strong></div>
      <div><span>택배사</span><strong>${order.courier || "출고 전"}</strong></div>
      <div><span>송장번호</span><strong>${order.trackingNumber || "등록 대기"}</strong></div>
      <div><span>배송지</span><strong>${formatProfileAddress(address)}</strong></div>
      <div><span>상품금액</span><strong>${formatMoney(order.paidProductAmount)}</strong></div>
      <div><span>배송비</span><strong>${order.shippingAmount ? formatMoney(order.shippingAmount) : "무료"}</strong></div>
      <div><span>포인트 사용</span><strong>${order.pointUsed ? `-${order.pointUsed.toLocaleString("ko-KR")}P` : "0P"}</strong></div>
      <div><span>${order.confirmedAt ? "적립 포인트" : "적립 예정"}</span><strong>${(order.pointEarned || 0).toLocaleString("ko-KR")}P</strong></div>
      <div><span>구매확정</span><strong>${order.confirmedAt || "확정 대기"}</strong></div>
      <div><span>결제금액</span><strong>${formatMoney(order.paidAmount)}</strong></div>
    </div>
    ${
      order.confirmedAt
        ? ""
        : `<div class="buy-actions profile-actions"><button class="buy-button" type="button" data-confirm-order="${order.id}">구매확정</button></div>`
    }
    <div class="profile-list">
      ${(order.items || [])
        .map(
          (item) => `
          <article class="profile-row">
            <div><strong>${escapeHtml(item.productKo || item.productName)}</strong><span>${escapeHtml(item.option || "기본 옵션")}</span></div>
            <div><span>수량 ${item.qty}개</span><strong>${formatMoney((item.sale || 0) * (item.qty || 1))}</strong></div>
          </article>
        `,
        )
        .join("")}
    </div>
  `;
  }

  function createShippingStatusLabel(status) {
    const labels = {
      preparing: "상품준비",
      paid: "결제완료",
      shipping: "배송중",
      delivered: "배송완료",
      returned: "취소/반품",
    };
    return labels[status] || createOrderStatusLabel(status);
  }

  function formatProfileAddress(address = {}) {
    const recipient = [address.recipient, address.phone]
      .filter(Boolean)
      .join(" / ");
    const location = [address.postcode, address.address, address.addressDetail]
      .filter(Boolean)
      .join(" ");
    return [recipient, location].filter(Boolean).join(" · ") || "-";
  }

  function createProfilePointRow(point) {
    const typeLabel = isPendingPoint(point)
      ? "적립 예정"
      : point.amount >= 0
        ? "적립"
        : "사용";
    const sign = point.amount >= 0 ? "+" : "-";

    return `
    <article class="profile-row profile-point-row ${point.amount >= 0 ? "is-earned" : "is-used"}">
      <div><strong>${typeLabel}</strong><span>${point.createdAt || "-"}</span></div>
      <div><strong>${sign}${Math.abs(point.amount).toLocaleString("ko-KR")}P</strong><span>${point.note}</span></div>
      <div><span>기준 금액</span><strong>${formatMoney(point.baseAmount)}</strong></div>
      <div><span>주문번호</span><strong>${point.orderId || "-"}</strong></div>
    </article>
  `;
  }

  function isPendingPoint(point) {
    return point.type === "purchase_pending";
  }

  function createProfileLinkRow(link) {
    const url = createReferralUrl(link.code);

    return `
    <article class="profile-row referral-row">
      <div><strong>${link.code}</strong><span>${createReferralStatusLabel(link.status)} · ${link.productId}</span></div>
      <div>
        <span>${url}</span>
        <button class="cart-button mini-button" type="button" data-copy-referral="${url}">링크 복사</button>
      </div>
    </article>
  `;
  }

  function createExpandableProfileSection(
    type,
    title,
    items,
    createRow,
    emptyMessage,
  ) {
    const visible = items.slice(0, 10);
    const hidden = items.slice(10);

    return `
    <section class="profile-history-section ${type === "points" ? "" : "is-hidden"}" data-profile-history="${type}">
      <div class="profile-history-head">
        <div class="product-category">${title}</div>
        <span>최근 ${Math.min(10, items.length)}개 / 총 ${items.length}개</span>
      </div>
      <div class="profile-list">
        ${visible.map(createRow).join("") || `<div class="admin-detail-empty">${emptyMessage}</div>`}
        ${hidden.map((item) => `<div class="profile-more-item is-hidden" data-profile-more="${type}">${createRow(item)}</div>`).join("")}
      </div>
      ${hidden.length ? `<button class="cart-button profile-more-button" type="button" data-profile-more-button="${type}">더보기 ${hidden.length}개</button>` : ""}
    </section>
  `;
  }

  function sortOrderHistory(orders) {
    return [...orders].sort((a, b) => String(b.paidAt).localeCompare(a.paidAt));
  }

  function sortPointHistory(points) {
    return [...points].sort((a, b) =>
      String(b.createdAt).localeCompare(a.createdAt),
    );
  }

  function createOrderStatusLabel(status) {
    const labels = {
      paid: "결제완료",
      shipping: "배송중",
      completed: "구매확정",
      cancelled: "취소/환불",
    };
    return labels[status] || status || "상태 없음";
  }

  function createReferralStatusLabel(status) {
    const labels = {
      active: "활성",
      used: "사용됨",
      paused: "중지",
    };
    return labels[status] || status || "상태 없음";
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
    document
      .querySelector("[data-password-form]")
      ?.addEventListener("submit", (event) => {
        event.preventDefault();
        changePassword(event.currentTarget);
      });
    bindAddressLookupEvents();
    document.querySelectorAll("[data-profile-tab]").forEach((button) => {
      button.addEventListener("click", () =>
        activateProfileTab(button.dataset.profileTab),
      );
    });
    document.querySelectorAll("[data-profile-section]").forEach((button) => {
      button.addEventListener("click", () =>
        activateProfileTab(button.dataset.profileSection),
      );
    });
    document
      .querySelectorAll("[data-profile-more-button]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          document
            .querySelectorAll(
              `[data-profile-more="${button.dataset.profileMoreButton}"]`,
            )
            .forEach((item) => item.classList.remove("is-hidden"));
          button.remove();
        });
      });
    document.querySelectorAll("[data-copy-referral]").forEach((button) => {
      button.addEventListener("click", async () => {
        await copyText(button.dataset.copyReferral);
        showToast("추천 링크가 복사되었습니다.");
      });
    });
    document
      .querySelectorAll("[data-profile-order-detail]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const order = store.orders.find(
            (item) => item.id === button.dataset.profileOrderDetail,
          );
          const detail = document.querySelector("#profileOrderDetail");
          if (!order || !detail) return;

          detail.innerHTML = createProfileOrderDetail(order);
          detail.classList.remove("is-hidden");
          detail
            .querySelector("[data-profile-order-detail-close]")
            ?.addEventListener("click", () =>
              detail.classList.add("is-hidden"),
            );
          detail
            .querySelector("[data-confirm-order]")
            ?.addEventListener("click", (event) => {
              const orderId = event.currentTarget.dataset.confirmOrder;
              if (!confirmPurchase(store, orderId, "member")) return;
              persistStore(store);
              updateSessionUi();
              showToast("구매확정이 완료되어 포인트가 적립되었습니다.");
              openProfile();
              activateProfileTab("orders");
            });
        });
      });
  }

  function activateProfileTab(tab) {
    document.querySelectorAll("[data-profile-panel]").forEach((panel) => {
      panel.classList.toggle("is-hidden", panel.dataset.profilePanel !== tab);
    });
    document.querySelectorAll("[data-profile-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.profileTab === tab);
    });
    document.querySelectorAll("[data-profile-history]").forEach((section) => {
      section.classList.toggle(
        "is-hidden",
        section.dataset.profileHistory !== tab,
      );
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
    member.shippingAddresses = buildProfileShippingAddresses(form, member);
  }

  function buildProfileShippingAddresses(form, member) {
    const defaultAddress = {
      id: "addr-default",
      label: "기본 배송지",
      recipient: member.name,
      phone: member.phone,
      postcode: member.address.postcode,
      address: member.address.address,
      addressDetail: member.address.addressDetail,
      isDefault: true,
    };
    const extraAddress = {
      id:
        member.shippingAddresses?.find((address) => !address.isDefault)?.id ||
        `addr-${Date.now()}`,
      label: getFormValue(form, "extraAddressLabel") || "추가 배송지",
      recipient: getFormValue(form, "extraAddressRecipient") || member.name,
      phone: getFormValue(form, "extraAddressPhone") || member.phone,
      postcode: getFormValue(form, "extraAddressPostcode"),
      address: getFormValue(form, "extraAddressAddress"),
      addressDetail: getFormValue(form, "extraAddressDetail"),
      isDefault: false,
    };

    return [defaultAddress, extraAddress].filter(
      (address) => address.postcode || address.address || address.addressDetail,
    );
  }

  function changePassword(form) {
    const member = getCurrentMember();
    if (!member) return;

    const currentPassword = getFormValue(form, "currentPassword");
    const newPassword = getFormValue(form, "newPassword");
    const confirmPassword = getFormValue(form, "confirmPassword");
    const error = form.querySelector("[data-password-error]");

    error.textContent = "";
    if (!member.passwordHash) {
      error.textContent = "간편 로그인 회원은 일반 비밀번호가 없습니다.";
      return;
    }
    if (member.passwordHash !== hashPassword(member.userId, currentPassword)) {
      error.textContent = "기존 비밀번호가 일치하지 않습니다.";
      return;
    }
    if (!isValidPassword(newPassword)) {
      error.textContent =
        "새 비밀번호는 영문과 숫자를 포함해 8자 이상 입력해주세요.";
      return;
    }
    if (newPassword !== confirmPassword) {
      error.textContent = "새 비밀번호 확인이 일치하지 않습니다.";
      return;
    }

    member.passwordHash = hashPassword(member.userId, newPassword);
    member.authProvider = "password";
    persistStore(store);
    showToast("비밀번호가 변경되었습니다.");
    form.reset();
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
    bindAddressLookupEvents();
  }

  function bindManagementLoginEvents(role, onSuccess) {
    document.querySelector("#authClose")?.addEventListener("click", closeAuth);
    dom.auth.addEventListener("click", (event) => {
      if (event.target === dom.auth) closeAuth();
    });
    document.querySelectorAll("[data-management-link]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const targetRole = link.dataset.managementLink;
        openManagementLogin(targetRole, onSuccess);
      });
    });
    const form = document.querySelector("[data-management-login]");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const result =
        role === "admin" ? loginAdminManager(form) : loginAgencyManager(form);
      if (!result) return;

      showToast(
        `${role === "admin" ? "관리자" : "대리점"} 로그인이 완료되었습니다.`,
      );
      closeAuth();
      onSuccess(role);
    });
  }

  function bindAddressLookupEvents() {
    // Shared address lookup behavior for signup and profile forms.
    // data-address-prefix maps one result list to either default or extra address fields.
    document.querySelectorAll("[data-address-search]").forEach((button) => {
      button.addEventListener("click", () => {
        const container =
          button.closest("form") || button.closest(".address-box");
        const prefix = button.dataset.addressPrefix || "";
        const panel = container?.querySelector(
          `[data-address-panel="${prefix}"]`,
        );
        panel?.classList.toggle("is-hidden");
      });
    });

    document.querySelectorAll("[data-address-result]").forEach((button) => {
      button.addEventListener("click", () => {
        fillAddressFields(button);
        button.closest("[data-address-panel]")?.classList.add("is-hidden");
      });
    });
  }

  function fillAddressFields(button) {
    const container = button.closest("form") || button.closest(".address-box");
    if (!container) return;

    const prefix = button.dataset.addressPrefix || "";
    const fieldNames = prefix
      ? {
          postcode: `${prefix}Postcode`,
          address: `${prefix}Address`,
          detail: `${prefix}Detail`,
        }
      : {
          postcode: "postcode",
          address: "address",
          detail: "addressDetail",
        };

    const postcode = container.querySelector(`[name="${fieldNames.postcode}"]`);
    const address = container.querySelector(`[name="${fieldNames.address}"]`);
    const detail = container.querySelector(`[name="${fieldNames.detail}"]`);
    if (postcode) postcode.value = button.dataset.postcode || "";
    if (address) address.value = button.dataset.address || "";
    if (detail) detail.focus();
    showToast("배송지를 선택했습니다. 상세주소를 입력해주세요.");
  }

  function registerMember(form) {
    // General signup creates a real local member. Social buttons are UI-only
    // shortcuts that create a quick demo member without external provider logic.
    clearFormError(form);
    const userId = normalizeUserId(getFormValue(form, "userId"));
    const password = getFormValue(form, "password");

    if (!isValidUserId(userId)) {
      setFormError(form, "아이디는 영문 및 숫자로 6자 이상 입력해주세요.");
      return false;
    }
    if (!isValidPassword(password)) {
      setFormError(
        form,
        "비밀번호는 영문과 숫자를 포함해 8자 이상 입력해주세요.",
      );
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
      role: "member",
      points: 0,
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
      address: {
        postcode: getFormValue(form, "postcode"),
        address: getFormValue(form, "address"),
        addressDetail: getFormValue(form, "addressDetail"),
      },
      shippingAddresses: [
        {
          id: "addr-default",
          label: "기본 배송지",
          recipient: getFormValue(form, "name") || userId || "신규회원",
          phone: getFormValue(form, "phone"),
          postcode: getFormValue(form, "postcode"),
          address: getFormValue(form, "address"),
          addressDetail: getFormValue(form, "addressDetail"),
          isDefault: true,
        },
      ].filter(
        (address) =>
          address.postcode || address.address || address.addressDetail,
      ),
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

  function loginAdminManager(form) {
    clearFormError(form);
    const userId = getFormValue(form, "userId");
    const password = getFormValue(form, "password");
    if (userId !== "adminChang" || password !== "Chang$0909") {
      setFormError(form, "관리자 아이디 또는 비밀번호가 일치하지 않습니다.");
      return false;
    }

    const admin = ensureManagementMember({
      id: "member-admin",
      userId: "adminChang",
      name: "관리자",
      role: "admin",
      agencyId: getHeadquartersAgency()?.id,
      passwordHash: hashPassword(userId, password),
    });
    store.currentMemberId = admin.id;
    persistStore(store);
    updateSessionUi();
    return true;
  }

  function loginAgencyManager(form) {
    clearFormError(form);
    const userId = normalizeUserId(getFormValue(form, "userId"));
    const password = getFormValue(form, "password");
    const agency = store.agencies.find(
      (item) =>
        normalizeUserId(item.loginUserId) === userId &&
        item.status === "active",
    );

    if (
      !agency ||
      !agency.loginPasswordHash ||
      agency.loginPasswordHash !== hashPassword(userId, password)
    ) {
      setFormError(form, "대리점 아이디 또는 비밀번호가 일치하지 않습니다.");
      return false;
    }

    const member = ensureManagementMember({
      id: `member-agency-${agency.id}`,
      userId,
      name: agency.name,
      role: "agency_manager",
      agencyId: agency.id,
      passwordHash: agency.loginPasswordHash,
    });
    store.currentMemberId = member.id;
    persistStore(store);
    updateSessionUi();
    return true;
  }

  function ensureManagementMember({
    id,
    userId,
    name,
    role,
    agencyId,
    passwordHash,
  }) {
    let member =
      store.members.find((item) => item.id === id) ||
      store.members.find(
        (item) => normalizeUserId(item.userId) === normalizeUserId(userId),
      );
    if (!member) {
      member = {
        id,
        userId,
        passwordHash,
        authProvider: "password",
        name,
        phone: "",
        email: "",
        agencyId,
        role,
        points: 0,
        status: "active",
        joinedAt: new Date().toISOString().slice(0, 10),
        address: {},
        shippingAddresses: [],
      };
      store.members.push(member);
    }

    Object.assign(member, {
      userId,
      passwordHash,
      authProvider: "password",
      name,
      agencyId,
      role,
      status: "active",
    });
    return member;
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

  function isValidUserId(userId) {
    return /^[a-z0-9]{6,}$/i.test(userId);
  }

  function isValidPassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
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

  function migrateMemberAuthDefaults() {
    let changed = false;
    store.members.forEach((member) => {
      if (member.userId === "beauty_user") {
        member.userId = "beauty01";
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
      role: "member",
      points: 0,
      status: "active",
      authProvider: "social",
      joinedAt: new Date().toISOString().slice(0, 10),
      address: {},
      shippingAddresses: [],
    });
    store.currentMemberId = memberId;
    persistStore(store);
    updateSessionUi();
  }

  function getCurrentMember() {
    return store.members.find((member) => member.id === store.currentMemberId);
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

  function normalizeMemberShippingAddresses(member) {
    const addresses = Array.isArray(member.shippingAddresses)
      ? member.shippingAddresses
      : [];
    if (addresses.length) return addresses;
    if (
      member.address?.postcode ||
      member.address?.address ||
      member.address?.addressDetail
    ) {
      return [
        {
          id: "addr-default",
          label: "기본 배송지",
          recipient: member.name,
          phone: member.phone,
          postcode: member.address.postcode || "",
          address: member.address.address || "",
          addressDetail: member.address.addressDetail || "",
          isDefault: true,
        },
      ];
    }

    return [];
  }

  function createMemberStatusLabel(status) {
    const labels = {
      active: "정상",
      paused: "중지",
      dormant: "휴면",
      blocked: "차단",
    };
    return labels[status] || status || "정상";
  }

  function showAuthView() {
    dom.auth.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  return {
    openAuth,
    openProfile,
    openManagementLogin,
    closeAuth,
    showAuthView,
  };
}

export function createManagementController({ dom, store, closeCart }) {
  function openManagement(role = "admin") {
    closeCart();
    dom.management.innerHTML = createManagementView(role, store);
    dom.home.classList.add("is-hidden");
    dom.detail.classList.add("is-hidden");
    dom.auth.classList.add("is-hidden");
    dom.management.classList.remove("is-hidden");
    scrollTo({ top: 0, behavior: "smooth" });
  }

  return { openManagement };
}

function createManagementView(role, store) {
  if (role === "agency") return createAgencyDashboard(store);
  if (role === "member") return createMemberDashboard(store);

  return createAdminDashboard(store);
}

function createAdminDashboard(store) {
  const headquarters = store.agencies.find((agency) => agency.isHeadquarters);
  const agencyCount = store.agencies.length;
  const memberCount = store.members.length;
  const latestOrder = store.orders[0];

  return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Admin / Headquarters</div>
          <h1 class="detail-title">Admin Control.</h1>
        </div>
        <p>포인트, 대리점, 상품, 추천링크, 정산을 단계별로 관리하기 위한 관리자 화면 골격입니다.</p>
      </div>
      <div class="management-grid">
        <article><span>본사 대리점</span><strong>${headquarters.name}</strong></article>
        <article><span>대리점 수</span><strong>${agencyCount}</strong></article>
        <article><span>회원 수</span><strong>${memberCount}</strong></article>
        <article><span>최근 주문</span><strong>${latestOrder.id}</strong></article>
      </div>
      ${createSettingsPanel(store)}
    </section>
  `;
}

function createSettingsPanel(store) {
  const settings = store.settings;

  return `
    <section class="management-panel">
      <div class="product-category">Admin settings</div>
      <div class="management-grid compact">
        <article><span>구매 적립률</span><strong>${settings.purchasePointRate}%</strong></article>
        <article><span>포인트 사용 한도</span><strong>${settings.maxPointUseRate}%</strong></article>
        <article><span>개인 추천자 지급률</span><strong>${settings.personalReferrerRewardRate}%</strong></article>
        <article><span>구매자 추가 지급률</span><strong>${settings.personalBuyerBonusRate}%</strong></article>
      </div>
    </section>
  `;
}

function createAgencyDashboard(store) {
  const agency = store.agencies.find((item) => !item.isHeadquarters);
  const members = store.members.filter(
    (member) => member.agencyId === agency.id,
  );
  const sales = store.orders
    .filter(
      (order) =>
        order.agencyIdAtOrder === agency.id &&
        order.referralSourceType !== "personal_product",
    )
    .reduce((sum, order) => sum + order.paidProductAmount, 0);

  return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Agency / ${agency.code}</div>
          <h1 class="detail-title">Agency Desk.</h1>
        </div>
        <p>대리점 링크, 소속 고객, 매출, 정산 예정액을 확인하는 대리점 화면 골격입니다.</p>
      </div>
      <div class="management-grid">
        <article><span>전용 코드</span><strong>${agency.code}</strong></article>
        <article><span>전용 링크</span><strong>/join/${agency.linkSlug}</strong></article>
        <article><span>소속 고객</span><strong>${members.length}명</strong></article>
        <article><span>영업비율</span><strong>${agency.commissionRate}%</strong></article>
        <article><span>정산 대상 매출</span><strong>${sales.toLocaleString("ko-KR")}원</strong></article>
        <article><span>정산 상태</span><strong>정산 준비중</strong></article>
      </div>
    </section>
  `;
}

function createMemberDashboard(store) {
  const member = store.members[0];
  const memberOrders = store.orders.filter(
    (order) => order.memberId === member.id,
  );
  const links = store.personalReferralLinks.filter(
    (link) => link.ownerMemberId === member.id,
  );

  return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Member / My page</div>
          <h1 class="detail-title">My Beauty.</h1>
        </div>
        <p>회원에게는 대리점 소속을 노출하지 않고 포인트, 주문, 상품별 추천링크만 보여줍니다.</p>
      </div>
      <div class="management-grid">
        <article><span>보유 포인트</span><strong>${member.points.toLocaleString("ko-KR")}P</strong></article>
        <article><span>주문 수</span><strong>${memberOrders.length}건</strong></article>
        <article><span>추천 링크</span><strong>${links.length}개</strong></article>
        <article><span>대표 링크</span><strong>${links[0]?.code || "-"}</strong></article>
        <article><span>고객 상태</span><strong>${member.status}</strong></article>
      </div>
    </section>
  `;
}

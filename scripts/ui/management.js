import { formatMoney } from "../utils/format.js";

export function createManagementController({
  dom,
  store,
  closeCart,
  persistStore = () => {},
}) {
  function openManagement(role = "admin") {
    closeCart();
    dom.management.innerHTML = createManagementView(role, store);
    bindManagementEvents(role);
    dom.home.classList.add("is-hidden");
    dom.detail.classList.add("is-hidden");
    dom.auth.classList.add("is-hidden");
    dom.management.classList.remove("is-hidden");
    scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindManagementEvents(role) {
    if (role === "admin") {
      bindAdminSettingsForm();
      bindMetricModal(
        "[data-admin-detail]",
        "#adminDetailModal",
        "admin",
        (type) => createAdminDetailContent(type, store),
      );
    }

    if (role === "agency") {
      bindMetricModal(
        "[data-agency-detail]",
        "#agencyDetailModal",
        "agency",
        (type) => createAgencyDetailContent(type, store),
      );
    }
  }

  function bindAdminSettingsForm() {
    const form = dom.management.querySelector("[data-admin-settings-form]");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      store.settings.purchasePointRate = readPercentField(
        form,
        "purchasePointRate",
      );
      store.settings.maxPointUseRate = readPercentField(
        form,
        "maxPointUseRate",
      );
      store.settings.personalReferrerRewardRate = readPercentField(
        form,
        "personalReferrerRewardRate",
      );
      store.settings.personalBuyerBonusRate = readPercentField(
        form,
        "personalBuyerBonusRate",
      );
      store.settings.friendSignupPoint = Math.max(
        0,
        Number(form.querySelector('[name="friendSignupPoint"]').value || 0),
      );
      persistStore(store);
      dom.management.innerHTML = createAdminDashboard(store);
      bindManagementEvents("admin");
    });
  }

  function readPercentField(form, name) {
    const value = Number(form.querySelector(`[name="${name}"]`).value || 0);
    return Math.min(100, Math.max(0, value));
  }

  function bindMetricModal(cardSelector, modalSelector, scope, createContent) {
    const modal = dom.management.querySelector(modalSelector);
    if (!modal) return;

    dom.management.querySelectorAll(cardSelector).forEach((card) => {
      const open = () => {
        const detailType =
          card.dataset.adminDetail || card.dataset.agencyDetail;
        modal.dataset.currentDetail = detailType;
        openDetailModal(modal, createContent(detailType));
        if (
          modalSelector === "#adminDetailModal" &&
          detailType === "agencies"
        ) {
          bindAgencyAdminForm(modal);
        }
      };

      card.addEventListener("click", open);
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        open();
      });
    });

    modal.addEventListener("click", (event) => {
      const memberButton = event.target.closest("[data-member-detail]");
      if (memberButton) {
        openDetailModal(
          modal,
          createMemberProfileDetail(
            memberButton.dataset.memberDetail,
            store,
            scope,
            modal.dataset.currentDetail || "members",
          ),
        );
        return;
      }

      const memoForm = event.target.closest("[data-member-memo-form]");
      if (memoForm && event.type === "click") return;

      const backButton = event.target.closest("[data-member-detail-back]");
      if (backButton) {
        const detailType = backButton.dataset.memberDetailBack || "members";
        modal.dataset.currentDetail = detailType;
        openDetailModal(modal, createContent(detailType));
        return;
      }

      if (
        event.target.matches("[data-modal-close]") ||
        event.target === modal
      ) {
        closeDetailModal(modal);
      }
    });

    modal.addEventListener("submit", (event) => {
      const memoForm = event.target.closest("[data-member-memo-form]");
      if (!memoForm) return;

      event.preventDefault();
      const member = store.members.find(
        (item) => item.id === memoForm.dataset.memberMemoForm,
      );
      if (!member) return;

      member.internalMemo = memoForm.querySelector(
        '[name="internalMemo"]',
      ).value;
      persistStore(store);
      openDetailModal(
        modal,
        createMemberProfileDetail(
          member.id,
          store,
          scope,
          modal.dataset.currentDetail || "members",
        ),
      );
    });
  }

  function bindAgencyAdminForm(modal) {
    const formBox = modal.querySelector("[data-agency-form]");
    if (!formBox) return;

    formBox
      .querySelector("[data-agency-submit]")
      .addEventListener("click", () => {
        saveAgencyFromForm(formBox);
        persistStore(store);
        reopenAdminDetail("agencies");
      });
    formBox.querySelector('[name="name"]').addEventListener("input", () => {
      const generated = createAgencyIdentifiers(
        getAgencyField(formBox, "name").value,
      );
      const codeInput = getAgencyField(formBox, "code");
      const linkInput = getAgencyField(formBox, "linkSlug");

      if (!codeInput.dataset.manual || !codeInput.value.trim()) {
        codeInput.value = generated.code;
      }
      if (!linkInput.dataset.manual || !linkInput.value.trim()) {
        linkInput.value = generated.linkSlug;
      }
    });
    ["code", "linkSlug"].forEach((name) => {
      getAgencyField(formBox, name).addEventListener("input", (event) => {
        event.target.dataset.manual = "true";
      });
    });

    modal.querySelectorAll("[data-agency-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        const agency = store.agencies.find(
          (item) => item.id === button.dataset.agencyEdit,
        );
        if (!agency) return;

        getAgencyField(formBox, "agencyId").value = agency.id;
        getAgencyField(formBox, "name").value = agency.name;
        getAgencyField(formBox, "code").value = agency.code;
        getAgencyField(formBox, "linkSlug").value = agency.linkSlug;
        getAgencyField(formBox, "commissionRate").value = agency.commissionRate;
        getAgencyField(formBox, "status").value = agency.status;
        getAgencyField(formBox, "code").dataset.manual = "true";
        getAgencyField(formBox, "linkSlug").dataset.manual = "true";
        formBox.querySelector("[data-agency-submit]").textContent =
          "대리점 수정";
      });
    });

    modal.querySelectorAll("[data-agency-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        deleteAgency(button.dataset.agencyDelete);
        persistStore(store);
        reopenAdminDetail("agencies");
      });
    });

    formBox
      .querySelector("[data-agency-reset]")
      .addEventListener("click", () => {
        formBox.querySelectorAll("input").forEach((input) => {
          input.value = input.name === "commissionRate" ? "10" : "";
          delete input.dataset.manual;
        });
        getAgencyField(formBox, "status").value = "active";
        formBox.querySelector("[data-agency-submit]").textContent =
          "대리점 등록";
      });
  }

  function getAgencyField(formBox, name) {
    return formBox.querySelector(`[name="${name}"]`);
  }

  function saveAgencyFromForm(formBox) {
    const agencyId = getAgencyField(formBox, "agencyId").value;
    const payload = {
      name: getAgencyField(formBox, "name").value.trim(),
      code: getAgencyField(formBox, "code").value.trim().toUpperCase(),
      linkSlug: getAgencyField(formBox, "linkSlug").value.trim(),
      commissionRate: Math.max(
        0,
        Number(getAgencyField(formBox, "commissionRate").value || 0),
      ),
      status: getAgencyField(formBox, "status").value || "active",
    };

    if (!payload.name || !payload.code || !payload.linkSlug) return;

    if (agencyId) {
      const agency = store.agencies.find((item) => item.id === agencyId);
      if (!agency || agency.isHeadquarters) return;
      Object.assign(agency, payload);
      return;
    }

    store.agencies.push({
      id: `agency-${payload.linkSlug.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}-${store.agencies.length + 1}`,
      ...payload,
      isHeadquarters: false,
    });
  }

  function deleteAgency(agencyId) {
    const agency = store.agencies.find((item) => item.id === agencyId);
    const headquarters = store.agencies.find((item) => item.isHeadquarters);
    if (!agency || agency.isHeadquarters || !headquarters) return;

    store.members.forEach((member) => {
      if (member.agencyId === agency.id) {
        member.agencyId = headquarters.id;
      }
    });
    store.agencies = store.agencies.filter((item) => item.id !== agency.id);
  }

  function reopenAdminDetail(type) {
    dom.management.innerHTML = createAdminDashboard(store);
    bindManagementEvents("admin");
    const modal = dom.management.querySelector("#adminDetailModal");
    openDetailModal(modal, createAdminDetailContent(type, store));
    bindAgencyAdminForm(modal);
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
  const monthlyOrders = getCurrentMonthOrders(store);
  const monthlyOrderTotal = monthlyOrders.reduce(
    (sum, order) => sum + order.paidProductAmount,
    0,
  );
  const monthlyPointSummary = getCurrentMonthPointSummary(store);
  const settlementPending = store.agencySettlementLedger.reduce(
    (sum, item) => sum + item.commissionAmount,
    0,
  );

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
        ${createMetricCard("admin", "headquarters", "본사 대리점", headquarters.name)}
        ${createMetricCard("admin", "agencies", "대리점 수", `${agencyCount}`)}
        ${createMetricCard("admin", "members", "회원 수", `${memberCount}`)}
        ${createMetricCard("admin", "orders", "이달의 주문", formatMoney(monthlyOrderTotal))}
        ${createMetricCard("admin", "points", "이달의 적립금", `${monthlyPointSummary.earned.toLocaleString("ko-KR")}P`)}
        ${createMetricCard("admin", "settlements", "정산 대기 영업비", formatMoney(settlementPending))}
      </div>
      ${createSettingsPanel(store)}
      ${createDetailModal("adminDetailModal", "adminModalContent")}
    </section>
  `;
}

function createMetricCard(scope, type, label, value) {
  const attribute =
    scope === "agency" ? "data-agency-detail" : "data-admin-detail";

  return `
    <article class="management-card-action" tabindex="0" role="button" ${attribute}="${type}" aria-label="${label} 상세 보기">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `;
}

function createSettingsPanel(store) {
  const settings = store.settings;

  return `
    <section class="management-panel">
      <div class="product-category">Admin settings</div>
      <form class="admin-settings-form" data-admin-settings-form>
        <label>구매 적립률<input class="quantity-input" name="purchasePointRate" type="number" min="0" max="100" value="${settings.purchasePointRate}" /></label>
        <label>포인트 사용 한도<input class="quantity-input" name="maxPointUseRate" type="number" min="0" max="100" value="${settings.maxPointUseRate}" /></label>
        <label>친구가입 포인트<input class="quantity-input" name="friendSignupPoint" type="number" min="0" step="100" value="${settings.friendSignupPoint}" /></label>
        <label>개인 추천자 지급률<input class="quantity-input" name="personalReferrerRewardRate" type="number" min="0" max="100" value="${settings.personalReferrerRewardRate}" /></label>
        <label>구매자 추가 지급률<input class="quantity-input" name="personalBuyerBonusRate" type="number" min="0" max="100" value="${settings.personalBuyerBonusRate}" /></label>
        <button class="buy-button" type="submit">설정 저장</button>
      </form>
    </section>
  `;
}

function createDetailModal(modalId, contentId) {
  return `
    <div class="admin-modal" id="${modalId}" aria-hidden="true" hidden>
      <div class="admin-modal-card" role="dialog" aria-modal="true" aria-labelledby="adminModalTitle">
        <button class="cart-close admin-modal-close" type="button" data-modal-close aria-label="상세 팝업 닫기">×</button>
        <div class="admin-modal-content" id="${contentId}">
          <div class="admin-detail-empty">
            대시보드 항목을 선택하면 관련 상세 리스트가 표시됩니다.
          </div>
        </div>
      </div>
    </div>
  `;
}

function openDetailModal(modal, html) {
  const content = modal.querySelector(".admin-modal-content");
  if (!content) return;

  content.innerHTML = html;
  modal.hidden = false;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector("[data-modal-close]").focus();
}

function closeDetailModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function createAdminDetailContent(type, store) {
  const detail = getAdminDetail(type, store);

  return `
    <div class="detail-panel-head">
      <div>
        <div class="product-category">Admin detail / ${detail.label}</div>
        <h2 id="adminModalTitle">${detail.title}</h2>
      </div>
      <p>${detail.description}</p>
    </div>
    <div class="process-list">
      ${detail.extra || ""}
      ${detail.rows.join("") || '<div class="admin-detail-empty">표시할 데이터가 없습니다.</div>'}
    </div>
  `;
}

function getAdminDetail(type, store) {
  const detailMap = {
    headquarters: {
      label: "Headquarters",
      title: "본사 대리점 상세",
      description:
        "대리점 코드 없이 가입한 회원이 귀속되는 본사 대리점 정보입니다.",
      rows: store.agencies
        .filter((agency) => agency.isHeadquarters)
        .map(createAgencyDetailRow),
    },
    agencies: {
      label: "Agencies",
      title: "대리점 상세 리스트",
      description:
        "본사와 계약된 대리점 코드, 전용 링크, 영업비율, 상태를 등록/변경/삭제합니다.",
      extra: createAgencyAdminForm(),
      rows: store.agencies.map(createAgencyManageRow),
    },
    members: {
      label: "Members",
      title: "회원 상세 리스트",
      description:
        "회원별 포인트, 주문 수, 내부 대리점 귀속 정보를 관리자용으로 확인합니다.",
      rows: store.members.map((member) => createMemberDetailRow(member, store)),
    },
    orders: {
      label: "Orders",
      title: "이달의 주문 상세",
      description:
        "이번 달 결제 완료 주문의 배송비 제외 실결제 상품금액을 대리점별로 누적 표시합니다.",
      rows: createMonthlyAgencySalesRows(store),
    },
    points: {
      label: "Points",
      title: "이달의 포인트 상세",
      description:
        "이번 달 포인트 장부에서 적립 포인트와 사용 포인트를 분리해 누적 표시합니다.",
      extra: createMonthlyPointSummary(store),
      rows: getCurrentMonthPoints(store).map(createPointDetailRow),
    },
    settlements: {
      label: "Settlements",
      title: "대리점 정산 대기 상세 리스트",
      description:
        "개인 추천링크 구매를 제외하고 대리점 영업비 지급 대상으로 잡힌 장부입니다.",
      rows: store.agencySettlementLedger.map((item) =>
        createSettlementDetailRow(item, store),
      ),
    },
  };

  return detailMap[type] || detailMap.orders;
}

function createAgencyDetailRow(agency) {
  return `
    <article class="process-row">
      <div><strong>${agency.name}</strong><span>${agency.isHeadquarters ? "본사 대리점" : "계약 대리점"}</span></div>
      <div><span>전용 코드</span><strong>${agency.code}</strong></div>
      <div><span>전용 링크</span><strong><a href="?agency=${agency.linkSlug}#signup" data-agency-join-link="${agency.linkSlug}">/join/${agency.linkSlug}</a></strong></div>
      <div><span>영업비율 / 상태</span><strong>${agency.commissionRate}% · ${agency.status}</strong></div>
    </article>
  `;
}

function createMemberDetailRow(member, store) {
  const agency = store.agencies.find((item) => item.id === member.agencyId);
  const orders = store.orders.filter((order) => order.memberId === member.id);

  return `
    <article class="process-row">
      <div>
        <button class="member-detail-button" type="button" data-member-detail="${member.id}">
          ${member.name}
        </button>
        <span>${member.phone || "연락처 없음"}</span>
      </div>
      <div><span>보유 포인트</span><strong>${member.points.toLocaleString("ko-KR")}P</strong></div>
      <div><span>주문 수</span><strong>${orders.length}건</strong></div>
      <div><span>내부 대리점</span><strong>${agency?.name || "본사"}</strong></div>
    </article>
  `;
}

function createMemberProfileDetail(memberId, store, scope, backType) {
  const member = store.members.find((item) => item.id === memberId);
  if (!member) {
    return '<div class="admin-detail-empty">회원 정보를 찾을 수 없습니다.</div>';
  }

  const agency = store.agencies.find((item) => item.id === member.agencyId);
  const orders = store.orders.filter((order) => order.memberId === member.id);
  const points = store.pointLedger.filter(
    (point) => point.memberId === member.id,
  );
  const links = store.personalReferralLinks.filter(
    (link) => link.ownerMemberId === member.id,
  );
  const isAdmin = scope === "admin";

  return `
    <div class="detail-panel-head">
      <div>
        <button class="back-button member-detail-back" type="button" data-member-detail-back="${backType}">← 회원 리스트</button>
        <div class="product-category">${isAdmin ? "Admin" : "Agency"} member / ${member.userId || member.id}</div>
        <h2 id="adminModalTitle">${member.name}</h2>
      </div>
      <p>
        회원 기본 정보, 배송지, 구매이력, 포인트 이력을 한 화면에서 확인합니다.
        ${isAdmin ? "관리자 화면에서는 내부 대리점 귀속 정보도 함께 표시됩니다." : "대리점 화면에서는 소속 고객의 주문/포인트 중심으로 표시됩니다."}
      </p>
    </div>
    <div class="member-detail-grid">
      <article><span>아이디</span><strong>${member.userId || "-"}</strong></article>
      <article><span>상태</span><strong>${member.status}</strong></article>
      <article><span>가입일</span><strong>${member.joinedAt || "-"}</strong></article>
      <article><span>보유 포인트</span><strong>${member.points.toLocaleString("ko-KR")}P</strong></article>
      <article><span>휴대폰</span><strong>${member.phone || "-"}</strong></article>
      <article><span>이메일</span><strong>${member.email || "-"}</strong></article>
      <article><span>주문 수</span><strong>${orders.length}건</strong></article>
      <article><span>추천 링크</span><strong>${links.length}개</strong></article>
      ${isAdmin ? `<article><span>내부 대리점</span><strong>${agency?.name || "본사"}</strong></article>` : ""}
      <article class="member-detail-wide"><span>배송지</span><strong>${formatAddress(member.address)}</strong></article>
    </div>
    <div class="member-detail-columns">
      <section>
        <div class="product-category">구매이력</div>
        <div class="process-list">
          ${orders.map(createMemberOrderRow).join("") || '<div class="admin-detail-empty">구매이력이 없습니다.</div>'}
        </div>
      </section>
      <section>
        <div class="product-category">포인트 적립/사용 이력</div>
        <div class="process-list">
          ${points.map(createMemberPointRow).join("") || '<div class="admin-detail-empty">포인트 이력이 없습니다.</div>'}
        </div>
      </section>
    </div>
    <form class="member-memo-form" data-member-memo-form="${member.id}">
      <div class="product-category">Internal memo</div>
      <label>
        관리자/대리점 메모
        <textarea class="quantity-input" name="internalMemo" rows="5" placeholder="상담 내용, 배송 요청, 고객 관리 메모를 입력하세요.">${escapeTextarea(member.internalMemo)}</textarea>
      </label>
      <button class="buy-button mini-button" type="submit">메모 저장</button>
    </form>
  `;
}

function createMemberOrderRow(order) {
  const firstItem = order.items?.[0];

  return `
    <article class="process-row member-history-row">
      <div><strong>${order.id}</strong><span>${order.paidAt} · ${order.status}</span></div>
      <div><span>대표 상품</span><strong>${firstItem?.productKo || "상품"}</strong></div>
      <div><span>상품 실결제</span><strong>${formatMoney(order.paidProductAmount)}</strong></div>
      <div><span>배송비</span><strong>${order.shippingAmount ? formatMoney(order.shippingAmount) : "무료"}</strong></div>
    </article>
  `;
}

function createMemberPointRow(point) {
  return `
    <article class="process-row member-history-row">
      <div><strong>${point.orderId}</strong><span>${point.note}</span></div>
      <div><span>구분</span><strong>${point.type}</strong></div>
      <div><span>기준 금액</span><strong>${formatMoney(point.baseAmount)}</strong></div>
      <div><span>포인트</span><strong>${point.amount.toLocaleString("ko-KR")}P</strong></div>
    </article>
  `;
}

function formatAddress(address = {}) {
  const parts = [
    address.postcode,
    address.address,
    address.addressDetail,
  ].filter(Boolean);
  return parts.length ? parts.join(" ") : "-";
}

function escapeTextarea(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

function isCurrentMonthDate(value) {
  return String(value || "").startsWith(getCurrentMonthKey());
}

function getCurrentMonthOrders(store) {
  return store.orders.filter(
    (order) => order.status === "paid" && isCurrentMonthDate(order.paidAt),
  );
}

function getCurrentMonthPoints(store) {
  return store.pointLedger.filter((point) => {
    const dateValue = point.createdAt || point.paidAt || "";
    return isCurrentMonthDate(dateValue);
  });
}

function isPointUse(point) {
  return point.amount < 0 || String(point.type || "").includes("use");
}

function getCurrentMonthPointSummary(store) {
  return getCurrentMonthPoints(store).reduce(
    (summary, point) => {
      if (isPointUse(point)) {
        summary.used += Math.abs(point.amount);
      } else {
        summary.earned += Math.max(0, point.amount);
      }
      return summary;
    },
    { earned: 0, used: 0 },
  );
}

function createOrderDetailRow(order, store) {
  const point = store.pointLedger.find((item) => item.orderId === order.id);
  const settlement = store.agencySettlementLedger.find(
    (item) => item.orderId === order.id,
  );

  return `
    <article class="process-row">
      <div><strong>${order.id}</strong><span>${order.status} · ${order.paidAt}</span></div>
      <div><span>상품 실결제</span><strong>${formatMoney(order.paidProductAmount)}</strong></div>
      <div><span>포인트 적립</span><strong>${(point?.amount || 0).toLocaleString("ko-KR")}P</strong></div>
      <div><span>대리점 영업비</span><strong>${formatMoney(settlement?.commissionAmount || 0)}</strong></div>
    </article>
  `;
}

function createPointDetailRow(point) {
  return `
    <article class="process-row">
      <div><strong>${point.orderId}</strong><span>${point.note}</span></div>
      <div><span>기준 금액</span><strong>${formatMoney(point.baseAmount)}</strong></div>
      <div><span>적립률</span><strong>${point.rate}%</strong></div>
      <div><span>포인트</span><strong>${point.amount.toLocaleString("ko-KR")}P</strong></div>
    </article>
  `;
}

function createMonthlyAgencySalesRows(store) {
  const monthlyOrders = getCurrentMonthOrders(store);

  return store.agencies.map((agency) => {
    const agencyOrders = monthlyOrders.filter(
      (order) => order.agencyIdAtOrder === agency.id,
    );
    const amount = agencyOrders.reduce(
      (sum, order) => sum + order.paidProductAmount,
      0,
    );
    const commissionRate = agency.commissionRate || 0;
    const commission = Math.floor(amount * (commissionRate / 100));

    return `
      <article class="process-row">
        <div><strong>${agency.name}</strong><span>${agency.code} · ${agency.status}</span></div>
        <div><span>이달 주문</span><strong>${agencyOrders.length}건</strong></div>
        <div><span>누적 상품금액</span><strong>${formatMoney(amount)}</strong></div>
        <div><span>예상 영업비</span><strong>${formatMoney(commission)}</strong></div>
      </article>
    `;
  });
}

function createMonthlyPointSummary(store) {
  const summary = getCurrentMonthPointSummary(store);

  return `
    <div class="management-grid compact monthly-point-summary">
      <article><span>이달 적립포인트</span><strong>${summary.earned.toLocaleString("ko-KR")}P</strong></article>
      <article><span>이달 사용포인트</span><strong>${summary.used.toLocaleString("ko-KR")}P</strong></article>
      <article><span>순증감</span><strong>${(summary.earned - summary.used).toLocaleString("ko-KR")}P</strong></article>
    </div>
  `;
}

function createSettlementDetailRow(item, store) {
  const agency = store.agencies.find(
    (agencyItem) => agencyItem.id === item.agencyId,
  );

  return `
    <article class="process-row">
      <div><strong>${item.orderId}</strong><span>${agency?.name || "대리점"} · ${item.status}</span></div>
      <div><span>기준 매출</span><strong>${formatMoney(item.baseAmount)}</strong></div>
      <div><span>영업비율</span><strong>${item.commissionRate}%</strong></div>
      <div><span>지급 예정</span><strong>${formatMoney(item.commissionAmount)}</strong></div>
    </article>
  `;
}

function createSimpleDetailRow(title, value, note) {
  return `
    <article class="process-row">
      <div><strong>${title}</strong><span>${note}</span></div>
      <div><span>값</span><strong>${value}</strong></div>
      <div><span>상태</span><strong>active</strong></div>
      <div><span>관리</span><strong>내부 관리용</strong></div>
    </article>
  `;
}

function createAgencyLinkDetailRow(agency) {
  return `
    <article class="process-row">
      <div><strong>대리점 가입 링크</strong><span>회원가입 시 대리점 코드 자동 등록</span></div>
      <div><span>링크</span><strong><a href="?agency=${agency.linkSlug}#signup" data-agency-join-link="${agency.linkSlug}">/join/${agency.linkSlug}</a></strong></div>
      <div><span>대리점 코드</span><strong>${agency.code}</strong></div>
      <div><span>상태</span><strong>${agency.status}</strong></div>
    </article>
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
  const settlements = store.agencySettlementLedger.filter(
    (item) => item.agencyId === agency.id,
  );
  const commission = settlements.reduce(
    (sum, item) => sum + item.commissionAmount,
    0,
  );

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
        ${createMetricCard("agency", "code", "전용 코드", agency.code)}
        ${createMetricCard("agency", "link", "전용 링크", `/join/${agency.linkSlug}`)}
        ${createMetricCard("agency", "members", "소속 고객", `${members.length}명`)}
        ${createMetricCard("agency", "rate", "영업비율", `${agency.commissionRate}%`)}
        ${createMetricCard("agency", "sales", "정산 대상 매출", formatMoney(sales))}
        ${createMetricCard("agency", "commission", "영업비 예정", formatMoney(commission))}
        ${createMetricCard("agency", "status", "정산 상태", "정산 준비중")}
      </div>
      <section class="management-panel">
        <div class="product-category">Settlement queue</div>
        <div class="process-list">
          ${settlements
            .slice(0, 4)
            .map(
              (item) => `
              <article class="process-row">
                <div><strong>${item.orderId}</strong><span>${item.status}</span></div>
                <div><span>기준 매출</span><strong>${formatMoney(item.baseAmount)}</strong></div>
                <div><span>영업비율</span><strong>${item.commissionRate}%</strong></div>
                <div><span>지급 예정</span><strong>${formatMoney(item.commissionAmount)}</strong></div>
              </article>
            `,
            )
            .join("")}
        </div>
      </section>
      ${createDetailModal("agencyDetailModal", "agencyModalContent")}
    </section>
  `;
}

function createAgencyDetailContent(type, store) {
  const agency = store.agencies.find((item) => !item.isHeadquarters);
  const members = store.members.filter(
    (member) => member.agencyId === agency.id,
  );
  const orders = store.orders.filter(
    (order) =>
      order.agencyIdAtOrder === agency.id &&
      order.referralSourceType !== "personal_product",
  );
  const settlements = store.agencySettlementLedger.filter(
    (item) => item.agencyId === agency.id,
  );
  const details = {
    code: {
      label: "Code",
      title: "전용 코드 상세",
      description: "해당 대리점으로 회원을 귀속시키는 내부 대리점 코드입니다.",
      rows: [createAgencyDetailRow(agency)],
    },
    link: {
      label: "Link",
      title: "전용 링크 상세",
      description:
        "이 링크로 가입한 회원은 계속 해당 대리점 고객으로 처리됩니다.",
      rows: [createAgencyLinkDetailRow(agency)],
    },
    members: {
      label: "Customers",
      title: "소속 고객 상세",
      description: "대리점 링크로 가입되어 변경 불가 상태인 고객 목록입니다.",
      rows: members.map((member) => createMemberDetailRow(member, store)),
    },
    rate: {
      label: "Commission rate",
      title: "영업비율 상세",
      description:
        "전월 대리점 회원 실결제 상품금액에 적용되는 대리점별 영업비율입니다.",
      rows: [
        createSimpleDetailRow(
          "현재 영업비율",
          `${agency.commissionRate}%`,
          "대리점별 개별 관리 값",
        ),
      ],
    },
    sales: {
      label: "Sales",
      title: "정산 대상 매출 상세",
      description:
        "개인 추천링크 구매를 제외한 대리점 회원의 실결제 상품금액입니다.",
      rows: orders.map((order) => createOrderDetailRow(order, store)),
    },
    commission: {
      label: "Commission",
      title: "영업비 예정 상세",
      description:
        "정산 대상 매출에 대리점 영업비율을 적용한 지급 예정 장부입니다.",
      rows: settlements.map((item) => createSettlementDetailRow(item, store)),
    },
    status: {
      label: "Status",
      title: "정산 상태 상세",
      description: "익월 15일 정산 처리 전 대기 상태의 정산 장부입니다.",
      rows: settlements.map((item) => createSettlementDetailRow(item, store)),
    },
  };
  const detail = details[type] || details.sales;

  return `
    <div class="detail-panel-head">
      <div>
        <div class="product-category">Agency detail / ${detail.label}</div>
        <h2 id="adminModalTitle">${detail.title}</h2>
      </div>
      <p>${detail.description}</p>
    </div>
    <div class="process-list">
      ${detail.extra || ""}
      ${detail.rows.join("") || '<div class="admin-detail-empty">표시할 데이터가 없습니다.</div>'}
    </div>
  `;
}

function createAgencyAdminForm() {
  return `
    <div class="agency-admin-form" data-agency-form>
      <input type="hidden" name="agencyId" />
      <label>대리점명<input class="quantity-input" name="name" placeholder="예: 부산 뷰티 대리점" required /></label>
      <label>대리점 코드<input class="quantity-input" name="code" placeholder="예: BUSANBEAUTY" required /></label>
      <label>전용 링크<input class="quantity-input" name="linkSlug" placeholder="예: busan-beauty" required /></label>
      <label>영업비율<input class="quantity-input" name="commissionRate" type="number" min="0" max="100" value="10" required /></label>
      <label>상태
        <select class="option-select" name="status">
          <option value="active">active</option>
          <option value="paused">paused</option>
          <option value="terminated">terminated</option>
        </select>
      </label>
      <div class="agency-form-actions">
        <button class="buy-button" type="button" data-agency-submit>대리점 등록</button>
        <button class="cart-button" type="button" data-agency-reset>입력 초기화</button>
      </div>
    </div>
  `;
}

function createAgencyManageRow(agency) {
  const controls = agency.isHeadquarters
    ? "<strong>기본값</strong>"
    : `
      <button class="cart-button mini-button" type="button" data-agency-edit="${agency.id}">수정</button>
      <button class="cart-button mini-button" type="button" data-agency-delete="${agency.id}">삭제</button>
    `;

  return `
    <article class="agency-table-row">
      <div><strong>${agency.name}</strong><span>${agency.isHeadquarters ? "본사" : "계약"}</span></div>
      <div>${agency.code}</div>
      <div><a href="?agency=${agency.linkSlug}#signup" data-agency-join-link="${agency.linkSlug}">/join/${agency.linkSlug}</a></div>
      <div>${agency.commissionRate}%</div>
      <div>${agency.status}</div>
      <div class="agency-row-actions">${controls}</div>
    </article>
  `;
}

function createAgencyIdentifiers(name) {
  const romanized = romanizeText(name)
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !["daerijeom", "agency"].includes(token));
  const baseTokens = romanized.length ? romanized.slice(0, 2) : ["agency"];
  const slug = baseTokens.join("-").replace(/-+/g, "-");

  return {
    code: slug.replace(/-/g, "").toUpperCase(),
    linkSlug: slug.toLowerCase(),
  };
}

function romanizeText(value) {
  return value
    .trim()
    .toLowerCase()
    .split("")
    .map(romanizeCharacter)
    .join("")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function romanizeCharacter(character) {
  const code = character.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return character;

  const initial = [
    "g",
    "kk",
    "n",
    "d",
    "tt",
    "r",
    "m",
    "b",
    "pp",
    "s",
    "ss",
    "",
    "j",
    "jj",
    "ch",
    "k",
    "t",
    "p",
    "h",
  ];
  const medial = [
    "a",
    "ae",
    "ya",
    "yae",
    "eo",
    "e",
    "yeo",
    "ye",
    "o",
    "wa",
    "wae",
    "oe",
    "yo",
    "u",
    "wo",
    "we",
    "wi",
    "yu",
    "eu",
    "ui",
    "i",
  ];
  const final = [
    "",
    "k",
    "k",
    "ks",
    "n",
    "nj",
    "nh",
    "t",
    "l",
    "lk",
    "lm",
    "lb",
    "ls",
    "lt",
    "lp",
    "lh",
    "m",
    "p",
    "ps",
    "t",
    "t",
    "ng",
    "t",
    "t",
    "k",
    "t",
    "p",
    "h",
  ];
  const index = code - 0xac00;
  const initialIndex = Math.floor(index / 588);
  const medialIndex = Math.floor((index % 588) / 28);
  const finalIndex = index % 28;

  return `${initial[initialIndex]}${medial[medialIndex]}${final[finalIndex]}`;
}

function createMemberDashboard(store) {
  const member =
    store.members.find((item) => item.id === store.currentMemberId) ||
    store.members[0];
  const memberOrders = store.orders.filter(
    (order) => order.memberId === member.id,
  );
  const links = store.personalReferralLinks.filter(
    (link) => link.ownerMemberId === member.id,
  );
  const points = store.pointLedger.filter(
    (item) => item.memberId === member.id,
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
      <section class="management-panel">
        <div class="product-category">Point history</div>
        <div class="process-list">
          ${points
            .slice(0, 4)
            .map(
              (point) => `
              <article class="process-row">
                <div><strong>${point.orderId}</strong><span>${point.note}</span></div>
                <div><span>기준 금액</span><strong>${formatMoney(point.baseAmount)}</strong></div>
                <div><span>적립률</span><strong>${point.rate}%</strong></div>
                <div><span>적립</span><strong>${point.amount.toLocaleString("ko-KR")}P</strong></div>
              </article>
            `,
            )
            .join("")}
        </div>
      </section>
    </section>
  `;
}

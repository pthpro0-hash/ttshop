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
      bindMetricModal("[data-admin-detail]", "#adminDetailModal", (type) =>
        createAdminDetailContent(type, store),
      );
    }

    if (role === "agency") {
      bindMetricModal("[data-agency-detail]", "#agencyDetailModal", (type) =>
        createAgencyDetailContent(type, store),
      );
    }
  }

  function bindMetricModal(cardSelector, modalSelector, createContent) {
    const modal = dom.management.querySelector(modalSelector);
    if (!modal) return;

    dom.management.querySelectorAll(cardSelector).forEach((card) => {
      const open = () => {
        const detailType =
          card.dataset.adminDetail || card.dataset.agencyDetail;
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
      if (
        event.target.matches("[data-modal-close]") ||
        event.target === modal
      ) {
        closeDetailModal(modal);
      }
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
  const latestOrder = store.orders[0];
  const latestPoint = store.pointLedger[0];
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
        ${createMetricCard("admin", "orders", "최근 주문", latestOrder.id)}
        ${createMetricCard("admin", "points", "최근 적립", `${latestPoint.amount.toLocaleString("ko-KR")}P`)}
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
      <div class="management-grid compact">
        <article><span>구매 적립률</span><strong>${settings.purchasePointRate}%</strong></article>
        <article><span>포인트 사용 한도</span><strong>${settings.maxPointUseRate}%</strong></article>
        <article><span>개인 추천자 지급률</span><strong>${settings.personalReferrerRewardRate}%</strong></article>
        <article><span>구매자 추가 지급률</span><strong>${settings.personalBuyerBonusRate}%</strong></article>
      </div>
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
      title: "주문 상세 리스트",
      description:
        "결제 우회 처리로 생성된 주문과 상품 실결제금액, 적립/정산 연결 상태입니다.",
      rows: store.orders.map((order) => createOrderDetailRow(order, store)),
    },
    points: {
      label: "Points",
      title: "포인트 적립 상세 리스트",
      description:
        "배송비 제외 실결제 상품금액 기준으로 생성된 포인트 장부입니다.",
      rows: store.pointLedger.map(createPointDetailRow),
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
      <div><strong>${member.name}</strong><span>${member.phone}</span></div>
      <div><span>보유 포인트</span><strong>${member.points.toLocaleString("ko-KR")}P</strong></div>
      <div><span>주문 수</span><strong>${orders.length}건</strong></div>
      <div><span>내부 대리점</span><strong>${agency?.name || "본사"}</strong></div>
    </article>
  `;
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
      <div><span>적립 포인트</span><strong>${point.amount.toLocaleString("ko-KR")}P</strong></div>
    </article>
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

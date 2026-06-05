import { formatMoney } from "../utils/format.js";

const PRODUCT_OPERATION_DEFAULTS = {
  taxType: "taxable",
  status: "selling",
  displayStatus: "displayed",
  shippingType: "default",
  shippingFee: "3000",
  safetyStock: "5",
  manufacturer: "BEAUTY REF.",
  supplier: "본사 물류",
  origin: "Korea",
  brand: "BEAUTY REF.",
};

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
        if (
          modalSelector === "#adminDetailModal" &&
          detailType === "products"
        ) {
          bindProductAdminForm(modal);
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
      const copyButton = event.target.closest("[data-copy-agency-link]");
      if (copyButton) {
        copyText(copyButton.dataset.copyAgencyLink);
        copyButton.textContent = "복사 완료";
        return;
      }

      const settlementButton = event.target.closest("[data-settlement-status]");
      if (settlementButton) {
        updateSettlementStatus(
          settlementButton.dataset.settlementStatus,
          settlementButton.dataset.statusValue,
        );
        persistStore(store);
        openDetailModal(
          modal,
          createContent(modal.dataset.currentDetail || "settlements"),
        );
        return;
      }

      const agencyMonthButton = event.target.closest("[data-agency-month]");
      if (agencyMonthButton) {
        const monthType = `month:${agencyMonthButton.dataset.agencyMonth}`;
        modal.dataset.monthBackDetail = modal.dataset.currentDetail || "sales";
        modal.dataset.currentDetail = monthType;
        openDetailModal(modal, createContent(monthType));
        return;
      }

      const agencyMonthBack = event.target.closest("[data-agency-month-back]");
      if (agencyMonthBack) {
        const backType = modal.dataset.monthBackDetail || "sales";
        modal.dataset.currentDetail = backType;
        openDetailModal(modal, createContent(backType));
        return;
      }

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

  function copyText(value) {
    const text = String(value || "");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
      return;
    }

    const input = document.createElement("input");
    input.value = text;
    document.body.append(input);
    input.select();
    document.execCommand?.("copy");
    input.remove();
  }

  function updateSettlementStatus(settlementId, status) {
    const settlement = store.agencySettlementLedger.find(
      (item) => item.id === settlementId,
    );
    if (!settlement) return;

    settlement.status = status;
    settlement.updatedAt = new Date().toISOString().slice(0, 10);
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
        getAgencyField(formBox, "contractStart").value =
          agency.contractStart || "";
        getAgencyField(formBox, "contractEnd").value = agency.contractEnd || "";
        getAgencyField(formBox, "managerName").value = agency.managerName || "";
        getAgencyField(formBox, "managerPhone").value =
          agency.managerPhone || "";
        getAgencyField(formBox, "settlementAccount").value =
          agency.settlementAccount || "";
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
        formBox.querySelectorAll("input, textarea").forEach((input) => {
          input.value = input.name === "commissionRate" ? "10" : "";
          delete input.dataset.manual;
        });
        getAgencyField(formBox, "status").value = "active";
        formBox.querySelector("[data-agency-submit]").textContent =
          "대리점 등록";
      });
  }

  function bindProductAdminForm(modal) {
    const formBox = modal.querySelector("[data-product-form]");
    if (!formBox) return;

    formBox
      .querySelector("[data-product-submit]")
      .addEventListener("click", () => {
        if (!saveProductFromForm(formBox)) return;
        persistStore(store);
        reopenAdminDetail("products");
      });

    modal.querySelectorAll("[data-product-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        const product = store.products.find(
          (item) => item.id === button.dataset.productEdit,
        );
        if (!product) return;

        fillProductForm(formBox, product);
      });
    });

    modal.querySelectorAll("[data-product-visibility]").forEach((button) => {
      button.addEventListener("click", () => {
        const product = store.products.find(
          (item) => item.id === button.dataset.productVisibility,
        );
        if (!product) return;

        product.displayStatus =
          product.displayStatus === "hidden" ? "displayed" : "hidden";
        if (product.status === "deleted") product.status = "stopped";
        persistStore(store);
        reopenAdminDetail("products");
      });
    });

    modal
      .querySelectorAll("[data-product-category-filter]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          modal
            .querySelectorAll("[data-product-category-filter]")
            .forEach((item) => {
              item.classList.toggle("is-active", item === button);
            });
          applyProductListControls(modal);
        });
      });
    modal
      .querySelectorAll(
        "[data-product-list-search], [data-product-status-filter], [data-product-sort]",
      )
      .forEach((control) => {
        control.addEventListener("input", () =>
          applyProductListControls(modal),
        );
        control.addEventListener("change", () =>
          applyProductListControls(modal),
        );
      });

    formBox
      .querySelector("[data-product-reset]")
      .addEventListener("click", () => resetProductForm(formBox));
    formBox
      .querySelector("[data-product-defaults]")
      .addEventListener("click", () => {
        applyProductDefaults(formBox);
        setProductFormMessage(formBox, "운영 기본값을 적용했습니다.", "info");
      });
    getProductField(formBox, "image").addEventListener("input", () =>
      updateProductImagePreview(formBox),
    );
    formBox
      .querySelector("[data-product-image-clear]")
      .addEventListener("click", () => {
        getProductField(formBox, "image").value = "";
        updateProductImagePreview(formBox);
      });
    formBox
      .querySelector("[data-product-image-sample]")
      .addEventListener("click", () => {
        getProductField(formBox, "image").value =
          "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80";
        updateProductImagePreview(formBox);
      });
    formBox
      .querySelector("[data-product-image-file]")
      .addEventListener("change", (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", () => {
          getProductField(formBox, "image").value = reader.result;
          updateProductImagePreview(formBox);
        });
        reader.readAsDataURL(file);
      });
    formBox
      .querySelectorAll("[data-product-detail-image-file]")
      .forEach((input) => {
        input.addEventListener("change", (event) => {
          const file = event.target.files?.[0];
          const index = Number(input.dataset.productDetailImageFile);
          if (!file || !index) return;

          const reader = new FileReader();
          reader.addEventListener("load", () => {
            getProductField(formBox, `detailImage${index}`).value =
              reader.result;
            updateProductDetailImagePreviews(formBox);
          });
          reader.readAsDataURL(file);
        });
      });
    formBox
      .querySelectorAll("[data-product-detail-image-clear]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.productDetailImageClear);
          getProductField(formBox, `detailImage${index}`).value = "";
          updateProductDetailImagePreviews(formBox);
        });
      });
    formBox
      .querySelectorAll("[data-product-detail-image-input]")
      .forEach((input) => {
        input.addEventListener("input", () =>
          updateProductDetailImagePreviews(formBox),
        );
      });
    formBox
      .querySelector("[data-variant-add]")
      .addEventListener("click", () => {
        addVariantEditorRow(formBox, {
          optionName: getProductField(formBox, "option").value.trim(),
          sku: createProductSku(getProductField(formBox, "name").value),
          stock: readNumberField(formBox, "stock"),
          priceDelta: 0,
          status: "selling",
        });
        syncVariantEditorToTextarea(formBox);
      });
    formBox
      .querySelector("[data-variant-editor]")
      .addEventListener("input", () => syncVariantEditorToTextarea(formBox));
    formBox
      .querySelector("[data-variant-editor]")
      .addEventListener("change", () => syncVariantEditorToTextarea(formBox));
    formBox
      .querySelector("[data-variant-editor]")
      .addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-variant-remove]");
        if (!removeButton) return;

        const rows = formBox.querySelectorAll("[data-variant-row]");
        if (rows.length <= 1) {
          resetVariantEditor(formBox);
          return;
        }
        removeButton.closest("[data-variant-row]")?.remove();
        syncVariantEditorToTextarea(formBox);
      });
    updateProductImagePreview(formBox);
    updateProductDetailImagePreviews(formBox);
    resetVariantEditor(formBox);
  }

  function getProductField(formBox, name) {
    return formBox.querySelector(`[name="${name}"]`);
  }

  function applyProductListControls(modal) {
    const activeCategory =
      modal.querySelector("[data-product-category-filter].is-active")?.dataset
        .productCategoryFilter || "all";
    const search = (
      modal.querySelector("[data-product-list-search]")?.value || ""
    )
      .trim()
      .toLowerCase();
    const status =
      modal.querySelector("[data-product-status-filter]")?.value || "all";
    const sort = modal.querySelector("[data-product-sort]")?.value || "default";
    const list = modal.querySelector("[data-product-card-list]");
    const cards = Array.from(
      modal.querySelectorAll("[data-product-category-card]"),
    );

    cards.forEach((card) => {
      const stock = Number(card.dataset.productStock || 0);
      const safetyStock = Number(card.dataset.productSafetyStock || 0);
      const matchesCategory =
        activeCategory === "all" ||
        card.dataset.productCategoryCard === activeCategory;
      const matchesSearch =
        !search || card.dataset.productSearch?.includes(search);
      const matchesStatus =
        status === "all" ||
        (status === "hidden"
          ? card.dataset.productDisplay === "hidden"
          : status === "low-stock"
            ? stock <= safetyStock
            : card.dataset.productStatus === status);

      card.classList.toggle(
        "is-filtered-out",
        !matchesCategory || !matchesSearch || !matchesStatus,
      );
    });

    sortProductCards(list, cards, sort);
  }

  function sortProductCards(list, cards, sort) {
    if (!list) return;

    const sorted = [...cards].sort((a, b) => {
      if (sort === "name") {
        return (a.dataset.productName || "").localeCompare(
          b.dataset.productName || "",
          "ko-KR",
        );
      }
      if (sort === "sale-desc") {
        return (
          Number(b.dataset.productSale || 0) -
          Number(a.dataset.productSale || 0)
        );
      }
      if (sort === "sale-asc") {
        return (
          Number(a.dataset.productSale || 0) -
          Number(b.dataset.productSale || 0)
        );
      }
      if (sort === "stock-asc") {
        return (
          Number(a.dataset.productStock || 0) -
          Number(b.dataset.productStock || 0)
        );
      }
      if (sort === "hidden-first") {
        return (
          Number(b.dataset.productDisplay === "hidden") -
          Number(a.dataset.productDisplay === "hidden")
        );
      }
      return 0;
    });

    sorted.forEach((card) => list.append(card));
  }

  function saveProductFromForm(formBox) {
    const productId = getProductField(formBox, "productId").value;
    const payload = readProductForm(formBox);
    if (!payload.ko || !payload.sale) {
      setProductFormMessage(formBox, "상품명 한글과 판매가는 필수입니다.");
      return false;
    }
    if (payload.status === "selling" && payload.stock <= 0) {
      setProductFormMessage(
        formBox,
        "판매중 상품은 재고를 1개 이상 입력해야 구매 가능합니다.",
      );
      return false;
    }
    const skuError = getSkuValidationError(payload, productId);
    if (skuError) {
      setProductFormMessage(formBox, skuError);
      return false;
    }

    if (productId) {
      const product = store.products.find((item) => item.id === productId);
      if (!product) {
        setProductFormMessage(formBox, "수정할 상품을 찾을 수 없습니다.");
        return false;
      }
      Object.assign(product, payload);
      return true;
    }

    store.products.push({
      id: createProductId(payload),
      ...payload,
    });
    return true;
  }

  function readProductForm(formBox) {
    syncVariantEditorToTextarea(formBox);
    const price = readNumberField(formBox, "price");
    const sale = readNumberField(formBox, "sale");
    const stock = readNumberField(formBox, "stock");
    const option = getProductField(formBox, "option").value.trim();
    const sku =
      normalizeSku(getProductField(formBox, "sku").value) ||
      createProductSku(getProductField(formBox, "name").value);

    return {
      sku,
      name:
        getProductField(formBox, "name").value.trim() ||
        createProductSku(getProductField(formBox, "ko").value),
      ko: getProductField(formBox, "ko").value.trim(),
      category: getProductField(formBox, "category").value,
      type: getProductField(formBox, "type").value.trim(),
      badge: getProductField(formBox, "badge").value.trim(),
      price,
      sale,
      supplyPrice: readNumberField(formBox, "supplyPrice"),
      cost: readNumberField(formBox, "cost"),
      taxType: getProductField(formBox, "taxType").value,
      status: getProductField(formBox, "status").value,
      displayStatus: getProductField(formBox, "displayStatus").value,
      stock,
      safetyStock: readNumberField(formBox, "safetyStock"),
      shippingType: getProductField(formBox, "shippingType").value,
      shippingFee: readNumberField(formBox, "shippingFee"),
      pointRateOverride: getProductField(formBox, "pointRateOverride").value,
      option,
      image: getProductField(formBox, "image").value.trim(),
      detailImages: readProductDetailImages(formBox),
      short: getProductField(formBox, "short").value.trim(),
      desc: getProductField(formBox, "desc").value.trim(),
      searchKeywords: getProductField(formBox, "searchKeywords").value.trim(),
      manufacturer: readTextWithDefault(formBox, "manufacturer"),
      supplier: readTextWithDefault(formBox, "supplier"),
      origin: readTextWithDefault(formBox, "origin"),
      brand: readTextWithDefault(formBox, "brand"),
      barcode: getProductField(formBox, "barcode").value.trim(),
      variants: parseVariantRows(
        getProductField(formBox, "variants").value,
        sku,
        option,
        stock,
      ),
    };
  }

  function fillProductForm(formBox, product) {
    const fields = [
      "sku",
      "name",
      "ko",
      "category",
      "type",
      "badge",
      "price",
      "sale",
      "supplyPrice",
      "cost",
      "taxType",
      "status",
      "displayStatus",
      "stock",
      "safetyStock",
      "shippingType",
      "shippingFee",
      "pointRateOverride",
      "option",
      "image",
      "short",
      "desc",
      "searchKeywords",
      "manufacturer",
      "supplier",
      "origin",
      "brand",
      "barcode",
    ];
    getProductField(formBox, "productId").value = product.id;
    fields.forEach((field) => {
      getProductField(formBox, field).value = product[field] ?? "";
    });
    fillProductDetailImages(formBox, product.detailImages);
    getProductField(formBox, "variants").value = formatVariantRows(product);
    fillVariantEditor(formBox, product.variants);
    updateProductImagePreview(formBox);
    updateProductDetailImagePreviews(formBox);
    formBox.querySelector("[data-product-submit]").textContent = "상품 수정";
    setProductFormMessage(formBox, "");
  }

  function resetProductForm(formBox) {
    formBox.querySelectorAll("input, textarea").forEach((input) => {
      input.value = "";
    });
    getProductField(formBox, "category").value = "화장품";
    getProductField(formBox, "taxType").value = "taxable";
    getProductField(formBox, "status").value = "selling";
    getProductField(formBox, "displayStatus").value = "displayed";
    getProductField(formBox, "shippingType").value = "default";
    applyProductDefaults(formBox);
    resetVariantEditor(formBox);
    updateProductImagePreview(formBox);
    updateProductDetailImagePreviews(formBox);
    formBox.querySelector("[data-product-submit]").textContent = "상품 등록";
    setProductFormMessage(formBox, "");
  }

  function applyProductDefaults(formBox) {
    Object.entries(PRODUCT_OPERATION_DEFAULTS).forEach(([field, value]) => {
      const input = getProductField(formBox, field);
      if (input) input.value = value;
    });
  }

  function readTextWithDefault(formBox, field) {
    return (
      getProductField(formBox, field).value.trim() ||
      PRODUCT_OPERATION_DEFAULTS[field] ||
      ""
    );
  }

  function setProductFormMessage(formBox, message, tone = "error") {
    const messageBox = formBox.querySelector("[data-product-form-message]");
    if (!messageBox) return;
    messageBox.textContent = message;
    messageBox.dataset.tone = tone;
  }

  function getSkuValidationError(payload, productId) {
    const productSku = normalizeSku(payload.sku);
    const variantSkus = payload.variants
      .map((variant) => normalizeSku(variant.sku))
      .filter(Boolean);
    const submittedSkus = [productSku, ...variantSkus].filter(Boolean);
    const duplicateInForm = findDuplicateValue(submittedSkus);

    if (duplicateInForm) {
      return `SKU가 중복되었습니다: ${duplicateInForm}`;
    }

    const existingSkus = [];
    (store.products || []).forEach((product) => {
      if (product.id === productId || product.status === "deleted") return;
      existingSkus.push(normalizeSku(product.sku));
      (product.variants || []).forEach((variant) => {
        existingSkus.push(normalizeSku(variant.sku));
      });
    });
    const existingSkuSet = new Set(existingSkus.filter(Boolean));
    const duplicatedExisting = submittedSkus.find((sku) =>
      existingSkuSet.has(sku),
    );

    return duplicatedExisting
      ? `이미 사용 중인 SKU입니다: ${duplicatedExisting}`
      : "";
  }

  function findDuplicateValue(values) {
    const seen = new Set();
    return values.find((value) => {
      if (seen.has(value)) return true;
      seen.add(value);
      return false;
    });
  }

  function normalizeSku(value) {
    return String(value || "")
      .trim()
      .toUpperCase();
  }

  function updateProductImagePreview(formBox) {
    const preview = formBox.querySelector("[data-product-image-preview]");
    const image = getProductField(formBox, "image").value.trim();
    preview.innerHTML = image
      ? `<img src="${escapeAttribute(image)}" alt="상품 이미지 미리보기" />`
      : "<span>이미지 없음</span>";
  }

  function readProductDetailImages(formBox) {
    return Array.from({ length: 5 }, (_, index) =>
      getProductField(formBox, `detailImage${index + 1}`).value.trim(),
    ).filter(Boolean);
  }

  function fillProductDetailImages(formBox, images = []) {
    Array.from({ length: 5 }, (_, index) => {
      getProductField(formBox, `detailImage${index + 1}`).value =
        images[index] || "";
    });
  }

  function updateProductDetailImagePreviews(formBox) {
    formBox
      .querySelectorAll("[data-product-detail-image-preview]")
      .forEach((preview) => {
        const index = Number(preview.dataset.productDetailImagePreview);
        const image = getProductField(
          formBox,
          `detailImage${index}`,
        ).value.trim();
        preview.innerHTML = image
          ? `<img src="${escapeAttribute(image)}" alt="상세 이미지 ${index} 미리보기" />`
          : `<span>${index}</span>`;
      });
  }

  function addVariantEditorRow(formBox, variant = {}) {
    const editor = formBox.querySelector("[data-variant-editor]");
    const row = document.createElement("article");
    row.className = "variant-editor-row";
    row.dataset.variantRow = "true";
    row.innerHTML = createVariantEditorRow(variant);
    editor.append(row);
  }

  function fillVariantEditor(formBox, variants = []) {
    const editor = formBox.querySelector("[data-variant-editor]");
    editor.innerHTML = "";
    const rows = variants.length ? variants : parseVariantRows("", "", "", 0);
    rows.forEach((variant) => addVariantEditorRow(formBox, variant));
    syncVariantEditorToTextarea(formBox);
  }

  function resetVariantEditor(formBox) {
    fillVariantEditor(formBox, [
      {
        optionName:
          getProductField(formBox, "option").value.trim() || "기본 옵션",
        sku: "",
        stock: readNumberField(formBox, "stock"),
        priceDelta: 0,
        status: "selling",
      },
    ]);
  }

  function syncVariantEditorToTextarea(formBox) {
    const rows = Array.from(formBox.querySelectorAll("[data-variant-row]"));
    getProductField(formBox, "variants").value = rows
      .map((row, index) => {
        const optionName =
          row.querySelector("[data-variant-option]")?.value.trim() ||
          `옵션 ${index + 1}`;
        const sku = row.querySelector("[data-variant-sku]")?.value.trim() || "";
        const stock = Math.max(
          0,
          Number(row.querySelector("[data-variant-stock]")?.value || 0),
        );
        const priceDelta = Number(
          row.querySelector("[data-variant-price-delta]")?.value || 0,
        );
        const status =
          row.querySelector("[data-variant-status]")?.value || "selling";
        return `${optionName} | ${sku} | ${stock} | ${priceDelta} | ${status}`;
      })
      .join("\n");
  }

  function readNumberField(formBox, name) {
    return Math.max(0, Number(getProductField(formBox, name).value || 0));
  }

  function parseVariantRows(value, baseSku, fallbackOption, fallbackStock) {
    const rows = String(value || "")
      .split(/\n+/)
      .map((row) => row.trim())
      .filter(Boolean);

    const parsed = rows.map((row, index) => {
      const [optionName, sku, stock, priceDelta, status] = row
        .split("|")
        .map((part) => part.trim());

      return {
        id: `${baseSku.toLowerCase()}-${index + 1}`,
        optionName: optionName || fallbackOption || "기본 옵션",
        sku: sku || `${baseSku}-OPT${index + 1}`,
        stock: Math.max(0, Number(stock || 0)),
        priceDelta: Number(priceDelta || 0),
        status: status || "selling",
      };
    });

    return parsed.length
      ? parsed
      : [
          {
            id: `${baseSku.toLowerCase()}-default`,
            optionName: fallbackOption || "기본 옵션",
            sku: `${baseSku}-STD`,
            stock: fallbackStock,
            priceDelta: 0,
            status: "selling",
          },
        ];
  }

  function formatVariantRows(product) {
    return (product.variants || [])
      .map(
        (variant) =>
          `${variant.optionName || ""} | ${variant.sku || ""} | ${variant.stock || 0} | ${variant.priceDelta || 0} | ${variant.status || "selling"}`,
      )
      .join("\n");
  }

  function createProductId(product) {
    const base = createProductSku(product.name || product.ko)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    let id = `product-${base || Date.now()}`;
    let suffix = 1;

    while (store.products.some((productItem) => productItem.id === id)) {
      suffix += 1;
      id = `product-${base}-${suffix}`;
    }

    return id;
  }

  function createProductSku(value) {
    const source = String(value || "PRODUCT")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return source || `PRODUCT-${Date.now()}`;
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
      contractStart: getAgencyField(formBox, "contractStart").value.trim(),
      contractEnd: getAgencyField(formBox, "contractEnd").value.trim(),
      managerName: getAgencyField(formBox, "managerName").value.trim(),
      managerPhone: getAgencyField(formBox, "managerPhone").value.trim(),
      settlementAccount: getAgencyField(
        formBox,
        "settlementAccount",
      ).value.trim(),
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
    if (type === "agencies") bindAgencyAdminForm(modal);
    if (type === "products") bindProductAdminForm(modal);
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
  const sellingProductCount = (store.products || []).filter(
    (product) => product.status !== "deleted",
  ).length;
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
        ${createMetricCard("admin", "products", "상품 수", `${sellingProductCount}`)}
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

function createAgencySettlementMetric(sales, commission) {
  return `
    <article class="management-card-action settlement-metric-card" tabindex="0" role="button" data-agency-detail="settlement" aria-label="정산매출과 영업비 상세 보기">
      <span>정산매출 / 영업비</span>
      <strong>${formatMoney(sales)}</strong>
      <em>영업비 ${formatMoney(commission)}</em>
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
    products: {
      label: "Products",
      title: "상품관리",
      description:
        "Cafe24형 상품관리 기준으로 기본정보, 가격, 재고, 표시/판매상태, 배송, 공급사, 옵션 SKU를 관리합니다.",
      extra: createProductManagementWorkspace(store),
      rows: [],
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
        createSettlementDetailRow(item, store, { allowStatusActions: true }),
      ),
    },
  };

  return detailMap[type] || detailMap.orders;
}

function createAgencyDetailRow(agency) {
  const link = createAgencyPublicLink(agency);

  return `
    <article class="process-row">
      <div><strong>${agency.name}</strong><span>${agency.isHeadquarters ? "본사 대리점" : "계약 대리점"}</span></div>
      <div><span>전용 코드</span><strong>${agency.code}</strong></div>
      <div><span>전용 링크</span><strong><a href="?agency=${agency.linkSlug}#signup" data-agency-join-link="${agency.linkSlug}">/join/${agency.linkSlug}</a></strong></div>
      <div><span>영업비율 / 상태</span><strong>${agency.commissionRate}% · ${agency.status}</strong></div>
      <div><span>계약 기간</span><strong>${formatAgencyContractPeriod(agency)}</strong></div>
      <div><span>담당자</span><strong>${agency.managerName || "미등록"}</strong></div>
      <div><span>정산 계좌</span><strong>${agency.settlementAccount || "미등록"}</strong></div>
      <div><span>링크 복사</span><button class="cart-button mini-button" type="button" data-copy-agency-link="${escapeAttribute(link)}">복사</button></div>
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

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

function getRecentMonthKeys(count = 6) {
  const start = new Date(`${getCurrentMonthKey()}-01T00:00:00`);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setMonth(start.getMonth() - index);
    return date.toISOString().slice(0, 7);
  });
}

function isCurrentMonthDate(value) {
  return String(value || "").startsWith(getCurrentMonthKey());
}

function isMonthDate(value, monthKey) {
  return String(value || "").startsWith(monthKey);
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

function createSettlementDetailRow(item, store, options = {}) {
  const agency = store.agencies.find(
    (agencyItem) => agencyItem.id === item.agencyId,
  );
  const actions = options.allowStatusActions
    ? [
        ["pending_next_month_15", "대기"],
        ["confirmed", "확정"],
        ["paid", "지급완료"],
        ["hold", "보류"],
      ]
        .map(
          ([status, label]) =>
            `<button class="cart-button mini-button" type="button" data-settlement-status="${item.id}" data-status-value="${status}">${label}</button>`,
        )
        .join("")
    : "";

  return `
    <article class="process-row">
      <div><strong>${item.orderId}</strong><span>${agency?.name || "대리점"} · ${item.status}</span></div>
      <div><span>기준 매출</span><strong>${formatMoney(item.baseAmount)}</strong></div>
      <div><span>영업비율</span><strong>${item.commissionRate}%</strong></div>
      <div><span>지급 예정</span><strong>${formatMoney(item.commissionAmount)}</strong></div>
      ${
        actions
          ? `<div class="settlement-actions"><span>상태 변경</span><strong>${actions}</strong></div>`
          : ""
      }
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
  const link = createAgencyPublicLink(agency);

  return `
    <article class="process-row">
      <div><strong>대리점 가입 링크</strong><span>회원가입 시 대리점 코드 자동 등록</span></div>
      <div><span>링크</span><strong><a href="?agency=${agency.linkSlug}#signup" data-agency-join-link="${agency.linkSlug}">/join/${agency.linkSlug}</a></strong></div>
      <div><span>대리점 코드</span><strong>${agency.code}</strong></div>
      <div><span>상태</span><strong>${agency.status}</strong></div>
      <div><span>복사</span><button class="cart-button mini-button" type="button" data-copy-agency-link="${escapeAttribute(link)}">링크 복사</button></div>
    </article>
  `;
}

function createAgencyPerformanceRow(performance) {
  return `
    <article class="process-row">
      <div><strong>${performance.members}명</strong><span>대리점 코드 귀속 회원</span></div>
      <div><span>구매 전환 회원</span><strong>${performance.buyers}명</strong></div>
      <div><span>정산 대상 주문</span><strong>${performance.orders}건</strong></div>
      <div><span>전환율</span><strong>${performance.conversionRate}%</strong></div>
    </article>
  `;
}

function createAgencyMonthSummary(agency, orders, settlements, monthKey) {
  const monthOrders = orders.filter((order) =>
    isMonthDate(order.paidAt, monthKey),
  );
  const monthSettlements = settlements.filter((item) =>
    isMonthDate(item.createdAt, monthKey),
  );
  const amount = monthOrders.reduce(
    (sum, order) => sum + order.paidProductAmount,
    0,
  );
  const commission = monthSettlements.reduce(
    (sum, item) => sum + item.commissionAmount,
    0,
  );

  return `
    <div class="management-grid compact monthly-point-summary">
      <article><span>대상 월</span><strong>${monthKey}</strong></article>
      <article><span>대리점</span><strong>${agency.name}</strong></article>
      <article><span>정산매출</span><strong>${formatMoney(amount)}</strong></article>
      <article><span>예상 영업비</span><strong>${formatMoney(commission)}</strong></article>
    </div>
  `;
}

function createAgencySixMonthSummary(agency, orders, settlements) {
  return `
    <div class="agency-month-grid" aria-label="최근 6개월 정산 요약">
      ${getRecentMonthKeys(6)
        .map((monthKey) =>
          createAgencyMonthCard(agency, orders, settlements, monthKey),
        )
        .join("")}
    </div>
  `;
}

function createAgencyMonthCard(agency, orders, settlements, monthKey) {
  const monthOrders = orders.filter((order) =>
    isMonthDate(order.paidAt, monthKey),
  );
  const monthSettlements = settlements.filter((item) =>
    isMonthDate(item.createdAt, monthKey),
  );
  const amount = monthOrders.reduce(
    (sum, order) => sum + order.paidProductAmount,
    0,
  );
  const commission = monthSettlements.reduce(
    (sum, item) => sum + item.commissionAmount,
    0,
  );
  const status = getSettlementStatusSummary(monthSettlements);

  return `
    <button class="agency-month-card" type="button" data-agency-month="${monthKey}">
      <span>${agency.code} / ${monthKey}</span>
      <strong>${formatMoney(amount)}</strong>
      <em>영업비 ${formatMoney(commission)} · ${monthOrders.length}건 · ${status}</em>
    </button>
  `;
}

function createAgencyMonthDetailContent(monthKey, store) {
  const agency = getAgencyContext(store);
  if (!agency)
    return '<div class="admin-detail-empty">대리점 정보를 찾을 수 없습니다.</div>';

  const orders = store.orders.filter(
    (order) =>
      order.agencyIdAtOrder === agency.id &&
      order.referralSourceType !== "personal_product",
  );
  const settlements = store.agencySettlementLedger.filter(
    (item) => item.agencyId === agency.id,
  );
  const monthOrders = orders.filter((order) =>
    isMonthDate(order.paidAt, monthKey),
  );
  const monthSettlements = settlements.filter((item) =>
    isMonthDate(item.createdAt, monthKey),
  );

  return `
    <div class="detail-panel-head">
      <div>
        <button class="back-button member-detail-back" type="button" data-agency-month-back>← 최근 6개월</button>
        <div class="product-category">Agency settlement / ${monthKey}</div>
        <h2 id="adminModalTitle">${monthKey} 정산 상세</h2>
      </div>
      <p>해당 월의 배송비 제외 실결제 상품금액과 영업비 예정 장부입니다.</p>
    </div>
    <div class="process-list">
      ${createAgencyMonthSummary(agency, orders, settlements, monthKey)}
      <div class="product-category">월별 주문</div>
      ${monthOrders.map((order) => createOrderDetailRow(order, store)).join("") || '<div class="admin-detail-empty">해당 월 주문이 없습니다.</div>'}
      <div class="product-category">월별 정산 장부</div>
      ${monthSettlements.map((item) => createSettlementDetailRow(item, store)).join("") || '<div class="admin-detail-empty">해당 월 정산 장부가 없습니다.</div>'}
    </div>
  `;
}

function getAgencyContext(store) {
  const currentMember = store.members.find(
    (member) => member.id === store.currentMemberId,
  );
  const memberAgency = store.agencies.find(
    (agency) => agency.id === currentMember?.agencyId,
  );
  if (memberAgency && !memberAgency.isHeadquarters) return memberAgency;

  return (
    store.agencies.find((agency) => !agency.isHeadquarters) ||
    store.agencies.find((agency) => agency.isHeadquarters)
  );
}

function getAgencyLinkPerformance(agency, store) {
  const members = store.members.filter(
    (member) => member.agencyId === agency.id,
  );
  const memberIds = new Set(members.map((member) => member.id));
  const orders = store.orders.filter(
    (order) =>
      order.agencyIdAtOrder === agency.id &&
      order.referralSourceType !== "personal_product",
  );
  const buyerIds = new Set(
    orders
      .map((order) => order.memberId)
      .filter((memberId) => memberIds.has(memberId)),
  );
  const conversionRate = members.length
    ? Math.round((buyerIds.size / members.length) * 100)
    : 0;

  return {
    members: members.length,
    buyers: buyerIds.size,
    orders: orders.length,
    conversionRate,
  };
}

function getSettlementStatusSummary(settlements) {
  if (!settlements.length) return "대기 없음";
  const paid = settlements.filter((item) => item.status === "paid").length;
  const hold = settlements.filter((item) => item.status === "hold").length;
  const confirmed = settlements.filter(
    (item) => item.status === "confirmed",
  ).length;
  const pending = settlements.length - paid - hold - confirmed;

  if (hold) return `보류 ${hold}건`;
  if (pending) return `대기 ${pending}건`;
  if (confirmed) return `확정 ${confirmed}건`;
  return `지급완료 ${paid}건`;
}

function createAgencyPublicLink(agency) {
  const location = window.location || {};
  const isHttp = /^https?:\/\//.test(location.origin || "");
  const origin = isHttp ? location.origin : "http://localhost:8000";
  const path = isHttp ? location.pathname || "/" : "/";
  return `${origin}${path}?agency=${encodeURIComponent(agency.linkSlug)}#signup`;
}

function formatAgencyContractPeriod(agency) {
  if (!agency.contractStart && !agency.contractEnd) return "미등록";
  return `${agency.contractStart || "시작일 미등록"} ~ ${agency.contractEnd || "종료일 미등록"}`;
}

function createEmptyAgencyDashboard() {
  return `
    <section class="management-dashboard">
      <div class="management-head">
        <div>
          <div class="product-category">Agency</div>
          <h1 class="detail-title">Agency Desk.</h1>
        </div>
        <p>표시할 대리점 정보가 없습니다.</p>
      </div>
    </section>
  `;
}

function createAgencyDashboard(store) {
  const agency = getAgencyContext(store);
  if (!agency) return createEmptyAgencyDashboard();

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
  const monthlyOrders = getCurrentMonthOrders(store).filter(
    (order) =>
      order.agencyIdAtOrder === agency.id &&
      order.referralSourceType !== "personal_product",
  );
  const monthlySales = monthlyOrders.reduce(
    (sum, order) => sum + order.paidProductAmount,
    0,
  );
  const linkPerformance = getAgencyLinkPerformance(agency, store);
  const statusSummary = getSettlementStatusSummary(settlements);

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
        ${createAgencySettlementMetric(monthlySales || sales, commission)}
        ${createMetricCard("agency", "performance", "링크 성과", `${linkPerformance.members}명 / ${linkPerformance.orders}건`)}
        ${createMetricCard("agency", "status", "정산 상태", statusSummary)}
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
  if (String(type || "").startsWith("month:")) {
    return createAgencyMonthDetailContent(
      String(type).replace("month:", ""),
      store,
    );
  }

  const agency = getAgencyContext(store);
  if (!agency)
    return '<div class="admin-detail-empty">대리점 정보를 찾을 수 없습니다.</div>';

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
  const linkPerformance = getAgencyLinkPerformance(agency, store);
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
    performance: {
      label: "Performance",
      title: "대리점 링크 성과",
      description:
        "대리점 코드로 귀속된 회원 수와 구매 전환 현황을 확인합니다.",
      rows: [createAgencyPerformanceRow(linkPerformance)],
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
    settlement: {
      label: "Settlement",
      title: "최근 6개월 정산매출 / 영업비",
      description:
        "최근 6개월의 배송비 제외 실결제 상품금액과 영업비 예정 금액입니다. 월을 클릭하면 세부 주문과 정산 장부를 확인합니다.",
      extra: createAgencySixMonthSummary(agency, orders, settlements),
      rows: [],
    },
    sales: null,
    commission: null,
    status: {
      label: "Status",
      title: "정산 상태 상세",
      description: "익월 15일 정산 처리 전 대기 상태의 정산 장부입니다.",
      rows: settlements.map((item) => createSettlementDetailRow(item, store)),
    },
  };
  const detail = details[type] || details.settlement;
  const rows = detail.rows.join("");

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
      ${rows || (detail.extra ? "" : '<div class="admin-detail-empty">표시할 데이터가 없습니다.</div>')}
    </div>
  `;
}

function createAgencyAdminForm() {
  return `
    <div class="agency-admin-form" data-agency-form>
      <input type="hidden" name="agencyId" />
      <section class="agency-form-section product-required-group">
        <div class="product-form-group-head">
          <strong>필수 계약 정보</strong>
          <span>대리점 등록과 정산 계산에 필요한 최소 입력값</span>
        </div>
        <div class="required-form-note">
          <strong>필수</strong>
          <span>대리점명, 대리점 코드, 전용 링크, 영업비율은 반드시 입력해야 합니다.</span>
        </div>
        <div class="agency-form-grid">
          <label>대리점명 <em>필수</em><input class="quantity-input" name="name" placeholder="예: 부산 뷰티 대리점" required /></label>
          <label>대리점 코드 <em>필수</em><input class="quantity-input" name="code" placeholder="예: BUSANBEAUTY" required /></label>
          <label>전용 링크 <em>필수</em><input class="quantity-input" name="linkSlug" placeholder="예: busan-beauty" required /></label>
          <label>영업비율 <em>필수</em><input class="quantity-input" name="commissionRate" type="number" min="0" max="100" value="10" required /></label>
        </div>
      </section>
      <section class="agency-form-section">
        <div class="product-form-group-head">
          <strong>운영 정보</strong>
          <span>계약 기간, 담당자, 정산 계좌는 내부 관리용입니다.</span>
        </div>
        <div class="agency-form-grid">
          <label>상태
            <select class="option-select" name="status">
              <option value="active">active</option>
              <option value="paused">paused</option>
              <option value="terminated">terminated</option>
            </select>
          </label>
          <label>계약 시작일<input class="quantity-input" name="contractStart" type="date" /></label>
          <label>계약 종료일<input class="quantity-input" name="contractEnd" type="date" /></label>
          <label>담당자<input class="quantity-input" name="managerName" placeholder="본사 담당자" /></label>
          <label>담당 연락처<input class="quantity-input" name="managerPhone" placeholder="010-0000-0000" /></label>
          <label class="profile-wide">정산 계좌<input class="quantity-input" name="settlementAccount" placeholder="은행 / 계좌번호 / 예금주" /></label>
        </div>
      </section>
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
      <div>${agency.status}<span>${agency.managerName || "담당 미등록"} · ${agency.settlementAccount || "정산계좌 미등록"}</span></div>
      <div class="agency-row-actions">${controls}</div>
    </article>
  `;
}

function createProductManagementWorkspace(store) {
  const products = (store.products || []).filter(
    (product) => product.status !== "deleted",
  );
  const categoryCounts = getProductCategoryCounts(products);
  const displayedCount = products.filter(
    (product) => product.displayStatus === "displayed",
  ).length;
  const hiddenCount = products.filter(
    (product) => product.displayStatus === "hidden",
  ).length;
  const activeCount = products.filter(
    (product) =>
      product.status === "selling" && product.displayStatus === "displayed",
  ).length;
  const lowStockCount = products.filter(
    (product) => Number(product.stock || 0) <= Number(product.safetyStock || 0),
  ).length;

  return `
    <section class="product-management-shell">
      <aside class="product-list-panel" aria-label="상품 목록">
        <div class="product-list-summary">
          <article><span>전체 상품</span><strong>${products.length}</strong></article>
          <article><span>판매중</span><strong>${activeCount}</strong></article>
          <article><span>노출 상품</span><strong>${displayedCount}</strong></article>
          <article><span>숨김 상품</span><strong>${hiddenCount}</strong></article>
          <article><span>재고주의</span><strong>${lowStockCount}</strong></article>
        </div>
        <div class="product-list-tools">
          <div>
            <strong>상품 목록</strong>
            <span>상품명을 선택하면 오른쪽 편집 패널에 불러옵니다.</span>
          </div>
        </div>
        <div class="product-list-controls" aria-label="상품 목록 검색과 정렬">
          <label>검색
            <input class="quantity-input" type="search" placeholder="상품명, SKU, 키워드" data-product-list-search />
          </label>
          <label>상태
            <select class="option-select" data-product-status-filter>
              <option value="all">전체 상태</option>
              <option value="selling">판매중</option>
              <option value="soldout">품절</option>
              <option value="stopped">판매중지</option>
              <option value="hidden">숨김</option>
              <option value="low-stock">재고주의</option>
            </select>
          </label>
          <label>정렬
            <select class="option-select" data-product-sort>
              <option value="default">기본순</option>
              <option value="name">상품명순</option>
              <option value="sale-desc">판매가 높은순</option>
              <option value="sale-asc">판매가 낮은순</option>
              <option value="stock-asc">재고 적은순</option>
              <option value="hidden-first">숨김 먼저</option>
            </select>
          </label>
        </div>
        <div class="product-category-filters" aria-label="상품 카테고리 필터">
          ${createProductCategoryFilter("all", "전체", products.length, true)}
          ${createProductCategoryFilter("미용기구", "미용기구", categoryCounts["미용기구"] || 0)}
          ${createProductCategoryFilter("미용재료", "미용재료", categoryCounts["미용재료"] || 0)}
          ${createProductCategoryFilter("화장품", "화장품", categoryCounts["화장품"] || 0)}
        </div>
        <div class="product-card-list" data-product-card-list>
          ${products.map(createProductManageRow).join("")}
        </div>
      </aside>
      <section class="product-editor-panel">
        <div class="product-editor-title">
          <div>
            <strong>상품 편집</strong>
            <span>필수 항목부터 저장하고, 운영 세부 정보는 그룹별로 보완합니다.</span>
          </div>
          <span class="product-editor-badge">Admin only</span>
        </div>
        ${createProductAdminForm()}
      </section>
    </section>
  `;
}

function getProductCategoryCounts(products) {
  return products.reduce((counts, product) => {
    counts[product.category] = (counts[product.category] || 0) + 1;
    return counts;
  }, {});
}

function createProductCategoryFilter(category, label, count, isActive = false) {
  return `
    <button class="product-category-filter ${isActive ? "is-active" : ""}" type="button" data-product-category-filter="${category}">
      <span>${label}</span>
      <strong>${count}</strong>
    </button>
  `;
}

function createVariantEditorRow(variant = {}) {
  return `
    <label>옵션명
      <input class="quantity-input" data-variant-option value="${escapeAttribute(variant.optionName || "")}" placeholder="50ml / Rose" />
    </label>
    <label>SKU
      <input class="quantity-input" data-variant-sku value="${escapeAttribute(variant.sku || "")}" placeholder="COS-SUN-STD" />
    </label>
    <label>재고
      <input class="quantity-input" data-variant-stock type="number" min="0" value="${Number(variant.stock || 0)}" />
    </label>
    <label>추가금액
      <input class="quantity-input" data-variant-price-delta type="number" value="${Number(variant.priceDelta || 0)}" />
    </label>
    <label>상태
      <select class="option-select" data-variant-status>
        <option value="selling" ${variant.status === "selling" ? "selected" : ""}>판매중</option>
        <option value="soldout" ${variant.status === "soldout" ? "selected" : ""}>품절</option>
        <option value="stopped" ${variant.status === "stopped" ? "selected" : ""}>판매중지</option>
      </select>
    </label>
    <button class="cart-button mini-button" type="button" data-variant-remove>삭제</button>
  `;
}

function createProductAdminForm() {
  return `
    <div class="agency-admin-form product-admin-form" data-product-form>
      <input type="hidden" name="productId" />
      <section class="product-form-group product-required-group">
        <div class="product-form-group-head">
          <strong>필수 등록 정보</strong>
          <span>상품 판매를 시작하기 위한 최소 입력값</span>
        </div>
        <div class="required-form-note">
          <strong>필수</strong>
          <span>한글 상품명과 판매가는 반드시 입력해야 합니다. 판매중 상품은 재고가 1개 이상이어야 구매 가능합니다.</span>
        </div>
        <div class="product-form-grid product-required-grid">
          <label>상품명 한글 <em>필수</em><input class="quantity-input" name="ko" placeholder="데일리 톤업 선스크린" required /></label>
          <label>판매가 <em>필수</em><input class="quantity-input" name="sale" type="number" min="0" required /></label>
          <label>재고 <em>판매중 필수</em><input class="quantity-input" name="stock" type="number" min="0" /></label>
          <label>카테고리
            <select class="option-select" name="category">
              <option value="미용기구">미용기구</option>
              <option value="미용재료">미용재료</option>
              <option value="화장품" selected>화장품</option>
            </select>
          </label>
        </div>
      </section>
      <section class="product-form-group">
        <div class="product-form-group-head">
          <strong>기본 정보</strong>
          <span>자동 생성 가능한 상품 코드와 쇼핑몰 노출 보조 정보</span>
        </div>
        <div class="product-form-grid">
          <label>상품명 영문<input class="quantity-input" name="name" placeholder="Daily Tone Up Sunscreen" /></label>
          <label>상품코드/SKU<input class="quantity-input" name="sku" placeholder="COS-SUN-001" /></label>
          <label>상품유형<input class="quantity-input" name="type" placeholder="Sun Care SPF" /></label>
          <label>배지<input class="quantity-input" name="badge" placeholder="Best" /></label>
          <label class="profile-wide">검색 키워드<input class="quantity-input" name="searchKeywords" placeholder="상품명, 효능, 카테고리" /></label>
          <label class="profile-wide">목록 설명<input class="quantity-input" name="short" placeholder="상품 카드에 표시할 짧은 설명" /></label>
          <label class="profile-wide">상세 설명<textarea class="quantity-input" name="desc" rows="3" placeholder="상품 상세 설명"></textarea></label>
        </div>
      </section>
      <section class="product-form-group">
        <div class="product-form-group-head">
          <strong>이미지 등록</strong>
          <span>대표 이미지와 결제 상세 안내 이미지를 등록</span>
        </div>
        <div class="product-image-editor">
          <div class="product-image-preview" data-product-image-preview><span>이미지 없음</span></div>
          <div class="product-image-fields">
            <label>대표 이미지 URL<input class="quantity-input" name="image" placeholder="https://..." /></label>
            <label>로컬 이미지 선택<input class="quantity-input" type="file" accept="image/*" data-product-image-file /></label>
            <button class="cart-button mini-button" type="button" data-product-image-sample>샘플 이미지 적용</button>
            <button class="cart-button mini-button" type="button" data-product-image-clear>대표 이미지 삭제</button>
          </div>
        </div>
        <div class="product-detail-image-manager">
          <div class="product-form-group-head compact">
            <strong>상세 안내 이미지</strong>
            <span>결제 페이지 하단에 노출되는 이미지, 최대 5개</span>
          </div>
          ${Array.from(
            { length: 5 },
            (_, index) => `
            <article class="product-detail-image-row">
              <div class="product-detail-image-preview" data-product-detail-image-preview="${index + 1}"><span>${index + 1}</span></div>
              <label>상세 이미지 ${index + 1} URL
                <input class="quantity-input" name="detailImage${index + 1}" placeholder="https://..." data-product-detail-image-input="${index + 1}" />
              </label>
              <label>파일 선택
                <input class="quantity-input" type="file" accept="image/*" data-product-detail-image-file="${index + 1}" />
              </label>
              <button class="cart-button mini-button" type="button" data-product-detail-image-clear="${index + 1}">삭제</button>
            </article>
          `,
          ).join("")}
        </div>
      </section>
      <section class="product-form-group">
        <div class="product-form-group-head">
          <strong>가격 / 판매 / 재고</strong>
          <span>판매가, 원가, 마진, 품절 기준</span>
        </div>
        <div class="product-form-grid">
          <label>소비자가<input class="quantity-input" name="price" type="number" min="0" /></label>
          <label>공급가<input class="quantity-input" name="supplyPrice" type="number" min="0" /></label>
          <label>원가<input class="quantity-input" name="cost" type="number" min="0" /></label>
          <label>안전재고<input class="quantity-input" name="safetyStock" type="number" min="0" value="5" /></label>
          <label>판매상태
            <select class="option-select" name="status">
              <option value="selling">판매중</option>
              <option value="soldout">품절</option>
              <option value="stopped">판매중지</option>
            </select>
          </label>
          <label>진열상태
            <select class="option-select" name="displayStatus">
              <option value="displayed">진열함</option>
              <option value="hidden">진열안함</option>
            </select>
          </label>
        </div>
      </section>
      <section class="product-form-group">
        <div class="product-form-group-head">
          <strong>배송 / 정책 / 공급</strong>
          <span>배송비, 과세, 공급사, 제조 기준</span>
        </div>
        <div class="product-defaults-row">
          <p>반복 입력이 많은 운영 기준값은 상품별로 한 번에 채울 수 있습니다.</p>
          <button class="cart-button mini-button" type="button" data-product-defaults>운영 기본값 적용</button>
        </div>
        <div class="product-form-grid">
          <label>배송정책
            <select class="option-select" name="shippingType">
              <option value="default">기본 배송</option>
              <option value="free">무료 배송</option>
              <option value="conditional">조건부 무료</option>
              <option value="supplier">공급사 배송</option>
            </select>
          </label>
          <label>배송비<input class="quantity-input" name="shippingFee" type="number" min="0" value="3000" /></label>
          <label>과세
            <select class="option-select" name="taxType">
              <option value="taxable">과세</option>
              <option value="tax_free">면세</option>
              <option value="zero_tax">영세</option>
            </select>
          </label>
          <label>상품별 적립률<input class="quantity-input" name="pointRateOverride" type="number" min="0" max="100" placeholder="공란이면 기본 적립률" /></label>
          <label>제조사<input class="quantity-input" name="manufacturer" placeholder="BEAUTY REF." /></label>
          <label>공급사<input class="quantity-input" name="supplier" placeholder="본사 물류" /></label>
          <label>원산지<input class="quantity-input" name="origin" placeholder="Korea" /></label>
          <label>브랜드<input class="quantity-input" name="brand" placeholder="BEAUTY REF." /></label>
          <label>바코드<input class="quantity-input" name="barcode" placeholder="880..." /></label>
        </div>
      </section>
      <section class="product-form-group">
        <div class="product-form-group-head">
          <strong>옵션 / SKU</strong>
          <span>색상, 용량, 밝기 같은 하위 상품군 관리</span>
        </div>
        <div class="product-form-grid variant-main-grid">
          <label>대표 옵션<input class="quantity-input" name="option" placeholder="50ml / SPF50+ PA++++" /></label>
        </div>
        <div class="variant-editor-toolbar">
          <div>
            <strong>옵션 SKU 목록</strong>
            <span>옵션별 재고, 추가금액, 판매상태를 개별 관리합니다.</span>
          </div>
          <button class="cart-button mini-button variant-add-button" type="button" data-variant-add>옵션 추가</button>
        </div>
        <div class="variant-editor" data-variant-editor aria-label="옵션 SKU 목록"></div>
        <label class="profile-wide variant-raw-field" hidden>옵션 SKU 원본
          <textarea class="quantity-input" name="variants" rows="4" placeholder="옵션명 | SKU | 재고 | 추가금액 | 상태" hidden></textarea>
        </label>
      </section>
      <div class="agency-form-actions">
        <button class="buy-button" type="button" data-product-submit>상품 등록</button>
        <button class="cart-button" type="button" data-product-reset>입력 초기화</button>
      </div>
      <p class="product-form-message" data-product-form-message aria-live="polite"></p>
    </div>
  `;
}

function createProductManageRow(product) {
  const margin = product.sale - (product.supplyPrice || product.cost || 0);
  const stockWarning =
    Number(product.stock || 0) <= Number(product.safetyStock || 0)
      ? " · 안전재고 이하"
      : "";
  const image = product.image
    ? `<img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.ko)}" />`
    : `<span>${product.category}</span>`;
  const isHidden = product.displayStatus === "hidden";
  const visibilityLabel = isHidden ? "노출" : "숨김";

  return `
    <article class="product-list-card ${isHidden ? "is-hidden-product" : ""}" data-product-category-card="${product.category}" data-product-search="${escapeAttribute(`${product.name} ${product.ko} ${product.sku || ""} ${product.id} ${product.searchKeywords || ""}`.toLowerCase())}" data-product-status="${product.status}" data-product-display="${product.displayStatus}" data-product-stock="${Number(product.stock || 0)}" data-product-safety-stock="${Number(product.safetyStock || 0)}" data-product-sale="${Number(product.sale || 0)}" data-product-name="${escapeAttribute(product.ko || product.name)}">
      <div class="product-list-thumb">${image}</div>
      <div class="product-list-main">
        <div class="product-list-title">
          <strong>${product.ko}</strong>
          <span>${product.name}</span>
        </div>
        <div class="product-list-meta">
          <span>${product.category}</span>
          <span>${product.sku || product.id}</span>
          <span>${product.displayStatus} / ${product.status}</span>
        </div>
        <div class="product-list-stats">
          <span>판매가 <strong>${formatMoney(product.sale)}</strong></span>
          <span>마진 <strong>${formatMoney(margin)}</strong></span>
          <span>재고 <strong>${product.stock || 0}개${stockWarning}</strong></span>
        </div>
      </div>
      <div class="product-list-actions">
        <button class="cart-button mini-button" type="button" data-product-edit="${product.id}">편집</button>
        <button class="cart-button mini-button" type="button" data-product-visibility="${product.id}">${visibilityLabel}</button>
      </div>
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

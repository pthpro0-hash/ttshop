import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { cloneDefaultStore } from "../scripts/data/demo-store.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(currentDir);
const dataDir = join(rootDir, "data");
const defaultDbPath = join(dataDir, "beauty-shop.sqlite");
const schemaPath = join(currentDir, "schema.sql");

export function openShopDatabase(dbPath = defaultDbPath) {
  mkdirSync(dirname(dbPath), { recursive: true });
  const database = new DatabaseSync(dbPath);
  database.exec("PRAGMA foreign_keys = ON");
  database.exec(readFileSync(schemaPath, "utf8"));
  migrateDatabase(database);

  if (!hasSeedData(database)) {
    writeStore(database, cloneDefaultStore());
  }

  return database;
}

function migrateDatabase(database) {
  ensureColumn(database, "products", "detail_images", "TEXT");
  ensureColumn(database, "agencies", "contract_start", "TEXT");
  ensureColumn(database, "agencies", "contract_end", "TEXT");
  ensureColumn(database, "agencies", "manager_name", "TEXT");
  ensureColumn(database, "agencies", "manager_phone", "TEXT");
  ensureColumn(database, "agencies", "settlement_account", "TEXT");
  ensureColumn(database, "agencies", "login_user_id", "TEXT");
  ensureColumn(database, "agencies", "login_password_hash", "TEXT");
  ensureColumn(database, "members", "role", "TEXT NOT NULL DEFAULT 'member'");
  ensureColumn(database, "members", "shipping_addresses", "TEXT");
  ensureColumn(database, "orders", "point_used", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn(
    database,
    "orders",
    "point_use_limit",
    "INTEGER NOT NULL DEFAULT 0",
  );
  ensureColumn(
    database,
    "orders",
    "shipping_status",
    "TEXT NOT NULL DEFAULT 'preparing'",
  );
  ensureColumn(database, "orders", "courier", "TEXT");
  ensureColumn(database, "orders", "tracking_number", "TEXT");
  ensureColumn(database, "orders", "shipped_at", "TEXT");
  ensureColumn(database, "orders", "delivered_at", "TEXT");
  ensureColumn(database, "orders", "shipping_memo", "TEXT");
  ensureColumn(database, "orders", "shipping_address", "TEXT");
  ensureColumn(database, "orders", "payment_method", "TEXT");
  ensureColumn(database, "agency_settlement_ledger", "updated_at", "TEXT");
  ensureColumn(
    database,
    "agency_settlement_ledger",
    "status_updated_by",
    "TEXT",
  );
  ensureColumn(database, "agency_settlement_ledger", "status_note", "TEXT");
  ensureColumn(database, "agency_settlement_ledger", "status_history", "TEXT");
}

function ensureColumn(database, table, column, definition) {
  const columns = database.prepare(`PRAGMA table_info(${table})`).all();
  if (columns.some((item) => item.name === column)) return;
  database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

export function readStore(database) {
  const store = cloneDefaultStore();
  const meta = Object.fromEntries(
    database
      .prepare("SELECT key, value FROM app_meta")
      .all()
      .map((row) => [row.key, row.value]),
  );
  const settings = Object.fromEntries(
    database
      .prepare("SELECT key, value FROM settings")
      .all()
      .map((row) => [row.key, Number(row.value)]),
  );

  store.currentMemberId = meta.currentMemberId || "";
  store.pendingAgencySlug = meta.pendingAgencySlug || "";
  store.settings = { ...store.settings, ...settings };
  store.agencies = database
    .prepare("SELECT * FROM agencies ORDER BY is_headquarters DESC, name ASC")
    .all()
    .map(mapAgency);
  store.products = database
    .prepare("SELECT * FROM products ORDER BY category ASC, name ASC")
    .all()
    .map((product) => ({
      ...mapProduct(product),
      variants: database
        .prepare(
          "SELECT * FROM product_variants WHERE product_id = ? ORDER BY id ASC",
        )
        .all(product.id)
        .map(mapProductVariant),
    }));
  if (!store.products.length) store.products = cloneDefaultStore().products;
  store.members = database
    .prepare("SELECT * FROM members ORDER BY joined_at ASC, id ASC")
    .all()
    .map(mapMember);
  store.orders = database
    .prepare("SELECT * FROM orders ORDER BY paid_at DESC, id DESC")
    .all()
    .map((order) => ({
      ...mapOrder(order),
      items: database
        .prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC")
        .all(order.id)
        .map(mapOrderItem),
    }));
  store.pointLedger = database
    .prepare("SELECT * FROM point_ledger ORDER BY created_at DESC, id DESC")
    .all()
    .map(mapPointLedger);
  store.agencySettlementLedger = database
    .prepare(
      "SELECT * FROM agency_settlement_ledger ORDER BY created_at DESC, id DESC",
    )
    .all()
    .map(mapAgencySettlement);
  store.personalReferralLinks = database
    .prepare("SELECT * FROM personal_referral_links ORDER BY id DESC")
    .all()
    .map(mapReferralLink);

  return store;
}

export function writeStore(database, store) {
  const snapshot = normalizeStore(store);
  database.exec("BEGIN IMMEDIATE");
  try {
    clearTables(database);
    insertMeta(database, "currentMemberId", snapshot.currentMemberId || "");
    insertMeta(database, "pendingAgencySlug", snapshot.pendingAgencySlug || "");
    insertSettings(database, snapshot.settings);
    snapshot.agencies.forEach((agency) => insertAgency(database, agency));
    snapshot.products.forEach((product) => {
      insertProduct(database, product);
      (product.variants || []).forEach((variant) =>
        insertProductVariant(database, product.id, variant),
      );
    });
    snapshot.members.forEach((member) => insertMember(database, member));
    snapshot.orders.forEach((order) => {
      insertOrder(database, order);
      (order.items || []).forEach((item) =>
        insertOrderItem(database, order.id, item),
      );
    });
    snapshot.pointLedger.forEach((point) => insertPointLedger(database, point));
    snapshot.agencySettlementLedger.forEach((settlement) =>
      insertAgencySettlement(database, settlement),
    );
    snapshot.personalReferralLinks.forEach((link) =>
      insertReferralLink(database, link),
    );
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

function hasSeedData(database) {
  return (
    database.prepare("SELECT COUNT(*) AS count FROM agencies").get().count > 0
  );
}

function normalizeStore(store) {
  const defaults = cloneDefaultStore();
  return {
    ...defaults,
    ...store,
    settings: { ...defaults.settings, ...store?.settings },
    agencies: store?.agencies || defaults.agencies,
    products: store?.products || defaults.products,
    members: store?.members || defaults.members,
    orders: store?.orders || defaults.orders,
    pointLedger: store?.pointLedger || defaults.pointLedger,
    agencySettlementLedger:
      store?.agencySettlementLedger || defaults.agencySettlementLedger,
    personalReferralLinks:
      store?.personalReferralLinks || defaults.personalReferralLinks,
  };
}

function clearTables(database) {
  [
    "personal_referral_links",
    "agency_settlement_ledger",
    "point_ledger",
    "order_items",
    "orders",
    "members",
    "product_variants",
    "products",
    "agencies",
    "settings",
    "app_meta",
  ].forEach((table) => database.exec(`DELETE FROM ${table}`));
}

function insertMeta(database, key, value) {
  database
    .prepare("INSERT INTO app_meta (key, value) VALUES (?, ?)")
    .run(key, value);
}

function insertSettings(database, settings) {
  const statement = database.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?)",
  );
  Object.entries(settings).forEach(([key, value]) =>
    statement.run(key, Number(value) || 0),
  );
}

function insertAgency(database, agency) {
  database
    .prepare(
      `
      INSERT INTO agencies
        (id, name, code, link_slug, commission_rate, status, is_headquarters,
         contract_start, contract_end, manager_name, manager_phone, settlement_account,
         login_user_id, login_password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      agency.id,
      agency.name,
      agency.code,
      agency.linkSlug,
      Number(agency.commissionRate) || 0,
      agency.status || "active",
      agency.isHeadquarters ? 1 : 0,
      agency.contractStart || "",
      agency.contractEnd || "",
      agency.managerName || "",
      agency.managerPhone || "",
      agency.settlementAccount || "",
      agency.loginUserId || "",
      agency.loginPasswordHash || "",
    );
}

function insertProduct(database, product) {
  database
    .prepare(
      `
      INSERT INTO products
        (id, sku, name, ko, category, type, badge, price, sale, supply_price,
         cost, tax_type, status, display_status, stock, safety_stock,
         shipping_type, shipping_fee, point_rate_override, option_text, image,
         detail_images, short, desc, search_keywords, manufacturer, supplier, origin, brand, barcode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      product.id,
      product.sku || "",
      product.name || "",
      product.ko || "",
      product.category || "",
      product.type || "",
      product.badge || "",
      Number(product.price) || 0,
      Number(product.sale) || 0,
      Number(product.supplyPrice) || 0,
      Number(product.cost) || 0,
      product.taxType || "taxable",
      product.status || "selling",
      product.displayStatus || "displayed",
      Number(product.stock) || 0,
      Number(product.safetyStock) || 0,
      product.shippingType || "default",
      Number(product.shippingFee) || 0,
      product.pointRateOverride === "" ||
        product.pointRateOverride === undefined
        ? null
        : Number(product.pointRateOverride),
      product.option || "",
      product.image || "",
      JSON.stringify(normalizeDetailImages(product.detailImages)),
      product.short || "",
      product.desc || "",
      product.searchKeywords || "",
      product.manufacturer || "",
      product.supplier || "",
      product.origin || "",
      product.brand || "",
      product.barcode || "",
    );
}

function insertProductVariant(database, productId, variant) {
  database
    .prepare(
      `
      INSERT INTO product_variants
        (id, product_id, option_name, sku, price_delta, stock, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      variant.id,
      productId,
      variant.optionName || "",
      variant.sku || "",
      Number(variant.priceDelta) || 0,
      Number(variant.stock) || 0,
      variant.status || "selling",
    );
}

function insertMember(database, member) {
  database
    .prepare(
      `
      INSERT INTO members
        (id, user_id, password_hash, auth_provider, name, phone, email, agency_id,
         role, points, status, joined_at, postcode, address, address_detail,
         shipping_addresses, payment_method, favorite_category, marketing_opt_in, internal_memo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      member.id,
      member.userId || "",
      member.passwordHash || "",
      member.authProvider || "",
      member.name || "",
      member.phone || "",
      member.email || "",
      member.agencyId || null,
      member.role || "member",
      Number(member.points) || 0,
      member.status || "active",
      member.joinedAt || "",
      member.address?.postcode || "",
      member.address?.address || "",
      member.address?.addressDetail || "",
      JSON.stringify(normalizeShippingAddresses(member)),
      member.paymentMethod || "",
      member.favoriteCategory || "",
      member.marketingOptIn === undefined
        ? null
        : member.marketingOptIn
          ? 1
          : 0,
      member.internalMemo || "",
    );
}

function insertOrder(database, order) {
  database
    .prepare(
      `
      INSERT INTO orders
        (id, member_id, agency_id_at_order, referral_source_type,
         paid_product_amount, shipping_amount, paid_amount, point_used,
         point_use_limit, point_earned,
         status, shipping_status, courier, tracking_number, shipped_at,
         delivered_at, shipping_memo, shipping_address, payment_method, paid_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      order.id,
      order.memberId,
      order.agencyIdAtOrder || null,
      order.referralSourceType || "none",
      Number(order.paidProductAmount) || 0,
      Number(order.shippingAmount) || 0,
      Number(order.paidAmount) || 0,
      Number(order.pointUsed) || 0,
      Number(order.pointUseLimit) || 0,
      Number(order.pointEarned) || 0,
      order.status || "paid",
      order.shippingStatus || "preparing",
      order.courier || "",
      order.trackingNumber || "",
      order.shippedAt || "",
      order.deliveredAt || "",
      order.shippingMemo || "",
      JSON.stringify(order.shippingAddress || {}),
      order.paymentMethod || "",
      order.paidAt || "",
    );
}

function insertOrderItem(database, orderId, item) {
  database
    .prepare(
      `
      INSERT INTO order_items
        (order_id, product_id, product_name, product_ko, sale, qty, option_text)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      orderId,
      item.productId,
      item.productName || "",
      item.productKo || "",
      Number(item.sale) || 0,
      Number(item.qty) || 1,
      item.option || "",
    );
}

function insertPointLedger(database, point) {
  database
    .prepare(
      `
      INSERT INTO point_ledger
        (id, member_id, order_id, type, amount, base_amount, rate, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      point.id,
      point.memberId,
      point.orderId || null,
      point.type,
      Number(point.amount) || 0,
      Number(point.baseAmount) || 0,
      Number(point.rate) || 0,
      point.note || "",
      point.createdAt || "",
    );
}

function insertAgencySettlement(database, settlement) {
  database
    .prepare(
      `
      INSERT INTO agency_settlement_ledger
        (id, agency_id, order_id, base_amount, commission_rate,
         commission_amount, status, updated_at, status_updated_by,
         status_note, status_history, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      settlement.id,
      settlement.agencyId,
      settlement.orderId || null,
      Number(settlement.baseAmount) || 0,
      Number(settlement.commissionRate) || 0,
      Number(settlement.commissionAmount) || 0,
      settlement.status || "",
      settlement.updatedAt || "",
      settlement.statusUpdatedBy || "",
      settlement.statusNote || "",
      JSON.stringify(settlement.statusHistory || []),
      settlement.note || "",
      settlement.createdAt || "",
    );
}

function insertReferralLink(database, link) {
  database
    .prepare(
      `
      INSERT INTO personal_referral_links
        (id, owner_member_id, product_id, order_id, unit_index, code, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      link.id,
      link.ownerMemberId,
      link.productId,
      link.orderId || null,
      Number(link.unitIndex) || 1,
      link.code,
      link.status || "active",
    );
}

function mapAgency(row) {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    linkSlug: row.link_slug,
    commissionRate: row.commission_rate,
    status: row.status,
    isHeadquarters: Boolean(row.is_headquarters),
    contractStart: row.contract_start || "",
    contractEnd: row.contract_end || "",
    managerName: row.manager_name || "",
    managerPhone: row.manager_phone || "",
    settlementAccount: row.settlement_account || "",
    loginUserId: row.login_user_id || "",
    loginPasswordHash: row.login_password_hash || "",
  };
}

function mapProduct(row) {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    ko: row.ko,
    category: row.category,
    type: row.type,
    badge: row.badge,
    price: row.price,
    sale: row.sale,
    supplyPrice: row.supply_price,
    cost: row.cost,
    taxType: row.tax_type,
    status: row.status,
    displayStatus: row.display_status,
    stock: row.stock,
    safetyStock: row.safety_stock,
    shippingType: row.shipping_type,
    shippingFee: row.shipping_fee,
    pointRateOverride:
      row.point_rate_override === null ? "" : row.point_rate_override,
    option: row.option_text,
    image: row.image,
    detailImages: parseDetailImages(row.detail_images, row.image),
    short: row.short,
    desc: row.desc,
    searchKeywords: row.search_keywords,
    manufacturer: row.manufacturer,
    supplier: row.supplier,
    origin: row.origin,
    brand: row.brand,
    barcode: row.barcode,
    variants: [],
  };
}

function normalizeDetailImages(images) {
  return (Array.isArray(images) ? images : [])
    .map((image) => String(image || "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

function parseDetailImages(value, fallbackImage = "") {
  if (!value) return fallbackImage ? [fallbackImage] : [];
  try {
    const images = normalizeDetailImages(JSON.parse(value));
    return images.length ? images : fallbackImage ? [fallbackImage] : [];
  } catch {
    const images = String(value || "")
      .split(/\n+/)
      .map((image) => image.trim())
      .filter(Boolean)
      .slice(0, 5);
    return images.length ? images : fallbackImage ? [fallbackImage] : [];
  }
}

function normalizeShippingAddresses(member) {
  const source = Array.isArray(member.shippingAddresses)
    ? member.shippingAddresses
    : [];
  const addresses = source
    .map((address, index) => ({
      id: address.id || `addr-${index + 1}`,
      label:
        address.label || (index === 0 ? "기본 배송지" : `배송지 ${index + 1}`),
      recipient: address.recipient || member.name || "",
      phone: address.phone || member.phone || "",
      postcode: address.postcode || "",
      address: address.address || "",
      addressDetail: address.addressDetail || "",
      isDefault: Boolean(address.isDefault || index === 0),
    }))
    .filter(
      (address) => address.postcode || address.address || address.addressDetail,
    );

  if (!addresses.length && member.address) {
    addresses.push({
      id: "addr-default",
      label: "기본 배송지",
      recipient: member.name || "",
      phone: member.phone || "",
      postcode: member.address.postcode || "",
      address: member.address.address || "",
      addressDetail: member.address.addressDetail || "",
      isDefault: true,
    });
  }

  if (addresses.length && !addresses.some((address) => address.isDefault)) {
    addresses[0].isDefault = true;
  }

  return addresses.slice(0, 5);
}

function parseShippingAddresses(value, fallbackAddress = {}) {
  try {
    const parsed = JSON.parse(value || "[]");
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {}

  if (
    fallbackAddress.postcode ||
    fallbackAddress.address ||
    fallbackAddress.addressDetail
  ) {
    return [
      {
        id: "addr-default",
        label: "기본 배송지",
        recipient: "",
        phone: "",
        postcode: fallbackAddress.postcode || "",
        address: fallbackAddress.address || "",
        addressDetail: fallbackAddress.addressDetail || "",
        isDefault: true,
      },
    ];
  }

  return [];
}

function mapProductVariant(row) {
  return {
    id: row.id,
    optionName: row.option_name,
    sku: row.sku,
    priceDelta: row.price_delta,
    stock: row.stock,
    status: row.status,
  };
}

function mapMember(row) {
  const address = {
    postcode: row.postcode,
    address: row.address,
    addressDetail: row.address_detail,
  };
  const member = {
    id: row.id,
    userId: row.user_id,
    passwordHash: row.password_hash,
    authProvider: row.auth_provider,
    name: row.name,
    phone: row.phone,
    email: row.email,
    agencyId: row.agency_id,
    role: row.role || "member",
    points: row.points,
    status: row.status,
    joinedAt: row.joined_at,
    address,
    shippingAddresses: parseShippingAddresses(row.shipping_addresses, address),
    paymentMethod: row.payment_method,
    favoriteCategory: row.favorite_category,
    internalMemo: row.internal_memo,
  };

  if (row.marketing_opt_in !== null) {
    member.marketingOptIn = Boolean(row.marketing_opt_in);
  }

  return member;
}

function mapOrder(row) {
  return {
    id: row.id,
    memberId: row.member_id,
    agencyIdAtOrder: row.agency_id_at_order,
    referralSourceType: row.referral_source_type,
    paidProductAmount: row.paid_product_amount,
    shippingAmount: row.shipping_amount,
    paidAmount: row.paid_amount,
    pointUsed: row.point_used || 0,
    pointUseLimit: row.point_use_limit || 0,
    pointEarned: row.point_earned,
    status: row.status,
    shippingStatus: row.shipping_status || "preparing",
    courier: row.courier || "",
    trackingNumber: row.tracking_number || "",
    shippedAt: row.shipped_at || "",
    deliveredAt: row.delivered_at || "",
    shippingMemo: row.shipping_memo || "",
    shippingAddress: parseJsonObject(row.shipping_address),
    paymentMethod: row.payment_method || "",
    paidAt: row.paid_at,
    items: [],
  };
}

function parseJsonObject(value) {
  try {
    const parsed = JSON.parse(value || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function mapOrderItem(row) {
  return {
    productId: row.product_id,
    productName: row.product_name,
    productKo: row.product_ko,
    sale: row.sale,
    qty: row.qty,
    option: row.option_text,
  };
}

function mapPointLedger(row) {
  return {
    id: row.id,
    memberId: row.member_id,
    orderId: row.order_id,
    type: row.type,
    amount: row.amount,
    baseAmount: row.base_amount,
    rate: row.rate,
    note: row.note,
    createdAt: row.created_at,
  };
}

function mapAgencySettlement(row) {
  return {
    id: row.id,
    agencyId: row.agency_id,
    orderId: row.order_id,
    baseAmount: row.base_amount,
    commissionRate: row.commission_rate,
    commissionAmount: row.commission_amount,
    status: row.status,
    updatedAt: row.updated_at || "",
    statusUpdatedBy: row.status_updated_by || "",
    statusNote: row.status_note || "",
    statusHistory: parseJsonArray(row.status_history),
    note: row.note,
    createdAt: row.created_at,
  };
}

function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapReferralLink(row) {
  return {
    id: row.id,
    ownerMemberId: row.owner_member_id,
    productId: row.product_id,
    orderId: row.order_id,
    unitIndex: row.unit_index,
    code: row.code,
    status: row.status,
  };
}

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

  if (!hasSeedData(database)) {
    writeStore(database, cloneDefaultStore());
  }

  return database;
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
        (id, name, code, link_slug, commission_rate, status, is_headquarters)
      VALUES (?, ?, ?, ?, ?, ?, ?)
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
    );
}

function insertMember(database, member) {
  database
    .prepare(
      `
      INSERT INTO members
        (id, user_id, password_hash, auth_provider, name, phone, email, agency_id,
         points, status, joined_at, postcode, address, address_detail,
         payment_method, favorite_category, marketing_opt_in, internal_memo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      Number(member.points) || 0,
      member.status || "active",
      member.joinedAt || "",
      member.address?.postcode || "",
      member.address?.address || "",
      member.address?.addressDetail || "",
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
         paid_product_amount, shipping_amount, paid_amount, point_earned,
         status, paid_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      Number(order.pointEarned) || 0,
      order.status || "paid",
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
         commission_amount, status, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
  };
}

function mapMember(row) {
  const member = {
    id: row.id,
    userId: row.user_id,
    passwordHash: row.password_hash,
    authProvider: row.auth_provider,
    name: row.name,
    phone: row.phone,
    email: row.email,
    agencyId: row.agency_id,
    points: row.points,
    status: row.status,
    joinedAt: row.joined_at,
    address: {
      postcode: row.postcode,
      address: row.address,
      addressDetail: row.address_detail,
    },
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
    pointEarned: row.point_earned,
    status: row.status,
    paidAt: row.paid_at,
    items: [],
  };
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
    note: row.note,
    createdAt: row.created_at,
  };
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

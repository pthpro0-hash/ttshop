import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { cloneDefaultStore } from "../scripts/data/demo-store.js";
import { openShopDatabase, readStore, writeStore } from "../server/db.mjs";
import {
  completeBypassPayment,
  confirmPurchase,
} from "../scripts/domain/order-processing.js";

const tempDir = mkdtempSync(join(tmpdir(), "beauty-shop-db-"));
let database;

try {
  const databasePath = join(tempDir, "shop.sqlite");
  database = openShopDatabase(databasePath);
  const seeded = readStore(database);

  assert.equal(
    seeded.members.length,
    1,
    "database should seed default members",
  );
  assert.equal(
    seeded.agencies.some((agency) => agency.code === "GNBEAUTY"),
    true,
    "database should seed default agencies",
  );
  assert.equal(
    seeded.products.length,
    10,
    "database should expose seeded product management data",
  );

  const store = cloneDefaultStore();
  const gangnamAgency = store.agencies.find(
    (agency) => agency.id === "agency-gangnam",
  );
  gangnamAgency.contractStart = "2026-05-01";
  gangnamAgency.contractEnd = "2026-12-31";
  gangnamAgency.managerName = "DB 담당자";
  gangnamAgency.managerPhone = "010-2222-3333";
  gangnamAgency.settlementAccount = "DB은행 999-000";
  gangnamAgency.loginUserId = "dbagency01";
  gangnamAgency.loginPasswordHash = "hash-agency";
  store.products[0].sale = 74000;
  store.products[0].stock = 12;
  store.products[0].detailImages = [
    "https://example.com/device-led-detail-1.jpg",
    "https://example.com/device-led-detail-2.jpg",
  ];
  store.products[0].variants[0].stock = 12;
  store.members.push({
    id: "member-db-test",
    userId: "dbtest01",
    passwordHash: "hash",
    authProvider: "password",
    name: "DB 테스트",
    phone: "010-1234-5678",
    email: "db@example.com",
    agencyId: "agency-gangnam",
    role: "agency_manager",
    points: 10000,
    status: "active",
    joinedAt: "2026-06-02",
    address: {
      postcode: "04524",
      address: "서울시 중구 세종대로 110",
      addressDetail: "테스트",
    },
    shippingAddresses: [
      {
        id: "addr-db-default",
        label: "회사",
        recipient: "DB 테스트",
        phone: "010-1234-5678",
        postcode: "04524",
        address: "서울시 중구 세종대로 110",
        addressDetail: "테스트",
        isDefault: true,
      },
      {
        id: "addr-db-home",
        label: "자택",
        recipient: "DB 테스트",
        phone: "010-0000-0000",
        postcode: "06236",
        address: "서울시 강남구 테헤란로 000",
        addressDetail: "101호",
        isDefault: false,
      },
    ],
    marketingOptIn: false,
    internalMemo: "관리 메모",
  });
  store.currentMemberId = "member-db-test";

  completeBypassPayment({
    store,
    payment: {
      memberId: "member-db-test",
      referralSourceType: "none",
      pointUsed: 6000,
      shippingSnapshot: {
        recipient: "DB 테스트",
        phone: "010-1234-5678",
        postcode: "04524",
        address: "서울시 중구 세종대로 110",
        addressDetail: "테스트 3층",
        paymentMethod: "신용카드",
      },
    },
    cart: [
      {
        id: "cos-sun",
        name: "Daily Tone Up Sunscreen",
        ko: "데일리 톤업 선스크린",
        sale: 25000,
        qty: 2,
        option: "50ml / SPF50+ PA++++",
      },
    ],
  });

  writeStore(database, store);
  const reloaded = readStore(database);
  const member = reloaded.members.find((item) => item.id === "member-db-test");
  const order = reloaded.orders.find((item) => item.memberId === member.id);

  assert.equal(member.name, "DB 테스트");
  assert.equal(member.role, "agency_manager");
  const reloadedGangnamAgency = reloaded.agencies.find(
    (agency) => agency.id === "agency-gangnam",
  );
  assert.equal(reloadedGangnamAgency.contractEnd, "2026-12-31");
  assert.equal(reloadedGangnamAgency.managerName, "DB 담당자");
  assert.equal(reloadedGangnamAgency.managerPhone, "010-2222-3333");
  assert.equal(reloadedGangnamAgency.settlementAccount, "DB은행 999-000");
  assert.equal(reloadedGangnamAgency.loginUserId, "dbagency01");
  assert.equal(reloadedGangnamAgency.loginPasswordHash, "hash-agency");
  assert.equal(
    reloaded.products.find((product) => product.id === "device-led").sale,
    74000,
    "product sale price should survive SQLite reload",
  );
  assert.equal(
    reloaded.products.find((product) => product.id === "device-led").variants[0]
      .stock,
    12,
    "product option stock should survive SQLite reload",
  );
  assert.deepEqual(
    reloaded.products.find((product) => product.id === "device-led")
      .detailImages,
    [
      "https://example.com/device-led-detail-1.jpg",
      "https://example.com/device-led-detail-2.jpg",
    ],
    "product detail images should survive SQLite reload",
  );
  assert.equal(
    reloaded.products.find((product) => product.id === "cos-sun").stock,
    71,
    "checkout should decrement managed product stock",
  );
  assert.equal(member.address.addressDetail, "테스트");
  assert.equal(member.shippingAddresses.length, 2);
  assert.equal(member.shippingAddresses[1].label, "자택");
  assert.equal(member.marketingOptIn, false);
  assert.equal(member.internalMemo, "관리 메모");
  assert.equal(order.paidProductAmount, 50000);
  assert.equal(order.pointUseLimit, 10000);
  assert.equal(order.pointUsed, 6000);
  assert.equal(order.paidAmount, 44000);
  assert.equal(order.pointEarned, 2500);
  assert.equal(order.confirmedAt, "");
  assert.equal(order.shippingStatus, "preparing");
  assert.equal(order.shippingAddress.addressDetail, "테스트 3층");
  assert.equal(order.paymentMethod, "신용카드");
  assert.equal(member.points, 4000);
  assert.equal(order.items[0].qty, 2);
  assert.equal(
    reloaded.pointLedger.some(
      (point) => point.memberId === member.id && point.amount === -6000,
    ),
    true,
    "used point ledger should survive SQLite reload",
  );
  assert.equal(
    reloaded.pointLedger.some(
      (point) => point.memberId === member.id && point.amount === 2500,
    ),
    true,
    "pending point ledger should survive SQLite reload",
  );
  assert.equal(
    reloaded.pointLedger.find(
      (point) => point.memberId === member.id && point.amount === 2500,
    ).type,
    "purchase_pending",
  );
  assert.equal(
    reloaded.agencySettlementLedger.some(
      (settlement) =>
        settlement.orderId === order.id && settlement.baseAmount === 50000,
    ),
    true,
    "agency settlement should survive SQLite reload",
  );
  const settlement = reloaded.agencySettlementLedger.find(
    (item) => item.orderId === order.id,
  );
  settlement.status = "confirmed";
  settlement.updatedAt = "2026-06-15";
  settlement.statusUpdatedBy = "admin";
  settlement.statusNote = "정산 확정";
  settlement.statusHistory = [
    {
      status: "confirmed",
      changedAt: "2026-06-15",
      changedBy: "admin",
      note: "정산 확정",
    },
  ];
  order.shippingStatus = "shipping";
  order.courier = "CJ대한통운";
  order.trackingNumber = "1234567890";
  order.shippedAt = "2026-06-16";
  order.shippingMemo = "문 앞 배송";
  assert.equal(confirmPurchase(reloaded, order.id, "member"), true);
  writeStore(database, reloaded);
  const reloadedAgain = readStore(database);
  const confirmedSettlement = reloadedAgain.agencySettlementLedger.find(
    (item) => item.orderId === order.id,
  );
  assert.equal(confirmedSettlement.status, "confirmed");
  assert.equal(confirmedSettlement.updatedAt, "2026-06-15");
  assert.equal(confirmedSettlement.statusHistory[0].note, "정산 확정");
  const shippedOrder = reloadedAgain.orders.find(
    (item) => item.id === order.id,
  );
  assert.equal(shippedOrder.shippingStatus, "shipping");
  assert.equal(shippedOrder.courier, "CJ대한통운");
  assert.equal(shippedOrder.trackingNumber, "1234567890");
  assert.equal(shippedOrder.shippingMemo, "문 앞 배송");
  assert.ok(shippedOrder.confirmedAt);
  assert.equal(
    reloadedAgain.members.find((item) => item.id === member.id).points,
    6500,
  );
  assert.equal(
    reloadedAgain.pointLedger.find(
      (point) => point.orderId === order.id && point.amount === 2500,
    ).type,
    "purchase_earn",
  );

  console.log("Server SQLite database test passed");
} finally {
  database?.close();
  rmSync(tempDir, { recursive: true, force: true });
}

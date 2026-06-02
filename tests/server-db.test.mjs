import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { cloneDefaultStore } from "../scripts/data/demo-store.js";
import { openShopDatabase, readStore, writeStore } from "../server/db.mjs";
import { completeBypassPayment } from "../scripts/domain/order-processing.js";

const tempDir = mkdtempSync(join(tmpdir(), "beauty-shop-db-"));

try {
  const databasePath = join(tempDir, "shop.sqlite");
  const database = openShopDatabase(databasePath);
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

  const store = cloneDefaultStore();
  store.members.push({
    id: "member-db-test",
    userId: "dbtest01",
    passwordHash: "hash",
    authProvider: "password",
    name: "DB 테스트",
    phone: "010-1234-5678",
    email: "db@example.com",
    agencyId: "agency-gangnam",
    points: 0,
    status: "active",
    joinedAt: "2026-06-02",
    address: {
      postcode: "04524",
      address: "서울시 중구 세종대로 110",
      addressDetail: "테스트",
    },
    marketingOptIn: false,
    internalMemo: "관리 메모",
  });
  store.currentMemberId = "member-db-test";

  completeBypassPayment({
    store,
    payment: { memberId: "member-db-test", referralSourceType: "none" },
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
  assert.equal(member.address.addressDetail, "테스트");
  assert.equal(member.marketingOptIn, false);
  assert.equal(member.internalMemo, "관리 메모");
  assert.equal(order.paidProductAmount, 50000);
  assert.equal(order.pointEarned, 2500);
  assert.equal(order.items[0].qty, 2);
  assert.equal(
    reloaded.pointLedger.some(
      (point) => point.memberId === member.id && point.amount === 2500,
    ),
    true,
    "point ledger should survive SQLite reload",
  );
  assert.equal(
    reloaded.agencySettlementLedger.some(
      (settlement) =>
        settlement.orderId === order.id && settlement.baseAmount === 50000,
    ),
    true,
    "agency settlement should survive SQLite reload",
  );

  database.close();
  console.log("Server SQLite database test passed");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

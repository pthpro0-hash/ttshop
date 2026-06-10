-- 앱 공통 상태: 현재 로그인 세션, 대리점 링크 유입값처럼 테이블 하나로 나누기 애매한 값을 저장한다.
CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

-- 운영 설정: 포인트 적립률, 포인트 사용 한도, 추천 보상률처럼 어드민에서 바꾸는 숫자 정책이다.
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value REAL NOT NULL
);

-- 대리점 계약/로그인 정보: 본사도 하나의 대리점으로 저장해 코드 없는 가입자를 본사 고객으로 묶는다.
CREATE TABLE IF NOT EXISTS agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  link_slug TEXT NOT NULL UNIQUE,
  commission_rate REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  is_headquarters INTEGER NOT NULL DEFAULT 0,
  contract_start TEXT,
  contract_end TEXT,
  manager_name TEXT,
  manager_phone TEXT,
  settlement_account TEXT,
  login_user_id TEXT,
  login_password_hash TEXT
);

-- 상품 기본 정보: 쇼핑몰 노출, 판매상태, 가격, 재고, 배송정책, 이미지/상세이미지를 관리한다.
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT,
  name TEXT NOT NULL,
  ko TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT,
  badge TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  sale INTEGER NOT NULL DEFAULT 0,
  supply_price INTEGER NOT NULL DEFAULT 0,
  cost INTEGER NOT NULL DEFAULT 0,
  tax_type TEXT NOT NULL DEFAULT 'taxable',
  status TEXT NOT NULL DEFAULT 'selling',
  display_status TEXT NOT NULL DEFAULT 'displayed',
  stock INTEGER NOT NULL DEFAULT 0,
  safety_stock INTEGER NOT NULL DEFAULT 0,
  shipping_type TEXT NOT NULL DEFAULT 'default',
  shipping_fee INTEGER NOT NULL DEFAULT 0,
  point_rate_override REAL,
  option_text TEXT,
  image TEXT,
  detail_images TEXT,
  short TEXT,
  desc TEXT,
  search_keywords TEXT,
  manufacturer TEXT,
  supplier TEXT,
  origin TEXT,
  brand TEXT,
  barcode TEXT
);

-- 상품 옵션 SKU: 색상/용량/밝기처럼 같은 상품 안에서 별도 재고와 판매상태가 필요한 하위 상품이다.
CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  option_name TEXT NOT NULL,
  sku TEXT,
  price_delta INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'selling',
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 회원 계정/배송지: 일반회원, 관리자, 대리점 권한을 role로 구분하고 배송지 목록은 JSON으로 저장한다.
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  password_hash TEXT,
  auth_provider TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  agency_id TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  points INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  joined_at TEXT,
  postcode TEXT,
  address TEXT,
  address_detail TEXT,
  shipping_addresses TEXT,
  payment_method TEXT,
  favorite_category TEXT,
  marketing_opt_in INTEGER,
  internal_memo TEXT,
  FOREIGN KEY (agency_id) REFERENCES agencies(id)
);

-- 주문 스냅샷: 결제 당시 대리점, 금액, 포인트, 배송/송장 정보를 보존한다.
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  agency_id_at_order TEXT,
  referral_source_type TEXT NOT NULL DEFAULT 'none',
  paid_product_amount INTEGER NOT NULL DEFAULT 0,
  shipping_amount INTEGER NOT NULL DEFAULT 0,
  paid_amount INTEGER NOT NULL DEFAULT 0,
  point_used INTEGER NOT NULL DEFAULT 0,
  point_use_limit INTEGER NOT NULL DEFAULT 0,
  point_earned INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'paid',
  confirmed_at TEXT,
  shipping_status TEXT NOT NULL DEFAULT 'preparing',
  courier TEXT,
  tracking_number TEXT,
  shipped_at TEXT,
  delivered_at TEXT,
  shipping_memo TEXT,
  shipping_address TEXT,
  payment_method TEXT,
  paid_at TEXT,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (agency_id_at_order) REFERENCES agencies(id)
);

-- 주문 상품 스냅샷: 상품명이 나중에 바뀌어도 주문 당시 상품명/옵션/수량을 유지한다.
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT,
  product_ko TEXT,
  sale INTEGER NOT NULL DEFAULT 0,
  qty INTEGER NOT NULL DEFAULT 1,
  option_text TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 포인트 장부: 적립 예정, 실제 적립, 사용 내역을 분리해 구매확정 전후 상태를 추적한다.
CREATE TABLE IF NOT EXISTS point_ledger (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  order_id TEXT,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  base_amount INTEGER NOT NULL DEFAULT 0,
  rate REAL NOT NULL DEFAULT 0,
  note TEXT,
  created_at TEXT,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 대리점 정산 장부: 개인 추천 링크 구매를 제외한 실결제 상품금액 기준 영업비를 기록한다.
CREATE TABLE IF NOT EXISTS agency_settlement_ledger (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL,
  order_id TEXT,
  base_amount INTEGER NOT NULL DEFAULT 0,
  commission_rate REAL NOT NULL DEFAULT 0,
  commission_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  updated_at TEXT,
  status_updated_by TEXT,
  status_note TEXT,
  status_history TEXT,
  note TEXT,
  created_at TEXT,
  FOREIGN KEY (agency_id) REFERENCES agencies(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 개인 상품 추천 링크: 구매확정과 별개로 구매 상품별 고유 추천 링크를 관리한다.
CREATE TABLE IF NOT EXISTS personal_referral_links (
  id TEXT PRIMARY KEY,
  owner_member_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  order_id TEXT,
  unit_index INTEGER NOT NULL DEFAULT 1,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  FOREIGN KEY (owner_member_id) REFERENCES members(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 상품 리뷰: 구매확정 후 회원이 작성한 평점, 본문, 사진 데이터를 상품 상세에 노출한다.
CREATE TABLE IF NOT EXISTS product_reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  member_name TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  title TEXT,
  content TEXT,
  image TEXT,
  created_at TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);

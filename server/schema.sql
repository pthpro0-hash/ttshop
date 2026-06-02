CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  link_slug TEXT NOT NULL UNIQUE,
  commission_rate REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  is_headquarters INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  password_hash TEXT,
  auth_provider TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  agency_id TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  joined_at TEXT,
  postcode TEXT,
  address TEXT,
  address_detail TEXT,
  payment_method TEXT,
  favorite_category TEXT,
  marketing_opt_in INTEGER,
  internal_memo TEXT,
  FOREIGN KEY (agency_id) REFERENCES agencies(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  agency_id_at_order TEXT,
  referral_source_type TEXT NOT NULL DEFAULT 'none',
  paid_product_amount INTEGER NOT NULL DEFAULT 0,
  shipping_amount INTEGER NOT NULL DEFAULT 0,
  paid_amount INTEGER NOT NULL DEFAULT 0,
  point_earned INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'paid',
  paid_at TEXT,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (agency_id_at_order) REFERENCES agencies(id)
);

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

CREATE TABLE IF NOT EXISTS agency_settlement_ledger (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL,
  order_id TEXT,
  base_amount INTEGER NOT NULL DEFAULT 0,
  commission_rate REAL NOT NULL DEFAULT 0,
  commission_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  note TEXT,
  created_at TEXT,
  FOREIGN KEY (agency_id) REFERENCES agencies(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

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

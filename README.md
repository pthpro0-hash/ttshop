# BEAUTY REF. Shop Demo

미용 관련 제품 10개를 판매하는 순수 HTML/CSS/JavaScript 쇼핑몰 데모입니다. 회원, 주문, 포인트, 대리점, 상품관리, 배송/송장 데이터를 로컬 SQLite DB에 저장하도록 구성했습니다.

## 빠른 실행

```bash
npm install
npm start
```

브라우저에서 `http://localhost:8000/`을 엽니다.

로컬 서버로 접속하면 `data/beauty-shop.sqlite`가 원본 데이터 저장소입니다. 탐색기에서 `index.html`을 직접 열면 서버 API가 없으므로 IndexedDB/localStorage fallback으로 동작합니다.

## 다른 PC에서 이어서 작업

```bash
git clone https://github.com/pthpro0-hash/ttshop.git
cd ttshop
npm install
npm start
```

현재 PC의 실제 회원/주문 데이터까지 옮기려면 `data/beauty-shop.sqlite` 파일을 다른 PC의 `ttshop/data/` 폴더에 복사합니다. 이 파일이 없으면 기본 샘플 데이터로 시작합니다.

## 개발 명령

```bash
npm run build
npm test
```

- `npm run build`: `scripts/app.js`를 `scripts/app.bundle.js`로 번들링합니다.
- `npm test`: SQLite 저장/복원 테스트를 실행합니다.
- 주요 통합 UI 테스트: `node tests/stage1-management.test.cjs`
- 서버 DB 테스트: `node tests/server-db.test.mjs`

## 전체 구조

```text
index.html                  화면 뼈대와 주요 DOM 컨테이너
style.css                   쇼핑몰, 회원, 관리자, 상품관리, 배송관리 UI 스타일
scripts/app.js              앱 진입점, 공통 store 로드, 컨트롤러 연결, 세션 UI 처리
scripts/app.bundle.js       file:// 실행도 가능하게 만든 브라우저용 번들
scripts/data/catalog.js     기본 상품 10개와 카테고리
scripts/data/demo-store.js  전체 store 기본값, 서버/IndexedDB/localStorage 저장소 선택
scripts/domain/order-processing.js
                            결제 우회 후 주문/포인트/재고/추천/정산 생성 로직
scripts/ui/shop.js          상품 목록, 상세, 장바구니, 결제, 배송지 선택
scripts/ui/auth.js          로그인, 회원가입, 내정보, 배송지 관리
scripts/ui/management.js    Admin/Agency 대시보드, 상품/회원/대리점/배송/정산 관리
server/server.mjs           정적 파일 제공, /api/store API
server/db.mjs               store와 SQLite 테이블 간 매핑, 마이그레이션
server/schema.sql           SQLite 기본 스키마
tests/                      DB와 주요 UI 흐름 검증
```

## 데이터 흐름

앱은 하나의 store 객체를 모든 UI 모듈에 공유합니다.

1. `scripts/app.js`가 `loadStore()`를 호출합니다.
2. `scripts/data/demo-store.js`가 저장소를 선택합니다.
   - 서버 API 가능: SQLite DB 사용
   - 서버 API 없음: IndexedDB 사용
   - 이전 백업만 있음: localStorage 사용
3. UI 모듈이 store를 직접 갱신합니다.
4. 변경 후 `saveStore(store)`를 호출해 SQLite 또는 fallback 저장소에 반영합니다.

이 구조 때문에 UI 파일은 SQL을 직접 다루지 않습니다. DB 필드를 바꿀 때는 `server/schema.sql`, `server/db.mjs`, `scripts/data/demo-store.js`, 관련 테스트를 함께 확인해야 합니다.

## 주요 데이터 모델

- `settings`: 포인트율, 포인트 사용 한도, 추천 보상률
- `agencies`: 본사/대리점 계약 정보, 전용 코드/링크, 대리점 로그인 계정
- `products`: 상품 기본정보, 가격, 재고, 배송정책, 이미지, 표시/판매상태
- `product_variants`: 옵션 SKU, 옵션별 재고, 옵션 상태
- `members`: 회원 계정, 권한, 포인트, 주소, 배송지 목록, 내부 메모
- `orders`: 주문, 실결제 상품금액, 배송비, 사용/적립 포인트, 배송/송장 정보
- `order_items`: 주문 상품 스냅샷
- `point_ledger`: 포인트 적립/사용 장부
- `agency_settlement_ledger`: 대리점 영업비 정산 장부
- `personal_referral_links`: 개인 상품 추천 링크
- `product_reviews`: 구매확정 후 작성된 상품 리뷰와 사진 데이터
- `app_meta`: 현재 로그인 회원, 대리점 링크 가입 대기값

## 핵심 정책

- 상품 카테고리 3개 유지: `미용기구`, `미용재료`, `화장품`
- 상품 수 10개 유지
- 미로그인 회원은 장바구니/구매/결제 불가
- 회원 아이디: 영문/숫자 6자 이상
- 비밀번호: 영문과 숫자 포함 8자 이상, 특수문자 허용
- 포인트 적립: 배송비 제외 실결제 상품금액 기준
- 포인트 적립 시점: 결제 직후에는 적립 예정, 구매확정 후 실제 보유 포인트 반영
- 포인트 사용: 배송비 제외 실결제 상품금액 기준 최대 50%
- 개인 추천 링크: 같은 상품 여러 개 구매 시 링크 1개, 서로 다른 상품은 각각 1개
- 개인 추천 링크 구매는 대리점 영업비보다 우선
- 대리점 코드 없이 가입하면 본사 대리점 고객
- 대리점 고객 소속은 내부 관리용이며 개인회원 화면에는 노출하지 않음

## 회원 기능

- 일반 로그인/회원가입
- 간편 로그인/간편 가입 UI 데모
- 회원가입 시 대리점 코드 입력
- 배송지 조회 샘플 UI: 주소 선택 시 우편번호/주소 자동 입력
- 로그인 후 헤더에 회원명 표시
- 회원명 클릭 시 내정보 팝업
- 내정보 상단 탭:
  - 계정/배송지
  - 구매 내역
  - 포인트 관리
  - 추천 링크
  - 보안
- 기존 비밀번호 검증 후 비밀번호 변경
- 보유 포인트, 구매이력, 포인트 이력, 추천 링크 확인
- 주문 상세에서 배송상태, 택배사, 송장번호, 배송지 확인
- 주문 상세에서 구매확정 처리
- 구매확정 후 주문 상품별 리뷰 작성
- 리뷰 평점은 5점 만점, 사진 첨부 가능
- 구매확정 전 보유 포인트 옆에 적립 예정 포인트 표시

## 쇼핑/결제 기능

- 상품 목록과 카테고리 필터
- 상품 상세 페이지
- 상품 상세 리뷰 요약과 전체 리뷰 보기
- 상품 옵션 SKU 선택
- Add to cart, Buy now
- 장바구니 드로어, 수량 조절
- Checkout 화면
- 저장 배송지 선택 또는 배송지 조회 선택
- 포인트 사용 입력
- `Pay now` 클릭 시 PG 결제는 bypass하고 주문 성공 처리
- 구매확정 전까지 적립 포인트는 `purchase_pending` 장부로 보관
- 회원 구매확정 또는 구매일 14일 경과 자동확정 후 `purchase_earn`으로 전환
- 주문 성공 시 처리:
  - 주문 생성
  - 상품/옵션 재고 차감
  - 포인트 사용 장부 생성
  - 포인트 적립 예정 장부 생성
  - 개인 추천 링크 생성
  - 대리점 정산 대기 장부 생성
  - 배송지/결제수단 스냅샷 저장

## Admin 기능

Admin 로그인:

```text
ID: adminChang
PW: Chang$0909
```

주요 기능:

- Admin settings 수정
- 대리점 리스트/상세
- 대리점 등록/수정/삭제
- 대리점별 로그인 계정 발급
- 회원 리스트와 회원 상세
- 관리자/대리점 내부 메모
- 상품관리
- 상품 이미지/상세 이미지 최대 5개
- 상품 표시/숨김, 판매상태, 가격, 재고, 배송정책, 공급사, 옵션 SKU 관리
- 이달의 주문/포인트/정산 상세
- 주문별 배송상태, 택배사, 송장번호, 출고일, 배송완료일, 배송 메모 관리
- 회원 상세 구매이력에서 배송상태/택배사 선택과 송장번호 등록
- 배송중/배송완료 저장 시 택배사와 송장번호 필수 검증

## Agency 기능

기본 대리점 로그인:

```text
ID: gangnam01
PW: agency123
```

주요 기능:

- 대리점 전용 코드/링크 확인
- 전용 링크 복사
- 소속 고객 리스트
- 고객 상세와 내부 메모
- 최근 6개월 정산매출/영업비 확인
- 월 클릭 시 세부 주문과 정산 장부 확인
- Agency 화면에서는 Admin 전용 정산 상태 변경 버튼을 노출하지 않음

## 배송/송장 처리

배송 데이터는 주문에 스냅샷으로 저장됩니다. 회원이 내정보에서 주소를 바꿔도 기존 주문의 배송지는 바뀌지 않습니다.

주문 배송 필드:

- `confirmed_at`
- `shipping_status`
- `courier`
- `tracking_number`
- `shipped_at`
- `delivered_at`
- `shipping_memo`
- `shipping_address`
- `payment_method`

Admin의 `이달의 주문` 상세에서 송장 정보를 저장하면 개인회원의 주문 상세에도 바로 반영됩니다. Admin 회원 상세의 구매이력에서도 같은 배송 업데이트 폼을 사용할 수 있습니다. Agency는 고객 배송 정보를 확인할 수 있지만 송장 수정 권한은 Admin에 한정합니다.

## DB 작업 시 주의

- 기존 로컬 데이터가 있으므로 마이그레이션은 additive 방식으로 유지합니다.
- `server/db.mjs`의 `migrateDatabase()`는 새 컬럼만 추가합니다.
- 테이블 삭제, 전체 DB 초기화, 강제 reset은 사용자 데이터 유실 위험이 있습니다.
- DB 구조를 바꾸면 아래 파일을 함께 점검합니다.
  - `server/schema.sql`
  - `server/db.mjs`
  - `scripts/data/demo-store.js`
  - `tests/server-db.test.mjs`
  - `tests/stage1-management.test.cjs`

## 개발자가 먼저 볼 코드

1. `scripts/app.js`
   - 앱 시작, store 공유, 컨트롤러 연결
2. `scripts/data/demo-store.js`
   - 전체 데이터 shape와 저장소 fallback
3. `scripts/domain/order-processing.js`
   - 주문 생성과 포인트/정산/추천 링크 핵심 로직
4. `scripts/ui/shop.js`
   - 쇼핑과 결제 화면
5. `scripts/ui/auth.js`
   - 회원가입, 로그인, 내정보
6. `scripts/ui/management.js`
   - Admin/Agency 관리 화면
7. `server/db.mjs`
   - SQLite 저장/조회/마이그레이션

## 검증 기준

작업 후 아래 순서로 확인합니다.

```bash
npm run build
node tests/server-db.test.mjs
node tests/stage1-management.test.cjs
```

필요하면 추가로 주요 파일 문법 검사를 실행합니다.

```bash
node --check scripts/app.js
node --check scripts/ui/auth.js
node --check scripts/ui/shop.js
node --check scripts/ui/management.js
node --check scripts/domain/order-processing.js
node --check server/db.mjs
```

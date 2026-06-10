// 금액 표시는 전 화면에서 한국 쇼핑몰 표기(1,000원)로 통일한다.
export const formatMoney = (value) =>
  `${Number(value).toLocaleString("ko-KR")}원`;

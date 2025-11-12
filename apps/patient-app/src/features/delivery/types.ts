/**
 * 배송지 엔티티 타입
 * 
 * - 배송지 고유 ID
 * - 기본 배송지 여부
 * - 배송지 이름
 * - 받는 사람
 * - 주소
 * - 휴대폰 번호
 */
export interface DeliveryAddress {
  id: string;
  isDefault: boolean;
  title: string;
  recipientName: string;
  address: string;
  phoneNumber: string;
}

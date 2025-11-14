/**
 * Medication 관련 상수/타입 정의
 * - 타입: 허용되는 조제 상태/수령 방법의 리터럴 유니온
 * - 라벨 키 매핑: i18n 키(`medication.*`)로의 매핑을 일원화하여 화면 전반에서 일관성 보장
 * 사용 예)
 *  - 상태 라벨: t(MEDICATION_STATUS_LABEL_KEY_MAP[status])
 *  - 수령방법 라벨: t(DELIVERY_METHOD_LABEL_KEY_MAP[method])
 *  - 정렬 라벨: t(MEDICATION_SORT_LABEL_KEY_MAP[order])
 */
export type MedicationStatusConst = 'preparing' | 'prepared' | 'shipping' | 'received';
export type DeliveryMethodConst = 'direct' | 'standard' | 'express' | 'international';

/**
 * 조제 상태 → i18n 라벨 키 매핑
 * 화면 표시에 필요한 텍스트는 반드시 이 매핑을 통해 가져오도록 합니다.
 */
export const MEDICATION_STATUS_LABEL_KEY_MAP: Record<MedicationStatusConst, string> = {
  preparing: 'medication.statusPreparing',
  prepared: 'medication.statusPrepared',
  shipping: 'medication.statusShipping',
  received: 'medication.statusReceived'
};

/**
 * 수령 방법 → i18n 라벨 키 매핑
 */
export const DELIVERY_METHOD_LABEL_KEY_MAP: Record<DeliveryMethodConst, string> = {
  direct: 'medication.methodDirect',
  standard: 'medication.methodStandard',
  express: 'medication.methodExpress',
  international: 'medication.methodInternational'
};

/**
 * 정렬 기준 → i18n 라벨 키 매핑
 */
export const MEDICATION_SORT_LABEL_KEY_MAP: Record<'newest' | 'oldest', string> = {
  newest: 'medication.sortNewest',
  oldest: 'medication.sortOldest'
};

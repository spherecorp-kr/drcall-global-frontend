/**
 * Appointment Constants & Enums
 * Matches backend enums and provides i18n keys
 */

/**
 * Appointment Type Enum
 * Matches: global.drcall.appointment.domain.appointment.entity.Appointment.AppointmentType
 */
export const AppointmentType = {
  STANDARD: 'STANDARD',
  QUICK: 'QUICK',
} as const;

export type AppointmentTypeValue = typeof AppointmentType[keyof typeof AppointmentType];

export const AppointmentTypeI18nKey: Record<AppointmentTypeValue, string> = {
  [AppointmentType.STANDARD]: 'appointment.type.standard',
  [AppointmentType.QUICK]: 'appointment.type.quick',
};

/**
 * Appointment Status Enum
 * Matches: global.drcall.appointment.domain.appointment.entity.Appointment.AppointmentStatus
 */
export const AppointmentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export type AppointmentStatusValue = typeof AppointmentStatus[keyof typeof AppointmentStatus];

export const AppointmentStatusI18nKey: Record<AppointmentStatusValue, string> = {
  [AppointmentStatus.PENDING]: 'appointment.status.pending',
  [AppointmentStatus.CONFIRMED]: 'appointment.status.confirmed',
  [AppointmentStatus.IN_PROGRESS]: 'appointment.status.inProgress',
  [AppointmentStatus.COMPLETED]: 'appointment.status.completed',
  [AppointmentStatus.CANCELLED]: 'appointment.status.cancelled',
  [AppointmentStatus.NO_SHOW]: 'appointment.status.noShow',
};

/**
 * Consultation Type Enum
 * Matches: global.drcall.appointment.domain.appointment.entity.Appointment.ConsultationType
 */
export const ConsultationType = {
  VIDEO_CALL: 'VIDEO_CALL',
  CHAT: 'CHAT',
  PHONE: 'PHONE',
} as const;

export type ConsultationTypeValue = typeof ConsultationType[keyof typeof ConsultationType];

export const ConsultationTypeI18nKey: Record<ConsultationTypeValue, string> = {
  [ConsultationType.VIDEO_CALL]: 'appointment.consultationType.videoCall',
  [ConsultationType.CHAT]: 'appointment.consultationType.chat',
  [ConsultationType.PHONE]: 'appointment.consultationType.phone',
};

/**
 * Payment Status Enum
 * Matches: global.drcall.appointment.domain.appointment.entity.Appointment.PaymentStatus
 */
export const PaymentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatusValue = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentStatusI18nKey: Record<PaymentStatusValue, string> = {
  [PaymentStatus.PENDING]: 'appointment.paymentStatus.pending',
  [PaymentStatus.PROCESSING]: 'appointment.paymentStatus.processing',
  [PaymentStatus.COMPLETED]: 'appointment.paymentStatus.completed',
  [PaymentStatus.FAILED]: 'appointment.paymentStatus.failed',
  [PaymentStatus.REFUNDED]: 'appointment.paymentStatus.refunded',
};

/**
 * Helper function to get i18n key for appointment type
 */
export const getAppointmentTypeI18nKey = (type: AppointmentTypeValue): string => {
  return AppointmentTypeI18nKey[type];
};

/**
 * Helper function to get i18n key for appointment status
 */
export const getAppointmentStatusI18nKey = (status: AppointmentStatusValue): string => {
  return AppointmentStatusI18nKey[status];
};

/**
 * Helper function to get i18n key for consultation type
 */
export const getConsultationTypeI18nKey = (type: ConsultationTypeValue): string => {
  return ConsultationTypeI18nKey[type];
};

/**
 * Helper function to get i18n key for payment status
 */
export const getPaymentStatusI18nKey = (status: PaymentStatusValue): string => {
  return PaymentStatusI18nKey[status];
};

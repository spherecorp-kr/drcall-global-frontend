// 진료완료 관련 타입 정의

// 결제 상태
export type PaymentStatus = 'pending_billing' | 'pending_payment' | 'payment_complete';

// 처방전 상태
export type PrescriptionStatus = 'not_issued' | 'waiting_upload' | 'uploaded' | 'viewable';

// 약 수령 방법
export type MedicinePickupMethod = 'none' | 'direct' | 'delivery_standard' | 'delivery_quick' | 'delivery_international';

// 결제 방법
export type PaymentMethod = 'account_transfer' | 'credit_card';

// 결제 정보
export interface PaymentInfo {
  status: PaymentStatus;
  method?: PaymentMethod;
  totalAmount?: number;
  consultationFee?: number;
  prescriptionFee?: number;
  serviceFee?: number;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  paymentConfirmedDate?: string;
}

// 처방전 정보
export interface PrescriptionInfo {
  status: PrescriptionStatus;
  uploadDate?: string;
  viewable?: boolean;
}

// 약 수령 정보
export interface MedicinePickupInfo {
  method: MedicinePickupMethod;
  pickupNumber?: string;
  location?: string;
  locationDetail?: string;
  phoneNumber?: string;
  availableFrom?: string;
  availableTo?: string;
  availableTime?: string;
  trackingNumber?: string;
  deliveryAddress?: string;
}

// 진료 정보
export interface TreatmentInfo {
  symptoms: string;
  symptomImages?: string[];
  aiSummary?: string;
  doctorAdvice?: string;
}

// 진료완료 상세 정보
export interface CompletedConsultationDetail {
  id: string;
  appointmentNumber: string;
  hospital: {
    name: string;
    nameEn: string;
    phone: string;
  };
  doctor: {
    name: string;
    nameEn: string;
  };
  completedAt: string;
  treatment: TreatmentInfo;
  prescription: PrescriptionInfo;
  payment: PaymentInfo;
  medicinePickup: MedicinePickupInfo;
  patientInfo: {
    name: string;
    birthDate: string;
    thaiIdNumber: string;
    gender: string;
    phoneNumber: string;
    height?: string;
    weight?: string;
    bloodType?: string;
    medications?: string;
    personalHistory?: string;
    allergies?: string;
  };
}

// 진료완료 카드 데이터 (리스트용)
export interface CompletedConsultationCardData {
  id: string;
  paymentStatus: PaymentStatus;
  hospitalName: string;
  hospitalNameEn: string;
  doctorName: string;
  doctorNameEn: string;
  completedAt: string;
}

// UI 퍼블리싱 단계에서 사용하는 목데이터
// 실제 연동 시 서버 DTO에 맞춰 교체 예정

export type ReceiptMethod = 'delivery' | 'quick' | 'international' | 'pickup';

export type MedicationDetailMock = {
  id: string;
  receipt: {
    method: ReceiptMethod;
    statusStep: number; // 1~4
    labels: string[]; // ['조제 중', '조제 완료', '배송 중', '수령 완료'] 등
    estimatedDate?: string; // 배송형: 예상 도착일
    deadlineDate?: string; // 직접 수령: 수령 기한
  };
  deliveryInfo?: {
    receiverName: string;
    phone: string;
    address: string;
    requestNote?: string;
  };
  pickupInfo?: {
    hospitalName: string;
    hospitalAddress: string;
    pickupLocation: string;
    businessHours: string[];
    contact: string;
  };
  orderInfo: {
    orderNumber: string;
    hospitalName: string;
    appliedAt: string;
  };
};

export const MOCKS: Record<string, MedicationDetailMock> = {
  // 배송 - 일반
  'delivery-1': {
    id: 'delivery-1',
    receipt: {
      method: 'delivery',
      statusStep: 3,
      labels: ['조제 중', '조제 완료', '배송 중', '수령 완료'],
      estimatedDate: '14/09/2025',
    },
    deliveryInfo: {
      receiverName: 'Vin Disel',
      phone: '062-1234-1234',
      address: 'Seocho-gu, Seoul, Republic of Korea 162, Baumoe',
      requestNote: '문 앞에 놔두시고 배송 완료 후에 전화 한번 주시면 감사하겠습니다.',
    },
    orderInfo: {
      orderNumber: '20251111-111',
      hospitalName: 'พระราม9 (Praram9 Hospital)',
      appliedAt: '11/05/2023 16:42',
    },
  },
  // 배송 - 퀵
  'quick-1': {
    id: 'quick-1',
    receipt: {
      method: 'quick',
      statusStep: 2,
      labels: ['조제 중', '조제 완료', '배송 중', '수령 완료'],
      estimatedDate: '14/09/2025',
    },
    deliveryInfo: {
      receiverName: '홍길동',
      phone: '010-1234-5678',
      address: '서울특별시 강남구 테헤란로 123, 10층',
    },
    orderInfo: {
      orderNumber: '20251111-222',
      hospitalName: 'Praram9 Hospital',
      appliedAt: '11/05/2023 16:42',
    },
  },
  // 배송 - 해외
  'intl-1': {
    id: 'intl-1',
    receipt: {
      method: 'international',
      statusStep: 2,
      labels: ['조제 중', '조제 완료', '배송 중', '수령 완료'],
      estimatedDate: '14/09/2025',
    },
    deliveryInfo: {
      receiverName: 'John Smith',
      phone: '+1-555-1234',
      address: '123 Market St, San Francisco, CA, USA',
    },
    orderInfo: {
      orderNumber: '20251111-333',
      hospitalName: 'Praram9 Hospital',
      appliedAt: '11/05/2023 16:42',
    },
  },
  // 직접 수령
  'pickup-1': {
    id: 'pickup-1',
    receipt: {
      method: 'pickup',
      statusStep: 2,
      labels: ['조제 중', '조제 완료', '수령 완료'],
      deadlineDate: '14/09/2025 까지',
    },
    pickupInfo: {
      hospitalName: 'พระราม9 (Praram9 Hospital)',
      hospitalAddress:
        '99 Rama IX Rd, Bang Kapi, Huai Khwang, Bangkok, Bangkok 10310',
      pickupLocation: 'Praram9 3F 약제실',
      businessHours: [
        '월~금: 08:30 ~ 17:00',
        '토요일: 09:00 ~ 12:00',
        '일요일/공휴일: 휴무',
      ],
      contact: '+66-2-123-4567',
    },
    orderInfo: {
      orderNumber: '20251111-111',
      hospitalName: 'พระราม9 (Praram9 Hospital)',
      appliedAt: '11/05/2023 16:42',
    },
  },
};



// UI 퍼블리싱 단계에서 사용하는 목데이터
// - 목적: Figma 스펙(배송/직접 수령)에 맞춘 화면 퍼블리싱 및 상태 분기 검증
// - 주의:
//   1) 실제 연동 시 서버 DTO와 i18n 키에 맞춰 필드명/라벨을 교체하세요.
//   2) ProgressSteps는 `statusStep`(1-base)와 `labels`를 동기화하여 표시합니다.
//      예) labels가 4개면 totalSteps=4, statusStep은 1~4 범위여야 합니다.
//   3) 날짜 포맷: appliedAt은 현재 퍼블리싱 편의상 표시용 문자열입니다.
//      실제 API 연동 시 원천 데이터는 "YYYY-MM-DDTHH:mm:ss" 형태(예: "2024-11-06T17:34:22")를 권장합니다.
//   4) 상세 시나리오 키는 `MedicationDetail.tsx`의 resolveScenarioKey에서
//      리스트 아이템 id와 매핑됩니다. (delivery-1 / quick-1 / intl-1 / pickup-1)

export type ReceiptMethod = 'delivery' | 'quick' | 'international' | 'pickup';

export type MedicationDetailMock = {
  id: string;
  receipt: {
    method: ReceiptMethod;
    statusStep: number; // 현재 단계 (1-base). labels의 인덱스+1과 동일한 범위여야 함
    labels: string[]; // 단계 라벨. 배송형은 보통 4단계, 직접 수령은 3단계
    estimatedDate?: string; // 배송형: 예상 도착일(상단 보조 정보)
    deadlineDate?: string; // 직접 수령: 수령 기한(상단 보조 정보)
  };
  deliveryInfo?: {
    imgSrc?: string;
    receiverName: string;
    phone: string;
    address: string;
    requestNote?: string;
  };
  pickupInfo?: {
    hospitalName: string;
    hospitalAddress: string;
    pickupLocation: string;
    businessHours: string[]; // 줄 단위 출력
    contact: string;
  };
  orderInfo: {
    orderNumber: string;
    hospitalName: string;
    appliedAt: string; // 표시용 문자열. 실제 연동 시 ISO8601 권장
  };
};

export const MOCKS: Record<string, MedicationDetailMock> = {
  // 배송 - 일반: 단계 3(배송 중) 예시
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
  // 배송 - 퀵: 단계 2(조제 완료) 예시
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
  // 배송 - 해외: 단계 2(조제 완료) 예시
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
  // 직접 수령: 단계 2(조제 완료) 예시. labels는 3단계(조제 중/조제 완료/수령 완료)
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



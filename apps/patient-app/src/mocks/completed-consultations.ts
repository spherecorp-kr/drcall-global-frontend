import type {
  CompletedConsultationCardData,
  CompletedConsultationDetail
} from '@/types/completed';

// 진료완료 리스트 목 데이터
export const mockCompletedConsultations: CompletedConsultationCardData[] = [
  {
    id: '7',
    paymentStatus: 'payment_complete',
    hospitalName: 'พระราม9',
    hospitalNameEn: 'Praram9 Hospital',
    doctorName: 'ดร.วิทยาวันเพ็ญ',
    doctorNameEn: 'Dr.Wittaya Wanpen',
    completedAt: '28/09/2023 11:00'
  },
  {
    id: '8',
    paymentStatus: 'pending_payment',
    hospitalName: 'บำรุงราษฎร์',
    hospitalNameEn: 'Bumrungrad Hospital',
    doctorName: 'ดร.สมชาย',
    doctorNameEn: 'Dr.Somchai',
    completedAt: '25/09/2023 15:30'
  },
  {
    id: '14',
    paymentStatus: 'pending_billing',
    hospitalName: 'สมิติเวช',
    hospitalNameEn: 'Samitivej Hospital',
    doctorName: 'ดร.นิภา',
    doctorNameEn: 'Dr.Nipha',
    completedAt: '20/09/2023 09:00'
  },
  {
    id: '15',
    paymentStatus: 'payment_complete',
    hospitalName: 'ศิริราช',
    hospitalNameEn: 'Siriraj Hospital',
    doctorName: 'ดร.อนุชา',
    doctorNameEn: 'Dr.Anucha',
    completedAt: '15/09/2023 14:20'
  }
];

// 진료완료 상세 목 데이터
export const mockCompletedConsultationDetails: Record<
  string,
  CompletedConsultationDetail
> = {
  '7': {
    id: '7',
    appointmentNumber: '7777777777',
    hospital: {
      name: 'พระราม9',
      nameEn: 'Praram9 Hospital',
      phone: '02-765-1234'
    },
    doctor: {
      name: 'ดร.วิทยาวันเพ็ญ',
      nameEn: 'Dr.Wittaya Wanpen'
    },
    completedAt: '28/09/2023 11:00',
    treatment: {
      symptoms:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      symptomImages: [
        '/assets/images/symptom1.jpg',
        '/assets/images/symptom2.jpg',
        '/assets/images/symptom3.jpg'
      ],
      aiSummary:
        'AI가 분석한 진료 요약 내용입니다. 환자의 증상을 종합적으로 분석한 결과입니다.',
      doctorAdvice:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    prescription: {
      status: 'viewable',
      uploadDate: '23/06/2023',
      viewable: true
    },
    payment: {
      status: 'payment_complete',
      method: 'account_transfer',
      totalAmount: 450,
      consultationFee: 300,
      prescriptionFee: 50,
      serviceFee: 50,
      bankName: 'Kasikorn Bank',
      accountNumber: '7132079794',
      accountHolder: 'Praram9 Bank Account',
      paymentConfirmedDate: '10/05/2023'
    },
    medicinePickup: {
      method: 'direct',
      pickupNumber: '0922-45',
      location: 'WS병원 9 3F 약제실',
      locationDetail: 'Praram9 3F 약제실',
      phoneNumber: '01-123-456',
      availableFrom: '01/09/2025',
      availableTo: '10/09/2025',
      availableTime: '09:00 ~ 19:00'
    },
    patientInfo: {
      name: '홍길동',
      birthDate: '14/04/1988',
      thaiIdNumber: '0-0000-00000-00-0',
      gender: 'appointment.genderMale',
      phoneNumber: '062-1234-1234',
      height: '176 cm',
      weight: '65 kg',
      bloodType: 'B',
      medications: '200mL 1 week, 1~2',
      personalHistory: '없음, 1 day, 1~5',
      allergies: '3개월 전부터 알 수 약을 복용 중입니다.'
    }
  },
  '8': {
    id: '8',
    appointmentNumber: '8888888888',
    hospital: {
      name: 'บำรุงราษฎร์',
      nameEn: 'Bumrungrad Hospital',
      phone: '02-066-8888'
    },
    doctor: {
      name: 'ดร.สมชาย',
      nameEn: 'Dr.Somchai'
    },
    completedAt: '25/09/2023 15:30',
    treatment: {
      symptoms:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      symptomImages: [
        '/assets/images/symptom1.jpg',
        '/assets/images/symptom2.jpg'
      ],
      aiSummary:
        'AI가 분석한 진료 요약 내용입니다. 환자의 증상을 종합적으로 분석한 결과입니다.',
      doctorAdvice:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    prescription: {
      status: 'uploaded',
      uploadDate: '10/06/2023',
      viewable: false
    },
    payment: {
      status: 'pending_payment',
      totalAmount: 400,
      consultationFee: 300,
      prescriptionFee: 50,
      serviceFee: 50
    },
    medicinePickup: {
      method: 'none'
    },
    patientInfo: {
      name: '홍길동',
      birthDate: '14/04/1988',
      thaiIdNumber: '0-0000-00000-00-0',
      gender: 'appointment.genderMale',
      phoneNumber: '062-1234-1234',
      height: '176 cm',
      weight: '65 kg',
      bloodType: 'B',
      medications: '200mL 1 week, 1~2',
      personalHistory: '없음, 1 day, 1~5',
      allergies: '3개월 전부터 알 수 약을 복용 중입니다.'
    }
  },
  '14': {
    id: '14',
    appointmentNumber: '1111111115',
    hospital: {
      name: 'สมิติเวช',
      nameEn: 'Samitivej Hospital',
      phone: '02-022-2222'
    },
    doctor: {
      name: 'ดร.นิภา',
      nameEn: 'Dr.Nipha'
    },
    completedAt: '20/09/2023 09:00',
    treatment: {
      symptoms:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      symptomImages: [],
      aiSummary:
        'AI가 분석한 진료 요약 내용입니다. 환자의 증상을 종합적으로 분석한 결과입니다.',
      doctorAdvice:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    prescription: {
      status: 'not_issued'
    },
    payment: {
      status: 'pending_billing'
    },
    medicinePickup: {
      method: 'none'
    },
    patientInfo: {
      name: '홍길동',
      birthDate: '14/04/1988',
      thaiIdNumber: '0-0000-00000-00-0',
      gender: 'appointment.genderMale',
      phoneNumber: '062-1234-1234',
      height: '176 cm',
      weight: '65 kg',
      bloodType: 'B',
      medications: '200mL 1 week, 1~2',
      personalHistory: '없음, 1 day, 1~5',
      allergies: '3개월 전부터 알 수 약을 복용 중입니다.'
    }
  },
  '15': {
    id: '15',
    appointmentNumber: '1111111116',
    hospital: {
      name: 'ศิริราช',
      nameEn: 'Siriraj Hospital',
      phone: '02-419-7000'
    },
    doctor: {
      name: 'ดร.อนุชา',
      nameEn: 'Dr.Anucha'
    },
    completedAt: '15/09/2023 14:20',
    treatment: {
      symptoms:
        '눈 염증 증상이 있었습니다. 충혈과 통증이 동반되었습니다.',
      symptomImages: [
        '/assets/images/symptom1.jpg'
      ],
      aiSummary:
        'AI가 분석한 진료 요약 내용입니다. 안과 관련 염증 치료가 필요한 상태입니다.',
      doctorAdvice:
        '처방된 안약을 매일 3회 점안하시고, 손으로 눈을 만지지 마세요. 1주일 후 재진이 필요합니다.'
    },
    prescription: {
      status: 'viewable',
      uploadDate: '15/09/2023',
      viewable: true
    },
    payment: {
      status: 'payment_complete',
      method: 'credit_card',
      totalAmount: 350,
      consultationFee: 250,
      prescriptionFee: 50,
      serviceFee: 50,
      paymentConfirmedDate: '15/09/2023'
    },
    medicinePickup: {
      method: 'direct',
      pickupNumber: '0915-12',
      location: 'ศิริราช 2F 약제실',
      locationDetail: 'Siriraj 2F 약제실',
      phoneNumber: '02-419-7000',
      availableFrom: '16/09/2023',
      availableTo: '23/09/2023',
      availableTime: '08:00 ~ 18:00'
    },
    patientInfo: {
      name: '홍길동',
      birthDate: '14/04/1988',
      thaiIdNumber: '0-0000-00000-00-0',
      gender: 'appointment.genderMale',
      phoneNumber: '062-1234-1234',
      height: '176 cm',
      weight: '65 kg',
      bloodType: 'B',
      medications: '안약 점안',
      personalHistory: '없음',
      allergies: '특이사항 없음'
    }
  }
};

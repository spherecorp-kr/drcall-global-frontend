import type { AppointmentCardData } from '@appointment/pending/cards/AppointmentCard';
import type { PatientDetailInfo } from '@/types/appointment';

// 진료완료 관련 import
export * from './completed-consultations';

/**
 * Mock appointments list data
 * TODO: Replace with actual API calls
 */
export const mockAppointmentsList: AppointmentCardData[] = [
  // 예약 대기
  {
    id: '1',
    type: 'appointment.standardAppointment',
    hospital: 'พระราม9 (Praram9 Hospital)',
    doctor: 'ดร.วิทยาวันเพ็ญ (Dr.Wittaya Wanpen)',
    datetime: '10/05/2023 14:01~14:15',
    status: 'pending'
  },
  {
    id: '2',
    type: 'appointment.quickAppointment',
    hospital: 'พระราม9 (Praram9 Hospital)',
    datetime: '10/06/2023 09:00~09:15',
    status: 'pending'
  },
  {
    id: '3',
    type: 'appointment.standardAppointment',
    hospital: 'บำรุงราษฎร์ (Bumrungrad Hospital)',
    doctor: 'ดร.สมชาย (Dr.Somchai)',
    datetime: '10/07/2023 10:30~10:45',
    status: 'pending'
  },
  {
    id: '11',
    type: 'appointment.standardAppointment',
    hospital: 'สมิติเวช (Samitivej Hospital)',
    doctor: 'ดร.นิภา (Dr.Nipha)',
    datetime: '10/08/2023 15:00~15:15',
    status: 'pending'
  },
  {
    id: '12',
    type: 'appointment.quickAppointment',
    hospital: 'ศิริราช (Siriraj Hospital)',
    datetime: '10/09/2023 11:20~11:35',
    status: 'pending'
  },

  // 예약 확정
  {
    id: '4',
    type: 'appointment.standardAppointment',
    hospital: 'พระราม9 (Praram9 Hospital)',
    doctor: 'ดร.วิทยาวันเพ็ญ (Dr.Wittaya Wanpen)',
    datetime: '10/06/2023 14:01~14:15',
    status: 'confirmed'
  },
  {
    id: '5',
    type: 'appointment.quickAppointment',
    hospital: 'บำรุงราษฎร์ (Bumrungrad Hospital)',
    doctor: 'ดร.ประเสริฐ (Dr.Prasert)',
    datetime: '10/05/2023 16:30~16:45',
    status: 'confirmed'
  },
  {
    id: '6',
    type: 'appointment.standardAppointment',
    hospital: 'สมิติเวช (Samitivej Hospital)',
    doctor: 'ดร.วรรณา (Dr.Wanna)',
    datetime: '10/04/2023 10:00~10:15',
    status: 'confirmed'
  },
  {
    id: '13',
    type: 'appointment.standardAppointment',
    hospital: 'ศิริราช (Siriraj Hospital)',
    doctor: 'ดร.อนุชา (Dr.Anucha)',
    datetime: '10/03/2023 13:15~13:30',
    status: 'confirmed'
  },

  // 진료 완료
  {
    id: '7',
    type: 'appointment.standardAppointment',
    hospital: 'พระราม9 (Praram9 Hospital)',
    doctor: 'ดร.วิทยาวันเพ็ญ (Dr.Wittaya Wanpen)',
    datetime: '09/28/2023 11:00~11:15',
    status: 'completed'
  },
  {
    id: '8',
    type: 'appointment.quickAppointment',
    hospital: 'บำรุงราษฎร์ (Bumrungrad Hospital)',
    doctor: 'ดร.สมชาย (Dr.Somchai)',
    datetime: '09/25/2023 15:30~15:45',
    status: 'completed'
  },
  {
    id: '14',
    type: 'appointment.standardAppointment',
    hospital: 'สมิติเวช (Samitivej Hospital)',
    doctor: 'ดร.นิภา (Dr.Nipha)',
    datetime: '09/20/2023 09:00~09:15',
    status: 'completed'
  },
  {
    id: '15',
    type: 'appointment.quickAppointment',
    hospital: 'ศิริราช (Siriraj Hospital)',
    doctor: 'ดร.อนุชา (Dr.Anucha)',
    datetime: '09/15/2023 14:20~14:35',
    status: 'completed'
  },

  // 예약 취소
  {
    id: '9',
    type: 'appointment.standardAppointment',
    hospital: 'พระราม9 (Praram9 Hospital)',
    doctor: 'ดร.วิทยาวันเพ็ญ (Dr.Wittaya Wanpen)',
    datetime: '09/20/2023 13:00~13:15',
    status: 'cancelled'
  },
  {
    id: '10',
    type: 'appointment.quickAppointment',
    hospital: 'บำรุงราษฎร์ (Bumrungrad Hospital)',
    datetime: '09/15/2023 16:00~16:15',
    status: 'cancelled'
  },
  {
    id: '16',
    type: 'appointment.standardAppointment',
    hospital: 'สมิติเวช (Samitivej Hospital)',
    doctor: 'ดร.วรรณา (Dr.Wanna)',
    datetime: '09/10/2023 10:30~10:45',
    status: 'cancelled'
  }
];

/**
 * Mock appointment detail data by ID
 * 리스트에서 선택한 예약의 상세 정보
 */
export const mockAppointmentsDetails: Record<
  string,
  {
    appointmentNumber: string;
    appointmentType: string;
    hospital: { name: string; phone: string };
    dateTime: string;
    doctor: string;
    symptoms: string;
    symptomImages?: string[];
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    cancellation?: {
      message: string;
      cancelledAt: string;
      cancelledBy: string;
      reason?: string;
    };
  }
> = {
  // 예약 대기
  '1': {
    appointmentNumber: '1111111111',
    appointmentType: 'appointment.standardAppointment',
    hospital: {
      name: 'พระราม9 (Praram9 Hospital)',
      phone: '02-765-1234'
    },
    dateTime: '10/05/2023 14:01~14:15',
    doctor: 'ดร.วิทยาวันเพ็ญ (Dr.Wittaya Wanpen)',
    symptoms: '감기기운이 있고 머리가 아파요.\n팔이 저려요\n숨 쉬기가 어려워요\n기침을 계속 해요',
    symptomImages: [
      'https://placehold.co/80x80',
      'https://placehold.co/80x80',
      'https://placehold.co/80x80'
    ],
    status: 'pending'
  },
  '2': {
    appointmentNumber: '2222222222',
    appointmentType: 'appointment.quickAppointment',
    hospital: {
      name: 'พระราม9 (Praram9 Hospital)',
      phone: '02-765-1234'
    },
    dateTime: '10/06/2023 09:00~09:15',
    doctor: '미배정',
    symptoms: '배가 아프고 소화가 안되요\n구토 증상이 있습니다',
    symptomImages: [],
    status: 'pending'
  },
  '3': {
    appointmentNumber: '3333333333',
    appointmentType: 'appointment.standardAppointment',
    hospital: {
      name: 'บำรุงราษฎร์ (Bumrungrad Hospital)',
      phone: '02-066-8888'
    },
    dateTime: '10/07/2023 10:30~10:45',
    doctor: 'ดร.สมชาย (Dr.Somchai)',
    symptoms: '허리 통증이 심합니다\n다리가 저립니다',
    symptomImages: [
      'https://placehold.co/80x80',
      'https://placehold.co/80x80'
    ],
    status: 'pending'
  },
  '11': {
    appointmentNumber: '1111111112',
    appointmentType: 'appointment.standardAppointment',
    hospital: {
      name: 'สมิติเวช (Samitivej Hospital)',
      phone: '02-022-2222'
    },
    dateTime: '10/08/2023 15:00~15:15',
    doctor: 'ดร.นิภา (Dr.Nipha)',
    symptoms: '피부 알레르기 반응이 있습니다\n가려움증이 심해요',
    symptomImages: [
      'https://placehold.co/80x80'
    ],
    status: 'pending'
  },
  '12': {
    appointmentNumber: '1111111113',
    appointmentType: 'appointment.quickAppointment',
    hospital: {
      name: 'ศิริราช (Siriraj Hospital)',
      phone: '02-419-7000'
    },
    dateTime: '10/09/2023 11:20~11:35',
    doctor: '미배정',
    symptoms: '눈이 충혈되고 아픕니다\n시야가 흐릿해요',
    symptomImages: [],
    status: 'pending'
  },

  // 예약 확정
  '4': {
    appointmentNumber: '4444444444',
    appointmentType: 'appointment.standardAppointment',
    hospital: {
      name: 'พระราม9 (Praram9 Hospital)',
      phone: '02-765-1234'
    },
    dateTime: '10/06/2023 14:01~14:15',
    doctor: 'ดร.วิทยาวันเพ็ญ (Dr.Wittaya Wanpen)',
    symptoms: '감기기운이 있고 머리가 아파요.\n팔이 저려요\n숨 쉬기가 어려워요\n기침을 계속 해요',
    symptomImages: [
      'https://placehold.co/80x80',
      'https://placehold.co/80x80',
      'https://placehold.co/80x80',
      'https://placehold.co/80x80',
      'https://placehold.co/80x80'
    ],
    status: 'confirmed'
  },
  '5': {
    appointmentNumber: '5555555555',
    appointmentType: 'appointment.quickAppointment',
    hospital: {
      name: 'บำรุงราษฎร์ (Bumrungrad Hospital)',
      phone: '02-066-8888'
    },
    dateTime: '10/05/2023 16:30~16:45',
    doctor: 'ดร.ประเสริฐ (Dr.Prasert)',
    symptoms: '목이 아프고 열이 납니다\n기침이 심합니다',
    symptomImages: [],
    status: 'confirmed'
  },
  '6': {
    appointmentNumber: '6666666666',
    appointmentType: 'appointment.standardAppointment',
    hospital: {
      name: 'สมิติเวช (Samitivej Hospital)',
      phone: '02-022-2222'
    },
    dateTime: '10/04/2023 10:00~10:15',
    doctor: 'ดร.วรรณา (Dr.Wanna)',
    symptoms: '무릎 통증이 있습니다\n걷기가 불편합니다',
    symptomImages: [
      'https://placehold.co/80x80',
      'https://placehold.co/80x80'
    ],
    status: 'confirmed'
  },
  '13': {
    appointmentNumber: '1111111114',
    appointmentType: 'appointment.standardAppointment',
    hospital: {
      name: 'ศิริราช (Siriraj Hospital)',
      phone: '02-419-7000'
    },
    dateTime: '10/03/2023 13:15~13:30',
    doctor: 'ดร.อนุชา (Dr.Anucha)',
    symptoms: '두통이 지속됩니다\n어지러움이 있어요',
    symptomImages: [],
    status: 'confirmed'
  },

  // 진료 완료
  '7': {
    appointmentNumber: '7777777777',
    appointmentType: 'appointment.standardAppointment',
    hospital: {
      name: 'พระราม9 (Praram9 Hospital)',
      phone: '02-765-1234'
    },
    dateTime: '09/28/2023 11:00~11:15',
    doctor: 'ดร.วิทยาวันเพ็ญ (Dr.Wittaya Wanpen)',
    symptoms: '감기 증상이 있습니다\n콧물과 기침이 나요',
    symptomImages: [],
    status: 'completed'
  },
  '8': {
    appointmentNumber: '8888888888',
    appointmentType: 'appointment.quickAppointment',
    hospital: {
      name: 'บำรุงราษฎร์ (Bumrungrad Hospital)',
      phone: '02-066-8888'
    },
    dateTime: '09/25/2023 15:30~15:45',
    doctor: 'ดร.สมชาย (Dr.Somchai)',
    symptoms: '복통이 있습니다\n소화불량 증상',
    symptomImages: [
      'https://placehold.co/80x80'
    ],
    status: 'completed'
  },
  '14': {
    appointmentNumber: '1111111115',
    appointmentType: 'appointment.standardAppointment',
    hospital: {
      name: 'สมิติเวช (Samitivej Hospital)',
      phone: '02-022-2222'
    },
    dateTime: '09/20/2023 09:00~09:15',
    doctor: 'ดร.นิภา (Dr.Nipha)',
    symptoms: '피부 발진이 생겼습니다',
    symptomImages: [
      'https://placehold.co/80x80',
      'https://placehold.co/80x80'
    ],
    status: 'completed'
  },
  '15': {
    appointmentNumber: '1111111116',
    appointmentType: 'appointment.quickAppointment',
    hospital: {
      name: 'ศิริราช (Siriraj Hospital)',
      phone: '02-419-7000'
    },
    dateTime: '09/15/2023 14:20~14:35',
    doctor: 'ดร.อนุชา (Dr.Anucha)',
    symptoms: '눈 염증이 있습니다',
    symptomImages: [],
    status: 'completed'
  },

  // 예약 취소
  '9': {
    appointmentNumber: '9999999999',
    appointmentType: 'appointment.standardAppointment',
    hospital: {
      name: 'พระราม9 (Praram9 Hospital)',
      phone: '02-765-1234'
    },
    dateTime: '09/20/2023 13:00~13:15',
    doctor: 'ดร.วิทยาวันเพ็ญ (Dr.Wittaya Wanpen)',
    symptoms: '감기기가 있고 머리 아파요.\n몸이 시려요.\n숨 쉬기가 어려워요.\n가슴의 계속 뛰고 있습니다.',
    symptomImages: [
      'https://placehold.co/80x80',
      'https://placehold.co/80x80',
      'https://placehold.co/80x80',
      'https://placehold.co/80x80',
      'https://placehold.co/80x80'
    ],
    status: 'cancelled',
    cancellation: {
      message: '취소된 예약 정보를\n확인하세요.',
      cancelledAt: '09/19/2023 15:48',
      cancelledBy: 'appointment.cancelledByHospital',
      reason: '병원 환경 점검 운영이 어려워 취소합니다.'
    }
  },
  '10': {
    appointmentNumber: '1010101010',
    appointmentType: 'appointment.quickAppointment',
    hospital: {
      name: 'บำรุงราษฎร์ (Bumrungrad Hospital)',
      phone: '02-066-8888'
    },
    dateTime: '09/15/2023 16:00~16:15',
    doctor: '미배정',
    symptoms: '복통이 있습니다\n소화가 안됩니다',
    symptomImages: [],
    status: 'cancelled',
    cancellation: {
      message: '취소된 예약 정보를\n확인하세요.',
      cancelledAt: '09/14/2023 10:20',
      cancelledBy: 'appointment.cancelledBySystem',
      reason: '시스템 오류로 인해 자동 취소되었습니다.'
    }
  },
  '16': {
    appointmentNumber: '1111111117',
    appointmentType: 'appointment.standardAppointment',
    hospital: {
      name: 'สมิติเวช (Samitivej Hospital)',
      phone: '02-022-2222'
    },
    dateTime: '09/10/2023 10:30~10:45',
    doctor: 'ดร.วรรณา (Dr.Wanna)',
    symptoms: '무릎 통증이 있습니다',
    symptomImages: [
      'https://placehold.co/80x80'
    ],
    status: 'cancelled',
    cancellation: {
      message: '취소된 예약 정보를\n확인하세요.',
      cancelledAt: '09/09/2023 08:15',
      cancelledBy: 'appointment.cancelledByPatient'
    }
  }
};

/**
 * Mock patient basic info (공통)
 */
export const mockPatientBasicInfo = {
  name: '홍길동',
  thaiId: '0-0000-00000-00-0',
  birthDate: '14/04/1998',
  gender: 'appointment.genderMale',
  phoneNumber: '062-1234-1234'
};

/**
 * Mock patient detail info (공통)
 */
export const mockPatientDetailInfo: PatientDetailInfo = {
  height: '176 cm',
  weight: '65 kg',
  bloodType: 'B',
  alcohol: '1~2',
  smoking: '1~5',
  medications: '3개월 전부터 탈모 약을 복용 중입니다.',
  personalHistory:
    '14살에 심장 수술을 받은 적이 있습니다. 17살에는 맹장수술을 받았습니다. 22살에는 다리가 부러져서 철심으로 고정하는 수술을 받았습니다.',
  familyHistory: '집안 대대로 심장병이 있습니다. 기관지가 좋지 않습니다. 유전병이 있습니다.'
};


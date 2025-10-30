/**
 * Mock data for appointments
 * TODO: Replace with actual API calls
 */

import type { PatientDetailInfo } from '@/types/appointment';

/**
 * Mock appointment data for detail/edit pages
 */
export const mockAppointmentData = {
  appointmentNumber: '1111111111',
  appointmentType: '일반 예약',
  hospital: {
    name: 'พระราม9 (Praram9 Hospital)',
    phone: '01-123-456'
  },
  dateTime: '10/05/2023 14:01~14:15',
  doctor: 'ดร.วิทยาวันเพ็ญ (Dr.Wittaya Wanpen)',
  symptoms: '감기기운이 있고 머리가 아파요.\n팔이 저려요\n숨 쉬기가 어려워요\n기침을 계속 해요',
  symptomImages: [
    'https://placehold.co/80x80',
    'https://placehold.co/80x80',
    'https://placehold.co/80x80',
    'https://placehold.co/80x80',
    'https://placehold.co/80x80'
  ],
  patientInfo: {
    name: '홍길동',
    thaiId: '0-0000-00000-00-0',
    birthDate: '14/04/1998',
    gender: 'appointment.genderMale',
    phoneNumber: '062-1234-1234',
    height: '176 cm',
    weight: '65 kg',
    bloodType: 'B' as const,
    alcohol: '1~2' as const,
    smoking: '1~5' as const,
    medications: '3개월 전부터 탈모 약을 복용 중입니다.',
    personalHistory:
      '14살에 심장 수술을 받은 적이 있습니다. 17살에는 맹장수술을 받았습니다. 22살에는 다리가 부러져서 철심으로 고정하는 수술을 받았습니다.',
    familyHistory: '집안 대대로 심장병이 있습니다. 기관지가 좋지 않습니다. 유전병이 있습니다.'
  }
};

/**
 * Mock patient basic info (read-only)
 */
export const mockPatientBasicInfo = {
  name: '홍길동',
  thaiId: '0-0000-00000-00-0',
  birthDate: '14/04/1998',
  gender: 'appointment.genderMale',
  phoneNumber: '062-1234-1234'
};

/**
 * Mock patient detail info for editing
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

/**
 * Mock user info for confirmation page
 */
export const mockUserInfo = {
  name: '홍길동',
  phone: '062-1234-1234'
};

/**
 * Mock hospital info
 */
export const mockHospitalInfo = {
  name: 'WS-ร1U9 (Praram9 Hospital)',
  phone: '01-123-456'
};

/**
 * Mock patient basic info for Questionnaire (read-only)
 */
export const mockQuestionnairePatientInfo = {
  name: '김환자',
  thaiId: '0-0000-00000-00-0',
  birthDate: '26/02/2023',
  gender: 'appointment.genderMale',
  phoneNumber: '0103215354'
};

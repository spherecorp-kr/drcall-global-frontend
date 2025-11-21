import { describe, it, expect, beforeEach } from 'vitest';
import { useAppointmentStore } from '@store/appointmentStore';

describe('appointmentStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 상태를 초기화하여 독립성 보장
    useAppointmentStore.getState().reset();
  });

  // 초기 상태 검증: 스토어가 생성될 때 기본값으로 잘 초기화되는지 확인
  it('initializes with default values', () => {
    const state = useAppointmentStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.selectedDate).toBeNull();
    expect(state.symptoms).toBe('');
  });

  // 단계 업데이트 테스트: setStep 호출 시 currentStep 변경 확인
  it('updates current step', () => {
    useAppointmentStore.getState().setStep(2);
    expect(useAppointmentStore.getState().currentStep).toBe(2);
  });

  // 예약 기본 정보 업데이트 테스트: 날짜, 의사, 시간 등 필수 정보 저장 확인
  it('updates date, doctor, and time', () => {
    const date = new Date('2025-01-01');
    useAppointmentStore.getState().setDateTimeDoctor(date, 'doc-1', 'Dr. Smith', '10:00');
    
    const state = useAppointmentStore.getState();
    expect(state.selectedDate).toEqual(date);
    expect(state.selectedDoctorId).toBe('doc-1');
    expect(state.selectedDoctorName).toBe('Dr. Smith');
    expect(state.selectedTimeSlot).toBe('10:00');
  });

  // 증상 정보 업데이트 테스트: 증상 텍스트와 이미지 배열 저장 확인
  it('updates symptoms', () => {
    useAppointmentStore.getState().setSymptoms('Headache', ['img1.jpg']);
    
    const state = useAppointmentStore.getState();
    expect(state.symptoms).toBe('Headache');
    expect(state.symptomImages).toEqual(['img1.jpg']);
  });

  // 문진 답변 업데이트 테스트: 문진표 응답 데이터 저장 확인
  it('updates questionnaire answers', () => {
    const answers = { q1: 'yes' };
    useAppointmentStore.getState().setQuestionnaireAnswers(answers);
    
    expect(useAppointmentStore.getState().questionnaireAnswers).toEqual(answers);
  });

  // 초기화(리셋) 기능 테스트: 상태 변경 후 reset 호출 시 초기 상태로 복구되는지 확인
  it('resets to initial state', () => {
    useAppointmentStore.getState().setStep(3);
    useAppointmentStore.getState().reset();
    
    const state = useAppointmentStore.getState();
    expect(state.currentStep).toBe(1);
  });
});

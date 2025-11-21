import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppointmentWizard } from '@hooks/useAppointmentWizard';
import { useAppointmentStore } from '@store/appointmentStore';

const steps = [
    { id: 1, title: 'Step 1', component: <div /> },
    { id: 2, title: 'Step 2', component: <div /> },
    { id: 3, title: 'Step 3', component: <div /> }
];

describe('useAppointmentWizard', () => {
  beforeEach(() => {
    useAppointmentStore.getState().reset();
  });

  // 초기 상태 테스트: 훅 초기화 시 현재 단계가 1이고 진행률 정보가 올바른지 확인
  it('initializes with correct state', () => {
    const { result } = renderHook(() => useAppointmentWizard({ type: 'standard', steps }));
    
    expect(result.current.currentStep).toBe(1);
    expect(result.current.progress.percentage).toBe(33); // 1/3 * 100 반올림
    expect(result.current.progress.isFirstStep).toBe(true);
    expect(result.current.progress.isLastStep).toBe(false);
  });

  // 다음 단계 이동 테스트: goToNextStep 호출 시 단계가 증가하는지 확인
  it('navigates to next step', () => {
    const { result } = renderHook(() => useAppointmentWizard({ type: 'standard', steps }));
    
    act(() => {
        result.current.goToNextStep();
    });
    
    expect(result.current.currentStep).toBe(2);
    expect(useAppointmentStore.getState().currentStep).toBe(2);
  });

  // 이전 단계 이동 테스트: goToPreviousStep 호출 시 단계가 감소하는지 확인
  it('navigates to previous step', () => {
    useAppointmentStore.getState().setStep(2);
    const { result } = renderHook(() => useAppointmentWizard({ type: 'standard', steps }));
    
    act(() => {
        result.current.goToPreviousStep();
    });
    
    expect(result.current.currentStep).toBe(1);
  });

  // 경계 조건 테스트: 첫 단계에서 이전으로 가거나 마지막 단계에서 다음으로 갈 때 범위 벗어나지 않음 확인
  it('does not navigate past bounds', () => {
    const { result } = renderHook(() => useAppointmentWizard({ type: 'standard', steps }));
    
    // 1단계에서 이전으로 이동 시도 (변화 없어야 함)
    act(() => {
        result.current.goToPreviousStep();
    });
    expect(result.current.currentStep).toBe(1);
    
    // 마지막 단계로 이동
    act(() => {
        result.current.goToStep(3);
    });
    
    // 3단계(마지막)에서 다음으로 이동 시도 (변화 없어야 함)
    act(() => {
        result.current.goToNextStep();
    });
    expect(result.current.currentStep).toBe(3);
  });
  
  // 진행률 계산 테스트: 현재 단계에 따른 진행률(%) 계산 확인
  it('calculates progress correctly', () => {
    useAppointmentStore.getState().setStep(2);
    const { result } = renderHook(() => useAppointmentWizard({ type: 'standard', steps }));
    
    expect(result.current.progress.percentage).toBe(67); // 2/3 * 100 rounded
  });
});

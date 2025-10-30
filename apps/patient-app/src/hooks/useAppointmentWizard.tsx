/**
 * Appointment Wizard Hook
 * Provides a cleaner, more maintainable way to handle multi-step appointment flows
 */

import { type ReactElement, useMemo } from 'react';
import { useAppointmentStore } from '@store/appointmentStore';

export type AppointmentType = 'standard' | 'quick';

interface WizardStep {
  id: number;
  component: ReactElement;
  title: string;
}

interface UseAppointmentWizardOptions {
  type: AppointmentType;
  steps: WizardStep[];
}

export function useAppointmentWizard({ type, steps }: UseAppointmentWizardOptions) {
  const currentStep = useAppointmentStore((state) => state.currentStep);
  const setStep = useAppointmentStore((state) => state.setStep);

  // Get current step configuration
  const currentStepConfig = useMemo(() => {
    return steps.find((step) => step.id === currentStep) || steps[0];
  }, [steps, currentStep]);

  // Navigation helpers
  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setStep(step);
    }
  };

  const resetWizard = () => {
    setStep(1);
  };

  // Progress tracking
  const progress = useMemo(() => {
    return {
      current: currentStep,
      total: steps.length,
      percentage: Math.round((currentStep / steps.length) * 100),
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === steps.length,
    };
  }, [currentStep, steps.length]);

  return {
    // Current state
    currentStep,
    currentStepConfig,
    appointmentType: type,

    // Navigation
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetWizard,

    // Progress
    progress,

    // Step configuration
    steps,
  };
}

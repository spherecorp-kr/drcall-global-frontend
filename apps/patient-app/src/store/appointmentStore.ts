import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppointmentStatus } from '@appointment/pending/cards/AppointmentCard';

export interface AppointmentState {
  // Current step (1: 날짜, 2: 증상, 3: 문진, 4: 확인)
  currentStep: number;

  // Step 1: 날짜, 의사, 시간 선택
  selectedDate: Date | null;
  selectedDoctorId: string | null;
  selectedDoctorName: string | null;
  selectedTimeSlot: string | null;

  // Step 2: 증상 입력
  symptoms: string;
  symptomImages: string[];

  // Step 3: 문진 (questionnaire)
  questionnaireAnswers: { [key: string]: string };

  // Appointment list tab
  selectedListTab: AppointmentStatus;

  // Actions
  setStep: (step: number) => void;
  setDateTimeDoctor: (date: Date, doctorId: string, doctorName: string, timeSlot: string) => void;
  setSymptoms: (symptoms: string, images: string[]) => void;
  setQuestionnaireAnswers: (answers: { [key: string]: string }) => void;
  setSelectedListTab: (tab: AppointmentStatus) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  selectedDate: null,
  selectedDoctorId: null,
  selectedDoctorName: null,
  selectedTimeSlot: null,
  symptoms: '',
  symptomImages: [],
  questionnaireAnswers: {},
  selectedListTab: 'pending' as AppointmentStatus
};

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) =>
        set({
          currentStep: step
        }),

      setDateTimeDoctor: (date, doctorId, doctorName, timeSlot) =>
        set({
          selectedDate: date,
          selectedDoctorId: doctorId,
          selectedDoctorName: doctorName,
          selectedTimeSlot: timeSlot
        }),

      setSymptoms: (symptoms, images) =>
        set({
          symptoms,
          symptomImages: images
        }),

      setQuestionnaireAnswers: (answers) =>
        set({
          questionnaireAnswers: answers
        }),

      setSelectedListTab: (tab) =>
        set({
          selectedListTab: tab
        }),

      reset: () => set(initialState)
    }),
    {
      name: 'appointment-storage', // unique name for sessionStorage key
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage
      partialize: (state) => ({
        // Only persist appointment form data, not UI state like selectedListTab
        currentStep: state.currentStep,
        selectedDate: state.selectedDate,
        selectedDoctorId: state.selectedDoctorId,
        selectedDoctorName: state.selectedDoctorName,
        selectedTimeSlot: state.selectedTimeSlot,
        symptoms: state.symptoms,
        symptomImages: state.symptomImages,
        questionnaireAnswers: state.questionnaireAnswers,
      }),
    }
  )
);

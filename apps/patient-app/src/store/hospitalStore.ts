import { create } from 'zustand';
import type { Hospital } from '@/types/hospital';

interface HospitalState {
  hospital: Hospital | null;
  isLoading: boolean;
  error: string | null;
  setHospital: (hospital: Hospital) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  hospital: null,
  isLoading: false,
  error: null,
};

export const useHospitalStore = create<HospitalState>((set) => ({
  ...initialState,

  setHospital: (hospital) =>
    set({
      hospital,
      isLoading: false,
      error: null,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  reset: () => set(initialState),
}));

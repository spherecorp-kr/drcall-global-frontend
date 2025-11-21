import type { AppointmentStatus } from '@/shared/types/appointment';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppointmentTabState {
	appointmentTab: AppointmentStatus;
	setAppointmentTab: (tab: AppointmentStatus) => void;
	resetAppointmentTab: () => void;
}

export const useAppointmentTabStore = create<AppointmentTabState>()(
	persist(
		(set) => ({
			appointmentTab: 'pending',
			setAppointmentTab: (tab: AppointmentStatus) => set({ appointmentTab: tab }),
			resetAppointmentTab: () => set({ appointmentTab: 'pending' })
		}),
		{
			name: 'appointment-tab-storage'
		}
	)
);
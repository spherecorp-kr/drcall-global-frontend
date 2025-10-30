import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SortingState } from '@tanstack/react-table';

interface LayoutState {
	isSideNavExpanded: boolean;
	toggleSideNav: () => void;
	setSideNavExpanded: (expanded: boolean) => void;
	appointmentTableHeaderFixed: boolean;
	doctorListTableHeaderFixed: boolean;
	setAppointmentTableHeaderFixed: (fixed: boolean) => void;
	setDoctorListTableHeaderFixed: (fixed: boolean) => void;
	// 새로고침하면 초기화되는 것들
	appointmentTableSorting: SortingState;
	doctorListTableSorting: SortingState;
	setAppointmentTableSorting: (sorting: SortingState) => void;
	setDoctorListTableSorting: (sorting: SortingState) => void;
	appointmentGradeFilter: 'all' | 'VIP' | 'Risk';
	appointmentStatusFilter: 'all' | '진료 대기' | '진료 중' | '진료 완료' | '예약 취소';
	appointmentSearchTerm: string;
	setAppointmentGradeFilter: (filter: 'all' | 'VIP' | 'Risk') => void;
	setAppointmentStatusFilter: (
		filter: 'all' | '진료 대기' | '진료 중' | '진료 완료' | '예약 취소',
	) => void;
	setAppointmentSearchTerm: (term: string) => void;
	patientChartViewMode: 'weekly' | 'monthly';
	setPatientChartViewMode: (mode: 'weekly' | 'monthly') => void;
}

export const useLayoutStore = create<LayoutState>()(
	persist(
		(set) => ({
			isSideNavExpanded: true,
			toggleSideNav: () => set((state) => ({ isSideNavExpanded: !state.isSideNavExpanded })),
			setSideNavExpanded: (expanded) => set({ isSideNavExpanded: expanded }),
			appointmentTableHeaderFixed: false,
			doctorListTableHeaderFixed: false,
			setAppointmentTableHeaderFixed: (fixed) => set({ appointmentTableHeaderFixed: fixed }),
			setDoctorListTableHeaderFixed: (fixed) => set({ doctorListTableHeaderFixed: fixed }),
			// 새로고침하면 초기화
			appointmentTableSorting: [],
			doctorListTableSorting: [],
			setAppointmentTableSorting: (sorting) => set({ appointmentTableSorting: sorting }),
			setDoctorListTableSorting: (sorting) => set({ doctorListTableSorting: sorting }),
			appointmentGradeFilter: 'all',
			appointmentStatusFilter: 'all',
			appointmentSearchTerm: '',
			setAppointmentGradeFilter: (filter) => set({ appointmentGradeFilter: filter }),
			setAppointmentStatusFilter: (filter) => set({ appointmentStatusFilter: filter }),
			setAppointmentSearchTerm: (term) => set({ appointmentSearchTerm: term }),
			patientChartViewMode: 'weekly',
			setPatientChartViewMode: (mode) => set({ patientChartViewMode: mode }),
		}),
		{
			name: 'layout-storage',
			partialize: (state) => ({
				isSideNavExpanded: state.isSideNavExpanded,
				appointmentTableHeaderFixed: state.appointmentTableHeaderFixed,
				doctorListTableHeaderFixed: state.doctorListTableHeaderFixed,
				patientChartViewMode: state.patientChartViewMode,
			}),
		},
	),
);

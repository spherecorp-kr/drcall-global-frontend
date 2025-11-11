import { create } from 'zustand';
import { MILLI_SEC_PER_WEEK } from '@/shared/utils/constants';

interface PhrChart {
	searchDate: Date;
}

interface PhrChartState extends PhrChart {
	goNextMonth: () => void;
	goNextWeek: () => void;
	goPrevMonth: () => void;
	goPrevWeek: () => void;
	resetPhrChartStore: () => void;
}

export const usePhrChartStore = create<PhrChartState>((set) => ({
	searchDate: new Date(),
	goNextMonth: () => set((state) => {
		const searchDate = state.searchDate;
		const year = searchDate.getFullYear();
		const nextMonth = (searchDate.getMonth() + 1) % 12;
		if (nextMonth === 0) {
			return {
				...state,
				searchDate: new Date(year + 1, 0, 1)
			}
		} else {
			return {
				...state,
				searchDate: new Date(year, nextMonth, 1)
			}
		}
	}),
	goNextWeek: () => set((state) => ({
		...state,
		searchDate: new Date(state.searchDate.getTime() + MILLI_SEC_PER_WEEK)
	})),
	goPrevMonth: () => set((state) => {
		const searchDate = state.searchDate;
		const year = searchDate.getFullYear();
		const prevMonth = searchDate.getMonth() - 1;
		if (prevMonth < 0) {
			return {
				...state,
				searchDate: new Date(year - 1, 11, 1)
			}
		} else {
			return {
				...state,
				searchDate: new Date(year, prevMonth, 1)
			}
		}
	}),
	goPrevWeek: () => set((state) => ({
		...state,
		searchDate: new Date(state.searchDate.getTime() - MILLI_SEC_PER_WEEK)
	})),
	resetPhrChartStore: () => set({ searchDate: new Date() }),
}));
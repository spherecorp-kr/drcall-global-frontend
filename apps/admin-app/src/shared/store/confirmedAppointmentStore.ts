import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewMode = 'list' | 'calendar';

interface ConfirmedAppointmentState {
	// 뷰 모드 상태
	viewMode: ViewMode;
	
	// 검색 필터 상태
	keyword: string;
	grade: string;
	sort: string;
	
	// 액션들
	setViewMode: (mode: ViewMode) => void;
	setKeyword: (keyword: string) => void;
	setGrade: (grade: string) => void;
	setSort: (sort: string) => void;
	
	// 모든 필터 초기화
	resetFilters: () => void;
}

const initialState = {
	viewMode: 'list' as ViewMode,
	keyword: '',
	grade: 'all',
	sort: '0',
};

export const useConfirmedAppointmentStore = create<ConfirmedAppointmentState>()(
	persist(
		(set) => ({
			...initialState,
			
			// 뷰 모드 변경
			setViewMode: (mode) => set({ viewMode: mode }),
			
			// 검색 필터 변경
			setKeyword: (keyword) => set({ keyword }),
			setGrade: (grade) => set({ grade }),
			setSort: (sort) => set({ sort }),
			
			// 필터 초기화 (viewMode는 유지)
			resetFilters: () => set((state) => ({
				...initialState,
				viewMode: state.viewMode
			}))
		}),
		{
			name: 'confirmed-appointment-storage'
		}
	)
);

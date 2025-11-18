import { useState, useCallback, useEffect } from 'react';
import { doctorService, transformDoctorDto } from '@/services/doctorService';
import type {
	DoctorManagement,
	DoctorManagementFilterState,
	GetDoctorsRequest,
} from '@/shared/types/doctor';

interface UseDoctorManagementReturn {
	doctors: DoctorManagement[];
	loading: boolean;
	error: Error | null;
	totalElements: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
	filters: DoctorManagementFilterState;
	setFilters: (filters: DoctorManagementFilterState) => void;
	setPage: (page: number) => void;
	setPageSize: (size: number) => void;
	refresh: () => Promise<void>;
}

export function useDoctorManagement(initialPageSize = 10): UseDoctorManagementReturn {
	const [doctors, setDoctors] = useState<DoctorManagement[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [totalElements, setTotalElements] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [filters, setFilters] = useState<DoctorManagementFilterState>({
		searchQuery: '',
		isRegisteredOnly: false,
	});

	const fetchDoctors = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const params: GetDoctorsRequest = {
				page: currentPage - 1,
				size: pageSize,
				searchQuery: filters.searchQuery || undefined,
				isRegisteredOnly: filters.isRegisteredOnly || undefined,
			};

			console.log('[useDoctorManagement] Fetching doctors with params:', params);
			const response = await doctorService.getDoctors(params);
			console.log('[useDoctorManagement] Response:', response);

			// DTO를 UI 모델로 변환
			const transformedDoctors = response.content.map(transformDoctorDto);
			console.log('[useDoctorManagement] Transformed doctors:', transformedDoctors);

			setDoctors(transformedDoctors);
			setTotalElements(response.totalElements);
			setTotalPages(response.totalPages);
		} catch (err) {
			console.error('[useDoctorManagement] Error:', err);
			setError(err as Error);
			setDoctors([]);
		} finally {
			setLoading(false);
		}
	}, [currentPage, pageSize, filters]);

	// 필터나 페이지가 변경될 때마다 데이터 재조회
	useEffect(() => {
		fetchDoctors();
	}, [fetchDoctors]);

	const setPage = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	const handleSetPageSize = useCallback((size: number) => {
		setPageSize(size);
		setCurrentPage(0); // 페이지 크기 변경 시 첫 페이지로 이동
	}, []);

	const handleSetFilters = useCallback((newFilters: DoctorManagementFilterState) => {
		setFilters(newFilters);
		setCurrentPage(0); // 필터 변경 시 첫 페이지로 이동
	}, []);

	return {
		doctors,
		loading,
		error,
		totalElements,
		totalPages,
		currentPage,
		pageSize,
		filters,
		setFilters: handleSetFilters,
		setPage,
		setPageSize: handleSetPageSize,
		refresh: fetchDoctors,
	};
}

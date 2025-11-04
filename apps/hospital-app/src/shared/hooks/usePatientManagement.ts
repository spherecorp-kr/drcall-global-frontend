import { useState, useCallback, useEffect } from 'react';
import { mockPatients } from '@/mocks/patientData';
import type {
	PatientManagement,
	PatientManagementFilterState,
} from '@/shared/types/patient';

interface UsePatientManagementReturn {
	patients: PatientManagement[];
	loading: boolean;
	error: Error | null;
	totalElements: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
	filters: PatientManagementFilterState;
	setFilters: (filters: PatientManagementFilterState) => void;
	setPage: (page: number) => void;
	setPageSize: (size: number) => void;
	refresh: () => Promise<void>;
}

export function usePatientManagement(initialPageSize = 10): UsePatientManagementReturn {
	const [patients, setPatients] = useState<PatientManagement[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [totalElements, setTotalElements] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [filters, setFilters] = useState<PatientManagementFilterState>({
		searchQuery: '',
	});

	const fetchPatients = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// Simulate API call with mock data
			await new Promise((resolve) => setTimeout(resolve, 300));

			let filteredPatients = [...mockPatients];

			// Apply search filter
			if (filters.searchQuery) {
				const query = filters.searchQuery.toLowerCase();
				filteredPatients = filteredPatients.filter(
					(patient) =>
						patient.name.toLowerCase().includes(query) ||
						patient.phoneNumber.includes(query)
				);
			}

			// Apply grade filter
			if (filters.grade) {
				filteredPatients = filteredPatients.filter(
					(patient) => patient.grade === filters.grade
				);
			}

			// Calculate pagination
			const total = filteredPatients.length;
			const pages = Math.ceil(total / pageSize);
			const start = currentPage * pageSize;
			const end = start + pageSize;
			const paginatedPatients = filteredPatients.slice(start, end);

			setPatients(paginatedPatients);
			setTotalElements(total);
			setTotalPages(pages);
		} catch (err) {
			console.error('[usePatientManagement] Error:', err);
			setError(err as Error);
			setPatients([]);
		} finally {
			setLoading(false);
		}
	}, [currentPage, pageSize, filters]);

	// Fetch data when filters or page changes
	useEffect(() => {
		fetchPatients();
	}, [fetchPatients]);

	const setPage = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	const handleSetPageSize = useCallback((size: number) => {
		setPageSize(size);
		setCurrentPage(0); // Reset to first page when page size changes
	}, []);

	const handleSetFilters = useCallback((newFilters: PatientManagementFilterState) => {
		setFilters(newFilters);
		setCurrentPage(0); // Reset to first page when filters change
	}, []);

	return {
		patients,
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
		refresh: fetchPatients,
	};
}

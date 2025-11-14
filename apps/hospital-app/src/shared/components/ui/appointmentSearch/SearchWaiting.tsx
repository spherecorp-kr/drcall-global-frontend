import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Dropdown, Input, SearchIcon } from '@/shared/components/ui';
import type { DropdownOption } from '@/shared/types/dropdown';

const SearchWaiting = () => {
	const [keyword, setKeyword] = useState<string>('');

	// 각 Select의 상태 관리
	const [appointmentType, setAppointmentType] = useState<string>('all');
	const [grade, setGrade] = useState<string>('all');
	const [sort, setSort] = useState<string>('0');

	const appointmentTypeOptions: DropdownOption[] = useMemo(() => [
		{ label: '전체', value: 'all' },
		{ label: '빠른 진료', value: 'aptmt' },
		{ label: '예약 진료', value: 'sdn' },
	], []);

	const gradeOptions: DropdownOption[] = useMemo(() => [
		{ label: '전체 등급', value: 'all' },
		{ label: 'VIP', value: 'VIP' },
		{ label: 'Risk', value: 'Risk' },
	], []);

	const sortOptions: DropdownOption[] = useMemo(() => [
		{ label: '예약 신청 일시 오래된 순', value: '0' },
		{ label: '진료 희망 일시 가까운 순', value: '1' },
	], []);

	// 각 Select의 변경 이벤트 핸들러
	const handleAppointmentTypeChange = useCallback((value: string) => {
		setAppointmentType(value);
		console.log('예약 타입 변경:', value);
		// 여기에 추가 로직 작성 (예: API 호출, 필터링 등)
	}, []);

	const handleGradeChange = useCallback((value: string) => {
		setGrade(value);
		console.log('등급 변경:', value);
		// 여기에 추가 로직 작성
	}, []);

	const handleSortChange = useCallback((value: string) => {
		setSort(value);
		console.log('정렬 변경:', value);
		// 여기에 추가 로직 작성
	}, []);

	// 검색어 변경 핸들러
	const handleKeywordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
	}, []);

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-3">
				<Dropdown
					className="w-auto"
					menuClassName="min-w-[9.375rem]"
					onChange={handleAppointmentTypeChange}
					options={appointmentTypeOptions}
					value={appointmentType}
				/>
				<Dropdown
					className="w-auto"
					menuClassName="min-w-[9.375rem]"
					onChange={handleGradeChange}
					options={gradeOptions}
					value={grade}
				/>
				<Dropdown
					className="w-auto"
					menuClassName="min-w-[9.375rem]"
					onChange={handleSortChange}
					options={sortOptions}
					value={sort}
				/>
			</div>
			<Input
				className="px-0"
				icon={<SearchIcon className="cursor-pointer h-7 w-7" />}
				onChange={handleKeywordChange}
				placeholder="환자명을 입력해주세요."
				type="text"
				value={keyword}
				wrapperClassName="w-[36.125rem]"
			/>
		</div>
	);
};

export default SearchWaiting;

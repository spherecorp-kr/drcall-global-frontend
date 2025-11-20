import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Dropdown, Input, SearchIcon } from '@/shared/components/ui';
import type { DropdownOption } from '@/shared/types/dropdown';
import { useTranslation } from 'react-i18next';

const SearchWaiting = () => {
	const { t } = useTranslation();
	const [keyword, setKeyword] = useState<string>('');

	// 각 Select의 상태 관리
	const [appointmentType, setAppointmentType] = useState<string>('all');
	const [grade, setGrade] = useState<string>('all');
	const [sort, setSort] = useState<string>('0');

	const appointmentTypeOptions: DropdownOption[] = useMemo(() => [
		{ label: t('appointment.search.all'), value: 'all' },
		{ label: t('appointment.search.appointmentType.fast'), value: 'aptmt' },
		{ label: t('appointment.search.appointmentType.scheduled'), value: 'sdn' },
	], [t]);

	const gradeOptions: DropdownOption[] = useMemo(() => [
		{ label: t('appointment.search.allGrade'), value: 'all' },
		{ label: 'VIP', value: 'VIP' },
		{ label: 'Risk', value: 'Risk' },
	], [t]);

	const sortOptions: DropdownOption[] = useMemo(() => [
		{ label: t('appointment.search.sort.requestOldest'), value: '0' },
		{ label: t('appointment.search.sort.datetimeNearest'), value: '1' },
	], [t]);

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
				placeholder={t('appointment.search.placeholders.patientName')}
				type="text"
				value={keyword}
				wrapperClassName="w-[36.125rem]"
			/>
		</div>
	);
};

export default SearchWaiting;

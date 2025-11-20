import React, { useCallback, useMemo, useState } from 'react';
import type { DropdownOption } from '@/shared/types/dropdown';
import { Dropdown, Input, SearchIcon } from '@/shared/components/ui';
import { useTranslation } from 'react-i18next';

const SearchConsultations = () => {
	const { t } = useTranslation();
	const [keyword, setKeyword] = useState<string>('');

	// 각 Select의 상태 관리
	const [grade, setGrade] = useState<string>('all');
	const [sort, setSort] = useState<string>('0');

	const gradeOptions: DropdownOption[] = useMemo(() => [
		{ label: t('appointment.search.allGrade'), value: 'all' },
		{ label: 'VIP', value: 'VIP' },
		{ label: 'Risk', value: 'Risk' },
	], [t]);

	const sortOptions: DropdownOption[] = useMemo(() => [
		{ label: t('appointment.search.sort.scheduledDate'), value: '0' },
		{ label: t('appointment.search.sort.confirmedDate'), value: '1' },
	], [t]);

	// 각 Select의 변경 이벤트 핸들러
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
	const handleKeywordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
	}, []);

	return (
		<div className="flex flex-1 items-center justify-between w-full">
			<div className="flex items-center gap-3">
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
				placeholder={t('appointment.search.placeholders.appointmentOrPatient')}
				type="text"
				value={keyword}
				wrapperClassName="rounded w-[36.125rem]"
			/>
		</div>
	);
};

export default SearchConsultations;
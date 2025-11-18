import React, { useCallback, useMemo, useState } from 'react';
import type { DropdownOption } from '@/shared/types/dropdown';
import { Dropdown, Input, SearchIcon } from '@/shared/components/ui';

const SearchConsultations = () => {
	const [keyword, setKeyword] = useState<string>('');

	// 각 Select의 상태 관리
	const [grade, setGrade] = useState<string>('all');
	const [sort, setSort] = useState<string>('0');

	const gradeOptions: DropdownOption[] = useMemo(() => [
		{ label: '전체 등급', value: 'all' },
		{ label: 'VIP', value: 'VIP' },
		{ label: 'Risk', value: 'Risk' },
	], []);

	const sortOptions: DropdownOption[] = useMemo(() => [
		{ label: '진료 예정일 순', value: '0' },
		{ label: '예약 확정일 순', value: '1' },
	], []);

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
				placeholder="예약 번호 또는 환자명을 입력해주세요."
				type="text"
				value={keyword}
				wrapperClassName="rounded w-[36.125rem]"
			/>
		</div>
	);
};

export default SearchConsultations;
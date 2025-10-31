import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Dropdown, DropdownCheckbox, Input, SearchIcon } from '@/shared/components/ui';
import { useTranslation } from 'react-i18next';
import type { DropdownOption } from '@/shared/types/dropdown';

const SearchCancelled = () => {
	const { t } = useTranslation();

	const [keyword, setKeyword] = useState<string>('');

	// 각 Select의 상태 관리
	const [canceler, setCanceler] = useState<string>('all');
	const [sort, setSort] = useState<string>('0');

	const cancelerOptions: DropdownOption[] = useMemo(() => [
		{ label: '전체', value: 'all' },
		{ label: '병원', value: 'HOSPITAL' },
		{ label: '환자', value: 'PATIENT' },
		{ label: '시스템', value: 'SYSTEM' },
	], []);

	const sortOptions: DropdownOption[] = useMemo(() => [
		{ label: '최신순', value: '0' },
		{ label: '오래된 순', value: '1' },
	], []);

	const handleCancelerChange = useCallback((value: string) => {
		setCanceler(value);
		console.log('취소자 변경:', value);
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
				<DropdownCheckbox
					className="w-auto"
					hasImage
					menuClassName="min-w-[15.25rem]"
					options={[
						{ label: 'q', value: 'q' },
						{ label: 'w', value: 'w' },
					]}
					text={t('role.doctor')}
				/>
				<Dropdown
					className="w-auto"
					menuClassName="min-w-[9.375rem]"
					onChange={handleCancelerChange}
					options={cancelerOptions}
					placeholder="전체"
					value={canceler}
				/>
				<Dropdown
					className="w-auto"
					menuClassName="min-w-[9.375rem]"
					onChange={handleSortChange}
					options={sortOptions}
					placeholder="최신순"
					value={sort}
				/>
			</div>
			<Input
				className="px-0"
				icon={<SearchIcon className="cursor-pointer h-7 mr-3 w-7" />}
				onChange={handleKeywordChange}
				placeholder="예약 번호, 환자명을 입력해주세요."
				type="text"
				value={keyword}
				wrapperClassName="w-[36.125rem]"
			/>
		</div>
	);
};

export default SearchCancelled;
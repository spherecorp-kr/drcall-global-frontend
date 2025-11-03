import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Dropdown, DropdownCheckbox, Input, SearchIcon } from '@/shared/components/ui';
import type { DropdownOption } from '@/shared/types/dropdown';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';

type ViewMode = 'list' | 'calendar';

const SearchConfirmed = () => {
	const { t } = useTranslation();
	const [keyword, setKeyword] = useState<string>('');
	const [viewMode, setViewMode] = useState<ViewMode>('list');

	// 각 Select의 상태 관리
	const [grade, setGrade] = useState<string>('all');
	const [sort, setSort] = useState<string>('0');

	const gradeOptions: DropdownOption[] = useMemo(() => [
		{ label: '전체 등급', value: 'all' },
		{ label: 'VIP', value: 'VIP' },
		{ label: 'Risk', value: 'Risk' },
	], []);

	const sortOptions: DropdownOption[] = useMemo(() => [
		{ label: '최신순', value: '0' },
		{ label: '오래된 순', value: '1' },
	], []);

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
					onChange={handleGradeChange}
					options={gradeOptions}
					placeholder="전체 등급"
					value={grade}
				/>
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
					onChange={handleSortChange}
					options={sortOptions}
					placeholder="최신순"
					value={sort}
				/>
			</div>
			<div className="flex gap-2.5 items-center">
				<div className="border border-stroke-segmented flex items-center justify-center h-10 rounded-[5px]">
					<button
						className={cn(
							'h-full px-3 py-0.5 rounded-l-[5px]',
							viewMode === 'list' ? 'bg-primary-70' : 'bg-white',
						)}
						onClick={() => setViewMode('list')}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M4 13C4.55228 13 5 12.5523 5 12C5 11.4477 4.55228 11 4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13Z"
								fill={viewMode === 'list' ? 'white' : '#1f1f1f'}
							/>
							<path
								d="M4 7C4.55228 7 5 6.55228 5 6C5 5.44772 4.55228 5 4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7Z"
								fill={viewMode === 'list' ? 'white' : '#1f1f1f'}
							/>
							<path
								d="M4 19C4.55228 19 5 18.5523 5 18C5 17.4477 4.55228 17 4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19Z"
								fill={viewMode === 'list' ? 'white' : '#1f1f1f'}
							/>
							<path
								d="M21 12L9 12M21 6L9 6M21 18L9 18M5 12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11C4.55228 11 5 11.4477 5 12ZM5 6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5C4.55228 5 5 5.44772 5 6ZM5 18C5 18.5523 4.55228 19 4 19C3.44772 19 3 18.5523 3 18C3 17.4477 3.44772 17 4 17C4.55228 17 5 17.4477 5 18Z"
								stroke={viewMode === 'list' ? 'white' : '#1f1f1f'}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
							/>
						</svg>
					</button>
					<div className="bg-stroke-segmented h-full w-px">{/* 구분선 */}</div>
					<button
						className={cn(
							'h-full px-3 py-0.5 rounded-r-[5px]',
							viewMode === 'calendar' ? 'bg-primary-70' : 'bg-white',
						)}
						onClick={() => setViewMode('calendar')}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M20 10.2H4M15.5556 3V6.6M8.44444 3V6.6M8.26667 21H15.7333C17.2268 21 17.9735 21 18.544 20.7057C19.0457 20.4469 19.4537 20.0338 19.7094 19.5258C20 18.9482 20 18.1921 20 16.68V9.12C20 7.60786 20 6.85179 19.7094 6.27423C19.4537 5.76619 19.0457 5.35314 18.544 5.09428C17.9735 4.8 17.2268 4.8 15.7333 4.8H8.26667C6.77319 4.8 6.02646 4.8 5.45603 5.09428C4.95426 5.35314 4.54631 5.76619 4.29065 6.27423C4 6.85179 4 7.60786 4 9.12V16.68C4 18.1921 4 18.9482 4.29065 19.5258C4.54631 20.0338 4.95426 20.4469 5.45603 20.7057C6.02646 21 6.77319 21 8.26667 21Z"
								stroke={viewMode === 'calendar' ? 'white' : '#1f1f1f'}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
							/>
						</svg>
					</button>
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
		</div>
	);
};

export default SearchConfirmed;

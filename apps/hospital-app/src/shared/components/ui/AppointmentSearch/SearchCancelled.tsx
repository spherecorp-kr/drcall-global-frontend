import { type ChangeEvent, useCallback, useState } from 'react';
import { Input, SearchIcon } from '@/shared/components/ui';

const SearchCancelled = () => {
	const [keyword, setKeyword] = useState<string>('');

	// 검색어 변경 핸들러
	const handleKeywordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
	}, []);

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-3"></div>
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
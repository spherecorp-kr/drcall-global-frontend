import { cn } from '@/shared/utils/cn';
import searchIcon from '@/shared/assets/icons/ic_search.svg';
import closeCircleIcon from '@/shared/assets/icons/ic_close_circle.svg';
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
	className?: string;
	onChange: (value: string) => void;
	placeholder: string;
	value: string;
}

const SearchInput = ({ className, onChange, placeholder, value }: SearchInputProps) => {
	const { t } = useTranslation();

	const handleClear = () => {
		onChange('');
	};

	return (
		<div
			className={cn(
				'h-10 px-4 py-2.5 bg-bg-white rounded-lg border border-stroke-input flex items-center gap-2',
				className,
			)}
		>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="flex-1 text-16 font-pretendard text-text-100 placeholder:text-text-30 bg-transparent outline-none"
			/>
			{value && (
				<button
					onClick={handleClear}
					className="w-5 h-5 flex-shrink-0 flex items-center justify-center hover:opacity-70 transition-opacity"
					aria-label={t('common.ariaLabels.clearSearch')}
				>
					<img src={closeCircleIcon} alt={t('common.ariaLabels.clear')} className="w-full h-full" />
				</button>
			)}
			<img src={searchIcon} alt={t('common.ariaLabels.search')} className="w-7 h-7 flex-shrink-0" />
		</div>
	);
}

export default SearchInput;
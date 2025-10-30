import { useState, useRef, useEffect } from 'react';
import { cn } from '@/shared/utils/cn';
import dropDownIcon from '@/shared/assets/icons/btn_drop_down_grey.svg';
import dropUpIcon from '@/shared/assets/icons/btn_drop_up_grey.svg';
import type { DropdownProps } from '@/shared/types/dropdown';

const ChevronUpDownIcon = ({ direction }: { direction: 'up' | 'down' }) => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path
			d={direction === 'up' ? 'M4 10L8 6L12 10' : 'M4 6L8 10L12 6'}
			stroke="#1F1F1F"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const VerticalDivider = () => (
	<svg
		width="1"
		height="36"
		viewBox="0 0 1 36"
		fill="none"
		className="absolute right-0 top-1/2 -translate-y-1/2"
	>
		<line x1="0.5" y1="0" x2="0.5" y2="36" stroke="#E0E0E0" />
	</svg>
);

const Dropdown = ({
	className,
	menuClassName,
	onChange,
	options,
	placeholder = '선택',
	value,
	variant = 'default',
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((opt) => opt.value === value);
	const displayText = selectedOption ? selectedOption.label : placeholder;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleSelect = (optionValue: string) => {
		onChange?.(optionValue);
		setIsOpen(false);
	};

	const sortedOptions =
		variant === 'navigation'
			? options.sort((a, b) => {
					if (a.value === value) return -1;
					if (b.value === value) return 1;
					return 0;
				})
			: options;

	// Navigation variant (original style for TopNavigation)
	if (variant === 'navigation') {
		return (
			<div
				ref={dropdownRef}
				className={cn('relative flex items-center justify-end px-5', className)}
			>
				{/* Trigger Button */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center gap-0.5 h-full"
				>
					<span className="text-right text-text-100 text-16 font-normal font-pretendard leading-normal">
						{selectedOption?.label || options[0]?.label}
					</span>
					<ChevronUpDownIcon direction={isOpen ? 'up' : 'down'} />
				</button>

				{/* Right Divider */}
				<VerticalDivider />

				{/* Dropdown Menu */}
				{isOpen && (
					<div className="absolute right-0 top-0 bg-bg-white shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150 flex flex-col">
						{sortedOptions.map((option) => {
							const isSelected = option.value === value;

							return (
								<button
									key={option.value}
									onClick={() =>
										isSelected ? setIsOpen(false) : handleSelect(option.value)
									}
									className={cn(
										'flex items-center justify-end gap-0.5 px-5 h-[70px]',
										'text-text-100 text-16 font-normal font-pretendard leading-normal',
										'transition-colors whitespace-nowrap',
										isSelected
											? 'bg-text-10'
											: 'hover:bg-bg-blue cursor-pointer',
									)}
								>
									<span className="text-right">{option.label}</span>
									{isSelected ? (
										<ChevronUpDownIcon direction="up" />
									) : (
										<div className="w-4 h-4" />
									)}
								</button>
							);
						})}
					</div>
				)}
			</div>
		);
	}

	// Default variant (new style for filters)
	return (
		<div ref={dropdownRef} className={cn('relative inline-block w-full', className)}>
			{/* Trigger Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					'relative h-10 w-full px-4',
					'flex items-center justify-between gap-2',
					'active:bg-text-10 bg-bg-white hover:bg-bg-gray rounded-lg',
					'outline outline-1 -outline-offset-1',
					'transition-colors',
					isOpen
						? 'outline-primary-70'
						: selectedOption && selectedOption.value !== 'all'
							? 'outline-primary-70'
							: 'outline-stroke-input hover:outline-text-40',
				)}
			>
				<span
					className={cn(
						'text-14 font-normal font-pretendard',
						selectedOption ? 'text-text-100' : 'text-text-30',
					)}
				>
					{displayText}
				</span>
				{isOpen ? (
					<img alt="Up" className="h-6 w-6" src={dropUpIcon} />
				) : (
					<img alt="Down" className="h-6 w-6" src={dropDownIcon} />
				)}
			</button>

			{/* Dropdown Menu - Separate Box */}
			{isOpen && (
				<div
					className={cn(
						'absolute bg-white left-0 overflow-hidden rounded-lg p-2 outline outline-1 -outline-offset-1 outline-stroke-input right-0 z-[51]',
						menuClassName,
					)}
					style={{ top: 'calc(100% + 6px)' }}
				>
					{options.map((option) => {
						const isSelected = option.value === value;
						return (
							<button
								key={option.value}
								type="button"
								onClick={() => handleSelect(option.value)}
								className={cn(
									'w-full h-8 px-3',
									'flex items-center gap-2',
									'text-14 font-normal font-pretendard text-text-100',
									'rounded transition-colors',
									isSelected ? 'bg-bg-blue' : 'bg-bg-white hover:bg-bg-gray',
								)}
							>
								{option.label}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default Dropdown;

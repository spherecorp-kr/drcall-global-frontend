import { useRef, useState } from 'react';
import dropUpIcon from '@/shared/assets/icons/btn_drop_up_grey.svg';
import dropDownIcon from '@/shared/assets/icons/btn_drop_down_grey.svg';
import btnReset from '@/assets/icons/btn_reset.svg';
import { cn } from '@/shared/utils/cn.ts';
import type { DropdownOption } from '@/shared/types/dropdown';
import { Checkbox } from '@/shared/components/ui';

interface DropdownCheckboxProps {
	className?: string;
	hasImage?: boolean;
	menuClassName?: string;
	options: DropdownOption[];
	text: string;
}

const DropdownCheckbox = ({
	className,
	hasImage = false,
	menuClassName,
	options,
	text,
}: DropdownCheckboxProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedValues, setSelectedValues] = useState<string[]>([]);
	const dcRef = useRef<HTMLDivElement>(null);

	const handleCheckboxChange = (value: string, checked: boolean) => {
		if (checked) {
			setSelectedValues((prev) => [...prev, value]);
		} else {
			setSelectedValues((prev) => prev.filter((v) => v !== value));
		}
	};

	const handleReset = () => {
		setSelectedValues([]);
	};

	return (
		<div ref={dcRef} className={cn('relative inline-block w-full', className)}>
			<button
				className={cn(
					'relative h-10 w-full px-4',
					'flex items-center justify-between gap-2',
					'active:bg-text-10 bg-bg-white hover:bg-bg-gray rounded',
					'outline outline-1 -outline-offset-1 transition-colors',
					isOpen ? 'outline-primary-70' : 'outline-stroke-input hover:outline-text-40',
				)}
				onClick={() => setIsOpen(!isOpen)}
				type="button"
			>
				<div className="flex gap-1 items-center justify-center">
					<span className="font-normal leading-normal text-base">{text}</span>
					{selectedValues.length > 0 && (
						<span className="bg-bg-blue font-normal leading-normal px-1.5 py-0.5 rounded-[0.625rem] text-primary-70 text-sm">
							{selectedValues.length}
						</span>
					)}
				</div>
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
						'absolute bg-white left-0',
						'outline outline-1 outline-stroke-input -outline-offset-1',
						'p-2 right-0 rounded-lg z-[51]',
						menuClassName,
					)}
					style={{ top: 'calc(100% + 6px)' }}
				>
					{options.length === 0 ? (
						<label>없음</label>
					) : (
						<div className="flex flex-col">
							<div className="flex flex-col gap-1 w-full">
								{options.map((option) => (
									<Checkbox
										checked={selectedValues.includes(option.value)}
										hasImage={hasImage}
										key={option.value}
										label={option.label}
										onChange={(e) =>
											handleCheckboxChange(option.value, e.target.checked)
										}
										value={option.value}
										wrapperClassName="active:bg-text-10 cursor-pointer h-10 hover:bg-bg-gray px-3 rounded-sm"
									/>
								))}
							</div>
							<div className="border-t border-t-stroke-segmented mx-3 mt-1 pb-1 pt-2">
								<button
									className="flex gap-2 items-center justify-start"
									onClick={handleReset}
									type="button"
								>
									<img alt="Reset" className="h-5 w-5" src={btnReset} />
									<span className="font-normal leading-normal text-sm text-text-40">
										초기화
									</span>
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default DropdownCheckbox;

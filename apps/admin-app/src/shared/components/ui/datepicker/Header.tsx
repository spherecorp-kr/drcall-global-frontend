import type { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import type { YearMonth } from '@/shared/types/common';
import { doubleDigit } from '@/shared/utils/commonScripts.ts';
import { Button } from '@/shared/components/ui';

type DatePickerHeaderProps = ReactDatePickerCustomHeaderProps & YearMonth;

const Header = ({
	decreaseMonth,
	increaseMonth,
	month,
	nextMonthButtonDisabled,
	prevMonthButtonDisabled,
	year,
}: DatePickerHeaderProps) => {
	return (
		<div className='flex gap-6 items-center justify-center mb-4'>
			<Button
				className='!bg-white h-5 px-0 w-5'
				disabled={prevMonthButtonDisabled}
				onClick={decreaseMonth}
				type='button'
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path
						d="M12 5L7 10L12 15"
						stroke={prevMonthButtonDisabled ? '#c1c1c1' : '#1f1f1f'}
						strokeLinecap="round"
						strokeWidth="2"
					/>
				</svg>
			</Button>
			<p className='font-semibold leading-[1.375rem] text-[1.375rem] text-text-100'>{doubleDigit(month)}/{year}</p>
			<Button
				className='!bg-white h-5 px-0 w-5'
				disabled={nextMonthButtonDisabled}
				onClick={increaseMonth}
				type='button'
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path
						d="M7 5L12 10L7 15"
						stroke={nextMonthButtonDisabled ? '#c1c1c1' : '#1f1f1f'}
						strokeLinecap="round"
						strokeWidth="2"
					/>
				</svg>
			</Button>
		</div>
	);
};

export default Header;
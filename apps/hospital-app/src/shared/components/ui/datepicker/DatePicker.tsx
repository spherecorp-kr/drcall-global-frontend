import React, { useCallback, useState } from 'react';
import '@/shared/styles/datepicker.css';
import ReactDatePicker from 'react-datepicker';
import { DatePickerHeader } from '@/shared/components/ui/datepicker';
import type { YearMonth } from '@/shared/types/common';
import { doubleDigit } from '@/shared/utils/commonScripts';
import { useTranslation } from 'react-i18next';

interface Props {
	dateStr: string;
	minDate?: Date;
	onDateChange: (dateStr: string) => void;
	onHeaderClick?: () => void;
}

const MAX_DATE: Date = (() => {
	const date = new Date();
	date.setDate(date.getDate() + 30);
	return date;
})();

const DatePicker = ({ dateStr, minDate = new Date(), onDateChange, onHeaderClick }: Props) => {
	const { t } = useTranslation();

	const [selectedDate, setSelectedDate] = useState<Date>(() => {
		const [day, month, year]: number[] = dateStr.split('/').map(Number);
		const date = new Date(year, month - 1, day);

		// 유효한 날짜인지 확인
		return isNaN(date.getTime()) ? new Date() : date;
	});

	const [yearMonth, setYearMonth] = useState<YearMonth>({
		year: selectedDate.getFullYear(),
		month: selectedDate.getMonth() + 1,
	});

	const filterDate = useCallback((date: Date) => {
		// 화면에 표시되는 달과 연도를 기준으로 다른 달의 날짜를 비활성화
		return date.getMonth() + 1 === yearMonth.month && date.getFullYear() === yearMonth.year;
	}, [yearMonth.month, yearMonth.year]);

	// 요일 이름
	const formatWeekDay = useCallback((nameOfDay: string) => {
		const day: string = nameOfDay.toLowerCase().substring(0, 3);
		return t(`calendar.week.${day}`);
	}, [t]);

	const handleChangeYearMonth = useCallback((date: Date) => {
		setYearMonth({
			year: date.getFullYear(),
			month: date.getMonth() + 1
		});
	}, []);

	const handleDateChange = useCallback((date: Date | null) => {
		if (date) {
			setSelectedDate(date);
			// 날짜를 dd/MM/yyyy 형식으로 변환할 때 현지 시간 기준으로 처리
			const year = date.getFullYear();
			const month = doubleDigit(date.getMonth() + 1);
			const day = doubleDigit(date.getDate());
			onDateChange(`${day}/${month}/${year}`);
		}
	}, [onDateChange]);

	return (
		<ReactDatePicker
			dateFormat='dd/MM/yyyy'
			disabledKeyboardNavigation
			filterDate={filterDate}
			formatWeekDay={formatWeekDay}
			inline
			maxDate={MAX_DATE}
			minDate={minDate}
			onChange={handleDateChange}
			onMonthChange={handleChangeYearMonth}
			onYearChange={handleChangeYearMonth}
			renderCustomHeader={(params: Parameters<NonNullable<React.ComponentProps<typeof ReactDatePicker>['renderCustomHeader']>>[0]) => <DatePickerHeader {...params} {...yearMonth} onDateClick={onHeaderClick} />}
			selected={selectedDate}
		/>
	);
};

export default DatePicker;
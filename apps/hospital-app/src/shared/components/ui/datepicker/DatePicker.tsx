import { useCallback, useState } from 'react';
import '@/shared/styles/datepicker.css';
import ReactDatePicker from 'react-datepicker';
import { DatePickerHeader } from '@/shared/components/ui/datepicker';
import type { YearMonth } from '@/shared/types/common';
import { doubleDigit } from '@/shared/utils/commonScripts';
import { useTranslation } from 'react-i18next';

interface Props {
	dateStr: string;
	onDateChange: (dateStr: string) => void;
}

const MAX_DATE: Date = (() => {
	const date = new Date();
	date.setDate(date.getDate() + 30);
	return date;
})();

const DatePicker = ({ dateStr, onDateChange }: Props) => {
	const { t } = useTranslation();

	const [selectedDate, setSelectedDate] = useState<Date>(() => {
		const [day, month, year]: number[] = dateStr.split('/').map(Number);
		const date = new Date(year, month - 1, day);

		// 유효한 날짜인지 확인
		return isNaN(date.getTime()) ? new Date() : date;
	});
	const [yearMonth, setYearMonth] = useState<YearMonth>(() => { // TODO 선택된 날짜로 기본값 설정
		const now = new Date();
		return {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
		};
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
			minDate={new Date()}
			onChange={handleDateChange}
			onMonthChange={handleChangeYearMonth}
			onYearChange={handleChangeYearMonth}
			renderCustomHeader={(params) => <DatePickerHeader {...params} {...yearMonth} />}
			selected={selectedDate}
		/>
	);
};

export default DatePicker;
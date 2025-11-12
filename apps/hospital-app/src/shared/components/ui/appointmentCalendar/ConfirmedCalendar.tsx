import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import btnArrowLeft from '@/assets/icons/btn_arrow_left.svg';
import btnArrowRight from '@/assets/icons/btn_arrow_right.svg';
import { Button, SegmentedControl } from '@/shared/components/ui';
import { doubleDigit, formatDDMMYYYY } from '@/shared/utils/commonScripts';
import { MILLI_SEC_PER_WEEK } from '@/shared/utils/constants';
import { cn } from '@/shared/utils/cn';
import { useDialog } from '@/shared/hooks/useDialog';

const APTMT_CLASSNAME: string = 'active:bg-bg-blue active:border-stroke-input bg-white border border-stroke-segmented cursor-pointer flex flex-col hover:bg-bg-gray px-4 py-2 rounded w-full';
const BORDER_LEFT: string = 'border-l border-l-stroke-input';
const CELL_CLASSNAME: string = 'flex-1 leading-[normal] py-[0.6875rem] text-base text-center text-text-70';
const MORE_CLASSNAME: string = 'active:bg-primary-50 active:text-white bg-white border border-primary-70 cursor-pointer flex font-semibold h-full hover:bg-bg-blue items-center leading-[normal] px-4 rounded text-primary-70 text-sm w-full';

interface WeeklyCalendarProps {
	searchDate: Date;
}

const WeeklyCalendar = ({ searchDate }: WeeklyCalendarProps) => {
	// 오늘 날짜 확인 함수
	const isToday = useCallback((date: Date): boolean => {
		const today = new Date();
		return (
			date.getFullYear() === today.getFullYear() &&
			date.getMonth() === today.getMonth() &&
			date.getDate() === today.getDate()
		);
	}, []);

	// 해당 주의 날짜들을 계산 (월요일부터 일요일까지)
	const weekDates = useMemo(() => {
		// 현재 날짜의 요일을 구함 (0: 일요일, 1: 월요일, ..., 6: 토요일)
		const currentDay = searchDate.getDay();

		// 해당 주의 월요일 구하기
		const monday = new Date(searchDate);
		monday.setDate(searchDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
		monday.setHours(0, 0, 0, 0);

		// 월요일부터 일요일까지 7일의 날짜 배열 생성
		const dates: Date[] = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(monday);
			date.setDate(monday.getDate() + i);
			dates.push(date);
		}

		return dates;
	}, [searchDate]);

	return (
		<div className="flex flex-1 items-center">
			{weekDates.map((date, i) => (
				<div
					key={`day-cell-${i}`}
					className={cn(
						'flex flex-1 flex-col gap-4 h-full min-h-[45.125rem] px-2 py-2.5',
						i > 0 && BORDER_LEFT
					)}
				>
					<span
						className={cn(
							'cursor-pointer font-semibold h-[1.875rem] p-[0.3125rem] text-base text-center w-[1.875rem]',
							isToday(date) ? 'bg-primary-70 rounded-full text-white' : 'text-text-50',
						)}
						style={{ lineHeight: 'normal' }}
					>
						{date.getDate()}
					</span>
					<div className="flex flex-1 flex-col gap-1 items-start">
						<div className={APTMT_CLASSNAME}>
							<p className="leading-[normal] text-sm text-text-70">
								환자 이름
							</p>
							<p className="leading-[normal] text-xs text-text-40">
								의사 이름
							</p>
							<p className="leading-[normal] text-xs text-text-100">
								HH:MM:SS
							</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

interface MonthlyCalendarProps {
	searchDate: Date;
}

const MoreDialogContents = ({ searchDate }: MonthlyCalendarProps) => {
	return (
		<div className='flex flex-col gap-[1.125rem]'>
			<div className='flex gap-7 items-center justify-center'>
				<img
					alt='arrow left'
					className='cursor-pointer h-6 w-6'
					src={btnArrowLeft}
				/>
				<span className='font-semibold leading-[normal] text-base text-text-100'>{formatDDMMYYYY(searchDate)}</span>
				<img
					alt='arrow right'
					className='cursor-pointer h-6 w-6'
					src={btnArrowRight}
				/>
			</div>
			<div className='flex flex-col gap-1 items-start'>
				<p className='font-semibold leading-[normal] text-sm text-text-100'>총 n건</p>
				<div className='flex flex-col gap-1 items-start max-h-[40rem] min-h-[26.25rem] overflow-auto w-full'>
					{Array.from({ length: 20 }).map((_, i) => (
						<div className={APTMT_CLASSNAME} key={i}>
							<p className="leading-[normal] text-sm text-text-70">
								환자 이름
							</p>
							<p className="leading-[normal] text-xs text-text-40">
								의사 이름
							</p>
							<p className="leading-[normal] text-xs text-text-100">
								HH:MM:SS
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

const MonthlyCalendar = ({ searchDate }: MonthlyCalendarProps) => {
	const { openDialog } = useDialog();

	// 오늘 날짜 확인 함수
	const isToday = useCallback((date: Date): boolean => {
		const today = new Date();
		return (
			date.getFullYear() === today.getFullYear() &&
			date.getMonth() === today.getMonth() &&
			date.getDate() === today.getDate()
		);
	}, []);

	// 해당 월이 현재 표시 중인 월인지 확인하는 함수
	const isCurrentMonth = useCallback((date: Date, targetMonth: number, targetYear: number): boolean => {
		return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
	}, []);

	// 월간 캘린더 날짜 배열 생성 (월요일부터 시작)
	const calendarWeeks = useMemo(() => {
		const year = searchDate.getFullYear();
		const month = searchDate.getMonth();

		// 해당 월의 첫 번째 날짜
		const firstDay = new Date(year, month, 1);

		firstDay.setHours(0, 0, 0, 0);
		// 해당 월의 마지막 날짜
		const lastDay = new Date(year, month + 1, 0);
		lastDay.setHours(0, 0, 0, 0);

		// 첫 번째 날짜의 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
		const firstDayOfWeek = firstDay.getDay();

		// 월요일부터 시작하도록 조정 (월요일이 0번째가 되도록)
		// 일요일(0) -> 6, 월요일(1) -> 0, 화요일(2) -> 1, ..., 토요일(6) -> 5
		const mondayOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

		// 캘린더의 시작 날짜 (해당 월의 첫 번째 월요일)
		const startDate = new Date(firstDay);
		startDate.setDate(firstDay.getDate() - mondayOffset);

		// 주 단위로 날짜 배열 생성
		const weeks: Date[][] = [];
		const currentDate = new Date(startDate);

		// 최대 6주까지 생성 (대부분의 월은 5주면 충분하지만, 일부는 6주 필요)
		// 마지막 주에 다음 달 날짜도 포함되도록 모든 주를 생성
		for (let week = 0; week < 6; week++) {
			// 주의 첫 번째 날짜(월요일)가 해당 월인지 확인
			const weekStartDate = new Date(currentDate);
			const weekStartMonth = weekStartDate.getMonth();
			const weekStartYear = weekStartDate.getFullYear();

			// 주의 첫 번째 날짜가 다음 달이면 해당 주는 생성하지 않음
			if (weekStartYear > year || (weekStartYear === year && weekStartMonth > month)) {
				break;
			}

			const weekDates: Date[] = [];

			// 한 주의 7일 생성 (월요일부터 일요일까지)
			for (let day = 0; day < 7; day++) {
				const date = new Date(currentDate);
				weekDates.push(date);
				currentDate.setDate(currentDate.getDate() + 1);
			}

			weeks.push(weekDates);
		}

		return weeks;
	}, [searchDate]);

	const showMore = useCallback((date: Date) => {
		console.log(date);
		openDialog({
			dialogClass: 'w-[36.25rem]',
			dialogContents: <MoreDialogContents searchDate={date} />,
			dialogId: `scheduleDialog`,
			dialogTitle: '예약 확정 목록',
			hasCloseButton: true,
		});
	}, [openDialog]);

	return (
		<div className="flex flex-1 flex-col">
			{calendarWeeks.map((week, weekIndex) => (
				<div
					key={`week-${weekIndex}`}
					className={cn(
						'flex flex-1 items-start',
						weekIndex > 0 && 'border-t border-t-stroke-input',
					)}
				>
					{week.map((date, dayIndex) => {
						const isCurrentMonthDate = isCurrentMonth(date, searchDate.getMonth(), searchDate.getFullYear());

						return (
							<div
								key={`day-${weekIndex}-${dayIndex}`}
								className={cn(
									'flex flex-1 flex-col gap-4 h-[16.625rem] px-2 py-2.5',
									isCurrentMonthDate ? 'bg-white' : 'bg-bg-disabled',
									dayIndex > 0 && BORDER_LEFT,
								)}
							>
								<span
									className={cn(
										'cursor-pointer font-semibold h-[1.875rem] p-[0.3125rem] text-base text-center w-[1.875rem]',
										isToday(date)
											? 'bg-primary-70 rounded-full text-white'
											: isCurrentMonthDate
												? 'text-text-50'
												: 'text-text-20',
									)}
									onClick={() => showMore(date)}
									style={{ lineHeight: 'normal' }}
								>
									{date.getDate()}
								</span>
								{isCurrentMonthDate && (
									<div className="flex flex-1 flex-col gap-1 items-start">
										<div className={APTMT_CLASSNAME}>
											<p className="leading-[normal] text-sm text-text-70">
												환자 이름
											</p>
											<p className="leading-[normal] text-xs text-text-40">
												의사 이름
											</p>
											<p className="leading-[normal] text-xs text-text-100">
												HH:MM:SS
											</p>
										</div>
										<div className={APTMT_CLASSNAME}>
											<p className="leading-[normal] text-sm text-text-70">
												환자 이름
											</p>
											<p className="leading-[normal] text-xs text-text-40">
												의사 이름
											</p>
											<p className="leading-[normal] text-xs text-text-100">
												HH:MM:SS
											</p>
										</div>
										<div className={MORE_CLASSNAME} onClick={() => showMore(date)}>+4개 더 보기</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}

const ConfirmedCalendar = () => {
	const { t } = useTranslation();

	const [searchDate, setSearchDate] = useState<Date>(new Date());

	const [viewMode, setViewMode] = useState('weekly');

	const handleArrowLeftClick = useCallback(() => {
		if (viewMode === 'weekly') {
			setSearchDate(prev => new Date(prev.getTime() - MILLI_SEC_PER_WEEK));
		} else if (viewMode === 'monthly') {
			setSearchDate(prev => {
				const year = prev.getFullYear();
				const prevMonth = prev.getMonth() - 1;
				if (prevMonth < 0) {
					return new Date(year - 1, 11, 1);
				} else {
					return new Date(year, prevMonth, 1);
				}
			});
		}
	}, [viewMode]);

	const handleArrowRightClick = useCallback(() => {
		if (viewMode === 'weekly') {
			setSearchDate(prev => new Date(prev.getTime() + MILLI_SEC_PER_WEEK));
		} else if (viewMode === 'monthly') {
			setSearchDate(prev => {
				const year = prev.getFullYear();
				const nextMonth = (prev.getMonth() + 1) % 12;
				if (nextMonth === 0) {
					return new Date(year + 1, 0, 1);
				} else {
					return new Date(year, nextMonth, 1);
				}
			});
		}
	}, [viewMode]);

	const handleViewModeChange = useCallback((value: string) => {
		setSearchDate(new Date());
		setViewMode(value);
	}, []);

	const viewOptions = useMemo(() => [
		{ value: 'weekly', label: t('phr.lbl.weekly') },
		{ value: 'monthly', label: t('phr.lbl.monthly') },
	], [t]);

	return (
		<div className="bg-white border border-stroke-input flex flex-1 flex-col overflow-auto rounded-t-[0.625rem]">
			<div className="border-b border-stroke-input flex items-center justify-between px-5 py-4">
				<Button onClick={() => setSearchDate(new Date())} variant="ghost">Today</Button>
				<div className="flex items-center gap-7">
					<img
						alt='arrow left'
						className='cursor-pointer h-7 w-7'
						onClick={handleArrowLeftClick}
						src={btnArrowLeft}
					/>
					<h2 className="font-medium leading-[normal] text-[1.75rem] text-text-100">
						{doubleDigit(searchDate.getMonth() + 1)}/{searchDate.getFullYear()}
					</h2>
					<img
						alt='arrow right'
						className='cursor-pointer h-7 w-7'
						onClick={handleArrowRightClick}
						src={btnArrowRight}
					/>
				</div>
				<SegmentedControl
					className="h-[2.5rem] p-px rounded w-40"
					onChange={handleViewModeChange}
					options={viewOptions}
					value={viewMode}
				/>
			</div>
			<div className="flex flex-1 flex-col">
				<div className="border-b border-b-stroke-input flex items-center">
					<span className={CELL_CLASSNAME}>{t('calendar.week.mon')}</span>
					<span className={`${BORDER_LEFT} ${CELL_CLASSNAME}`}>{t('calendar.week.tue')}</span>
					<span className={`${BORDER_LEFT} ${CELL_CLASSNAME}`}>{t('calendar.week.wed')}</span>
					<span className={`${BORDER_LEFT} ${CELL_CLASSNAME}`}>{t('calendar.week.thu')}</span>
					<span className={`${BORDER_LEFT} ${CELL_CLASSNAME}`}>{t('calendar.week.fri')}</span>
					<span className={`${BORDER_LEFT} ${CELL_CLASSNAME}`}>{t('calendar.week.sat')}</span>
					<span className={`${BORDER_LEFT} ${CELL_CLASSNAME}`}>{t('calendar.week.sun')}</span>
				</div>
				{viewMode === 'weekly'
					? <WeeklyCalendar searchDate={searchDate} />
					: viewMode === 'monthly' && <MonthlyCalendar searchDate={searchDate} />
				}
			</div>
		</div>
	);
};

export default ConfirmedCalendar;
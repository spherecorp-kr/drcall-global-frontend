import React, { useCallback, useRef, useState, memo } from 'react';
import { cn } from '@/shared/utils/cn.ts';
import { useTranslation } from 'react-i18next';
import { doubleDigit } from '@/shared/utils/commonScripts.ts';
import type { TimeSlotDto } from '@/shared/types/doctor.ts';

// --- Types & Constants ---

interface AvailableScheduleDto {
	mon?: TimeSlotDto[];
	tue?: TimeSlotDto[];
	wed?: TimeSlotDto[];
	thu?: TimeSlotDto[];
	fri?: TimeSlotDto[];
	sat?: TimeSlotDto[];
	sun?: TimeSlotDto[];
}

// Mock data - 실제로는 API에서 가져와야 함
const doctor = {
	id: '1',
	name: 'Lorem Ipsum',
	englishName: 'WittayaWanpen',
	userId: 'asdf123',
	email: 'example@email.com',
	isActive: true,
	profileImage: '/src/shared/assets/icons/img_blank_profile.svg',
	introduction: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
	experience: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
	availableSchedule: {
		mon: [
			{ startTime: '09:00', endTime: '12:00' },
			{ startTime: '18:00', endTime: '20:00' },
		],
		tue: [{ startTime: '09:00', endTime: '12:00' }],
		wed: [
			{ startTime: '12:00', endTime: '13:00' },
			{ startTime: '18:00', endTime: '19:00' },
		],
		thu: [
			{ startTime: '09:00', endTime: '12:00' },
			{ startTime: '13:00', endTime: '14:00' },
		],
		fri: [
			{ startTime: '13:00', endTime: '14:00' },
			{ startTime: '15:00', endTime: '16:00' },
		],
		sat: [{ startTime: '10:00', endTime: '12:00' }],
		sun: [],
	} as AvailableScheduleDto
};

type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// 시간표에 표시할 시간 범위 (6:00 ~ 5:00 다음날)
const HOURS: number[] = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5];
const WEEKDAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// 시간 문자열을 분 단위로 변환
function timeToMinutes(time: string): number {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes;
}

// 해당 셀이 속한 슬롯 찾기
const findSlotForCell = (day: DayOfWeek, currentMinutes: number): { slot: TimeSlotDto; index: number } | null => {
	const slots = doctor.availableSchedule[day] || [];
	for (let i = 0; i < slots.length; i++) {
		const slot = slots[i];
		const startMinutes = timeToMinutes(slot.startTime);
		const endMinutes = timeToMinutes(slot.endTime);
		if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
			return { slot, index: i };
		}
	}
	return null;
};

// --- Sub Components ---

const ScheduleHeader = memo(() => {
	const { t } = useTranslation();
	return (
		<div className='bg-white px-5'>
			<div className='grid grid-cols-[60px_repeat(7,1fr)]'>
				<div className="h-6 border-b border-stroke-input" />
				{WEEKDAYS.map((weekday) => (
					<div key={weekday}
						 className={cn(
							 'border-b border-b-stroke-input',
							 'flex h-6 items-center justify-center leading-[normal]',
							 'text-sm text-text-100 transition-colors',
							 weekday === 'sat' && 'text-[#3076df]',
							 weekday === 'sun' && 'text-system-error',
						 )}
					>{t(`calendar.week.${weekday}`)}</div>
				))}
			</div>
		</div>
	);
});

interface TimeCellProps {
	hour: number;
}

const TimeCell = memo(({ hour }: TimeCellProps) => (
	<div
		className={cn(
			'bg-white border-b border-r border-stroke-input cursor-default',
			'flex items-center justify-center leading-[normal]',
			'px-3 py-2.5 row-span-2',
			'text-sm text-text-100 transition-colors',
		)}
	>
		{doubleDigit(hour)}:00
	</div>
));

interface SlotCellProps {
	day: DayOfWeek;
	hour: number;
	minute: number;
	isEvenRow: boolean;
	hoveredSlot: string | null;
	onMouseEnter: (slotKey: string | null, content: string) => void;
	onMouseLeave: () => void;
}

const SlotCell = memo(({ day, hour, minute, isEvenRow, hoveredSlot, onMouseEnter, onMouseLeave }: SlotCellProps) => {
	const { t } = useTranslation();
	const currentMinutes = hour * 60 + minute;
	const slotInfo = findSlotForCell(day, currentMinutes);
	const isAvailable = slotInfo !== null;
	const slotKey = isAvailable ? `${day}-${slotInfo.index}` : null;
	const isHovered = slotKey === hoveredSlot;
	
	const handleMouseEnter = () => {
		const content = isAvailable && slotInfo
			? `${t(`calendar.week.${day}`)} : ${slotInfo.slot.startTime} ~ ${slotInfo.slot.endTime}`
			: '';
		onMouseEnter(slotKey, content);
	};

	return (
		<div
			onMouseEnter={handleMouseEnter}
			onMouseLeave={onMouseLeave}
			className={cn(
				'px-3 py-2.5 border-b border-r border-stroke-input transition-colors',
				isAvailable
					? isHovered
						? 'bg-primary-50 cursor-pointer'
						: 'bg-primary-30 cursor-pointer'
					: isEvenRow
						? 'bg-bg-white hover:bg-bg-gray'
						: 'bg-bg-gray hover:bg-[#F5F5F5]',
			)}
		/>
	);
});

interface ScheduleTooltipProps {
	content: string;
	tooltipRef: React.RefObject<HTMLDivElement | null>;
}

const ScheduleTooltip = memo(({ content, tooltipRef }: ScheduleTooltipProps) => {
	if (!content) return null;
	
	return (
		<div
			ref={tooltipRef}
			style={{
				position: 'fixed',
				left: '0px',
				top: '0px',
				zIndex: 9999,
			}}
			className="w-auto rounded-[10px] bg-tap-1 p-4 shadow-lg pointer-events-none"
		>
			<div className="w-full text-text-0 text-16 font-pretendard font-normal leading-[24px] whitespace-nowrap">
				{content}
			</div>
		</div>
	);
});

// --- Main Component ---

const ScheduleTimeTable = () => {
	const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
	const [tooltipContent, setTooltipContent] = useState<string>('');

	const scheduleContainerRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const handleCellMouseEnter = useCallback((slotKey: string | null, content: string) => {
		if (slotKey) {
			setHoveredSlot(slotKey);
			setTooltipContent(content);
		}
	}, []);

	const handleCellMouseLeave = useCallback(() => {
		setHoveredSlot(null);
		setTooltipContent('');
	}, []);

	const handleTableMouseMove = useCallback((e: React.MouseEvent) => {
		if (hoveredSlot && tooltipRef.current) {
			tooltipRef.current.style.left = `${e.clientX + 10}px`;
			tooltipRef.current.style.top = `${e.clientY + 10}px`;
		}
	}, [hoveredSlot]);

	return (
		<div
			className='bg-white border border-stroke-input flex-1 min-h-0 overflow-auto rounded-[0.625rem]'
			ref={scheduleContainerRef}
			onMouseMove={handleTableMouseMove}
		>
			<ScheduleHeader />

			{/* 본문 그리드 */}
			<div className="pb-5 px-5">
				<div className="grid grid-cols-[60px_repeat(7,1fr)]">
					{HOURS.map((hour, hourIndex) => {
						const isEvenRow = hourIndex % 2 === 0;
						return (
							<React.Fragment key={hour}>
								{/* 시간 셀 (2개 row 병합) */}
								<TimeCell hour={hour} />

								{/* 00분~30분 셀들 */}
								{WEEKDAYS.map((day) => (
									<SlotCell
										key={`${day}-${hour}-00`}
										day={day}
										hour={hour}
										minute={0}
										isEvenRow={isEvenRow}
										hoveredSlot={hoveredSlot}
										onMouseEnter={handleCellMouseEnter}
										onMouseLeave={handleCellMouseLeave}
									/>
								))}

								{/* 30분~60분 셀들 */}
								{WEEKDAYS.map((day) => (
									<SlotCell
										key={`${day}-${hour}-30`}
										day={day}
										hour={hour}
										minute={30}
										isEvenRow={isEvenRow}
										hoveredSlot={hoveredSlot}
										onMouseEnter={handleCellMouseEnter}
										onMouseLeave={handleCellMouseLeave}
									/>
								))}
							</React.Fragment>
						);
					})}
				</div>
			</div>

			<ScheduleTooltip content={tooltipContent} tooltipRef={tooltipRef} />
		</div>
	);
};

export default ScheduleTimeTable;
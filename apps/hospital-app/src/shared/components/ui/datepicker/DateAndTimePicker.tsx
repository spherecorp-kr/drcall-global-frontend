import { useCallback, useState } from 'react';
import { DatePicker, TimePicker } from '@/shared/components/ui/datepicker';
import type { AppointmentType, DoctorSchedule } from '@/shared/types/appointment';
import { doubleDigit } from '@/shared/utils/commonScripts';
import { useEffectAfterMount } from '@/shared/hooks/useEffectAfterMount';

interface Props {
	appointmentType?: AppointmentType;
	dateStr?: string;
	doctorkey?: number;
	onDateTimeChange: (date: string, time?: string) => void;
}

const TIMES: DoctorSchedule[] = [
	{ displayTime: '08:01~08:15', time: '08:01' },
	{ displayTime: '08:16~08:30', time: '08:16' },
	{ displayTime: '08:31~08:45', time: '08:31' },
	{ displayTime: '08:46~09:00', time: '08:46' },
	{ displayTime: '09:01~09:15', time: '09:01' },
]

const DateAndTimePicker = ({
	appointmentType,
	dateStr,
	doctorkey = 0,
	onDateTimeChange,
}: Props) => {
	const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
		if (dateStr) return dateStr;

		const today = new Date();
		return `${doubleDigit(today.getDate())}/${doubleDigit(today.getMonth() + 1)}/${today.getFullYear()}`;
	});

	const handleDateChange = useCallback((newDateStr: string) => {
		setSelectedDateStr(newDateStr);
		onDateTimeChange(newDateStr);
	}, [onDateTimeChange]);

	const handleTimeSelect = useCallback((time: string) => {
		onDateTimeChange(selectedDateStr, time);
	}, [selectedDateStr, onDateTimeChange]);

	useEffectAfterMount(() => {
		console.log(doctorkey);
	}, [doctorkey]);

	return (
		<div className='flex flex-col gap-5 w-full'>
			{appointmentType === 'aptmt' && (
				<div className='bg-bg-disabled p-5'>
					<p className='font-medium leading-[normal] text-base text-text-100'>환자가 예약한 정보 :</p>
					<ul>
						<li className='font-normal leading-[normal] text-base text-text-50'>&middot;&nbsp;의사 : Dr.Wittaya Wanpen</li>
						<li className='font-normal leading-[normal] text-base text-text-50'>&middot;&nbsp;진료 날짜 : 23/11/2025</li>
						<li className='font-normal leading-[normal] text-base text-text-50'>&middot;&nbsp;진료 시간 : 11:00~12:00</li>
					</ul>
				</div>
			)}
			<DatePicker dateStr={selectedDateStr} onDateChange={handleDateChange} />
			<div className='bg-[#e0e0e0] h-px' />
			<TimePicker
				dateStr={selectedDateStr}
				onTimeSelect={handleTimeSelect}
				times={TIMES}
			/>
		</div>
	);
};

export default DateAndTimePicker;
import { Dropdown } from '@/shared/components/ui';
import type { DropdownOption } from '@/shared/types/dropdown';
import { useCallback, useState } from 'react';
import { DateAndTimePicker } from '@/shared/components/ui/datepicker';
import { useEffectAfterMount } from '@/shared/hooks/useEffectAfterMount';

const doctorOptions: DropdownOption[] = [
	{
		label: (
			<div className='flex flex-col items-start justify-center'>
				<span className='font-normal leading-[normal] text-sm text-text-100'>Dr.KR</span>
				<span className='capitalize font-medium leading-[normal] text-text-40 text-xs'>(Expert : Specialist In Psychiatry)</span>
			</div>
		),
		value: '1'
	},
	{
		label: (
			<div className='flex flex-col items-start justify-center'>
				<span className='font-normal leading-[normal] text-sm text-text-100'>Dr.의사양반</span>
				<span className='capitalize font-medium leading-[normal] text-text-40 text-xs'>(Expert : Specialist In Psychiatry)</span>
			</div>
		),
		value: '2'
	}
];

const Separator = () => <div className='bg-stroke-input h-px w-full' />

const ReAppointmentDialog = () => {
	const [doctor, setDoctor] = useState<string>();
	const [dateTimeChanged, setDateTimeChanged] = useState<boolean>(false);
	const [doctorDropdownOutline, setDoctorDropdownOutline] = useState<string>('outline-stroke-input');

	const handleDateTimeChange = useCallback((date: string, time?: string) => {
		setDateTimeChanged(!!(date && time));
	}, []);

	const handleDoctorChange = useCallback((value: string) => {
		setDoctor(value);
		setDoctorDropdownOutline('outline-stroke-input');
	}, []);

	useEffectAfterMount(() => {
		console.log(dateTimeChanged);
	}, [dateTimeChanged]);

	return (
		<div className='flex flex-col gap-5 items-start'>
			<div className='flex flex-col gap-5 items-start w-full'>
				<p className='font-bold leading-[normal] text-text-100 text-xl'>의사 선택</p>
				<Dropdown
					buttonClassName={doctorDropdownOutline}
					className="flex-1"
					menuClassName="max-h-[13.5rem]"
					onChange={handleDoctorChange}
					optionClassName="h-10 rounded-sm"
					options={doctorOptions}
					placeholder="의사를 선택해주세요."
					value={doctor}
				/>
			</div>
			<Separator />
			<div className='flex flex-col w-full'>
				<p className='font-bold leading-[normal] mb-4 text-text-100 text-xl'>진료 희망 날짜 & 시간 선택</p>
				<DateAndTimePicker onDateTimeChange={handleDateTimeChange} />
			</div>
		</div>
	);
};

export default ReAppointmentDialog;
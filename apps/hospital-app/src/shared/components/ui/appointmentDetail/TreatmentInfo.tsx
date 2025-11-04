import { useCallback, useMemo, useState } from 'react';
import { Dropdown, Input } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import type { DropdownOption } from '@/shared/types/dropdown';
import reactIcon from '@/assets/react.svg';
import { useDialog } from '@/shared/hooks/useDialog';
import { DoubleDialogBottomButton } from '@/shared/components/ui/dialog';
import { DateAndTimePicker } from '@/shared/components/ui/datepicker';
import type { BottomButtonProps } from '@/shared/types/dialog.ts';
import { useEffectAfterMount } from '@/shared/hooks/useEffectAfterMount.ts';

const TH_CLASS: string = 'font-normal leading-normal min-w-[12.5rem] text-base text-text-70';
const TEXTAREA_CLASS: string = 'border border-stroke-input flex-1 font-normal leading-normal px-4 py-2.5 resize-none rounded text-base text-text-100';

interface EditIconProps {
	doctorSelected: boolean;
	handleClick: () => void;
}

const EditIcon = ({ doctorSelected, handleClick }: EditIconProps) => {
	return (
		<div className={cn('mr-4', doctorSelected ? 'cursor-pointer' : 'cursor-not-allowed')} onClick={handleClick}>
			<svg
				fill="none"
				height="24"
				viewBox="0 0 24 24"
				width="24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M10.5859 3.65234H3C1.89543 3.65234 1 4.54777 1 5.65234V20.8241C1 21.9286 1.89543 22.8241 3 22.8241H17.4049C18.5094 22.8241 19.4049 21.9286 19.4049 20.8241V12.4713"
					stroke={doctorSelected ? '#00a0d2' : '#c1c1c1'}
					strokeLinecap="round"
					strokeWidth="2"
				/>
				<path
					d="M19.0429 1.29304C19.4334 0.902519 20.0666 0.90252 20.4571 1.29304L22.2964 3.13238C22.687 3.5229 22.687 4.15607 22.2964 4.54659L10.7457 16.0973C10.6061 16.2369 10.4283 16.3321 10.2347 16.3708L7.93554 16.8306C7.23582 16.9706 6.6189 16.3537 6.75884 15.6539L7.21868 13.3548C7.2574 13.1612 7.35255 12.9834 7.49215 12.8438L19.0429 1.29304Z"
					stroke={doctorSelected ? '#00a0d2' : '#c1c1c1'}
					strokeWidth="2"
				/>
			</svg>
		</div>
	);
};

const TreatmentInfo = () => {
	const { closeDialog, openDialog } = useDialog();

	const [doctor, setDoctor] = useState<string>();
	const [doctorSelected, setDoctorSelected] = useState<boolean>(false);
	const [dateTimeChanged, setDateTimeChanged] = useState<boolean>(false);

	const doctorOptions: DropdownOption[] = useMemo(() => [
		{ label: '의사1', value: '1' },
		{ label: '의사2', value: '2' },
	], []);

	const handleDateTimeChange = useCallback((date: string, time?: string) => {
		setDateTimeChanged(!!(date && time));
	}, []);

	// 다이얼로그 하단 버튼 설정
	const actions = useMemo((): BottomButtonProps[] => [
		{
			disabled: false,
			onClick: () => closeDialog('selectDateTimeDialog'),
			text: '취소'
		},
		{
			disabled: !dateTimeChanged,
			onClick: () => closeDialog('selectDateTimeDialog'),
			text: '변경 완료'
		}
	], [closeDialog, dateTimeChanged]);

	const openSelectDateTimeDialog = useCallback(() => {
		openDialog({
			dialogButtons: <DoubleDialogBottomButton actions={actions} />,
			dialogClass: 'w-[36.25rem]',
			dialogContents: <DateAndTimePicker onDateTimeChange={handleDateTimeChange} />,
			dialogId: 'selectDateTimeDialog',
			dialogTitle: '진료 일시 변경',
		});
	}, [actions, handleDateTimeChange, openDialog]);

	// 진료 일시 아이콘 클릭 이벤트
	const handleEditIconClick = useCallback(() => {
		if (!doctorSelected) {
			return;
		}

		openSelectDateTimeDialog();
	}, [doctorSelected, openSelectDateTimeDialog]);

	const handleDoctorChange = useCallback((value: string) => {
		setDoctor(value);
		setDoctorSelected(true);
	}, []);

	useEffectAfterMount(() => {
		if (dateTimeChanged){
			openSelectDateTimeDialog();
		}
	}, [dateTimeChanged]);

	return (
		<div className='flex flex-col gap-2.5'>
			<h2 className='font-semibold leading-normal text-text-100 text-xl'>진료 정보</h2>
			<div className='bg-white border border-stroke-input p-5 rounded-[0.625rem]'>
				<div className="flex gap-5 items-start self-stretch">
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>의사</p>
							<Dropdown
								className='flex-1'
								onChange={handleDoctorChange}
								options={doctorOptions}
								placeholder='의사를 선택해주세요.'
								value={doctor}
							/>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>증상</p>
							<textarea className={TEXTAREA_CLASS} disabled></textarea>
						</div>
					</div>
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>진료 희망 일시</p>
							<Input
								className='cursor-default px-0'
								icon={<EditIcon doctorSelected={doctorSelected} handleClick={handleEditIconClick} />}
								placeholder='의사를 먼저 선택해주세요.'
								readOnly
								wrapperClassName='rounded'
							/>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>증상 이미지</p>
							<div className='flex gap-3 h-20 items-center w-full'>
								<button className='h-7 w-7'>
									<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
										<path d="M24 0.5H4C2.067 0.5 0.5 2.067 0.5 4V24C0.5 25.933 2.067 27.5 4 27.5H24C25.933 27.5 27.5 25.933 27.5 24V4C27.5 2.067 25.933 0.5 24 0.5Z" fill="white" stroke="#E0E0E0"/>
										<path d="M16.3359 21.2031L9.74195 14.2116L16.3359 7.22002" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</button>
								<div className='flex gap-2 items-center overflow-x-hidden'>
									<img alt='sample' className='bg-black border border-stroke-input h-20 rounded-sm w-20' src={reactIcon} />
									<img alt='sample' className='bg-black border border-stroke-input h-20 rounded-sm w-20' src={reactIcon} />
									<img alt='sample' className='bg-black border border-stroke-input h-20 rounded-sm w-20' src={reactIcon} />
									<img alt='sample' className='bg-black border border-stroke-input h-20 rounded-sm w-20' src={reactIcon} />
									<img alt='sample' className='bg-black border border-stroke-input h-20 rounded-sm w-20' src={reactIcon} />
									<img alt='sample' className='bg-black border border-stroke-input h-20 rounded-sm w-20' src={reactIcon} />
								</div>
								<button className='h-7 w-7'>
									<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
										<path d="M24 0.5H4C2.067 0.5 0.5 2.067 0.5 4V24C0.5 25.933 2.067 27.5 4 27.5H24C25.933 27.5 27.5 25.933 27.5 24V4C27.5 2.067 25.933 0.5 24 0.5Z" fill="white" stroke="#E0E0E0"/>
										<path d="M11.6641 21.2031L18.2581 14.2116L11.6641 7.22002" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TreatmentInfo;
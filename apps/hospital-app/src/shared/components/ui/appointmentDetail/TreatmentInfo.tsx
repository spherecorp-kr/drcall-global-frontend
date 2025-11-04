import { useCallback, useMemo, useRef, useState } from 'react';
import { Dropdown, ImageViewer, Input } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import type { DropdownOption } from '@/shared/types/dropdown';
import reactIcon from '@/assets/react.svg';
import { useDialog } from '@/shared/hooks/useDialog';
import { DoubleDialogBottomButton } from '@/shared/components/ui/dialog';
import { DateAndTimePicker } from '@/shared/components/ui/datepicker';
import type { BottomButtonProps } from '@/shared/types/dialog';
import { useEffectAfterMount } from '@/shared/hooks/useEffectAfterMount';

const TH_CLASS: string = 'font-normal leading-normal min-w-[12.5rem] text-base text-text-70';
const TEXTAREA_CLASS: string = 'border border-stroke-input flex-1 font-normal leading-normal px-4 py-2.5 resize-none rounded text-base text-text-100';

const doctorOptions: DropdownOption[] = [
	{
		label: (
			<div className='flex flex-col items-start justify-center'>
				<span className='font-normal text-sm text-text-100'>Dr.KR</span>
				<span className='capitalize font-medium text-text-40 text-xs'>(Expert : Specialist In Psychiatry)</span>
			</div>
		),
		value: '1'
	},
	{
		label: (
			<div className='flex flex-col items-start justify-center'>
				<span className='font-normal text-sm text-text-100'>Dr.의사양반</span>
				<span className='capitalize font-medium text-text-40 text-xs'>(Expert : Specialist In Psychiatry)</span>
			</div>
		),
		value: '2'
	}
];

interface CalendarIconProps {
	doctorSelected: boolean;
	handleClick: () => void;
}

// 캘린더 아이콘
const CalendarIcon = ({ doctorSelected, handleClick }: CalendarIconProps) => {
	return (
		<div
			className={cn('mr-4', doctorSelected ? 'cursor-pointer' : 'cursor-not-allowed')}
			onClick={handleClick}
		>
			<svg
				fill="none"
				height="24"
				viewBox="0 0 24 24"
				width="24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M8 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002V8M8 4H16M8 4V2M16 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V8M16 4V2M4 8V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V8M4 8H20M16 16H16.002L16.002 16.002L16 16.002V16ZM12 16H12.002L12.002 16.002L12 16.002V16ZM8 16H8.002L8.00195 16.002L8 16.002V16ZM16.002 12V12.002L16 12.002V12H16.002ZM12 12H12.002L12.002 12.002L12 12.002V12ZM8 12H8.002L8.00195 12.002L8 12.002V12Z"
					stroke={doctorSelected ? '#00a0d2' : '#c1c1c1'}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
				/>
			</svg>
		</div>
	);
};

// 왼쪽으로 슬라이드 아이콘
const SlideLeftIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
		<path d="M24 0.5H4C2.067 0.5 0.5 2.067 0.5 4V24C0.5 25.933 2.067 27.5 4 27.5H24C25.933 27.5 27.5 25.933 27.5 24V4C27.5 2.067 25.933 0.5 24 0.5Z" fill="white" stroke="#E0E0E0"/>
		<path d="M16.3359 21.2031L9.74195 14.2116L16.3359 7.22002" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

// 오른쪽으로 슬라이드 아이콘
const SlideRightIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
		<path d="M24 0.5H4C2.067 0.5 0.5 2.067 0.5 4V24C0.5 25.933 2.067 27.5 4 27.5H24C25.933 27.5 27.5 25.933 27.5 24V4C27.5 2.067 25.933 0.5 24 0.5Z" fill="white" stroke="#E0E0E0"/>
		<path d="M11.6641 21.2031L18.2581 14.2116L11.6641 7.22002" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

const TreatmentInfo = () => {
	const { closeDialog, openDialog } = useDialog();
	const imageScrollRef = useRef<HTMLDivElement>(null);

	const [doctor, setDoctor] = useState<string>();
	const [doctorSelected, setDoctorSelected] = useState<boolean>(false);
	const [dateTimeChanged, setDateTimeChanged] = useState<boolean>(false);

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
	const handleCalendarIconClick = useCallback(() => {
		if (!doctorSelected) {
			return;
		}

		openSelectDateTimeDialog();
	}, [doctorSelected, openSelectDateTimeDialog]);

	const handleDoctorChange = useCallback((value: string) => {
		setDoctor(value);
		setDoctorSelected(true);
	}, []);

	// 이미지 슬라이드 핸들러
	const handleSlideLeft = useCallback(() => {
		if (imageScrollRef.current) {
			const scrollAmount = 88; // 이미지 너비(80px) + gap(8px) = 88px
			imageScrollRef.current.scrollBy({ behavior: 'smooth', left: -scrollAmount });
		}
	}, []);

	const handleSlideRight = useCallback(() => {
		if (imageScrollRef.current) {
			const scrollAmount = 88; // 이미지 너비(80px) + gap(8px) = 88px
			imageScrollRef.current.scrollBy({ behavior: 'smooth', left: scrollAmount });
		}
	}, []);

	// 증상 이미지 클릭 핸들러 (다이얼로그 열기)
	const handleSymptomImageClick = useCallback((imageIndex: number) => {
		// TODO: 다이얼로그 열기 및 이미지 크게 보기
		console.log('이미지 클릭:', imageIndex);
		openDialog({
			dialogClass: 'w-[36.25rem]',
			dialogContents: <ImageViewer images={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']} initialIndex={imageIndex} />,
			dialogId: 'symptomImageDialog',
			dialogIdForClose: 'symptomImageDialog',
			dialogTitle: '증상 이미지'
		});
	}, [openDialog]);

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
								menuClassName='max-h-[13.5rem]'
								onChange={handleDoctorChange}
								optionClassName='h-10 rounded-sm'
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
								icon={<CalendarIcon doctorSelected={doctorSelected} handleClick={handleCalendarIconClick} />}
								placeholder='진료 희망 일시를 선택해주세요.'
								readOnly
								wrapperClassName='rounded'
							/>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>증상 이미지</p>
							<div className='flex gap-3 h-20 items-center w-full'>
								<button className='h-7 w-7' onClick={handleSlideLeft} type='button'>
									<SlideLeftIcon />
								</button>
								<div
									className='flex flex-1 gap-2 items-center overflow-x-hidden'
									ref={imageScrollRef}
								>
									{Array.from({ length: 10 }, (_, i) => (
										<img
											alt='sample'
											className='bg-black border border-stroke-input cursor-pointer h-20 rounded-sm w-20'
											key={i}
											onClick={() => handleSymptomImageClick(i)}
											src={reactIcon}
										/>
									))}
								</div>
								<button className='h-7 w-7' onClick={handleSlideRight} type='button'>
									<SlideRightIcon />
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
import { useCallback, useMemo, useState } from 'react';
import { Dropdown, Input } from '@/shared/components/ui';
import { CalendarIcon } from '@/shared/components/ui/icon';
import type { DropdownOption } from '@/shared/types/dropdown';
import { useDialog } from '@/shared/hooks/useDialog';
import { DoubleDialogBottomButton, SingleDialogBottomButton } from '@/shared/components/ui/dialog';
import { DateAndTimePicker } from '@/shared/components/ui/datepicker';
import type { BottomButtonProps } from '@/shared/types/dialog';
import { useEffectAfterMount } from '@/shared/hooks/useEffectAfterMount';
import { SymptomImages } from '@/shared/components/ui/appointmentDetail';
import { useTranslation } from 'react-i18next';

const TH_CLASS: string = 'font-normal leading-[normal] min-w-[12.5rem] text-base text-text-70';

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

const EditableTreatmentInfo = () => {
	const { t } = useTranslation();
	const { closeDialog, openDialog } = useDialog();

	const [doctor, setDoctor] = useState<string>();
	const [doctorSelected, setDoctorSelected] = useState<boolean>(false);
	const [dateTimeChanged, setDateTimeChanged] = useState<boolean>(false);
	const [doctorDropdownOutline, setDoctorDropdownOutline] = useState<string>('outline-stroke-input');
	const [datePickerOutline, setDatePickerOutline] = useState<string>('outline-stroke-input');

	const handleDateTimeChange = useCallback((date: string, time?: string) => {
		setDateTimeChanged(!!(date && time));
	}, []);

	// 다이얼로그 하단 버튼 설정
	const actions = useMemo((): BottomButtonProps[] => [
		{
			disabled: false,
			onClick: () => closeDialog('selectDateTimeDialog'),
			text: t('appointment.detail.treatmentInfo.dialog.cancel')
		},
		{
			disabled: !dateTimeChanged,
			onClick: () => closeDialog('selectDateTimeDialog'),
			text: t('appointment.detail.treatmentInfo.dialog.confirm')
		}
	], [closeDialog, dateTimeChanged, t]);

	const openSelectDateTimeDialog = useCallback(() => {
		openDialog({
			dialogButtons: <DoubleDialogBottomButton actions={actions} />,
			dialogClass: 'w-[36.25rem]',
			dialogContents: <DateAndTimePicker onDateTimeChange={handleDateTimeChange} />,
			dialogId: 'selectDateTimeDialog',
			dialogTitle: t('appointment.detail.treatmentInfo.dialog.title'),
		});
	}, [actions, handleDateTimeChange, openDialog, t]);

	// 의사 먼저 선택하라는 다이얼로그 닫기
	const closeSelectDoctorFirstDialog = useCallback(() => {
		closeDialog('selectDoctorFirstDialog');
	}, [closeDialog]);

	// 진료 일시 아이콘 클릭 이벤트
	const handleCalendarIconClick = useCallback(() => {
		if (!doctorSelected) {
			openDialog({
				dialogButtons: <SingleDialogBottomButton onClick={closeSelectDoctorFirstDialog} text={t('common.buttons.confirm')} />,
				dialogContents: <h1 className='font-normal leading-[normal] px-10 py-[3.75rem] text-text-100 text-xl'>{t('appointment.detail.treatmentInfo.timeSelectAlert')}</h1>,
				dialogId: 'selectDoctorFirstDialog',
			});
			setDoctorDropdownOutline('outline-system-error');
			return;
		}

		openSelectDateTimeDialog();
	}, [closeSelectDoctorFirstDialog, doctorSelected, openDialog, openSelectDateTimeDialog, t]);

	const handleDoctorChange = useCallback((value: string) => {
		setDoctor(value);
		setDoctorSelected(true);
		setDoctorDropdownOutline('outline-stroke-input');
		setDatePickerOutline('outline-system-error');
	}, []);

	useEffectAfterMount(() => {
		if (dateTimeChanged){
			openSelectDateTimeDialog();
		}
	}, [dateTimeChanged]);

	return (
		<div className="flex flex-col gap-2.5">
			<h2 className="font-semibold leading-[normal] text-text-100 text-xl">{t('appointment.detail.treatmentInfo.title')}</h2>
			<div className="bg-white border border-stroke-input p-5 rounded-[0.625rem]">
				<div className="flex gap-5 items-start self-stretch">
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.treatmentInfo.doctor')}</p>
							<Dropdown
								buttonClassName={doctorDropdownOutline}
								className="flex-1"
								menuClassName="max-h-[13.5rem]"
								onChange={handleDoctorChange}
								optionClassName="h-10 rounded-sm"
								options={doctorOptions}
								placeholder={t('appointment.detail.treatmentInfo.doctorSelect')}
								value={doctor}
							/>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.treatmentInfo.symptom')}</p>
							<textarea
								className="border border-stroke-input flex-1 font-normal leading-[normal] h-20 px-4 py-2.5 resize-none rounded text-base text-text-100"
								disabled
							></textarea>
						</div>
					</div>
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.treatmentInfo.preferredTime')}</p>
							<Input
								className="cursor-default placeholder:text-text-70 px-0 text-text-100"
								icon={<CalendarIcon className='translate-x-2' handleClick={handleCalendarIconClick} />}
								placeholder={t('appointment.detail.treatmentInfo.timeSelect')}
								readOnly
								wrapperClassName={`${datePickerOutline} rounded`}
							/>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.treatmentInfo.symptomImages')}</p>
							<SymptomImages />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditableTreatmentInfo;
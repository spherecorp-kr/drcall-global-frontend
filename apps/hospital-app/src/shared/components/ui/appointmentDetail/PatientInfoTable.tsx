import { useCallback } from 'react';
import { Button } from '@/shared/components/ui';
import { useDialog } from '@/shared/hooks/useDialog';
import { SingleDialogBottomButton } from '@/shared/components/ui/dialog';
import { EditPatientInfoForm } from '@/shared/components/ui/appointmentDetail';
import { useAppointmentTabStore } from '@/shared/store/appointmentTabStore.ts';

const TH_CLASS: string = 'font-normal leading-[normal] min-w-[12.5rem] text-base text-text-70';
const TD_CLASS: string = 'font-normal leading-[normal] text-base text-text-100';
const TEXTAREA_CLASS: string = 'border border-stroke-input flex-1 font-normal leading-[normal] px-4 py-2.5 resize-none rounded text-base text-text-100';
const BADGE_CLASS: string = 'font-semibold h-5 px-2.5 rounded-xl text-[0.8125rem]';

// 뱃지
const Aptmt = () => <span className={`${BADGE_CLASS} bg-badge-7 text-system-successful`}>일반 진료</span>;
const Risk = () => <span className={`${BADGE_CLASS} bg-badge-6 text-system-error`}>Risk</span>;
const Sdn = () => <span className={`${BADGE_CLASS} bg-badge-2 text-system-caution`}>빠른 진료</span>;
const Vip = () => <span className={`${BADGE_CLASS} bg-badge-5 text-primary-70`}>VIP</span>

// 남자 아이콘
const Male = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path d="M6.83464 14.3333C9.68811 14.3333 12.0013 12.0201 12.0013 9.16667C12.0013 6.3132 9.68811 4 6.83464 4C3.98116 4 1.66797 6.3132 1.66797 9.16667C1.66797 12.0201 3.98116 14.3333 6.83464 14.3333Z" stroke="#3278FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
		<path d="M14.3346 1.66797L10.668 5.33464" stroke="#3278FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
		<path d="M10 1.66797H14.3333V6.0013" stroke="#3278FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
)

// 여자 아이콘
const Female = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path d="M8.0026 10.6654C10.5799 10.6654 12.6693 8.57603 12.6693 5.9987C12.6693 3.42137 10.5799 1.33203 8.0026 1.33203C5.42528 1.33203 3.33594 3.42137 3.33594 5.9987C3.33594 8.57603 5.42528 10.6654 8.0026 10.6654Z" stroke="#FF5977" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
		<path d="M8 10.668V14.668" stroke="#FF5977" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
		<path d="M10 12.668H6" stroke="#FF5977" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

const PatientInfoTable = () => {
	const { openDialog } = useDialog();
	const { appointmentTab } = useAppointmentTabStore();

	const openEditPatientInfoDialog = useCallback(() => {
		openDialog({
			dialogButtons: <SingleDialogBottomButton onClick={() => {}} text='저장' />,
			dialogClass: 'w-[36.25rem]',
			dialogContents: <EditPatientInfoForm />,
			dialogId: 'editPatientInfoDialog',
			dialogTitle: '환자 정보 수정',
			hasCloseButton: true
		});
	}, [openDialog]);

	return (
		<div className="bg-white border border-stroke-input flex flex-col gap-5 p-5 rounded-[0.625rem]">
			<div className="flex flex-col gap-2.5">
				<div className='flex items-center justify-between'>
					<div className='flex gap-2 items-center justify-start'>
						<Aptmt />
						<Sdn />
						<Risk />
						<Vip />
					</div>
					{!(appointmentTab === 'completed' || appointmentTab === 'cancelled') && (
						<Button
							className='rounded-sm !text-text-70'
							onClick={openEditPatientInfoDialog}
							variant='ghost'>환자 정보 수정</Button>
					)}
				</div>
				<div className='flex gap-2 items-center justify-start'>
					<h3 className='font-semibold leading-[normal] text-[1.125rem] text-text-100'>환자 이름</h3>
					<p className='flex font-normal items-center leading-[normal] text-sm text-text-40'>(14.05.1994 / <Male /><Female />)</p>
				</div>
			</div>
			<div className="flex gap-5 items-start self-stretch">
				<div className="flex flex-1 flex-col h-full items-start justify-between">
					<div className="flex gap-2.5 items-center justify-start">
						<p className={TH_CLASS}>Thai ID Number</p>
						<p className={TD_CLASS}>0-1234-56789-01-2</p>
					</div>
					<div className="flex gap-2.5 items-center justify-start">
						<p className={TH_CLASS}>휴대폰 번호</p>
						<p className={TD_CLASS}>010-1234-5678</p>
					</div>
					<div className="flex gap-2.5 items-start justify-start">
						<p className={TH_CLASS}>주소</p>
						<p className={`${TD_CLASS} break-words`}>Seocho-gu, Seoul, Republic of Korea 162, Baumoe-ro 1902, Building 103, Raemian Apartment, 192-458</p>
					</div>
					<div className="flex gap-2.5 items-center justify-start">
						<p className={TH_CLASS}>키/체중/혈액형</p>
						<p className={TD_CLASS}>167/55/A(RH+)</p>
					</div>
					<div className="flex gap-2.5 items-center justify-start">
						<p className={TH_CLASS}>음주 습관(200ml, 1W)</p>
						<p className={TD_CLASS}>1~5</p>
					</div>
				</div>
				<div className="flex flex-1 flex-col gap-4 items-start">
					<div className="flex gap-2.5 items-start justify-start w-full">
						<p className={TH_CLASS}>복용 중인 약물</p>
						<textarea className={TEXTAREA_CLASS} disabled></textarea>
					</div>
					<div className="flex gap-2.5 items-start justify-start w-full">
						<p className={TH_CLASS}>개인력</p>
						<textarea className={TEXTAREA_CLASS} disabled></textarea>
					</div>
					<div className="flex gap-2.5 items-start justify-start w-full">
						<p className={TH_CLASS}>가족력</p>
						<textarea className={TEXTAREA_CLASS} disabled></textarea>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PatientInfoTable;
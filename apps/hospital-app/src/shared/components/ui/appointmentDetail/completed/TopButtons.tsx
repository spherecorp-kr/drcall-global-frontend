import { useCallback, useEffect, useState } from 'react';
import chatIcon from '@/assets/icons/ic_chat.svg';
import { Button } from '@/shared/components/ui';
import { useDialog } from '@/shared/hooks/useDialog';
import { useDialogStore } from '@/shared/store/dialogStore';
import { SingleDialogBottomButton } from '@/shared/components/ui/dialog';
import PrescriptionEdit from './PrescriptionEdit';
import PrescriptionRegistration from './PrescriptionRegistration';

interface Fee {
	treatmentFee: number,
	dispensingFee: number,
	tip: number
}

const TopButtons = () => {
	const { openDialog } = useDialog();
	const { setDialog } = useDialogStore();

	const [cost, setCost] = useState<string>('0');
	const [payCheckAvailable, setPayCheckAvailable] = useState<boolean>(true);
	const [reAppointmentAvailable, setReAppointmentAvailable] = useState<boolean>(true);
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

	const handleCostChange = useCallback(({ treatmentFee, dispensingFee, tip }: Fee) => {
		const total = treatmentFee + dispensingFee + tip;
		const formattedTotal = total.toLocaleString();
		setCost(formattedTotal);
		
		// 다이얼로그 버튼 실시간 업데이트
		setDialog({
			dialogButtons: (
				<SingleDialogBottomButton
					disabled={buttonDisabled}
					onClick={() => {}}
					text={`${formattedTotal}THB 청구`}
				/>
			),
			dialogId: 'prescriptionRegistrationDialog',
			isOpen: true,
		});
	}, [buttonDisabled, setDialog]);

	const handleDisabledChange = useCallback((disabled: boolean) => {
		setButtonDisabled(disabled);
		// 다이얼로그 버튼 실시간 업데이트
		setDialog({
			dialogButtons: (
				<SingleDialogBottomButton
					disabled={disabled}
					onClick={() => {}}
					text={`${cost}THB 청구`}
				/>
			),
			dialogId: 'prescriptionRegistrationDialog',
			isOpen: true,
		});
	}, [cost, setDialog]);

	const openPrescriptionDialog = useCallback(() => {
		// 다이얼로그 열 때 초기 상태로 리셋
		setButtonDisabled(true);
		openDialog({
			dialogButtons: (
				<SingleDialogBottomButton
					disabled={true}
					onClick={() => {}}
					text={`${cost}THB 청구`}
				/>
			),
			dialogClass: 'w-[36.25rem]',
			dialogContents: (
				<PrescriptionRegistration
					handleChange={handleCostChange}
					onDisabledChange={handleDisabledChange}
				/>
			),
			dialogId: 'prescriptionRegistrationDialog',
			dialogTitle: '처방전·진료비 등록',
			hasCloseButton: true
		});
	}, [cost, handleCostChange, handleDisabledChange, openDialog]);

	const openPrescriptionEditDialog = useCallback(() => {
		openDialog({
			dialogButtons: (
				<SingleDialogBottomButton
					onClick={() => {}}
					text='완료'
				/>
			),
			dialogClass: 'w-[36.25rem]',
			dialogContents: (
				<PrescriptionEdit
				/>
			),
			dialogId: 'prescriptionEditDialog',
			dialogTitle: '처방전 수정',
			hasCloseButton: true
		});
	}, [openDialog]);

	// TODO FIXME 아래 useEffect 삭제
	useEffect(() => {
		setPayCheckAvailable(true);
		setReAppointmentAvailable(false);
	}, []);

	return (
		<div className="flex items-center justify-between">
			<Button
				variant='primary'
				size='default'
				icon={<img alt="Chat" className="h-5 w-5" src={chatIcon} />}
			>Chat</Button>
			<div className="flex gap-2.5 items-center">
				<Button
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<path
								d="M1.14062 16.0291V6.33473C1.14088 4.6781 2.48393 3.33473 4.14062 3.33473H8.9873C9.53943 3.33473 9.98705 3.78267 9.9873 4.33473C9.9873 4.88702 9.53959 5.33473 8.9873 5.33473H4.14062C3.5885 5.33473 3.14088 5.78267 3.14062 6.33473V16.0291C3.14062 16.5814 3.58834 17.0291 4.14062 17.0291H13.2871C13.8393 17.029 14.2871 16.5813 14.2871 16.0291V10.6345H16.2871V16.0291C16.2871 17.6859 14.9439 19.029 13.2871 19.0291H4.14062C2.48377 19.0291 1.14062 17.6859 1.14062 16.0291ZM14.1172 2.1443C14.8982 1.36341 16.1643 1.36331 16.9453 2.1443L17.8545 3.05348C18.6355 3.83453 18.6355 5.10154 17.8545 5.88259L9.86719 13.8699C9.58805 14.1489 9.23271 14.3393 8.8457 14.4168L7.70801 14.6443C6.30876 14.9238 5.07564 13.6901 5.35547 12.2908L5.58203 11.1531C5.6595 10.766 5.85075 10.4107 6.12988 10.1316L14.1172 2.1443ZM7.54395 11.5457L7.31641 12.6834L8.45312 12.4558L16.4404 4.46852L15.5312 3.55837L7.54395 11.5457Z"
								fill="currentColor"
							/>
						</svg>
					}
					onClick={openPrescriptionDialog}
					size='default'
					variant='outline'
				>처방전&middot;진료비 등록</Button>
				<Button
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<path
								d="M1.14062 16.0291V6.33473C1.14088 4.6781 2.48393 3.33473 4.14062 3.33473H8.9873C9.53943 3.33473 9.98705 3.78267 9.9873 4.33473C9.9873 4.88702 9.53959 5.33473 8.9873 5.33473H4.14062C3.5885 5.33473 3.14088 5.78267 3.14062 6.33473V16.0291C3.14062 16.5814 3.58834 17.0291 4.14062 17.0291H13.2871C13.8393 17.029 14.2871 16.5813 14.2871 16.0291V10.6345H16.2871V16.0291C16.2871 17.6859 14.9439 19.029 13.2871 19.0291H4.14062C2.48377 19.0291 1.14062 17.6859 1.14062 16.0291ZM14.1172 2.1443C14.8982 1.36341 16.1643 1.36331 16.9453 2.1443L17.8545 3.05348C18.6355 3.83453 18.6355 5.10154 17.8545 5.88259L9.86719 13.8699C9.58805 14.1489 9.23271 14.3393 8.8457 14.4168L7.70801 14.6443C6.30876 14.9238 5.07564 13.6901 5.35547 12.2908L5.58203 11.1531C5.6595 10.766 5.85075 10.4107 6.12988 10.1316L14.1172 2.1443ZM7.54395 11.5457L7.31641 12.6834L8.45312 12.4558L16.4404 4.46852L15.5312 3.55837L7.54395 11.5457Z"
								fill="currentColor"
							/>
						</svg>
					}
					onClick={openPrescriptionEditDialog}
					size='default'
					variant='outline'
				>처방전 수정</Button>
				<Button
					variant='outline'
					size='default'
					disabled={!payCheckAvailable}
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<path
								d="M16.9024 4.35528C17.2582 3.93329 17.8883 3.87959 18.3106 4.23516C18.7329 4.59098 18.7875 5.22196 18.4317 5.64434L9.16506 16.6443L8.51955 17.409L1.35549 11.3641C0.933427 11.008 0.879351 10.377 1.23537 9.95489C1.5915 9.53281 2.22244 9.47967 2.64455 9.83574L8.27931 14.5897L16.9024 4.35528Z"
								fill="currentColor"
							/>
						</svg>
					}
				>입금 완료</Button>
				<Button
					variant='outline'
					size='default'
					disabled={!reAppointmentAvailable}
					icon={
						<svg
							fill="none"
							height="20"
							viewBox="0 0 20 20"
							width="20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M3.33203 6.66797H16.6654M3.33203 6.66797V14.0015C3.33203 14.9349 3.33203 15.4014 3.51369 15.7579C3.67348 16.0715 3.92826 16.3267 4.24186 16.4865C4.59803 16.668 5.06453 16.668 5.99612 16.668H14.0013C14.9329 16.668 15.3987 16.668 15.7549 16.4865C16.0685 16.3267 16.3241 16.0715 16.4839 15.7579C16.6654 15.4017 16.6654 14.9359 16.6654 14.0043V6.66797M3.33203 6.66797V6.00146C3.33203 5.06804 3.33203 4.60099 3.51369 4.24447C3.67348 3.93086 3.92826 3.67608 4.24186 3.51629C4.59838 3.33464 5.06544 3.33464 5.99886 3.33464H6.66536M16.6654 6.66797V5.99873C16.6654 5.06713 16.6654 4.60064 16.4839 4.24447C16.3241 3.93086 16.0685 3.67608 15.7549 3.51629C15.3983 3.33464 14.9323 3.33464 13.9989 3.33464H13.332M6.66536 3.33464H13.332M6.66536 3.33464V1.66797M13.332 3.33464V1.66797M12.4987 10.0013L9.16536 13.3346L7.4987 11.668"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
							/>
						</svg>
					}
				>재예약</Button>
			</div>
		</div>
	);
};

export default TopButtons;
import { useCallback, useState } from 'react';
import { useDialog } from '@/shared/hooks/useDialog';
import { useDialogStore } from '@/shared/store/dialogStore';
import { SingleDialogBottomButton } from '@/shared/components/ui/dialog';
import { CancelReason } from '@/shared/components/ui/appointmentDetail';

const DIALOG_ID = 'cancelReasonDialog';

export const useCancelReasonDialog = (): { openCancelReasonDialog: () => void } => {
	const { openDialog } = useDialog();
	const { setDialog } = useDialogStore();
	const [cancelDisabled, setCancelDisabled] = useState<boolean>(true);

	// disabled 상태 변경 핸들러
	const handleDisabledChange = useCallback((disabled: boolean) => {
		setCancelDisabled(disabled);
		// 다이얼로그 버튼 업데이트
		setDialog({
			dialogButtons: (
				<SingleDialogBottomButton
					disabled={disabled}
					onClick={() => {}}
					text='완료'
				/>
			),
			dialogId: DIALOG_ID,
			isOpen: true,
		});
	}, [setDialog]);

	// 취소 사유 다이얼로그 열기
	const openCancelReasonDialog = useCallback(() => {
		openDialog({
			dialogButtons: (
				<SingleDialogBottomButton
					disabled={cancelDisabled}
					onClick={() => {}}
					text='완료'
				/>
			),
			dialogClass: 'w-[36.25rem]',
			dialogContents: <CancelReason onDisabledChange={handleDisabledChange} />,
			dialogId: DIALOG_ID,
			dialogTitle: '예약 취소',
			hasCloseButton: true,
		});
	}, [cancelDisabled, handleDisabledChange, openDialog]);

	return {
		openCancelReasonDialog,
	};
};
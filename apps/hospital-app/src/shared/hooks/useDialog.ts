import { useDialogStore } from '@/shared/store/dialogStore.ts';
import type { DialogContentProps } from '@/shared/types/dialog.ts';

export const useDialog = () => {
	const { dialogId, resetDialog, setDialog } = useDialogStore();

	// 다이얼로그 닫기
	const closeDialog = (id: string) => {
		const dialog: HTMLDialogElement = document.getElementById(id) as HTMLDialogElement;
		dialog.close();

		resetDialog(); // 기존 다이얼로그 초기화
	}

	// 다이얼로그 열기
	const openDialog = (props: DialogContentProps) => {
		setDialog({ ...props, isOpen: true });

		const dialog: HTMLDialogElement = document.getElementById(dialogId) as HTMLDialogElement;
		dialog.showModal();
	}

	return { closeDialog, openDialog };
}
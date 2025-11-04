import { create } from 'zustand';
import type { DialogContentProps, DialogProps } from '@/shared/types/dialog';

interface DialogState extends DialogProps {
	setDialog: (props: DialogProps) => void;
	resetDialog: () => void;
}

const initialDialog: DialogProps = {
	dialogContents: '',
	dialogId: 'empty',
	isOpen: false
};

export const useDialogStore = create<DialogState>((set) => ({
	...initialDialog,
	setDialog: (props) => set((state) => ({ ...state, ...props })),
	resetDialog: () => set(initialDialog)
}));

export const useDialogProps = (): DialogContentProps => {
	const dialogButtons = useDialogStore(state => state.dialogButtons);
	const dialogClass = useDialogStore(state => state.dialogClass);
	const dialogContents = useDialogStore(state => state.dialogContents);
	const dialogId = useDialogStore(state => state.dialogId);
	const dialogTitle = useDialogStore(state => state.dialogTitle);

	return {
		dialogButtons,
		dialogClass,
		dialogContents,
		dialogId,
		dialogTitle
	}
}
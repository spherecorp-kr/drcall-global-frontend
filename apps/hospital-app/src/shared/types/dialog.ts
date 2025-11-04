import type { JSX, ReactNode } from 'react';

export interface DialogContentProps {
	dialogId: string;
	dialogIdForClose?: string;
	dialogClass?: string;
	dialogTitle?: string;
	dialogContents: JSX.Element | string;
	dialogButtons?: JSX.Element;
}

export interface DialogProps extends DialogContentProps {
	isOpen: boolean;
}

export interface BottomButtonProps {
	disabled?: boolean
	onClick: () => void;
	text: ReactNode | string;
}

export interface BottomDoubleButtonProps {
	actions: BottomButtonProps[];
}
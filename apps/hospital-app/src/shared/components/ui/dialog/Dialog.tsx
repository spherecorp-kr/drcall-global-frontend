import React, { type JSX } from 'react';
import type { DialogContentProps } from '@/shared/types/dialog';
import { cn } from '@/shared/utils/cn';
import { useDialog } from '@/shared/hooks/useDialog';
import icClose from '@/shared/assets/icons/ic_close.svg';

interface TitledProps {
	closeAction?: () => void;
	dialogButtons?: JSX.Element;
	dialogContents?: JSX.Element;
	dialogId: string;
	hasCloseButton: boolean;
	title: string;
}

const Titled = ({ closeAction, dialogButtons, dialogContents, dialogId, hasCloseButton, title }: TitledProps) => {
	const { closeDialog } = useDialog();

	const handleClose = () => {
		closeDialog(dialogId);
		if (closeAction) {
			closeAction();
		}
	}

	return (
		<>
			<div className="pt-5 px-5 relative">
				<h1 className="font-semibold text-center text-text-100 text-xl">{title}</h1>
				{hasCloseButton && (
					<button className='absolute h-7 right-[1.4375rem] top-5 w-7' onClick={handleClose}>
						<img alt='close' src={icClose} />
					</button>
				)}
			</div>
			<div className="p-5">{dialogContents}</div>
			{dialogButtons && <div>{dialogButtons}</div>}
		</>
	);
}

const Dialog: React.FC<DialogContentProps> = ({ dialogClass, dialogId, dialogTitle, hasCloseButton = false, ...props }) => {
	return (
		<dialog id={dialogId} className={cn('bg-white outline-none rounded-[0.625rem] shadow-dialog', dialogClass)}>
			{dialogTitle
				? (
					<Titled
						dialogId={dialogId}
						hasCloseButton={hasCloseButton}
						title={dialogTitle}
						{...props}
					/>
				) : (
					<>
						{props.dialogContents}
						{props.dialogButtons}
					</>
				)
			}
		</dialog>
	);
};

export default Dialog;
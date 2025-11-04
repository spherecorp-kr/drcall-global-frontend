import React, { type JSX } from 'react';
import type { DialogContentProps } from '@/shared/types/dialog';
import { cn } from '@/shared/utils/cn';
import { useDialog } from '@/shared/hooks/useDialog';
import icClose from '@/shared/assets/icons/ic_close.svg';

interface UntitledProps {
	dialogButtons?: JSX.Element;
	dialogContents: JSX.Element | string;
}

interface TitledProps extends UntitledProps {
	dialogIdForClose?: string;
	title: string;
}

const Titled = ({ dialogButtons, dialogContents, dialogIdForClose, title }: TitledProps) => {
	const { closeDialog } = useDialog();

	return (
		<>
			<div className="pt-5 px-5 relative">
				<h1 className="font-semibold text-center text-text-100 text-xl">{title}</h1>
				{dialogIdForClose && (
					<button className='absolute h-7 right-[1.4375rem] top-5 w-7' onClick={() => closeDialog(dialogIdForClose)}>
						<img alt='close' src={icClose} />
					</button>
				)}
			</div>
			<div className="p-5">{dialogContents}</div>
			{dialogButtons && <div>{dialogButtons}</div>}
		</>
	);
}

const Untitled = ({ dialogButtons, dialogContents }: UntitledProps) => {
	return (
		<>
			<div>
				<h1>{dialogContents}</h1>
			</div>
			{dialogButtons && (
				<div>{dialogButtons}</div>
			)}
		</>
	);
}

const Dialog: React.FC<DialogContentProps> = ({ dialogClass, dialogId, dialogTitle, ...props }) => {
	return (
		<dialog id={dialogId} className={cn('bg-white outline-none rounded-[0.625rem] shadow-dialog', dialogClass)}>
			{dialogTitle
				? (
					<Titled
						dialogButtons={props.dialogButtons}
						dialogContents={props.dialogContents}
						dialogIdForClose={props.dialogIdForClose}
						title={dialogTitle}
					/>
				) : (
					<Untitled
						dialogButtons={props.dialogButtons}
						dialogContents={props.dialogContents}
					/>
				)
			}
		</dialog>
	);
};

export default Dialog;
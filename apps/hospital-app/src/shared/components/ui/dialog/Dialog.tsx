import React, { type JSX } from 'react';
import type { DialogContentProps } from '@/shared/types/dialog';
import { cn } from '@/shared/utils/cn';

interface UntitledProps {
	dialogButtons?: JSX.Element;
	dialogContents: JSX.Element | string;
}

interface TitledProps extends UntitledProps {
	title: string;
}

const Titled = ({ dialogButtons, dialogContents, title }: TitledProps) => {
	return (
		<>
			<div className='pt-5 px-5'>
				<h1 className='font-semibold text-center text-text-100 text-xl'>{title}</h1>
			</div>
			<div className='p-5'>{dialogContents}</div>
			{dialogButtons && (
				<div>{dialogButtons}</div>
			)}
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
		<dialog id={dialogId} className={cn('bg-white rounded-[0.625rem] shadow-dialog', dialogClass)}>
			{dialogTitle
				? (
					<Titled
						dialogButtons={props.dialogButtons}
						dialogContents={props.dialogContents}
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
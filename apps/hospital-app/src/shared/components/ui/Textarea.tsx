import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	required?: boolean;
	maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ label, error, required, className, maxLength, ...props }, ref) => {
		return (
			<div className="flex flex-col gap-2.5">
				{label && (
					<label className="text-16 text-text-50">
						{label}
						{required && <span className="text-system-error">*</span>}
					</label>
				)}
				<div className="relative">
					<textarea
						ref={ref}
						className={cn(
							'w-full min-h-[80px] px-4 py-2.5 bg-bg-white rounded-lg outline outline-1 outline-stroke-input',
							'text-16 font-pretendard text-text-100 placeholder:text-text-30',
							'resize-none',
							'focus:outline-2 focus:outline-primary-70',
							error && 'outline-system-error',
							className,
						)}
						maxLength={maxLength}
						{...props}
					/>
				</div>
				{error && <p className="text-14 text-system-error">{error}</p>}
			</div>
		);
	},
);

Textarea.displayName = 'Textarea';

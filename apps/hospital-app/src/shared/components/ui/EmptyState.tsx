import WarningIcon from '@/shared/assets/icons/ic_circle_warning_grey.svg?react';

interface EmptyStateProps {
	message: string;
	className?: string;
}

export function EmptyState({ message, className = '' }: EmptyStateProps) {
	return (
		<div
			className={`w-full h-full bg-bg-gray rounded-[10px] flex items-center justify-center gap-[6px] ${className}`}
		>
			<WarningIcon className="w-6 h-6" />
			<div
				className="text-text-40 text-18 font-pretendard font-normal"
				style={{ wordWrap: 'break-word' }}
			>
				{message}
			</div>
		</div>
	);
}

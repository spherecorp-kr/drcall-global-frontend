import React from 'react';
import warningIcon from '@/shared/assets/icons/ic_circle_warning_grey.svg';
import { cn } from '@/shared/utils/cn';

interface EmptyStateProps {
	className?: string;
	message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ className = '', message }) => {
	return (
		<div className={cn('bg-bg-gray flex gap-1.5 h-full items-center justify-center rounded-[0.625rem] w-full', className)}>
			<img alt='warning' className='h-6 w-6' src={warningIcon} />
			<div className='font-normal font-pretendard text-18 text-text-40' style={{ wordWrap: 'break-word' }}>{message}</div>
		</div>
	);
}

export default EmptyState;
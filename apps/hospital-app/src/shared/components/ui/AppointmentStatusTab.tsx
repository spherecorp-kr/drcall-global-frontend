import React from 'react';
import type { StatusTabProps } from '@/shared/types/appointment';
import { cn } from '@/shared/utils/cn.ts';

const AppointmentStatusTab: React.FC<StatusTabProps> = ({ handleClick, status }) => {
	return (
		<div className="flex gap-10 h-12 items-start px-5 self-stretch shrink-0">
			<div
				className="cursor-pointer flex flex-col gap-4 items-start"
				onClick={() => handleClick('waiting')}
			>
				<h2
					className={cn(
						'leading-normal text-xl',
						status === 'waiting'
							? 'font-semibold text-primary-70'
							: 'font-normal text-text-100',
					)}
				>
					예약 대기(30)
				</h2>
				{status === 'waiting' && <div className="bg-primary-70 h-1 w-full" />}
			</div>
			<div
				className="cursor-pointer flex flex-col gap-4 items-start"
				onClick={() => handleClick('confirmed')}
			>
				<h2
					className={cn(
						'leading-normal text-xl',
						status === 'confirmed'
							? 'font-semibold text-primary-70'
							: 'font-normal text-text-100',
					)}
				>
					예약 확정(20)
				</h2>
				{status === 'confirmed' && <div className="bg-primary-70 h-1 w-full" />}
			</div>
			<div
				className="cursor-pointer flex flex-col gap-4 items-start"
				onClick={() => handleClick('completed')}
			>
				<h2
					className={cn(
						'leading-normal text-xl',
						status === 'completed'
							? 'font-semibold text-primary-70'
							: 'font-normal text-text-100',
					)}
				>
					진료 완료(40)
				</h2>
				{status === 'completed' && <div className="bg-primary-70 h-1 w-full" />}
			</div>
			<div
				className="cursor-pointer flex flex-col gap-4 items-start"
				onClick={() => handleClick('cancelled')}
			>
				<h2
					className={cn(
						'leading-normal text-xl',
						status === 'cancelled'
							? 'font-semibold text-primary-70'
							: 'font-normal text-text-100',
					)}
				>
					예약 취소(10)
				</h2>
				{status === 'cancelled' && <div className="bg-primary-70 h-1 w-full" />}
			</div>
		</div>
	);
};

export default AppointmentStatusTab;

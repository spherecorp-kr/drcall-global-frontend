import { useAppointmentTabStore } from '@/shared/store/appointmentTabStore.ts';
import { cn } from '@/shared/utils/cn.ts';

const AppointmentStatusTab = () => {
	const { appointmentTab, setAppointmentTab } = useAppointmentTabStore();
	return (
		<div className="flex gap-10 h-12 items-start px-5 self-stretch shrink-0">
			<div
				className="cursor-pointer flex flex-col gap-4 items-start"
				onClick={() => setAppointmentTab('waiting')}
			>
				<h2
					className={cn(
						'leading-[normal] text-xl',
						appointmentTab === 'waiting'
							? 'font-semibold text-primary-70'
							: 'font-normal text-text-100',
					)}
				>
					예약 대기(30)
				</h2>
				{appointmentTab === 'waiting' && <div className="bg-primary-70 h-1 w-full" />}
			</div>
			<div
				className="cursor-pointer flex flex-col gap-4 items-start"
				onClick={() => setAppointmentTab('confirmed')}
			>
				<h2
					className={cn(
						'leading-[normal] text-xl',
						appointmentTab === 'confirmed'
							? 'font-semibold text-primary-70'
							: 'font-normal text-text-100',
					)}
				>
					예약 확정(20)
				</h2>
				{appointmentTab === 'confirmed' && <div className="bg-primary-70 h-1 w-full" />}
			</div>
			<div
				className="cursor-pointer flex flex-col gap-4 items-start"
				onClick={() => setAppointmentTab('completed')}
			>
				<h2
					className={cn(
						'leading-[normal] text-xl',
						appointmentTab === 'completed'
							? 'font-semibold text-primary-70'
							: 'font-normal text-text-100',
					)}
				>
					진료 완료(40)
				</h2>
				{appointmentTab === 'completed' && <div className="bg-primary-70 h-1 w-full" />}
			</div>
			<div
				className="cursor-pointer flex flex-col gap-4 items-start"
				onClick={() => setAppointmentTab('cancelled')}
			>
				<h2
					className={cn(
						'leading-[normal] text-xl',
						appointmentTab === 'cancelled'
							? 'font-semibold text-primary-70'
							: 'font-normal text-text-100',
					)}
				>
					예약 취소(10)
				</h2>
				{appointmentTab === 'cancelled' && <div className="bg-primary-70 h-1 w-full" />}
			</div>
		</div>
	);
};

export default AppointmentStatusTab;
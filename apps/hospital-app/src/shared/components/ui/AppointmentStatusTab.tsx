import { useAppointmentTabStore } from '@/shared/store/appointmentTabStore.ts';
import { cn } from '@/shared/utils/cn.ts';
import { useTranslation } from 'react-i18next';

const AppointmentStatusTab = () => {
	const { appointmentTab, setAppointmentTab } = useAppointmentTabStore();
	const { t } = useTranslation();
	return (
		<div className="flex gap-10 h-12 items-start px-5 self-stretch shrink-0">
			<div
				className="cursor-pointer flex flex-col gap-4 items-start"
				onClick={() => setAppointmentTab('pending')}
			>
				<h2
					className={cn(
						'leading-[normal] text-xl',
						appointmentTab === 'pending'
							? 'font-semibold text-primary-70'
							: 'font-normal text-text-100',
					)}
				>
					{t('appointment.statusTab.pending')}(30)
				</h2>
				{appointmentTab === 'pending' && <div className="bg-primary-70 h-1 w-full" />}
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
					{t('appointment.statusTab.confirmed')}(20)
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
					{t('appointment.statusTab.completed')}(40)
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
					{t('appointment.statusTab.cancelled')}(10)
				</h2>
				{appointmentTab === 'cancelled' && <div className="bg-primary-70 h-1 w-full" />}
			</div>
		</div>
	);
};

export default AppointmentStatusTab;
import { useCallback } from 'react';
import { AppointmentStatusTab } from '@/shared/components/ui';
import {
	SearchCancelled,
	SearchCompleted,
	SearchConfirmed,
	SearchWaiting
} from '@/shared/components/ui/appointmentSearch';
import {
	CancelledTable,
	CompletedTable,
	ConfirmedTable,
	WaitingTable
} from '@/shared/components/ui/appointmentTables';
import { ConfirmedCalendar } from '@/shared/components/ui/appointmentCalendar';
import { useAppointmentTabStore } from '@/shared/store/appointmentTabStore';
import { useConfirmedAppointmentStore } from '@/shared/store/confirmedAppointmentStore';

const Appointment = () => {
	const { appointmentTab } = useAppointmentTabStore();
	const { viewMode } = useConfirmedAppointmentStore();

	// 상태별 UI 렌더링 함수
	const renderStatusContent = useCallback(() => {
		switch (appointmentTab) {
			case 'waiting':
				return (
					<>
						<SearchWaiting />
						<WaitingTable />
					</>
				);
			case 'confirmed':
				return (
					<>
						<SearchConfirmed />
						{viewMode === 'list' ? <ConfirmedTable /> : <ConfirmedCalendar />}
					</>
				);
			case 'completed':
				return (
					<>
						<SearchCompleted />
						<CompletedTable />
					</>
				);
			case 'cancelled':
				return (
					<>
						<SearchCancelled />
						<CancelledTable />
					</>
				);
			default:
				return null;
		}
	}, [appointmentTab, viewMode]);

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="bg-white border-b border-b-[#e0e0e0] flex flex-col h-20 items-start justify-end px-5 shrink-0">
				<AppointmentStatusTab />
			</div>
			<div className="bg-bg-gray flex flex-1 flex-col gap-5 overflow-y-auto p-5">{renderStatusContent()}</div>
		</div>
	);
}

export default Appointment;
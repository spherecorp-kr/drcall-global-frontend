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
import { useAppointmentTabStore } from '@/shared/store/appointmentTabStore';

const Appointment = () => {
	const { appointmentTab } = useAppointmentTabStore();

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
						<ConfirmedTable />
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
	}, [appointmentTab]);

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="bg-white border-b border-b-[#e0e0e0] flex flex-col h-20 items-start justify-end px-5 shrink-0">
				<AppointmentStatusTab />
			</div>
			<div className="bg-bg-gray flex flex-1 flex-col gap-5 p-5">{renderStatusContent()}</div>
		</div>
	);
}

export default Appointment;
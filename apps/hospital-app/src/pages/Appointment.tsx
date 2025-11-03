import { useCallback, useState } from 'react';
import { AppointmentStatusTab } from '@/shared/components/ui';
import type { AppointmentStatus } from '@/shared/types/appointment';
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

const Appointment = () => {
	const [status, setStatus] = useState<AppointmentStatus>('waiting');

	// 상태별 UI 렌더링 함수
	const renderStatusContent = useCallback(() => {
		switch (status) {
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
	}, [status]);

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="bg-white border-b border-b-[#e0e0e0] flex flex-col h-20 items-start justify-end px-5 shrink-0">
				<AppointmentStatusTab handleClick={setStatus} status={status} />
			</div>
			<div className="bg-bg-gray flex flex-1 flex-col gap-5 p-5">{renderStatusContent()}</div>
		</div>
	);
}

export default Appointment;
import { useState } from 'react';
import { AppointmentStatusTab } from '@/shared/components/ui';
import type { AppointmentStatus } from '@/shared/types/appointment';
import { SearchConfirmed, SearchWaiting } from '@/shared/components/ui/AppointmentSearch';
import { WaitingTable } from '@/shared/components/ui/AppointmentTables';

export function Appointment() {
	const [status, setStatus] = useState<AppointmentStatus>('waiting');

	// 상태별 UI 렌더링 함수
	const renderStatusContent = () => {
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
					</>
				);
			case 'completed':
				return <></>;
			case 'cancelled':
				return <></>;
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="bg-white border-b border-b-[#e0e0e0] flex flex-col h-20 items-start justify-end px-5 shrink-0">
				<AppointmentStatusTab handleClick={setStatus} status={status} />
			</div>
			<div className="bg-bg-gray flex flex-1 flex-col gap-5 p-5">{renderStatusContent()}</div>
		</div>
	);
}

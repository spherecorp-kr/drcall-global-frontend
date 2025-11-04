import { useParams } from 'react-router-dom';
import { DetailPageLayout } from '@/shared/components/layout';
import { useCallback, useEffect, useState } from 'react';
import type { AppointmentStatus } from '@/shared/types/appointment';
import {
	CancelledDetailLayout,
	CompletedDetailLayout,
	ConfirmedDetailLayout,
	WaitingDetailLayout,
} from '@/shared/components/ui/appointmentDetail';

const AppointmentDetail = () => {
	const { appointmentSequence } = useParams<{ appointmentSequence: string }>();

	const [status, setStatus] = useState<AppointmentStatus>('waiting');

	// 상태별 UI 렌더링 함수
	const renderStatusContent = useCallback(() => {
		switch (status) {
			case 'waiting':
				return <WaitingDetailLayout />;
			case 'confirmed':
				return <ConfirmedDetailLayout />;
			case 'completed':
				return <CompletedDetailLayout />;
			case 'cancelled':
				return <CancelledDetailLayout />;
		}
	}, [status]);

	// TODO FIXME 아래 2개 useEffect 삭제
	useEffect(() => {
		console.log(`appointmentSequence: ${appointmentSequence}`);
	}, [appointmentSequence]);

	useEffect(() => {
		setStatus('waiting');
	}, []);

	return (
		<div className="flex flex-col h-full overflow-y-auto p-5">
			<DetailPageLayout className='gap-5'>{renderStatusContent()}</DetailPageLayout>
		</div>
	);
};

export default AppointmentDetail;
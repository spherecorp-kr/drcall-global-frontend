import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DetailPageLayout } from '@/shared/components/layout';
import {
	CancelledDetailLayout,
	CompletedDetailLayout,
	ConfirmedDetailLayout,
	WaitingDetailLayout,
} from '@/shared/components/ui/appointmentDetail';
import { useAppointmentTabStore } from '@/shared/store/appointmentTabStore.ts';

const AppointmentDetail = () => {
	const { appointmentSequence } = useParams<{ appointmentSequence: string }>();

	const { appointmentTab } = useAppointmentTabStore();

	// 상태별 UI 렌더링 함수
	const renderStatusContent = useCallback(() => {
		switch (appointmentTab) {
			case 'waiting':
				return <WaitingDetailLayout />;
			case 'confirmed':
				return <ConfirmedDetailLayout />;
			case 'completed':
				return <CompletedDetailLayout />;
			case 'cancelled':
				return <CancelledDetailLayout />;
		}
	}, [appointmentTab]);

	// TODO FIXME 아래 useEffect 삭제
	useEffect(() => {
		console.log(`appointmentSequence: ${appointmentSequence}`);
	}, [appointmentSequence]);

	return (
		<div className="flex flex-col h-full overflow-y-auto p-5">
			<DetailPageLayout className='gap-5'>{renderStatusContent()}</DetailPageLayout>
		</div>
	);
};

export default AppointmentDetail;
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DetailPageLayout } from '@/shared/components/layout';
import {
	CancelledDetailLayout,
	CompletedDetailLayout,
	ConfirmedDetailLayout,
	PendingDetailLayout,
} from '@/shared/components/ui/appointmentDetail';
import { useAppointmentTabStore } from '@/shared/store/appointmentTabStore.ts';
import { appointmentService, type Appointment } from '@/services/appointmentService';

const AppointmentDetail = () => {
	const { appointmentSequence } = useParams<{ appointmentSequence: string }>();
	const { appointmentTab } = useAppointmentTabStore();
	const [appointment, setAppointment] = useState<Appointment | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// 예약 정보 조회
	useEffect(() => {
		const fetchAppointment = async () => {
			if (!appointmentSequence) return;

			try {
				setIsLoading(true);
				const data = await appointmentService.getAppointmentBySequence(appointmentSequence);
				setAppointment(data);
			} catch (error) {
				console.error('[AppointmentDetail] Failed to fetch appointment:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAppointment();
	}, [appointmentSequence]);

	// 상태별 UI 렌더링 함수
	const renderStatusContent = useCallback(() => {
		if (isLoading) {
			return <div>Loading...</div>;
		}

		if (!appointment) {
			return <div>No Data.</div>;
		}

		switch (appointmentTab) {
			case 'pending':
				return <PendingDetailLayout appointment={appointment} />;
			case 'confirmed':
				return <ConfirmedDetailLayout appointment={appointment} />;
			case 'completed':
				return <CompletedDetailLayout appointment={appointment} />;
			case 'cancelled':
				return <CancelledDetailLayout />;
		}
	}, [appointmentTab, appointment, isLoading]);

	return (
		<div className="flex flex-col h-full overflow-y-auto p-5">
			<DetailPageLayout className='gap-5'>{renderStatusContent()}</DetailPageLayout>
		</div>
	);
};

export default AppointmentDetail;
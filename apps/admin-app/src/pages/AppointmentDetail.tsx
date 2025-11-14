import { useParams, useNavigate } from 'react-router-dom';
import { DetailPageLayout } from '@/shared/components/layout';
import { useCallback, useEffect, useState, createContext, useContext } from 'react';
import type { AppointmentStatus } from '@/shared/types/appointment';
import {
	CancelledDetailLayout,
	CompletedDetailLayout,
	ConfirmedDetailLayout,
	WaitingDetailLayout,
} from '@/shared/components/ui/appointmentDetail';
import { appointmentService, type Appointment } from '@/services/appointmentService';
import { StatusMapper } from '@/shared/constants/appointment';

// Context for appointment data
interface AppointmentContextValue {
	appointment: Appointment | null;
	refreshAppointment: () => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppointment = () => {
	const context = useContext(AppointmentContext);
	if (!context) {
		throw new Error('useAppointment must be used within AppointmentDetail');
	}
	return context;
};

const AppointmentDetail = () => {
	const { appointmentSequence } = useParams<{ appointmentSequence: string }>();
	const navigate = useNavigate();

	const [appointment, setAppointment] = useState<Appointment | null>(null);
	const [status, setStatus] = useState<AppointmentStatus>('waiting');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch appointment data
	const fetchAppointment = useCallback(async () => {
		if (!appointmentSequence) return;

		setIsLoading(true);
		setError(null);

		try {
			const data = await appointmentService.getAppointmentByExternalId(appointmentSequence);
			setAppointment(data);

			// Map backend status to UI status
			const uiStatus = Object.entries(StatusMapper).find(
				([, backendStatus]) => backendStatus === data.status
			)?.[0] as AppointmentStatus;

			setStatus(uiStatus || 'waiting');
		} catch (err) {
			console.error('Failed to fetch appointment:', err);
			setError('예약 정보를 불러오는데 실패했습니다.');
		} finally {
			setIsLoading(false);
		}
	}, [appointmentSequence]);

	useEffect(() => {
		fetchAppointment();
	}, [fetchAppointment]);

	// 상태별 UI 렌더링 함수
	const renderStatusContent = useCallback(() => {
		if (isLoading) {
			return <div className="flex items-center justify-center h-64">로딩 중...</div>;
		}

		if (error || !appointment) {
			return (
				<div className="flex flex-col items-center justify-center h-64 gap-4">
					<p className="text-red-500">{error || '예약 정보를 찾을 수 없습니다.'}</p>
					<button
						onClick={() => navigate('/appointment')}
						className="px-4 py-2 bg-primary-70 text-white rounded"
					>
						목록으로 돌아가기
					</button>
				</div>
			);
		}

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
	}, [status, isLoading, error, appointment, navigate]);

	const contextValue: AppointmentContextValue = {
		appointment,
		refreshAppointment: fetchAppointment,
	};

	return (
		<AppointmentContext.Provider value={contextValue}>
			<div className="flex flex-col h-full overflow-y-auto p-5">
				<DetailPageLayout className='gap-5'>{renderStatusContent()}</DetailPageLayout>
			</div>
		</AppointmentContext.Provider>
	);
};

export default AppointmentDetail;
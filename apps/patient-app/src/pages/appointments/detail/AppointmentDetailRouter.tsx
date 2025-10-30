import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { mockAppointmentsDetails } from '@mocks/appointments-list';
import PendingAppointmentDetail from './PendingAppointmentDetail';
import ConfirmedAppointmentDetail from './ConfirmedAppointmentDetail';
import CompletedConsultationDetail from './CompletedConsultationDetail';
import CancelledAppointmentDetail from './CancelledAppointmentDetail';

/**
 * 예약 상세 라우터
 * status에 따라 적절한 상세 페이지를 렌더링
 */
export default function AppointmentDetailRouter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const appointmentData = mockAppointmentsDetails[id || '1'];
  const status = appointmentData?.status;

  useEffect(() => {
    if (!appointmentData) {
      navigate('/error/404', { replace: true });
    }
  }, [appointmentData, navigate]);

  if (!appointmentData) {
    return null;
  }

  switch (status) {
    case 'pending':
      return <PendingAppointmentDetail />;
    case 'confirmed':
      return <ConfirmedAppointmentDetail />;
    case 'completed':
      return <CompletedConsultationDetail />;
    case 'cancelled':
      return <CancelledAppointmentDetail />;
    default:
      return <PendingAppointmentDetail />;
  }
}

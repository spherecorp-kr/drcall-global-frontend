import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';
import { appointmentService, type Appointment } from '@/services/appointmentService';
import PendingAppointmentDetail from './PendingAppointmentDetail';
import ConfirmedAppointmentDetail from './ConfirmedAppointmentDetail';
import CompletedConsultationDetail from './CompletedConsultationDetail';
import CancelledAppointmentDetail from './CancelledAppointmentDetail';

// Context for appointment data
interface AppointmentContextValue {
  appointment: Appointment | null;
  refreshAppointment: () => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextValue | null>(null);

export const useAppointmentDetail = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointmentDetail must be used within AppointmentDetailRouter');
  }
  return context;
};

/**
 * 예약 상세 라우터
 * status에 따라 적절한 상세 페이지를 렌더링
 */
export default function AppointmentDetailRouter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointment = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await appointmentService.getAppointmentById(id);
      setAppointment(data);
    } catch (err) {
      console.error('Failed to fetch appointment:', err);
      setError('Failed to load appointment');
      navigate('/error/404', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.125rem',
        color: '#8A8A8A'
      }}>
        Loading...
      </div>
    );
  }

  if (error || !appointment) {
    return null;
  }

  const contextValue: AppointmentContextValue = {
    appointment,
    refreshAppointment: fetchAppointment,
  };

  // Map backend status to UI component
  const status = appointment.status;

  return (
    <AppointmentContext.Provider value={contextValue}>
      {(status === 'PENDING') && <PendingAppointmentDetail />}
      {(status === 'CONFIRMED') && <ConfirmedAppointmentDetail />}
      {(status === 'COMPLETED') && <CompletedConsultationDetail />}
      {(status === 'CANCELLED') && <CancelledAppointmentDetail />}
      {!['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status) && <PendingAppointmentDetail />}
    </AppointmentContext.Provider>
  );
}

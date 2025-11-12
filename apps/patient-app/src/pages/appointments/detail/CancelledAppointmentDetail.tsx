import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CancellationInfoSection from '@appointment/pending/sections/CancellationInfoSection';
import AppointmentInfoSection from '@appointment/shared/sections/AppointmentInfoSection';
import TreatmentInfoSection from '@appointment/shared/sections/TreatmentInfoSection';
import AppointmentDetailLayout from '@layouts/AppointmentDetailLayout';
import { mockPatientBasicInfo, mockPatientDetailInfo } from '@mocks/appointments-list';
import { useAppointmentDetail } from './AppointmentDetailRouter';
import { format } from 'date-fns';

/**
 * 예약 취소 상세 페이지
 * - 취소된 예약 정보를 확인할 수 있음
 * - 취소 정보 섹션 (취소 일시, 취소자 등)
 * - 기존 예약 정보 섹션 재사용
 */
export default function CancelledAppointmentDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { appointment } = useAppointmentDetail();

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  if (!appointment) {
    return null;
  }

  // Format appointment data from API
  const formattedDateTime = appointment.scheduledAt
    ? format(new Date(appointment.scheduledAt), 'dd/MM/yyyy HH:mm')
    : '-';

  const cancelledAt = appointment.cancelledAt
    ? format(new Date(appointment.cancelledAt), 'dd/MM/yyyy HH:mm')
    : '-';

  const appointmentData = {
    appointmentNumber: appointment.externalId,
    appointmentType: appointment.appointmentType === 'QUICK' ? t('appointment.quickAppointment') : t('appointment.standardAppointment'),
    hospital: {
      name: appointment.hospital?.nameLocal || appointment.hospital?.nameEn || `Hospital ${appointment.hospitalId}`,
      phone: appointment.hospital?.phone || '-'
    },
    dateTime: formattedDateTime,
    doctor: appointment.doctor?.name || appointment.doctor?.nameEn || `Doctor ${appointment.doctorId}`,
    symptoms: appointment.symptoms,
    symptomImages: appointment.symptomImages
  };

  const cancellation = {
    cancelledAt,
    cancelledBy: appointment.cancelledBy || 'SYSTEM',
    reason: appointment.cancellationReason || undefined
  };

  return (
    <AppointmentDetailLayout
      title={t('appointment.cancelledDetail')}
      titleStyle={{ padding: '0 1.25rem' }}
      onBack={handleBack}
      onClose={handleClose}
      pageTitle={t('appointment.cancelledTitle')}
      customSection={
        <CancellationInfoSection
          hospital={appointmentData.hospital.name}
          phoneNumber={appointmentData.hospital.phone}
          cancelledAt={cancellation.cancelledAt}
          cancelledBy={cancellation.cancelledBy}
          reason={cancellation.reason}
        />
      }
      appointmentInfoSection={
        <AppointmentInfoSection
          data={{
            appointmentNumber: appointmentData.appointmentNumber,
            appointmentType: appointmentData.appointmentType,
            hospital: appointmentData.hospital,
            dateTime: appointmentData.dateTime,
            doctor: appointmentData.doctor
          }}
          status="cancelled"
        />
      }
      treatmentInfoSection={
        <TreatmentInfoSection
          symptoms={appointmentData.symptoms}
          symptomImages={appointmentData.symptomImages}
          readOnly
        />
      }
      patientBasicInfo={mockPatientBasicInfo}
      patientDetailInfo={mockPatientDetailInfo}
    />
  );
}

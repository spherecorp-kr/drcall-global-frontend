import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BottomButtons from '@ui/layout/BottomButtons';
import ConfirmModal from '@ui/modals/ConfirmModal';
import AppointmentInfoSection from '@appointment/shared/sections/AppointmentInfoSection';
import TreatmentInfoSection from '@appointment/shared/sections/TreatmentInfoSection';
import AppointmentDetailLayout from '@layouts/AppointmentDetailLayout';
import { mockPatientBasicInfo, mockPatientDetailInfo } from '@mocks/appointments-list';
import { useAppointmentStore } from '@store/appointmentStore';
import { useAppointmentDetail } from './AppointmentDetailRouter';
import { appointmentService } from '@/services/appointmentService';
import { format } from 'date-fns';

export default function PendingAppointmentDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { appointment, refreshAppointment } = useAppointmentDetail();
  const setSelectedListTab = useAppointmentStore((state) => state.setSelectedListTab);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!appointment || isCancelling) return;

    setIsCancelling(true);
    try {
      await appointmentService.cancelAppointment(appointment.id.toString(), 'Cancelled by patient');
      setIsCancelModalOpen(false);
      setSelectedListTab('cancelled');
      navigate('/appointments');
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert('Failed to cancel appointment');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
  };

  if (!appointment) {
    return null;
  }

  // Format appointment data for display
  const formattedDateTime = appointment.scheduledAt
    ? format(new Date(appointment.scheduledAt), 'dd/MM/yyyy HH:mm')
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

  return (
    <>
      <AppointmentDetailLayout
        title={t('appointment.pendingDetail')}
        titleStyle={{ padding: '0 1.25rem' }}
        onBack={handleBack}
        onClose={handleClose}
        pageTitle={t('appointment.pendingTitle')}
        appointmentInfoSection={
          <AppointmentInfoSection
            data={{
              appointmentNumber: appointmentData.appointmentNumber,
              appointmentType: appointmentData.appointmentType,
              hospital: appointmentData.hospital,
              dateTime: appointmentData.dateTime,
              doctor: appointmentData.doctor
            }}
            status="pending"
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
        noticeItems={[
          t('appointment.notices.pending'),
          t('appointment.notices.pendingToConfirmed')
        ]}
        hasBottomButton
        bottomButton={
          <BottomButtons
            leftButton={{
              text: t('appointment.cancel'),
              onClick: handleCancelClick
            }}
            rightButton={{
              text: t('appointment.reschedule'),
              onClick: () => navigate(`/appointments/${id}/edit`)
            }}
          />
        }
      />

      {/* 예약 취소 확인 모달 */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        message={t('appointment.cancelConfirm')}
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelModalClose}
      />
    </>
  );
}

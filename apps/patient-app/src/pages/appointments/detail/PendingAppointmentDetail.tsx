import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BottomButtons from '@ui/layout/BottomButtons';
import ConfirmModal from '@ui/modals/ConfirmModal';
import AppointmentInfoSection from '@appointment/shared/sections/AppointmentInfoSection';
import TreatmentInfoSection from '@appointment/shared/sections/TreatmentInfoSection';
import AppointmentDetailLayout from '@layouts/AppointmentDetailLayout';
import {
  mockAppointmentsDetails,
  mockPatientBasicInfo,
  mockPatientDetailInfo
} from '@mocks/appointments-list';
import { useAppointmentStore } from '@store/appointmentStore';

export default function PendingAppointmentDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const setSelectedListTab = useAppointmentStore((state) => state.setSelectedListTab);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const appointmentData = mockAppointmentsDetails[id || '1'];

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = () => {
    console.log('예약 취소 확인');
    setIsCancelModalOpen(false);
    setSelectedListTab('cancelled');
    navigate('/appointments');
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
  };

  useEffect(() => {
    if (!appointmentData) {
      navigate('/error/404', { replace: true });
    }
  }, [appointmentData, navigate]);

  if (!appointmentData) {
    return null;
  }

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

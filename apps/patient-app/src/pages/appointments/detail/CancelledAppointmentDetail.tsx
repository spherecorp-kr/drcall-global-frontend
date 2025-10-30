import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CancellationInfoSection from '@appointment/pending/sections/CancellationInfoSection';
import AppointmentInfoSection from '@appointment/shared/sections/AppointmentInfoSection';
import TreatmentInfoSection from '@appointment/shared/sections/TreatmentInfoSection';
import AppointmentDetailLayout from '@layouts/AppointmentDetailLayout';
import { mockAppointmentsDetails, mockPatientBasicInfo, mockPatientDetailInfo } from '@mocks/appointments-list';

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

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  // TODO: API에서 예약 취소 상세 정보 가져오기
  const appointmentData = mockAppointmentsDetails[id || '9'];

  if (!appointmentData) {
    return null;
  }

  // cancellation 데이터가 없으면 기본값 사용
  const cancellation = appointmentData.cancellation || {
    cancelledAt: appointmentData.dateTime?.split(' ')[0] || '',
    cancelledBy: '시스템',
    reason: undefined
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

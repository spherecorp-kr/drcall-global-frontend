import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import ProgressSteps from '@ui/display/ProgressSteps';
import BottomButtonLayout from '@layouts/BottomButtonLayout';
import Button from '@ui/buttons/Button';
import Notice from '@ui/display/Notice';
import InfoField from '@ui/display/InfoField';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import { useAppointmentStore } from '@store/appointmentStore';
import { formatDateTime } from '@utils/date';
import { mockUserInfo, mockHospitalInfo } from '@mocks/appointment';
import { appointmentService, type CreateAppointmentRequest } from '@/services/appointmentService';

type AppointmentType = 'standard' | 'quick';

interface ConfirmationProps {
  appointmentType?: AppointmentType;
}

export default function Confirmation({ appointmentType = 'standard' }: ConfirmationProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    selectedDate,
    selectedDoctorId,
    selectedDoctorName,
    selectedTimeSlot,
    symptoms,
    symptomImages,
    questionnaireAnswers,
    reset
  } = useAppointmentStore();

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate('/appointments/new');
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Build scheduledAt ISO string for STANDARD appointments
      let scheduledAt: string | undefined;
      if (appointmentType === 'standard' && selectedDate && selectedTimeSlot) {
        const [hours, minutes] = selectedTimeSlot.split(':');
        const dateTime = new Date(selectedDate);
        dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        scheduledAt = dateTime.toISOString();
      }

      // Map appointment data to API request
      const requestData: CreateAppointmentRequest = {
        // TODO: Get actual patientId and hospitalId from user context
        patientId: 1, // Hardcoded for development
        hospitalId: 1, // Hardcoded for development
        doctorId: selectedDoctorId ? parseInt(selectedDoctorId) : 1, // Use 1 if not selected (QUICK)
        appointmentType: appointmentType === 'quick' ? 'QUICK' : 'STANDARD',
        consultationType: 'VIDEO_CALL', // Default to VIDEO_CALL
        scheduledAt,
        symptoms,
        symptomImages,
        // Map questionnaire answers to flat fields
        height: questionnaireAnswers.height || '',
        weight: questionnaireAnswers.weight || '',
        bloodType: questionnaireAnswers.bloodType || '',
        alcohol: questionnaireAnswers.alcohol || '',
        smoking: questionnaireAnswers.smoking || '',
        medications: questionnaireAnswers.medications || '',
        personalHistory: questionnaireAnswers.personalHistory || '',
        familyHistory: questionnaireAnswers.familyHistory || '',
        currency: 'THB'
      };

      await appointmentService.createAppointment(requestData);

      alert(t('appointment.appointmentSuccess'));
      reset();
      navigate('/'); // Navigate to home
    } catch (error) {
      console.error('Failed to create appointment:', error);
      alert(t('appointment.appointmentError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock data - TODO: 실제로는 API에서 사용자 정보와 병원 정보를 가져와야 함
  const userName = mockUserInfo.name;
  const userPhone = mockUserInfo.phone;
  const hospitalName = mockHospitalInfo.name;

  const noticeItems = [
    t('appointment.noticeEditCancel'),
    t('appointment.noticeCallHospital'),
    t('appointment.noticeCancelDeadline')
  ];

  return (
    <MainLayout
      title={t('appointment.confirmationTitle')}
      fullWidth
      contentClassName="p-0"
    >
      <PageContainer hasBottomButton style={{ background: '#FAFAFA' }}>
        {/* Progress Steps */}
        <PageSection style={{ padding: '0 0 0.625rem 0' }}>
          <ProgressSteps
            currentStep={appointmentType === 'quick' ? 3 : 4}
            totalSteps={appointmentType === 'quick' ? 3 : 4}
            labels={appointmentType === 'quick' ? [
              t('appointment.progressSteps.symptoms'),
              t('appointment.progressSteps.questionnaire'),
              t('appointment.progressSteps.confirmation')
            ] : [
              t('appointment.progressSteps.date'),
              t('appointment.progressSteps.symptoms'),
              t('appointment.progressSteps.questionnaire'),
              t('appointment.progressSteps.confirmation')
            ]}
          />
        </PageSection>

        {/* Check Icon and Message */}
        <PageSection style={{ padding: '0 1.25rem 0 1.25rem' }}>
          <div className="flex flex-col items-center gap-[1.875rem] pt-10 pb-5">
            <img
              src="/assets/icons/check-large.svg"
              alt="완료"
              className="w-20 h-20"
            />
            <h2 className="text-2xl font-semibold text-[#1F1F1F] leading-[1.4] text-center">
              {t('appointment.confirmationComplete')}
            </h2>
          </div>
        </PageSection>

        {/* Appointment Details */}
        <PageSection padding>
          <div className="bg-white rounded-[10px] flex flex-col gap-4" style={{ padding: '1.25rem' }}>
            <InfoField label={t('appointment.name')} value={userName} gap="0.375rem" />
            <InfoField label={t('appointment.phone')} value={userPhone} gap="0.375rem" />
            <InfoField
              label={t('appointment.appointmentType')}
              value={appointmentType === 'quick' ? t('appointment.quickAppointment') : t('appointment.standardAppointment')}
              gap="0.375rem"
            />
            <InfoField label={t('appointment.hospital')} value={hospitalName} gap="0.375rem" />

            {/* 진료 희망 일시 - 일반 예약만 표시 */}
            {appointmentType === 'standard' && (
              <InfoField
                label={t('appointment.preferredDateTime')}
                value={formatDateTime(selectedDate, selectedTimeSlot)}
                gap="0.375rem"
              />
            )}

            {/* 진료 희망 의사 - 일반 예약만 표시 */}
            {appointmentType === 'standard' && (
              <InfoField label={t('appointment.preferredDoctor')} value={selectedDoctorName} gap="0.375rem" />
            )}
          </div>
        </PageSection>

        {/* Notice */}
        <PageSection padding>
          <Notice items={noticeItems} />
        </PageSection>
      </PageContainer>

      {/* Bottom Button */}
      <BottomButtonLayout fullWidth contentClassName="">
        <Button onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? t('common.submitting') : t('common.confirm')}
        </Button>
      </BottomButtonLayout>
    </MainLayout>
  );
}

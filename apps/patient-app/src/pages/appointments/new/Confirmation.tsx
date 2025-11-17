import { useState, useEffect } from 'react';
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
import { useAuth } from '@hooks/useAuth';
import { getHospitalService } from '@services';
import { useCreateAppointment } from '@hooks/queries/useAppointmentQueries';
import { useToast } from '@hooks/useToast';
import { logError } from '@utils/errorHandler';
import type { AlcoholConsumption, SmokingStatus } from '@/types/appointment';

type AppointmentType = 'standard' | 'quick';

interface ConfirmationProps {
  appointmentType?: AppointmentType;
}

/**
 * Convert date and time slot to ISO 8601 format
 * @param date - Selected date
 * @param timeSlot - Time slot string (e.g., "14:01~14:15")
 * @returns ISO 8601 formatted datetime string
 */
function convertToISO8601(date: Date | null, timeSlot: string | null): string | undefined {
  if (!date || !timeSlot) return undefined;
  
  // Extract start time from timeSlot (e.g., "14:01~14:15" -> "14:01")
  const startTime = timeSlot.split('~')[0]?.trim();
  if (!startTime) return undefined;
  
  const [hours, minutes] = startTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return undefined;
  
  // Create new date with selected time
  const datetime = new Date(date);
  datetime.setHours(hours, minutes, 0, 0);
  
  return datetime.toISOString();
}

export default function Confirmation({ appointmentType = 'standard' }: ConfirmationProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const createAppointmentMutation = useCreateAppointment();
  
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

  // Hospital and user info state
  const [hospitalName, setHospitalName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch hospital info on mount
  useEffect(() => {
    const fetchHospitalInfo = async () => {
      try {
        const hospitalService = getHospitalService();
        const hospital = await hospitalService.getCurrentHospital();
        setHospitalName(hospital.nameLocal || hospital.nameEn);
      } catch (error) {
        console.error('Failed to fetch hospital info:', error);
        // Don't show error toast here - hospital name is not critical
      }
    };

    fetchHospitalInfo();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate('/appointments/new');
  };

  const handleConfirm = async () => {
    // Validation
    if (!user?.id) {
      showToast(t('appointment.errorNotLoggedIn'), 'error');
      return;
    }

    // STANDARD 타입: 날짜, 의사, 시간 필수
    if (appointmentType === 'standard') {
      if (!selectedDate || !selectedDoctorId || !selectedTimeSlot) {
        showToast(t('appointment.errorMissingDateTime'), 'error');
        return;
      }
    }
    // QUICK 타입: 병원이 나중에 의사와 스케줄을 할당하므로 doctorId 불필요

    if (!symptoms?.trim()) {
      showToast(t('appointment.enterSymptoms'), 'error');
      return;
    }

    try {
      setIsLoading(true);

      // Get hospital info
      const hospitalService = getHospitalService();
      const hospital = await hospitalService.getCurrentHospital();

      // Prepare request data
      const scheduledAt = appointmentType === 'standard' 
        ? convertToISO8601(selectedDate, selectedTimeSlot)
        : undefined;

      // Convert questionnaire answers
      const questionnaireData = {
        height: questionnaireAnswers.height || '',
        weight: questionnaireAnswers.weight || '',
        bloodType: questionnaireAnswers.bloodType as 'A' | 'B' | 'O' | 'AB' | undefined,
        alcohol: questionnaireAnswers.alcohol as AlcoholConsumption | string | undefined,
        smoking: questionnaireAnswers.smoking as SmokingStatus | string | undefined,
        medications: questionnaireAnswers.medications || '',
        personalHistory: questionnaireAnswers.personalHistory || '',
        familyHistory: questionnaireAnswers.familyHistory || '',
      };

      // Create appointment
      // QUICK 타입: doctorId와 dateTime 제외 (병원이 나중에 할당)
      // STANDARD 타입: doctorId와 dateTime 필수
      // patientId는 patient-service에서 세션에서 자동으로 추가됨
      await createAppointmentMutation.mutateAsync({
        appointmentType,
        hospitalId: String(hospital.id),
        doctorId: (appointmentType === 'standard' && selectedDoctorId) ? selectedDoctorId : undefined,
        dateTime: scheduledAt ? scheduledAt : undefined, // STANDARD일 때만 값이 있음
        symptoms: symptoms.trim(),
        symptomImages: symptomImages.length > 0 ? symptomImages : undefined,
        questionnaireAnswers: questionnaireData,
      });

      // Success
      showToast(t('appointment.createSuccess'), 'success');
      reset();
      
      // Navigate to appointments list after a short delay
      setTimeout(() => {
        navigate('/appointments');
      }, 1000);
    } catch (error) {
      console.error('Failed to create appointment:', error);
      logError(error, { 
        feature: 'Appointment', 
        action: 'createAppointment',
        metadata: { appointmentType }
      });
      
      // Show error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('appointment.createError');
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const userName = user?.name || '';
  const userPhone = user?.phone || '';

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
        <Button onClick={handleConfirm} disabled={isLoading || createAppointmentMutation.isPending}>
          {isLoading || createAppointmentMutation.isPending 
            ? t('common.loading') 
            : t('common.confirm')}
        </Button>
      </BottomButtonLayout>

      {/* Toast */}
      {ToastComponent}
    </MainLayout>
  );
}

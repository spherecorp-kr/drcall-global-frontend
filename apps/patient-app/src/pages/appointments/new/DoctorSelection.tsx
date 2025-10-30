import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import ProgressSteps from '@ui/display/ProgressSteps';
import BottomButtonLayout from '@layouts/BottomButtonLayout';
import Button from '@ui/buttons/Button';
import PageTitle from '@ui/layout/PageTitle';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import Divider from '@ui/layout/Divider';
import CalendarModal from '@ui/modals/CalendarModal';
import DoctorCard from '@components/doctor/cards/DoctorCard';
import EmptyDoctorState from '@components/doctor/EmptyDoctorState';
import { useAppointmentStore } from '@store/appointmentStore';
import { useDoctorSelection } from '@hooks/useDoctorSelection';
import { mockDoctors } from '@mocks/doctors';
import { formatDate } from '@utils/date';

export default function DoctorSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setDateTimeDoctor = useAppointmentStore((state) => state.setDateTimeDoctor);
  const setStep = useAppointmentStore((state) => state.setStep);

  // Use custom hook for selection logic
  const {
    selectedDate,
    selectedDoctor,
    selectedDoctorName,
    selectedTimeSlots,
    isCalendarOpen,
    isSelectionComplete,
    handleDateSelect,
    handleTimeSlotSelect,
    openCalendar,
    closeCalendar
  } = useDoctorSelection();

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/appointments/new');

  const handleNext = () => {
    if (isSelectionComplete) {
      // Data is already saved in real-time, just move to next step
      setStep(2);
    }
  };

  return (
    <MainLayout
      title={t('appointment.selectDoctorAndDateTime')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName="p-0"
    >
      <PageContainer hasBottomButton>
        {/* Progress Steps */}
        <PageSection padding background="white">
          <ProgressSteps
            currentStep={1}
            totalSteps={4}
            labels={[
              t('appointment.progressSteps.date'),
              t('appointment.progressSteps.symptoms'),
              t('appointment.progressSteps.questionnaire'),
              t('appointment.progressSteps.confirmation')
            ]}
          />
        </PageSection>

        <Divider />

        {/* Title */}
        <PageSection padding>
          <PageTitle>{t('appointment.selectDateTime')}</PageTitle>
        </PageSection>

        {/* Date Picker Button */}
        <PageSection padding>
          <button
            onClick={openCalendar}
            style={{
              width: '100%',
              height: '2.875rem',
              paddingLeft: '1.25rem',
              paddingRight: '1.25rem',
              background: 'white',
              boxShadow: '0px 0px 10px rgba(180, 180, 180, 0.50)',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}
          >
            <div style={{
              flex: 1,
              textAlign: 'center',
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              {formatDate(selectedDate)}
            </div>
            <img
              src="/assets/icons/calendar-today.svg"
              alt="calendar"
              style={{ width: '1.5rem', height: '1.5rem' }}
            />
          </button>
        </PageSection>

        <Divider />

        {/* Doctor Cards or Empty State */}
        {mockDoctors.length > 0 ? (
          <PageSection padding style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {mockDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                selectedTimeSlot={
                  selectedDoctor === doctor.id
                    ? selectedTimeSlots[doctor.id]
                    : undefined
                }
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            ))}
          </PageSection>
        ) : (
          <EmptyDoctorState />
        )}
      </PageContainer>

      {/* Bottom Button */}
      <BottomButtonLayout fullWidth contentClassName="">
        <Button onClick={handleNext} disabled={!isSelectionComplete}>
          {t('common.next')}
        </Button>
      </BottomButtonLayout>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={closeCalendar}
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
      />
    </MainLayout>
  );
}

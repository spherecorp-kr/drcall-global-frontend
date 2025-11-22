import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import PageTitle from '@ui/layout/PageTitle';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import { useAppointmentStore } from '@store/appointmentStore';

export default function AppointmentNew() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const reset = useAppointmentStore((state) => state.reset);

  // Reset appointment data when entering this page
  useEffect(() => {
    reset();
  }, [reset]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleQuickAppointment = () => {
    navigate('/appointments/new/quick');
  };

  const handleStandardAppointment = () => {
    navigate('/appointments/new/standard');
  };

  return (
    <MainLayout
      title={t('appointment.newAppointment')}
      onClose={handleClose}
      fullWidth
      contentClassName="p-0"
    >
      <PageContainer style={{ background: 'transparent' }}>
        {/* Title */}
        <PageSection style={{ padding: '0 1.25rem' }}>
          <PageTitle>{t('appointment.selectAppointmentType')}</PageTitle>
        </PageSection>

        {/* Appointment Type Cards */}
        <PageSection padding style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Quick Appointment Card */}
          <button
            onClick={handleQuickAppointment}
            style={{
              width: '100%',
              textAlign: 'left',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {/* Card background with icon */}
              <div style={{
                width: '100%',
                height: '6.4375rem',
                background: '#00A0D2',
                borderRadius: '0.625rem',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '1.5rem'
              }}>
                {/* Doctor icon */}
                <img
                  src="/assets/icons/doctor.png"
                  alt="Doctor"
                  style={{ width: '4.5rem', height: '4.5rem' }}
                />
                {/* Title overlay */}
                <div style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  {t('appointment.quickAppointment')}
                </div>
              </div>
              {/* Description */}
              <p style={{
                color: '#2F2F2F',
                fontSize: '1rem',
                fontWeight: '400',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {t('appointment.quickAppointmentDesc')}
              </p>
            </div>
          </button>

          {/* Standard Appointment Card */}
          <button
            onClick={handleStandardAppointment}
            style={{
              width: '100%',
              textAlign: 'left',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {/* Card background with icon */}
              <div style={{
                width: '100%',
                height: '6.4375rem',
                background: '#00A0D2',
                borderRadius: '0.625rem',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '1.5rem'
              }}>
                {/* Calendar icon */}
                <img
                  src="/assets/icons/calendar-icon.png"
                  alt="Calendar"
                  style={{ width: '4.5rem', height: '4.5rem' }}
                />
                {/* Title overlay */}
                <div style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  {t('appointment.standardAppointment')}
                </div>
              </div>
              {/* Description */}
              <p style={{
                color: '#2F2F2F',
                fontSize: '1rem',
                fontWeight: '400',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {t('appointment.standardAppointmentDesc')}
              </p>
            </div>
          </button>
        </PageSection>
      </PageContainer>
    </MainLayout>
  );
}

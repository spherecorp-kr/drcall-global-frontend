import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import Button from '@ui/buttons/Button';
import BottomButtonLayout from '@layouts/BottomButtonLayout';

interface AppointmentEditCompleteState {
  appointmentNumber: string;
  appointmentType: string;
  hospital: string;
  dateTime: string;
  doctor: string;
  symptoms: string;
  patientName: string;
  patientBirthDate: string;
  patientGender: string;
  patientPhone: string;
  patientHeight: string;
  patientWeight: string;
  patientBloodType: string;
  patientAlcohol: string;
  patientSmoking: string;
  patientMedications: string;
  patientPersonalHistory: string;
  patientFamilyHistory: string;
}

/**
 * 예약 수정 완료 페이지
 * - 수정된 예약 정보를 보여줌
 * - 확인 버튼으로 상세 페이지로 이동
 */
export default function AppointmentEditComplete() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const state = location.state as AppointmentEditCompleteState;

  const handleConfirm = () => {
    // 예약 리스트로 이동 (AppointmentEdit에서 이미 탭 상태를 'pending'으로 설정함)
    navigate('/appointments');
  };

  if (!state) {
    // state가 없으면 홈으로 리다이렉트
    navigate('/');
    return null;
  }

  return (
    <MainLayout title={t('appointment.editCompleteTitle')} fullWidth contentClassName="">
      <div
        style={{
          paddingBottom: '4.375rem',
          background: '#FAFAFA',
          minHeight: 'calc(100vh - 3.5rem)'
        }}
      >
        {/* Check Icon and Message */}
        <div
          style={{
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            marginTop: '1.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.875rem'
          }}
        >
          <img
            src="/assets/icons/check-large.svg"
            alt="완료"
            style={{ width: '5.375rem', height: '5.375rem' }}
          />
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1F1F1F',
              lineHeight: '1.4',
              margin: 0,
              textAlign: 'center'
            }}
          >
            {t('appointment.editComplete')}
          </h2>
        </div>

        {/* Appointment Details Card */}
        <div
          style={{
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            paddingBottom: '1.25rem'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '0.625rem',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {/* 예약 정보 */}
            <div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1F1F1F',
                  margin: 0,
                  marginBottom: '1rem'
                }}
              >
                {t('appointment.appointmentInfo')}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <InfoItem label={t('appointment.appointmentNumber')} value={state.appointmentNumber} />
                <InfoItem label={t('appointment.appointmentType')} value={state.appointmentType} />
                <InfoItem label={t('appointment.hospital')} value={state.hospital} />
                <InfoItem
                  label={t('appointment.preferredDateTime')}
                  value={
                    <>
                      · {state.dateTime}
                      <br />· {state.doctor}
                    </>
                  }
                />
                <InfoItem label={t('appointment.doctor')} value={state.doctor} />
              </div>
            </div>

            {/* 진료 정보 */}
            <div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1F1F1F',
                  margin: 0,
                  marginBottom: '1rem'
                }}
              >
                {t('appointment.treatmentInfo')}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <InfoItem
                  label={t('appointment.symptoms')}
                  value={state.symptoms.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                />
              </div>
            </div>

            {/* 환자 정보 */}
            <div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1F1F1F',
                  margin: 0,
                  marginBottom: '1rem'
                }}
              >
                {t('appointment.patientInfo')}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <InfoItem label={t('appointment.name')} value={state.patientName} />
                <InfoItem label={t('appointment.birthDate')} value={state.patientBirthDate} />
                <InfoItem label={t('appointment.gender')} value={state.patientGender} />
                <InfoItem label={t('appointment.phone')} value={state.patientPhone} />
                <InfoItem
                  label={t('appointment.heightWeight')}
                  value={`${state.patientHeight} / ${state.patientWeight}`}
                />
                <InfoItem label={t('appointment.bloodType')} value={state.patientBloodType} />
                <InfoItem
                  label={t('appointment.alcohol')}
                  value={state.patientAlcohol}
                />
                <InfoItem
                  label={t('appointment.smoking')}
                  value={state.patientSmoking}
                />
                <InfoItem label={t('appointment.medications')} value={state.patientMedications} />
                <InfoItem label={t('appointment.personalHistory')} value={state.patientPersonalHistory} />
                <InfoItem label={t('appointment.familyHistory')} value={state.patientFamilyHistory} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <BottomButtonLayout fullWidth contentClassName="">
        <Button onClick={handleConfirm}>{t('common.confirm')}</Button>
      </BottomButtonLayout>
    </MainLayout>
  );
}

// Helper component for info items
interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}
    >
      <div
        style={{
          color: '#8A8A8A',
          fontSize: '0.875rem',
          fontWeight: '400'
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: '#1F1F1F',
          fontSize: '1rem',
          fontWeight: '400',
          lineHeight: '1.5'
        }}
      >
        {value}
      </div>
    </div>
  );
}

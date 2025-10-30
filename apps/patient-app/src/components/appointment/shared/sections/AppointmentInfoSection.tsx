import { useTranslation } from 'react-i18next';
import PageSection from '@ui/layout/PageSection';
import InfoField from '@ui/display/InfoField';

interface AppointmentInfo {
  appointmentNumber: string;
  appointmentType?: string;
  hospital: {
    name: string;
    nameEn?: string;
    phone: string;
  };
  dateTime?: string;
  doctor?: string;
  completedAt?: string;
}

interface AppointmentInfoSectionProps {
  data: AppointmentInfo;
  onDateTimeEdit?: () => void;
  showEditButton?: boolean;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

/**
 * 예약 정보 섹션 컴포넌트
 * - 예약번호, 예약유형, 병원, 진료 희망 일시 & 의사 표시
 * - 읽기 전용 모드
 * - 수정 페이지에서는 날짜/의사 수정 버튼 표시 가능
 */
export default function AppointmentInfoSection({
  data,
  onDateTimeEdit,
  showEditButton = false,
  status = 'pending'
}: AppointmentInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <PageSection title={t('appointment.appointmentInfo')} gap="md">
      {/* 예약 번호 */}
      <InfoField
        icon="/assets/icons/ic_number.svg"
        label={t('appointment.appointmentNumber')}
        value={data.appointmentNumber}
      />

      {/* 예약 유형 */}
      {data.appointmentType && (
        <InfoField
          icon="/assets/icons/ic_type treat.svg"
          label={t('appointment.appointmentType')}
          value={t(data.appointmentType)}
        />
      )}

      {/* 병원 */}
      <InfoField
        icon="/assets/icons/hospital.svg"
        label={t('appointment.hospital')}
        value={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}
          >
            <span>
              {data.hospital.name}
              {data.hospital.nameEn && ` (${data.hospital.nameEn})`}
            </span>
            {data.hospital.phone && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.1875rem',
                  color: '#8A8A8A',
                  fontSize: '1rem'
                }}
              >
                <span>(</span>
                <img
                  src="/assets/icons/ic_call.svg"
                  alt=""
                  style={{ width: '0.875rem', height: '0.875rem' }}
                />
                <span>{data.hospital.phone}</span>
                <span>)</span>
              </div>
            )}
          </div>
        }
      />

      {/* 진료 희망 일시 & 의사 / 진료 완료 일시 & 의사 (Optional) */}
      {(data.dateTime || data.doctor || data.completedAt) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.625rem'
          }}
        >
          <img
            src="/assets/icons/calendar-2.svg"
            alt=""
            style={{
              width: '1.25rem',
              height: '1.25rem',
              marginTop: '0.125rem'
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}
            >
              <div
                style={{
                  color: '#1F1F1F',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}
              >
                {data.completedAt
                  ? t('appointment.completedDateTime')
                  : status === 'confirmed'
                    ? t('appointment.scheduledDateTime')
                    : t('appointment.preferredDateTime')}
              </div>

              {/* 수정 버튼 (옵션) */}
              {showEditButton && onDateTimeEdit && (
                <button
                  onClick={onDateTimeEdit}
                  style={{
                    padding: '0.25rem 0.75rem',
                    background: 'white',
                    borderRadius: '0.625rem',
                    border: '1.5px solid #D9D9D9',
                    color: '#1F1F1F',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {t('common.edit')}
                </button>
              )}
            </div>

            <div
              style={{
                color: '#1F1F1F',
                fontSize: '0.9375rem',
                fontWeight: '400',
                lineHeight: '1.5'
              }}
            >
              {(data.completedAt || data.dateTime) && `· ${data.completedAt || data.dateTime}`}
              {(data.completedAt || data.dateTime) && data.doctor && <br />}
              {data.doctor && `· ${data.doctor}`}
            </div>
          </div>
        </div>
      )}
    </PageSection>
  );
}

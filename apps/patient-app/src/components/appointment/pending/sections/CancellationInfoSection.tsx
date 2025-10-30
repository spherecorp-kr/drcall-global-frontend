import { useTranslation } from 'react-i18next';
import InfoField from '@ui/display/InfoField';

interface CancellationInfoSectionProps {
  hospital: string;
  phoneNumber: string;
  cancelledAt: string;
  cancelledBy: string;
  reason?: string;
}

/**
 * 취소 정보 섹션
 * - 병원
 * - 취소 일시
 * - 취소자 및 사유
 */
export default function CancellationInfoSection({
  hospital,
  phoneNumber,
  cancelledAt,
  cancelledBy,
  reason
}: CancellationInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      <div
        style={{
          color: '#1F1F1F',
          fontSize: '1.125rem',
          fontWeight: '600'
        }}
      >
        {t('appointment.cancellationInfo')}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        {/* 병원 */}
        <InfoField
          icon="/assets/icons/hospital.svg"
          label={t('appointment.hospital')}
          value={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>{hospital}</span>
              {phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.1875rem', color: '#8A8A8A', fontSize: '1rem' }}>
                  <span>(</span>
                  <img
                    src="/assets/icons/ic_call.svg"
                    alt=""
                    style={{ width: '0.875rem', height: '0.875rem' }}
                  />
                  <span>{phoneNumber}</span>
                  <span>)</span>
                </div>
              )}
            </div>
          }
        />

        {/* 취소 일시 */}
        <InfoField
          icon="/assets/icons/calendar-2.svg"
          label={t('appointment.cancelledDetail').replace(' 상세', ' 일시')}
          value={cancelledAt}
        />

        {/* 취소자 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem'
            }}
          >
            <img
              src="/assets/icons/user-square.svg"
              alt=""
              style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.125rem' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 1
              }}
            >
              <div
                style={{
                  color: '#1F1F1F',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}
              >
                {t('appointment.cancelledBy')}
              </div>
              <div
                style={{
                  color: '#1F1F1F',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}
              >
                {t(cancelledBy)}
              </div>
            </div>
          </div>

          {/* 취소 사유 */}
          {reason && (
            <div
              style={{
                minHeight: '5rem',
                background: '#FAFAFA',
                borderRadius: '0.5rem',
                border: '1px solid #E0E0E0',
                padding: '0.5rem 1rem 0.875rem 1rem',
                color: '#1F1F1F',
                fontSize: '0.875rem',
                fontWeight: '400',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}
            >
              {reason}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

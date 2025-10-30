import { useTranslation } from 'react-i18next';

interface DirectPickupInfoSectionProps {
  pickupNumber: string;
  address: string;
  pickupLocation: string;
  operatingHours: string;
  phoneNumber: string;
}

/**
 * 직접 수령 정보 섹션 컴포넌트
 * - 조제 번호, 주소, 수령 위치, 운영 시간, 연락처 표시
 */
export default function DirectPickupInfoSection({
  pickupNumber,
  address,
  pickupLocation,
  operatingHours,
  phoneNumber
}: DirectPickupInfoSectionProps) {
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
        {t('appointment.directPickupInfo')}
      </div>

      <div
        style={{
          padding: '1.25rem',
          background: 'white',
          borderRadius: '0.625rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        {/* 조제 번호 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('appointment.pickupNumber')}
          </div>
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400'
            }}
          >
            {pickupNumber}
          </div>
        </div>

        {/* 주소 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('auth.address')}
          </div>
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400'
            }}
          >
            {address}
          </div>
        </div>

        {/* 수령 위치 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('appointment.pickupLocation')}
          </div>
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400'
            }}
          >
            {pickupLocation}
          </div>
        </div>

        {/* 운영 시간 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('appointment.operatingHours')}
          </div>
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400',
              whiteSpace: 'pre-line'
            }}
          >
            {operatingHours}
          </div>
        </div>

        {/* 연락처 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('appointment.contact')}
          </div>
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400'
            }}
          >
            {phoneNumber}
          </div>
        </div>
      </div>
    </div>
  );
}

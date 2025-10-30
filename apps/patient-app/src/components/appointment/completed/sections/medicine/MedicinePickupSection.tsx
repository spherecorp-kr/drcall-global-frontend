import { useTranslation } from 'react-i18next';
import type { MedicinePickupInfo } from '@/types/completed';

interface MedicinePickupSectionProps {
  medicinePickup: MedicinePickupInfo;
}

export default function MedicinePickupSection({ medicinePickup }: MedicinePickupSectionProps) {
  const { t } = useTranslation();
  const { method, pickupNumber, location, locationDetail, phoneNumber, availableFrom, availableTo, availableTime } = medicinePickup;

  const getMethodConfig = () => {
    switch (method) {
      case 'none':
        return {
          text: t('appointment.medicineNone'),
          color: '#8A8A8A',
          showDetails: false
        };
      case 'direct':
        return {
          text: t('appointment.medicineDirectPickup'),
          color: '#00A0D2',
          showDetails: true
        };
      case 'delivery_standard':
      case 'delivery_quick':
      case 'delivery_international':
        return {
          text: t('appointment.medicineDelivery'),
          color: '#00A0D2',
          showDetails: true
        };
      default:
        return {
          text: '',
          color: '#8A8A8A',
          showDetails: false
        };
    }
  };

  const config = getMethodConfig();

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/assets/icons/ic_pm.svg"
            alt="medicine"
            style={{ width: 22, height: 22 }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#1F1F1F'
            }}
          >
            {t('appointment.medicinePickup')}
          </span>
        </div>
        <span
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: config.color
          }}
        >
          {config.text}
        </span>
      </div>

      {/* 직접 수령 상세 정보 */}
      {config.showDetails && method === 'direct' && (
        <div
          style={{
            padding: '12px',
            background: '#F8F8F8',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {pickupNumber && (
            <div>
              <div style={{ fontSize: 13, color: '#8A8A8A', marginBottom: '4px' }}>
                {t('appointment.pickupNumber')}
              </div>
              <div style={{ fontSize: 14, fontWeight: '600', color: '#1F1F1F' }}>
                {pickupNumber}
              </div>
            </div>
          )}
          {(location || locationDetail) && (
            <div>
              <div style={{ fontSize: 13, color: '#8A8A8A', marginBottom: '4px' }}>
                {t('appointment.pickupLocation')}
              </div>
              <div style={{ fontSize: 14, color: '#1F1F1F' }}>
                {location}
                {locationDetail && ` (${locationDetail})`}
                {phoneNumber && ` Call. ${phoneNumber}`}
              </div>
            </div>
          )}
          {(availableFrom || availableTo || availableTime) && (
            <div>
              <div style={{ fontSize: 13, color: '#8A8A8A', marginBottom: '4px' }}>
                {t('appointment.pickupAvailableTime')}
              </div>
              <div style={{ fontSize: 14, color: '#1F1F1F' }}>
                {availableFrom && availableTo && `${availableFrom} ~ ${availableTo}`}
                {availableTime && `, ${availableTime}`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 배송 상세 정보 */}
      {config.showDetails && (method === 'delivery_standard' || method === 'delivery_quick' || method === 'delivery_international') && (
        <div
          style={{
            padding: '12px',
            background: '#F8F8F8',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {/* TODO: 배송 정보 추가 */}
          <div style={{ fontSize: 14, color: '#8A8A8A' }}>
            {t('appointment.deliveryInfoPreparing')}
          </div>
        </div>
      )}
    </div>
  );
}

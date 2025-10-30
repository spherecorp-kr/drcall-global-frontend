import { useTranslation } from 'react-i18next';
import Notice from '@ui/display/Notice';

export type MedicineDeliveryMethod = 'standard' | 'quick' | 'international' | 'direct';

interface MedicineDeliverySelectorProps {
  selectedMethod: MedicineDeliveryMethod | null;
  onSelect: (method: MedicineDeliveryMethod) => void;
}

/**
 * 약 배송 방법 선택 컴포넌트
 * - 일반 배송, 퀵 배송, 해외 배송, 직접 수령 선택
 */
export default function MedicineDeliverySelector({
  selectedMethod,
  onSelect
}: MedicineDeliverySelectorProps) {
  const { t } = useTranslation();

  const methods: Array<{ value: MedicineDeliveryMethod; label: string }> = [
    { value: 'standard', label: t('appointment.deliveryStandard') },
    { value: 'quick', label: t('appointment.deliveryQuick') },
    { value: 'international', label: t('appointment.deliveryInternational') },
    { value: 'direct', label: t('appointment.deliveryDirect') }
  ];

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
        {t('appointment.medicineDeliveryMethod')}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        {methods.map((method) => (
          <label
            key={method.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              cursor: 'pointer'
            }}
          >
            <div
              onClick={() => onSelect(method.value)}
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                border: '1px solid #E0E0E0',
                background: selectedMethod === method.value ? '#00A0D2' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {selectedMethod === method.value && (
                <div
                  style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '50%',
                    background: 'white'
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                color: '#1F1F1F'
              }}
            >
              {method.label}
            </span>
          </label>
        ))}
      </div>

      {/* 유의사항 */}
      <Notice
        items={[t('appointment.deliveryFeeNotice')]}
      />
    </div>
  );
}

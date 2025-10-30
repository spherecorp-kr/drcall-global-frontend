import { useTranslation } from 'react-i18next';

export type PaymentMethod = 'qr' | 'card' | 'easy' | 'account';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

/**
 * 결제 수단 선택 컴포넌트
 * - QR 결제, 신용/체크 카드, 간편 결제, 계좌 이체 선택
 */
export default function PaymentMethodSelector({
  selectedMethod,
  onSelect
}: PaymentMethodSelectorProps) {
  const { t } = useTranslation();

  const methods: Array<{ value: PaymentMethod; label: string }> = [
    { value: 'qr', label: t('appointment.paymentMethodQr') },
    { value: 'card', label: t('appointment.paymentMethodCard') },
    { value: 'easy', label: t('appointment.paymentMethodEasy') },
    { value: 'account', label: t('appointment.paymentMethodAccount') }
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
        {t('appointment.paymentMethod')}
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
    </div>
  );
}

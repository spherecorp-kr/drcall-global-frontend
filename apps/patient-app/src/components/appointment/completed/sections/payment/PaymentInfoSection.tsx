import { useTranslation } from 'react-i18next';
import type { PaymentInfo } from '@/types/completed';
import PaymentStatusBadge from '@appointment/completed/badges/PaymentStatusBadge';
import Notice from '@ui/display/Notice';
import PaymentAmountDisplay from '@appointment/shared/payment/PaymentAmountDisplay';

interface PaymentInfoSectionProps {
  payment: PaymentInfo;
  onPayment?: () => void;
}

export default function PaymentInfoSection({ payment }: PaymentInfoSectionProps) {
  const { t } = useTranslation();
  const { status, totalAmount, consultationFee, prescriptionFee, serviceFee, method, bankName, accountNumber, accountHolder, paymentConfirmedDate } = payment;

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
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
            src="/assets/icons/ic_card.svg"
            alt="payment"
            style={{ width: 22, height: 22 }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#1F1F1F'
            }}
          >
            {t('appointment.paymentInfo')}
          </span>
        </div>
        <PaymentStatusBadge status={status} />
      </div>

      {/* 청구 예정 상태 메시지 */}
      {status === 'pending_billing' && (
        <div
          style={{
            height: '5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#979797',
            fontSize: '1rem',
            fontWeight: '400',
            whiteSpace: 'pre-line'
          }}
        >
          {t('appointment.paymentNotReady')}
        </div>
      )}

      {/* 결제 대기 상태 - 유의사항 */}
      {status === 'pending_payment' && (
        <Notice
          items={[t('appointment.deliveryFeeWarning')]}
        />
      )}

      {/* 결제 방법 (결제 완료 시) */}
      {status === 'payment_complete' && method === 'account_transfer' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: 16, fontWeight: '600', color: '#1F1F1F' }}>
            {t('appointment.paymentMethod')}
          </div>
          <div
            style={{
              padding: '12px',
              background: '#F8F8F8',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ fontSize: 14, fontWeight: '600', color: '#1F1F1F' }}>
              {t('appointment.paymentMethodAccount')}
            </div>
            <div style={{ fontSize: 13, color: '#8A8A8A' }}>
              {t('appointment.hospitalAccountNumber')}
            </div>
            {bankName && (
              <div style={{ fontSize: 13, color: '#1F1F1F' }}>{bankName}</div>
            )}
            {accountHolder && (
              <div style={{ fontSize: 13, color: '#1F1F1F' }}>{accountHolder}</div>
            )}
            {accountNumber && (
              <div style={{ fontSize: 13, color: '#1F1F1F' }}>{accountNumber}</div>
            )}
            {paymentConfirmedDate && (
              <div style={{ fontSize: 13, color: '#8A8A8A', marginTop: '4px' }}>
                {t('appointment.paymentConfirmDate')}: {paymentConfirmedDate}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 결제 금액 (결제 대기 or 결제 완료) */}
      {(status === 'pending_payment' || status === 'payment_complete') && totalAmount !== undefined && (
        <PaymentAmountDisplay
          totalAmount={totalAmount}
          consultationFee={consultationFee}
          prescriptionFee={prescriptionFee}
          serviceFee={serviceFee}
        />
      )}
    </div>
  );
}

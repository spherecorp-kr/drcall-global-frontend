import { useTranslation } from 'react-i18next';

interface PaymentAmountDisplayProps {
  totalAmount: number;
  consultationFee?: number;
  prescriptionFee?: number;
  serviceFee?: number;
  deliveryFee?: number;
}

/**
 * 결제 금액 표시 컴포넌트
 * - 총 금액, 진료비, 조제비, 서비스비 표시
 * - PaymentInfoSection과 PaymentPage에서 공통 사용
 */
export default function PaymentAmountDisplay({
  totalAmount,
  consultationFee,
  prescriptionFee,
  serviceFee,
  deliveryFee
}: PaymentAmountDisplayProps) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem'
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <img
          src="/assets/icons/ic_info.svg"
          alt="payment amount"
          style={{
            width: '1.375rem',
            height: '1.375rem'
          }}
        />
        <div
          style={{
            color: '#1F1F1F',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}
        >
          {t('appointment.paymentAmount')}
        </div>
      </div>

      {/* 금액 상세 */}
      <div
        style={{
          paddingLeft: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem'
        }}
      >
        {/* 총 금액 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1F1F1F'
            }}
          >
            {t('appointment.totalAmount')}
          </span>
          <span
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1F1F1F'
            }}
          >
            {totalAmount} THB
          </span>
        </div>

        {/* 진료비 */}
        {consultationFee !== undefined && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                color: '#979797'
              }}
            >
              ㄴ{t('appointment.consultationFee')}
            </span>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                color: '#979797'
              }}
            >
              {consultationFee} THB
            </span>
          </div>
        )}

        {/* 조제비 */}
        {prescriptionFee !== undefined && prescriptionFee > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                color: '#979797'
              }}
            >
              ㄴ{t('appointment.prescriptionFee')}
            </span>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                color: '#979797'
              }}
            >
              {prescriptionFee} THB
            </span>
          </div>
        )}

        {/* 서비스비 */}
        {serviceFee !== undefined && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                color: '#979797'
              }}
            >
              ㄴ{t('appointment.serviceFee')}
            </span>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                color: '#979797'
              }}
            >
              {serviceFee} THB
            </span>
          </div>
        )}

        {/* 배송비 */}
        {deliveryFee !== undefined && deliveryFee > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                color: '#979797'
              }}
            >
              ㄴ{t('appointment.deliveryFee')}
            </span>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                color: '#979797'
              }}
            >
              {deliveryFee} THB
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

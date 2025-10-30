import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import PaymentAmountDisplay from '@appointment/shared/payment/PaymentAmountDisplay';
import PaymentMethodSelector, { type PaymentMethod } from '@appointment/shared/payment/PaymentMethodSelector';

/**
 * 결제 페이지
 * - 결제 금액 표시
 * - 결제 수단 선택
 * - 결제하기 버튼
 */
export default function Payment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  // TODO: API에서 결제 정보 가져오기
  const paymentData = {
    totalAmount: 350,
    consultationFee: 300,
    serviceFee: 50
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      // TODO: 결제 수단 선택 알림
      return;
    }

    // TODO: 결제 처리 로직
    // 결제 완료 페이지로 이동
    navigate('/appointments/payment/complete');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate('/appointments');
  };

  return (
    <MainLayout title={t('appointment.payment')} onBack={handleBack} onClose={handleClose} fullWidth contentClassName="">
      <div
        style={{
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          paddingTop: '1.25rem',
          paddingBottom: '6rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.875rem'
        }}
      >
        {/* 결제 정보 섹션 */}
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
            {t('appointment.paymentInfo')}
          </div>

          <PaymentAmountDisplay
            totalAmount={paymentData.totalAmount}
            consultationFee={paymentData.consultationFee}
            serviceFee={paymentData.serviceFee}
          />
        </div>

        {/* 결제 수단 섹션 */}
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onSelect={setSelectedMethod}
        />
      </div>

      {/* 하단 결제 버튼 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '4.375rem',
          background: selectedMethod ? '#00A0D2' : '#D0D0D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: selectedMethod ? 'pointer' : 'not-allowed'
        }}
        onClick={handlePayment}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '500'
          }}
        >
          {t('appointment.payNow', { amount: paymentData.totalAmount })}
        </div>
      </div>
    </MainLayout>
  );
}

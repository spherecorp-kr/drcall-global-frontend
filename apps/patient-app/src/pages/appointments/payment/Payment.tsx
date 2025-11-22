import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import PaymentAmountDisplay from '@appointment/shared/payment/PaymentAmountDisplay';
import { paymentService } from '@/services/paymentService';
import { appointmentService } from '@/services/appointmentService';
import { thbToSatang, isOmiseLoaded } from '@/lib/omise';
import { useToast } from '@/hooks/useToast';

/**
 * 결제 페이지 (OMISE Pre-built Form 사용)
 * - 결제 금액 표시
 * - OMISE Embedded Checkout Form
 * - 자동 3D Secure 처리
 */
export default function Payment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [paymentData, setPaymentData] = useState<{
    totalAmount: number;
    consultationFee: number;
    serviceFee: number;
    appointmentId: number;
    patientId: number;
    hospitalId: number;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 예약 정보 조회 및 결제 정보 로드
  useEffect(() => {
    const loadAppointmentAndPayment = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // 예약 정보 조회
        const appointment = await appointmentService.getAppointmentById(id);

        // 결제 정보 설정
        setPaymentData({
          totalAmount: appointment.totalFee || 350, // 기본값 350 THB
          consultationFee: appointment.consultationFee || 300,
          serviceFee: appointment.serviceFee || 50,
          appointmentId: Number(appointment.id),
          patientId: appointment.patientId || 0,
          hospitalId: appointment.hospitalId || appointment.hospital?.id || 0,
        });
      } catch (error) {
        console.error('Failed to load appointment:', error);
        showToast(t('error.failedToLoadAppointment'), 'error');
      } finally {
        setLoading(false);
      }
    };

    loadAppointmentAndPayment();
  }, [id, t, showToast]);

  // OMISE Checkout Handler
  useEffect(() => {
    if (!paymentData) return;

    const handleOmiseCheckout = () => {
      if (!isOmiseLoaded()) {
        console.error('OMISE SDK not loaded');
        return;
      }

      // OMISE Public Key 설정
      const publicKey = import.meta.env.VITE_OMISE_PUBLIC_KEY;
      if (!publicKey) {
        console.error('OMISE Public Key not configured');
        return;
      }

      window.Omise.setPublicKey(publicKey);
    };

    handleOmiseCheckout();
  }, [paymentData]);

  // Form Submit Handler
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!paymentData) {
      showToast(t('error.paymentDataNotLoaded'), 'error');
      return;
    }

    setLoading(true);

    try {
      // OMISE Form에서 토큰/소스 생성은 자동으로 처리됨
      // FormData에서 omiseToken 또는 omiseSource 추출
      const formData = new FormData(event.currentTarget);
      const omiseToken = formData.get('omise_token') as string | null;
      const omiseSource = formData.get('omise_source') as string | null;

      if (!omiseToken && !omiseSource) {
        throw new Error('No payment token or source received from OMISE');
      }

      // 결제 방법 결정
      let paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'MOBILE_BANKING' | 'PROMPTPAY' | 'QR_CODE' = 'CREDIT_CARD';
      if (omiseSource) {
        // Source 타입에 따라 결제 방법 결정
        paymentMethod = 'PROMPTPAY'; // 기본값
      }

      // 결제 생성 API 호출
      const payment = await paymentService.createPayment({
        appointmentId: paymentData.appointmentId,
        patientId: paymentData.patientId,
        hospitalId: paymentData.hospitalId,
        amount: paymentData.totalAmount,
        currency: 'THB',
        paymentMethod,
        omiseToken: omiseToken || undefined,
        omiseSource: omiseSource || undefined,
      });

      // 3D Secure 인증이 필요한 경우
      if (payment.authorizeUri) {
        window.location.href = payment.authorizeUri;
        return;
      }

      // 결제 성공
      if (payment.status === 'SUCCESS' || payment.status === 'PROCESSING') {
        showToast(t('payment.paymentSuccessful'), 'success');
        navigate('/appointments/payment/complete', {
          state: { paymentId: payment.id },
        });
      } else {
        throw new Error(payment.failureMessage || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      showToast(
        t('error.paymentFailed', {
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate('/appointments');
  };

  if (!paymentData) {
    return (
      <MainLayout title={t('appointment.payment')} onBack={handleBack} onClose={handleClose} fullWidth>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ color: '#666', fontSize: '1rem' }}>{t('common.loading')}</div>
        </div>
      </MainLayout>
    );
  }

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

        {/* OMISE Pre-built Payment Form */}
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

          <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* OMISE Embedded Checkout Script */}
            <script
              type="text/javascript"
              src="https://cdn.omise.co/omise.js"
              data-key={import.meta.env.VITE_OMISE_PUBLIC_KEY}
              data-amount={thbToSatang(paymentData.totalAmount).toString()}
              data-currency="THB"
              data-default-payment-method="credit_card"
              data-other-payment-methods="promptpay,mobile_banking_scb,mobile_banking_bay"
              data-button-label={t('appointment.payNow', { amount: paymentData.totalAmount })}
              data-submit-label={t('common.confirm')}
              data-location="no"
              data-frame-label={t('appointment.payment')}
            />

            {/* Submit Button (OMISE가 자동으로 버튼 생성하므로 불필요) */}
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

import { useTranslation } from 'react-i18next';
import type { PrescriptionStatus } from '@/types/completed';

interface PrescriptionSectionProps {
  status: PrescriptionStatus;
  paymentStatus: 'pending_billing' | 'pending_payment' | 'payment_complete';
  onViewPrescription?: () => void;
}

export default function PrescriptionSection({ status, paymentStatus, onViewPrescription }: PrescriptionSectionProps) {
  const { t } = useTranslation();

  const getStatusConfig = () => {
    // 처방전 미발급은 결제 상태와 상관없이 항상 표시
    if (status === 'not_issued') {
      return {
        statusText: t('appointment.prescriptionNotIssued'),
        statusColor: '#F65F06',
        message: t('appointment.prescriptionNotIssuedMessage'),
        showButton: false
      };
    }

    // 결제 완료가 아니면 결제 대기 메시지
    if (paymentStatus !== 'payment_complete') {
      return {
        statusText: paymentStatus === 'pending_billing' ? t('appointment.pendingBilling') : t('appointment.pendingPayment'),
        statusColor: paymentStatus === 'pending_billing' ? '#0AC256' : '#00A0D2',
        message: t('appointment.prescriptionWaitMessage'),
        showButton: false
      };
    }

    // 결제 완료 후 처방전 상태에 따라
    switch (status) {
      case 'waiting_upload':
      case 'uploaded':
        return {
          statusText: t('appointment.prescriptionWaitingUpload'),
          statusColor: '#00A0D2',
          message: t('appointment.prescriptionWaitingMessage'),
          showButton: false
        };
      case 'viewable':
        return {
          statusText: t('appointment.prescriptionComplete'),
          statusColor: '#1F1F1F',
          message: null,
          showButton: true
        };
      default:
        return {
          statusText: t('appointment.prescriptionWaitingUpload'),
          statusColor: '#00A0D2',
          message: t('appointment.prescriptionWaitingMessage'),
          showButton: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src="/assets/icons/ic_upload.svg"
            alt="prescription"
            style={{ width: '1.375rem', height: '1.375rem' }}
          />
          <div style={{ color: '#1F1F1F', fontSize: '1.125rem', fontWeight: '600' }}>
            {t('appointment.prescriptionUpload')}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              textAlign: 'right',
              fontSize: '0.9375rem',
              fontWeight: '600',
              color: config.statusColor
            }}
          >
            {config.statusText}
          </div>
          {config.showButton && (
            <div
              style={{
                paddingLeft: '0.9375rem',
                paddingRight: '0.9375rem',
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                background: 'white',
                borderRadius: '0.625rem',
                border: '1.5px solid #E0E0E0',
                cursor: 'pointer'
              }}
              onClick={onViewPrescription}
            >
              <div style={{ color: '#1F1F1F', fontSize: '0.875rem', fontWeight: '600' }}>
                {t('appointment.viewPrescription')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메시지 */}
      {config.message && (
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
          {config.message}
        </div>
      )}
    </div>
  );
}

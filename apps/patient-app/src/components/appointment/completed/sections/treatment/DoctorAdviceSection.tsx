import { useTranslation } from 'react-i18next';

interface DoctorAdviceSectionProps {
  doctorAdvice?: string;
  paymentStatus: 'pending_billing' | 'pending_payment' | 'payment_complete';
}

export default function DoctorAdviceSection({
  doctorAdvice,
  paymentStatus
}: DoctorAdviceSectionProps) {
  const { t } = useTranslation();

  const getStatusBadge = () => {
    if (paymentStatus === 'payment_complete') return null;

    return (
      <div style={{
        textAlign: 'right',
        color: paymentStatus === 'pending_billing' ? '#0AC256' : '#00A0D2',
        fontSize: '0.9375rem',
        fontWeight: '600'
      }}>
        {paymentStatus === 'pending_billing' ? t('appointment.pendingBilling') : t('appointment.pendingPayment')}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src="/assets/icons/ic_clipboard.svg"
            alt=""
            style={{ width: '1.375rem', height: '1.375rem' }}
          />
          <div style={{ color: '#1F1F1F', fontSize: '1.125rem', fontWeight: '600' }}>
            {t('appointment.doctorAdvice')}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {paymentStatus === 'payment_complete' && doctorAdvice ? (
        <div style={{
          minHeight: '5rem',
          background: '#FAFAFA',
          borderRadius: '0.5rem',
          border: '1px solid #E0E0E0',
          padding: '0.5rem 1rem 0.875rem 1rem'
        }}>
          <div style={{
            color: '#1F1F1F',
            fontSize: '0.875rem',
            fontWeight: '400',
            whiteSpace: 'pre-wrap'
          }}>
            {doctorAdvice}
          </div>
        </div>
      ) : (
        <div style={{
          height: '5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#979797',
          fontSize: '1rem',
          fontWeight: '400'
        }}>
          {t('appointment.doctorAdviceWaitMessage')}
        </div>
      )}
    </div>
  );
}

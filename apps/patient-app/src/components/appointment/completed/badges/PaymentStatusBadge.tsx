import { useTranslation } from 'react-i18next';
import type { PaymentStatus } from '@/types/completed';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const { t } = useTranslation();

  const getStatusConfig = () => {
    switch (status) {
      case 'pending_billing':
        return { text: t('appointment.paymentStatusPendingBilling'), color: '#0AC256' };
      case 'pending_payment':
        return { text: t('appointment.paymentStatusPendingPayment'), color: '#00A0D2' };
      case 'payment_complete':
        return { text: t('appointment.paymentStatusComplete'), color: '#1F1F1F' };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      style={{
        fontSize: '0.9375rem',
        fontWeight: '600',
        color: config.color,
        whiteSpace: 'nowrap'
      }}
    >
      {config.text}
    </span>
  );
}

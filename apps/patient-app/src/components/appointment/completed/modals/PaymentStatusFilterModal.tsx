import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomSheetModal from '@ui/modals/BottomSheetModal';
import type { PaymentStatus } from '@/types/completed';

interface PaymentStatusFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: PaymentStatus | 'all') => void;
  currentStatus: PaymentStatus | 'all';
}

export default function PaymentStatusFilterModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus
}: PaymentStatusFilterModalProps) {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statusOptions: { key: PaymentStatus | 'all'; label: string }[] = [
    { key: 'all', label: t('appointment.paymentStatusAll') },
    { key: 'pending_billing', label: t('appointment.paymentStatusPendingBilling') },
    { key: 'pending_payment', label: t('appointment.paymentStatusPendingPayment') },
    { key: 'payment_complete', label: t('appointment.paymentStatusComplete') }
  ];

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('appointment.paymentInfo').replace(' 정보', ' 상태')}
      confirmText={t('common.confirm')}
      onConfirm={handleConfirm}
    >
      <div style={{ width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
        {statusOptions.map((option) => (
          <div
            key={option.key}
            onClick={() => setSelectedStatus(option.key)}
            style={{
              padding: '16px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1F1F1F'
              }}
            >
              {option.label}
            </span>
            {selectedStatus === option.key && (
              <img
                src="/assets/icons/ic_check_v.svg"
                alt="selected"
                style={{
                  width: 24,
                  height: 24
                }}
              />
            )}
          </div>
        ))}
      </div>
    </BottomSheetModal>
  );
}

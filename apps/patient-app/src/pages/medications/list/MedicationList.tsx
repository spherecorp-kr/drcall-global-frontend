import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import BottomSheetModal from '@ui/modals/BottomSheetModal';

/**
 * 조제 및 배송 내역 페이지
 */
export default function MedicationList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  // Status Dropdown (replaces tabs)
  type MedicationStatus = 'preparing' | 'prepared' | 'shipping' | 'received';
  const [selectedStatus, setSelectedStatus] = useState<MedicationStatus | 'all'>('all');
  const [tempStatus, setTempStatus] = useState<MedicationStatus | 'all'>('all');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const statusOptions: { key: MedicationStatus | 'all'; label: string }[] = [
    { key: 'all', label: t('medication.statusAll') },
    { key: 'preparing', label: t('medication.statusPreparing') },   // 조제중
    { key: 'prepared', label: t('medication.statusPrepared') },     // 조제 완료
    { key: 'shipping', label: t('medication.statusShipping') },     // 배송 중
    { key: 'received', label: t('medication.statusReceived') }      // 수령 완료
  ];

  const handleOpenStatusModal = () => {
    setTempStatus(selectedStatus);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatus = () => {
    setSelectedStatus(tempStatus);
    setIsStatusModalOpen(false);
  };

  return (
    <MainLayout
      title={t('medication.list.title')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
    >
      <div style={{
        paddingBottom: '1.25rem',
        minHeight: 'calc(100vh - 3.5rem)'
      }}>
        {/* Status Dropdown (top-right) */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingRight: '1.25rem',
          paddingTop: '1.25rem'
        }}>
          <button
            onClick={handleOpenStatusModal}
            style={{
              background: 'none',
              border: 'none',
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: 0
            }}
          >
            <span>{statusOptions.find(opt => opt.key === selectedStatus)?.label || t('medication.statusAll')}</span>
            <img src="/assets/icons/btn_opening.svg" alt="" style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>

        {/* Medication List Content will be implemented in subsequent steps */}
      </div>
      {/* Status Filter Modal */}
      <BottomSheetModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={t('medication.statusFilter')}
        onConfirm={handleConfirmStatus}
      >
        <div style={{ width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
          {statusOptions.map((option) => (
            <div
              key={option.key}
              onClick={() => setTempStatus(option.key)}
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
              {tempStatus === option.key && (
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
    </MainLayout>
  );
}
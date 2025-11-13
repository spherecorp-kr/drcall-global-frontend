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

  // Sort Dropdown
  type SortType = 'newest' | 'oldest';
  const [sortOrder, setSortOrder] = useState<SortType>('newest');
  const [tempSortOrder, setTempSortOrder] = useState<SortType>('newest');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const sortOptions: { key: SortType; label: string }[] = [
    { key: 'newest', label: t('medication.sortNewest') },
    { key: 'oldest', label: t('medication.sortOldest') }
  ];

  const handleOpenSortModal = () => {
    setTempSortOrder(sortOrder);
    setIsSortModalOpen(true);
  };

  const handleConfirmSort = () => {
    setSortOrder(tempSortOrder);
    setIsSortModalOpen(false);
  };

  // Mock Data (Medication list)
  type DeliveryMethod = 'direct' | 'standard' | 'express' | 'international';
  interface MedicationListItem {
    id: string;
    status: MedicationStatus;
    medicationNumber: string;
    requestedAt: string; // ISO format e.g., 2024-11-06T17:34:22
    method: DeliveryMethod;
    hospitalName: string;
    hospitalNameEn?: string;
  }

  const mockMedications: MedicationListItem[] = [
    { id: 'med-0001', status: 'preparing', medicationNumber: 'RX-2025-0001', requestedAt: '2025-01-15T09:24:00', method: 'standard', hospitalName: '드콜병원', hospitalNameEn: 'Dr.Call Hospital' },
    { id: 'med-0002', status: 'preparing', medicationNumber: 'RX-2025-0002', requestedAt: '2025-01-14T16:10:00', method: 'direct', hospitalName: '프라람9병원', hospitalNameEn: 'Praram9 Hospital' },
    { id: 'med-0003', status: 'prepared', medicationNumber: 'RX-2025-0003', requestedAt: '2025-01-14T10:05:12', method: 'express', hospitalName: '드콜병원', hospitalNameEn: 'Dr.Call Hospital' },
    { id: 'med-0004', status: 'shipping', medicationNumber: 'RX-2025-0004', requestedAt: '2025-01-13T18:30:45', method: 'standard', hospitalName: '프라람9병원', hospitalNameEn: 'Praram9 Hospital' },
    { id: 'med-0005', status: 'received', medicationNumber: 'RX-2025-0005', requestedAt: '2025-01-12T08:12:31', method: 'direct', hospitalName: '드콜병원', hospitalNameEn: 'Dr.Call Hospital' },
    { id: 'med-0006', status: 'shipping', medicationNumber: 'RX-2025-0006', requestedAt: '2025-01-12T07:59:00', method: 'international', hospitalName: '삼성서울병원', hospitalNameEn: 'Samsung Medical Center' },
    { id: 'med-0007', status: 'prepared', medicationNumber: 'RX-2025-0007', requestedAt: '2025-01-11T21:40:10', method: 'standard', hospitalName: '세브란스병원', hospitalNameEn: 'Severance Hospital' },
    { id: 'med-0008', status: 'preparing', medicationNumber: 'RX-2025-0008', requestedAt: '2025-01-11T13:25:33', method: 'standard', hospitalName: '아산병원', hospitalNameEn: 'Asan Medical Center' },
    { id: 'med-0009', status: 'received', medicationNumber: 'RX-2025-0009', requestedAt: '2025-01-10T12:00:00', method: 'direct', hospitalName: '드콜병원', hospitalNameEn: 'Dr.Call Hospital' },
    { id: 'med-0010', status: 'shipping', medicationNumber: 'RX-2025-0010', requestedAt: '2025-01-10T09:10:00', method: 'express', hospitalName: '프라람9병원', hospitalNameEn: 'Praram9 Hospital' },
    { id: 'med-0011', status: 'prepared', medicationNumber: 'RX-2025-0011', requestedAt: '2025-01-09T19:45:00', method: 'international', hospitalName: '세브란스병원', hospitalNameEn: 'Severance Hospital' },
    { id: 'med-0012', status: 'preparing', medicationNumber: 'RX-2025-0012', requestedAt: '2025-01-09T08:05:00', method: 'standard', hospitalName: '아산병원', hospitalNameEn: 'Asan Medical Center' },
    { id: 'med-0013', status: 'received', medicationNumber: 'RX-2025-0013', requestedAt: '2025-01-08T23:59:59', method: 'express', hospitalName: '드콜병원', hospitalNameEn: 'Dr.Call Hospital' },
    { id: 'med-0014', status: 'shipping', medicationNumber: 'RX-2025-0014', requestedAt: '2025-01-08T07:07:07', method: 'standard', hospitalName: '삼성서울병원', hospitalNameEn: 'Samsung Medical Center' },
    { id: 'med-0015', status: 'prepared', medicationNumber: 'RX-2025-0015', requestedAt: '2025-01-07T11:11:11', method: 'direct', hospitalName: '프라람9병원', hospitalNameEn: 'Praram9 Hospital' }
  ];

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
        {/* Sort + Status Dropdowns (top-right) */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingRight: '1.25rem',
          paddingTop: '1.25rem',
          gap: '1rem'
        }}>
          {/* Sort button (left) */}
          <button
            onClick={handleOpenSortModal}
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
            <span>{sortOptions.find(opt => opt.key === sortOrder)?.label || t('medication.sortNewest')}</span>
            <img src="/assets/icons/btn_opening.svg" alt="" style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>

          {/* Status button (right) */}
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
      {/* Sort Modal */}
      <BottomSheetModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        title={t('medication.sortFilter')}
        onConfirm={handleConfirmSort}
      >
        <div style={{ width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
          {sortOptions.map((option) => (
            <div
              key={option.key}
              onClick={() => setTempSortOrder(option.key)}
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
              {tempSortOrder === option.key && (
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
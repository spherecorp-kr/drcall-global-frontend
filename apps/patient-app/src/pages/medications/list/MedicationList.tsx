import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import BottomSheetModal from '@ui/modals/BottomSheetModal';
import InfoField from '@ui/display/InfoField';
import { DELIVERY_METHOD_LABEL_KEY_MAP, MEDICATION_STATUS_LABEL_KEY_MAP } from '../../../constants/medication';

/**
 * 조제 및 배송 내역 페이지
 */
export default function MedicationList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => navigate(-1);

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

  // Selection (for showing detail button)
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null);

  // Label helpers
  const getStatusLabel = (status: MedicationStatus) => {
    return t(MEDICATION_STATUS_LABEL_KEY_MAP[status]);
  };

  const getMethodLabel = (method: DeliveryMethod) => {
    return t(DELIVERY_METHOD_LABEL_KEY_MAP[method]);
  };

  // Status badge style
  const getStatusBadgeStyle = (status: MedicationStatus) => {
    // preparing / shipping: green; prepared / received: light gray
    if (status === 'preparing' || status === 'shipping') {
      return { background: '#0AC256', color: '#FFFFFF' };
    }
    return { background: '#D5D5D5', color: '#FFFFFF' };
  };

  // Filter + Sort
  const filteredAndSortedMedications = useMemo(() => {
    const filtered = selectedStatus === 'all'
      ? mockMedications
      : mockMedications.filter(item => item.status === selectedStatus);

    const sorted = [...filtered].sort((a, b) => {
      const timeA = new Date(a.requestedAt).getTime();
      const timeB = new Date(b.requestedAt).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return sorted;
  }, [selectedStatus, sortOrder]);

  // Infinite Scroll
  const ITEMS_PER_PAGE = 10;
  const [displayedItemsCount, setDisplayedItemsCount] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset on filter/sort change
  useEffect(() => {
    setDisplayedItemsCount(ITEMS_PER_PAGE);
  }, [selectedStatus, sortOrder]);

  const displayedMedications = useMemo(() => {
    return filteredAndSortedMedications.slice(0, displayedItemsCount);
  }, [filteredAndSortedMedications, displayedItemsCount]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && displayedItemsCount < filteredAndSortedMedications.length) {
      setDisplayedItemsCount(prev => prev + ITEMS_PER_PAGE);
    }
  }, [displayedItemsCount, filteredAndSortedMedications.length]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.5 });
    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver]);

  return (
    <MainLayout
      title={t('medication.list.title')}
      onBack={handleBack}
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

        {/* List container (cards will be implemented next) */}
        <div
          style={{
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            paddingTop: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem'
          }}
        >
          {/* Medication Cards */}
          {displayedMedications.map((item) => {
            const isSelected = selectedMedicationId === item.id;
            const hospitalValue = item.hospitalNameEn ? `${item.hospitalName} (${item.hospitalNameEn})` : item.hospitalName;
            return (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  borderRadius: '0.625rem',
                  border: isSelected ? '2px solid #00A0D2' : 'none',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div
                  onClick={() => setSelectedMedicationId(item.id)}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                >
                  {/* Status Badge */}
                  <div style={{ display: 'flex' }}>
                    {(() => {
                      const style = getStatusBadgeStyle(item.status);
                      return (
                        <span
                          style={{
                            background: style.background,
                            color: style.color,
                            borderRadius: '100px',
                            paddingLeft: '0.75rem',
                            paddingRight: '0.75rem',
                            paddingTop: '0.375rem',
                            paddingBottom: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            lineHeight: 1
                          }}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      );
                    })()}
                  </div>
                  <InfoField label={t('medication.fields.number')} value={item.medicationNumber} />
                  <InfoField label={t('medication.fields.requestedAt')} value={item.requestedAt} />
                  <InfoField label={t('medication.fields.method')} value={getMethodLabel(item.method)} />
                  <InfoField label={t('medication.fields.hospital')} value={hospitalValue} />
                </div>

                {/* 상세보기 버튼 - 선택된 경우에만 표시 */}
                {isSelected && (
                  <button
                    onClick={() => navigate(`/medications/${item.id}`)}
                    style={{
                      marginTop: '0.75rem',
                      width: '100%',
                      height: '3rem',
                      background: '#00A0D2',
                      borderRadius: '1.5rem',
                      border: 'none',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {t('medication.actions.viewDetail')}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M7.5 5L12.5 10L7.5 15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}

          {/* Infinite scroll trigger */}
          <div
            ref={observerTarget}
            style={{
              height: '1px',
              visibility: 'hidden'
            }}
          />

          {/* Loading indicator */}
          {displayedItemsCount < filteredAndSortedMedications.length && (
            <div style={{
              textAlign: 'center',
              padding: '1.25rem',
              color: '#8A8A8A',
              fontSize: '0.875rem'
            }}>
              {t('common.loading')}
            </div>
          )}
        </div>
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
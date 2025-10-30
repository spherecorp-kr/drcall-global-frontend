import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import BottomSheetModal from '@ui/modals/BottomSheetModal';
import AppointmentCard, {
  type AppointmentStatus
} from '@appointment/pending/cards/AppointmentCard';
import CompletedConsultationCard from '@appointment/completed/cards/CompletedConsultationCard';
import CancelledAppointmentCard from '@appointment/cancelled/cards/CancelledAppointmentCard';
import PaymentStatusFilterModal from '@appointment/completed/modals/PaymentStatusFilterModal';
import { mockAppointmentsList, mockCompletedConsultations, mockAppointmentsDetails } from '@mocks/appointments-list';
import { useAppointmentStore } from '@store/appointmentStore';
import type { PaymentStatus } from '@/types/completed';

type SortType = 'newest' | 'oldest';

const ITEMS_PER_PAGE = 10; // 한 번에 로드할 항목 수

export default function MedicalHistory() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const selectedTab = useAppointmentStore((state) => state.selectedListTab);
  const setSelectedListTab = useAppointmentStore((state) => state.setSelectedListTab);
  const [sortOrder, setSortOrder] = useState<SortType>('newest');
  const [tempSortOrder, setTempSortOrder] = useState<SortType>('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [isPaymentFilterModalOpen, setIsPaymentFilterModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [displayedItemsCount, setDisplayedItemsCount] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const sortOptions: { key: SortType; label: string }[] = [
    { key: 'newest', label: t('appointment.sortNewest') },
    { key: 'oldest', label: t('appointment.sortOldest') }
  ];

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  // TODO: API에서 예약 목록 가져오기
  // const { data: appointments } = useQuery(['appointments'], fetchAppointments);

  // 필터링 및 정렬 (useMemo로 메모이제이션하여 성능 최적화)
  const filteredAndSortedAppointments = useMemo(() => {
    return selectedTab === 'completed'
      ? mockCompletedConsultations
          .filter((consultation) => paymentStatusFilter === 'all' || consultation.paymentStatus === paymentStatusFilter)
          .sort((a, b) => {
            const dateA = new Date(a.completedAt.replace(/\//g, '-'));
            const dateB = new Date(b.completedAt.replace(/\//g, '-'));
            return sortOrder === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
          })
      : mockAppointmentsList
          .filter((apt) => apt.status === selectedTab)
          .sort((a, b) => {
            // 날짜 기준 정렬 (datetime 필드 사용)
            const dateA = a.datetime ? new Date(a.datetime.split(' ')[0].replace(/\//g, '-')) : new Date(0);
            const dateB = b.datetime ? new Date(b.datetime.split(' ')[0].replace(/\//g, '-')) : new Date(0);

            if (sortOrder === 'newest') {
              return dateB.getTime() - dateA.getTime(); // 최신순
            } else {
              return dateA.getTime() - dateB.getTime(); // 과거순
            }
          });
  }, [selectedTab, sortOrder, paymentStatusFilter]);

  // 무한 스크롤을 위해 표시할 항목만 슬라이스 (useMemo로 메모이제이션)
  const displayedAppointments = useMemo(() => {
    return filteredAndSortedAppointments.slice(0, displayedItemsCount);
  }, [filteredAndSortedAppointments, displayedItemsCount]);

  // 탭이나 정렬 변경 시 초기화
  useEffect(() => {
    setDisplayedItemsCount(ITEMS_PER_PAGE);
  }, [selectedTab, sortOrder, paymentStatusFilter]);

  // 탭 변경 시 첫 번째 카드 자동 선택 및 탭 스크롤
  useEffect(() => {
    if (displayedAppointments.length > 0) {
      setSelectedAppointmentId(displayedAppointments[0].id);
    } else {
      setSelectedAppointmentId(null);
    }

    // 선택된 탭이 보이도록 스크롤
    const selectedTabButton = tabRefs.current[selectedTab];
    if (selectedTabButton) {
      selectedTabButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [selectedTab, sortOrder, displayedAppointments.length]);

  // 무한 스크롤 Intersection Observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && displayedItemsCount < filteredAndSortedAppointments.length) {
        // 더 로드할 항목이 있으면 추가 로드
        setDisplayedItemsCount((prev) => prev + ITEMS_PER_PAGE);
      }
    },
    [displayedItemsCount, filteredAndSortedAppointments.length]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver]);

  const handleTabClick = (tab: AppointmentStatus, event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedListTab(tab);
    event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const tabs: { key: AppointmentStatus; label: string }[] = [
    { key: 'pending', label: t('appointment.pending') },
    { key: 'confirmed', label: t('appointment.confirmed') },
    { key: 'completed', label: t('appointment.completed') },
    { key: 'cancelled', label: t('appointment.cancel') }
  ];

  const handleOpenModal = () => {
    setTempSortOrder(sortOrder);
    setIsModalOpen(true);
  };

  const handleConfirmSort = () => {
    setSortOrder(tempSortOrder);
    setIsModalOpen(false);
  };

  const handleConfirmPaymentStatus = (status: PaymentStatus | 'all') => {
    setPaymentStatusFilter(status);
    setIsPaymentFilterModalOpen(false);
  };

  const currentSortLabel = sortOptions.find(opt => opt.key === sortOrder)?.label || t('appointment.sortNewest');

  const paymentStatusOptions: { key: PaymentStatus | 'all'; label: string }[] = [
    { key: 'all', label: t('appointment.paymentStatusAll') },
    { key: 'pending_billing', label: t('appointment.paymentStatusPendingBilling') },
    { key: 'pending_payment', label: t('appointment.paymentStatusPendingPayment') },
    { key: 'payment_complete', label: t('appointment.paymentStatusComplete') }
  ];

  const currentPaymentStatusLabel = paymentStatusOptions.find(opt => opt.key === paymentStatusFilter)?.label || t('appointment.paymentStatusAll');

  return (
    <MainLayout
      title={t('appointment.appointmentList')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
    >
      <div style={{
        paddingBottom: '1.25rem',
        minHeight: 'calc(100vh - 3.5rem)'
      }}>
        {/* Tab Filter */}
        <div style={{
          width: '100%',
          paddingTop: '1.25rem',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.625rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: 'x proximity',
            scrollPaddingLeft: '1.25rem'
          }}>
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              onClick={(e) => handleTabClick(tab.key, e)}
              style={{
                paddingLeft: '1.25rem',
                paddingRight: '1.25rem',
                paddingTop: '0.875rem',
                paddingBottom: '0.875rem',
                background: selectedTab === tab.key ? '#00A0D2' : 'transparent',
                borderRadius: '1.875rem',
                border: selectedTab === tab.key ? 'none' : '1px solid #00A0D2',
                color: selectedTab === tab.key ? 'white' : '#00A0D2',
                fontSize: '1.125rem',
                fontWeight: '400',
                cursor: 'pointer',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                marginLeft: index === 0 ? '1.25rem' : '0',
                marginRight: index === tabs.length - 1 ? '1.25rem' : '0'
              }}
            >
              {tab.label}
            </button>
          ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingRight: '1.25rem',
          paddingTop: '1.25rem',
          gap: '1rem'
        }}>
          {selectedTab === 'completed' && (
            <button
              onClick={() => setIsPaymentFilterModalOpen(true)}
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
              <span>{currentPaymentStatusLabel}</span>
              <img src="/assets/icons/chevron-down.svg" alt="" style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>
          )}
          <button
            onClick={handleOpenModal}
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
            <span>{currentSortLabel}</span>
            <img src="/assets/icons/chevron-down.svg" alt="" style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>

        {/* Appointment Cards */}
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
          {selectedTab === 'completed'
            ? displayedAppointments.map((consultation: any) => (
                <CompletedConsultationCard
                  key={consultation.id}
                  data={consultation}
                  isSelected={selectedAppointmentId === consultation.id}
                  onClick={() => setSelectedAppointmentId(consultation.id)}
                />
              ))
            : selectedTab === 'cancelled'
            ? displayedAppointments.map((appointment: any) => {
                const detail = mockAppointmentsDetails[appointment.id];
                return (
                  <CancelledAppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    hospital={detail?.hospital.name || appointment.hospital}
                    cancelledAt={detail?.cancellation?.cancelledAt || ''}
                    cancelledBy={detail?.cancellation?.cancelledBy || ''}
                    isSelected={selectedAppointmentId === appointment.id}
                    onSelect={setSelectedAppointmentId}
                  />
                );
              })
            : displayedAppointments.map((appointment: any) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isSelected={selectedAppointmentId === appointment.id}
                  onSelect={setSelectedAppointmentId}
                />
              ))}

          {/* 무한 스크롤 트리거 */}
          <div
            ref={observerTarget}
            style={{
              height: '1px',
              visibility: 'hidden'
            }}
          />

          {/* 로딩 중 표시 (선택사항) */}
          {displayedItemsCount < filteredAndSortedAppointments.length && (
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('appointment.sortFilter')}
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
                  fontWeight: '400',
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

      {/* Payment Status Filter Modal */}
      <PaymentStatusFilterModal
        isOpen={isPaymentFilterModalOpen}
        onClose={() => setIsPaymentFilterModalOpen(false)}
        onConfirm={handleConfirmPaymentStatus}
        currentStatus={paymentStatusFilter}
      />
    </MainLayout>
  );
}

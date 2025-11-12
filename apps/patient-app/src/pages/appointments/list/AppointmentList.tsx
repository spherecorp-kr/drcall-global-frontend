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
import { useAppointmentStore } from '@store/appointmentStore';
import type { PaymentStatus } from '@/types/completed';
import { appointmentService, type PaginatedAppointmentResponse } from '@/services/appointmentService';
import { AppointmentStatus as BackendStatus } from '@/constants/appointment';
import { formatDateTime } from '@utils/date';

type SortType = 'newest' | 'oldest';

const PAGE_SIZE = 20; // 한 번에 로드할 항목 수 (백엔드와 동일)

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

  // Infinite scroll state
  const [appointments, setAppointments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const sortOptions: { key: SortType; label: string }[] = [
    { key: 'newest', label: t('appointment.sortNewest') },
    { key: 'oldest', label: t('appointment.sortOldest') }
  ];

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  // Status 매핑: UI status -> Backend status
  const statusMap: Record<AppointmentStatus, string> = {
    'pending': BackendStatus.PENDING,
    'confirmed': BackendStatus.CONFIRMED,
    'completed': BackendStatus.COMPLETED,
    'cancelled': BackendStatus.CANCELLED
  };

  // Sort order to backend sort parameter
  const getSortParam = (sort: SortType): string => {
    return sort === 'newest' ? 'scheduledAt,desc' : 'scheduledAt,asc';
  };

  /**
   * Load appointments (initial load or reset)
   * Resets page to 0 and replaces all data
   */
  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const backendStatus = statusMap[selectedTab];
      const response = await appointmentService.getAppointments({
        page: 0,
        size: PAGE_SIZE,
        status: backendStatus,
        sort: getSortParam(sortOrder)
      });

      setAppointments(response.content);
      setCurrentPage(0);
      setHasMore(!response.last);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      setAppointments([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTab, sortOrder]);

  /**
   * Load next page for infinite scroll
   * Appends data to existing appointments
   */
  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const backendStatus = statusMap[selectedTab];
      const nextPage = currentPage + 1;

      const response = await appointmentService.getAppointments({
        page: nextPage,
        size: PAGE_SIZE,
        status: backendStatus,
        sort: getSortParam(sortOrder)
      });

      setAppointments((prev) => [...prev, ...response.content]);
      setCurrentPage(nextPage);
      setHasMore(!response.last);
    } catch (error) {
      console.error('Failed to load next page:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [selectedTab, sortOrder, currentPage, hasMore, isLoadingMore]);

  // Initial load and reload on filter/sort change
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Client-side payment filter for completed tab (TODO: move to backend)
  const displayedAppointments = useMemo(() => {
    if (selectedTab === 'completed' && paymentStatusFilter !== 'all') {
      return appointments.filter((appointment) => {
        const mappedStatus = appointment.paymentStatus === 'COMPLETED' ? 'payment_complete'
          : appointment.paymentStatus === 'PENDING' ? 'pending_payment'
          : 'pending_billing';
        return mappedStatus === paymentStatusFilter;
      });
    }
    return appointments;
  }, [appointments, selectedTab, paymentStatusFilter]);

  // Transform API data to Card component format
  const transformToCardData = (appointment: any) => {
    const formattedDateTime = appointment.scheduledAt
      ? formatDateTime(new Date(appointment.scheduledAt), '')
      : '-';

    return {
      id: appointment.externalId,
      type: appointment.appointmentType === 'QUICK' ? t('appointment.quickAppointment') : t('appointment.standardAppointment'),
      hospital: appointment.hospital?.nameLocal || appointment.hospital?.nameEn || `Hospital ${appointment.hospitalId}`,
      doctor: appointment.appointmentType === 'STANDARD'
        ? (appointment.doctor?.name || appointment.doctor?.nameEn || `Doctor ${appointment.doctorId}`)
        : undefined,
      datetime: appointment.appointmentType === 'STANDARD' ? formattedDateTime : undefined,
      status: selectedTab
    };
  };

  // Transform API data to CompletedConsultationCard format
  const transformToCompletedCardData = (appointment: any) => {
    return {
      id: appointment.externalId,
      hospitalName: appointment.hospital?.nameLocal || `Hospital ${appointment.hospitalId}`,
      hospitalNameEn: appointment.hospital?.nameEn || `Hospital ${appointment.hospitalId}`,
      doctorName: appointment.doctor?.name || `Doctor ${appointment.doctorId}`,
      doctorNameEn: appointment.doctor?.nameEn || `Doctor ${appointment.doctorId}`,
      completedAt: appointment.endedAt
        ? formatDateTime(new Date(appointment.endedAt), '')
        : '-',
      paymentStatus: (appointment.paymentStatus === 'COMPLETED' ? 'payment_complete' :
                     appointment.paymentStatus === 'PENDING' ? 'pending_payment' : 'pending_billing') as PaymentStatus
    };
  };

  // 첫 번째 카드 자동 선택 및 탭 스크롤
  useEffect(() => {
    if (displayedAppointments.length > 0) {
      setSelectedAppointmentId(displayedAppointments[0].id || displayedAppointments[0].externalId);
    } else {
      setSelectedAppointmentId(null);
    }

    // 선택된 탭이 보이도록 스크롤
    const selectedTabButton = tabRefs.current[selectedTab];
    if (selectedTabButton) {
      selectedTabButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [selectedTab, displayedAppointments.length]);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoadingMore) {
        loadNextPage();
      }
    },
    [hasMore, isLoadingMore, loadNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5,
      rootMargin: '100px' // Load before user reaches the bottom
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
              <img src="/assets/icons/btn_opening.svg" alt="" style={{ width: '1.5rem', height: '1.5rem' }} />
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
            <img src="/assets/icons/btn_opening.svg" alt="" style={{ width: '1.5rem', height: '1.5rem' }} />
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
            ? displayedAppointments.map((appointment: any) => (
                <CompletedConsultationCard
                  key={appointment.id}
                  data={transformToCompletedCardData(appointment)}
                  isSelected={selectedAppointmentId === appointment.id}
                  onClick={() => setSelectedAppointmentId(appointment.id)}
                />
              ))
            : selectedTab === 'cancelled'
            ? displayedAppointments.map((appointment: any) => {
                const formattedCancelledAt = appointment.cancelledAt
                  ? formatDateTime(new Date(appointment.cancelledAt), '')
                  : '-';

                return (
                  <CancelledAppointmentCard
                    key={appointment.id}
                    id={appointment.externalId}
                    hospital={appointment.hospital?.nameLocal || appointment.hospital?.nameEn || `Hospital ${appointment.hospitalId}`}
                    cancelledAt={formattedCancelledAt}
                    cancelledBy={appointment.cancelledBy || 'SYSTEM'}
                    isSelected={selectedAppointmentId === appointment.id}
                    onSelect={setSelectedAppointmentId}
                  />
                );
              })
            : displayedAppointments.map((appointment: any) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={transformToCardData(appointment)}
                  isSelected={selectedAppointmentId === appointment.id}
                  onSelect={setSelectedAppointmentId}
                />
              ))}

          {/* 무한 스크롤 트리거 */}
          {!isLoading && hasMore && (
            <div
              ref={observerTarget}
              style={{
                height: '1px',
                visibility: 'hidden'
              }}
            />
          )}

          {/* 로딩 표시 */}
          {isLoadingMore && (
            <div style={{
              textAlign: 'center',
              padding: '1.25rem',
              color: '#8A8A8A',
              fontSize: '0.875rem'
            }}>
              {t('common.loading')}
            </div>
          )}

          {/* 초기 로딩 */}
          {isLoading && appointments.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem',
              color: '#8A8A8A',
              fontSize: '1rem'
            }}>
              {t('common.loading')}
            </div>
          )}

          {/* 데이터 없음 */}
          {!isLoading && appointments.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem',
              color: '#8A8A8A',
              fontSize: '1rem'
            }}>
              {t('appointment.noAppointments')}
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

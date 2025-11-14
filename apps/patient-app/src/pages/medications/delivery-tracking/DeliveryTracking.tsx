import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';

/**
 * 배송 조회 페이지
 */
export default function DeliveryTracking() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/medications');

  // Mock: 기본 정보
  const basicInfo = {
    trackingNumber: '2132432465',
    carrier: '$택배사$ 택배',
  };

  // Mock: 이벤트 리스트 (원천 데이터는 ISO 유지)
  const STEP_LABEL_KEY_MAP = {
    depart: 'medication.tracking.steps.depart',
    unload: 'medication.tracking.steps.unload',
    inbound: 'medication.tracking.steps.inbound',
    collection: 'medication.tracking.steps.collection',
    shipped: 'medication.tracking.steps.shipped',
  } as const;

  type StepKey = keyof typeof STEP_LABEL_KEY_MAP;
  type DeliveryEvent = {
    timestamp: string; // ISO format
    step: StepKey;
    location: string;
  };

  const events: DeliveryEvent[] = [
    { timestamp: '2025-09-12T16:49:00', step: 'depart', location: '방콕' },
    { timestamp: '2025-09-12T16:49:00', step: 'unload', location: '방콕' },
    { timestamp: '2025-09-10T16:49:00', step: 'inbound', location: '방콕' },
    { timestamp: '2025-09-09T16:49:00', step: 'collection', location: '방콕' },
    { timestamp: '2025-09-08T16:49:00', step: 'unload', location: '방콕' },
    { timestamp: '2025-09-07T16:49:00', step: 'shipped', location: 'Praram9' },
  ];

  // UI 표시용 날짜 포맷: DD/MM/YYYY HH:mm
  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  };

  return (
    <MainLayout
      title={t('medication.tracking.pageTitle')}
      onBack={handleBack}
      onClose={handleClose}
      headerBackground="white"
      fullWidth
    >
      <PageContainer>
        {/* 화면 전체 래퍼: 표 영역이 남은 공간을 스크롤하도록 구성 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 3.5rem)',
            paddingBottom: '1.25rem',
          }}
        >
          {/* 상단 기본 정보 섹션 */}
          <PageSection title={t('medication.tracking.section.basicInfo')} padding>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div style={{ color: '#8A8A8A', fontSize: '0.875rem' }}>{t('medication.tracking.fields.trackingNumber')}</div>
                <div style={{ color: '#1F1F1F', fontSize: '1rem', fontWeight: 400 }}>
                  {basicInfo.trackingNumber}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div style={{ color: '#8A8A8A', fontSize: '0.875rem' }}>{t('medication.tracking.fields.carrier')}</div>
                <div style={{ color: '#1F1F1F', fontSize: '1rem', fontWeight: 400 }}>
                  {basicInfo.carrier}
                </div>
              </div>
            </div>
          </PageSection>

          {/* 표 컨테이너: 스크롤 영역 */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              borderTop: '1px solid #E0E0E0',
            }}
          >
            {/* 헤더 (sticky) */}
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                background: '#F5F5F5',
                borderBottom: '1px solid #E0E0E0',
                display: 'flex',
              }}
            >
              <div
                style={{
                  width: '40%',
                  padding: '0.75rem 1rem',
                  color: '#1F1F1F',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {t('medication.tracking.table.processedAt')}
              </div>
              <div
                style={{
                  width: '30%',
                  padding: '0.75rem 1rem',
                  color: '#1F1F1F',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {t('medication.tracking.table.step')}
              </div>
              <div
                style={{
                  width: '30%',
                  padding: '0.75rem 1rem',
                  color: '#1F1F1F',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {t('medication.tracking.table.location')}
              </div>
            </div>

            {/* 바디 */}
            <div>
              {events.map((ev, idx) => (
                <div
                  key={`${ev.timestamp}-${idx}`}
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #E0E0E0',
                    background: '#FFFFFF',
                  }}
                >
                  <div
                    style={{
                      width: '40%',
                      padding: '0.875rem 1rem',
                      color: '#1F1F1F',
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {formatDateTime(ev.timestamp)}
                  </div>
                  <div
                    style={{
                      width: '30%',
                      padding: '0.875rem 1rem',
                      color: '#1F1F1F',
                      fontSize: '0.875rem',
                    }}
                  >
                    {t(STEP_LABEL_KEY_MAP[ev.step])}
                  </div>
                  <div
                    style={{
                      width: '30%',
                      padding: '0.875rem 1rem',
                      color: '#1F1F1F',
                      fontSize: '0.875rem',
                    }}
                  >
                    {ev.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </MainLayout>
  );
}
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
        </div>
      </PageContainer>
    </MainLayout>
  );
}
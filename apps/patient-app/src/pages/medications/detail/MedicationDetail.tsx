import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';

/**
 * 조제/배송 상세 페이지 (스캐폴드)
 * - 추후 Figma 스펙에 맞춰 섹션 구성 및 실제 데이터 연동 예정
 */
export default function MedicationDetail() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/medications');

  return (
    <MainLayout
      title={t('medication.actions.viewDetail')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
    >
      <div style={{
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
        paddingTop: '1.25rem',
        paddingBottom: '6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ color: '#6E6E6E', fontSize: '0.9375rem' }}>
          ID: {id}
        </div>
        {/* TODO: 섹션 구성 (조제상태/조제 번호/신청일/수령방법/병원/배송정보 등) */}
      </div>
    </MainLayout>
  );
}



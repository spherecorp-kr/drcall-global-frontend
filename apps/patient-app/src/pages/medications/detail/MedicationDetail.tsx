import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import ProgressSteps from '../../../components/ui/display/ProgressSteps';
import DetailHeader from './components/DetailHeader';
import { MOCKS } from './mock';

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

  // 목데이터 선택 (id가 없거나 매칭되지 않으면 기본 배송 케이스 사용)
  const scenarioKey = (id && Object.prototype.hasOwnProperty.call(MOCKS, id)) ? id : 'delivery-1';
  const data = MOCKS[scenarioKey];
  const isPickup = data.receipt.method === 'pickup';

  const subTitleLines: string[] = [];
  if (isPickup) {
    if (data.orderInfo?.orderNumber) {
      subTitleLines.push(`${t('medication.detail.labels.orderNumber')} ${data.orderInfo.orderNumber}`);
    }
    if (data.receipt.deadlineDate) {
      subTitleLines.push(`${t('medication.detail.labels.deadlineDate')} ${data.receipt.deadlineDate}`);
    }
  } else {
    if (data.receipt.estimatedDate) {
      subTitleLines.push(`${t('medication.detail.labels.estimatedDate')} ${data.receipt.estimatedDate}`);
    }
  }

  return (
    <MainLayout
      title={t('medication.actions.viewDetail')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
    >
      <div className="flex flex-col gap-5 pb-24">
        {/* 상단 설명/수령방법/서브정보 */}
        <DetailHeader method={isPickup ? 'pickup' : (data.receipt.method as any)} subTitleLines={subTitleLines} />

        {/* 진행 단계 표시 */}
        <ProgressSteps
          currentStep={data.receipt.statusStep}
          totalSteps={data.receipt.labels.length}
          labels={data.receipt.labels}
        />
        {/* 다음 단계에서 상세 섹션들을 추가 렌더링합니다. */}
      </div>
    </MainLayout>
  );
}



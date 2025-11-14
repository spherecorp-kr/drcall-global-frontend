import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import ProgressSteps from '../../../components/ui/display/ProgressSteps';
import DetailHeader from './components/DetailHeader';
import DeliveryInfoSection from './components/DeliveryInfoSection';
import OrderInfoSection from './components/OrderInfoSection';
import PickupInfoSection from './components/PickupInfoSection';
import ActionButtons from './components/ActionButtons';
import Divider from '@ui/layout/Divider';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
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

  // 리스트의 mock id를 상세 mock 시나리오에 매핑
  const resolveScenarioKey = (listId?: string | null) => {
    if (!listId) return 'delivery-1';
    // 명시 매핑: 리스트의 method별 예시 id들을 상세 시나리오에 연결
    const pickupIds = new Set(['med-0002', 'med-0005', 'med-0015']);
    const quickIds = new Set(['med-0003', 'med-0010', 'med-0013']);
    const intlIds = new Set(['med-0006', 'med-0011']);
    if (pickupIds.has(listId)) return 'pickup-1';
    if (quickIds.has(listId)) return 'quick-1';
    if (intlIds.has(listId)) return 'intl-1';
    // 상세 시나리오 키를 직접 넘긴 경우도 허용
    if (Object.prototype.hasOwnProperty.call(MOCKS, listId)) return listId as keyof typeof MOCKS;
    return 'delivery-1';
  };

  // 목데이터 선택
  const scenarioKey = resolveScenarioKey(id);
  const data = MOCKS[scenarioKey];
  const isPickup = data.receipt.method === 'pickup';

  // 헤더 보조 정보는 날짜 문자열만 전달
  const subTitle: string | undefined = isPickup
    ? data.receipt.deadlineDate
    : data.receipt.estimatedDate;

  return (
    <MainLayout
      title={t('medication.detail.pageTitle')}
      headerBackground='white'
      onBack={handleBack}
      fullWidth
      contentClassName="p-0"
    >
      <PageContainer>
        {/* 상단 설명/수령방법/서브정보 (섹션 패딩으로 통일) */}
        <PageSection style={{ padding: '0 1.25rem 1.25rem 1.25rem' }}>
          <DetailHeader
            method={isPickup ? 'pickup' : (data.receipt.method as any)}
            subTitle={subTitle}
            orderNumber={isPickup ? data.orderInfo?.orderNumber : undefined}
            padding={false}
          />
        </PageSection>

        {/* 진행 단계 표시 */}
        <div>
          <ProgressSteps
            currentStep={data.receipt.statusStep}
            totalSteps={data.receipt.labels.length}
            labels={data.receipt.labels}
          />
        </div>
        {/* 배송형: 실시간 배송 조회 버튼을 단계 아래에 배치
            - quick: 배치만 하고 클릭 시 로그만 출력
            - 그 외: 배송 조회 화면으로 이동
        */}
        {!isPickup && (
          <PageSection padding>
            <ActionButtons
              onTrackNow={() => {
                if (data.receipt.method === 'quick') {
                  navigate('/medications/live-delivery-tracking');
                } else {
                  navigate('/medications/delivery-tracking');
                }
              }}
            />
          </PageSection>
        )}

        {/* 섹션 시작 구분선(공통 Divider 컴포넌트) */}
        <Divider />

        {/* 배송형 섹션 */}
        {!isPickup && data.deliveryInfo && (
          <>
            <PageSection padding>
              <DeliveryInfoSection info={data.deliveryInfo} />
            </PageSection>
            <Divider />
            <PageSection padding>
              <OrderInfoSection
                info={data.orderInfo}
                onOpenPrescription={() => {
                  console.log('Open prescription clicked');
                }}
                onOpenConsultation={() => {
                  console.log('Open consultation detail clicked');
                }}
              />
            </PageSection>
          </>
        )}

        {/* 직접 수령 섹션 */}
        {isPickup && data.pickupInfo && (
          <>
            <PageSection padding>
              <PickupInfoSection info={data.pickupInfo} />
            </PageSection>
            <Divider />
            <PageSection padding>
              <OrderInfoSection
                info={data.orderInfo}
                onOpenPrescription={() => {
                  console.log('Open prescription clicked');
                }}
                onOpenConsultation={() => {
                  console.log('Open consultation detail clicked');
                }}
              />
            </PageSection>
          </>
        )}
      </PageContainer>
    </MainLayout>
  );
}
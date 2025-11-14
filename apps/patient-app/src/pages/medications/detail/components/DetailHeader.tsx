import { useTranslation } from 'react-i18next';

type ReceiptMethod = 'delivery' | 'quick' | 'international' | 'pickup';

type DetailHeaderProps = {
  method: ReceiptMethod;
  title?: string;
  subTitle?: string; // e.g., '14/09/2025' (라벨 없이 날짜만 전달)
  onBack?: () => void;
  onClose?: () => void;
  padding?: boolean; // 외부에서 섹션 패딩을 제공하는 경우 false로 설정
};

/**
 * 상세 상단 헤더 영역
 * - 페이지 타이틀, 수령 방법/서브 정보 표시
 * - 뒤로/닫기 인터랙션은 상위 `MainLayout`에 의해 제어되므로 여기서는 레이아웃만 담당
 */
export default function DetailHeader({
  method,
  subTitle,
  padding = true,
}: DetailHeaderProps) {
  const { t } = useTranslation();

  const methodTextMap: Record<ReceiptMethod, string> = {
    delivery: t('medication.methodStandard'),
    quick: t('medication.methodExpress'),
    international: t('medication.methodInternational'),
    pickup: t('medication.methodDirect'),
  };
  const methodIconMap: Record<ReceiptMethod, string> = {
    delivery: '/assets/icons/ic_drug.svg',
    quick: '/assets/icons/ic_box.svg',
    international: '/assets/icons/ic_box.svg',
    pickup: '/assets/icons/hospital.svg',
  };

  return (
    <div
      style={{
        width: '100%',
        ...(padding
          ? { paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingTop: '1.25rem' }
          : {})
      }}
    >
      <h1
        style={{
          marginBottom: '0.75rem',
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1F1F1F'
        }}
      >
        {t('medication.detail.title')}
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src={methodIconMap[method]} 
              alt="" 
              style={{ width: '1.375rem', height: '1.375rem' }} 
            />
            <div
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#1F1F1F'
              }}
            >
              {t('medication.fields.method')}
            </div>
          </div>
          <div
            style={{
              fontSize: '1rem', 
              fontWeight: 400,
              color: '#1F1F1F'
            }}
          >
            {methodTextMap[method]}
          </div>
        </div>

        {subTitle && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src="/assets/icons/calendar-2.svg"
                alt=""
                style={{ width: '1.375rem', height: '1.375rem' }} 
              />
              <div
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1F1F1F'
                }}
              >
                {method === 'pickup'
                  ? t('medication.detail.labels.deadlineDate')
                  : t('medication.detail.labels.estimatedDate')}
              </div>
            </div>
            <div
              style={{
                fontSize: '1rem', 
                fontWeight: 400,
                color: '#1F1F1F'
              }}
            >
              {subTitle}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
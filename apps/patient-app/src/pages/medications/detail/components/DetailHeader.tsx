import { useTranslation } from 'react-i18next';

type ReceiptMethod = 'delivery' | 'quick' | 'international' | 'pickup';

type DetailHeaderProps = {
  method: ReceiptMethod;
  title?: string;
  subTitleLines?: string[]; // e.g., ['일반 배송', '예상 도착일 14/09/2025']
  onBack?: () => void;
  onClose?: () => void;
};

/**
 * 상세 상단 헤더 영역
 * - 페이지 타이틀, 수령 방법/서브 정보 표시
 * - 뒤로/닫기 인터랙션은 상위 `MainLayout`에 의해 제어되므로 여기서는 레이아웃만 담당
 */
export default function DetailHeader({
  method,
  subTitleLines = [],
}: DetailHeaderProps) {
  const { t } = useTranslation();

  const methodTextMap: Record<ReceiptMethod, string> = {
    delivery: t('medication.methodStandard'),
    quick: t('medication.methodExpress'),
    international: t('medication.methodInternational'),
    pickup: t('medication.methodDirect'),
  };

  return (
    <div className="w-full px-5 pt-5">
      <h1 className="mb-3 text-xl font-semibold text-gray-900">
        {t('medication.detail.title')}
      </h1>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50">
            <img
              src="/assets/icons/ic_clipboard.svg"
              alt=""
              className="h-5 w-5"
            />
          </div>
          <div className="flex flex-col">
            <div className="text-[15px] font-semibold text-gray-900">
              {t('medication.fields.method')}
            </div>
            <div className="text-[13px] text-gray-600">{methodTextMap[method]}</div>
          </div>
        </div>

        {subTitleLines.map((line, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50">
              <img
                src="/assets/icons/calendar_today.svg"
                alt=""
                className="h-5 w-5"
              />
            </div>
            <div className="text-[13px] text-gray-600">{line}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



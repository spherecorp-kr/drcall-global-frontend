import { useTranslation } from 'react-i18next';
import Section from './Section';

type DeliveryInfo = {
  receiverName: string;
  phone: string;
  address: string;
  requestNote?: string;
};

type DeliveryInfoSectionProps = {
  info: DeliveryInfo;
  onTrackNow?: () => void; // 실시간 배송 조회
};

/**
 * 배송형 상세: 수령인/연락처/배송지/요청사항
 */
export default function DeliveryInfoSection({ info, onTrackNow }: DeliveryInfoSectionProps) {
  const { t } = useTranslation();
  return (
    <Section
      title={t('medication.detail.section.deliveryInfo')}
      icon={
        <img
          src="/assets/icons/mypage-delivery.svg"
          alt=""
          className="h-5 w-5"
        />
      }
      headerRight={
        onTrackNow ? (
          <button
            type="button"
            onClick={onTrackNow}
            className="rounded-full border border-sky-500 px-4 py-2 text-[14px] font-semibold text-sky-600"
          >
            {t('medication.detail.actions.trackNow')}
          </button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-3">
        <Row label={t('medication.detail.labels.receiverName')} value={info.receiverName} />
        <Row label={t('medication.detail.labels.phone')} value={info.phone} />
        <Row label={t('medication.detail.labels.address')} value={info.address} multi />
        {info.requestNote && (
          <Row
            label={t('medication.detail.labels.requestNote')}
            value={info.requestNote}
            multi
          />
        )}
      </div>
    </Section>
  );
}

function Row({ label, value, multi = false }: { label: string; value: string; multi?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[13px] font-semibold text-gray-800">{label}</div>
      <div
        className={[
          'rounded-xl bg-gray-50 px-3 py-3 text-[13px] text-gray-700',
          multi ? 'whitespace-pre-wrap' : '',
        ].join(' ')}
      >
        {value}
      </div>
    </div>
  );
}



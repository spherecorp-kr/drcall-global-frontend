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
};

/**
 * 배송형 상세: 수령인/연락처/배송지/요청사항
 */
export default function DeliveryInfoSection({ info }: DeliveryInfoSectionProps) {
  const { t } = useTranslation();
  return (
    <Section
      title={t('medication.detail.section.deliveryInfo')}
      icon={<img src="/assets/icons/mypage-delivery.svg" alt="" style={{ width: '1.25rem', height: '1.25rem' }} />}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}
    >
      <div
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#1F2937'
        }}
      >
        {label}
      </div>
      <div
        style={{
          borderRadius: '0.75rem',
          background: '#F9FAFB',
          paddingLeft: '0.75rem',
          paddingRight: '0.75rem',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          fontSize: '13px',
          color: '#374151',
          whiteSpace: multi ? 'pre-wrap' as const : 'normal'
        }}
      >
        {value}
      </div>
    </div>
  );
}



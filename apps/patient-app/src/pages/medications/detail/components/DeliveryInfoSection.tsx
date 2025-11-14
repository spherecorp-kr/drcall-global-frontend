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
        {/* Figma: 배송지/요청사항만 박스형, 그 외는 텍스트형 */}
        <Row 
          label={t('medication.detail.labels.receiverName')} 
          value={info.receiverName} variant="text" 
        />
        <Row 
          label={t('medication.detail.labels.phone')} 
          value={info.phone} variant="text" 
        />
        <Row 
          label={t('medication.detail.labels.address')} 
          value={info.address} 
          variant="box" 
          multi 
        />
        {info.requestNote && (
          <Row
            label={t('medication.detail.labels.requestNote')}
            value={info.requestNote}
            variant="box"
            multi
          />
        )}
      </div>
    </Section>
  );
}

function Row({
  label,
  value,
  variant = 'box',
  multi = false
}: {
  label: string;
  value: string;
  variant?: 'box' | 'text';
  multi?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#1F1F1F'
          }}
        >
          {label}
        </div>
      </div>
      {variant === 'box' ? (
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
      ) : (
        <div
          style={{
            fontSize: '1rem',
            fontWeight: 400,
            color: '#1F1F1F'
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}



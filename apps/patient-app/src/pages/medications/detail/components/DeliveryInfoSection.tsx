import { useTranslation } from 'react-i18next';
import Section from './Section';

type DeliveryInfo = {
  imgSrc?: string;
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
      icon={
        <img src={info.imgSrc || '/assets/icons/mypage-delivery.svg'} 
          alt="" 
          style={{ width: '1.25rem', height: '1.25rem' }} 
        />
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        {/* Figma: 배송지/요청사항만 박스형, 그 외는 텍스트형 */}
        <Row 
          imgSrc="/assets/icons/user-square.svg" 
          label={t('medication.detail.labels.receiverName')} 
          value={info.receiverName} 
          variant="text" 
        />
        <Row 
          imgSrc="/assets/icons/ic_mobile.svg" 
          label={t('medication.detail.labels.phone')} 
          value={info.phone} 
          variant="text" 
        />
        <Row 
          imgSrc="/assets/icons/ic_location.svg" 
          label={t('medication.detail.labels.address')} 
          value={info.address} 
          variant="box" 
          multi 
        />
        {info.requestNote && (
          <Row
            imgSrc="/assets/icons/ic_box.svg"
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
  imgSrc = '',
  label,
  value,
  variant = 'box',
  multi = false
}: {
  imgSrc: string;
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
        gap: '0.625rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img
          src={imgSrc}
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
          {label}
        </div>
      </div>
      {variant === 'box' ? (
        <div
          style={{
            borderRadius: '0.5rem',
            border: '1px solid #E0E0E0',
            background: '#FAFAFA',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            fontSize: '0.875rem',
            color: '#1F1F1F',
            whiteSpace: multi ? 'pre-wrap' as const : 'normal',
            minHeight: '5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {value}
          </div>
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



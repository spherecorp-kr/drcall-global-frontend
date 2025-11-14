import { useTranslation } from 'react-i18next';
import Section from './Section';

type PickupInfo = {
  hospitalName: string;
  hospitalAddress: string;
  pickupLocation: string;
  businessHours: string[]; // 줄바꿈 처리된 운영시간
  contact: string;
};

type PickupInfoSectionProps = {
  info: PickupInfo;
};

/**
 * 직접 수령 상세: 병원/주소/수령 위치/운영시간/연락처
 */
export default function PickupInfoSection({ info }: PickupInfoSectionProps) {
  const { t } = useTranslation();
  return (
    <Section
      title={t('medication.detail.section.pickupInfo')}
      icon={<img src="/assets/icons/hospital.svg" alt="" style={{ width: '1.25rem', height: '1.25rem' }} />}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <Row
          imgSrc="/assets/icons/hospital.svg"
          label={t('medication.detail.labels.hospitalName')}
          value={info.hospitalName}
          variant="text"
        />
        <Row
          imgSrc="/assets/icons/ic_location.svg"
          label={t('medication.detail.labels.hospitalAddress')}
          value={info.hospitalAddress}
          variant="text"
          multi
        />
        <Row
          imgSrc="/assets/icons/ic_location.svg"
          label={t('medication.detail.labels.pickupLocation')}
          value={info.pickupLocation}
          variant="text"
        />
        <Row
          imgSrc="/assets/icons/time.svg"
          label={t('medication.detail.labels.businessHours')}
          value={info.businessHours.join('\n')}
          variant="text"
          multi
        />
        <Row
          imgSrc="/assets/icons/ic_mobile.svg"
          label={t('medication.detail.labels.contact')}
          value={info.contact}
          variant="text"
        />
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



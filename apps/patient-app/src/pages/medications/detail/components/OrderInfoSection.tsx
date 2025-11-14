import { useTranslation } from 'react-i18next';
import Section from './Section';

type OrderInfo = {
  orderNumber: string;
  hospitalName: string;
  appliedAt: string; // ISO or display string
};

type OrderInfoSectionProps = {
  info: OrderInfo;
  onOpenPrescription?: () => void;
  onOpenConsultation?: () => void;
};

/**
 * 공통 하단 조제 정보 + 액션 버튼
 */
export default function OrderInfoSection({
  info,
  onOpenPrescription,
  onOpenConsultation,
}: OrderInfoSectionProps) {
  const { t } = useTranslation();
  return (
    <Section
      title={t('medication.detail.section.orderInfo')}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <Row
          imgSrc="/assets/icons/ic_number.svg"
          label={t('medication.detail.labels.orderNumber')}
          value={info.orderNumber}
          variant="text"
        />
        {/* 스크린샷 순서: 조제 번호 다음에 '처방전 보기' 버튼 */}
        {onOpenPrescription && (
          <button
            onClick={onOpenPrescription}
            style={{
              width: '100%',
              height: '3rem',
              background: 'white',
              borderRadius: '1.5rem',
              border: '1px solid #00A0D2',
              color: '#00A0D2',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {t('medication.detail.actions.viewPrescription')}
          </button>
        )}
        <Row
          imgSrc="/assets/icons/hospital.svg"
          label={t('medication.fields.hospital')}
          value={info.hospitalName}
          variant="text"
        />
        <Row
          imgSrc="/assets/icons/calendar-2.svg"
          label={t('medication.detail.labels.appliedAt')}
          value={info.appliedAt}
          variant="text"
        />
        {onOpenConsultation && (
          <button
            onClick={onOpenConsultation}
            style={{
              width: '100%',
              height: '3rem',
              background: 'white',
              borderRadius: '1.5rem',
              border: '1px solid #00A0D2',
              color: '#00A0D2',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {t('medication.detail.actions.viewConsultation')}
          </button>
        )}
      </div>
    </Section>
  );
}

function Row({
  imgSrc = '',
  label,
  value,
  variant = 'text'
}: {
  imgSrc: string;
  label: string;
  value: string;
  variant?: 'box' | 'text';
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
            color: '#1F1F1F'
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
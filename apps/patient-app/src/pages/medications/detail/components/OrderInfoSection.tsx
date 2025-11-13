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
      icon={<img src="/assets/icons/clipboard-text.svg" alt="" className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-3">
        <Row label={t('medication.detail.labels.orderNumber')} value={info.orderNumber} />
        {/* 스크린샷 순서: 조제 번호 다음에 '처방전 보기' 버튼 */}
        {onOpenPrescription && (
          <button
            onClick={onOpenPrescription}
            style={{
              marginTop: '0.75rem',
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
        <Row label={t('medication.fields.hospital')} value={info.hospitalName} />
        <Row label={t('medication.detail.labels.appliedAt')} value={info.appliedAt} />
        {onOpenConsultation && (
          <button
            onClick={onOpenConsultation}
            style={{
              marginTop: '0.75rem',
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[13px] font-semibold text-gray-800">{label}</div>
      <div className="rounded-xl bg-gray-50 px-3 py-3 text-[13px] text-gray-700">{value}</div>
    </div>
  );
}



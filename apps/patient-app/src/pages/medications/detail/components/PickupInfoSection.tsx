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
      icon={<img src="/assets/icons/hospital.svg" alt="" className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-3">
        <Row label={t('medication.detail.labels.hospitalName')} value={info.hospitalName} />
        <Row label={t('medication.detail.labels.hospitalAddress')} value={info.hospitalAddress} multi />
        <Row label={t('medication.detail.labels.pickupLocation')} value={info.pickupLocation} />
        <div className="flex flex-col gap-1">
          <div className="text-[13px] font-semibold text-gray-800">
            {t('medication.detail.labels.businessHours')}
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-3 text-[13px] text-gray-700">
            {info.businessHours.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
        <Row label={t('medication.detail.labels.contact')} value={info.contact} />
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



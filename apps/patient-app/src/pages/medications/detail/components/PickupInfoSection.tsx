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
  return (
    <Section title="직접 수령 정보" icon={<span className="text-sky-500">🏥</span>}>
      <div className="flex flex-col gap-3">
        <Row label="병원" value={info.hospitalName} />
        <Row label="병원 주소" value={info.hospitalAddress} multi />
        <Row label="수령 위치" value={info.pickupLocation} />
        <div className="flex flex-col gap-1">
          <div className="text-[13px] font-semibold text-gray-800">운영 시간</div>
          <div className="rounded-xl bg-gray-50 px-3 py-3 text-[13px] text-gray-700">
            {info.businessHours.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
        <Row label="연락처" value={info.contact} />
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



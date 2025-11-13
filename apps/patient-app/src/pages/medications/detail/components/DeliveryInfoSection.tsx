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
  return (
    <Section
      title="배송 정보"
      icon={<span className="text-sky-500">📦</span>}
      headerRight={
        onTrackNow ? (
          <button
            type="button"
            onClick={onTrackNow}
            className="rounded-full border border-sky-500 px-4 py-2 text-[14px] font-semibold text-sky-600"
          >
            실시간 배송 조회
          </button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-3">
        <Row label="수령인" value={info.receiverName} />
        <Row label="연락처" value={info.phone} />
        <Row label="배송지" value={info.address} multi />
        {info.requestNote && <Row label="배송 요청사항" value={info.requestNote} multi />}
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



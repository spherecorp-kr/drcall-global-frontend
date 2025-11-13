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
  return (
    <Section title="조제 정보" icon={<span className="text-sky-500">📄</span>}>
      <div className="flex flex-col gap-3">
        <Row label="조제 번호" value={info.orderNumber} />
        <Row label="병원" value={info.hospitalName} />
        <Row label="신청일시" value={info.appliedAt} />

        <div className="mt-1 flex flex-col gap-3">
          {onOpenPrescription && (
            <button
              type="button"
              onClick={onOpenPrescription}
              className="w-full rounded-2xl border border-sky-500 px-4 py-3 text-[15px] font-semibold text-sky-600"
            >
              처방전 보기
            </button>
          )}
          {onOpenConsultation && (
            <button
              type="button"
              onClick={onOpenConsultation}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-[15px] font-semibold text-gray-700"
            >
              진료 완료 상세
            </button>
          )}
        </div>
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



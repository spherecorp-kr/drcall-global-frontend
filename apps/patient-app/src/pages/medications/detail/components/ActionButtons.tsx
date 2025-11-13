type ActionButtonsProps = {
  onTrackNow?: () => void;
  onOpenPrescription?: () => void;
  onOpenConsultation?: () => void;
  className?: string;
};

/**
 * 상세 화면 공통 하단/중간 액션 버튼 묶음
 */
export default function ActionButtons({
  onTrackNow,
  onOpenPrescription,
  onOpenConsultation,
  className,
}: ActionButtonsProps) {
  return (
    <div className={['flex w-full flex-col gap-3', className ?? ''].join(' ')}>
      {onTrackNow && (
        <button
          type="button"
          onClick={onTrackNow}
          className="w-full rounded-2xl border border-sky-500 px-4 py-3 text-[15px] font-semibold text-sky-600"
        >
          실시간 배송 조회
        </button>
      )}
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
  );
}



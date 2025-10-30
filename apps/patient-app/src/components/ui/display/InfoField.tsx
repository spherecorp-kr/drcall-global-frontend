import type { ReactNode } from 'react';

interface InfoFieldProps {
  label: string;
  value: ReactNode;
  bold?: boolean;
  gap?: string;
  icon?: string;
}

/**
 * 정보 필드 컴포넌트
 * - 라벨(회색) + 값(검정) 세로 배치
 * - AppointmentList, Confirmation 등에서 사용
 *
 * @example
 * <InfoField label="예약 번호" value="A123" />
 * <InfoField label="병원" value="Praram9 Hospital" bold />
 * <InfoField icon="/assets/icons/hospital.svg" label="병원" value="Praram9 Hospital" />
 */
export default function InfoField({ label, value, bold = false, gap = '8px', icon }: InfoFieldProps) {
  // gap을 Tailwind 클래스로 변환
  const gapClass = gap === '0.375rem' ? 'gap-[0.375rem]' :
                   gap === '0.5rem' ? 'gap-2' :
                   gap === '8px' ? 'gap-2' : 'gap-2';

  // icon이 없으면 기존 스타일 (세로 배치만)
  if (!icon) {
    return (
      <div className={`flex flex-col ${gapClass}`}>
        <div className="text-[#8A8A8A] text-sm font-normal">
          {label}
        </div>
        <div className={`text-[#1F1F1F] text-base ${bold ? 'font-semibold' : 'font-normal'}`}>
          {value}
        </div>
      </div>
    );
  }

  // icon이 있으면 가로 배치
  return (
    <div className="flex gap-[0.625rem]">
      <div className="flex items-center" style={{ height: '1.6875rem' }}>
        <img
          src={icon}
          alt=""
          className="w-5 h-5"
        />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="text-[#1F1F1F] text-lg font-semibold leading-[1.6875rem]">
          {label}
        </div>
        <div className="text-[#1F1F1F] text-[0.9375rem] font-normal leading-[1.5]">
          {value}
        </div>
      </div>
    </div>
  );
}

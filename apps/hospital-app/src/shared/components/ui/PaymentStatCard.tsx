import { type ReactNode } from 'react';
import { Tooltip } from './Tooltip';

interface PaymentStatCardProps {
  title: string;
  icon: ReactNode;
  amount: string;
  date: string;
  tooltip: string;
}

export function PaymentStatCard({ title, icon, amount, date, tooltip }: PaymentStatCardProps) {
  return (
    <div className="flex-1 bg-bg-white rounded-[10px] border border-stroke-input p-3 sm:p-4 md:p-5 flex flex-col gap-3 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-text-100 text-16 font-semibold font-pretendard">{title}</span>
          <Tooltip content={tooltip}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-40 cursor-help">
              <circle cx="8" cy="8" r="6.67" stroke="currentColor" strokeWidth="1.33" />
              <path
                d="M8 8V10.67M8 5.33H8.0067"
                stroke="currentColor"
                strokeWidth="1.33"
                strokeLinecap="round"
              />
            </svg>
          </Tooltip>
        </div>
        <div className="w-7 h-7 flex items-center justify-center">{icon}</div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-text-100 text-32 font-bold font-pretendard leading-tight">{amount}</div>
        <div className="text-text-40 text-14 font-normal font-pretendard">{date} 기준</div>
      </div>
    </div>
  );
}

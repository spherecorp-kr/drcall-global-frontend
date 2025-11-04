import { type ReactNode } from 'react';
import { Tooltip } from './Tooltip';
import helpIcon from '@/shared/assets/icons/btn_circle_help.svg';
import helpIconBlue from '@/shared/assets/icons/btn_circle_help_blue.svg';

interface PaymentStatCardProps {
  title: string;
  icon: ReactNode;
  amount: string;
  date: string;
  tooltip?: string;
}

export function PaymentStatCard({ title, icon, amount, date, tooltip }: PaymentStatCardProps) {
  // Convert date format from "2025.10.28" to "(28/10/2025)"
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('.');
    return `(${day}/${month}/${year})`;
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Title + Tooltip */}
      <div className="flex items-center gap-1">
        <div className="text-text-100 text-20 font-semibold font-pretendard">
          {title}
        </div>
        {tooltip && (
          <Tooltip content={tooltip} position="bottom">
            {({ isOpen }) => (
              <button className="flex items-center justify-center w-5 h-5">
                {isOpen ? (
                  <img
                    alt="Help icon blue"
                    className="w-5 h-5"
                    src={helpIconBlue}
                  />
                ) : (
                  <img alt="Help icon" className="w-5 h-5" src={helpIcon} />
                )}
              </button>
            )}
          </Tooltip>
        )}
      </div>

      {/* Icon + Amount */}
      <div className="flex items-center gap-5">
        <div className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full bg-bg-blue">
          {icon}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-text-100 text-24 font-medium font-pretendard">
            {amount}
          </div>
          <div className="text-text-70 text-12 font-medium font-pretendard capitalize">
            {formatDate(date)}
          </div>
        </div>
      </div>
    </div>
  );
}

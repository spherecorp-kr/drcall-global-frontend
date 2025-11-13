import type { ReactNode } from 'react';

type SectionProps = {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  headerRight?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * 공통 섹션 래퍼
 * - 환자 앱 상세 화면들에서 일관된 여백/테두리/타이포를 제공
 * - 타이틀과 우측 액션(선택)을 포함할 수 있음
 */
export default function Section({
  title,
  subtitle,
  icon,
  headerRight,
  className,
  children,
}: SectionProps) {
  return (
    <section
      className={[
        'w-full rounded-2xl border border-gray-100 bg-white',
        'px-5 py-4',
        className ?? '',
      ].join(' ')}
    >
      {(title || subtitle || icon || headerRight) && (
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon && <div className="shrink-0">{icon}</div>}
            <div className="flex flex-col">
              {title && (
                <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
              )}
              {subtitle && (
                <p className="text-[13px] text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}



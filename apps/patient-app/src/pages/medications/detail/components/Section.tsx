import type { ReactNode } from 'react';

type SectionProps = {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  headerRight?: ReactNode;
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
  headerRight,
  children,
}: SectionProps) {
  return (
    <section
      style={{
        width: '100%',
        background: 'transparent'
      }}
    >
      {(title || subtitle || headerRight) && (
        <div
          style={{
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {title && (
                <h2
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1F1F1F'
                  }}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    margin: 0
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}



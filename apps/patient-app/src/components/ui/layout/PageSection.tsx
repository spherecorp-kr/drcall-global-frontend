import type { ReactNode, CSSProperties } from 'react';

interface PageSectionProps {
  children: ReactNode;
  title?: string;
  icon?: string;
  gap?: 'sm' | 'md' | 'lg';
  background?: 'white' | 'gray';
  padding?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * 페이지 섹션 컴포넌트
 * - 섹션별 일관된 스타일 적용
 * - 타이틀, 아이콘, 간격 옵션 제공
 */
export default function PageSection({
  children,
  title,
  icon,
  gap = 'md',
  background,
  padding = true,
  className = '',
  style,
}: PageSectionProps) {
  const gapMap = {
    sm: '0.625rem',   // 10px
    md: '1.25rem',    // 20px
    lg: '1.875rem',   // 30px
  };

  const getBackground = () => {
    if (!background) return 'transparent';
    return background === 'white' ? '#FFFFFF' : '#F5F5F5';
  };

  return (
    <div
      style={{
        background: getBackground(),
        padding: padding ? '1.25rem' : '0',
        display: 'flex',
        flexDirection: 'column',
        gap: gapMap[gap],
        ...style,
      }}
      className={className}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {icon && (
            <img src={icon} alt="" style={{ width: '1.375rem', height: '1.375rem' }} />
          )}
          <h2
            style={{
              color: '#1F1F1F',
              fontSize: '1.125rem',
              fontWeight: '600',
              margin: 0
            }}
          >
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
}

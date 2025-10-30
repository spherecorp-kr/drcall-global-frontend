import type { CSSProperties, ReactNode } from 'react';

interface PageTitleProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * 페이지 타이틀 컴포넌트
 * - 1.5rem (24px), font-weight 600
 * - 줄바꿈(\n) 지원
 */
export default function PageTitle({ children, className = '', style }: PageTitleProps) {
  return (
    <h1
      style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1F1F1F',
        lineHeight: '1.4',
        margin: 0,
        whiteSpace: 'pre-line',
        ...style,
      }}
      className={className}
    >
      {children}
    </h1>
  );
}

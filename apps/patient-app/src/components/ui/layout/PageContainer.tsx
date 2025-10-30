import type { ReactNode, CSSProperties } from 'react';

interface PageContainerProps {
  children: ReactNode;
  hasBottomButton?: boolean;
  background?: 'white' | 'gray';
  className?: string;
  style?: CSSProperties;
}

/**
 * 페이지 전체 컨테이너 컴포넌트
 * - 하단 버튼이 있을 경우 paddingBottom 자동 적용
 * - 배경색 옵션 제공
 */
export default function PageContainer({
  children,
  hasBottomButton = false,
  background = 'white',
  className = '',
  style,
}: PageContainerProps) {
  return (
    <div
      style={{
        paddingBottom: hasBottomButton ? '5.625rem' : '1.25rem',
        background: background === 'white' ? '#FFFFFF' : '#F5F5F5',
        minHeight: '100%',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

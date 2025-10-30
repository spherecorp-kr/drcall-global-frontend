import type { ReactNode } from 'react';

interface BottomButtonLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * 하단 버튼 레이아웃 컴포넌트
 * - fixed 포지션으로 하단에 고정
 * - 최대 너비 414px (모바일 기준)
 */
export default function BottomButtonLayout({ 
  children,
  fullWidth = false,
  className = '',
  contentClassName = '',
}: BottomButtonLayoutProps) {
  const outerClassName = [
    'fixed bottom-0 left-0 right-0 z-10',
    fullWidth ? 'w-full' : 'max-w-[414px] mx-auto',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const innerClassName = [
    'w-full',
    contentClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={outerClassName}>
      <div className={innerClassName}>
        {children}
      </div>
    </div>
  );
}

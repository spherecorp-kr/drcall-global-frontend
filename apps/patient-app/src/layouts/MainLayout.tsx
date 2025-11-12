import type { ReactNode, CSSProperties } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  headerBackground?: 'white' | 'gray';
  showHeader?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  fullWidth?: boolean;
  contentClassName?: string;
  headerRight?: ReactNode;
  style?: CSSProperties;
  headerStyle?: CSSProperties;
  closeBackground?: 'white' | 'clear';
}

/**
 * 메인 레이아웃 컴포넌트
 * - 최대 너비 414px (모바일 기준)
 * - 헤더 60px (시스템 바 제거)
 * - 콘텐츠 영역: 전체 패딩 24px
 * - 하단 버튼을 위한 90px 여백
 */
export default function MainLayout({
  children,
  title = '',
  headerBackground = 'gray',
  showHeader = true,
  onClose,
  onBack,
  fullWidth = false,
  contentClassName,
  headerRight,
  style,
  headerStyle,
  closeBackground = 'clear'
}: MainLayoutProps) {
  const containerClassName = [
    'relative w-full min-h-screen bg-[#fafafa] flex flex-col',
    !fullWidth && 'max-w-[414px] mx-auto',
  ]
    .filter(Boolean)
    .join(' ');

  const contentAreaClassName = [
    'flex-1 w-full',
    contentClassName !== undefined ? contentClassName : 'p-6 pb-[90px]',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName} style={{...style}}>
      {/* Header - 60px (시스템 바 제거) */}
      {showHeader && (
        <div style={{
          width: '100%',
          height: '5.625rem',
          background: headerBackground === 'white' ? '#FFFFFF' : '#FAFAFA',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...headerStyle
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.875rem',
                  height: '1.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 0
                }}
                aria-label="Back"
              >
                <img src="/assets/icons/back.svg" alt="Back" style={{ width: '1.875rem', height: '1.875rem' }} />
              </button>
            )}

            <h1 style={{
              textAlign: 'center',
              color: 'black',
              fontSize: title.length > 20 ? '0.875rem' : title.length > 15 ? '1rem' : '1.125rem',
              fontWeight: '500',
              margin: 0,
              width: 'calc(100% - 7rem)', // 좌우 3.5rem씩 항상 확보
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}>
              {title}
            </h1>

            {onClose && (
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.875rem',
                  height: '1.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: closeBackground === 'white' ? '#FFFFFF' : 'transparent',
                  cursor: 'pointer',
                  padding: 0
                }}
                aria-label="Close"
              >
                <img src="/assets/icons/close.svg" alt="Close" style={{ width: '1.875rem', height: '1.875rem' }} />
              </button>
            )}

            {headerRight && (
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)'
              }}>
                {headerRight}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Area - 전체 패딩 24px 적용 */}
      <div className={contentAreaClassName}>
        {children}
      </div>
    </div>
  );
}

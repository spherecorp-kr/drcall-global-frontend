import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'center' | 'bottom';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 2000, position = 'center', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const positionStyles = position === 'bottom'
    ? {
        position: 'fixed' as const,
        bottom: '90px', // 버튼 높이(70px) + 간격(20px)
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        width: '100%',
        maxWidth: '25.875rem',
        paddingLeft: '2.5rem',
        paddingRight: '2.5rem',
      }
    : {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        width: '100%',
        maxWidth: '25.875rem',
        paddingLeft: '2.5rem',
        paddingRight: '2.5rem',
      };

  // Type별 배경색 (심플하게)
  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return '#FF3B30'; // iOS 레드
      case 'warning':
        return '#FF9500'; // iOS 오렌지
      case 'success':
        return '#34C759'; // iOS 그린
      case 'info':
      default:
        return '#3A3A3C'; // 다크 그레이
    }
  };

  return (
    <div style={positionStyles}>
      <div
        style={{
          width: '100%',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          paddingTop: '0.875rem',
          paddingBottom: '0.875rem',
          background: getBackgroundColor(),
          borderRadius: '0.625rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: '0.9375rem',
            fontFamily: 'Pretendard',
            fontWeight: '500',
            wordWrap: 'break-word',
            lineHeight: '1.4',
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
}

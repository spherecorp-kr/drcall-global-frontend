import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ReactNode;
  confirmText?: string;
}

/**
 * 알림 모달 컴포넌트
 * - 단순 알림 메시지 표시
 * - 중앙 정렬 팝업
 * - 확인 버튼 하나
 */
export default function AlertModal({
  isOpen,
  onClose,
  message,
  confirmText
}: AlertModalProps) {
  const { t } = useTranslation();
  const buttonText = confirmText || t('common.confirm');
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(8.50, 8.50, 8.50, 0.60)'
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          width: 'calc(100% - 40px)',
          maxWidth: '374px',
          background: 'white',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        {/* Message */}
        <div
          style={{
            padding: '2.875rem 1.25rem',
            textAlign: 'center',
            color: '#1F1F1F',
            fontSize: '1.25rem',
            fontWeight: '400',
            lineHeight: '1.4',
            whiteSpace: 'pre-line'
          }}
        >
          {message}
        </div>

        {/* Confirm Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '3.9375rem',
            background: '#00A0D2',
            border: 'none',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

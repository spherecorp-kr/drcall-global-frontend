import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText
}: ConfirmModalProps) {
  const { t } = useTranslation();
  const confirmButtonText = confirmText || t('common.confirm');
  const cancelButtonText = cancelText || t('common.cancel');
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onCancel}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '640px',
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 메시지 */}
        <div style={{
          padding: '3.75rem 2.5rem',
          textAlign: 'center',
          color: '#1F1F1F',
          fontSize: '1.5rem',
          fontWeight: '600',
          lineHeight: '1.4',
          whiteSpace: 'pre-line'
        }}>
          {message}
        </div>

        {/* 버튼 영역 */}
        <div style={{
          display: 'flex',
          height: '4.375rem'
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              background: '#BBBBBB',
              border: 'none',
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              background: '#00A0D2',
              border: 'none',
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

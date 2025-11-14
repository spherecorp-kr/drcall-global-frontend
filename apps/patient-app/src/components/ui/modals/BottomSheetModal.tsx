import type { ReactNode } from 'react';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants';
import { useTranslation } from 'react-i18next';

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
}

export default function BottomSheetModal({
  isOpen,
  onClose,
  title,
  children,
  confirmText = '확인',
  onConfirm
}: BottomSheetModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: COLORS.overlay.modal
        }}
      />

      {/* Bottom Sheet */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        background: COLORS.background.white,
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'inline-flex'
      }}>
        {/* Header */}
        <div style={{
          alignSelf: 'stretch',
          paddingTop: '30px',
          paddingLeft: SPACING.xl,
          paddingRight: SPACING.xl,
          paddingBottom: SPACING.sm,
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'inline-flex'
        }}>
          <div style={{
            width: '350px',
            height: '26px',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            color: COLORS.text.primary,
            fontSize: FONT_SIZE.xl,
            fontWeight: FONT_WEIGHT.semibold
          }}>
            {title}
          </div>
          <div style={{ width: '24px', height: '24px' }} />
          <button
            onClick={onClose}
            style={{
              width: '24px',
              height: '24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img src='/assets/icons/btn_close_pupup.svg' alt='close_popup' width={24} height={24}/>
          </button>
        </div>

        {/* Content */}
        <div style={{
          alignSelf: 'stretch',
          maxHeight: '290px',
          paddingBottom: SPACING.xl,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          display: 'flex'
        }}>
          {children}
        </div>

        {/* Confirm Button */}
        <div style={{
          alignSelf: 'stretch',
          background: COLORS.background.white,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: SPACING.sm,
          display: 'inline-flex'
        }}>
          <button
            onClick={handleConfirm}
            style={{
              flex: '1 1 0',
              height: '63px',
              background: COLORS.primary,
              border: 'none',
              color: COLORS.text.white,
              fontSize: FONT_SIZE.lg,
              fontWeight: FONT_WEIGHT.medium,
              cursor: 'pointer',
              textAlign: 'center',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {confirmText === '확인' ? t('common.confirm') : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

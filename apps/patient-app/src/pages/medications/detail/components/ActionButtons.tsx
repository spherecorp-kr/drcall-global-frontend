import { useTranslation } from 'react-i18next';

type ActionButtonsProps = {
  onTrackNow?: () => void;
  onOpenPrescription?: () => void;
  onOpenConsultation?: () => void;
  className?: string;
};

/**
 * 상세 화면 공통 하단/중간 액션 버튼 묶음
 */
export default function ActionButtons({
  onTrackNow,
  onOpenPrescription,
  onOpenConsultation,
  className,
}: ActionButtonsProps) {
  const { t } = useTranslation();
  const outlinedButtonStyle: React.CSSProperties = {
    marginTop: '0.75rem',
    width: '100%',
    height: '3rem',
    background: 'white',
    borderRadius: '1.5rem',
    border: '1px solid #00A0D2',
    color: '#00A0D2',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  return (
    <div className={['flex w-full flex-col gap-3', className ?? ''].join(' ')}>
      {onTrackNow && (
        <button type="button" onClick={onTrackNow} style={outlinedButtonStyle}>
          {t('medication.detail.actions.trackNow')}
        </button>
      )}
      {onOpenPrescription && (
        <button type="button" onClick={onOpenPrescription} style={outlinedButtonStyle}>
          {t('medication.detail.actions.viewPrescription')}
        </button>
      )}
      {onOpenConsultation && (
        <button type="button" onClick={onOpenConsultation} style={outlinedButtonStyle}>
          {t('medication.detail.actions.viewConsultation')}
        </button>
      )}
    </div>
  );
}



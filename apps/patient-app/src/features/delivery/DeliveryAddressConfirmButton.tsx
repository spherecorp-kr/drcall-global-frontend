import { useTranslation } from 'react-i18next';

type Props = {
  enabled: boolean;
  labelKey: string;
  onConfirm: () => void;
};

/**
 * 배송지 확인 버튼
 * @param enabled 활성화 여부
 * @param labelKey 라벨 키
 * @param onConfirm 확인 핸들러
 */
export default function DeliveryAddressConfirmButton({ enabled, labelKey, onConfirm }: Props) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        width: '100%',
        height: '4.375rem',
        background: enabled ? '#00A0D2' : '#D0D0D0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: enabled ? 'pointer' : 'not-allowed',
        flexShrink: 0
      }}
      onClick={() => {
        if (!enabled) return;
        onConfirm();
      }}
    >
      <div
        style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '1.125rem',
          fontWeight: '500'
        }}
      >
        {t(labelKey)}
      </div>
    </div>
  );
}



import { useTranslation } from 'react-i18next';

interface NoticeProps {
  items: string[];
}

export default function Notice({ items }: NoticeProps) {
  const { t } = useTranslation();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      marginBottom: '1.25rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem'
      }}>
        <div style={{
          width: '0.9375rem',
          height: '0.9375rem',
          borderRadius: '50%',
          border: '1.5px solid #00A0D2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <span style={{
            color: '#00A0D2',
            fontSize: '0.625rem',
            fontFamily: 'Noto Sans',
            fontWeight: '600',
            lineHeight: '1'
          }}>!</span>
        </div>
        <div style={{
          color: '#00A0D2',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          {t('common.notice')}
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem'
      }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              color: '#8A8A8A',
              fontSize: '0.875rem',
              fontWeight: '400',
              lineHeight: '1.6'
            }}
          >
            · {item}
          </div>
        ))}
      </div>
    </div>
  );
}

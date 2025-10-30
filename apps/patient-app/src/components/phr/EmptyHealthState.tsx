import { useTranslation } from 'react-i18next';

export default function EmptyHealthState() {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '7.5rem', paddingBottom: '7.5rem' }}>
      {/* Empty illustration */}
      <div style={{ width: '15.625rem', height: '12.5625rem', position: 'relative', marginBottom: '1.25rem' }}>
        <img src="/src/assets/icons/empty_state.svg" alt="Empty state" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Empty message */}
      <p style={{ textAlign: 'center', color: '#979797', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '500' }}>
        {t('phr.noRegisteredInfo')}
      </p>
    </div>
  );
}

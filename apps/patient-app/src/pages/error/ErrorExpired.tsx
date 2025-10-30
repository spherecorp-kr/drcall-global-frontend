import { useTranslation } from 'react-i18next';
import ErrorPage from './ErrorPage';

export default function ErrorExpired() {
  const { t } = useTranslation();

  return (
    <ErrorPage
      title={t('error.errorExpired.title')}
      description={t('error.errorExpired.description')}
      subDescription={t('error.errorExpired.subDescription')}
    />
  );
}

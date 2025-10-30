import { useTranslation } from 'react-i18next';
import ErrorPage from './ErrorPage';

export default function Error500() {
  const { t } = useTranslation();

  return (
    <ErrorPage
      errorCode="500"
      title={t('error.error500.title')}
      description={t('error.error500.description')}
      subDescription={t('error.error500.subDescription')}
    />
  );
}

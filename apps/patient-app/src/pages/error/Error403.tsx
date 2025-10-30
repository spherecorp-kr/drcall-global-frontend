import { useTranslation } from 'react-i18next';
import ErrorPage from './ErrorPage';

export default function Error403() {
  const { t } = useTranslation();

  return (
    <ErrorPage
      errorCode="403"
      title={t('error.error403.title')}
      description={t('error.error403.description')}
      subDescription={t('error.error403.subDescription')}
    />
  );
}

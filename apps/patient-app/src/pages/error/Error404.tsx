import { useTranslation } from 'react-i18next';
import ErrorPage from './ErrorPage';

export default function Error404() {
  const { t } = useTranslation();

  return (
    <ErrorPage
      errorCode="404"
      title={t('error.error404.title')}
      description={t('error.error404.description')}
      subDescription={t('error.error404.subDescription')}
    />
  );
}

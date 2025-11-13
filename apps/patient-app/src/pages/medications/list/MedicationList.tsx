import MainLayout from '@layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function MedicationList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  return (
    <MainLayout
      title={t('medication.list.title')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
    >
      <div style={{
        paddingBottom: '1.25rem',
        minHeight: 'calc(100vh - 3.5rem)'
      }}>
        {/* Medication List Content will be implemented in subsequent steps */}
      </div>
    </MainLayout>
  );
}
import { useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import PageTitle from '@ui/layout/PageTitle';
import Divider from '@ui/layout/Divider';
import HealthRecordCard from '@components/phr/HealthRecordCard';
import { usePhrStore } from '@store/phrStore';

export default function PhrDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { latestRecords, fetchLatestRecords } = usePhrStore();

  useEffect(() => {
    fetchLatestRecords();
  }, [fetchLatestRecords]);

  const healthRecords = [
    {
      type: 'height_weight' as const,
      title: t('phr.heightWeight'),
      icon: '/src/assets/icons/phr/ic_weight.svg',
      color: '#3076DF',
      route: '/phr/height_weight',
      record: latestRecords?.heightWeight,
    },
    {
      type: 'blood_pressure' as const,
      title: t('phr.bloodPressure'),
      icon: '/src/assets/icons/phr/ic_heart.svg',
      color: '#FF2E53',
      route: '/phr/blood_pressure',
      record: latestRecords?.bloodPressure,
    },
    {
      type: 'blood_sugar' as const,
      title: t('phr.bloodSugar'),
      icon: '/src/assets/icons/phr/ic_Blood sugar.svg',
      color: '#FFB054',
      route: '/phr/blood_sugar',
      record: latestRecords?.bloodSugar,
    },
    {
      type: 'temperature' as const,
      title: t('phr.temperature'),
      icon: '/src/assets/icons/phr/ic_Temperature.svg',
      color: '#FF5C00',
      route: '/phr/temperature',
      record: latestRecords?.temperature,
    },
  ];

  return (
    <MainLayout title={t('phr.title')} showHeader onBack={() => navigate('/')} fullWidth contentClassName="p-0">
      <PageContainer style={{ background: 'transparent' }}>
        {/* Title */}
        <PageSection style={{ background: 'transparent', padding: '0 1.25rem' }}>
          <PageTitle>{t('phr.dashboardTitle')}</PageTitle>
        </PageSection>

        {/* Health Record Cards */}
        <PageSection padding style={{ background: 'transparent' }} gap='sm'>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {healthRecords.map((item, index) => (
              <Fragment key={item.type}>
                <HealthRecordCard
                  type={item.type}
                  title={item.title}
                  icon={item.icon}
                  color={item.color}
                  route={item.route}
                  record={item.record}
                />
                {index < healthRecords.length - 1 && <Divider />}
              </Fragment>
            ))}
          </div>
        </PageSection>
      </PageContainer>
    </MainLayout>
  );
}

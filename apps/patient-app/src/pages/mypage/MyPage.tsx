import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import PageTitle from '@ui/layout/PageTitle';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';

export default function MyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClose = () => {
    navigate(-1);
  };

  const menuItems = [
    {
      id: 'profile',
      title: t('mypage.profile'),
      description: t('mypage.profileDescription'),
      icon: '/assets/icons/mypage-profile.svg',
      onClick: () => navigate('/mypage/profile'),
    },
    {
      id: 'delivery',
      title: t('mypage.delivery'),
      description: t('mypage.deliveryDescription'),
      icon: '/assets/icons/mypage-delivery.svg',
      onClick: () => navigate('/mypage/delivery'),
    },
    {
      id: 'announcements',
      title: t('mypage.announcements'),
      description: t('mypage.announcementsDescription'),
      icon: '/assets/icons/mypage-announcements.svg',
      onClick: () => navigate('/mypage/announcements'),
    },
    {
      id: 'faq',
      title: t('mypage.faq'),
      description: t('mypage.faqDescription'),
      icon: '/assets/icons/mypage-faq.svg',
      onClick: () => navigate('/mypage/faq'),
    },
    {
      id: 'terms',
      title: t('mypage.terms'),
      description: t('mypage.termsDescription'),
      icon: '/assets/icons/mypage-terms.svg',
      onClick: () => navigate('/mypage/terms'),
    },
    {
      id: 'settings',
      title: t('mypage.settings'),
      description: t('mypage.settingsDescription'),
      icon: '/assets/icons/mypage-settings.svg',
      onClick: () => navigate('/mypage/settings'),
    },
  ];

  return (
    <MainLayout
      title={t('mypage.title')}
      onClose={handleClose}
      fullWidth
      contentClassName="p-0"
    >
      <PageContainer style={{ background: 'transparent' }}>
        {/* Title */}
        <PageSection padding style={{ marginBottom: '1.25rem' }}>
          <PageTitle>{t('mypage.menuTitle')}</PageTitle>
        </PageSection>

        {/* Menu Cards */}
        <PageSection padding style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              style={{
                width: '100%',
                textAlign: 'left',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {/* Card background with icon */}
                <div
                  style={{
                    width: '100%',
                    height: '6.4375rem',
                    background: '#00A0D2',
                    borderRadius: '0.625rem',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '1.5rem',
                  }}
                >
                  {/* Icon */}
                  <img
                    src={item.icon}
                    alt={item.title}
                    style={{ width: '4.5rem', height: '4.5rem', objectFit: 'contain' }}
                  />
                  {/* Title overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '1.25rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'white',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      fontFamily: 'Pretendard',
                    }}
                  >
                    {item.title}
                  </div>
                </div>
                {/* Description */}
                <p
                  style={{
                    color: '#2F2F2F',
                    fontSize: '1rem',
                    fontWeight: '400',
                    fontFamily: 'Pretendard',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </PageSection>
      </PageContainer>
    </MainLayout>
  );
}

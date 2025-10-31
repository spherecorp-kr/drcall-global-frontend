import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import EmptyState from '@ui/display/EmptyState';

interface Announcement {
  id: string;
  date: string;
  title: string;
}

export default function AnnouncementList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // TODO: API에서 공지사항 목록 가져오기
  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      date: '15/06/2023',
      title: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    },
    {
      id: '2',
      date: '15/06/2023',
      title: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    },
    {
      id: '3',
      date: '15/06/2023',
      title: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    },
    {
      id: '4',
      date: '15/06/2023',
      title: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    },
    {
      id: '5',
      date: '15/06/2023',
      title: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    },
    {
      id: '6',
      date: '15/06/2023',
      title: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    },
    {
      id: '7',
      date: '15/06/2023',
      title: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    },
    {
      id: '8',
      date: '15/06/2023',
      title: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    },
    {
      id: '9',
      date: '15/06/2023',
      title: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    }
  ]);

  const handleBack = () => {
    navigate('/mypage');
  };

  const handleClose = () => {
    navigate('/mypage');
  };

  const handleAnnouncementClick = (announcementId: string) => {
    // TODO: 공지사항 상세 페이지로 이동
    navigate(`/mypage/announcement/${announcementId}`);
  };

  return (
    <MainLayout
      title={t('mypage.announcements')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName=""
    >
      <div
        style={{
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem'
        }}
      >
        {announcements.length === 0 ? (
          <EmptyState
            icon={
              <img
                src="/src/assets/icons/empty_state.svg"
                alt="Empty"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            }
            message={t('mypage.noAnnouncements')}
          />
        ) : (
          <div
            style={{
              background: 'white',
              borderRadius: '0.625rem',
              overflow: 'hidden'
            }}
          >
            {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement.id)}
              style={{
                padding: '1.25rem',
                borderBottom: index < announcements.length - 1 ? '1px solid #E0E0E0' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
                cursor: 'pointer'
              }}
            >
              {/* 날짜 */}
              <div
                style={{
                  color: '#979797',
                  fontSize: '0.875rem',
                  fontWeight: '400'
                }}
              >
                {announcement.date}
              </div>

              {/* 제목과 화살표 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.625rem'
                }}
              >
                <div
                  style={{
                    flex: 1,
                    color: '#1F1F1F',
                    fontSize: '1rem',
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {announcement.title}
                </div>

                {/* 오른쪽 화살표 */}
                <img src='/assets/icons/btn_more.svg' alt='more' width={24} height={24}/>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

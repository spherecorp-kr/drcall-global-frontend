import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';

interface AnnouncementDetailData {
  id: string;
  title: string;
  date: string;
  content: string;
  imageUrl?: string;
}

export default function AnnouncementDetail() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  // TODO: API에서 공지사항 상세 정보 가져오기
  const [announcement] = useState<AnnouncementDetailData>({
    id: id || '1',
    title: 'Prem Ipsum Lorem Ipsum Lorem',
    date: '15/06/2023',
    content: `Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem`,
    imageUrl: undefined // 이미지가 있으면 URL 추가
  });

  const handleBack = () => {
    navigate('/mypage/announcements');
  };

  const handleClose = () => {
    navigate('/mypage');
  };

  return (
    <MainLayout
      title={t('mypage.announcementDetail')}
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
          paddingBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        {/* 제목 */}
        <div
          style={{
            color: '#1F1F1F',
            fontSize: '1.25rem',
            fontWeight: '600',
            fontFamily: 'Pretendard',
            lineHeight: '1.5'
          }}
        >
          {announcement.title}
        </div>

        {/* 날짜 */}
        <div
          style={{
            color: '#979797',
            fontSize: '0.875rem',
            fontWeight: '400',
            fontFamily: 'Pretendard'
          }}
        >
          {announcement.date}
        </div>

        {/* 구분선 */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: '#E0E0E0'
          }}
        />

        {/* 이미지 (있는 경우) */}
        {announcement.imageUrl && (
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              background: '#D9D9D9',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <img
              src={announcement.imageUrl}
              alt="공지사항 이미지"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}

        {/* 이미지 플레이스홀더 (이미지 URL이 없을 때) */}
        {!announcement.imageUrl && (
          <div
            style={{
              width: '100%',
              height: '16.25rem',
              background: '#D9D9D9',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                color: '#8A8A8A',
                fontSize: '1.25rem',
                fontFamily: 'Pretendard',
                fontWeight: '400'
              }}
            >
              {/* img placeholder */}
            </div>
          </div>
        )}

        {/* 본문 내용 */}
        <div
          style={{
            color: '#1F1F1F',
            fontSize: '1rem',
            fontWeight: '400',
            fontFamily: 'Pretendard',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {announcement.content}
        </div>
      </div>
    </MainLayout>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import EmptyState from '@ui/display/EmptyState';

interface Term {
  id: string;
  title: string;
}

export default function TermsList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // TODO: API에서 약관 목록 가져오기
  const [terms] = useState<Term[]>([
    {
      id: '1',
      title: 'Where can I check the medical certificate?'
    },
    {
      id: '2',
      title: 'What kind of hospitals are available?'
    },
    {
      id: '3',
      title: 'What kind of hospitals are available?'
    },
    {
      id: '4',
      title: 'What kind of hospitals are available?'
    },
    {
      id: '5',
      title: 'Where can I check the medical certificate?'
    },
    {
      id: '6',
      title: 'What kind of hospitals are available?'
    },
    {
      id: '7',
      title: 'What kind of hospitals are available?'
    },
    {
      id: '8',
      title: 'Where can I check the medical certificate?'
    },
    {
      id: '9',
      title: 'Where can I check the medical certificate?'
    },
    {
      id: '10',
      title: 'Where can I check the medical certificate?'
    }
  ]);

  const handleBack = () => {
    navigate('/mypage');
  };

  const handleClose = () => {
    navigate('/mypage');
  };

  const handleTermClick = (termId: string) => {
    // TODO: 약관 상세 페이지로 이동
    navigate(`/mypage/terms/${termId}`);
  };

  return (
    <MainLayout
      title={t('mypage.terms')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName=""
    >
      <div
        style={{
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          paddingBottom: '1.25rem'
        }}
      >
        {terms.length === 0 ? (
          <EmptyState
            icon={
              <img
                src="/src/assets/icons/empty_state.svg"
                alt="Empty"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            }
            message={t('mypage.noTerms')}
          />
        ) : (
          <div
            style={{
              background: 'white',
              borderRadius: '0.625rem',
              overflow: 'hidden'
            }}
          >
            {terms.map((term, index) => (
              <div
                key={term.id}
                onClick={() => handleTermClick(term.id)}
                style={{
                  padding: '1.25rem',
                  borderBottom: index < terms.length - 1 ? '1px solid #E0E0E0' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.625rem',
                  cursor: 'pointer'
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
                  {term.title}
                </div>

                {/* 오른쪽 화살표 */}
                <img src='/assets/icons/btn_more.svg' alt='more' width={24} height={24}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

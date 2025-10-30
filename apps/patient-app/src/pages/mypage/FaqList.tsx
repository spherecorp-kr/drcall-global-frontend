import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import EmptyState from '@ui/display/EmptyState';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function FaqList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // TODO: API에서 FAQ 목록 가져오기
  const [faqs] = useState<FaqItem[]>([
    {
      id: '1',
      question: 'Where can I check the medical certificate?',
      answer: 'In My Health - Medical History, you can check and download the medical certificate by selecting the desired medical record. The medical certificate includes detailed information about your consultation, diagnosis, prescribed medications, and doctor\'s recommendations. You can download it as a PDF file and print it if needed. The certificate is digitally signed and can be used for insurance claims, workplace submissions, or any official purposes that require medical documentation. If you need multiple copies, you can download it as many times as needed without any additional charges.'
    },
    {
      id: '2',
      question: 'What kind of hospitals are available?',
      answer: 'We partner with major hospitals across the country. You can check the list of available hospitals in the hospital search section. Our network includes general hospitals, specialized clinics, dental clinics, and mental health facilities. Each hospital has been carefully selected to ensure high-quality medical services and patient care. You can filter hospitals by location, specialty, doctor ratings, and available appointment times. Most of our partner hospitals offer both in-person and telemedicine consultations, giving you flexibility in how you receive medical care.'
    },
    {
      id: '3',
      question: 'What kind of hospitals are available?',
      answer: 'We partner with major hospitals across the country. You can check the list of available hospitals in the hospital search section. Our network includes general hospitals, specialized clinics, dental clinics, and mental health facilities. Each hospital has been carefully selected to ensure high-quality medical services and patient care.'
    },
    {
      id: '4',
      question: 'What kind of hospitals are available?',
      answer: 'We partner with major hospitals across the country. You can check the list of available hospitals in the hospital search section.'
    },
    {
      id: '5',
      question: 'Where can I check the medical certificate?',
      answer: 'In My Health - Medical History, you can check and download the medical certificate by selecting the desired medical record. The medical certificate includes detailed information about your consultation, diagnosis, prescribed medications, and doctor\'s recommendations.'
    },
    {
      id: '6',
      question: 'What kind of hospitals are available?',
      answer: 'We partner with major hospitals across the country. You can check the list of available hospitals in the hospital search section.'
    },
    {
      id: '7',
      question: 'What kind of hospitals are available?',
      answer: 'We partner with major hospitals across the country. You can check the list of available hospitals in the hospital search section.'
    },
    {
      id: '8',
      question: 'Where can I check the medical certificate?',
      answer: 'In My Health - Medical History, you can check and download the medical certificate by selecting the desired medical record.'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('1'); // 첫 번째 항목이 펼쳐진 상태

  const handleBack = () => {
    navigate('/mypage');
  };

  const handleClose = () => {
    navigate('/mypage');
  };

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 검색어로 필터링
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 검색어 하이라이팅 함수
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} style={{ color: '#00A0D2', fontWeight: '700' }}>
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <MainLayout
      title={t('mypage.faq')}
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
        {/* 검색 입력 */}
        <div
          style={{
            position: 'relative',
            width: '100%'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#00A0D2" strokeWidth="2"/>
              <path d="M16 16L21 21" stroke="#00A0D2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('mypage.searchPlaceholder')}
            style={{
              width: '100%',
              height: '2.875rem',
              paddingLeft: '3.25rem',
              paddingRight: searchQuery ? '3rem' : '1rem',
              background: 'white',
              borderRadius: '6.25rem',
              border: '1px solid #00A0D2',
              boxShadow: '0px 0px 4px 3px rgba(179, 179, 179, 0.15)',
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400',
              fontFamily: 'Pretendard',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <div
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1.5rem',
                height: '1.5rem',
                background: '#D5D5D5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>

        {/* FAQ 목록 */}
        {filteredFaqs.length === 0 ? (
          <EmptyState
            icon={
              <img
                src="/assets/icons/search-empty-state.svg"
                alt="검색 결과 없음"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            }
            message={t('mypage.noSearchResults')}
          />
        ) : (
          <div
            style={{
              background: 'white',
              borderRadius: '0.625rem',
              overflow: 'hidden'
            }}
          >
            {filteredFaqs.map((faq, index) => (
              <div key={faq.id}>
                {/* 질문 */}
                <div
                  onClick={() => handleToggle(faq.id)}
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.625rem',
                    cursor: 'pointer',
                    borderBottom: expandedId === faq.id || index === filteredFaqs.length - 1 ? 'none' : '1px solid #E0E0E0'
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      color: '#1F1F1F',
                      fontSize: '1rem',
                      fontWeight: '600',
                      fontFamily: 'Pretendard',
                      lineHeight: '1.5'
                    }}
                  >
                    {highlightText(faq.question, searchQuery)}
                  </div>

                  {/* 화살표 아이콘 */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      flexShrink: 0,
                      transform: expandedId === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <path d="M6 9L12 15L18 9" stroke="#D0D0D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* 답변 */}
                {expandedId === faq.id && (
                  <div
                    style={{
                      paddingLeft: '1.25rem',
                      paddingRight: '1.25rem',
                      paddingBottom: '1.25rem',
                      paddingTop: '0',
                      borderBottom: index < filteredFaqs.length - 1 ? '1px solid #E0E0E0' : 'none',
                      color: '#979797',
                      fontSize: '0.875rem',
                      fontWeight: '400',
                      fontFamily: 'Pretendard',
                      lineHeight: '1.6'
                    }}
                  >
                    {highlightText(faq.answer, searchQuery)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

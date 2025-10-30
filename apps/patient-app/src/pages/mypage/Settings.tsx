import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import MainLayout from '@layouts/MainLayout';
import { useLanguageStore, type Language } from '../../stores/languageStore';

export default function Settings() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { language: globalLanguage, setLanguage } = useLanguageStore();

  // 로컬 상태로 선택된 언어 관리 (화면에만 반영)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(globalLanguage);

  const handleBack = () => {
    // 저장하지 않고 뒤로가기 - 원래 언어로 복원
    i18n.changeLanguage(globalLanguage);
    navigate('/mypage');
  };

  const handleClose = () => {
    // 저장하지 않고 닫기 - 원래 언어로 복원
    i18n.changeLanguage(globalLanguage);
    navigate('/mypage');
  };

  const handleSave = () => {
    // 저장 버튼 클릭 시에만 전역 상태 변경
    setLanguage(selectedLanguage);
    navigate('/mypage');
  };

  const handleLanguageSelect = (lang: Language) => {
    // 선택 시 로컬 상태 변경 및 화면에 즉시 반영
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <MainLayout
      title={t('mypage.settings')}
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
          paddingBottom: '6rem'
        }}
      >
          {/* 언어 설정 섹션 */}
          <div>
            <div
              style={{
                color: '#1F1F1F',
                fontSize: '1.125rem',
                fontWeight: '600',
                fontFamily: 'Pretendard',
                marginBottom: '1.25rem'
              }}
            >
              {t('mypage.language')}
            </div>

            {/* 언어 옵션 목록 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              {/* 태국어 */}
              <div
                onClick={() => handleLanguageSelect('th')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={selectedLanguage === 'th' ? '/assets/icons/radio-checked.svg' : '/assets/icons/radio-unchecked.svg'}
                  alt="radio"
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    flexShrink: 0
                  }}
                />
                <div
                  style={{
                    color: '#1F1F1F',
                    fontSize: '1rem',
                    fontWeight: '400',
                    fontFamily: 'Pretendard'
                  }}
                >
                  {t('mypage.thai')}
                </div>
              </div>

              {/* 영어 */}
              <div
                onClick={() => handleLanguageSelect('en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={selectedLanguage === 'en' ? '/assets/icons/radio-checked.svg' : '/assets/icons/radio-unchecked.svg'}
                  alt="radio"
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    flexShrink: 0
                  }}
                />
                <div
                  style={{
                    color: '#1F1F1F',
                    fontSize: '1rem',
                    fontWeight: '400',
                    fontFamily: 'Pretendard'
                  }}
                >
                  {t('mypage.english')}
                </div>
              </div>

              {/* 한국어 */}
              <div
                onClick={() => handleLanguageSelect('ko')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={selectedLanguage === 'ko' ? '/assets/icons/radio-checked.svg' : '/assets/icons/radio-unchecked.svg'}
                  alt="radio"
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    flexShrink: 0
                  }}
                />
                <div
                  style={{
                    color: '#1F1F1F',
                    fontSize: '1rem',
                    fontWeight: '400',
                    fontFamily: 'Pretendard'
                  }}
                >
                  {t('mypage.korean')}
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* 하단 고정 저장 버튼 */}
      <div
        onClick={handleSave}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '4.375rem',
          background: '#00A0D2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '500',
            fontFamily: 'Pretendard'
          }}
        >
          {t('common.save')}
        </div>
      </div>
    </MainLayout>
  );
}

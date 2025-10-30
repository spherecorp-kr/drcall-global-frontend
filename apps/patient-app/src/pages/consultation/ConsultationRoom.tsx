import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '@ui/modals/ConfirmModal';
import LanguageSelectionModal from '@components/consultation/modals/LanguageSelectionModal';
import { usePIPDrag } from '@/hooks/usePIPDrag';

/**
 * 진료실 화면 (비디오 콜)
 * - 환자의 비디오 피드 (큰 화면)
 * - 의사의 비디오 피드 (작은 화면, PIP)
 * - 하단 컨트롤 버튼: 카메라, 마이크, 번역, 종료
 * - 실시간 번역된 텍스트 표시 (선택적)
 */
export default function ConsultationRoom() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isTranslationOn, setIsTranslationOn] = useState(true);

  // PIP drag logic extracted to custom hook
  const pip = usePIPDrag({
    initialSize: { width: 103, height: 170 },
    minWidth: 103,
    maxWidth: 150,
    responsiveWidthPercentage: 0.25,
    edgeMargin: 20,
  });

  // 모달 상태
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isEndCallModalOpen, setIsEndCallModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');

  // TODO: 실제 WebRTC 연결 구현
  const translatedText =
    '안녕하세요 배가 아프고 머리가 어지러워요 열이 조금 있고 어제 저녁부터 몸이 많이 안좋았어요\n안녕하세요 배가 아프고 머리가 어지러워요 열이 조금';

  const handleClose = () => navigate('/appointments');

  const handleEndCall = () => {
    setIsEndCallModalOpen(true);
  };

  const handleEndCallConfirm = () => {
    setIsEndCallModalOpen(false);
    navigate('/appointments');
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    // TODO: 실제 번역 언어 변경 로직
  };

  const getLanguageDisplayName = () => {
    const languageNames: Record<string, string> = {
      en: 'English',
      ko: '한국어',
      th: 'ภาษาไทย'
    };
    return languageNames[selectedLanguage] || '한국어';
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    // TODO: 실제 카메라 on/off 로직
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // TODO: 실제 마이크 on/off 로직
  };

  const toggleTranslation = () => {
    setIsTranslationOn(!isTranslationOn);
    // TODO: 실제 번역 on/off 로직
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        position: 'relative',
        background: '#000',
        overflow: 'hidden'
      }}
      onMouseMove={pip.handleMouseMove}
      onMouseUp={pip.handleMouseUp}
      onMouseLeave={pip.handleMouseUp}
      onTouchMove={pip.handleTouchMove}
      onTouchEnd={pip.handleTouchEnd}
    >
      {/* 비디오 컨테이너 */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        {/* 의사 비디오 (큰 화면) */}
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            background: '#D9D9D9',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}
        >
          {/* TODO: 실제 비디오 엘리먼트로 교체 */}
          <img
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            src="/assets/images/doctor.png"
            alt="Doctor"
          />
        </div>

      {/* 환자 비디오 (PIP - Picture in Picture) */}
      <div
        style={{
          width: pip.pipSize.width,
          height: pip.pipSize.height,
          left: pip.pipPosition.x,
          top: pip.pipPosition.y,
          position: 'absolute',
          background: '#D9D9D9',
          borderRadius: 10,
          overflow: 'hidden',
          cursor: pip.isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
          transition: pip.isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 20
        }}
        onMouseDown={pip.handleMouseDown}
        onTouchStart={pip.handleTouchStart}
      >
        {/* TODO: 실제 비디오 엘리먼트로 교체 */}
        <img
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderRadius: 10,
            objectFit: 'cover',
            objectPosition: 'center',
            pointerEvents: 'none'
          }}
          src="/assets/images/covid-health-concept-young-asian-woman-medical-face-mask-feels-sick-unwell-catching-flu-p.jpg"
          alt={t('consultation.patientVideo')}
        />
      </div>

      {/* 번역 텍스트 영역 */}
      {isTranslationOn && (
        <div
          style={{
            width: 'calc(100% - 40px)',
            maxWidth: 374,
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: 120,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12
          }}
        >
          {/* 번역된 텍스트 */}
          <div
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(2, 2, 2, 0.72)',
              borderRadius: 10,
              backdropFilter: 'blur(7.5px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '100%',
                maxHeight: 120,
                overflow: 'auto',
                textAlign: 'center',
                color: 'white',
                fontSize: 16,
                fontFamily: 'Pretendard',
                fontWeight: '400',
                lineHeight: '1.4'
              }}
            >
              {translatedText}
            </div>
          </div>

          {/* 언어 선택 버튼 */}
          <button
            onClick={() => setIsLanguageModalOpen(true)}
            style={{
              width: 160,
              height: 32,
              padding: 0,
              background: '#1D1D1D',
              borderRadius: 99,
              border: '2px solid #00A0D2',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                textAlign: 'center',
                color: '#00A0D2',
                fontSize: 14,
                fontFamily: 'Pretendard',
                fontWeight: '600'
              }}
            >
              {getLanguageDisplayName()}
            </div>
            <img
              src="/assets/icons/chevron-down.svg"
              alt=""
              style={{ width: 24, height: 24, filter: 'brightness(0) saturate(100%) invert(54%) sepia(94%) saturate(2174%) hue-rotate(164deg) brightness(94%) contrast(101%)' }}
            />
          </button>
        </div>
      )}

      {/* 하단 컨트롤 버튼 */}
      <div
        style={{
          width: '100%',
          bottom: 20,
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 28
        }}
      >
        {/* 카메라 토글 */}
        <button
          onClick={toggleCamera}
          style={{
            width: 64,
            height: 64,
            background: 'white',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src={isCameraOn ? '/assets/icons/ic_video.svg' : '/assets/icons/ic_video-off.svg'}
            alt={t('consultation.camera')}
            style={{ width: 24, height: 24 }}
          />
        </button>

        {/* 마이크 토글 */}
        <button
          onClick={toggleMic}
          style={{
            width: 64,
            height: 64,
            background: 'white',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src={isMicOn ? '/assets/icons/ic_mic.svg' : '/assets/icons/ic_mic-off.svg'}
            alt={t('consultation.microphone')}
            style={{ width: 24, height: 24 }}
          />
        </button>

        {/* 번역 토글 */}
        <button
          onClick={toggleTranslation}
          style={{
            width: 64,
            height: 64,
            background: '#00A0D2',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src={isTranslationOn ? '/assets/icons/ic_translation.svg' : '/assets/icons/ic_translation-off.svg'}
            alt={t('consultation.translation')}
            style={{ width: 24, height: 24 }}
          />
        </button>

        {/* 통화 종료 */}
        <button
          onClick={handleEndCall}
          style={{
            width: 64,
            height: 64,
            background: '#D53636',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src="/assets/icons/ic_call_end.svg"
            alt={t('consultation.endConsultation')}
            style={{ width: 24, height: 24 }}
          />
        </button>
      </div>
      </div>

      {/* 언어 선택 모달 */}
      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onConfirm={handleLanguageChange}
        currentLanguage={selectedLanguage}
      />

      {/* 통화 종료 확인 모달 */}
      <ConfirmModal
        isOpen={isEndCallModalOpen}
        message={t('consultation.endConsultationConfirm')}
        onConfirm={handleEndCallConfirm}
        onCancel={() => setIsEndCallModalOpen(false)}
      />
    </div>
  );
}

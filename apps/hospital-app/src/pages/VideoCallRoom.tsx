import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useSubtitle } from '@/hooks/useSubtitle';

/**
 * 영상 통화 화면 (Hospital App - Desktop)
 * - 화면 반으로 나눔: 왼쪽(의사), 오른쪽(환자/코디네이터)
 * - 발화자에 따라 테두리 표시 (파란색)
 * - 참가자 여러명이면 발화자 전환, 아니면 계속 같은 사람
 * - 하단 컨트롤 버튼: 카메라, 마이크, 번역, 종료
 * - 실시간 번역 자막 표시
 */
export default function VideoCallRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isTranslationOn, setIsTranslationOn] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');

  // URL에서 appointmentId, doctorId 가져오기
  const appointmentId = Number(searchParams.get('appointmentId')) || 1;
  const doctorId = Number(searchParams.get('doctorId')) || 1;

  // Video Call Hook
  const videoCall = useVideoCall({
    appointmentId,
    doctorId,
    onError: (error) => {
      console.error('[VideoCallRoom] Video call error:', error);
      alert('영상 통화 연결에 실패했습니다: ' + error.message);
    },
  });

  // Subtitle Hook
  const subtitle = useSubtitle(appointmentId);

  // Video elements refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // 현재 표시할 자막 텍스트
  const translatedText = subtitle.currentSubtitle?.translatedText || '';

  const handleEndCall = async () => {
    if (confirm('진료를 종료하시겠습니까?')) {
      await videoCall.endCall();
      subtitle.endSession();
      navigate('/appointment');
    }
  };

  const toggleTranslation = () => {
    setIsTranslationOn(!isTranslationOn);
    subtitle.toggleTranslation();
  };

  const getLanguageDisplayName = () => {
    const languageNames: Record<string, string> = {
      en: 'English',
      ko: '한국어',
      th: 'ภาษาไทย',
    };
    return languageNames[selectedLanguage] || '한국어';
  };

  // Video call connection on mount
  useEffect(() => {
    videoCall.joinVideoCall();

    // 자막 세션 생성 (환자: 한국어 → 의사: 태국어)
    subtitle.createSession('ko', 'th');
  }, []);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && videoCall.localStream) {
      localVideoRef.current.srcObject = videoCall.localStream;
      localVideoRef.current.play().catch((err) =>
        console.error('[VideoCallRoom] Failed to play local video:', err)
      );
    }
  }, [videoCall.localStream]);

  // Attach remote stream - switch based on active speaker
  useEffect(() => {
    if (remoteVideoRef.current && videoCall.participants.length > 0) {
      // Find active speaker or first participant
      const activeParticipant =
        videoCall.participants.find(
          (p) => p.participantId === videoCall.activeSpeakerId
        ) || videoCall.participants[0];

      if (activeParticipant?.stream) {
        remoteVideoRef.current.srcObject = activeParticipant.stream;
        remoteVideoRef.current.play().catch((err) =>
          console.error('[VideoCallRoom] Failed to play remote video:', err)
        );
      }
    }
  }, [videoCall.participants, videoCall.activeSpeakerId]);

  // 현재 발화자 정보
  const activeSpeaker = videoCall.participants.find(
    (p) => p.participantId === videoCall.activeSpeakerId
  );

  // 내가 말하고 있는지 (마이크 켜져있고 오디오 레벨 체크 - 간단히 마이크 상태로만)
  const isSpeaking = videoCall.isMicOn;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        paddingTop: 90,
        paddingBottom: 40,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'inline-flex',
      }}
    >
      {/* 비디오 영역 */}
      <div
        style={{
          alignSelf: 'stretch',
          height: 800,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 40,
          display: 'flex',
        }}
      >
        <div
          style={{
            alignSelf: 'stretch',
            flex: '1 1 0',
            paddingLeft: 20,
            paddingRight: 20,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 10,
            display: 'flex',
          }}
        >
          <div
            style={{
              alignSelf: 'stretch',
              flex: '1 1 0',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              display: 'inline-flex',
            }}
          >
            {/* 의사 비디오 (왼쪽 절반) */}
            <div
              style={{
                flex: '1 1 0',
                alignSelf: 'stretch',
                paddingLeft: 355,
                paddingRight: 355,
                paddingTop: 140,
                paddingBottom: 140,
                position: 'relative',
                background: 'linear-gradient(156deg, #6787B8 0%, #8C6E69 66%, #9B8E88 100%)',
                borderRadius: 16,
                outline: isSpeaking
                  ? '6px var(--Primary-Blue-70, #00A0D2) solid'
                  : 'none',
                outlineOffset: '-6px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                display: 'flex',
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: 220,
                  height: 220,
                  background: 'var(--Text-0, white)',
                  borderRadius: 8,
                  objectFit: 'cover',
                }}
              />
              {/* 카메라 On/Off 인디케이터 */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  left: 870,
                  top: 20,
                  position: 'absolute',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    left: 0,
                    top: 0,
                    position: 'absolute',
                    background: videoCall.isCameraOn
                      ? 'var(--Primary-Blue-70, #00A0D2)'
                      : '#FF4A55',
                    borderRadius: 9999,
                  }}
                />
                <div
                  style={{
                    width: 21.67,
                    height: 18.33,
                    left: 9.16,
                    top: 10.83,
                    position: 'absolute',
                    background: 'var(--Text-0, white)',
                  }}
                />
              </div>
            </div>

            {/* 환자/코디네이터 비디오 (오른쪽 절반, 발화자 전환) */}
            <div
              style={{
                flex: '1 1 0',
                alignSelf: 'stretch',
                borderRadius: 16,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 10,
                display: 'flex',
                position: 'relative',
                outline: activeSpeaker
                  ? '6px var(--Primary-Blue-70, #00A0D2) solid'
                  : 'none',
                outlineOffset: '-6px',
              }}
            >
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  flex: '1 1 0',
                  alignSelf: 'stretch',
                  borderRadius: 16,
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>

        {/* 자막 및 언어 선택 영역 */}
        <div
          style={{
            alignSelf: 'stretch',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 28,
            display: 'flex',
          }}
        >
          {/* 언어 선택 버튼 */}
          <div
            style={{
              alignSelf: 'stretch',
              height: 40,
              paddingLeft: 20,
              paddingRight: 20,
              backdropFilter: 'blur(7.50px)',
              justifyContent: 'flex-end',
              alignItems: 'center',
              display: 'inline-flex',
            }}
          >
            {isTranslationOn && (
              <button
                onClick={() => {
                  // 언어 순환
                  const languages = ['ko', 'en', 'th'];
                  const currentIndex = languages.indexOf(selectedLanguage);
                  const nextIndex = (currentIndex + 1) % languages.length;
                  setSelectedLanguage(languages[nextIndex]);
                }}
                style={{
                  alignSelf: 'stretch',
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 20,
                  paddingBottom: 20,
                  background: 'var(--Tap-1, #3E3E3E)',
                  borderRadius: 4,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 10,
                  display: 'flex',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: 23.33,
                      height: 22.01,
                      left: 2.34,
                      top: 3.5,
                      position: 'absolute',
                      background: 'var(--Text-0, white)',
                    }}
                  />
                </div>
                <div
                  style={{
                    textAlign: 'right',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'var(--Text-0, white)',
                    fontSize: 24,
                    fontFamily: 'Pretendard',
                    fontWeight: '500',
                    lineHeight: '28.80px',
                    wordWrap: 'break-word',
                  }}
                >
                  {getLanguageDisplayName()}
                </div>
              </button>
            )}
          </div>

          {/* 자막 표시 영역 */}
          {isTranslationOn && (
            <div
              style={{
                alignSelf: 'stretch',
                height: 92,
                paddingLeft: 240,
                paddingRight: 240,
                background: 'rgba(2, 2, 2, 0.72)',
                backdropFilter: 'blur(7.50px)',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'Pretendard',
                  fontWeight: '400',
                  lineHeight: '1.4',
                }}
              >
                {translatedText}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 컨트롤 버튼 */}
      <div
        style={{
          alignSelf: 'stretch',
          height: 74,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 36,
          display: 'inline-flex',
        }}
      >
        {/* 카메라 토글 */}
        <button
          onClick={videoCall.toggleCamera}
          style={{
            width: 74,
            height: 74,
            background: 'var(--Text-0, white)',
            borderRadius: 9999,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 27.75,
              height: 27.75,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 6.94,
                height: 16.19,
                left: 10.41,
                top: 1.16,
                position: 'absolute',
                outline: '2px var(--Text-70, #6E6E6E) solid',
                outlineOffset: '-1px',
              }}
            />
            <div
              style={{
                width: 16.19,
                height: 10.41,
                left: 5.78,
                top: 11.56,
                position: 'absolute',
                outline: '2px var(--Text-70, #6E6E6E) solid',
                outlineOffset: '-1px',
              }}
            />
          </div>
        </button>

        {/* 마이크 토글 */}
        <button
          onClick={videoCall.toggleMic}
          style={{
            width: 74,
            height: 74,
            background: 'var(--Text-0, white)',
            borderRadius: 9999,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 27.75,
              height: 27.75,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 8.09,
                height: 11.56,
                left: 18.5,
                top: 8.09,
                position: 'absolute',
                outline: '2px var(--Text-70, #6E6E6E) solid',
                outlineOffset: '-1px',
              }}
            />
            <div
              style={{
                width: 17.34,
                height: 16.19,
                left: 1.16,
                top: 5.78,
                position: 'absolute',
                outline: '2px var(--Text-70, #6E6E6E) solid',
                outlineOffset: '-1px',
              }}
            />
          </div>
        </button>

        {/* 번역 토글 */}
        <button
          onClick={toggleTranslation}
          style={{
            width: 74,
            height: 74,
            background: 'var(--Primary-Blue-70, #00A0D2)',
            borderRadius: 9999,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 27.75,
              height: 27.75,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 20,
                height: 22,
                left: 4,
                top: 3,
                position: 'absolute',
                outline: '2px var(--Text-0, white) solid',
                outlineOffset: '-1px',
              }}
            />
            <div
              style={{
                width: 14,
                height: 9.09,
                left: 7,
                top: 6.93,
                position: 'absolute',
                background: 'var(--Text-0, white)',
              }}
            />
          </div>
        </button>

        {/* 통화 종료 */}
        <button
          onClick={handleEndCall}
          style={{
            width: 74,
            height: 74,
            background: 'var(--Badge-Badge1, #FF4A55)',
            borderRadius: 9999,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 27.75,
              height: 27.75,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 23,
                height: 23.04,
                left: 2.45,
                top: 2.31,
                position: 'absolute',
                outline: '2px var(--Text-0, white) solid',
                outlineOffset: '-1px',
              }}
            />
          </div>
        </button>
      </div>
    </div>
  );
}

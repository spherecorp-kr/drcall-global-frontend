/**
 * Video Call Hook - Sendbird Calls 연동
 *
 * 기능:
 * - Sendbird Room 참여
 * - 로컬/원격 미디어 스트림 관리
 * - Active Speaker Detection (발화자 감지)
 * - 카메라/마이크 제어
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { getSendBirdCall } from '@/lib/sendbird';
import { videoCallService, type VideoCallSessionResponse } from '@/services/videoCallService';

interface Participant {
  participantId: string;
  userId: string;
  userType: 'DOCTOR' | 'PATIENT' | 'COORDINATOR';
  stream: MediaStream | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  audioLevel: number; // 0-100
}

interface UseVideoCallProps {
  appointmentId: number;
  patientId: number;
  onError?: (error: Error) => void;
}

export function useVideoCall({ appointmentId, patientId, onError }: UseVideoCallProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const roomRef = useRef<any>(null);
  const sessionRef = useRef<VideoCallSessionResponse | null>(null);

  /**
   * 세션 참여 및 Sendbird Room 연결
   */
  const joinVideoCall = useCallback(async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    const SendBirdCall = getSendBirdCall();

    try {
      // 1. 기존 세션 조회 또는 생성
      let session: VideoCallSessionResponse;
      try {
        session = await videoCallService.getSessionByAppointment(appointmentId);
      } catch {
        // 세션이 없으면 생성
        session = await videoCallService.createSession({
          appointmentId,
          patientId,
          doctorId: 0, // TODO: 실제 doctorId 전달
          isVideoEnabled: true,
          autoCreateRoom: true,
        });
      }

      sessionRef.current = session;

      // 2. 세션 참여 (Access Token 발급)
      const joinResponse = await videoCallService.joinSession(session.id, {
        userId: patientId,
        userType: 'PATIENT',
        isAudioEnabled: true,
        isVideoEnabled: true,
      });

      const { sendbirdUserId, sendbirdAccessToken, sendbirdRoomId } = joinResponse;

      if (!sendbirdAccessToken || !sendbirdRoomId) {
        throw new Error('Sendbird credentials not received');
      }

      // 3. Sendbird 인증
      await SendBirdCall.authenticate({
        userId: sendbirdUserId!,
        accessToken: sendbirdAccessToken!,
      });

      // 4. WebSocket 연결
      await SendBirdCall.connectWebSocket();

      // 5. 로컬 미디어 스트림 획득
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720, facingMode: 'user' },
      });
      setLocalStream(stream);

      // 6. Room 참여
      const room = await SendBirdCall.fetchRoomById(sendbirdRoomId!);

      // 로컬 미디어 설정
      await room.enter({
        audioEnabled: true,
        videoEnabled: true,
      });

      roomRef.current = room;

      // 7. Room 이벤트 리스너 등록
      setupRoomEventListeners(room);

      setIsConnected(true);
      setIsConnecting(false);

      console.log('[VideoCall] Successfully joined room:', sendbirdRoomId);
    } catch (error) {
      console.error('[VideoCall] Failed to join:', error);
      setIsConnecting(false);
      onError?.(error as Error);
    }
  }, [appointmentId, patientId, isConnecting, isConnected, onError]);

  /**
   * Room 이벤트 리스너 설정
   */
  const setupRoomEventListeners = (room: any) => {
    // 원격 참가자 스트림 시작
    room.on('remoteParticipantStreamStarted', (participant: any) => {
      console.log('[VideoCall] Remote participant joined:', participant.participantId);

      const newParticipant: Participant = {
        participantId: participant.participantId,
        userId: participant.user.userId,
        userType: participant.user.userId.split('_')[0] as any, // DOCTOR_123 → DOCTOR
        stream: participant.videoView?.srcObject || null,
        isAudioEnabled: participant.isAudioEnabled,
        isVideoEnabled: participant.isVideoEnabled,
        audioLevel: 0,
      };

      setParticipants((prev) => [...prev, newParticipant]);

      // 오디오 레벨 모니터링 (Active Speaker Detection)
      participant.on('audioLevelChanged', (level: number) => {
        setParticipants((prev) =>
          prev.map((p) =>
            p.participantId === participant.participantId
              ? { ...p, audioLevel: level }
              : p
          )
        );

        // 일정 threshold 이상이면 Active Speaker로 설정
        if (level > 30) {
          setActiveSpeakerId(participant.participantId);
        }
      });
    });

    // 원격 참가자 퇴장
    room.on('remoteParticipantExited', (participant: any) => {
      console.log('[VideoCall] Remote participant left:', participant.participantId);
      setParticipants((prev) =>
        prev.filter((p) => p.participantId !== participant.participantId)
      );

      if (activeSpeakerId === participant.participantId) {
        setActiveSpeakerId(null);
      }
    });

    // Room 에러
    room.on('error', (error: any) => {
      console.error('[VideoCall] Room error:', error);
      onError?.(error);
    });
  };

  /**
   * 카메라 토글
   */
  const toggleCamera = useCallback(() => {
    if (!roomRef.current) return;

    const newState = !isCameraOn;
    if (newState) {
      roomRef.current.startVideo();
    } else {
      roomRef.current.stopVideo();
    }
    setIsCameraOn(newState);
  }, [isCameraOn]);

  /**
   * 마이크 토글
   */
  const toggleMic = useCallback(() => {
    if (!roomRef.current) return;

    const newState = !isMicOn;
    if (newState) {
      roomRef.current.startAudio();
    } else {
      roomRef.current.stopAudio();
    }
    setIsMicOn(newState);
  }, [isMicOn]);

  /**
   * 통화 종료
   */
  const endCall = useCallback(async () => {
    try {
      if (roomRef.current) {
        await roomRef.current.exit();
        roomRef.current = null;
      }

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }

      if (sessionRef.current) {
        await videoCallService.endSession(sessionRef.current.id);
      }

      // WebSocket은 room.exit()에서 자동으로 정리됨

      setIsConnected(false);
      setParticipants([]);
      setActiveSpeakerId(null);

      console.log('[VideoCall] Call ended');
    } catch (error) {
      console.error('[VideoCall] Failed to end call:', error);
      onError?.(error as Error);
    }
  }, [localStream, onError]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (isConnected) {
        endCall();
      }
    };
  }, [isConnected, endCall]);

  return {
    // 연결 상태
    isConnecting,
    isConnected,

    // 스트림
    localStream,
    participants,
    activeSpeakerId, // 현재 말하고 있는 사람

    // 제어
    isCameraOn,
    isMicOn,
    toggleCamera,
    toggleMic,

    // 액션
    joinVideoCall,
    endCall,
  };
}

/**
 * Video Call Service API
 * Backend video-call-service (포트: 18089)와 통신
 */
import apiClient from './api';

export interface CreateSessionRequest {
  appointmentId: number;
  doctorId: number;
  patientId: number;
  coordinatorId?: number;
  isVideoEnabled?: boolean;
  autoCreateRoom?: boolean;
}

export interface JoinSessionRequest {
  userId: number;
  userType: 'DOCTOR' | 'PATIENT' | 'COORDINATOR';
  isAudioEnabled?: boolean;
  isVideoEnabled?: boolean;
}

export interface ParticipantResponse {
  id: number;
  userId: number;
  userType: 'DOCTOR' | 'PATIENT' | 'COORDINATOR';
  sendbirdUserId: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  joinedAt: string;
  leftAt?: string;
}

export interface VideoCallSessionResponse {
  id: number;
  externalId: string;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  coordinatorId?: number;
  status: 'CREATED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  sendbirdChannelUrl: string;
  sendbirdRoomId?: string;
  participants: ParticipantResponse[];
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// patient-service를 통해 video-call-service 호출
const VIDEO_CALL_BASE_URL = '/api/v1/video-calls';

/**
 * Video Call Service
 */
export const videoCallService = {
  /**
   * 세션 생성
   */
  createSession: async (
    request: CreateSessionRequest
  ): Promise<VideoCallSessionResponse> => {
    const response = await apiClient.post<VideoCallSessionResponse>(
      VIDEO_CALL_BASE_URL,
      request
    );
    return response.data;
  },

  /**
   * 세션 참여
   */
  joinSession: async (
    sessionId: number,
    request: JoinSessionRequest
  ): Promise<VideoCallSessionResponse> => {
    const response = await apiClient.post<VideoCallSessionResponse>(
      `${VIDEO_CALL_BASE_URL}/${sessionId}/join`,
      request
    );
    return response.data;
  },

  /**
   * 세션 조회
   */
  getSession: async (sessionId: number): Promise<VideoCallSessionResponse> => {
    const response = await apiClient.get<VideoCallSessionResponse>(
      `${VIDEO_CALL_BASE_URL}/${sessionId}`
    );
    return response.data;
  },

  /**
   * 예약 ID로 세션 조회
   */
  getSessionByAppointment: async (
    appointmentId: number
  ): Promise<VideoCallSessionResponse> => {
    const response = await apiClient.get<VideoCallSessionResponse>(
      `${VIDEO_CALL_BASE_URL}/appointment/${appointmentId}`
    );
    return response.data;
  },

  /**
   * 세션 종료
   */
  endSession: async (sessionId: number): Promise<VideoCallSessionResponse> => {
    const response = await apiClient.post<VideoCallSessionResponse>(
      `${VIDEO_CALL_BASE_URL}/${sessionId}/end`
    );
    return response.data;
  },

  /**
   * 세션 퇴장
   */
  leaveSession: async (
    sessionId: number,
    participantId: number
  ): Promise<VideoCallSessionResponse> => {
    const response = await apiClient.post<VideoCallSessionResponse>(
      `${VIDEO_CALL_BASE_URL}/${sessionId}/leave`,
      { participantId }
    );
    return response.data;
  },
};

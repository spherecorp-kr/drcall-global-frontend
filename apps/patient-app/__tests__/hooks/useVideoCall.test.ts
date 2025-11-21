import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVideoCall } from '@hooks/useVideoCall';
import { getSendBirdCall } from '@/lib/sendbird';
import { videoCallService } from '@/services/videoCallService';

// Mock dependencies
vi.mock('@/lib/sendbird', () => ({
  getSendBirdCall: vi.fn(),
}));

vi.mock('@/services/videoCallService', () => ({
  videoCallService: {
    getSessionByAppointment: vi.fn(),
    createSession: vi.fn(),
    joinSession: vi.fn(),
    endSession: vi.fn(),
  },
}));

describe('useVideoCall Hook', () => {
  const mockRoom = {
    enter: vi.fn(),
    exit: vi.fn(),
    startVideo: vi.fn(),
    stopVideo: vi.fn(),
    startAudio: vi.fn(),
    stopAudio: vi.fn(),
    on: vi.fn(),
  };

  const mockSendBirdCall = {
    authenticate: vi.fn(),
    connectWebSocket: vi.fn(),
    fetchRoomById: vi.fn().mockResolvedValue(mockRoom),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getSendBirdCall as any).mockReturnValue(mockSendBirdCall);
    
    // Mock navigator.mediaDevices
    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [{ stop: vi.fn() }],
        }),
      },
    });
  });

  // 초기화 테스트: 연결 전 초기 상태 확인
  it('initializes with default state', () => {
    const { result } = renderHook(() => useVideoCall({ appointmentId: 1, patientId: 100 }));
    expect(result.current.isConnecting).toBe(false);
    expect(result.current.isConnected).toBe(false);
    expect(result.current.participants).toEqual([]);
  });

  // 화상 통화 참여 테스트: 세션 조회 -> 참여 -> SendBird 연동 확인
  it('joins video call successfully', async () => {
    // Setup mocks
    (videoCallService.getSessionByAppointment as any).mockResolvedValue({ id: 'session-1' });
    (videoCallService.joinSession as any).mockResolvedValue({
      sendbirdUserId: 'user-1',
      sendbirdAccessToken: 'token-1',
      sendbirdRoomId: 'room-1'
    });

    const { result } = renderHook(() => useVideoCall({ appointmentId: 1, patientId: 100 }));

    await act(async () => {
      await result.current.joinVideoCall();
    });

    expect(videoCallService.getSessionByAppointment).toHaveBeenCalledWith(1);
    expect(videoCallService.joinSession).toHaveBeenCalled();
    expect(mockSendBirdCall.authenticate).toHaveBeenCalled();
    expect(mockSendBirdCall.connectWebSocket).toHaveBeenCalled();
    expect(mockSendBirdCall.fetchRoomById).toHaveBeenCalledWith('room-1');
    expect(mockRoom.enter).toHaveBeenCalled();
    
    expect(result.current.isConnected).toBe(true);
  });

  // 세션 생성 테스트: 세션이 없을 경우 새로 생성 후 참여하는지 확인
  it('creates session if not exists', async () => {
    (videoCallService.getSessionByAppointment as any).mockRejectedValue(new Error('Not found'));
    (videoCallService.createSession as any).mockResolvedValue({ id: 'session-new' });
    (videoCallService.joinSession as any).mockResolvedValue({
      sendbirdUserId: 'user-1',
      sendbirdAccessToken: 'token',
      sendbirdRoomId: 'room-1'
    });

    const { result } = renderHook(() => useVideoCall({ appointmentId: 1, patientId: 100 }));

    await act(async () => {
      await result.current.joinVideoCall();
    });

    expect(videoCallService.createSession).toHaveBeenCalledWith(expect.objectContaining({ appointmentId: 1 }));
  });

  // 카메라 토글 테스트: 카메라 끄기/켜기 동작 확인
  it('toggles camera', async () => {
    // Setup connected state
    (videoCallService.getSessionByAppointment as any).mockResolvedValue({ id: 'session-1' });
    (videoCallService.joinSession as any).mockResolvedValue({ sendbirdUserId: 'u', sendbirdAccessToken: 't', sendbirdRoomId: 'r' });
    
    const { result } = renderHook(() => useVideoCall({ appointmentId: 1, patientId: 100 }));
    
    await act(async () => {
        await result.current.joinVideoCall();
    });

    expect(result.current.isCameraOn).toBe(true);

    act(() => {
        result.current.toggleCamera();
    });

    expect(result.current.isCameraOn).toBe(false);
    expect(mockRoom.stopVideo).toHaveBeenCalled();
  });

  // 통화 종료 테스트: 방 나가기 및 세션 종료 확인
  it('ends call', async () => {
    // Setup connected state
    (videoCallService.getSessionByAppointment as any).mockResolvedValue({ id: 'session-1' });
    (videoCallService.joinSession as any).mockResolvedValue({ sendbirdUserId: 'u', sendbirdAccessToken: 't', sendbirdRoomId: 'r' });

    const { result } = renderHook(() => useVideoCall({ appointmentId: 1, patientId: 100 }));
    
    await act(async () => {
        await result.current.joinVideoCall();
    });

    await act(async () => {
        await result.current.endCall();
    });

    expect(mockRoom.exit).toHaveBeenCalled();
    expect(videoCallService.endSession).toHaveBeenCalledWith('session-1');
    expect(result.current.isConnected).toBe(false);
  });
});

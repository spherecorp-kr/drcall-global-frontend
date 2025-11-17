/**
 * Sendbird Calls SDK 초기화 및 유틸리티
 * Group Call 지원 (환자 + 의사 + 코디네이터)
 */
import SendBirdCall from 'sendbird-calls';

const APP_ID = import.meta.env.VITE_SENDBIRD_APP_ID || '';

/**
 * Sendbird Calls 초기화
 */
export function initializeSendBirdCalls(): void {
  if (!APP_ID) {
    console.error('VITE_SENDBIRD_APP_ID is not defined');
    return;
  }

  try {
    SendBirdCall.init(APP_ID);
    console.log('[Sendbird] Initialized with APP_ID:', APP_ID);
  } catch (error) {
    console.error('[Sendbird] Initialization failed:', error);
    throw error;
  }
}

/**
 * Sendbird 사용자 인증
 */
export async function authenticateSendBirdUser(
  userId: string,
  accessToken?: string
): Promise<void> {
  try {
    const authOption = accessToken
      ? { userId, accessToken }
      : { userId };

    await SendBirdCall.authenticate(authOption);
    console.log('[Sendbird] User authenticated:', userId);
  } catch (error) {
    console.error('[Sendbird] Authentication failed:', error);
    throw error;
  }
}

/**
 * Sendbird 연결
 */
export async function connectWebSocket(): Promise<void> {
  try {
    await SendBirdCall.connectWebSocket();
    console.log('[Sendbird] WebSocket connected');
  } catch (error) {
    console.error('[Sendbird] WebSocket connection failed:', error);
    throw error;
  }
}

/**
 * Sendbird 연결 해제
 */
export function disconnectWebSocket(): void {
  try {
    SendBirdCall.deauthenticate();
    console.log('[Sendbird] Deauthenticated');
  } catch (error) {
    console.error('[Sendbird] Deauthentication failed:', error);
  }
}

/**
 * SendBirdCall 인스턴스 반환
 */
export function getSendBirdCall() {
  return SendBirdCall;
}

/**
 * 미디어 장치 권한 요청
 */
export async function requestMediaPermissions(
  audio = true,
  video = true
): Promise<MediaStream | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio,
      video: video ? { width: 1280, height: 720, facingMode: 'user' } : false,
    });
    console.log('[Media] Permissions granted');
    return stream;
  } catch (error) {
    console.error('[Media] Permission denied:', error);
    return null;
  }
}

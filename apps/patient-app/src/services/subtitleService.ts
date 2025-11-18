import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * �� 8X �1 ��
 */
export interface CreateSubtitleSessionRequest {
  videoCallSessionId: number;
  sourceLanguage: string; // ko, en, th
  targetLanguage: string; // ko, en, th
}

/**
 * �� 8X Q�
 */
export interface SubtitleSession {
  id: number;
  sessionId: string;
  videoCallSessionId: number;
  sourceLanguage: string;
  targetLanguage: string;
  status: 'ACTIVE' | 'PAUSED' | 'ENDED';
  sttProvider: string;
  translationProvider: string;
  createdAt: string;
}

/**
 * �� T�
 */
export interface SubtitleRecord {
  id: number;
  sessionId: number;
  speakerId: number;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number | null;
  provider: string;
  sequenceNumber: number;
  createdAt: string;
}

/**
 * $$ �l T��
 */
export interface AudioChunkMessage {
  speakerId: number;
  audioData: string; // Base64 encoded audio
}

/**
 * Subtitle WebSocket Service
 *
 * translation-service@ WebSocket �X� �� ��D ��i��.
 */
class SubtitleWebSocketService {
  private client: Client | null = null;
  private sessionId: string | null = null;
  private onSubtitleCallback: ((subtitle: SubtitleRecord) => void) | null = null;

  /**
   * WebSocket �  l�
   */
  connect(
    sessionId: string,
    onSubtitle: (subtitle: SubtitleRecord) => void,
    onError?: (error: any) => void
  ): void {
    this.sessionId = sessionId;
    this.onSubtitleCallback = onSubtitle;

    // STOMP Client �1
    this.client = new Client({
      webSocketFactory: () => {
        // translation-service WebSocket ���x�
        const translationServiceUrl = import.meta.env.VITE_TRANSLATION_SERVICE_URL || 'http://localhost:18088';
        return new SockJS(`${translationServiceUrl}/ws/subtitle`) as any;
      },
      debug: (str: string) => {
        console.log('[Subtitle WebSocket]', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // � 1� �
    this.client.onConnect = () => {
      console.log('[Subtitle WebSocket] Connected');

      // �� �= l�
      this.client?.subscribe(`/topic/subtitle/${sessionId}`, (message: IMessage) => {
        const subtitle: SubtitleRecord = JSON.parse(message.body);
        console.log('[Subtitle WebSocket] Received subtitle:', subtitle);

        if (this.onSubtitleCallback) {
          this.onSubtitleCallback(subtitle);
        }
      });
    };

    // �� � �
    this.client.onStompError = (frame) => {
      console.error('[Subtitle WebSocket] STOMP error:', frame);
      if (onError) {
        onError(frame);
      }
    };

    // WebSocket ��
    this.client.onWebSocketError = (event) => {
      console.error('[Subtitle WebSocket] WebSocket error:', event);
      if (onError) {
        onError(event);
      }
    };

    // � \1T
    this.client.activate();
  }

  /**
   * $$ �l �
   */
  sendAudio(speakerId: number, audioData: string): void {
    if (!this.client || !this.sessionId) {
      console.error('[Subtitle WebSocket] Not connected');
      return;
    }

    const message: AudioChunkMessage = {
      speakerId,
      audioData,
    };

    this.client.publish({
      destination: `/app/subtitle/${this.sessionId}/audio`,
      body: JSON.stringify(message),
    });

    console.log('[Subtitle WebSocket] Sent audio chunk');
  }

  /**
   * 8X |��
   */
  pause(): void {
    if (!this.client || !this.sessionId) {
      console.error('[Subtitle WebSocket] Not connected');
      return;
    }

    this.client.publish({
      destination: `/app/subtitle/${this.sessionId}/pause`,
      body: JSON.stringify({}),
    });

    console.log('[Subtitle WebSocket] Session paused');
  }

  /**
   * 8X �
   */
  resume(): void {
    if (!this.client || !this.sessionId) {
      console.error('[Subtitle WebSocket] Not connected');
      return;
    }

    this.client.publish({
      destination: `/app/subtitle/${this.sessionId}/resume`,
      body: JSON.stringify({}),
    });

    console.log('[Subtitle WebSocket] Session resumed');
  }

  /**
   * 8X ��
   */
  end(): void {
    if (!this.client || !this.sessionId) {
      console.error('[Subtitle WebSocket] Not connected');
      return;
    }

    this.client.publish({
      destination: `/app/subtitle/${this.sessionId}/end`,
      body: JSON.stringify({}),
    });

    console.log('[Subtitle WebSocket] Session ended');
  }

  /**
   * WebSocket � ��
   */
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.sessionId = null;
      this.onSubtitleCallback = null;
      console.log('[Subtitle WebSocket] Disconnected');
    }
  }

  /**
   * � �� Ux
   */
  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

// Singleton instance
export const subtitleWebSocketService = new SubtitleWebSocketService();

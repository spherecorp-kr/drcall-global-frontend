import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * É 8X Ý1 ”­
 */
export interface CreateSubtitleSessionRequest {
  videoCallSessionId: number;
  sourceLanguage: string; // ko, en, th
  targetLanguage: string; // ko, en, th
}

/**
 * É 8X Qõ
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
 * É TÜ
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
 * $$ ­l TÜÀ
 */
export interface AudioChunkMessage {
  speakerId: number;
  audioData: string; // Base64 encoded audio
}

/**
 * Subtitle WebSocket Service
 *
 * translation-service@ WebSocket ð°Xì äÜ ÉD ¡àiÈä.
 */
class SubtitleWebSocketService {
  private client: Client | null = null;
  private sessionId: string | null = null;
  private onSubtitleCallback: ((subtitle: SubtitleRecord) => void) | null = null;

  /**
   * WebSocket ð°  lÅ
   */
  connect(
    sessionId: string,
    onSubtitle: (subtitle: SubtitleRecord) => void,
    onError?: (error: any) => void
  ): void {
    this.sessionId = sessionId;
    this.onSubtitleCallback = onSubtitle;

    // STOMP Client Ý1
    this.client = new Client({
      webSocketFactory: () => {
        // translation-service WebSocket ÔÜìx¸
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

    // ð° 1õ Ü
    this.client.onConnect = () => {
      console.log('[Subtitle WebSocket] Connected');

      // É  = lÅ
      this.client?.subscribe(`/topic/subtitle/${sessionId}`, (message: IMessage) => {
        const subtitle: SubtitleRecord = JSON.parse(message.body);
        console.log('[Subtitle WebSocket] Received subtitle:', subtitle);

        if (this.onSubtitleCallback) {
          this.onSubtitleCallback(subtitle);
        }
      });
    };

    // Ðì Ý Ü
    this.client.onStompError = (frame) => {
      console.error('[Subtitle WebSocket] STOMP error:', frame);
      if (onError) {
        onError(frame);
      }
    };

    // WebSocket Ðì
    this.client.onWebSocketError = (event) => {
      console.error('[Subtitle WebSocket] WebSocket error:', event);
      if (onError) {
        onError(event);
      }
    };

    // ð° \1T
    this.client.activate();
  }

  /**
   * $$ ­l ¡
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
   * 8X |ÜÀ
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
   * 8X ¬
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
   * 8X …Ì
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
   * WebSocket ð° …Ì
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
   * ð° ÁÜ Ux
   */
  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

// Singleton instance
export const subtitleWebSocketService = new SubtitleWebSocketService();

/**
 * Chat Event Types for SSE (Server-Sent Events)
 *
 * 백엔드에서 전달되는 실시간 채팅 이벤트
 */

export enum ChatEventType {
  MESSAGE = 'message',           // 새 메시지
  READ = 'read',                 // 읽음 상태 변경
  TYPING = 'typing',             // 타이핑 중
  CHANNEL_UPDATED = 'channel_updated',  // 채널 정보 변경
  CHANNEL_CLOSED = 'channel_closed',    // 채널 종료
  CHANNEL_REOPENED = 'channel_reopened' // 채널 재개
}

export interface ChatEvent {
  channelUrl: string;
  type: ChatEventType;
  data: Record<string, any>;
  timestamp: number;
  userId?: string;
}

export interface ChatEventMessage extends ChatEvent {
  type: ChatEventType.MESSAGE;
  data: {
    message_id: number;
    message: string;
    message_type: string;
    custom_type?: string;
    created_at: number;
    user?: {
      user_id: string;
      nickname: string;
      profile_url?: string;
    };
  };
}

export interface ChatEventRead extends ChatEvent {
  type: ChatEventType.READ;
  data: {
    user_id: string;
    timestamp: number;
    read_receipt?: Record<string, number>;
  };
}

export interface ChatEventTyping extends ChatEvent {
  type: ChatEventType.TYPING;
  data: {
    user_id: string;
    is_typing: boolean;
  };
}

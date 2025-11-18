import { create } from 'zustand';
import type { ChatChannel } from '@/services/chatService';

/**
 * Chat Store
 *
 * 전역 채팅 상태 관리
 * - 플로팅 버튼 열림/닫힘 상태
 * - 현재 열려있는 채널
 * - 읽지 않은 메시지 수
 */
interface ChatState {
	// UI State
	isChatOpen: boolean;
	currentChannel: ChatChannel | null;
	unreadCount: number;

	// Actions
	openChat: (channel?: ChatChannel) => void;
	closeChat: () => void;
	toggleChat: () => void;
	setCurrentChannel: (channel: ChatChannel | null) => void;
	setUnreadCount: (count: number) => void;
	incrementUnreadCount: () => void;
	decrementUnreadCount: () => void;
	resetUnreadCount: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
	// Initial State
	isChatOpen: false,
	currentChannel: null,
	unreadCount: 0,

	// Actions
	openChat: (channel) =>
		set({
			isChatOpen: true,
			currentChannel: channel || null,
		}),

	closeChat: () =>
		set({
			isChatOpen: false,
			currentChannel: null,
		}),

	toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

	setCurrentChannel: (channel) => set({ currentChannel: channel }),

	setUnreadCount: (count) => set({ unreadCount: count }),

	incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),

	decrementUnreadCount: () =>
		set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),

	resetUnreadCount: () => set({ unreadCount: 0 }),
}));

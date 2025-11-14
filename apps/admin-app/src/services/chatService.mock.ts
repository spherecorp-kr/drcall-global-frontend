import type {
	ChatChannel,
	ChatMessage,
	ChatMember,
	CreateChannelRequest,
	SendMessageRequest,
	ChannelsResponse,
	MessagesResponse,
	UnreadCountResponse,
} from './chatService';

/**
 * Mock Chat Service
 * Used for development when real API is not available
 */

// Mock data
const mockMembers: ChatMember[] = [
	{
		user_id: 'patient-1',
		nickname: '홍길동',
		profile_url: '/assets/icons/chat-profile-default.svg',
	},
	{
		user_id: 'coordinator-1',
		nickname: '김코디',
		profile_url: '/assets/icons/chat-profile-default.svg',
	},
	{
		user_id: 'doctor-1',
		nickname: '이의사',
		profile_url: '/assets/icons/chat-profile-default.svg',
	},
];

const mockMessages: Record<string, ChatMessage[]> = {
	'channel-1': [
		{
			message_id: 1,
			message_type: 'ADMM',
			message: '채팅방이 생성되었습니다',
			custom_type: 'system_created',
			created_at: Date.now() - 3600000, // 1 hour ago
		},
		{
			message_id: 2,
			message_type: 'MESG',
			message: '안녕하세요, 예약 확인 부탁드립니다.',
			created_at: Date.now() - 3600000 + 60000, // 1 hour ago + 1 min
			user: mockMembers[1], // coordinator
			read_by: ['patient-1'], // 환자가 읽음
		},
		{
			message_id: 3,
			message_type: 'MESG',
			message: '네, 확인했습니다. 감사합니다.',
			created_at: Date.now() - 3600000 + 120000, // 1 hour ago + 2 min
			user: mockMembers[0], // patient
			read_by: ['coordinator-1'], // 코디네이터가 읽음
		},
	],
	'channel-2': [
		{
			message_id: 4,
			message_type: 'ADMM',
			message: '채팅방이 생성되었습니다',
			custom_type: 'system_created',
			created_at: Date.now() - 86400000 * 2, // 2 days ago
		},
		{
			message_id: 5,
			message_type: 'MESG',
			message: '안녕하세요. 진료 일정 안내드립니다.',
			created_at: Date.now() - 86400000 * 2 + 60000,
			user: mockMembers[2], // doctor
			read_by: ['patient-1'], // 환자가 읽음
		},
		{
			message_id: 6,
			message_type: 'MESG',
			message: '감사합니다. 확인했습니다.',
			created_at: Date.now() - 86400000 * 2 + 120000,
			user: mockMembers[0], // patient
			read_by: ['doctor-1'], // 의사가 읽음
		},
	],
	'channel-3': [
		{
			message_id: 7,
			message_type: 'ADMM',
			message: '채팅방이 생성되었습니다',
			custom_type: 'system_created',
			created_at: Date.now() - 86400000 * 5, // 5 days ago
		},
		{
			message_id: 8,
			message_type: 'MESG',
			message: '처방전 관련해서 안내드립니다.',
			created_at: Date.now() - 86400000 * 5 + 60000,
			user: mockMembers[1], // coordinator가 먼저 말을 걸어야 함
			read_by: ['patient-1'], // 환자가 읽음
		},
		{
			message_id: 9,
			message_type: 'MESG',
			message: '네, 처방전 발급 부탁드립니다.',
			created_at: Date.now() - 86400000 * 5 + 120000,
			user: mockMembers[0], // patient 응답
			read_by: ['coordinator-1'], // 코디네이터가 읽음
		},
		{
			message_id: 10,
			message_type: 'MESG',
			message: '처방전 발급 완료되었습니다.',
			created_at: Date.now() - 86400000 * 5 + 180000,
			user: mockMembers[1], // coordinator
			read_by: ['patient-1'], // 환자가 읽음
		},
		{
			message_id: 11,
			message_type: 'ADMM',
			message: '대화가 종료되었습니다',
			custom_type: 'system_closed',
			created_at: Date.now() - 86400000 * 5 + 240000,
		},
	],
};

const mockChannels: ChatChannel[] = [
	{
		channel_url: 'channel-1',
		name: '코디네이터 상담',
		custom_type: 'STAFF_INITIATED',
		member_count: 2,
		members: [mockMembers[0], mockMembers[1]], // patient, coordinator
		created_at: Date.now() - 3600000, // 1 hour ago
		metadata: {
			status: 'active',
			appointment_id: '123',
			hospital_id: '1',
			initiator_type: 'coordinator',
		},
		unread_message_count: 0,
		last_message: mockMessages['channel-1'][2], // 환자의 마지막 메시지
	},
	{
		channel_url: 'channel-2',
		name: '의사 상담',
		custom_type: 'STAFF_INITIATED',
		member_count: 2,
		members: [mockMembers[0], mockMembers[2]], // patient, doctor
		created_at: Date.now() - 86400000 * 2, // 2 days ago
		metadata: {
			status: 'active',
			appointment_id: '124',
			hospital_id: '1',
			initiator_type: 'doctor',
		},
		unread_message_count: 0,
		last_message: mockMessages['channel-2'][2], // 환자의 마지막 메시지
	},
	{
		channel_url: 'channel-3',
		name: '종료된 상담',
		custom_type: 'STAFF_INITIATED',
		member_count: 2,
		members: [mockMembers[0], mockMembers[1]], // patient, coordinator
		created_at: Date.now() - 86400000 * 5, // 5 days ago
		metadata: {
			status: 'closed',
			closed_at: new Date(Date.now() - 86400000 * 5 + 240000).toISOString(),
			closed_by: 'coordinator-1',
			appointment_id: '122',
			hospital_id: '1',
			initiator_type: 'coordinator',
		},
		unread_message_count: 0,
		last_message: mockMessages['channel-3'][4], // 시스템 종료 메시지
	},
];

let messageIdCounter = 100;

export const mockChatService = {
	/**
	 * Create 1:1 Direct Channel
	 */
	createChannel: async (request: CreateChannelRequest, userId: string): Promise<ChatChannel> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Only staff can create channels
		if (userId.startsWith('patient-')) {
			throw new Error('환자는 채팅방을 생성할 수 없습니다');
		}

		const newChannel: ChatChannel = {
			channel_url: `channel-${Date.now()}`,
			custom_type: request.customType,
			member_count: request.userIds.length,
			members: request.userIds.map(
				(id) =>
					mockMembers.find((m) => m.user_id === id) || {
						user_id: id,
						nickname: id,
					},
			),
			created_at: Date.now(),
			metadata: {
				status: 'active',
				appointment_id: request.appointmentId?.toString(),
				hospital_id: request.hospitalId?.toString(),
				initiator_type: userId.split('-')[0],
			},
			unread_message_count: 0,
		};

		mockChannels.push(newChannel);
		return newChannel;
	},

	/**
	 * Get Channel
	 */
	getChannel: async (channelUrl: string): Promise<ChatChannel> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const channel = mockChannels.find((c) => c.channel_url === channelUrl);
		if (!channel) {
			throw new Error('채널을 찾을 수 없습니다');
		}

		return channel;
	},

	/**
	 * List User's Channels
	 */
	listUserChannels: async (userId: string, limit: number = 20): Promise<ChannelsResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Filter channels where user is a member
		const userChannels = mockChannels.filter((channel) =>
			channel.members.some((member) => member.user_id === userId),
		);

		return {
			channels: userChannels.slice(0, limit),
			next: userChannels.length > limit ? 'next-token' : undefined,
		};
	},

	/**
	 * Send Message
	 */
	sendMessage: async (channelUrl: string, request: SendMessageRequest): Promise<ChatMessage> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const channel = mockChannels.find((c) => c.channel_url === channelUrl);
		if (!channel) {
			throw new Error('채널을 찾을 수 없습니다');
		}

		// Check if channel is closed and user is patient
		if (channel.metadata?.status === 'closed' && request.user_id.startsWith('patient-')) {
			throw new Error('종료된 대화에는 메시지를 전송할 수 없습니다');
		}

		// If channel is closed and user is staff, reopen it
		if (channel.metadata?.status === 'closed' && !request.user_id.startsWith('patient-')) {
			channel.metadata.status = 'active';
			channel.metadata.reopened_at = new Date().toISOString();
			channel.metadata.reopened_by = request.user_id;

			// Add reopen system message
			const reopenMessage: ChatMessage = {
				message_id: messageIdCounter++,
				message_type: 'ADMM',
				message: '채팅방이 재개되었습니다',
				custom_type: 'system_reopened',
				created_at: Date.now(),
			};

			if (!mockMessages[channelUrl]) {
				mockMessages[channelUrl] = [];
			}
			mockMessages[channelUrl].push(reopenMessage);
		}

		const sender = mockMembers.find((m) => m.user_id === request.user_id);
		const newMessage: ChatMessage = {
			message_id: messageIdCounter++,
			message_type: 'MESG',
			message: request.message,
			custom_type: request.custom_type,
			created_at: Date.now(),
			user: sender,
		};

		if (!mockMessages[channelUrl]) {
			mockMessages[channelUrl] = [];
		}
		mockMessages[channelUrl].push(newMessage);
		channel.last_message = newMessage;

		return newMessage;
	},

	/**
	 * Get Messages
	 */
	getMessages: async (
		channelUrl: string,
		limit: number = 50,
		messageTs?: number,
		reverse: boolean = false,
	): Promise<MessagesResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		let messages = mockMessages[channelUrl] || [];

		// Filter by timestamp if provided
		if (messageTs) {
			messages = messages.filter((m) =>
				reverse ? m.created_at > messageTs : m.created_at < messageTs,
			);
		}

		// Sort messages
		messages = [...messages].sort((a, b) =>
			reverse ? a.created_at - b.created_at : b.created_at - a.created_at,
		);

		const paginatedMessages = messages.slice(0, limit);

		return {
			messages: paginatedMessages,
			has_more: messages.length > limit,
		};
	},

	/**
	 * Mark Channel as Read
	 */
	markAsRead: async (channelUrl: string): Promise<void> => {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const channel = mockChannels.find((c) => c.channel_url === channelUrl);
		if (channel) {
			channel.unread_message_count = 0;
		}
	},

	/**
	 * Close Channel
	 */
	closeChannel: async (channelUrl: string, userId: string): Promise<void> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const channel = mockChannels.find((c) => c.channel_url === channelUrl);
		if (!channel) {
			throw new Error('채널을 찾을 수 없습니다');
		}

		if (!channel.metadata) {
			channel.metadata = { status: 'closed' };
		} else {
			channel.metadata.status = 'closed';
		}
		channel.metadata.closed_at = new Date().toISOString();
		channel.metadata.closed_by = userId;

		// Add close system message
		const closeMessage: ChatMessage = {
			message_id: messageIdCounter++,
			message_type: 'ADMM',
			message: '대화가 종료되었습니다',
			custom_type: 'system_closed',
			created_at: Date.now(),
		};

		if (!mockMessages[channelUrl]) {
			mockMessages[channelUrl] = [];
		}
		mockMessages[channelUrl].push(closeMessage);
		channel.last_message = closeMessage;
	},

	/**
	 * Get Unread Message Count
	 */
	getUnreadCount: async (userId: string): Promise<UnreadCountResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const userChannels = mockChannels.filter((channel) =>
			channel.members.some((member) => member.user_id === userId),
		);

		const unreadCount = userChannels.reduce(
			(sum, channel) => sum + (channel.unread_message_count || 0),
			0,
		);

		return { unread_count: unreadCount };
	},
};

// Export helper functions from chatService
export {
	isSystemMessage,
	isChannelClosed,
	formatMessageTime,
	formatMessageDate,
	isSameDay,
} from './chatService';

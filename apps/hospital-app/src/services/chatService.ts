import { apiClient } from './api';

/**
 * Chat Service
 *
 * SendBird 기반 1:1 Direct Message 채팅 API
 */

export enum ChannelCustomType {
	STAFF_INITIATED = 'STAFF_INITIATED',
	INTERNAL = 'INTERNAL',
}

export enum ChannelStatus {
	ACTIVE = 'active',
	CLOSED = 'closed',
}

export interface ChatMember {
	user_id: string;
	nickname: string;
	profile_url?: string;
}

export interface ChannelMetadata {
	status: string;
	closed_at?: string;
	closed_by?: string;
	reopened_at?: string;
	reopened_by?: string;
	appointment_id?: string;
	hospital_id?: string;
	initiator_type?: string;
}

export interface ChatChannel {
	channel_url: string;
	name?: string;
	custom_type?: string;
	cover_url?: string;
	member_count: number;
	members: ChatMember[];
	created_at: number;
	metadata?: ChannelMetadata;
	unread_message_count?: number;
	last_message?: ChatMessage;
}

export interface ChatMessage {
	message_id: number;
	message_type: 'MESG' | 'ADMM'; // MESG: user message, ADMM: admin/system message
	message: string;
	custom_type?: string;
	created_at: number;
	user?: ChatMember;
	read_by?: string[]; // 읽은 사람 user_id 목록
}

export interface CreateChannelRequest {
	userIds: string[];
	customType: ChannelCustomType;
	appointmentId?: number;
	hospitalId?: number;
}

export interface SendMessageRequest {
	user_id: string;
	message: string;
	custom_type?: string;
}

export interface ChannelsResponse {
	channels: ChatChannel[];
	next?: string;
}

export interface MessagesResponse {
	messages: ChatMessage[];
	has_more: boolean;
}

export interface UnreadCountResponse {
	unread_count: number;
}

const CHAT_BASE_URL = '/api/v1/chat';

/**
 * Create 1:1 Direct Channel
 * 권한: 직원(코디네이터, 의사)만 가능
 */
export async function createChannel(
	request: CreateChannelRequest,
	userId: string,
): Promise<ChatChannel> {
	const response = await apiClient.post<ChatChannel>(`${CHAT_BASE_URL}/channels`, request, {
		headers: {
			'X-User-Id': userId,
		},
	});
	return response.data;
}

/**
 * Get Channel
 */
export async function getChannel(channelUrl: string): Promise<ChatChannel> {
	const response = await apiClient.get<ChatChannel>(`${CHAT_BASE_URL}/channels/${channelUrl}`);
	return response.data;
}

/**
 * List User's Channels
 */
export async function listUserChannels(
	userId: string,
	limit: number = 20,
): Promise<ChannelsResponse> {
	const response = await apiClient.get<ChannelsResponse>(
		`${CHAT_BASE_URL}/users/${userId}/channels`,
		{
			params: { limit },
		},
	);
	return response.data;
}

/**
 * Send Message
 *
 * 권한 체크:
 * - closed 상태 + patient → 403
 * - closed 상태 + staff → 자동 재개
 */
export async function sendMessage(
	channelUrl: string,
	request: SendMessageRequest,
): Promise<ChatMessage> {
	const response = await apiClient.post<ChatMessage>(
		`${CHAT_BASE_URL}/channels/${channelUrl}/messages`,
		request,
	);
	return response.data;
}

/**
 * Get Messages
 */
export async function getMessages(
	channelUrl: string,
	limit: number = 50,
	messageTs?: number,
	reverse: boolean = false,
): Promise<MessagesResponse> {
	const response = await apiClient.get<MessagesResponse>(
		`${CHAT_BASE_URL}/channels/${channelUrl}/messages`,
		{
			params: {
				limit,
				messageTs,
				reverse,
			},
		},
	);
	return response.data;
}

/**
 * Mark Channel as Read
 */
export async function markAsRead(channelUrl: string, userId: string): Promise<void> {
	await apiClient.post(`${CHAT_BASE_URL}/channels/${channelUrl}/read`, {
		user_id: userId,
	});
}

/**
 * Close Channel (대화 종료)
 */
export async function closeChannel(channelUrl: string, userId: string): Promise<void> {
	await apiClient.put(`${CHAT_BASE_URL}/channels/${channelUrl}/close`, null, {
		headers: {
			'X-User-Id': userId,
		},
	});
}

/**
 * Get Unread Message Count
 */
export async function getUnreadCount(userId: string): Promise<UnreadCountResponse> {
	const response = await apiClient.get<UnreadCountResponse>(
		`${CHAT_BASE_URL}/users/${userId}/unread`,
	);
	return response.data;
}

/**
 * Check if message is system message
 */
export function isSystemMessage(message: ChatMessage): boolean {
	return message.message_type === 'ADMM';
}

/**
 * Check if channel is closed
 */
export function isChannelClosed(channel: ChatChannel): boolean {
	return channel.metadata?.status === ChannelStatus.CLOSED;
}

/**
 * Format timestamp to time string (HH:MM)
 */
export function formatMessageTime(timestamp: number): string {
	const date = new Date(timestamp);
	return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format timestamp to date string (DD/MM/YYYY)
 */
export function formatMessageDate(timestamp: number): string {
	const date = new Date(timestamp);
	return date.toLocaleDateString('ko-KR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Check if two timestamps are on the same day
 */
export function isSameDay(timestamp1: number, timestamp2: number): boolean {
	const date1 = new Date(timestamp1);
	const date2 = new Date(timestamp2);
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

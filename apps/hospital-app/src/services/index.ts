/**
 * Service exports for Hospital App
 */

import * as chatService from './chatService';
import { mockChatService } from './chatService.mock';

/**
 * Determines if the app should use mock services
 */
function shouldUseMockServices(): boolean {
	const useMockData = import.meta.env.VITE_USE_MOCK_DATA;
	if (useMockData !== undefined) {
		return useMockData === 'true';
	}

	const isDevelopment = import.meta.env.DEV;
	const hasApiUrl = !!import.meta.env.VITE_API_BASE_URL;

	return isDevelopment && !hasApiUrl;
}

const USE_MOCK_SERVICES = shouldUseMockServices();

// Log service mode for debugging
if (import.meta.env.DEV) {
	console.info(`[Services] Using ${USE_MOCK_SERVICES ? 'MOCK' : 'REAL'} API services`);
}

/**
 * Get Chat Service (mock or real)
 */
export function getChatService() {
	return USE_MOCK_SERVICES ? mockChatService : chatService;
}

// Export individual services for direct import if needed
export { chatService };
export { mockChatService } from './chatService.mock';
export { appointmentService } from './appointmentService';
export { doctorService } from './doctorService';

export type {
	ChatChannel,
	ChatMessage,
	ChatMember,
	ChannelMetadata,
	CreateChannelRequest,
	SendMessageRequest,
	ChannelsResponse,
	MessagesResponse,
	UnreadCountResponse,
	ChannelCustomType,
	ChannelStatus,
} from './chatService';

export type {
	Appointment,
	AppointmentListResponse,
	ConfirmAppointmentRequest,
	CancelAppointmentRequest,
	UpdateAppointmentRequest,
	StartAppointmentRequest,
	CompleteAppointmentRequest,
} from './appointmentService';

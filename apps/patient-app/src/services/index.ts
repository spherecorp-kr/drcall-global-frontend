/**
 * Service Factory
 *
 * Automatically switches between mock and real API implementations
 * based on environment variables.
 *
 * Usage:
 * ```typescript
 * import { getAppointmentService, getPhrService } from '@services';
 *
 * const appointmentService = getAppointmentService();
 * const appointments = await appointmentService.getAppointments();
 * ```
 */

import { appointmentService } from './appointmentService';
import { mockAppointmentService } from './appointmentService.mock';
import { phrService } from './phrService';
import { mockPhrService } from './phrService.mock';
import { authService } from './authService';
import { hospitalService } from './hospitalService';
import * as chatService from './chatService';
import { mockChatService } from './chatService.mock';

/**
 * Determines if the app should use mock services
 *
 * Priority:
 * 1. VITE_USE_MOCK_API environment variable (explicit override)
 * 2. If in development mode AND no API URL is set, use mocks
 * 3. Otherwise use real API
 */
function shouldUseMockServices(): boolean {
  // Explicit override via environment variable
  // Use VITE_USE_MOCK_API for consistency with main.tsx
  const useMockApi = import.meta.env.VITE_USE_MOCK_API;
  if (useMockApi !== undefined && useMockApi !== '') {
    return useMockApi === 'true';
  }

  // Auto-detect: use mocks in development if no API URL is set
  const isDevelopment = import.meta.env.DEV;
  const hasApiUrl = !!import.meta.env.VITE_API_BASE_URL;

  return isDevelopment && !hasApiUrl;
}

const USE_MOCK_SERVICES = shouldUseMockServices();

// Log service mode for debugging
if (import.meta.env.DEV) {
   
  console.info(
    `[Services] Using ${USE_MOCK_SERVICES ? 'MOCK' : 'REAL'} API services`,
    {
      VITE_USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API,
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      DEV: import.meta.env.DEV,
    }
  );
}

/**
 * Get Appointment Service (mock or real)
 */
export function getAppointmentService() {
  return USE_MOCK_SERVICES ? mockAppointmentService : appointmentService;
}

/**
 * Get PHR Service (mock or real)
 */
export function getPhrService() {
  return USE_MOCK_SERVICES ? mockPhrService : phrService;
}

/**
 * Get Auth Service (always uses real API)
 */
export function getAuthService() {
  return authService;
}

/**
 * Get Hospital Service (always uses real API)
 */
export function getHospitalService() {
  return hospitalService;
}

/**
 * Get Chat Service (mock or real)
 */
export function getChatService() {
  return USE_MOCK_SERVICES ? mockChatService : chatService;
}

// Export individual services for direct import if needed
export { appointmentService } from './appointmentService';
export { mockAppointmentService } from './appointmentService.mock';
export { phrService } from './phrService';
export { mockPhrService } from './phrService.mock';
export { authService } from './authService';
export { hospitalService } from './hospitalService';
export { chatService };
export { mockChatService } from './chatService.mock';

// Export types
export type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest } from './appointmentService';
export type { Hospital, Doctor } from '../types/hospital';
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

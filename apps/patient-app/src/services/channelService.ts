import { apiClient } from './api';

/**
 * Channel Information (matches backend HospitalChannelReplica)
 */
export interface ChannelInfo {
  id: number;
  hospitalId: number;
  hospitalName: string;
  channelType: 'LINE' | 'TELEGRAM' | 'WHATSAPP' | 'SMS' | 'WEB';
  channelIdentifier: string;
  channelName: string;
  subdomain: string;
  config: Record<string, any>;
  active: boolean;
  verified: boolean;
}

/**
 * Channel API Service
 */
export const channelService = {
  /**
   * Get channel info by subdomain (from current request)
   * Backend extracts subdomain from Host header
   */
  getCurrentChannelInfo: async (): Promise<ChannelInfo> => {
    const response = await apiClient.get<ChannelInfo>('/api/v1/channels/current');
    return response.data;
  },
};

export default channelService;

/**
 * Multi-Channel Support Utilities
 *
 * Supports: LINE, Telegram, WhatsApp, SMS, WEB
 * Automatically detects channel type and extracts channelUserId
 */

export type ChannelType = 'LINE' | 'TELEGRAM' | 'WHATSAPP' | 'SMS' | 'WEB';

export interface ChannelUserIdResult {
  channelUserId: string;
  channelType: ChannelType;
  displayName?: string;
  pictureUrl?: string;
}

/**
 * Get channelUserId based on current platform
 *
 * Detection order:
 * 1. LINE LIFF (if window.liff exists)
 * 2. Telegram WebApp (if window.Telegram exists)
 * 3. URL parameters (?channel=whatsapp&userId=...)
 * 4. WEB (default - generates UUID)
 */
export const getChannelUserId = async (): Promise<ChannelUserIdResult> => {
  // 1. LINE LIFF Detection
  if (typeof window !== 'undefined' && window.liff) {
    try {
      const liffId = import.meta.env.VITE_LIFF_ID;

      if (!liffId) {
        console.warn('LIFF ID not configured in environment variables');
      } else {
        await window.liff.init({ liffId });

        if (!window.liff.isLoggedIn()) {
          window.liff.login();
          // Will redirect, so return empty for now
          return {
            channelUserId: '',
            channelType: 'LINE',
          };
        }

        const profile = await window.liff.getProfile();

        console.log('[Channel] LINE LIFF detected:', profile.userId);

        return {
          channelUserId: profile.userId,
          channelType: 'LINE',
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
        };
      }
    } catch (error) {
      console.error('[Channel] LINE LIFF initialization error:', error);
    }
  }

  // 2. Telegram WebApp Detection
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const telegramUserId = user.id.toString();

    console.log('[Channel] Telegram WebApp detected:', telegramUserId);

    return {
      channelUserId: telegramUserId,
      channelType: 'TELEGRAM',
      displayName: [user.first_name, user.last_name].filter(Boolean).join(' '),
    };
  }

  // 3. URL Parameters Detection (for WhatsApp/SMS)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const channelParam = params.get('channel')?.toUpperCase() as ChannelType | null;
    const userIdParam = params.get('userId');

    if (channelParam && userIdParam) {
      if (channelParam === 'WHATSAPP' || channelParam === 'SMS') {
        console.log(`[Channel] ${channelParam} detected from URL:`, userIdParam);

        return {
          channelUserId: userIdParam,
          channelType: channelParam,
        };
      }
    }
  }

  // 4. Default: WEB Channel with UUID
  const webUserId = getOrCreateWebUserId();

  console.log('[Channel] WEB channel (default):', webUserId);

  return {
    channelUserId: webUserId,
    channelType: 'WEB',
  };
};

/**
 * Get or create persistent web user ID (stored in localStorage)
 */
export const getOrCreateWebUserId = (): string => {
  const storageKey = 'drcall_web_user_id';

  if (typeof window === 'undefined') {
    return `web_${generateUUID()}`;
  }

  let webUserId = localStorage.getItem(storageKey);

  if (!webUserId) {
    webUserId = `web_${generateUUID()}`;
    localStorage.setItem(storageKey, webUserId);
    console.log('[Channel] New web user ID generated:', webUserId);
  }

  return webUserId;
};

/**
 * Create channelUserId from phone number (for SMS/WhatsApp)
 */
export const createChannelUserIdFromPhone = (
  phone: string,
  phoneCountryCode: string = '+66'
): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  return `${phoneCountryCode}${cleanPhone}`;
};

/**
 * Clear web user ID (for testing or logout)
 */
export const clearWebUserId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('drcall_web_user_id');
    console.log('[Channel] Web user ID cleared');
  }
};

/**
 * Generate UUID v4 (RFC 4122 compliant)
 */
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get subdomain from current hostname
 * Returns null if no subdomain or localhost
 */
export const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;

  // Ignore localhost and IPs
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }

  const parts = hostname.split('.');

  // Need at least 3 parts: subdomain.domain.tld
  if (parts.length < 3) {
    return null;
  }

  // Return first part as subdomain
  return parts[0];
};

// TypeScript global type extensions
declare global {
  interface Window {
    liff?: {
      init: (config: { liffId: string }) => Promise<void>;
      isLoggedIn: () => boolean;
      login: () => void;
      getProfile: () => Promise<{
        userId: string;
        displayName: string;
        pictureUrl?: string;
        statusMessage?: string;
      }>;
    };
    Telegram?: {
      WebApp: {
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

import { useEffect, useState } from 'react';
import { channelService } from '../services/channelService';

/**
 * LIFF Enforcement Hook
 *
 * For LINE channels: Enforces LIFF access by redirecting to liff.line.me if not in LIFF
 * Must be used on all pages in LINE channel subdomains
 *
 * Usage:
 * ```tsx
 * const { isLiffReady, channelInfo } = useLiffEnforcement();
 *
 * if (!isLiffReady) {
 *   return <LoadingScreen />;
 * }
 * ```
 */
export const useLiffEnforcement = () => {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [channelInfo, setChannelInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAndEnforceLiff = async () => {
      try {
        // 1. Get current channel info from backend
        const channel = await channelService.getCurrentChannelInfo();
        setChannelInfo(channel);

        // 2. If not LINE channel, proceed immediately
        if (channel.channelType !== 'LINE') {
          setIsLiffReady(true);
          return;
        }

        // 3. LINE channel - check if in LIFF
        if (!window.liff) {
          // Not in LIFF - redirect to LIFF URL
          const liffId = channel.config?.liffId || import.meta.env.VITE_LIFF_ID;

          if (!liffId) {
            console.error('LINE channel but no LIFF ID configured');
            setError('LIFF ID not configured');
            return;
          }

          const currentPath = window.location.pathname + window.location.search;
          const liffUrl = `https://liff.line.me/${liffId}${currentPath}`;

          console.log('[LIFF Enforcement] Not in LIFF, redirecting to:', liffUrl);
          window.location.href = liffUrl;
          return;
        }

        // 4. In LIFF - initialize
        const liffId = channel.config?.liffId || import.meta.env.VITE_LIFF_ID;

        if (!liffId) {
          console.error('LINE channel but no LIFF ID configured');
          setError('LIFF ID not configured');
          return;
        }

        await window.liff.init({ liffId });

        // 5. Check login status
        if (!window.liff.isLoggedIn()) {
          console.log('[LIFF Enforcement] Not logged in, redirecting to LINE login');
          window.liff.login();
          return;
        }

        // 6. Get LIFF profile and set X-Line-UserId header for API calls
        const profile = await window.liff.getProfile();
        console.log('[LIFF Enforcement] LIFF ready, userId:', profile.userId);

        // Store LIFF userId in sessionStorage for API interceptor
        sessionStorage.setItem('liff_user_id', profile.userId);

        setIsLiffReady(true);

      } catch (err) {
        console.error('[LIFF Enforcement] Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLiffReady(true); // Proceed anyway to avoid blocking
      }
    };

    checkAndEnforceLiff();
  }, []);

  return {
    isLiffReady,
    channelInfo,
    error,
  };
};

export default useLiffEnforcement;

import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChannelUserId, getSubdomain } from '@/utils/channelUtils';

interface ChannelValidatorProps {
  children: ReactNode;
}

/**
 * 채널 정보 검증 컴포넌트
 * - 서브도메인이 없고 WEB 채널이 아닌 경우 404로 리다이렉트
 * - LINE/Telegram/WhatsApp/SMS는 반드시 서브도메인을 통해 접근해야 함
 */
export default function ChannelValidator({ children }: ChannelValidatorProps) {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateChannel = async () => {
      try {
        const subdomain = getSubdomain();
        const channelInfo = await getChannelUserId();

        // 서브도메인이 없고 WEB 채널이 아닌 경우 404로 리다이렉트
        if (!subdomain && channelInfo.channelType !== 'WEB') {
          console.error('[ChannelValidator] No subdomain for non-WEB channel:', channelInfo.channelType);
          navigate('/error/404', { replace: true });
          return;
        }

        setIsValidating(false);
      } catch (error) {
        console.error('[ChannelValidator] Validation error:', error);
        navigate('/error/404', { replace: true });
      }
    };

    validateChannel();
  }, [navigate]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-70 mx-auto mb-4" />
          <p className="text-text-70">채널 정보 확인 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

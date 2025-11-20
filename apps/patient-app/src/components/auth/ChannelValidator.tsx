import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getChannelUserId, getSubdomain } from '@/utils/channelUtils';
import Spinner from '@/components/ui/feedback/Spinner';

interface ChannelValidatorProps {
  children: ReactNode;
}

/**
 * 채널 정보 검증 컴포넌트
 * - 서브도메인이 없으면 채널 선택 안내 페이지로 리다이렉트
 * - 백엔드는 X-Channel-Id 헤더가 필수이므로 subdomain이 반드시 필요
 */
export default function ChannelValidator({ children }: ChannelValidatorProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateChannel = async () => {
      try {
        const subdomain = getSubdomain();

        // 서브도메인이 없으면 404 페이지로 이동
        if (!subdomain) {
          console.warn('[ChannelValidator] No subdomain detected - redirecting to 404');
          navigate('/error/404', { replace: true });
          return;
        }

        // 서브도메인이 있으면 정상 진행
        console.log('[ChannelValidator] Valid subdomain:', subdomain);
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
      <div className="flex items-center justify-center min-h-screen bg-bg-base">
        <div className="flex flex-col items-center">
          <Spinner size="lg" />
          <p className="mt-4 text-text-70 text-base">{t('common.checkingChannel')}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getChannelUserId, getSubdomain } from '@/utils/channelUtils';
import { apiClient } from '@/services/api';
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
          setIsValidating(false);
          navigate('/error/404', { replace: true });
          return;
        }

        // 서브도메인이 있으면 백엔드에서 채널 검증
        // GET /api/v1/public/channels/validate 호출 (인증 불필요)
        // X-Channel-Id 헤더는 api.ts에서 자동으로 추가됨
        try {
          await apiClient.get('/api/v1/public/channels/validate');
          console.log('[ChannelValidator] Channel validated successfully:', subdomain);
          setIsValidating(false);
        } catch (error: any) {
          console.error('[ChannelValidator] Invalid channel:', subdomain, error);
          setIsValidating(false);

          // 에러 타입에 따라 다른 페이지로 리다이렉트
          if (error.response) {
            const status = error.response.status;
            if (status === 404) {
              // 채널을 찾을 수 없음
              navigate('/error/404', { replace: true });
            } else if (status === 401 || status === 403) {
              // 인증/권한 에러
              navigate('/error/403', { replace: true });
            } else if (status >= 500) {
              // 서버 에러
              navigate('/error/500', { replace: true });
            } else {
              // 기타 에러
              navigate('/error/404', { replace: true });
            }
          } else if (error.request) {
            // 네트워크 에러 (요청은 보냈지만 응답 없음)
            navigate('/error/500', { replace: true });
          } else {
            // 요청 설정 중 에러
            navigate('/error/500', { replace: true });
          }
        }
      } catch (error) {
        console.error('[ChannelValidator] Validation error:', error);
        setIsValidating(false);
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

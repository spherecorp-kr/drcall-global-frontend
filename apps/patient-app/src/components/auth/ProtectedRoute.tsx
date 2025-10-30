import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 *
 * 인증 확인:
 * 1. tempJwt: OTP 인증 완료 후 프로필 등록 전
 * 2. 쿠키(sid): 회원가입 완료 후 정상 인증 상태
 *
 * useAuth()를 통해 중앙화된 인증 상태 확인
 * 미인증 시 → /auth/phone-verification으로 리다이렉트
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading } = useAuth();

  // 1. Check temporary JWT (during registration flow)
  const tempJwt = localStorage.getItem('tempJwt');

  // 2. Check if cookies exist (after registration complete)
  const hasCookies = document.cookie.includes('sid');

  // Show nothing while checking authentication
  if (isLoading) {
    return null; // or a loading spinner
  }

  // If no authentication token found
  if (!tempJwt && !hasCookies) {
    console.log('[ProtectedRoute] No authentication found, redirecting to login');
    return <Navigate to="/auth/phone-verification" replace />;
  }

  // User is authenticated
  return <>{children}</>;
}

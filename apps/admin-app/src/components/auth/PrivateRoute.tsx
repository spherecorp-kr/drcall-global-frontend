import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
	children: React.ReactNode;
}

/**
 * Private Route Component
 * 인증이 필요한 페이지를 보호하는 컴포넌트
 * 미인증 시 로그인 페이지로 리다이렉트
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
	const { isAuthenticated, isLoading } = useAuth();

	// 로딩 중이면 아무것도 표시하지 않음
	if (isLoading) {
		return null;
	}

	// 인증되지 않았으면 로그인 페이지로 리다이렉트
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
}


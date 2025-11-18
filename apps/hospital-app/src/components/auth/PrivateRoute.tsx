import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * 인증되지 않은 사용자는 /login으로 리디렉션
 */
export function PrivateRoute() {
	const { isAuthenticated, isLoading } = useAuth();

	// 로딩 중이면 빈 화면 표시 (또는 로딩 스피너)
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-xl text-gray-600">로딩 중...</div>
			</div>
		);
	}

	// 인증되지 않았으면 로그인 페이지로 리디렉션
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	// 인증되었으면 자식 라우트 렌더링
	return <Outlet />;
}

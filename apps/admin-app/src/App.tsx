import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { MainLayout } from '@/shared/components/layout';
import TextLogo from '@/assets/logo_drcall.svg';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useAuth } from '@/contexts/AuthContext';
import {
	DashboardPage,
	AdminDashboardPage,
	HospitalListPage,
	HospitalPage,
	HospitalOnboardingPage,
	LoginPage,
	MyInfoPage,
} from '@/pages';

// 라우트 설정 정의 (확장 시 여기에 추가)
const ROUTE_CONFIGS = [
	{ pattern: /^\/hospitals\/\d+$/, showBackButton: true }, // 병원 상세
	{ pattern: /^\/hospitals\/new$/, showBackButton: true }, // 병원 등록
	{ pattern: /^\/hospitals\/onboarding$/, showBackButton: true }, // 병원 온보딩
	{ pattern: /^\/users\/\d+$/, showBackButton: true }, // 사용자 상세
	{ pattern: /^\/monitoring\/services\/.*$/, showBackButton: true }, // 서비스 상세
	{ pattern: /^\/content\/announcements\/\d+$/, showBackButton: true }, // 공지사항 상세
	{ pattern: /^\/content\/faqs\/\d+$/, showBackButton: true }, // FAQ 상세
] as const;

function AppContent() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, logout: authLogout } = useAuth();

	const { t } = useTranslation();

	// 현재 경로에 따른 페이지 타이틀
	const pageTitle: string = useMemo(() => {
		const path: string = location.pathname;
		if (path.includes('dashboard')) return t('menu.dashboard');
		if (path.includes('hospitals')) return t('menu.hospitals');
		if (path.includes('users')) return t('menu.users');
		if (path.includes('monitoring')) return t('menu.monitoring');
		if (path.includes('content')) return t('menu.content');
		if (path.includes('audit')) return t('menu.audit');
		if (path.includes('settings')) return t('menu.settings');
		return t('menu.dashboard');
	}, [location.pathname, t]);

	// 현재 경로에 대한 설정 찾기
	const currentRouteConfig = useMemo(() => {
		return ROUTE_CONFIGS.find(config => config.pattern.test(location.pathname));
	}, [location.pathname]);

	// 현재 경로가 뒤로가기 버튼이 필요한지 확인
	const shouldShowBackButton: boolean = currentRouteConfig?.showBackButton ?? false;

	// 메뉴 클릭 핸들러
	const handleMenuClick = useCallback((menuId: string) => {
		navigate(`/${menuId}`);
	}, [navigate]);

	// 뒤로가기 핸들러
	const handleBack = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	// 로그아웃 핸들러
	const handleLogout = useCallback(async () => {
		await authLogout();
		navigate('/login');
	}, [authLogout, navigate]);

	return (
		<Routes>
			{/* 로그인 페이지 - 인증 불필요 */}
			<Route path="/login" element={<LoginPage />} />
			
			{/* 보호된 라우트 - 인증 필요 */}
			<Route
				path="/"
				element={
					<PrivateRoute>
						<MainLayout
							logo={<img src={TextLogo} alt="Dr.Call" className="w-[164px] h-[42px]" />}
							onBack={handleBack}
							onLogout={handleLogout}
							onMenuClick={handleMenuClick}
							pageTitle={pageTitle}
							showBackButton={shouldShowBackButton}
							userName={user?.name || '관리자'}
							userRole={user?.role || 'admin'}
						/>
					</PrivateRoute>
				}
			>
				<Route index element={<Navigate to="/dashboard" replace />} />
				<Route path="dashboard" element={<AdminDashboardPage />} />
				<Route path="hospitals" element={<HospitalListPage />} />
				<Route path="hospitals/onboarding" element={<HospitalOnboardingPage />} />
				<Route path="hospitals/:id" element={<HospitalPage />} />
				<Route path="users" element={<DashboardPage />} />
				<Route path="monitoring" element={<DashboardPage />} />
				<Route path="content" element={<DashboardPage />} />
				<Route path="audit" element={<DashboardPage />} />
				<Route path="settings" element={<MyInfoPage />} />
				<Route path="*" element={<Navigate to="/dashboard" replace />} />
			</Route>
		</Routes>
	);
}

function App() {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
}

export default App;

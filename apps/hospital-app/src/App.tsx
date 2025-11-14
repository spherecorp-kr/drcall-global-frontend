import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { MainLayout } from '@/shared/components/layout';
import TextLogo from '@/assets/logo_drcall.svg';
import {
	AppointmentDetailPage,
	AppointmentPage,
	ConsultationPage,
	DashboardPage,
	DoctorPage,
	DoctorDetailPage,
	HospitalPage,
	MyInfoPage,
	PatientPage,
	PatientDetailPage,
	PatientRegistrationPage,
	PaymentPage,
	AppointmentEditPage,
} from '@/pages';

// 라우트 설정 정의 (확장 시 여기에 추가)
const ROUTE_CONFIGS = [
	{ pattern: /^\/appointment\/\d+$/, showBackButton: true }, // 예약 상세
	{ pattern: /^\/patient\/new$/, showBackButton: true }, // 환자 등록
	{ pattern: /^\/patient\/\d+$/, showBackButton: true }, // 환자 상세
	{ pattern: /^\/doctor\/new$/,  showBackButton: true }, // 의사 등록
	{ pattern: /^\/doctor\/\d+$/,  showBackButton: true }, // 의사 상세
] as const;

function AppContent() {
	const navigate = useNavigate();
	const location = useLocation();

	const { t } = useTranslation();

	// 현재 경로에 따른 페이지 타이틀
	const pageTitle: string = useMemo(() => {
		const path: string = location.pathname;
		if (path.includes('appointment')) return t('menu.appointment');
		if (path.includes('consultation')) return t('menu.consultation');
		if (path.includes('dashboard')) return t('menu.dashboard');
		if (path === '/doctor/new') return '의사 등록';
		if (path.match(/^\/doctor\/\d+$/)) return '의사 계정 상세';
		if (path.includes('doctor')) return t('menu.doctor');
		if (path.includes('hospital')) return t('menu.hospital');
		if (path.includes('myinfo')) return t('menu.myinfo');
		if (path === '/patient/new') return '환자 등록';
		if (path.match(/^\/patient\/\d+$/)) return '환자 상세';
		if (path.includes('patient')) return t('menu.patient');
		if (path.includes('payment')) return t('menu.payment');
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

	return (
		<Routes>
			<Route
				path="/"
				element={
					<MainLayout
						logo={<img src={TextLogo} alt="Dr.Call" className="w-[164px] h-[42px]" />}
						onBack={handleBack}
						onLogout={() => console.log('Logout clicked')}
						onMenuClick={handleMenuClick}
						pageTitle={pageTitle}
						showBackButton={shouldShowBackButton}
						userName="홍길동"
						userRole="coordinator"
					/>
				}
			>
				<Route index element={<Navigate to="/dashboard" replace />} />
				<Route path="dashboard" element={<DashboardPage />} />
				<Route path="appointment/:appointmentSequence/edit" element={<AppointmentEditPage />} />
				<Route path="appointment/:appointmentSequence" element={<AppointmentDetailPage />} />
				<Route path="appointment" element={<AppointmentPage />} />
				<Route path="payment" element={<PaymentPage />} />
				<Route path="patient">
					<Route index element={<PatientPage />} />
					<Route path="new" element={<PatientRegistrationPage />} />
					<Route path=":id" element={<PatientDetailPage />} />
				</Route>
				<Route path="doctor" element={<DoctorPage />} />
				<Route path="doctor/:id" element={<DoctorDetailPage />} />
				<Route path="hospital" element={<HospitalPage />} />
				<Route path="myinfo" element={<MyInfoPage />} />
				<Route path="consultation" element={<ConsultationPage />} />
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

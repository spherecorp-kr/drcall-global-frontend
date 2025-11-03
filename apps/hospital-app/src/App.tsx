import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { MainLayout } from '@/shared/components/layout';
import TextLogo from '@/assets/logo_drcall.svg';
import {
	AppointmentPage,
	ConsultationPage,
	DashboardPage,
	DoctorPage,
	DoctorDetailPage,
	HospitalPage,
	MyInfoPage,
	PatientPage,
	PaymentPage,
} from '@/pages';

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
		if (path.match(/^\/doctor\/[^/]+$/)) return '의사 계정 상세';
		if (path.includes('doctor')) return t('menu.doctor');
		if (path.includes('hospital')) return t('menu.hospital');
		if (path.includes('myinfo')) return t('menu.myinfo');
		if (path.includes('patient')) return t('menu.patient');
		if (path.includes('payment')) return t('menu.payment');
		return t('menu.dashboard');
	}, [location.pathname, t]);

	// 뒤로가기 버튼 표시 여부
	const showBackButton = useMemo(() => {
		const path: string = location.pathname;
		return path.match(/^\/doctor\/[^/]+$/) !== null;
	}, [location.pathname]);

	// 뒤로가기 핸들러
	const handleBack = useCallback(() => {
		navigate('/doctor');
	}, [navigate]);

	// 메뉴 클릭 핸들러
	const handleMenuClick = useCallback((menuId: string) => {
		navigate(`/${menuId}`);
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
						showBackButton={showBackButton}
						userName="홍길동"
						userRole="coordinator"
					/>
				}
			>
				<Route index element={<Navigate to="/dashboard" replace />} />
				<Route path="dashboard" element={<DashboardPage />} />
				<Route path="appointment" element={<AppointmentPage />} />
				<Route path="payment" element={<PaymentPage />} />
				<Route path="patient" element={<PatientPage />} />
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
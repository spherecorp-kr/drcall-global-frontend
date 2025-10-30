import { useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Appointment } from '@/pages/Appointment';
import { Payment } from '@/pages/Payment';
import { Patient } from '@/pages/Patient';
import { Doctor } from '@/pages/Doctor';
import { Hospital } from '@/pages/Hospital';
import { MyInfo } from '@/pages/MyInfo';
import { Consultation } from '@/pages/Consultation';
import TextLogo from '@/assets/logo_drcall.svg';
import { useTranslation } from 'react-i18next';

function AppContent() {
	const navigate = useNavigate();
	const location = useLocation();

	const { t } = useTranslation();

	// 현재 경로에 따른 페이지 타이틀
	const pageTitle: string = useMemo(() => {
		const path = location.pathname;
		if (path.includes('appointment')) return t('menu.appointment');
		if (path.includes('consultation')) return t('menu.consultation');
		if (path.includes('dashboard')) return t('menu.dashboard');
		if (path.includes('doctor')) return t('menu.doctor');
		if (path.includes('hospital')) return t('menu.hospital');
		if (path.includes('myinfo')) return t('menu.myinfo');
		if (path.includes('patient')) return t('menu.patient');
		if (path.includes('payment')) return t('menu.payment');
		return t('menu.dashboard');
	}, [location.pathname, t]);

	// 메뉴 클릭 핸들러
	const handleMenuClick = useCallback(
		(menuId: string) => {
			navigate(`/${menuId}`);
		},
		[navigate],
	);

	return (
		<Routes>
			<Route
				path="/"
				element={
					<MainLayout
						logo={<img src={TextLogo} alt="Dr.Call" className="w-[164px] h-[42px]" />}
						onLogout={() => console.log('Logout clicked')}
						onMenuClick={handleMenuClick}
						pageTitle={pageTitle}
						userName="홍길동"
						userRole="coordinator"
					/>
				}
			>
				<Route index element={<Navigate to="/dashboard" replace />} />
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="appointment" element={<Appointment />} />
				<Route path="payment" element={<Payment />} />
				<Route path="patient" element={<Patient />} />
				<Route path="doctor" element={<Doctor />} />
				<Route path="hospital" element={<Hospital />} />
				<Route path="myinfo" element={<MyInfo />} />
				<Route path="consultation" element={<Consultation />} />
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

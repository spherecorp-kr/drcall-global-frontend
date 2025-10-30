import type { ReactNode } from 'react';

// Menu icons
import ConsultationIcon from '@/assets/icons/ic_doctors office.svg';
import DashboardIcon from '@/assets/icons/ic_dashboard.svg';
import AppointmentIcon from '@/assets/icons/ic_appointment.svg';
import CreditCardIcon from '@/assets/icons/ic_creditcard.svg';
import PatientIcon from '@/assets/icons/ic_paient.svg';
import DoctorIcon from '@/assets/icons/ic_doctors mng.svg';
import HospitalIcon from '@/assets/icons/ic_hospital.svg';
import MyInfoIcon from '@/assets/icons/ic_my info.svg';

export interface MenuItem {
	id: string;
	icon: ReactNode;
	badges?: Array<number | 'dot'>;
	onClick?: () => void;
	active?: boolean;
}

const createIcon = (src: string) => <img src={src} alt="" className="w-6 h-6" />;

// 코디네이터용 메뉴
export const coordinatorMenu: MenuItem[] = [
	{
		id: 'dashboard',
		icon: createIcon(DashboardIcon),
	},
	{
		id: 'appointment',
		icon: createIcon(AppointmentIcon),
	},
	{
		id: 'payment',
		icon: createIcon(CreditCardIcon),
	},
	{
		id: 'patient',
		icon: createIcon(PatientIcon),
	},
	{
		id: 'doctor',
		icon: createIcon(DoctorIcon),
	},
	{
		id: 'hospital',
		icon: createIcon(HospitalIcon),
	},
	{
		id: 'myinfo',
		icon: createIcon(MyInfoIcon),
	},
];

// 의사용 메뉴
export const doctorMenu: MenuItem[] = [
	{
		id: 'consultation',
		icon: createIcon(ConsultationIcon),
	},
	{
		id: 'dashboard',
		icon: createIcon(DashboardIcon),
	},
	{
		id: 'appointment',
		icon: createIcon(AppointmentIcon),
	},
	{
		id: 'payment',
		icon: createIcon(CreditCardIcon),
	},
	{
		id: 'myinfo',
		icon: createIcon(MyInfoIcon),
	},
];

export const getMenuByRole = (role: 'coordinator' | 'doctor'): MenuItem[] => {
	return role === 'coordinator' ? coordinatorMenu : doctorMenu;
};

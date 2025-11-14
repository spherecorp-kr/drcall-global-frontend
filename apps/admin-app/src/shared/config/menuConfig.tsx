import type { ReactNode } from 'react';

// Menu icons
import DashboardIcon from '@/assets/icons/ic_dashboard.svg';
import HospitalIcon from '@/assets/icons/ic_hospital.svg';
import UsersIcon from '@/assets/icons/ic_paient.svg';
import MonitoringIcon from '@/assets/icons/ic_heart.png';
import ContentIcon from '@/assets/icons/ic_edit.svg';
import AuditIcon from '@/assets/icons/ic_check.svg';
import SettingsIcon from '@/assets/icons/ic_my info.svg';

export interface MenuItem {
	id: string;
	icon: ReactNode;
	badges?: Array<number | 'dot'>;
	onClick?: () => void;
	active?: boolean;
}

const createIcon = (src: string) => <img src={src} alt="" className="w-6 h-6" />;

// 관리자용 메뉴
export const adminMenu: MenuItem[] = [
	{
		id: 'dashboard',
		icon: createIcon(DashboardIcon),
	},
	{
		id: 'hospitals',
		icon: createIcon(HospitalIcon),
	},
	{
		id: 'users',
		icon: createIcon(UsersIcon),
	},
	{
		id: 'monitoring',
		icon: createIcon(MonitoringIcon),
	},
	{
		id: 'content',
		icon: createIcon(ContentIcon),
	},
	{
		id: 'audit',
		icon: createIcon(AuditIcon),
	},
	{
		id: 'settings',
		icon: createIcon(SettingsIcon),
	},
];

export const getMenuByRole = (role: 'admin'): MenuItem[] => {
	return adminMenu;
};

import { type ReactNode, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SideNavigation } from './SideNavigation';
import { TopNavigation } from './TopNavigation';
import { ChatFloatingButton } from '@/shared/components/ui/ChatFloatingButton';
import { ChatWindow } from '@/shared/components/ui/ChatWindow';
import { getMenuByRole } from '@/shared/config/menuConfig';
import { useLayoutStore } from '@/shared/store/layoutStore';

interface MainLayoutProps {
	logo: ReactNode;
	onBack?: () => void;
	onLogout?: () => void;
	onMenuClick?: (menuId: string) => void;
	pageTitle: string;
	showBackButton?: boolean;
	userAvatar?: string;
	userName: string;
	userRole: 'coordinator' | 'doctor';
}

export function MainLayout({
	logo,
	onBack,
	onLogout,
	onMenuClick,
	pageTitle,
	showBackButton,
	userAvatar,
	userName,
	userRole,
}: MainLayoutProps) {
	const { isSideNavExpanded, toggleSideNav } = useLayoutStore();
	const location = useLocation();
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [buttonPosition, setButtonPosition] = useState({ x: 32, y: 32 });

	// Get menu items based on user role and set active based on current route
	const menuItems = getMenuByRole(userRole).map((item) => ({
		...item,
		active: location.pathname.includes(item.id),
		onClick: () => onMenuClick?.(item.id),
	}));

	return (
		<div className="flex h-screen w-screen bg-bg-gray overflow-hidden">
			{/* Side Navigation */}
			<SideNavigation
				isExpanded={isSideNavExpanded}
				logo={logo}
				menuItems={menuItems}
				onLogout={onLogout}
				onToggle={toggleSideNav}
			/>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				{/* Top Navigation */}
				<div className="h-[60px] sm:h-[65px] md:h-[70px] flex-shrink-0">
					<TopNavigation
						onBack={onBack}
						showBackButton={showBackButton}
						title={pageTitle}
						userAvatar={userAvatar}
						userName={userName}
						userRole={userRole}
					/>
				</div>

				{/* Content */}
				<main className="flex-1 overflow-auto min-h-0">
					<Outlet />
				</main>
			</div>

			{/* Chat Floating Button */}
			<ChatFloatingButton
				unreadCount={3}
				isOpen={isChatOpen}
				onClick={() => setIsChatOpen(!isChatOpen)}
				onPositionChange={setButtonPosition}
			/>

			{/* Chat Window */}
			<ChatWindow
				isOpen={isChatOpen}
				onClose={() => setIsChatOpen(false)}
				buttonPosition={buttonPosition}
			/>
		</div>
	);
}

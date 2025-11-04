import { type ReactNode, useState } from 'react';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { Outlet, useLocation } from 'react-router-dom';
import { getMenuByRole } from '@/shared/config/menuConfig';
import { SideNavigation, TopNavigation } from '@/shared/components/layout';
import { ChatFloatingButton, ChatWindow } from '@/shared/components/ui';
import { Dialog } from '@/shared/components/ui/dialog';
import { useDialogProps } from '@/shared/store/dialogStore';

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

const MainLayout = ({
	logo,
	onBack,
	onLogout,
	onMenuClick,
	pageTitle,
	showBackButton,
	userAvatar,
	userName,
	userRole,
}: MainLayoutProps) => {
	const location = useLocation();

	const { isSideNavExpanded, toggleSideNav } = useLayoutStore();

	const dialogProps = useDialogProps();

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

			<Dialog {...dialogProps} />
		</div>
	);
};

export default MainLayout;

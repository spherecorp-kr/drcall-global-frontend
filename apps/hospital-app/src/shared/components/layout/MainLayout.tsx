import { type ReactNode, useState, useEffect } from 'react';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { useChatStore } from '@/shared/store/chatStore';
import { Outlet, useLocation } from 'react-router-dom';
import { getMenuByRole } from '@/shared/config/menuConfig';
import { SideNavigation, TopNavigation } from '@/shared/components/layout';
import { ChatFloatingButton, ChatWindow } from '@/shared/components/ui';
import { Dialog } from '@/shared/components/ui/dialog';
import { useDialogProps } from '@/shared/store/dialogStore';
import { getUnreadCount } from '@/services/chatService';

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
	const { isChatOpen, unreadCount, toggleChat, setUnreadCount } = useChatStore();

	const dialogProps = useDialogProps();

	const [buttonPosition, setButtonPosition] = useState({ x: 32, y: 32 });

	// Get user ID from localStorage or use default for staff
	const userId = `staff-${localStorage.getItem('userId') || '1'}`;

	// Poll unread count every 30 seconds
	useEffect(() => {
		const fetchUnreadCount = async () => {
			try {
				const response = await getUnreadCount(userId);
				setUnreadCount(response.unread_count);
			} catch (error) {
				console.error('Failed to fetch unread count:', error);
			}
		};

		// Fetch immediately on mount
		fetchUnreadCount();

		// Then poll every 30 seconds
		const interval = setInterval(fetchUnreadCount, 30000);

		return () => clearInterval(interval);
	}, [userId, setUnreadCount]);

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
				unreadCount={unreadCount}
				isOpen={isChatOpen}
				onClick={toggleChat}
				onPositionChange={setButtonPosition}
			/>

			{/* Chat Window */}
			<ChatWindow
				isOpen={isChatOpen}
				onClose={() => useChatStore.getState().closeChat()}
				buttonPosition={buttonPosition}
			/>

			<Dialog {...dialogProps} />
		</div>
	);
};

export default MainLayout;

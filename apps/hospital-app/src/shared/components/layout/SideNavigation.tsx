import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';
import { SideNavigationItem } from './SideNavigationItem';
import LogoutIcon from '@/assets/icons/ic_logout.svg';
import CircleLogo from '@/assets/logo_circle.png';
import ToggleFoldIcon from '@/assets/icons/ic_toggle.svg';
import ToggleExpandIcon from '@/assets/icons/ic_toggle_expand.svg';

interface MenuItem {
	active?: boolean;
	badges?: Array<number | 'dot'>;
	icon: ReactNode;
	id: string;
	onClick?: () => void;
}

interface SideNavigationProps {
	isExpanded?: boolean;
	logo: ReactNode;
	menuItems: MenuItem[];
	onLogout?: () => void;
	onToggle?: () => void;
}

export function SideNavigation({
	isExpanded = true,
	onToggle,
	menuItems,
	logo,
	onLogout,
}: SideNavigationProps) {
	return (
		<div
			className={cn(
				'h-screen bg-bg-white border-r border-stroke-input relative overflow-visible',
				'transition-all duration-500 ease-in-out',
				isExpanded ? 'w-[272px]' : 'w-[68px]',
			)}
		>
			{/* Toggle Button */}
			<button
				onClick={onToggle}
				className={cn(
					'absolute top-[23px] w-6 h-6 flex items-center justify-center transition-all duration-500 ease-in-out z-10',
					isExpanded ? 'right-4' : '-right-3',
				)}
			>
				<img
					src={isExpanded ? ToggleFoldIcon : ToggleExpandIcon}
					alt="Toggle"
					className="w-6 h-6"
				/>
			</button>

			<div className="h-full relative">
				<div className="absolute inset-0 pt-[14px] pb-5 px-4 flex flex-col justify-between overflow-visible">
					{/* Top Section */}
					<div className="flex flex-col overflow-visible gap-5">
						{/* Logo */}
						<div
							className={cn(
								'flex flex-col gap-[14px] relative overflow-hidden transition-all duration-500',
								isExpanded ? 'w-60' : 'w-[42px]',
							)}
						>
							<div className="relative h-[42px] overflow-hidden">
								{/* Text Logo */}
								<div
									className={cn(
										'absolute left-[9px] top-0 h-[42px] w-[164px] flex items-center origin-left transform-gpu transition-all duration-500 ease-in-out',
										isExpanded
											? 'opacity-100 scale-x-100 translate-x-0'
											: 'opacity-0 scale-x-0 -translate-x-3 pointer-events-none',
									)}
								>
									{logo}
								</div>
								{/* Circle Logo */}
								<div
									className={cn(
										'absolute left-0 top-0 w-[42px] h-[42px] rounded-full border-[1.5px] border-stroke-input overflow-hidden flex items-center justify-center transition-opacity duration-500 ease-in-out delay-150',
										isExpanded
											? 'opacity-0 pointer-events-none'
											: 'opacity-100',
									)}
								>
									<img
										src={CircleLogo}
										alt="Dr.Call"
										className="w-full h-full object-cover"
									/>
								</div>
							</div>
							<div className="h-px bg-stroke-input w-full" />
						</div>

						{/* Menu Items */}
						<div className="flex flex-col gap-4 overflow-visible">
							{menuItems.map((item, index) => (
								<SideNavigationItem
									key={index}
									icon={item.icon}
									id={item.id}
									badges={item.badges}
									active={item.active}
									isExpanded={isExpanded}
									onClick={item.onClick}
								/>
							))}
						</div>
					</div>

					{/* Bottom Section - Logout */}
					<div className="flex flex-col gap-5">
						<div
							className={cn(
								'h-px bg-stroke-input transition-all duration-500',
								isExpanded ? 'w-full opacity-100' : 'w-[42px] opacity-0',
							)}
						/>
						<button
							onClick={onLogout}
							className={cn(
								'h-[42px] rounded-[10px] relative overflow-visible bg-bg-white hover:bg-bg-disabled',
								'transition-[width,background-color] duration-500 ease-in-out',
								isExpanded ? 'w-60' : 'w-[42px]',
							)}
						>
							<div className="absolute inset-0 py-[9px] px-[9px] flex items-center justify-between overflow-hidden">
								<div className="flex items-center gap-2 flex-shrink-0">
									<img src={LogoutIcon} alt="Logout" className="w-6 h-6" />
									<span
										className={cn(
											'text-18 font-medium font-pretendard text-text-100 whitespace-nowrap',
											'transition-opacity duration-500 ease-in-out',
											isExpanded ? 'opacity-100' : 'opacity-0',
										)}
									>
										Logout
									</span>
								</div>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

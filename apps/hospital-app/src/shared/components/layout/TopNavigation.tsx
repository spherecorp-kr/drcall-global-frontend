import { cn } from '@/shared/utils/cn';
import { LanguageDropdown } from '@/shared/components/ui/LanguageDropdown';
import { RoleBadge } from '@/shared/components/ui/Badge';
import defaultAvatar from '@/assets/img_profile.svg';
import { useTranslation } from 'react-i18next';

interface TopNavigationProps {
	className?: string;
	onBack?: () => void;
	showBackButton?: boolean;
	title: string;
	userAvatar?: string;
	userName: string;
	userRole: 'coordinator' | 'doctor';
}

export function TopNavigation({
	className,
	onBack,
	showBackButton = false,
	title,
	userAvatar,
	userName,
	userRole,
}: TopNavigationProps) {
	const { t } = useTranslation();
	return (
		<div
			className={cn(
				'w-full h-full px-3 sm:px-4 md:px-5 lg:pr-8 bg-bg-white border-b border-stroke-input flex items-center justify-between gap-2 sm:gap-3 md:gap-4',
				className,
			)}
		>
			{/* Left Section */}
			<div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-shrink">
				{showBackButton && (
					<button onClick={onBack} className="flex-shrink-0" aria-label="Go back">
						<svg width="9" height="16" viewBox="0 0 9 16" fill="none">
							<path
								d="M8 1L1 8L8 15"
								stroke="#1F1F1F"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
							/>
						</svg>
					</button>
				)}
				<h1 className="text-text-100 text-lg sm:text-xl md:text-2xl font-medium font-pretendard leading-normal truncate">
					{title}
				</h1>
			</div>

			{/* Right Section */}
			<div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 flex-shrink-0">
				<LanguageDropdown />
				<div className="flex items-center gap-2 sm:gap-3">
					<img
						alt={userName}
						className="w-9 h-9 sm:w-11 sm:h-11 md:w-[54px] md:h-[54px] rounded-full flex-shrink-0"
						src={userAvatar || defaultAvatar}
					/>
					<div className="hidden sm:flex flex-col items-start justify-center gap-0.5 md:gap-1 min-w-0">
						<RoleBadge role={userRole}>{t(`role.${userRole}`)}</RoleBadge>
						<div className="text-text-100 text-sm md:text-base font-normal font-pretendard leading-normal truncate max-w-[120px] md:max-w-[200px]">
							{userName}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

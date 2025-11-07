import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';
import { NumberBadge } from '@/shared/components/ui/Badge';
import { useTranslation } from 'react-i18next';
import { useAppointmentTabStore } from '@/shared/store/appointmentTabStore.ts';

interface SideNavigationItemProps {
	active?: boolean;
	badges?: Array<number | 'dot'>;
	icon: ReactNode;
	id: string;
	isExpanded: boolean;
	onClick?: () => void;
}

const SideNavigationItem = ({
	active = false,
	badges,
	icon,
	id,
	isExpanded,
	onClick,
}: SideNavigationItemProps) => {
	const { t } = useTranslation();
	const { resetAppointmentTab } = useAppointmentTabStore();

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
		resetAppointmentTab();
	}

	return (
		<button
			onClick={handleClick}
			className={cn(
				'h-[42px] rounded-[10px] relative overflow-visible',
				'transition-[width,background-color] duration-500 ease-in-out',
				isExpanded ? 'w-60' : 'w-[42px]',
				active ? 'bg-primary-70' : 'bg-bg-white hover:bg-bg-disabled',
			)}
		>
			<div className="absolute inset-0 py-[9px] px-[9px] flex items-center justify-between overflow-hidden">
				<div className="flex items-center gap-2 flex-shrink-0">
					<div className={cn('w-6 h-6', active && 'brightness-0 invert')}>{icon}</div>
					<div
						className={cn(
							'text-16 font-medium font-pretendard whitespace-nowrap',
							'transition-opacity duration-500 ease-in-out',
							isExpanded ? 'opacity-100' : 'opacity-0',
							active ? 'text-text-0' : 'text-text-100',
						)}
					>
						{t(`menu.${id}`)}
					</div>
				</div>
				{badges && badges.length > 0 && (
					<div
						className={cn(
							'flex items-center gap-2 flex-shrink-0 transition-opacity duration-500 ease-in-out',
							isExpanded ? 'opacity-100' : 'opacity-0',
						)}
					>
						{badges.map((badge, badgeIndex) => (
							<NumberBadge key={badgeIndex} count={badge} color="red" />
						))}
					</div>
				)}
			</div>
			{/* Dot badge outside the overflow-hidden container */}
			{badges && badges.length > 0 && !isExpanded && (
				<NumberBadge count="dot" color="red" className="absolute -top-1 -right-1 z-[100]" />
			)}
		</button>
	);
}

export default SideNavigationItem;
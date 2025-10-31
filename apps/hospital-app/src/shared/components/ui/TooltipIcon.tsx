import { Tooltip } from './Tooltip';
import helpIcon from '@/shared/assets/icons/btn_circle_help.svg';
import helpIconBlue from '@/shared/assets/icons/btn_circle_help_blue.svg';
import { type ReactNode } from 'react';

interface TooltipIconProps {
	content: ReactNode;
	title?: string;
	position?: 'top' | 'bottom' | 'left' | 'right';
}

export function TooltipIcon({ content, title, position = 'bottom' }: TooltipIconProps) {
	return (
		<Tooltip content={content} title={title} position={position}>
			{({ isOpen }) => (
				<button className="flex items-center justify-center">
					{isOpen ? (
						<img alt="Help icon blue" className="h-5 w-5" src={helpIconBlue} />
					) : (
						<img alt="Help icon" className="h-5 w-5" src={helpIcon} />
					)}
				</button>
			)}
		</Tooltip>
	);
}

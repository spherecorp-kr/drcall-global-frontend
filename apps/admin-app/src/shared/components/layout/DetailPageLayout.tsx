import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface Props {
	children: ReactNode;
	className?: string;
}

const DetailPageLayout = ({ children, className }: Props) => {
	return <div className={cn('flex flex-col h-full', className)}>{children}</div>;
};

export default DetailPageLayout;
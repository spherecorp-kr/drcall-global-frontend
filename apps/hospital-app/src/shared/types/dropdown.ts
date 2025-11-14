import type { ReactNode } from 'react';

export interface DropdownOption {
	label: string | ReactNode;
	value: string;
}

export interface DropdownProps {
	buttonClassName?: string;
	className?: string;
	menuClassName?: string;
	onChange?: (value: string) => void;
	optionClassName?: string;
	options: DropdownOption[];
	placeholder?: string;
	value?: string;
	variant?: 'default' | 'navigation';
	error?: boolean;
}

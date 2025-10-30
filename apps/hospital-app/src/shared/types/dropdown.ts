export interface DropdownOption {
	label: string;
	value: string;
}

export interface DropdownProps {
	className?: string;
	menuClassName?: string;
	onChange?: (value: string) => void;
	options: DropdownOption[];
	placeholder?: string;
	value?: string;
	variant?: 'default' | 'navigation';
}

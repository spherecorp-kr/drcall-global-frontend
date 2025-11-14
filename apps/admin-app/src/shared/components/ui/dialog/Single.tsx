import type { BottomButtonProps } from '@/shared/types/dialog';
import { Button } from '@/shared/components/ui';

const Single = ({ disabled, onClick, text }: BottomButtonProps) => {
	return (
		<Button
			className="font-semibold h-[4.375rem] rounded-b-[0.625rem] rounded-t-none text-white text-xl w-full"
			disabled={disabled} onClick={onClick}>{text}</Button>
	);
};

export default Single;
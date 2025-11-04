import type { BottomDoubleButtonProps } from '@/shared/types/dialog';

const Double = ({ actions }: BottomDoubleButtonProps) => {
	return (
		<div className='flex items-center justify-center w-full'>
			<button
				className='bg-text-30 flex-1 font-semibold h-[4.375rem] rounded-bl-[0.625rem] text-white text-xl'
				disabled={actions[0].disabled}
				onClick={actions[0].onClick}>{actions[0].text}</button>
			<button
				className='active:bg-primary-90 bg-primary-70 disabled:!bg-primary-30 flex-1 font-semibold h-[4.375rem] hover:bg-primary-80 rounded-br-[0.625rem] text-white text-xl'
				disabled={actions[1].disabled}
				onClick={actions[1].onClick}>{actions[1].text}</button>
		</div>
	);
};

export default Double;
import type { MonthlyPhrItem } from '@/shared/types/phr';
import { formatDDMMYYYY } from '@/shared/utils/commonScripts';
import btnExpand from '@/assets/icons/btn_expand.png';
import btnFold from '@/assets/icons/btn_fold.png';

interface Props extends MonthlyPhrItem {
	isVisible: boolean;
}

const MonthlyTitle = ({ isVisible, startDate, endDate, weekOfMonth }: Props) => {
	return (
		<div className='flex h-12 items-center justify-between'>
			<span className='font-medium text-text-100'>{`${weekOfMonth}W (${formatDDMMYYYY(new Date(startDate))} ~ ${formatDDMMYYYY(new Date(endDate))})`}</span>
			<img alt='toggle' className='h-[1.375rem] w-[1.375rem]' src={isVisible ? btnFold : btnExpand} />
		</div>
	);
};

export default MonthlyTitle;
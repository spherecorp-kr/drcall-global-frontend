import { formatDDMMYYYY } from '@/shared/utils/commonScripts';
import btnExpand from '@/assets/icons/btn_expand.png';
import btnFold from '@/assets/icons/btn_fold.png';

interface Props {
	isVisible: boolean;
	itemDate: string;
	todayText: string;
}

const WeeklyTitle = ({ isVisible, itemDate, todayText }: Props) => {
	const DMY_TODAY: string = formatDDMMYYYY(new Date()); // 오늘 날짜의 dd/mm/yyyy 형식
	const dmyDate: string = formatDDMMYYYY(new Date(itemDate));

	return (
		<div className='flex items-center justify-between'>
			<span className='text-100 text-h6'>{DMY_TODAY === dmyDate ? `${todayText} (${dmyDate})` : dmyDate}</span>
			<img alt='toggle' className='h-[1.375rem] w-[1.375rem]' src={isVisible ? btnFold : btnExpand} />
		</div>
	);
};

export default WeeklyTitle;
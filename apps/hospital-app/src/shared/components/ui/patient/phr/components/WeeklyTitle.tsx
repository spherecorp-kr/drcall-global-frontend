import { useMemo } from 'react';
import { formatDDMMYYYY } from '@/shared/utils/commonScripts';
import btnExpand from '@/assets/icons/btn_expand.png';
import btnFold from '@/assets/icons/btn_fold.png';
import { useTranslation } from 'react-i18next';

interface Props {
	isVisible: boolean;
	itemDate: string;
}

const DMY_TODAY: string = formatDDMMYYYY(new Date()); // 오늘 날짜의 dd/mm/yyyy 형식

const WeeklyTitle = ({ isVisible, itemDate }: Props) => {
	const { t } = useTranslation();
	const dmyDate = useMemo(() => formatDDMMYYYY(new Date(itemDate)), [itemDate]);

	return (
		<div className='flex h-12 items-center justify-between'>
			<span className='font-medium text-text-100'>{DMY_TODAY === dmyDate ? `${t('chat.today')} (${dmyDate})` : dmyDate}</span>
			<img alt='toggle' className='h-[1.375rem] w-[1.375rem]' src={isVisible ? btnFold : btnExpand} />
		</div>
	);
};

export default WeeklyTitle;
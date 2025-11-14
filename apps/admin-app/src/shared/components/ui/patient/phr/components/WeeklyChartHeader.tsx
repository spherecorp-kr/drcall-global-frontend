import { useEffect, useState } from 'react';
import { formatDDMM } from '@/shared/utils/commonScripts';
import { usePhrChartStore } from '@/shared/store/phrChartStore';

interface Props {
	endDate: string;
	startDate: string;
}

const WeeklyChartHeader = ({ endDate, startDate }: Props) => {
	const { goNextWeek, goPrevWeek } = usePhrChartStore();

	const [last, setLast] = useState(true);

	useEffect(() => {
		const todayYMD: number = new Date().getTime();
		const startDateYMD: number = new Date(startDate).getTime();
		const endDateYMD: number = new Date(endDate).getTime();
		setLast(startDateYMD <= todayYMD && todayYMD <= endDateYMD);
	}, [endDate, startDate]);

	return (
		<div className="flex gap-7 items-center justify-center">
			<button className="h-6 w-6" onClick={goPrevWeek}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<path
						d="M15 19L7.92893 11.9289L15 4.85786"
						stroke="#E0E0E0"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M15 19L7.92893 11.9289L15 4.85786"
						stroke="#1F1F1F"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
			<p className="font-semibold text-text-100">{formatDDMM(startDate)} ~ {formatDDMM(endDate)}</p>
			<button className="h-6 w-6" onClick={last ? undefined : goNextWeek}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<path
						d="M10 19L17.071 11.9289L10 4.85781"
						stroke={last ? '#1F1F1F' : '#E0E0E0'}
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M10 19L17.071 11.9289L10 4.85781"
						stroke={last ? '#E0E0E0' : '#1F1F1F'}
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		</div>
	);
};

export default WeeklyChartHeader;
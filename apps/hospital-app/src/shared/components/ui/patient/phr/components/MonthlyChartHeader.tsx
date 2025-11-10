import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhrChartStore } from '@/shared/store/phrChartStore';

interface Props {
	year: number;
	month: number;
	monthName: string;
}

const MonthlyChartHeader = ({ year, month, monthName }: Props) => {
	const { t } = useTranslation();

	const { goNextMonth, goPrevMonth } = usePhrChartStore();

	const [last, setLast] = useState(true);

	useEffect(() => {
		const now = new Date();
		setLast(now.getFullYear() === year && now.getMonth() + 1 === month);
	}, [month, year]);

	return (
		<div className="flex gap-7 items-center justify-center">
			<button className="h-6 w-6" onClick={goPrevMonth}>
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
			<p className="font-semibold text-text-100">{t(`phr.lbl.${monthName}`)}</p>
			<button className="h-6 w-6" onClick={last ? undefined : goNextMonth}>
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

export default MonthlyChartHeader;
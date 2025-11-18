import type { PhrType } from '@/shared/types/phr';
import { type JSX, useEffect, useState } from 'react';
import {
	sampleWeeklyPressureData,
	sampleWeeklySugarData,
	sampleWeeklyTempData,
	sampleWeeklyWeightData,
	WeeklyPressure,
	WeeklySugar,
	WeeklyTemp,
	WeeklyWeight,
} from '@/shared/components/ui/patient/phr/week';
import { usePhrChartStore } from '@/shared/store/phrChartStore';

interface Props {
	patientkey: number;
	phrType: PhrType;
}

const Weekly = ({ patientkey, phrType }: Props) => {
	const { searchDate } = usePhrChartStore();

	const [content, setContent] = useState<JSX.Element | null>(null);

	useEffect(() => {
		const f = setTimeout(() => {
			// 현재 날짜의 요일을 구함 (0: 일요일, 1: 월요일, ..., 6: 토요일)
			const currentDay = searchDate.getDay();

			// 해당 주의 월요일 구하기
			const monday = new Date(searchDate);
			monday.setDate(searchDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

			// 해당 주의 일요일 구하기
			const sunday = new Date(searchDate);
			sunday.setDate(searchDate.getDate() + (currentDay === 0 ? 0 : 7 - currentDay));

			console.log(patientkey);

			// TODO 월요일을 시작 날짜, 일요일을 끝 날짜로 지정. API에 맞춰 날짜 포맷. API 조회 후 setContent
			switch (phrType) {
				case 'weight':
					setContent(<WeeklyWeight {...sampleWeeklyWeightData} />);
					break;
				case 'pressure':
					setContent(<WeeklyPressure {...sampleWeeklyPressureData} />);
					break;
				case 'sugar':
					setContent(<WeeklySugar {...sampleWeeklySugarData} />);
					break;
				case 'temp':
					setContent(<WeeklyTemp {...sampleWeeklyTempData} />);
					break;
			}
		}, 100);

		return () => {
			clearTimeout(f);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchDate]);

	return <>{content}</>;
};

export default Weekly;
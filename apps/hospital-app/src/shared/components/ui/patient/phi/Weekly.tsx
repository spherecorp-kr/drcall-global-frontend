import type { PhrType } from '@/shared/types/phr';
import { type JSX, useEffect, useState } from 'react';
import { WeeklyWeight } from '@/shared/components/ui/patient/phi/week';

interface Props {
	patientkey: number;
	phrType: PhrType;
}

const sampleWeightData = [
	{
		date: '2025-01-13',
		day: '월',
		height: 170,
		weight: 70,
		bmi: 24.2,
		infos: [
			{ time: '09:00', height: 170, weight: 70.5, bmi: 24.4 },
			{ time: '18:00', height: 170, weight: 70.2, bmi: 24.3 }
		]
	},
	{
		date: '2025-01-14',
		day: '화',
		height: 170,
		weight: 69.8,
		bmi: 24.2,
		infos: [
			{ time: '09:00', height: 170, weight: 69.8, bmi: 24.2 }
		]
	},
	{
		date: '2025-01-15',
		day: '수',
		height: 170,
		weight: 70.1,
		bmi: 24.3,
		infos: [
			{ time: '08:30', height: 170, weight: 70.1, bmi: 24.3 },
			{ time: '19:00', height: 170, weight: 70.0, bmi: 24.2 }
		]
	},
	{
		date: '2025-01-16',
		day: '목',
		height: 170,
		weight: 69.5,
		bmi: 24.1,
		infos: [
			{ time: '09:00', height: 170, weight: 69.5, bmi: 24.1 }
		]
	},
	{
		date: '2025-01-17',
		day: '금',
		height: 170,
		weight: 69.9,
		bmi: 24.2,
		infos: [
			{ time: '08:00', height: 170, weight: 69.9, bmi: 24.2 },
			{ time: '17:30', height: 170, weight: 69.7, bmi: 24.1 }
		]
	},
	{
		date: '2025-01-18',
		day: '토',
		height: 170,
		weight: null,
		bmi: null,
		infos: null
	},
	{
		date: '2025-01-19',
		day: '일',
		height: 170,
		weight: 70.3,
		bmi: 24.3,
		infos: [
			{ time: '10:00', height: 170, weight: 70.3, bmi: 24.3 }
		]
	}
];

const searchDate = new Date(); // FIXME 임시로 오늘 날짜로 고정

const Weekly = ({ patientkey, phrType }: Props) => {
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
					setContent(<WeeklyWeight items={sampleWeightData} />);
					break;
				case 'pressure':
					break;
				case 'sugar':
					break;
				case 'temp':
					break;
			}
		}, 100);

		return () => {
			clearTimeout(f);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <>{content}</>;
};

export default Weekly;
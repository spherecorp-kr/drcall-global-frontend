import { type JSX, useEffect, useState } from 'react';
import type { PhrType } from '@/shared/types/phr';
import {
	MonthlyPressure,
	MonthlySugar,
	MonthlyTemp,
	MonthlyWeight,
} from '@/shared/components/ui/patient/phr/month';
import { usePhrChartStore } from '@/shared/store/phrChartStore';
import {
	mockMonthlyPressureData,
	mockMonthlySugarData,
	mockMonthlyTempData,
	mockMonthlyWeightData,
} from '@/mocks/monthlyPhrData';

interface Props {
	patientkey: number;
	phrType: PhrType;
}

const Monthly = ({ patientkey, phrType }: Props) => {
	const { searchDate } = usePhrChartStore();
	const [content, setContent] = useState<JSX.Element | null>(null);

	useEffect(() => {
		const f = setTimeout(() => {
			console.log(patientkey);

			// TODO 월요일을 시작 날짜, 일요일을 끝 날짜로 지정. API에 맞춰 날짜 포맷. API 조회 후 setContent
			switch (phrType) {
				case 'weight':
					setContent(<MonthlyWeight {...mockMonthlyWeightData} />);
					break;
				case 'pressure':
					setContent(<MonthlyPressure {...mockMonthlyPressureData} />);
					break;
				case 'sugar':
					setContent(<MonthlySugar {...mockMonthlySugarData} />);
					break;
				case 'temp':
					setContent(<MonthlyTemp {...mockMonthlyTempData} />);
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

export default Monthly;
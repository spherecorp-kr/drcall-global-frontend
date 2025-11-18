import type {
	MonthlyPressurePhrResponse,
	MonthlySugarPhrResponse,
	MonthlyTempPhrResponse,
	MonthlyWeightPhrResponse,
} from '@/shared/types/phr.ts';

export { default as MonthlyPressure } from './BloodPressure';
export { default as MonthlySugar } from './BloodSugar';
export { default as MonthlyTemp } from './Temperature';
export { default as MonthlyWeight } from './Weight';

// 월간 체중 샘플 데이터
export const sampleMonthlyWeightData: MonthlyWeightPhrResponse = {
	period: {
		year: 2025,
		month: 1,
		monthName: 'm01',
		averageHeight: 170,
		averageWeight: 69.85,
		averageBmi: 24.2
	},
	items: [
		{
			weekOfMonth: 1,
			startDate: '2025-01-01',
			endDate: '2025-01-05',
			height: 170,
			weight: 70.2,
			bmi: 24.3,
			infos: [
				{ date: '2025-01-01', day: 'wed', height: 170, weight: 70.5, bmi: 24.4 },
				{ date: '2025-01-03', day: 'fri', height: 170, weight: 70.0, bmi: 24.2 },
				{ date: '2025-01-05', day: 'sun', height: 170, weight: 70.1, bmi: 24.3 }
			]
		},
		{
			weekOfMonth: 2,
			startDate: '2025-01-06',
			endDate: '2025-01-12',
			height: 170,
			weight: 69.8,
			bmi: 24.2,
			infos: [
				{ date: '2025-01-07', day: 'tue', height: 170, weight: 69.9, bmi: 24.2 },
				{ date: '2025-01-09', day: 'thu', height: 170, weight: 69.7, bmi: 24.1 },
				{ date: '2025-01-11', day: 'sat', height: 170, weight: 69.8, bmi: 24.2 }
			]
		},
		{
			weekOfMonth: 3,
			startDate: '2025-01-13',
			endDate: '2025-01-19',
			height: 170,
			weight: 69.9,
			bmi: 24.2,
			infos: [
				{ date: '2025-01-13', day: 'mon', height: 170, weight: 70.0, bmi: 24.2 },
				{ date: '2025-01-15', day: 'wed', height: 170, weight: 69.8, bmi: 24.2 },
				{ date: '2025-01-17', day: 'fri', height: 170, weight: 69.9, bmi: 24.2 }
			]
		},
		{
			weekOfMonth: 4,
			startDate: '2025-01-20',
			endDate: '2025-01-26',
			height: 170,
			weight: 69.6,
			bmi: 24.1,
			infos: [
				{ date: '2025-01-21', day: 'tue', height: 170, weight: 69.7, bmi: 24.1 },
				{ date: '2025-01-23', day: 'thu', height: 170, weight: 69.5, bmi: 24.1 },
				{ date: '2025-01-25', day: 'sat', height: 170, weight: 69.6, bmi: 24.1 }
			]
		},
		{
			weekOfMonth: 5,
			startDate: '2025-01-27',
			endDate: '2025-01-31',
			height: 170,
			weight: 69.8,
			bmi: 24.2,
			infos: [
				{ date: '2025-01-28', day: 'tue', height: 170, weight: 69.9, bmi: 24.2 },
				{ date: '2025-01-30', day: 'thu', height: 170, weight: 69.7, bmi: 24.1 }
			]
		}
	]
};

// 월간 혈압 샘플 데이터
export const sampleMonthlyPressureData: MonthlyPressurePhrResponse = {
	period: {
		year: 2025,
		month: 1,
		monthName: 'm01',
		averageSystolic: 120.3,
		averageDiastolic: 78.5,
		averagePulse: 72.2
	},
	items: [
		{
			weekOfMonth: 1,
			startDate: '2025-01-01',
			endDate: '2025-01-05',
			systolic: 121,
			diastolic: 79,
			pulse: 73,
			infos: [
				{ date: '2025-01-01', day: 'wed', systolic: 122, diastolic: 80, pulse: 74 },
				{ date: '2025-01-03', day: 'fri', systolic: 120, diastolic: 78, pulse: 72 },
				{ date: '2025-01-05', day: 'sun', systolic: 121, diastolic: 79, pulse: 73 }
			]
		},
		{
			weekOfMonth: 2,
			startDate: '2025-01-06',
			endDate: '2025-01-12',
			systolic: 120,
			diastolic: 78,
			pulse: 72,
			infos: [
				{ date: '2025-01-07', day: 'tue', systolic: 120, diastolic: 78, pulse: 72 },
				{ date: '2025-01-09', day: 'thu', systolic: 119, diastolic: 77, pulse: 71 },
				{ date: '2025-01-11', day: 'sat', systolic: 121, diastolic: 79, pulse: 73 }
			]
		},
		{
			weekOfMonth: 3,
			startDate: '2025-01-13',
			endDate: '2025-01-19',
			systolic: 120,
			diastolic: 79,
			pulse: 72,
			infos: [
				{ date: '2025-01-13', day: 'mon', systolic: 120, diastolic: 80, pulse: 72 },
				{ date: '2025-01-15', day: 'wed', systolic: 119, diastolic: 77, pulse: 71 },
				{ date: '2025-01-17', day: 'fri', systolic: 121, diastolic: 80, pulse: 73 }
			]
		},
		{
			weekOfMonth: 4,
			startDate: '2025-01-20',
			endDate: '2025-01-26',
			systolic: 120,
			diastolic: 78,
			pulse: 72,
			infos: [
				{ date: '2025-01-21', day: 'tue', systolic: 120, diastolic: 78, pulse: 72 },
				{ date: '2025-01-23', day: 'thu', systolic: 119, diastolic: 77, pulse: 71 },
				{ date: '2025-01-25', day: 'sat', systolic: 121, diastolic: 79, pulse: 73 }
			]
		},
		{
			weekOfMonth: 5,
			startDate: '2025-01-27',
			endDate: '2025-01-31',
			systolic: 121,
			diastolic: 79,
			pulse: 73,
			infos: [
				{ date: '2025-01-28', day: 'tue', systolic: 121, diastolic: 79, pulse: 73 },
				{ date: '2025-01-30', day: 'thu', systolic: 120, diastolic: 78, pulse: 72 }
			]
		}
	]
};

// 월간 혈당 샘플 데이터
export const sampleMonthlySugarData: MonthlySugarPhrResponse = {
	period: {
		year: 2025,
		month: 1,
		monthName: 'm01',
		morning: { before: 95.8, after: 135.5 },
		lunch: { before: 98.5, after: 142.3 },
		dinner: { before: 97.9, after: 138.7 },
		bedtime: 102.1
	},
	items: [
		{
			weekOfMonth: 1,
			startDate: '2025-01-01',
			endDate: '2025-01-05',
			morning: { before: 96, after: 136 },
			lunch: { before: 99, after: 143 },
			dinner: { before: 98, after: 139 },
			bedtime: 102,
			beforeMeals: { morning: 96, lunch: 99, dinner: 98 },
			afterMeals: { morning: 136, lunch: 143, dinner: 139 }
		},
		{
			weekOfMonth: 2,
			startDate: '2025-01-06',
			endDate: '2025-01-12',
			morning: { before: 95, after: 135 },
			lunch: { before: 98, after: 142 },
			dinner: { before: 97, after: 138 },
			bedtime: 101,
			beforeMeals: { morning: 95, lunch: 98, dinner: 97 },
			afterMeals: { morning: 135, lunch: 142, dinner: 138 }
		},
		{
			weekOfMonth: 3,
			startDate: '2025-01-13',
			endDate: '2025-01-19',
			morning: { before: 96, after: 136 },
			lunch: { before: 99, after: 143 },
			dinner: { before: 98, after: 139 },
			bedtime: 102,
			beforeMeals: { morning: 96, lunch: 99, dinner: 98 },
			afterMeals: { morning: 136, lunch: 143, dinner: 139 }
		},
		{
			weekOfMonth: 4,
			startDate: '2025-01-20',
			endDate: '2025-01-26',
			morning: { before: 95, after: 135 },
			lunch: { before: 98, after: 142 },
			dinner: { before: 97, after: 138 },
			bedtime: 102,
			beforeMeals: { morning: 95, lunch: 98, dinner: 97 },
			afterMeals: { morning: 135, lunch: 142, dinner: 138 }
		},
		{
			weekOfMonth: 5,
			startDate: '2025-01-27',
			endDate: '2025-01-31',
			morning: { before: 96, after: 136 },
			lunch: { before: 99, after: 143 },
			dinner: { before: 98, after: 139 },
			bedtime: 103,
			beforeMeals: { morning: 96, lunch: 99, dinner: 98 },
			afterMeals: { morning: 136, lunch: 143, dinner: 139 }
		}
	]
};

// 월간 체온 샘플 데이터
export const sampleMonthlyTempData: MonthlyTempPhrResponse = {
	period: {
		year: 2025,
		month: 1,
		monthName: 'm01',
		averageTemperature: 36.58
	},
	items: [
		{
			weekOfMonth: 1,
			startDate: '2025-01-01',
			endDate: '2025-01-05',
			temperature: 36.6,
			infos: [
				{ date: '2025-01-01', day: 'wed', temperature: 36.6 },
				{ date: '2025-01-03', day: 'fri', temperature: 36.5 },
				{ date: '2025-01-05', day: 'sun', temperature: 36.7 }
			]
		},
		{
			weekOfMonth: 2,
			startDate: '2025-01-06',
			endDate: '2025-01-12',
			temperature: 36.5,
			infos: [
				{ date: '2025-01-07', day: 'tue', temperature: 36.5 },
				{ date: '2025-01-09', day: 'thu', temperature: 36.4 },
				{ date: '2025-01-11', day: 'sat', temperature: 36.6 }
			]
		},
		{
			weekOfMonth: 3,
			startDate: '2025-01-13',
			endDate: '2025-01-19',
			temperature: 36.6,
			infos: [
				{ date: '2025-01-13', day: 'mon', temperature: 36.5 },
				{ date: '2025-01-15', day: 'wed', temperature: 36.6 },
				{ date: '2025-01-17', day: 'fri', temperature: 36.7 }
			]
		},
		{
			weekOfMonth: 4,
			startDate: '2025-01-20',
			endDate: '2025-01-26',
			temperature: 36.5,
			infos: [
				{ date: '2025-01-21', day: 'tue', temperature: 36.5 },
				{ date: '2025-01-23', day: 'thu', temperature: 36.4 },
				{ date: '2025-01-25', day: 'sat', temperature: 36.6 }
			]
		},
		{
			weekOfMonth: 5,
			startDate: '2025-01-27',
			endDate: '2025-01-31',
			temperature: 36.6,
			infos: [
				{ date: '2025-01-28', day: 'tue', temperature: 36.6 },
				{ date: '2025-01-30', day: 'thu', temperature: 36.5 }
			]
		}
	]
};
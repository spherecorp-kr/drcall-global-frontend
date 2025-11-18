import type {
	WeeklyPressurePhrResponse,
	WeeklySugarPhrResponse,
	WeeklyTempPhrResponse,
	WeeklyWeightPhrResponse,
} from '@/shared/types/phr';

// 주간 체중 샘플 데이터
export const mockWeeklyWeightData: WeeklyWeightPhrResponse = {
	period: {
		startDate: '2025-11-03',
		endDate: '2025-11-09',
		averageHeight: null,
		averageWeight: null,
		averageBmi: null
	},
	items: [
		{
			date: '2025-11-03',
			day: 'mon',
			height: null,
			weight: null,
			bmi: null,
			infos: null
		},
		{
			date: '2025-11-04',
			day: 'tue',
			height: null,
			weight: null,
			bmi: null,
			infos: null
		},
		{
			date: '2025-11-05',
			day: 'wed',
			height: null,
			weight: null,
			bmi: null,
			infos: null
		},
		{
			date: '2025-11-06',
			day: 'thu',
			height: null,
			weight: null,
			bmi: null,
			infos: null
		},
		{
			date: '2025-11-07',
			day: 'fri',
			height: null,
			weight: null,
			bmi: null,
			infos: null
		},
		{
			date: '2025-11-08',
			day: 'sat',
			height: null,
			weight: null,
			bmi: null,
			infos: null
		},
		{
			date: '2025-11-09',
			day: 'sun',
			height: null,
			weight: null,
			bmi: null,
			infos: null
		}
	]
};

// 주간 혈압 샘플 데이터
export const mockWeeklyPressureData: WeeklyPressurePhrResponse = {
	period: {
		startDate: '2025-01-13',
		endDate: '2025-01-19',
		averageSystolic: 120.5,
		averageDiastolic: 78.3,
		averagePulse: 72.1
	},
	items: [
		{
			date: '2025-01-13',
			day: 'mon',
			systolic: 120,
			diastolic: 80,
			pulse: 72,
			infos: [
				{ time: '08:00', systolic: 120, diastolic: 80, pulse: 72 },
				{ time: '20:00', systolic: 118, diastolic: 78, pulse: 70 }
			]
		},
		{
			date: '2025-01-14',
			day: 'tue',
			systolic: 122,
			diastolic: 79,
			pulse: 73,
			infos: [
				{ time: '08:00', systolic: 122, diastolic: 79, pulse: 73 }
			]
		},
		{
			date: '2025-01-15',
			day: 'wed',
			systolic: 119,
			diastolic: 77,
			pulse: 71,
			infos: [
				{ time: '07:30', systolic: 119, diastolic: 77, pulse: 71 },
				{ time: '19:30', systolic: 121, diastolic: 78, pulse: 72 }
			]
		},
		{
			date: '2025-01-16',
			day: 'thu',
			systolic: 123,
			diastolic: 81,
			pulse: 74,
			infos: [
				{ time: '08:00', systolic: 123, diastolic: 81, pulse: 74 }
			]
		},
		{
			date: '2025-01-17',
			day: 'fri',
			systolic: 118,
			diastolic: 76,
			pulse: 70,
			infos: [
				{ time: '08:00', systolic: 118, diastolic: 76, pulse: 70 },
				{ time: '20:00', systolic: 120, diastolic: 78, pulse: 72 }
			]
		},
		{
			date: '2025-01-18',
			day: 'sat',
			systolic: null,
			diastolic: null,
			pulse: null,
			infos: null
		},
		{
			date: '2025-01-19',
			day: 'sun',
			systolic: 121,
			diastolic: 79,
			pulse: 73,
			infos: [
				{ time: '09:00', systolic: 121, diastolic: 79, pulse: 73 }
			]
		}
	]
};

// 주간 혈당 샘플 데이터
export const mockWeeklySugarData: WeeklySugarPhrResponse = {
	period: {
		startDate: '2025-01-13',
		endDate: '2025-01-19',
		morning: { before: 95.5, after: 135.2 },
		lunch: { before: 98.3, after: 142.1 },
		dinner: { before: 97.8, after: 138.5 },
		bedtime: 102.3
	},
	items: [
		{
			date: '2025-01-13',
			day: 'mon',
			morning: { before: 95, after: 135 },
			lunch: { before: 98, after: 142 },
			dinner: { before: 98, after: 139 },
			bedtime: 102,
			infos: [
				{ time: '07:00', type: 1, typeName: 'mnbm', glucose: 95 },
				{ time: '08:30', type: 2, typeName: 'mnam', glucose: 135 },
				{ time: '12:00', type: 3, typeName: 'lcbm', glucose: 98 },
				{ time: '13:30', type: 4, typeName: 'lcam', glucose: 142 },
				{ time: '18:00', type: 5, typeName: 'dnbm', glucose: 98 },
				{ time: '19:30', type: 6, typeName: 'dnam', glucose: 139 },
				{ time: '22:00', type: 7, typeName: 'bb', glucose: 102 }
			]
		},
		{
			date: '2025-01-14',
			day: 'tue',
			morning: { before: 96, after: 136 },
			lunch: { before: 99, after: 143 },
			dinner: { before: 97, after: 138 },
			bedtime: 101,
			infos: [
				{ time: '07:00', type: 1, typeName: 'mnbm', glucose: 96 },
				{ time: '08:30', type: 2, typeName: 'mnam', glucose: 136 },
				{ time: '12:00', type: 3, typeName: 'lcbm', glucose: 99 },
				{ time: '13:30', type: 4, typeName: 'lcam', glucose: 143 }
			]
		},
		{
			date: '2025-01-15',
			day: 'wed',
			morning: { before: 94, after: 134 },
			lunch: { before: 97, after: 141 },
			dinner: { before: 98, after: 139 },
			bedtime: 103,
			infos: [
				{ time: '07:00', type: 1, typeName: 'mnbm', glucose: 94 },
				{ time: '08:30', type: 2, typeName: 'mnam', glucose: 134 },
				{ time: '18:00', type: 5, typeName: 'dnbm', glucose: 98 },
				{ time: '19:30', type: 6, typeName: 'dnam', glucose: 139 },
				{ time: '22:00', type: 7, typeName: 'bb', glucose: 103 }
			]
		},
		{
			date: '2025-01-16',
			day: 'thu',
			morning: { before: 97, after: 137 },
			lunch: { before: 100, after: 144 },
			dinner: { before: 99, after: 140 },
			bedtime: 104,
			infos: [
				{ time: '07:00', type: 1, typeName: 'mnbm', glucose: 97 },
				{ time: '08:30', type: 2, typeName: 'mnam', glucose: 137 },
				{ time: '12:00', type: 3, typeName: 'lcbm', glucose: 100 },
				{ time: '13:30', type: 4, typeName: 'lcam', glucose: 144 }
			]
		},
		{
			date: '2025-01-17',
			day: 'fri',
			morning: { before: 95, after: 135 },
			lunch: { before: 98, after: 142 },
			dinner: { before: 97, after: 138 },
			bedtime: 102,
			infos: [
				{ time: '07:00', type: 1, typeName: 'mnbm', glucose: 95 },
				{ time: '08:30', type: 2, typeName: 'mnam', glucose: 135 },
				{ time: '18:00', type: 5, typeName: 'dnbm', glucose: 97 },
				{ time: '19:30', type: 6, typeName: 'dnam', glucose: 138 },
				{ time: '22:00', type: 7, typeName: 'bb', glucose: 102 }
			]
		},
		{
			date: '2025-01-18',
			day: 'sat',
			morning: { before: null, after: null },
			lunch: { before: null, after: null },
			dinner: { before: null, after: null },
			bedtime: null,
			infos: null
		},
		{
			date: '2025-01-19',
			day: 'sun',
			morning: { before: 96, after: 136 },
			lunch: { before: 99, after: 143 },
			dinner: { before: 98, after: 139 },
			bedtime: 101,
			infos: [
				{ time: '08:00', type: 1, typeName: 'mnbm', glucose: 96 },
				{ time: '09:30', type: 2, typeName: 'mnam', glucose: 136 },
				{ time: '22:00', type: 7, typeName: 'bb', glucose: 101 }
			]
		}
	]
};

// 주간 체온 샘플 데이터
export const mockWeeklyTempData: WeeklyTempPhrResponse = {
	period: {
		startDate: '2025-01-13',
		endDate: '2025-01-19',
		monthName: '1월',
		averageTemperature: 36.57
	},
	items: [
		{
			date: '2025-01-13',
			day: 'mon',
			temperature: 36.5,
			infos: [
				{ time: '08:00', temperature: 36.5 },
				{ time: '14:00', temperature: 36.6 },
				{ time: '20:00', temperature: 36.4 }
			]
		},
		{
			date: '2025-01-14',
			day: 'tue',
			temperature: 36.6,
			infos: [
				{ time: '08:00', temperature: 36.6 },
				{ time: '14:00', temperature: 36.7 }
			]
		},
		{
			date: '2025-01-15',
			day: 'wed',
			temperature: 36.5,
			infos: [
				{ time: '07:30', temperature: 36.5 },
				{ time: '14:00', temperature: 36.6 },
				{ time: '20:00', temperature: 36.4 }
			]
		},
		{
			date: '2025-01-16',
			day: 'thu',
			temperature: 36.7,
			infos: [
				{ time: '08:00', temperature: 36.7 },
				{ time: '14:00', temperature: 36.8 }
			]
		},
		{
			date: '2025-01-17',
			day: 'fri',
			temperature: 36.4,
			infos: [
				{ time: '08:00', temperature: 36.4 },
				{ time: '14:00', temperature: 36.5 },
				{ time: '20:00', temperature: 36.3 }
			]
		},
		{
			date: '2025-01-18',
			day: 'sat',
			temperature: null,
			infos: null
		},
		{
			date: '2025-01-19',
			day: 'sun',
			temperature: 36.6,
			infos: [
				{ time: '09:00', temperature: 36.6 },
				{ time: '15:00', temperature: 36.7 }
			]
		}
	]
};
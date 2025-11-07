export type PhrType = 'pressure' | 'sugar' | 'temp' | 'weight';

export interface PhrContentsProps {
	patientkey: number;
	phrType: PhrType;
}

export interface ChartLabelProps {
	x: number;
	y: number;
	value: string;
}

export interface XAxisTickProps {
	x: number;
	y: number;
	payload: {
		value: string;
	}
}

export interface VisiblePHRDetails {
	[key: number]: boolean;
}

export interface BloodPressurePhr {
	systolic: number; // 수축기 혈압
	diastolic: number; // 이완기 혈압
	pulse: number; // 맥박수
	lastRegDatetime: string;
}

export interface BloodSugarPhr {
	/* 순서대로
		아침 식전
		아침 식후
		점심 식전
		점심 식후
		저녁 식전
		저녁 식후
		취침 전
	*/
	measurementType: 'mnbm' | 'mnam' | 'lcbm' | 'lcam' | 'dnbm' | 'dnam' | 'bb';
	glucose: number;
	lastRegDatetime: string;
}

export interface TemperaturePhr {
	temperature: number;
	lastRegDatetime: string;
}

export interface WeightPhr {
	height: number;
	weight: number;
	bmi: number;
	lastRegDatetime: string;
}

// s PHR 공통 - 주
interface WeeklyPhrPeriod {
	startDate: string;
	endDate: string;
}

interface WeeklyPhrItem {
	date: string;
	day: string;
}

interface WeeklyPhrInfo {
	time: string;
}
// e PHR 공통 - 주

// s PHR 공통 - 월
interface MonthlyPhrPeriod {
	year: number;
	month: number;
	monthName: string;
}

export interface MonthlyPhrItem {
	weekOfMonth: number;
	startDate: string;
	endDate: string;
}
interface MonthlyPhrInfo {
	date: string;
	day: string;
}
// e PHR 공통 - 월

// s 혈당 - 공통
export interface SugarTime {
	before: number | null;
	after: number | null;
}
// e 혈당 - 공통

// s 혈당 - 주
export interface WeeklySugarPhrPeriod extends WeeklyPhrPeriod {
	morning: SugarTime;
	lunch: SugarTime;
	dinner: SugarTime;
	bedtime: number | null;
}

export interface WeeklySugarPhrInfo extends WeeklyPhrInfo {
	type: number;
	typeName: string;
	glucose: number | null;
}

export interface WeeklySugarPhrItem extends WeeklyPhrItem {
	morning: SugarTime;
	lunch: SugarTime;
	dinner: SugarTime;
	bedtime: number | null;
	infos: WeeklySugarPhrInfo[] | null;
}

export interface WeeklySugarPhrResponse {
	period: WeeklySugarPhrPeriod;
	items: WeeklySugarPhrItem[];
}
// e 혈당 - 주

// s 혈당 - 월
export interface MonthlySugarPhrPeriod extends MonthlyPhrPeriod {
	morning: SugarTime;
	lunch: SugarTime;
	dinner: SugarTime;
	bedtime: number | null;
}

export interface SugarMeal {
	morning: number | null;
	lunch: number | null;
	dinner: number | null;
}

export interface MonthlySugarPhrItem extends MonthlyPhrItem {
	morning: SugarTime;
	lunch: SugarTime;
	dinner: SugarTime;
	bedtime: number | null;
	beforeMeals: SugarMeal;
	afterMeals: SugarMeal;
}

export interface MonthlySugarPhrResponse {
	period: MonthlySugarPhrPeriod;
	items: MonthlySugarPhrItem[];
}
// e 혈당 - 월

// s 혈압 - 주
export interface WeeklyPressurePhrPeriod extends WeeklyPhrPeriod {
	averageSystolic: number | null;
	averageDiastolic: number | null;
	averagePulse: number | null;
}

export interface WeeklyPressurePhrInfo extends WeeklyPhrInfo {
	systolic: number | null;
	diastolic: number | null;
	pulse: number | null;
}

export interface WeeklyPressurePhrItem extends WeeklyPhrItem {
	systolic: number | null;
	diastolic: number | null;
	pulse: number | null;
	infos: WeeklyPressurePhrInfo[] | null;
}

export interface WeeklyPressurePhrResponse {
	period: WeeklyPressurePhrPeriod;
	items: WeeklyPressurePhrItem[];
}
// e 혈압 - 주

// s 혈압 - 월
export interface MonthlyPressurePhrPeriod extends MonthlyPhrPeriod {
	averageSystolic: number | null;
	averageDiastolic: number | null;
	averagePulse: number | null;
}

export interface MonthlyPressurePhrInfo extends MonthlyPhrInfo {
	systolic: number | null;
	diastolic: number | null;
	pulse: number | null;
}

export interface MonthlyPressurePhrItem extends MonthlyPhrItem {
	systolic: number | null;
	diastolic: number | null;
	pulse: number | null;
	infos: MonthlyPressurePhrInfo[] | null;
}

export interface MonthlyPressurePhrResponse {
	period: MonthlyPressurePhrPeriod;
	items: MonthlyPressurePhrItem[];
}
// e 혈압 - 월

// s 체온 - 주
export interface WeeklyTempPhrPeriod extends WeeklyPhrPeriod {
	monthName: string | null;
	averageTemperature: number | null;
}

export interface WeeklyTempPhrInfo extends WeeklyPhrInfo {
	temperature: number | null;
}

export interface WeeklyTempPhrItem extends WeeklyPhrItem {
	temperature: number | null;
	infos: WeeklyTempPhrInfo[] | null;
}

export interface WeeklyTempPhrResponse {
	period: WeeklyTempPhrPeriod;
	items: WeeklyTempPhrItem[];
}
// e 체온 - 주

// s 체온 - 월
export interface MonthlyTempPhrPeriod extends MonthlyPhrPeriod {
	averageTemperature: number | null;
}

export interface MonthlyTempPhrInfo extends MonthlyPhrInfo {
	temperature: number | null;
}

export interface MonthlyTempPhrItem extends MonthlyPhrItem {
	temperature: number | null;
	infos: MonthlyTempPhrInfo[] | null;
}

export interface MonthlyTempPhrResponse {
	period: MonthlyTempPhrPeriod;
	items: MonthlyTempPhrItem[];
}
// e 체온 - 월

// s 체중 - 주
export interface WeeklyWeightPhrPeriod extends WeeklyPhrPeriod {
	averageHeight: number | null;
	averageWeight: number | null;
	averageBmi: number | null;
}

export interface WeeklyWeightPhrInfo extends WeeklyPhrInfo {
	height: number | null;
	weight: number | null;
	bmi: number | null;
}

export interface WeeklyWeightPhrItem extends WeeklyPhrItem {
	height: number | null;
	weight: number | null;
	bmi: number | null;
	infos: WeeklyWeightPhrInfo[] | null;
}

export interface WeeklyWeightPhrResponse {
	period: WeeklyWeightPhrPeriod;
	items: WeeklyWeightPhrItem[];
}
// e 체중 - 주

// s 체중 - 월
export interface MonthlyWeightPhrPeriod extends MonthlyPhrPeriod {
	averageHeight: number | null;
	averageWeight: number | null;
	averageBmi: number | null;
}

export interface MonthlyWeightPhrInfo extends MonthlyPhrInfo {
	height: number | null;
	weight: number | null;
	bmi: number | null;
}

export interface MonthlyWeightPhrItem extends MonthlyPhrItem {
	height: number | null;
	weight: number | null;
	bmi: number | null;
	infos: MonthlyWeightPhrInfo[] | null;
}

export interface MonthlyWeightPhrResponse {
	period: MonthlyWeightPhrPeriod;
	items: MonthlyWeightPhrItem[];
}
// e 체중 - 월

export type PhrResponse =
	WeeklySugarPhrResponse |
	WeeklyPressurePhrResponse |
	WeeklyTempPhrResponse |
	WeeklyWeightPhrResponse |
	MonthlySugarPhrResponse |
	MonthlyPressurePhrResponse |
	MonthlyTempPhrResponse |
	MonthlyWeightPhrResponse
	;

export interface WeightData {
	day?: string;
	week?: string;
	weight: number | null;
}

export interface TemperatureData {
	day?: string;
	week?: string;
	temperature: number | null;
}

export interface PressureData {
	day?: string;
	week?: string;
	systolic: number | null;
	diastolic: number | null;
}

export interface SugarData {
	day?: string;
	week?: string;
	morning: SugarTime;
	lunch: SugarTime;
	dinner: SugarTime;
	bedtime: number | null;
}

export type SugarTiming = 'morning' | 'lunch' | 'dinner' | 'bedtime';
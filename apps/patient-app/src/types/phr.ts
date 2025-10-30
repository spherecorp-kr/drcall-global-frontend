// Personal Health Record (PHR) Types

export const HealthRecordType = {
  HEIGHT_WEIGHT: 'height_weight',
  BLOOD_PRESSURE: 'blood_pressure',
  BLOOD_SUGAR: 'blood_sugar',
  TEMPERATURE: 'temperature',
} as const;

export type HealthRecordType = typeof HealthRecordType[keyof typeof HealthRecordType];

export const BloodSugarMeasurementTime = {
  BEFORE_BREAKFAST: 'before_breakfast',
  AFTER_BREAKFAST: 'after_breakfast',
  BEFORE_LUNCH: 'before_lunch',
  AFTER_LUNCH: 'after_lunch',
  BEFORE_DINNER: 'before_dinner',
  AFTER_DINNER: 'after_dinner',
  BEFORE_SLEEP: 'before_sleep',
} as const;

export type BloodSugarMeasurementTime = typeof BloodSugarMeasurementTime[keyof typeof BloodSugarMeasurementTime];

// Base interface for all health records
export interface BaseHealthRecord {
  id: string;
  type: HealthRecordType;
  recordedAt: string; // ISO 8601 format
  createdAt: string;
  updatedAt: string;
}

// Height & Weight Record
export interface HeightWeightRecord extends BaseHealthRecord {
  type: 'height_weight';
  height: number; // cm
  weight: number; // kg
  bmi: number; // calculated
}

// Blood Pressure Record
export interface BloodPressureRecord extends BaseHealthRecord {
  type: 'blood_pressure';
  systolic: number; // mmHg (최고혈압)
  diastolic: number; // mmHg (최저혈압)
  heartRate: number; // BPM (심박수)
}

// Blood Sugar Record
export interface BloodSugarRecord extends BaseHealthRecord {
  type: 'blood_sugar';
  value: number; // mg/dL
  measurementTime: BloodSugarMeasurementTime;
}

// Temperature Record
export interface TemperatureRecord extends BaseHealthRecord {
  type: 'temperature';
  value: number; // °C
}

// Union type for all health records
export type HealthRecord =
  | HeightWeightRecord
  | BloodPressureRecord
  | BloodSugarRecord
  | TemperatureRecord;

// Latest records for dashboard
export interface LatestHealthRecords {
  heightWeight?: HeightWeightRecord;
  bloodPressure?: BloodPressureRecord;
  bloodSugar?: BloodSugarRecord;
  temperature?: TemperatureRecord;
}

// API Request types
export interface CreateHeightWeightRequest {
  recordedAt: string;
  height: number;
  weight: number;
}

export interface CreateBloodPressureRequest {
  recordedAt: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
}

export interface CreateBloodSugarRequest {
  recordedAt: string;
  value: number;
  measurementTime: BloodSugarMeasurementTime;
}

export interface CreateTemperatureRequest {
  recordedAt: string;
  value: number;
}

export type CreateHealthRecordRequest =
  | CreateHeightWeightRequest
  | CreateBloodPressureRequest
  | CreateBloodSugarRequest
  | CreateTemperatureRequest;

// API Response types
export interface GetHealthRecordsResponse {
  records: HealthRecord[];
  total: number;
  hasMore: boolean;
}

export interface GetLatestRecordsResponse {
  data: LatestHealthRecords;
}

// UI Helper types
export interface HealthRecordTypeInfo {
  type: HealthRecordType;
  title: string;
  icon: string;
  color: string;
  unit: string;
  route: string;
}

import type {
  HealthRecord,
  HeightWeightRecord,
  BloodPressureRecord,
  BloodSugarRecord,
  TemperatureRecord,
  LatestHealthRecords,
} from '@/types/phr';

// Helper function to generate mock dates
const generateMockDate = (daysAgo: number, hour = 12, minute = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

// Mock Height/Weight Records
export const mockHeightWeightRecords: HeightWeightRecord[] = [
  {
    id: 'hw-001',
    type: 'height_weight',
    height: 160,
    weight: 48,
    bmi: 18.75,
    recordedAt: generateMockDate(1, 7, 56),
    createdAt: generateMockDate(1, 7, 56),
    updatedAt: generateMockDate(1, 7, 56),
  },
  {
    id: 'hw-002',
    type: 'height_weight',
    height: 160,
    weight: 49,
    bmi: 19.14,
    recordedAt: generateMockDate(5, 8, 30),
    createdAt: generateMockDate(5, 8, 30),
    updatedAt: generateMockDate(5, 8, 30),
  },
  {
    id: 'hw-003',
    type: 'height_weight',
    height: 160,
    weight: 47.5,
    bmi: 18.55,
    recordedAt: generateMockDate(10, 9, 15),
    createdAt: generateMockDate(10, 9, 15),
    updatedAt: generateMockDate(10, 9, 15),
  },
];

// Mock Blood Pressure Records
export const mockBloodPressureRecords: BloodPressureRecord[] = [
  {
    id: 'bp-001',
    type: 'blood_pressure',
    systolic: 108,
    diastolic: 77,
    heartRate: 80,
    recordedAt: generateMockDate(0, 20, 45),
    createdAt: generateMockDate(0, 20, 45),
    updatedAt: generateMockDate(0, 20, 45),
  },
  {
    id: 'bp-002',
    type: 'blood_pressure',
    systolic: 88,
    diastolic: 54,
    heartRate: 80,
    recordedAt: generateMockDate(2, 20, 45),
    createdAt: generateMockDate(2, 20, 45),
    updatedAt: generateMockDate(2, 20, 45),
  },
  {
    id: 'bp-003',
    type: 'blood_pressure',
    systolic: 88,
    diastolic: 54,
    heartRate: 80,
    recordedAt: generateMockDate(4, 20, 45),
    createdAt: generateMockDate(4, 20, 45),
    updatedAt: generateMockDate(4, 20, 45),
  },
  {
    id: 'bp-004',
    type: 'blood_pressure',
    systolic: 88,
    diastolic: 54,
    heartRate: 80,
    recordedAt: generateMockDate(5, 20, 45),
    createdAt: generateMockDate(5, 20, 45),
    updatedAt: generateMockDate(5, 20, 45),
  },
  {
    id: 'bp-005',
    type: 'blood_pressure',
    systolic: 88,
    diastolic: 54,
    heartRate: 80,
    recordedAt: generateMockDate(5, 12, 45),
    createdAt: generateMockDate(5, 12, 45),
    updatedAt: generateMockDate(5, 12, 45),
  },
  {
    id: 'bp-006',
    type: 'blood_pressure',
    systolic: 88,
    diastolic: 54,
    heartRate: 80,
    recordedAt: generateMockDate(8, 12, 45),
    createdAt: generateMockDate(8, 12, 45),
    updatedAt: generateMockDate(8, 12, 45),
  },
  {
    id: 'bp-007',
    type: 'blood_pressure',
    systolic: 88,
    diastolic: 54,
    heartRate: 80,
    recordedAt: generateMockDate(10, 12, 45),
    createdAt: generateMockDate(10, 12, 45),
    updatedAt: generateMockDate(10, 12, 45),
  },
  {
    id: 'bp-008',
    type: 'blood_pressure',
    systolic: 88,
    diastolic: 54,
    heartRate: 80,
    recordedAt: generateMockDate(15, 12, 45),
    createdAt: generateMockDate(15, 12, 45),
    updatedAt: generateMockDate(15, 12, 45),
  },
];

// Mock Blood Sugar Records
export const mockBloodSugarRecords: BloodSugarRecord[] = [
  {
    id: 'bs-001',
    type: 'blood_sugar',
    value: 88,
    measurementTime: 'before_breakfast',
    recordedAt: generateMockDate(0, 20, 45),
    createdAt: generateMockDate(0, 20, 45),
    updatedAt: generateMockDate(0, 20, 45),
  },
  {
    id: 'bs-002',
    type: 'blood_sugar',
    value: 101,
    measurementTime: 'before_lunch',
    recordedAt: generateMockDate(2, 20, 45),
    createdAt: generateMockDate(2, 20, 45),
    updatedAt: generateMockDate(2, 20, 45),
  },
  {
    id: 'bs-003',
    type: 'blood_sugar',
    value: 136,
    measurementTime: 'before_dinner',
    recordedAt: generateMockDate(4, 20, 45),
    createdAt: generateMockDate(4, 20, 45),
    updatedAt: generateMockDate(4, 20, 45),
  },
  {
    id: 'bs-004',
    type: 'blood_sugar',
    value: 88,
    measurementTime: 'before_breakfast',
    recordedAt: generateMockDate(5, 20, 45),
    createdAt: generateMockDate(5, 20, 45),
    updatedAt: generateMockDate(5, 20, 45),
  },
  {
    id: 'bs-005',
    type: 'blood_sugar',
    value: 101,
    measurementTime: 'before_lunch',
    recordedAt: generateMockDate(5, 12, 45),
    createdAt: generateMockDate(5, 12, 45),
    updatedAt: generateMockDate(5, 12, 45),
  },
  {
    id: 'bs-006',
    type: 'blood_sugar',
    value: 136,
    measurementTime: 'before_dinner',
    recordedAt: generateMockDate(8, 12, 45),
    createdAt: generateMockDate(8, 12, 45),
    updatedAt: generateMockDate(8, 12, 45),
  },
  {
    id: 'bs-007',
    type: 'blood_sugar',
    value: 101,
    measurementTime: 'before_lunch',
    recordedAt: generateMockDate(10, 12, 45),
    createdAt: generateMockDate(10, 12, 45),
    updatedAt: generateMockDate(10, 12, 45),
  },
  {
    id: 'bs-008',
    type: 'blood_sugar',
    value: 136,
    measurementTime: 'before_dinner',
    recordedAt: generateMockDate(13, 12, 45),
    createdAt: generateMockDate(13, 12, 45),
    updatedAt: generateMockDate(13, 12, 45),
  },
  {
    id: 'bs-009',
    type: 'blood_sugar',
    value: 136,
    measurementTime: 'before_dinner',
    recordedAt: generateMockDate(25, 12, 45),
    createdAt: generateMockDate(25, 12, 45),
    updatedAt: generateMockDate(25, 12, 45),
  },
];

// Mock Temperature Records
export const mockTemperatureRecords: TemperatureRecord[] = [
  {
    id: 'temp-001',
    type: 'temperature',
    value: 35.4,
    recordedAt: generateMockDate(0, 20, 45),
    createdAt: generateMockDate(0, 20, 45),
    updatedAt: generateMockDate(0, 20, 45),
  },
  {
    id: 'temp-002',
    type: 'temperature',
    value: 37.8,
    recordedAt: generateMockDate(2, 20, 45),
    createdAt: generateMockDate(2, 20, 45),
    updatedAt: generateMockDate(2, 20, 45),
  },
  {
    id: 'temp-003',
    type: 'temperature',
    value: 38.5,
    recordedAt: generateMockDate(4, 20, 45),
    createdAt: generateMockDate(4, 20, 45),
    updatedAt: generateMockDate(4, 20, 45),
  },
  {
    id: 'temp-004',
    type: 'temperature',
    value: 35.2,
    recordedAt: generateMockDate(5, 20, 45),
    createdAt: generateMockDate(5, 20, 45),
    updatedAt: generateMockDate(5, 20, 45),
  },
  {
    id: 'temp-005',
    type: 'temperature',
    value: 35.2,
    recordedAt: generateMockDate(5, 12, 45),
    createdAt: generateMockDate(5, 12, 45),
    updatedAt: generateMockDate(5, 12, 45),
  },
  {
    id: 'temp-006',
    type: 'temperature',
    value: 35.2,
    recordedAt: generateMockDate(8, 12, 45),
    createdAt: generateMockDate(8, 12, 45),
    updatedAt: generateMockDate(8, 12, 45),
  },
  {
    id: 'temp-007',
    type: 'temperature',
    value: 35.2,
    recordedAt: generateMockDate(10, 12, 45),
    createdAt: generateMockDate(10, 12, 45),
    updatedAt: generateMockDate(10, 12, 45),
  },
  {
    id: 'temp-008',
    type: 'temperature',
    value: 35.2,
    recordedAt: generateMockDate(13, 12, 45),
    createdAt: generateMockDate(13, 12, 45),
    updatedAt: generateMockDate(13, 12, 45),
  },
  {
    id: 'temp-009',
    type: 'temperature',
    value: 35.2,
    recordedAt: generateMockDate(25, 12, 45),
    createdAt: generateMockDate(25, 12, 45),
    updatedAt: generateMockDate(25, 12, 45),
  },
];

// All mock records combined
export const mockAllHealthRecords: HealthRecord[] = [
  ...mockHeightWeightRecords,
  ...mockBloodPressureRecords,
  ...mockBloodSugarRecords,
  ...mockTemperatureRecords,
];

// Latest records for dashboard
export const mockLatestHealthRecords: LatestHealthRecords = {
  heightWeight: mockHeightWeightRecords[0],
  bloodPressure: mockBloodPressureRecords[0],
  bloodSugar: mockBloodSugarRecords[0],
  temperature: mockTemperatureRecords[0],
};

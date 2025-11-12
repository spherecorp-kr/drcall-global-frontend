// Patient Types

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BloodType = 'A' | 'B' | 'O' | 'AB';
export type AlcoholConsumption = '0' | '1~2' | '3+';
export type SmokingStatus = '0' | '1~5' | '6+';

export interface Patient {
  id: number;
  externalId: string;

  // Basic Info
  name: string;
  phone: string;
  phoneCountryCode: string;
  email?: string;
  status: string;

  // Personal Info
  dateOfBirth?: string; // ISO 8601 date string
  gender?: Gender;
  idCardNumber?: string;

  // Address
  countryCode?: string;
  address?: string;
  addressDetail?: string;
  postalCode?: string;
  googlePlaceId?: string;

  // Health Info
  height?: string;
  weight?: string;
  bloodType?: BloodType;
  alcoholConsumption?: AlcoholConsumption;
  smokingStatus?: SmokingStatus;
  currentMedications?: string;
  personalMedicalHistory?: string;
  familyMedicalHistory?: string;

  // Profile
  profileImageUrl?: string;
}

export interface UpdatePatientProfileRequest {
  // Basic Info
  name?: string;
  phone?: string;
  phoneCountryCode?: string;
  email?: string;

  // Personal Info
  dateOfBirth?: string; // ISO 8601 date string (YYYY-MM-DD)
  gender?: Gender;
  idCardNumber?: string;

  // Address
  countryCode?: string;
  address?: string;
  addressDetail?: string;
  postalCode?: string;
  googlePlaceId?: string;

  // Health Info
  height?: string;
  weight?: string;
  bloodType?: BloodType;
  alcoholConsumption?: AlcoholConsumption;
  smokingStatus?: SmokingStatus;
  currentMedications?: string;
  personalMedicalHistory?: string;
  familyMedicalHistory?: string;

  // Profile
  profileImageUrl?: string;
}

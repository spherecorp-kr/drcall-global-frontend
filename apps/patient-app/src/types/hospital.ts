/**
 * Hospital and Doctor types
 */

export interface Hospital {
  id: number;
  externalId: string;
  hospitalCode: string;
  nameEn: string;
  nameTh: string;
  nameKo: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  status: string;
  logoUrl: string;
}

export interface Doctor {
  id: number;
  externalId: string;
  hospitalId: number;
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  specialty: string;
  subSpecialties: string[];
  yearsOfExperience: number;
  bioEn: string;
  bioTh: string;
  languages: string[];
  preferredLanguage: string;
  consultationFee: number;
  consultationDurationMinutes: number;
  acceptsSeeDoctorNow: boolean;
  acceptsScheduledAppointments: boolean;
  profileImageUrl: string;
  rating: number;
  totalConsultations: number;
  status: string;
  availableForCalls: boolean;
}

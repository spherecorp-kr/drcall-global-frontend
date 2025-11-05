import type { PatientManagement, Gender, PatientGrade } from '@/shared/types/patient';
import { GENDER_MAP } from '@/shared/types/patient';

// Helper function to calculate age from birthdate
function calculateAge(birthDate: Date): number {
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
}

// Helper function to format date to DD/MM/YYYY
function formatDate(date: Date | undefined): string {
	if (!date) return '-';

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
}

// Generate mock patient data
const generatePatientData = (count: number): PatientManagement[] => {
	const names = [
		'Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum L',
		'Lorem Ipsum Lorem Lorem Ipsum',
		'Lorem Ipsum',
		'김민수',
		'이영희',
		'박철수',
		'최지은',
		'정수진',
		'강동욱',
		'한소희',
	];

	const genders: Gender[] = ['male', 'female'];
	const grades: PatientGrade[] = ['vip', 'risk', 'normal'];

	const patients: PatientManagement[] = [];

	for (let i = 0; i < count; i++) {
		const gender = genders[Math.floor(Math.random() * genders.length)];
		const grade = grades[Math.floor(Math.random() * grades.length)];

		// Generate random birthdate (between 1940 and 2005)
		const birthYear = 1940 + Math.floor(Math.random() * 65);
		const birthMonth = Math.floor(Math.random() * 12);
		const birthDay = Math.floor(Math.random() * 28) + 1;
		const birthDate = new Date(birthYear, birthMonth, birthDay);

		// Random chance to have last visit date (70% chance)
		let lastVisitDate: Date | undefined;
		if (Math.random() > 0.3) {
			// Last visit within past year
			const daysAgo = Math.floor(Math.random() * 365);
			lastVisitDate = new Date();
			lastVisitDate.setDate(lastVisitDate.getDate() - daysAgo);
		}

		const patient: PatientManagement = {
			id: `${i + 1}`,
			name: names[i % names.length],
			gender,
			genderDisplay: GENDER_MAP[gender],
			birthDate,
			birthDateDisplay: formatDate(birthDate),
			age: calculateAge(birthDate),
			phoneNumber: '01012345678',
			grade,
			lastVisitDate,
			lastVisitDateDisplay: formatDate(lastVisitDate),
			createdAt: new Date(2024, 0, 1),
			updatedAt: new Date(2024, 0, 1),
		};

		patients.push(patient);
	}

	return patients;
};

export const mockPatients: PatientManagement[] = generatePatientData(100);

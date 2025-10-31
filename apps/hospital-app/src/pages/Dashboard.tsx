import { useState, useCallback, useMemo } from 'react';
import { StatsSummary } from '@/shared/components/ui/StatsSummary';
import { PatientChart } from '@/shared/components/ui/PatientChart';
import { AppointmentTable } from '@/shared/components/ui/AppointmentTable';
import { DoctorListTable } from '@/shared/components/ui/DoctorListTable';

// Sample data
const sampleAppointments = [
	{
		id: '1',
		patientLevel: 'VIP' as const,
		appointmentNumber: 'A-2024-001',
		patientName: '김철수',
		preferredDateTime: '2024-01-15 09:00',
		doctor: '이영희',
		status: '진료 대기' as const,
	},
	{
		id: '2',
		patientLevel: 'Risk' as const,
		appointmentNumber: 'A-2024-002',
		patientName: '박민수',
		preferredDateTime: '2024-01-15 09:30',
		doctor: '김민준',
		status: '진료 중' as const,
	},
	{
		id: '3',
		appointmentNumber: 'A-2024-003',
		patientName: '최지우',
		preferredDateTime: '2024-01-15 10:00',
		doctor: '이영희',
		status: '진료 완료' as const,
	},
	{
		id: '4',
		patientLevel: 'VIP' as const,
		appointmentNumber: 'A-2024-004',
		patientName: '정하나',
		preferredDateTime: '2024-01-15 10:30',
		doctor: '박서연',
		status: '진료 대기' as const,
	},
	{
		id: '5',
		appointmentNumber: 'A-2024-005',
		patientName: '강동원',
		preferredDateTime: '2024-01-15 11:00',
		doctor: '최수진',
		status: '진료 대기' as const,
	},
	{
		id: '6',
		appointmentNumber: 'A-2024-006',
		patientName: '송혜교',
		preferredDateTime: '2024-01-15 11:30',
		doctor: '김민준',
		status: '진료 완료' as const,
	},
	{
		id: '7',
		patientLevel: 'Risk' as const,
		appointmentNumber: 'A-2024-007',
		patientName: '이병헌',
		preferredDateTime: '2024-01-15 13:00',
		doctor: '이영희',
		status: '진료 대기' as const,
	},
	{
		id: '8',
		appointmentNumber: 'A-2024-008',
		patientName: '전지현',
		preferredDateTime: '2024-01-15 13:30',
		doctor: '박서연',
		status: '진료 중' as const,
	},
	{
		id: '9',
		patientLevel: 'VIP' as const,
		appointmentNumber: 'A-2024-009',
		patientName: '하정우',
		preferredDateTime: '2024-01-15 14:00',
		doctor: '최수진',
		status: '진료 대기' as const,
	},
	{
		id: '10',
		appointmentNumber: 'A-2024-010',
		patientName: '배수지',
		preferredDateTime: '2024-01-15 14:30',
		doctor: '김민준',
		status: '진료 대기' as const,
	},
	{
		id: '11',
		appointmentNumber: 'A-2024-011',
		patientName: '유아인',
		preferredDateTime: '2024-01-15 15:00',
		doctor: '이영희',
		status: '예약 취소' as const,
	},
	{
		id: '12',
		patientLevel: 'Risk' as const,
		appointmentNumber: 'A-2024-012',
		patientName: '김태리',
		preferredDateTime: '2024-01-15 15:30',
		doctor: '박서연',
		status: '진료 대기' as const,
	},
	{
		id: '13',
		appointmentNumber: 'A-2024-013',
		patientName: '박보검',
		preferredDateTime: '2024-01-15 16:00',
		doctor: '최수진',
		status: '진료 완료' as const,
	},
	{
		id: '14',
		patientLevel: 'VIP' as const,
		appointmentNumber: 'A-2024-014',
		patientName: '손예진',
		preferredDateTime: '2024-01-15 16:30',
		doctor: '김민준',
		status: '진료 대기' as const,
	},
	{
		id: '15',
		appointmentNumber: 'A-2024-015',
		patientName: '현빈',
		preferredDateTime: '2024-01-15 17:00',
		doctor: '이영희',
		status: '진료 대기' as const,
	},
];

const sampleDoctors = [
	{
		id: '1',
		name: '이영희',
		avatar: undefined,
		isOnline: true,
		status: '진료 가능' as const,
	},
	{
		id: '2',
		name: '김민준',
		avatar: undefined,
		isOnline: true,
		status: '진료 중' as const,
	},
	{
		id: '3',
		name: '박서연',
		avatar: undefined,
		isOnline: true,
		status: '진료 가능' as const,
	},
	{
		id: '4',
		name: '최수진',
		avatar: undefined,
		isOnline: true,
		status: '진료 가능' as const,
	},
	{
		id: '5',
		name: '정태윤',
		avatar: undefined,
		isOnline: false,
		status: '진료 불가능' as const,
	},
	{
		id: '6',
		name: '강지훈',
		avatar: undefined,
		isOnline: true,
		status: '진료 중' as const,
	},
	{
		id: '7',
		name: '윤서아',
		avatar: undefined,
		isOnline: true,
		status: '진료 가능' as const,
	},
	{
		id: '8',
		name: '한동훈',
		avatar: undefined,
		isOnline: false,
		status: '진료 불가능' as const,
	},
	{
		id: '9',
		name: '오지은',
		avatar: undefined,
		isOnline: true,
		status: '진료 가능' as const,
	},
	{
		id: '10',
		name: '임수정',
		avatar: undefined,
		isOnline: true,
		status: '진료 중' as const,
	},
];

type SectionId = 'chart' | 'appointments' | 'doctors';

const Dashboard = () => {
	const [activeSection, setActiveSection] = useState<SectionId | null>(null);
	const isExpandOpen = useMemo(() => activeSection !== null, [activeSection]);

	const toggleExpand = useCallback(
		(sectionId: SectionId) => {
			setActiveSection((current) => (current === sectionId ? null : sectionId));
		},
		[setActiveSection],
	);

	const shouldHideSection = (sectionId: SectionId) => activeSection === sectionId;

	return (
		<div className="relative h-full w-full overflow-hidden">
			{isExpandOpen && (
				<>
					<div
						className="absolute inset-0 z-30 bg-neutral-950/40 backdrop-blur-sm"
						onClick={() => setActiveSection(null)}
					/>
					<div className="absolute inset-0 z-40 flex h-full w-full flex-col overflow-hidden bg-bg-gray shadow-xl">
						<div className="h-full w-full overflow-auto p-3 sm:p-4 md:p-5">
							{activeSection === 'chart' && (
								<PatientChart
									className="h-full min-h-[400px]"
									onExpand={() => toggleExpand('chart')}
									isExpanded
								/>
							)}
							{activeSection === 'appointments' && (
								<AppointmentTable
									appointments={sampleAppointments}
									className="h-full min-h-[400px]"
									onExpand={() => toggleExpand('appointments')}
									isExpanded
								/>
							)}
							{activeSection === 'doctors' && (
								<DoctorListTable
									doctors={sampleDoctors}
									className="h-full min-h-[400px]"
									onExpand={() => toggleExpand('doctors')}
									isExpanded
								/>
							)}
						</div>
					</div>
				</>
			)}

			{/* 일반 그리드 레이아웃 */}
			<div
				className={`h-full w-full overflow-auto ${isExpandOpen ? 'pointer-events-none select-none opacity-30' : ''}`}
			>
				<div className="flex flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:gap-5 md:px-5 md:py-5">
					{/* 현황 요약 */}
					<section className="w-full">
						<StatsSummary />
					</section>

					{/* 환자 통계 */}
					{!shouldHideSection('chart') && (
						<section
							className="w-full h-[320px] sm:h-[360px] md:h-[380px]"
							data-section="chart"
						>
							<PatientChart onExpand={() => toggleExpand('chart')} />
						</section>
					)}

					{/* 오늘 진료 예정 + 의사 목록 */}
					<div className="w-full flex flex-col xl:flex-row gap-3 sm:gap-4 md:gap-5">
						{/* 오늘 진료 예정 */}
						{!shouldHideSection('appointments') && (
							<section
								className="w-full xl:flex-[2] h-[480px] sm:h-[520px] md:h-[550px]"
								data-section="appointments"
							>
								<AppointmentTable
									appointments={sampleAppointments}
									onExpand={() => toggleExpand('appointments')}
								/>
							</section>
						)}

						{/* 의사 목록 */}
						{!shouldHideSection('doctors') && (
							<section
								className="w-full xl:flex-1 h-[480px] sm:h-[520px] md:h-[550px]"
								data-section="doctors"
							>
								<DoctorListTable
									doctors={sampleDoctors}
									onExpand={() => toggleExpand('doctors')}
								/>
							</section>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
import { useMemo, type ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Table from './Table';
import { cn } from '@/shared/utils/cn';
import type { PatientManagement, PatientGrade } from '@/shared/types/patient';
import { PATIENT_GRADE_COLOR_MAP, PATIENT_GRADE_MAP } from '@/shared/types/patient';

interface PatientManagementTableProps {
	patients: PatientManagement[];
	selectedPatientId?: string;
	onRowClick?: (patient: PatientManagement) => void;
	className?: string;
	emptyState?: ReactNode;
}

// 환자 등급 뱃지 컴포넌트
function PatientGradeBadge({ grade }: { grade: PatientGrade }) {
	if (grade === 'normal') {
		return null;
	}

	const colorConfig = PATIENT_GRADE_COLOR_MAP[grade];
	const label = PATIENT_GRADE_MAP[grade];

	return (
		<div
			className="h-6 px-2.5 py-1.5 rounded-[19px] inline-flex items-center justify-center"
			style={{ background: colorConfig.bg }}
		>
			<span
				className="text-13 font-semibold font-pretendard capitalize text-center"
				style={{ color: colorConfig.text }}
			>
				{label}
			</span>
		</div>
	);
}

export function PatientManagementTable({
	patients,
	selectedPatientId,
	onRowClick,
	className,
	emptyState,
}: PatientManagementTableProps) {
	const columns = useMemo<ColumnDef<PatientManagement>[]>(
		() => [
			{
				accessorKey: 'grade',
				header: '환자 등급',
				size: 100,
				minSize: 100,
				maxSize: 100,
				cell: ({ row }) => (
					<div className="flex items-center">
						<PatientGradeBadge grade={row.original.grade} />
					</div>
				),
			},
			{
				accessorKey: 'name',
				header: '환자명',
				cell: ({ row }) => (
					<div className="flex items-center overflow-hidden w-full">
						<span className="text-text-100 text-16 font-normal font-pretendard leading-normal overflow-hidden text-ellipsis whitespace-nowrap max-w-full block">
							{row.original.name}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'gender',
				header: '성별',
				size: 120,
				minSize: 120,
				maxSize: 120,
				cell: ({ row }) => (
					<div className="flex items-center">
						<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
							{row.original.genderDisplay}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'birthDate',
				header: '생년월일',
				size: 200,
				minSize: 200,
				maxSize: 200,
				cell: ({ row }) => (
					<div className="flex items-center">
						<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
							{row.original.birthDateDisplay}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'age',
				header: '나이',
				size: 120,
				minSize: 120,
				maxSize: 120,
				cell: ({ row }) => (
					<div className="flex items-center">
						<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
							{row.original.age}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'phoneNumber',
				header: '휴대폰 번호',
				size: 200,
				minSize: 200,
				maxSize: 200,
				cell: ({ row }) => (
					<div className="flex items-center">
						<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
							{row.original.phoneNumber}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'lastVisitDate',
				header: '마지막 진료 날짜',
				size: 200,
				minSize: 200,
				maxSize: 200,
				cell: ({ row }) => (
					<div className="flex items-center">
						<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
							{row.original.lastVisitDateDisplay}
						</span>
					</div>
				),
			},
		],
		[],
	);

	return (
		<div className={cn('w-full h-full', className)}>
			<Table
				data={patients}
				columns={columns}
				enableSelection={true}
				selectedIds={selectedPatientId ? new Set([selectedPatientId]) : new Set()}
				onRowClick={(row) => onRowClick?.(row.original)}
				getRowId={(patient) => patient.id}
				getRowClassName={(row) => {
					const isEvenRow = row.index % 2 === 0;
					return isEvenRow ? 'bg-bg-white' : 'bg-bg-gray';
				}}
				minWidth="1240px"
				emptyState={emptyState}
				disableScroll={true}
			/>
		</div>
	);
}

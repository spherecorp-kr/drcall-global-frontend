import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { EmptyState, StatsSummary, Table } from '@/shared/components/ui';
import { Section } from '@/shared/components/ui/Section.tsx';
import { SearchConsultations } from '@/shared/components/ui/appointmentSearch';
import type { ConfirmedTableColumnProps, PatientLevel } from '@/shared/types/appointment.ts';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { PatientBadge } from '@/shared/components/ui/Badge.tsx';
import { levelBadgeMap } from '@/shared/utils/constants.ts';

const sampleData: ConfirmedTableColumnProps[] = [
	{
		appointmentSequence: 3,
		appointmentNumber: '20251030-003',
		appointmentDatetime: '30/10/25 14:01~14:15',
		doctorName: 'Dr.KR',
		patientName: '환자1',
		patientLevel: 'VIP',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
	},
	{
		appointmentSequence: 2,
		appointmentNumber: '20251030-002',
		appointmentDatetime: '30/10/25 14:01~14:15',
		doctorName: 'Dr.KR',
		patientName: '환자2',
		patientLevel: 'Risk',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
	},
	{
		appointmentSequence: 1,
		appointmentNumber: '20251030-001',
		appointmentDatetime: '30/10/25 14:01~14:15',
		doctorName: 'Dr.KR',
		patientName: '환자3',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
	}
];

const cellSpanClass: string = 'font-normal leading-[normal] text-base text-text-100';

const ColGroup = () => (
	<colgroup>
		<col width="13%" />
		<col width="13%" />
		<col width="19%" />
		<col width="19%" />
		<col width="7%" />
		<col width="29%" />
	</colgroup>
);

const Consultation = () => {
	const navigate = useNavigate();

	const { t } = useTranslation();

	const columns = useMemo<ColumnDef<ConfirmedTableColumnProps>[]>(() => [
		{
			accessorKey: 'appointmentNumber',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('consultation.table.columns.appointmentNumber'),
			minSize: 100,
		},
		{
			accessorKey: 'appointmentDatetime',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('consultation.table.columns.scheduledDatetime'),
			minSize: 100,
		},
		{
			accessorKey: 'doctorName',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('consultation.table.columns.doctor'),
			meta: { truncate: true },
		},
		{
			accessorKey: 'patientName',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('consultation.table.columns.patientName'),
			meta: { truncate: true },
		},
		{
			accessorKey: 'patientLevel',
			cell: ({ getValue }) => {
				const value = getValue<PatientLevel | undefined>();
				if (!value) return null;
				const { label, level } = levelBadgeMap[value];
				return <PatientBadge level={level}>{label}</PatientBadge>;
			},
			enableSorting: false,
			header: t('consultation.table.columns.patientLevel'),
			size: 100,
		},
		{
			accessorKey: 'symptom',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('consultation.table.columns.symptom'),
			meta: { truncate: true },
		},
	], [t]);

	// 상세 페이지로 이동
	const navigateToDetails = useCallback((row: Row<ConfirmedTableColumnProps>) => {
		navigate(`/consultation/${row.original.appointmentSequence}`);
	}, [navigate]);

	return (
		<div className="h-full overflow-auto w-full">
			<div className="flex flex-col gap-3 h-full px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:gap-5 md:px-5 md:py-5 w-full">
				{/* 현황 요약 */}
				<section className="w-full">
					<StatsSummary />
				</section>
				{/* 오늘 진료 예정 */}
				<Section
					className="flex flex-col gap-2.5 h-full w-full"
					filters={<SearchConsultations />}
					title={t('consultation.table.title')}
				>
					<Table
						colgroup={<ColGroup />}
						columns={columns}
						data={sampleData}
						emptyState={<EmptyState message={t('consultation.table.empty')} />}
						enableSelection
						onRowClick={navigateToDetails}
					/>
				</Section>
			</div>
		</div>
	);
}

export default Consultation;
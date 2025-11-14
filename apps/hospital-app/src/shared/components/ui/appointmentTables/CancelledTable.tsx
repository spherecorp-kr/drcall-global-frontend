import { EmptyState, Pagination, Table } from '@/shared/components/ui';
import type { CancelledTableColumnProps } from '@/shared/types/appointment';
import { useCallback, useMemo } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const sampleData: CancelledTableColumnProps[] = [
	{
		appointmentSequence: 3,
		appointmentNumber: '20251030-003',
		cancelledDatetime: '30/10/25 14:15',
		canceler: 'HOSPITAL',
		doctorName: 'Dr.KR',
		patientName: '환자1'
	},
	{
		appointmentSequence: 2,
		appointmentNumber: '20251030-002',
		cancelledDatetime: '30/10/25 14:15',
		canceler: 'PATIENT',
		doctorName: 'Dr.KR',
		patientName: '환자1'
	},
	{
		appointmentSequence: 1,
		appointmentNumber: '20251030-001',
		cancelledDatetime: '30/10/25 14:15',
		canceler: 'SYSTEM',
		doctorName: 'Dr.KR',
		patientName: '환자1'
	}
];

const cellSpanClass: string = 'font-normal leading-[normal] text-base text-text-100';

const ColGroup = () => (
	<colgroup>
		<col width="13%" />
		<col width="13%" />
		<col width="10%" />
		<col width="32%" />
		<col width="32%" />
	</colgroup>
);

const CancelledTable = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const columns = useMemo<ColumnDef<CancelledTableColumnProps>[]>(() => [
		{
			accessorKey: 'appointmentNumber',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '예약 번호',
			minSize: 100
		},
		{
			accessorKey: 'cancelledDatetime',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '예약 취소 일시',
			minSize: 100
		},
		{
			accessorKey: 'canceler',
			cell: ({ getValue }) => {
				const value = getValue<string>().toLowerCase();
				return (
					<span className={cellSpanClass}>{t(`canceler.${value}`)}</span>
				);
			},
			enableSorting: false,
			header: '취소자',
			minSize: 100
		},
		{
			accessorKey: 'doctorName',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '의사',
			meta: { truncate: true }
		},
		{
			accessorKey: 'patientName',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '환자명',
			meta: { truncate: true }
		}
	], [t]);

	// 상세 페이지로 이동
	const navigateToDetails = useCallback((row: Row<CancelledTableColumnProps>) => {
		navigate(`/appointment/${row.original.appointmentSequence}`);
	}, [navigate]);

	return (
		<div className="bg-white border border-[#e0e0e0] flex flex-col gap-2.5 h-full rounded-[0.625rem]">
			<Table
				className='flex-1 h-auto'
				colgroup={<ColGroup />}
				columns={columns}
				data={sampleData}
				disableHorizontalScroll
				emptyState={<EmptyState message="예약 취소 목록이 없습니다." />}
				enableSelection
				getRowClassName={(row) => row.index % 2 === 0 ? 'bg-white' : 'bg-bg-gray'}
				onRowClick={navigateToDetails}
			/>
			<Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
		</div>
	);
};

export default CancelledTable;
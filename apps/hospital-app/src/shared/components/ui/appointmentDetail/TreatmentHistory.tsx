import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { EmptyState, Pagination, Table } from '@/shared/components/ui';
import type { TreatmentHistoryTableColumnProps } from '@/shared/types/appointment';
import '@/shared/styles/treatmentHistory.css';
import { cn } from '@/shared/utils/cn';

const sampleData: TreatmentHistoryTableColumnProps[] = [
	{
		completedDatetime: '16/05/2023 16:27',
		doctorName: '의사이름',
		symptom: '어쩌고 저쩌고',
		appointmentSequence: 1,
	}
];

const cellSpanClass: string = 'font-normal leading-normal text-base text-text-100';

const ColGroup = () => (
	<colgroup>
		<col width="13%" />
		<col width="20%" />
		<col width="61%" />
		<col width="6%" />
	</colgroup>
);

const TreatmentHistory = () => {
	const columns = useMemo<ColumnDef<TreatmentHistoryTableColumnProps>[]>(() => [
		{
			accessorKey: 'completedDatetime',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '진료 완료 일시',
			minSize: 100
		},
		{
			accessorKey: 'doctorName',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '담당 의사',
			meta: { truncate: true }
		},
		{
			accessorKey: 'symptom',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '증상',
			meta: { truncate: true }
		},
		{
			accessorKey: 'appointmentSequence',
			cell: () => {
				return (
					<button className='treatment-history-action' />
				);
			},
			enableSorting: false,
			header: '액션',
			meta: { height: '1.875rem' },
			minSize: 100
		},
	], []);

	return (
		<div className='flex flex-col gap-2.5 items-start self-stretch'>
			<h2 className='font-semibold leading-normal text-text-100 text-xl'>과거 진료 내역</h2>
			<div className='bg-white border border-stroke-input flex flex-1 flex-col gap-4 rounded-[0.625rem] w-full'>
				<Table
					colgroup={<ColGroup />}
					columns={columns}
					data={sampleData}
					emptyState={<EmptyState className='h-[43.5rem] mt-5' message="과거 진료 기록이 없습니다." />}
					enableSelection
					getRowClassName={() => cn('active:bg-bg-blue bg-white hover:bg-bg-gray')}
				/>
				<Pagination className='mb-4' currentPage={0} totalPages={1} onPageChange={() => {}} />
			</div>
		</div>
	);
};

export default TreatmentHistory;
import { useCallback, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { EmptyState, ImageViewer, Pagination, Table } from '@/shared/components/ui';
import type { TreatmentHistoryTableColumnProps } from '@/shared/types/appointment';
import '@/shared/styles/treatmentHistory.css';
import { cn } from '@/shared/utils/cn';
import { useDialog } from '@/shared/hooks/useDialog.ts';
import { useTranslation } from 'react-i18next';

const sampleData: TreatmentHistoryTableColumnProps[] = [
	{
		completedDatetime: '16/05/2023 16:27',
		doctorName: '의사이름',
		symptom: '어쩌고 저쩌고',
		appointmentSequence: 1,
	}
];

const cellSpanClass: string = 'font-normal leading-[normal] text-base text-text-100';

interface ZoomInIconProps {
	disabled: boolean;
}

const ZoomInIcon = ({ disabled }: ZoomInIconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
		>
			<path
				d="M11.5625 7.66797C11.9767 7.66797 12.3125 8.00376 12.3125 8.41797V10.8164H14.7295C15.1436 10.8164 15.4793 11.1523 15.4795 11.5664C15.4795 11.9806 15.1437 12.3164 14.7295 12.3164H12.3125V14.7168C12.3122 15.1308 11.9765 15.4668 11.5625 15.4668C11.1485 15.4668 10.8128 15.1308 10.8125 14.7168V12.3164H8.39844C7.98422 12.3164 7.64844 11.9806 7.64844 11.5664C7.6486 11.1523 7.98432 10.8164 8.39844 10.8164H10.8125V8.41797C10.8125 8.00376 11.1483 7.66797 11.5625 7.66797Z"
				fill={disabled ? '#C1C1C1' : '#00A0D2'}
			/>
			<path
				d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
				stroke={disabled ? '#C1C1C1' : '#00A0D2'}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
			<path
				d="M22 22L18.5 18.5"
				stroke={disabled ? '#C1C1C1' : '#00A0D2'}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
}

interface HistoryDetailDialogContentsProps {
	disabled: boolean;
}

const HistoryDetailDialogContents = ({ disabled }: HistoryDetailDialogContentsProps) => {
	const { t } = useTranslation();
	const prescriptionPreview = () => {
		// TODO URL 바꾸기
		window.open('https://www.naver.com', '_blank', 'noopener noreferrer');
	}

	return (
		<div className='flex flex-col gap-2.5 items-start'>
			<div className='cursor-pointer flex gap-2.5 items-center justify-end w-full' onClick={prescriptionPreview}>
				<ZoomInIcon disabled={disabled} />
				<span className={`font-medium leading-[normal] text-xl ${disabled ? 'text-text-30' : 'text-primary-70'}`}>{t('appointment.detail.history.preview')}</span>
			</div>
			<div className='flex flex-col gap-5 items-start'>
				<div className='flex flex-col gap-2.5 w-full'>
					<p className='leading-[normal] text-base text-text-50'>{t('appointment.detail.history.dialog.mainSymptom')}</p>
					<textarea
						className='border border-stroke-input leading-[normal] min-h-20 px-4 py-2.5 resize-none rounded text-base text-text-100 w-full'
						disabled></textarea>
					<ImageViewer images={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']} initialIndex={0} />
				</div>
				<div className='flex flex-col gap-2.5 w-full'>
					<p className='leading-[normal] text-base text-text-50'>{t('appointment.detail.history.dialog.doctorAdvice')}</p>
					<textarea
						className='border border-stroke-input leading-[normal] min-h-20 px-4 py-2.5 resize-none rounded text-base text-text-100 w-full'
						disabled></textarea>
				</div>
				<div className='flex flex-col gap-2.5 w-full'>
					<p className='leading-[normal] text-base text-text-50'>{t('appointment.detail.history.dialog.aiSummary')}</p>
					<textarea
						className='border border-stroke-input leading-[normal] min-h-20 px-4 py-2.5 resize-none rounded text-base text-text-100 w-full'
						disabled></textarea>
				</div>
			</div>
		</div>
	);
}

const ColGroup = () => (
	<colgroup>
		<col width="13%" />
		<col width="20%" />
		<col width="61%" />
		<col width="6%" />
	</colgroup>
);

const TreatmentHistory = () => {
	const { openDialog } = useDialog();
	const { t } = useTranslation();

	const columns = useMemo<ColumnDef<TreatmentHistoryTableColumnProps>[]>(() => [
		{
			accessorKey: 'completedDatetime',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('appointment.detail.history.table.completedDate'),
			minSize: 100
		},
		{
			accessorKey: 'doctorName',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('appointment.detail.history.table.doctor'),
			meta: { truncate: true }
		},
		{
			accessorKey: 'symptom',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('appointment.detail.history.table.symptom'),
			meta: { truncate: true }
		},
		{
			accessorKey: 'appointmentSequence',
			cell: () => <button className='treatment-history-action' />,
			enableSorting: false,
			header: t('appointment.detail.history.table.action'),
			meta: { height: '1.875rem' },
			minSize: 100
		},
	], [t]);

	const handleRowClick = useCallback(() => {
		openDialog({
			dialogClass: 'w-[36.25rem]',
			dialogContents: <HistoryDetailDialogContents disabled={false} />,
			dialogId: 'treatmentHistoryDetailDialog',
			dialogTitle: t('appointment.detail.history.dialog.title'),
			hasCloseButton: true
		});
	}, [openDialog, t]);

	return (
		<div className='flex flex-1 flex-col gap-2.5 items-start self-stretch'>
			<h2 className='font-semibold leading-[normal] text-text-100 text-xl'>{t('appointment.detail.history.title')}</h2>
			<div className='bg-white border border-stroke-input flex flex-1 flex-col gap-4 rounded-[0.625rem] w-full'>
				<Table
					colgroup={<ColGroup />}
					columns={columns}
					data={sampleData}
					emptyState={<EmptyState className='h-[43.5rem] mt-5' message={t('appointment.detail.history.empty')} />}
					enableSelection
					getRowClassName={() => cn('active:bg-bg-blue bg-white hover:bg-bg-gray')}
					onRowClick={handleRowClick}
				/>
				<Pagination className='mb-4' currentPage={1} totalPages={1} onPageChange={() => {}} />
			</div>
		</div>
	);
};

export default TreatmentHistory;
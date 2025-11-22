import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button, EmptyState, Pagination, Table, Tooltip } from '@/shared/components/ui';
import type { SettlementHistoryItem, SettlementStatus } from '@/shared/types/payment';
import helpIcon from '@/shared/assets/icons/btn_circle_help.svg';
import helpIconBlue from '@/shared/assets/icons/btn_circle_help_blue.svg';

interface SettlementHistoryTableProps {
	data: SettlementHistoryItem[];
}

const cellSpanClass = 'text-text-100 text-16 font-normal font-pretendard';

const ColGroup = () => (
	<colgroup>
		<col style={{ width: '15%', minWidth: '120px' }} />
		<col style={{ width: '15%', minWidth: '140px' }} />
		<col style={{ width: '18%', minWidth: '160px' }} />
		<col style={{ width: '15%', minWidth: '140px' }} />
		<col style={{ width: '12%', minWidth: '100px' }} />
		<col style={{ width: '15%', minWidth: '140px' }} />
		<col style={{ width: '10%', minWidth: '120px' }} />
	</colgroup>
);

const formatDatetime = (dateStr?: string) => {
	if (!dateStr) return '-';
	const date = new Date(dateStr);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const getStatusText = (status: SettlementStatus, t: (key: string) => string) => {
	switch (status) {
		case 'completed':
			return { text: t('payment.search.filter.status.completed'), color: 'text-text-100' };
		case 'scheduled':
			return { text: t('payment.search.filter.status.scheduled'), color: 'text-[#11AC51]' };
		case 'onHold':
			return { text: t('payment.search.filter.status.onHold'), color: 'text-[#F65F06]' };
		case 'confirmed':
			return { text: t('payment.search.filter.status.confirmed'), color: 'text-text-100' };
		case 'pending':
			return { text: t('payment.search.filter.status.pending'), color: 'text-text-100' };
		default:
			return { text: t('payment.search.filter.status.completed'), color: 'text-text-100' };
	}
};

export function SettlementHistoryTable({ data }: SettlementHistoryTableProps) {
	const { t } = useTranslation();
	const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const totalPages = Math.ceil(data.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = data.slice(startIndex, endIndex);

	const columns = useMemo<ColumnDef<SettlementHistoryItem>[]>(
		() => [
			{
				accessorKey: 'settlementId',
				header: t('payment.settlementTable.historyTable.columns.settlementId'),
				enableSorting: false,
				cell: ({ row }) => <div className={cellSpanClass}>{row.original.settlementId}</div>,
			},
			{
				accessorKey: 'settlementPeriod',
				header: () => (
					<div className="flex items-center gap-1.5">
						<span>{t('payment.settlementTable.historyTable.columns.settlementPeriod')}</span>
						<Tooltip
							content={t('payment.settlementTable.historyTable.tooltips.settlementPeriod')}
							position="bottom"
						>
							{({ isOpen }) => (
								<img
									src={isOpen ? helpIconBlue : helpIcon}
									alt={t('common.ariaLabels.help')}
									className="w-4 h-4 cursor-pointer"
								/>
							)}
						</Tooltip>
					</div>
				),
				enableSorting: false,
				cell: ({ row }) => <div className={cellSpanClass}>{row.original.settlementPeriod}</div>,
			},
			{
				accessorKey: 'expectedAmount',
				header: () => (
					<div className="flex items-center gap-1.5">
						<span>{t('payment.settlementTable.historyTable.columns.expectedAmount')}</span>
						<Tooltip
							content={t('payment.settlementTable.historyTable.tooltips.expectedAmount')}
							position="bottom"
						>
							{({ isOpen }) => (
								<img
									src={isOpen ? helpIconBlue : helpIcon}
									alt={t('common.ariaLabels.help')}
									className="w-4 h-4 cursor-pointer"
								/>
							)}
						</Tooltip>
					</div>
				),
				enableSorting: false,
				meta: { align: 'right' },
				cell: ({ row }) => (
					<div className={cellSpanClass}>
						{row.original.expectedAmount.toLocaleString()} THB
					</div>
				),
			},
			{
				accessorKey: 'completedAmount',
				header: () => (
					<div className="flex items-center gap-1.5">
						<span>{t('payment.settlementTable.historyTable.columns.completedAmount')}</span>
						<Tooltip
							content={t('payment.settlementTable.historyTable.tooltips.completedAmount')}
							position="bottom"
						>
							{({ isOpen }) => (
								<img
									src={isOpen ? helpIconBlue : helpIcon}
									alt={t('common.ariaLabels.help')}
									className="w-4 h-4 cursor-pointer"
								/>
							)}
						</Tooltip>
					</div>
				),
				enableSorting: false,
				meta: { align: 'right' },
				cell: ({ row }) => (
					<div className={cellSpanClass}>
						{row.original.completedAmount.toLocaleString()} THB
					</div>
				),
			},
			{
				accessorKey: 'status',
				header: t('payment.settlementTable.historyTable.columns.status'),
				enableSorting: false,
				cell: ({ row }) => {
					const { text, color } = getStatusText(row.original.status, t);
					return <div className={`text-16 font-normal font-pretendard ${color}`}>{text}</div>;
				},
			},
			{
				accessorKey: 'completedDatetime',
				header: t('payment.settlementTable.historyTable.columns.completedDatetime'),
				enableSorting: false,
				cell: ({ row }) => (
					<div className={cellSpanClass}>{formatDatetime(row.original.completedDatetime)}</div>
				),
			},
			{
				id: 'action',
				header: t('payment.settlementTable.historyTable.columns.action'),
				enableSorting: false,
				meta: { align: 'center' },
				cell: ({ row }) => {
					if (row.original.status === 'scheduled') {
						return (
							<Button variant="ghost" size="small">
								{t('payment.settlementTable.historyTable.buttons.receiveSettlement')}
							</Button>
						);
					}
					return null;
				},
			},
		],
		[t],
	);

	return (
		<div className="bg-white border border-stroke-input flex flex-col gap-2.5 h-full rounded-b-[0.625rem] rounded-tr-[0.625rem]">
			<Table
				className="flex-1 h-auto"
				colgroup={<ColGroup />}
				columns={columns}
				data={currentData}
				disableHorizontalScroll
				emptyState={<EmptyState message={t('payment.settlementTable.historyTable.empty')} />}
				enableSelection
				selectedIds={selectedRowIds}
				onSelectionChange={setSelectedRowIds}
				getRowId={(row) => row.settlementId}
				getRowClassName={(row) => (row.index % 2 === 0 ? 'bg-bg-white' : 'bg-bg-gray')}
			/>
			<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
		</div>
	);
}

export default SettlementHistoryTable;

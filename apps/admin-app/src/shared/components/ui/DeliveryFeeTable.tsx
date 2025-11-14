import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button, EmptyState, Pagination, Table, Tooltip } from '@/shared/components/ui';
import type { DeliveryFeeItem, SettlementStatus } from '@/shared/types/payment';
import helpIcon from '@/shared/assets/icons/btn_circle_help.svg';
import helpIconBlue from '@/shared/assets/icons/btn_circle_help_blue.svg';

interface DeliveryFeeTableProps {
	data: DeliveryFeeItem[];
}

const cellSpanClass = 'text-text-100 text-16 font-normal font-pretendard';

const ColGroup = () => (
	<colgroup>
		<col style={{ width: '15%', minWidth: '120px' }} />
		<col style={{ width: '15%', minWidth: '140px' }} />
		<col style={{ width: '18%', minWidth: '160px' }} />
		<col style={{ width: '15%', minWidth: '100px' }} />
		<col style={{ width: '22%', minWidth: '140px' }} />
		<col style={{ width: '15%', minWidth: '120px' }} />
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
	return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const getStatusText = (status: SettlementStatus) => {
	switch (status) {
		case 'completed':
			return { text: '완료', color: 'text-text-100' };
		case 'scheduled':
			return { text: '예정', color: 'text-[#11AC51]' };
		case 'onHold':
			return { text: '보류', color: 'text-[#F65F06]' };
		case 'confirmed':
			return { text: '확정', color: 'text-text-100' };
		case 'pending':
			return { text: '대기', color: 'text-text-100' };
		default:
			return { text: '완료', color: 'text-text-100' };
	}
};

export function DeliveryFeeTable({ data }: DeliveryFeeTableProps) {
	const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const totalPages = Math.ceil(data.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = data.slice(startIndex, endIndex);

	const columns = useMemo<ColumnDef<DeliveryFeeItem>[]>(
		() => [
			{
				accessorKey: 'deliveryId',
				header: '배송 ID 번호',
				enableSorting: false,
				cell: ({ row }) => <div className={cellSpanClass}>{row.original.deliveryId}</div>,
			},
			{
				accessorKey: 'settlementPeriod',
				header: () => (
					<div className="flex items-center gap-1.5">
						<span>정산 기간</span>
						<Tooltip
							content="해당 기간 동안 발생한 결제 건의 정산 기준 기간입니다."
							position="bottom"
						>
							{({ isOpen }) => (
								<img
									src={isOpen ? helpIconBlue : helpIcon}
									alt="help"
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
				accessorKey: 'deliveryUsageAmount',
				header: () => (
					<div className="flex items-center gap-1.5">
						<span>배송 이용 금액</span>
						<Tooltip
							content="병원이 발급하는 배송비로, 배송 완료 건 기준으로 산정됩니다."
							position="bottom"
						>
							{({ isOpen }) => (
								<img
									src={isOpen ? helpIconBlue : helpIcon}
									alt="help"
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
						{row.original.deliveryUsageAmount.toLocaleString()} THB
					</div>
				),
			},
			{
				accessorKey: 'status',
				header: '정산 상태',
				enableSorting: false,
				cell: ({ row }) => {
					const { text, color } = getStatusText(row.original.status);
					return <div className={`text-16 font-normal font-pretendard ${color}`}>{text}</div>;
				},
			},
			{
				accessorKey: 'paymentCompletedDate',
				header: '지급 완료일',
				enableSorting: false,
				cell: ({ row }) => (
					<div className={cellSpanClass}>{formatDatetime(row.original.paymentCompletedDate)}</div>
				),
			},
			{
				id: 'action',
				header: '액션',
				enableSorting: false,
				meta: { align: 'center' },
				cell: ({ row }) => {
					if (row.original.status === 'scheduled') {
						return (
							<Button variant="ghost" size="small">
								지급하기
							</Button>
						);
					}
					return null;
				},
			},
		],
		[]
	);

	return (
		<div className="bg-white border border-stroke-input flex flex-col gap-2.5 h-full rounded-[10px]">
			<Table
				className="flex-1 h-auto"
				colgroup={<ColGroup />}
				columns={columns}
				data={currentData}
				disableHorizontalScroll
				emptyState={<EmptyState message="배송 이용 금액 목록이 없습니다." />}
				enableSelection
				selectedIds={selectedRowIds}
				onSelectionChange={setSelectedRowIds}
				getRowId={(row) => row.deliveryId}
				getRowClassName={(row) => (row.index % 2 === 0 ? 'bg-bg-white' : 'bg-bg-gray')}
			/>
			<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
		</div>
	);
}

export default DeliveryFeeTable;

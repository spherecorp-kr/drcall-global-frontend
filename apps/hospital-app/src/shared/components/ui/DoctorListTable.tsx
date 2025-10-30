import { useMemo, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { cn } from '@/shared/utils/cn';
import { Table } from '@/shared/components/ui';
import { Section } from './Section';
import { DoctorStatusBadge } from '@/shared/components/ui/Badge';
import { EmptyState } from './EmptyState';
import defaultAvatar from '@/assets/img_profile.svg';
import { useLayoutStore } from '@/shared/store/layoutStore';

export interface Doctor {
	id: string;
	name: string;
	avatar?: string;
	isOnline: boolean;
	status: '진료 가능' | '진료 불가능' | '진료 중';
}

interface DoctorListTableProps {
	doctors: Doctor[];
	className?: string;
	onExpand?: () => void;
	isExpanded?: boolean;
}

export function DoctorListTable({
	doctors,
	className,
	onExpand,
	isExpanded,
}: DoctorListTableProps) {
	const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

	const doctorListTableHeaderFixed = useLayoutStore((state) => state.doctorListTableHeaderFixed);
	const setDoctorListTableHeaderFixed = useLayoutStore(
		(state) => state.setDoctorListTableHeaderFixed,
	);
	const sorting = useLayoutStore((state) => state.doctorListTableSorting);
	const setSorting = useLayoutStore((state) => state.setDoctorListTableSorting);

	const columns = useMemo<ColumnDef<Doctor>[]>(
		() => [
			{
				accessorKey: 'name',
				header: '이름',
				minSize: 180,
				cell: ({ row }) => (
					<div className="flex items-center gap-3">
						<div className="relative">
							<img
								src={row.original.avatar || defaultAvatar}
								alt={row.original.name}
								className="w-10 h-10 rounded-full outline outline-[1.5px] outline-stroke-input outline-offset-[-0.75px]"
							/>
							{row.original.isOnline && (
								<div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-bg-white bg-system-successful2" />
							)}
						</div>
						<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
							{row.original.name}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				minSize: 110,
				meta: { align: 'center' },
				cell: ({ getValue }) => {
					const status = getValue<Doctor['status']>();
					return <DoctorStatusBadge status={status}>{status}</DoctorStatusBadge>;
				},
			},
		],
		[],
	);

	return (
		<Section
			title="의사 목록"
			count={doctors.length}
			className={className}
			onExpand={onExpand}
			isExpanded={isExpanded}
			headerFixed={doctorListTableHeaderFixed}
			onHeaderFixedChange={setDoctorListTableHeaderFixed}
			contentClassName="p-0"
		>
			<Table
				data={doctors}
				columns={columns}
				enableSelection={true}
				selectedIds={selectedRowIds}
				onSelectionChange={setSelectedRowIds}
				getRowId={(doctor) => doctor.id}
				stickyHeader={doctorListTableHeaderFixed}
				sorting={sorting}
				onSortingChange={setSorting}
				getRowClassName={(row: Row<Doctor>) =>
					cn(
						row.index % 2 === 0
							? 'bg-bg-white hover:bg-gray-100'
							: 'bg-bg-gray hover:bg-gray-100',
					)
				}
				emptyState={<EmptyState message="의사 목록이 없습니다." />}
				minWidth="320px"
			/>
		</Section>
	);
}

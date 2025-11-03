import { useMemo, type ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Table from './Table';
import { Tooltip } from './Tooltip';
import { TooltipIcon } from './TooltipIcon';
import { cn } from '@/shared/utils/cn';
import type { DoctorManagement, AvailableScheduleDto, DayOfWeek, TimeSlotDto } from '@/shared/types/doctor';

interface DoctorManagementTableProps {
	doctors: DoctorManagement[];
	selectedDoctorId?: string;
	onRowClick?: (doctor: DoctorManagement) => void;
	className?: string;
	emptyState?: ReactNode;
}

// 진료 시간을 포맷팅하는 함수
function formatAvailableTime(schedule: AvailableScheduleDto): string {
	const dayMap: Record<DayOfWeek, string> = {
		monday: '월',
		tuesday: '화',
		wednesday: '수',
		thursday: '목',
		friday: '금',
		saturday: '토',
		sunday: '일',
	};

	const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	const result: string[] = ['진료 시간'];

	days.forEach((day) => {
		const slots = schedule[day];
		const dayLabel = dayMap[day];

		if (!slots || slots.length === 0) {
			result.push(`${dayLabel} : -`);
		} else {
			const timeRanges = slots
				.map((slot: TimeSlotDto) => `${slot.startTime} ~ ${slot.endTime}`)
				.join(' / ');
			result.push(`${dayLabel} : ${timeRanges}`);
		}
	});

	return result.join('\n');
}

export function DoctorManagementTable({
	doctors,
	selectedDoctorId,
	onRowClick,
	className,
	emptyState,
}: DoctorManagementTableProps) {
	const columns = useMemo<ColumnDef<DoctorManagement>[]>(
		() => [
			{
				accessorKey: 'name',
				header: '의사명',
				minSize: 200,
				cell: ({ row }) => (
					<div className="flex items-center">
						<span className="text-text-100 text-16 font-normal font-pretendard leading-normal truncate">
							{row.original.name}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'nameEn',
				header: '의사명 (영문)',
				minSize: 200,
				cell: ({ row }) => (
					<div className="flex items-center">
						<span className="text-text-100 text-16 font-normal font-pretendard leading-normal truncate">
							{row.original.nameEn}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'userId',
				header: '아이디',
				minSize: 180,
				cell: ({ row }) => (
					<div className="flex items-center">
						<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
							{row.original.userId}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'availableTimeDisplay',
				header: () => (
					<div className="flex items-center gap-1.5">
						<span>진료 가능 시간</span>
						<TooltipIcon
							content="목록에 있는 진료 가능 시간에 마우스 호버 시, 해당 의사에 대한 요일별 진료 가능 시간을 확인할 수 있습니다."
							position="bottom"
						/>
					</div>
				),
				minSize: 240,
				cell: ({ row }) => {
					const schedule = row.original.availableSchedule;
					const tooltipContent = formatAvailableTime(schedule);

					return (
						<Tooltip
							content={tooltipContent}
							className="!w-auto !min-w-[400px] !max-w-[600px]"
							contentClassName="!whitespace-pre"
						>
							{({ isOpen }) => (
								<div className="flex items-center cursor-pointer">
									<span
										className={cn(
											'text-16 font-pretendard leading-normal',
											isOpen ? 'text-text-100 font-bold' : 'text-text-100 font-normal',
										)}
									>
										{row.original.availableTimeDisplay}
									</span>
								</div>
							)}
						</Tooltip>
					);
				},
			},
			{
				accessorKey: 'isActive',
				header: '계정 활성화',
				minSize: 240,
				cell: ({ row }) => (
					<div className="flex items-center">
						<span
							className={cn(
								'text-16 font-normal font-pretendard leading-normal',
								row.original.isActive ? 'text-text-100' : 'text-text-40',
							)}
						>
							{row.original.isActive ? '활성화' : '비활성화'}
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
				data={doctors}
				columns={columns}
				enableSelection={true}
				selectedIds={selectedDoctorId ? new Set([selectedDoctorId]) : new Set()}
				onRowClick={(row) => onRowClick?.(row.original)}
				getRowId={(doctor) => doctor.id}
				getRowClassName={(row) => {
					const isSelected = selectedDoctorId === row.original.id;
					if (isSelected) {
						return 'bg-bg-blue hover:bg-bg-blue';
					}
					return 'bg-bg-white hover:bg-bg-gray';
				}}
				minWidth="1080px"
				emptyState={emptyState}
				disableScroll={true}
			/>
		</div>
	);
}

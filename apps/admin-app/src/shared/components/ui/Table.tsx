import React, { type ReactNode } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	flexRender,
} from '@tanstack/react-table';
import type { ColumnDef, Row, SortingState, ColumnResizeMode, VisibilityState } from '@tanstack/react-table';
import { cn } from '@/shared/utils/cn';
import { useState } from 'react';

interface TableProps<TData> {
	className?: string;
	colgroup?: ReactNode;
	// eslint-disable-next-line
	columns: ColumnDef<TData, any>[];
	data: TData[];
	disableHorizontalScroll?: boolean;
	disableScroll?: boolean;
	emptyState?: ReactNode;
	enableSelection?: boolean;
	enableColumnResizing?: boolean;
	getRowClassName?: (row: Row<TData>) => string;
	getRowId?: (row: TData) => string;
	minWidth?: string;
	onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
	onSelectionChange?: (selectedIds: Set<string>) => void;
	onSortingChange?: (sorting: SortingState) => void;
	// eslint-disable-next-line
	onTableReady?: (table: any) => void;
	selectedIds?: Set<string>;
	sorting?: SortingState;
	stickyHeader?: boolean;
}

const SortIcon = ({ isSorted }: { isSorted: false | 'asc' | 'desc' }) => {
	if (!isSorted) {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M8 4L11 7H5L8 4Z" fill="#C1C1C1" />
				<path d="M8 12L5 9H11L8 12Z" fill="#C1C1C1" />
			</svg>
		);
	}
	if (isSorted === 'asc') {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M8 4L11 7H5L8 4Z" fill="#1F1F1F" />
				<path d="M8 12L5 9H11L8 12Z" fill="#C1C1C1" />
			</svg>
		);
	}
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path d="M8 4L11 7H5L8 4Z" fill="#C1C1C1" />
			<path d="M8 12L5 9H11L8 12Z" fill="#1F1F1F" />
		</svg>
	);
};

const Table = <TData,>({
	className,
	colgroup,
	columns,
	data,
	disableHorizontalScroll = false,
	disableScroll = false,
	emptyState,
	enableSelection = false,
	enableColumnResizing = false,
	getRowClassName,
	// eslint-disable-next-line
	getRowId = (row: any) => row.id,
	minWidth = '800px',
	onRowClick,
	onSelectionChange,
	onSortingChange: externalOnSortingChange,
	onTableReady,
	selectedIds = new Set(),
	sorting: externalSorting,
	stickyHeader = false,
}: TableProps<TData>) => {
	const [internalSorting, setInternalSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnSizing, setColumnSizing] = useState({});

	// 안전하게 배열로 변환
	const sorting = Array.isArray(externalSorting)
		? externalSorting
		: externalSorting
			? []
			: internalSorting;
	const setSorting = externalOnSortingChange ?? setInternalSorting;

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			columnSizing,
		},
		onSortingChange: (updater) => {
			const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
			setSorting(newSorting);
		},
		onColumnVisibilityChange: setColumnVisibility,
		onColumnSizingChange: setColumnSizing,
		columnResizeMode: 'onChange' as ColumnResizeMode,
		enableColumnResizing,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	// Table 인스턴스를 외부로 전달
	React.useEffect(() => {
		if (onTableReady) {
			onTableReady(table);
		}
	}, [table, onTableReady]);

	const handleRowClick = (row: Row<TData>, event: React.MouseEvent) => {
		if (enableSelection && onSelectionChange) {
			const clickedId = getRowId(row.original);

			// 일반 클릭: 단일 선택 또는 토글
			if (selectedIds.size === 1 && selectedIds.has(clickedId)) {
				onSelectionChange(new Set()); // 같은 행 다시 클릭하면 선택 해제
			} else {
				onSelectionChange(new Set([clickedId]));
			}
		}

		// 기존 onRowClick 콜백도 실행
		onRowClick?.(row, event);
	};

	const getRowClassNameWithSelection = (row: Row<TData>) => {
		if (enableSelection && selectedIds.has(getRowId(row.original))) {
			return 'bg-bg-blue';
		}

		return getRowClassName?.(row) || '';
	};

	// 데이터가 없고 emptyState가 있는 경우
	if (table.getRowModel().rows.length === 0 && emptyState) {
		return (
			<div className={cn('w-full h-full flex flex-col', className)}>
				<div className={cn('w-full', stickyHeader ? '' : 'pt-4', 'px-3 sm:px-4 md:px-5')}>
					<table className="table-fixed w-full" style={{ minWidth }}>
						{colgroup}
						<thead
							className={cn(
								"relative border-t-0 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[0.5px] after:bg-stroke-input after:content-['']",
								stickyHeader && 'sticky top-0 z-10 bg-bg-white',
							)}
						>
							{stickyHeader && (
								<tr>
									<th
										className="h-4 bg-bg-white"
										colSpan={table.getAllColumns().length}
									></th>
								</tr>
							)}
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id} className="bg-bg-white">
									{headerGroup.headers.map((header) => {
										const canSort = header.column.getCanSort();
										const meta = header.column.columnDef.meta as
											| { align?: 'left' | 'center' | 'right'; truncate?: boolean }
											| undefined;

										return (
											<th
												key={header.id}
												className={cn(
													'h-6 bg-bg-white text-left relative',
													canSort && 'cursor-pointer select-none',
												)}
												style={{
													width: enableColumnResizing
														? header.getSize()
														: header.getSize() !== 150
															? header.getSize()
															: undefined,
													minWidth: header.column.columnDef.minSize,
													maxWidth: header.column.columnDef.maxSize,
												}}
												onClick={
													canSort
														? header.column.getToggleSortingHandler()
														: undefined
												}
											>
												{header.isPlaceholder ? null : (
													<div
														className={cn(
															'flex items-center gap-1.5 px-2.5',
														meta?.align === 'center' ? 'justify-center' : meta?.align === 'right' ? 'justify-end' : 'justify-start',
														)}
													>
														<span className="text-text-30 text-14 font-normal font-pretendard leading-normal">
															{flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
														</span>
														{canSort && (
															<SortIcon
																isSorted={header.column.getIsSorted()}
															/>
														)}
													</div>
												)}
												{enableColumnResizing && header.column.getCanResize() && (
													<div
														onMouseDown={header.getResizeHandler()}
														onTouchStart={header.getResizeHandler()}
														onDoubleClick={() => header.column.resetSize()}
														className={cn(
															'absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none',
															'hover:bg-primary-70 hover:w-[2px]',
															header.column.getIsResizing() && 'bg-primary-70 w-[2px]',
														)}
													/>
												)}
											</th>
										);
									})}
								</tr>
							))}
						</thead>
					</table>
				</div>
				<div className="flex-1 px-3 pb-3 sm:px-4 sm:pb-4 md:px-5 md:pb-5">
					{emptyState}
				</div>
			</div>
		);
	}

	return (
		<div className={cn('w-full h-full flex flex-col', disableScroll ? 'overflow-hidden' : 'overflow-auto', className)}>
			<div
				className={cn(
					'w-full flex-1',
					disableScroll ? 'overflow-hidden' : (disableHorizontalScroll ? 'overflow-x-hidden' : 'overflow-x-auto'),
					'px-5 pt-4 pb-4',
				)}
			>
				<table className="table-fixed w-full h-auto" style={{ minWidth }}>
					{colgroup}
					<thead
						className={cn(
							"relative border-t-0 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[0.5px] after:bg-stroke-input after:content-['']",
							stickyHeader && 'sticky top-0 z-10 bg-bg-white',
						)}
					>
						{stickyHeader && (
							<tr>
								<th
									className="h-4 bg-bg-white"
									colSpan={table.getAllColumns().length}
								></th>
							</tr>
						)}
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="bg-white">
								{headerGroup.headers.map((header) => {
									const canSort = header.column.getCanSort();
									const meta = header.column.columnDef.meta as
										| { align?: 'left' | 'center' | 'right'; truncate?: boolean }
										| undefined;

									return (
										<th
											key={header.id}
											className={cn(
												'h-6 bg-bg-white relative',
												meta?.align === 'center' ? 'text-center' : meta?.align === 'right' ? 'text-right' : 'text-left',
												canSort && 'cursor-pointer select-none',
											)}
											style={{
												width: enableColumnResizing
													? header.getSize()
													: header.getSize() !== 150
														? header.getSize()
														: undefined,
												minWidth: header.column.columnDef.minSize,
												maxWidth: header.column.columnDef.maxSize,
											}}
											onClick={
												canSort
													? header.column.getToggleSortingHandler()
													: undefined
											}
										>
											{header.isPlaceholder ? null : (
												<div
													className={cn(
														'flex items-center gap-1.5 px-2.5',
														meta?.align === 'center' ? 'justify-center' : meta?.align === 'right' ? 'justify-end' : 'justify-start',
													)}
												>
													<span className="text-text-30 text-14 font-normal font-pretendard leading-normal">
														{flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
													</span>
													{canSort && (
														<SortIcon
															isSorted={header.column.getIsSorted()}
														/>
													)}
												</div>
											)}
											{enableColumnResizing && header.column.getCanResize() && (
												<div
													onMouseDown={header.getResizeHandler()}
													onTouchStart={header.getResizeHandler()}
													onDoubleClick={() => header.column.resetSize()}
													className={cn(
														'absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none',
														'hover:bg-primary-70 hover:w-[2px]',
														header.column.getIsResizing() && 'bg-primary-70 w-[2px]',
													)}
												/>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody className="h-full">
						{table.getRowModel().rows.length === 0 && emptyState ? (
							<tr className="h-full">
								<td
									colSpan={table.getAllColumns().length}
									className="p-0 pt-5 h-full align-top"
								>
									{emptyState}
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map((row, index, array) => {
								const isSelected = enableSelection && selectedIds.has(getRowId(row.original));
								const isEven = index % 2 === 0;
								return (
								<tr
									key={row.id}
									onClick={(e) => handleRowClick(row, e)}
									className={cn(
										'border-b-[0.5px] border-stroke-input first:border-t-0 last:border-b-0 transition-colors tr',
										(onRowClick || enableSelection) && !isSelected && 'cursor-pointer hover:bg-[#F0F0F0]',
										(onRowClick || enableSelection) && isSelected && 'cursor-pointer',
										!isSelected && isEven && 'bg-bg-white',
									!isSelected && !isEven && 'bg-bg-gray',
										getRowClassNameWithSelection(row),
										index === array.length - 1 &&
											'[&>td:first-child]:rounded-bl-[10px] [&>td:last-child]:rounded-br-[10px]',
									)}
								>
									{row.getVisibleCells().map((cell) => {
										const meta = cell.column.columnDef.meta as
											| { align?: 'left' | 'center' | 'right'; height?: string; truncate?: boolean }
											| undefined;
										return (
											<td
												key={cell.id}
												className="h-[72px] overflow-hidden px-2.5"
												style={{
													width: enableColumnResizing
														? cell.column.getSize()
														: cell.column.getSize() !== 150
															? cell.column.getSize()
															: undefined,
													minWidth: cell.column.columnDef.minSize,
													maxWidth: cell.column.columnDef.maxSize,
												}}
											>
												<div
													className={cn(
														'flex items-center h-full min-w-0 overflow-hidden',
														meta?.align === 'center'
															? 'justify-center'
															: meta?.align === 'right'
																? 'justify-end'
																: 'justify-start',
													)}
												>
													<div className={cn('min-w-0 overflow-hidden', meta?.truncate && 'truncate', meta?.height && `h-[${meta?.height}]`)}>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</div>
												</div>
											</td>
										);
									})}
								</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Table;

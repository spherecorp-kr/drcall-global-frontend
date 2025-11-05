import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import Table from './Table';
import Button from './Button';
import Pagination from './Pagination';
import { Section } from './Section';
import { type PaymentHistoryItem } from '@/shared/types/payment';

interface PaymentHistoryTableProps {
  data: PaymentHistoryItem[];
  total: number;
  onExpand?: () => void;
  isExpanded?: boolean;
}

const paymentStatusLabels: Record<string, string> = {
  completed: '결제 완료',
  pending: '결제 대기',
};

const paymentMethodLabels: Record<string, string> = {
  QR: 'QR',
  card: '카드',
  bank_transfer: '계좌이체',
};

export function PaymentHistoryTable({ data, total, onExpand, isExpanded }: PaymentHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  const formatDatetime = (dateStr: string) => {
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

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const columns = useMemo<ColumnDef<PaymentHistoryItem>[]>(
    () => [
      {
        accessorKey: 'paymentNumber',
        header: '결제번호',
        enableSorting: true,
        size: 120,
        cell: ({ row }) => (
          <div className="text-text-100 text-16 font-normal font-pretendard">
            {row.original.paymentNumber}
          </div>
        ),
      },
      {
        accessorKey: 'appointmentNumber',
        header: '예약번호',
        enableSorting: true,
        size: 120,
        cell: ({ row }) => (
          <div className="text-text-100 text-16 font-normal font-pretendard">
            {row.original.appointmentNumber}
          </div>
        ),
      },
      {
        accessorKey: 'paymentRequestDatetime',
        header: '결제 요청 일시',
        enableSorting: true,
        size: 180,
        cell: ({ row }) => (
          <div className="text-text-100 text-16 font-normal font-pretendard">
            {formatDatetime(row.original.paymentRequestDatetime)}
          </div>
        ),
      },
      {
        accessorKey: 'paymentDatetime',
        header: '결제 일시',
        enableSorting: true,
        size: 180,
        cell: ({ row }) => (
          <div className="text-text-100 text-16 font-normal font-pretendard">
            {formatDatetime(row.original.paymentDatetime)}
          </div>
        ),
      },
      {
        accessorKey: 'paymentStatus',
        header: '결제 상태',
        enableSorting: true,
        size: 100,
        cell: ({ row }) => {
          const status = row.original.paymentStatus;
          const isPending = status === 'pending';
          return (
            <div
              className={`text-16 font-normal font-pretendard ${isPending ? 'text-system-successful2' : 'text-text-100'}`}
            >
              {paymentStatusLabels[status]}
            </div>
          );
        },
      },
      {
        accessorKey: 'paymentMethod',
        header: '결제 수단',
        enableSorting: true,
        size: 100,
        cell: ({ row }) => (
          <div className="text-text-100 text-16 font-normal font-pretendard">
            {row.original.paymentMethod ? paymentMethodLabels[row.original.paymentMethod] : '-'}
          </div>
        ),
      },
      {
        accessorKey: 'totalAmount',
        header: '결제 금액(A+B+C+D)',
        enableSorting: true,
        size: 180,
        cell: ({ row }) => (
          <div className="text-text-100 text-16 font-semibold font-pretendard">
            {row.original.totalAmount.toLocaleString()} THB
          </div>
        ),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'consultationFee',
        header: '진료비(A)',
        enableSorting: true,
        size: 110,
        cell: ({ row }) => (
          <div className="text-text-100 text-16 font-normal font-pretendard">
            {row.original.consultationFee.toLocaleString()}
          </div>
        ),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'prescriptionFee',
        header: '처방비(B)',
        enableSorting: true,
        size: 110,
        cell: ({ row }) => (
          <div className="text-text-100 text-16 font-normal font-pretendard">
            {row.original.prescriptionFee > 0 ? row.original.prescriptionFee.toLocaleString() : '-'}
          </div>
        ),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'serviceFee',
        header: '서비스비(C)',
        enableSorting: true,
        size: 110,
        cell: ({ row }) => (
          <div className="text-text-100 text-16 font-normal font-pretendard">
            {row.original.serviceFee.toLocaleString()}
          </div>
        ),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'deliveryFee',
        header: '배송비(D)',
        enableSorting: true,
        size: 110,
        cell: ({ row }) => (
          <div className="text-text-100 text-16 font-normal font-pretendard">
            {row.original.deliveryFee > 0 ? row.original.deliveryFee.toLocaleString() : '-'}
          </div>
        ),
        meta: { align: 'right' },
      },
      {
        id: 'actions',
        header: '액션',
        size: 120,
        cell: () => (
          <div className="flex justify-center">
            <Button variant="ghost" size="small">
              자세히 보기
            </Button>
          </div>
        ),
        meta: { align: 'center' },
      },
    ],
    []
  );

  return (
    <Section
      title="결제 내역"
      count={total}
      onExpand={onExpand}
      isExpanded={isExpanded}
      contentClassName="p-0"
      actions={
        <Button variant="outline" size="default" iconPosition="left" icon={<DownloadIcon />}>
          엑셀 다운로드
        </Button>
      }
    >
      <div className="[&>div]:!pb-0">
        <Table
          columns={columns}
          data={currentPageData}
          stickyHeader={false}
          enableSelection={true}
          selectedIds={selectedRowIds}
          onSelectionChange={setSelectedRowIds}
          getRowId={(row) => row.paymentNumber}
          getRowClassName={(row) =>
            row.index % 2 === 0
              ? 'bg-bg-white'
              : 'bg-bg-gray'
          }
        />
      </div>
      <div className="pb-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Section>
  );
}

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2.5V13.75M10 13.75L14.167 9.583M10 13.75L5.833 9.583"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 13.75V16.25C2.5 16.9404 3.05964 17.5 3.75 17.5H16.25C16.9404 17.5 17.5 16.9404 17.5 16.25V13.75"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

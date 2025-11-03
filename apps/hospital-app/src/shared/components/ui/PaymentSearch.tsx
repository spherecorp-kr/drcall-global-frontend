import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { SearchInput } from './SearchInput';
import Dropdown from './Dropdown';
import { Button } from './Button';

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#9CA3AF" strokeWidth="2"/>
    <path d="M3 10h18M8 2v4M16 2v4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8.33" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 10V13.33M10 6.67H10.0083"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C12.5 2.5 14.5 3.5 16 5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M16 2V5.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface PaymentSearchProps {
  onSearch?: (filters: {
    dateRange: { from: string; to: string };
    keyword: string;
    status: string;
    paymentMethod: string;
  }) => void;
}

export function PaymentSearch({ onSearch }: PaymentSearchProps) {
  const [period, setPeriod] = useState<string | null>('today');
  const [dateFrom, setDateFrom] = useState('2025.10.28');
  const [dateTo, setDateTo] = useState('2025.10.28');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const calculateDates = (periodValue: string) => {
    const today = new Date(2025, 9, 28);
    let startDate = new Date(today);

    switch (periodValue) {
      case 'today':
        break;
      case '1week':
        startDate.setDate(today.getDate() - 7);
        break;
      case '1month':
        startDate.setDate(today.getDate() - 30);
        break;
      case '3months':
        startDate.setDate(today.getDate() - 90);
        break;
      case '6months':
        startDate.setDate(today.getDate() - 180);
        break;
    }

    setDateFrom(formatDate(startDate));
    setDateTo(formatDate(today));
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    calculateDates(value);
  };

  const periodOptions = [
    { value: 'today', label: '오늘' },
    { value: '1week', label: '1주일' },
    { value: '1month', label: '1개월' },
    { value: '3months', label: '3개월' },
    { value: '6months', label: '6개월' },
  ];

  const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'completed', label: '결제 완료' },
    { value: 'pending', label: '결제 대기' },
  ];

  const paymentMethodOptions = [
    { value: 'all', label: '모든 결제 수단' },
    { value: 'QR', label: 'QR' },
    { value: 'card', label: '카드' },
    { value: 'bank_transfer', label: '계좌이체' },
  ];

  const handleSearch = () => {
    onSearch?.({
      dateRange: { from: dateFrom, to: dateTo },
      keyword,
      status,
      paymentMethod,
    });
  };

  const handleReset = () => {
    setPeriod('today');
    calculateDates('today');
    setKeyword('');
    setStatus('all');
    setPaymentMethod('all');
  };

  return (
    <div className="bg-bg-white rounded-[10px] border border-stroke-input p-5 flex flex-col gap-[10px]">
      {/* Date Range Section */}
      <div className="flex items-center gap-[10px]">
        <div className="w-[100px] flex items-center gap-1">
          <span className="text-text-100 text-16 font-normal font-pretendard">조회 기간</span>
          <div className="w-5 h-5 text-text-70">
            <InfoIcon />
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          <SegmentedControl
            options={periodOptions}
            value={period}
            onChange={handlePeriodChange}
            className="w-[464px] h-10"
          />
          <div className="flex items-center gap-[6px]">
            <div className="h-10 px-4 bg-bg-white rounded-lg border border-stroke-input flex items-center gap-2">
              <span className="text-text-100 text-16 font-normal font-pretendard">{dateFrom}</span>
              <CalendarIcon />
            </div>
            <span className="text-text-100 text-16 font-normal font-pretendard">~</span>
            <div className="h-10 px-4 bg-bg-white rounded-lg border border-stroke-input flex items-center gap-2">
              <span className="text-text-100 text-16 font-normal font-pretendard">{dateTo}</span>
              <CalendarIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div className="w-[100px]">
            <span className="text-text-100 text-16 font-normal font-pretendard">검색 필터</span>
          </div>
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            placeholder="예약번호 또는 결제번호를 입력해 주세요."
            className="w-[464px]"
          />
          <Dropdown
            options={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="전체"
            className="w-[130px]"
          />
          <Dropdown
            options={paymentMethodOptions}
            value={paymentMethod}
            onChange={setPaymentMethod}
            placeholder="모든 결제 수단"
            className="w-[160px]"
          />
        </div>
        <div className="flex items-center gap-[10px]">
          <button
            onClick={handleReset}
            className="h-7 px-3 rounded-lg flex items-center gap-2 hover:bg-bg-gray transition-colors"
          >
            <div className="w-5 h-5 text-text-40">
              <RefreshIcon />
            </div>
            <span className="text-text-40 text-14 font-normal font-pretendard">초기화</span>
          </button>
          <Button variant="primary" size="medium" onClick={handleSearch}>
            검색
          </Button>
        </div>
      </div>
    </div>
  );
}

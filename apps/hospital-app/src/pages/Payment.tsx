import { useState } from 'react';
import { PaymentStatCard } from '@/shared/components/ui/PaymentStatCard';
import { PaymentSearch } from '@/shared/components/ui/PaymentSearch';
import { PaymentHistoryTable } from '@/shared/components/ui/PaymentHistoryTable';
import { mockPaymentStats, mockPaymentHistory } from '@/mocks/paymentData';
import { type PaymentTab } from '@/shared/types/payment';
import InvoiceIcon from '@/shared/assets/icons/ic_invoice.svg?react';
import CoinsIcon from '@/shared/assets/icons/Coins.svg?react';
import PayWaitingIcon from '@/shared/assets/icons/ic_pay waiting.svg?react';
import ValidationInfoIcon from '@/shared/assets/icons/ic_validation_info.svg';

export function Payment() {
  const [activeTab, setActiveTab] = useState<PaymentTab>('history');
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className="flex flex-col gap-5">
            {/* Info Banner */}
            <div className="flex items-center gap-2 text-primary-60">
              <img src={ValidationInfoIcon} alt="info" className="w-3.5 h-3.5 flex-shrink-0" />
              <div className="text-14 font-normal font-pretendard">
                <span className="font-semibold">결제 내역은 환자 결제 기준(Gross)</span>으로 산출되며,{' '}
                <span className="font-semibold">실제 수령 금액은 정산 처리 탭</span>에서 확인 가능합니다.
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
              <div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
                <PaymentStatCard
                  title="총 청구 금액"
                  icon={<InvoiceIcon />}
                  amount={`${mockPaymentStats.totalBilled.toLocaleString()} THB`}
                  date={mockPaymentStats.asOfDate}
                  tooltip="선택한 기간 동안 환자에게 청구된 전체 금액입니다.(수수료 미포함 금액 기준)"
                />
              </div>
              <div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
                <PaymentStatCard
                  title="총 결제 완료 금액"
                  icon={<CoinsIcon />}
                  amount={`${mockPaymentStats.totalCompleted.toLocaleString()} THB`}
                  date={mockPaymentStats.asOfDate}
                  tooltip="선택한 기간 동안 환자가 결제를 완료한 총 금액입니다.(수수료 미포함 금액 기준)"
                />
              </div>
              <div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
                <PaymentStatCard
                  title="총 결제 대기 금액"
                  icon={<PayWaitingIcon />}
                  amount={`${mockPaymentStats.totalPending.toLocaleString()} THB`}
                  date={mockPaymentStats.asOfDate}
                  tooltip="선택한 기간 동안 청구되었으나 아직 결제되지 않은 금액의 합계입니다.(수수료 미포함 금액 기준)"
                />
              </div>
            </div>

            {/* Search Filters */}
            <PaymentSearch />

            {/* Payment History Table */}
            <PaymentHistoryTable
              data={mockPaymentHistory}
              total={480}
              onExpand={() => setIsTableExpanded(!isTableExpanded)}
              isExpanded={isTableExpanded}
            />
          </div>
        );
      case 'settlement':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-text-100 text-24 font-semibold font-pretendard">
              정산 처리 탭 (준비 중)
            </div>
          </div>
        );
      case 'report':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-text-100 text-24 font-semibold font-pretendard">
              매출 리포트 탭 (준비 중)
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-b-[#e0e0e0] flex flex-col h-20 items-start justify-end px-5 shrink-0">
        <div className="flex gap-10 h-12 items-start px-5 self-stretch shrink-0">
          <div
            className="cursor-pointer flex flex-col gap-4 items-start"
            onClick={() => setActiveTab('history')}
          >
            <h2
              className={`leading-normal text-xl ${
                activeTab === 'history'
                  ? 'font-semibold text-primary-70'
                  : 'font-normal text-text-100'
              }`}
            >
              결제 내역 조회
            </h2>
            {activeTab === 'history' && <div className="bg-primary-70 h-1 w-full" />}
          </div>
          <div
            className="cursor-pointer flex flex-col gap-4 items-start"
            onClick={() => setActiveTab('settlement')}
          >
            <h2
              className={`leading-normal text-xl ${
                activeTab === 'settlement'
                  ? 'font-semibold text-primary-70'
                  : 'font-normal text-text-100'
              }`}
            >
              정산 처리
            </h2>
            {activeTab === 'settlement' && <div className="bg-primary-70 h-1 w-full" />}
          </div>
          <div
            className="cursor-pointer flex flex-col gap-4 items-start"
            onClick={() => setActiveTab('report')}
          >
            <h2
              className={`leading-normal text-xl ${
                activeTab === 'report'
                  ? 'font-semibold text-primary-70'
                  : 'font-normal text-text-100'
              }`}
            >
              매출 리포트
            </h2>
            {activeTab === 'report' && <div className="bg-primary-70 h-1 w-full" />}
          </div>
        </div>
      </div>
      <div className="bg-bg-gray flex flex-1 flex-col gap-5 p-5">{renderTabContent()}</div>
    </div>
  );
}

export default Payment;

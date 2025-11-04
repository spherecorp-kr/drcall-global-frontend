import { useState } from 'react';
import { PaymentStatCard } from '@/shared/components/ui/PaymentStatCard';
import { PaymentSearch } from '@/shared/components/ui/PaymentSearch';
import { PaymentHistoryTable } from '@/shared/components/ui/PaymentHistoryTable';
import { SettlementTable } from '@/shared/components/ui/SettlementTable';
import { SettlementSearch } from '@/shared/components/ui/SettlementSearch';
import { SalesBarChart } from '@/shared/components/ui/SalesBarChart';
import { SalesDonutChart } from '@/shared/components/ui/SalesDonutChart';
import {
	mockPaymentStats,
	mockPaymentHistory,
	mockSettlementStats,
	mockSettlementHistory,
	mockDeliveryFeeHistory,
	mockSalesReportStats,
	mockSalesChartData,
	mockPaymentMethodData,
	mockSalesItemData,
} from '@/mocks/paymentData';
import { type PaymentTab } from '@/shared/types/payment';
import InvoiceIcon from '@/shared/assets/icons/ic_invoice.svg?react';
import CoinsIcon from '@/shared/assets/icons/Coins.svg?react';
import PayWaitingIcon from '@/shared/assets/icons/ic_pay waiting.svg?react';
import ValidationInfoIcon from '@/shared/assets/icons/ic_validation_info.svg';
import DeliveryUsageIcon from '@/shared/assets/icons/ic_delivery_usage.svg?react';
import PaymentCompletedIcon from '@/shared/assets/icons/ic_payment_completed.svg?react';
import PaymentCountIcon from '@/shared/assets/icons/ic_payment_count.svg?react';
import AverageAmountIcon from '@/shared/assets/icons/ic_average_amount.svg?react';

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
          <div className="flex flex-col gap-5">
            {/* Info Banner */}
            <div className="flex items-center gap-2 text-primary-60">
              <img src={ValidationInfoIcon} alt="info" className="w-3.5 h-3.5 flex-shrink-0" />
              <div className="text-14 font-normal font-pretendard">
                <span className="font-semibold">정산 권한은 수수료 처리 및 공제(Net) 기준으로 산정됩니다.</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-4">
              <div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
                <PaymentStatCard
                  title="정산 예정 금액"
                  icon={<InvoiceIcon />}
                  amount={`${mockSettlementStats.expectedAmount.toLocaleString()} THB`}
                  date={mockSettlementStats.asOfDate}
                />
              </div>
              <div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
                <PaymentStatCard
                  title="정산 완료 금액"
                  icon={<CoinsIcon />}
                  amount={`${mockSettlementStats.completedAmount.toLocaleString()} THB`}
                  date={mockSettlementStats.asOfDate}
                />
              </div>
              <div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
                <PaymentStatCard
                  title="배송 이용 금액 합계"
                  icon={<DeliveryUsageIcon />}
                  amount={`${mockSettlementStats.deliveryUsageAmount.toLocaleString()} THB`}
                  date={mockSettlementStats.asOfDate}
                />
              </div>
              <div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
                <PaymentStatCard
                  title="배송료 지급 완료 금액"
                  icon={<PaymentCompletedIcon />}
                  amount={`${mockSettlementStats.deliveryFeeCompletedAmount.toLocaleString()} THB`}
                  date={mockSettlementStats.asOfDate}
                />
              </div>
            </div>

            {/* Settlement Table with Internal Tabs */}
            <SettlementTable
              settlementData={mockSettlementHistory}
              deliveryData={mockDeliveryFeeHistory}
              settlementCount={124}
              deliveryCount={111}
            />
          </div>
        );
      case 'report':
        return (
          <div className="flex flex-col gap-5">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
              <div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
                <PaymentStatCard
                  title="총 매출 금액"
                  icon={<CoinsIcon />}
                  amount={`${mockSalesReportStats.totalSales.toLocaleString()} THB`}
                  date={mockSalesReportStats.dateRange}
                />
              </div>
              <div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
                <PaymentStatCard
                  title="결제 건수"
                  icon={<PaymentCountIcon />}
                  amount={`${mockSalesReportStats.paymentCount.toLocaleString()} 회`}
                  date={mockSalesReportStats.dateRange}
                />
              </div>
              <div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
                <PaymentStatCard
                  title="평균 결제 금액"
                  icon={<AverageAmountIcon />}
                  amount={`${mockSalesReportStats.averagePayment.toLocaleString()} THB/건`}
                  date={mockSalesReportStats.dateRange}
                />
              </div>
            </div>

            {/* Search Filters */}
            <SettlementSearch />

            {/* Sales Bar Chart */}
            <SalesBarChart
              data={mockSalesChartData}
              infoText="항목별 금액은 수수료 차감 후(Net)기준 입니다."
            />

            {/* Donut Charts */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
              <SalesDonutChart
                data={mockPaymentMethodData}
                title="결제 방법 비중"
                totalAmount={mockPaymentMethodData.reduce((sum, item) => sum + item.value, 0)}
                infoText="항목별 금액은 수수료 차감 후(Net)기준 입니다."
              />
              <SalesDonutChart
                data={mockSalesItemData}
                title="매출 항목 비중"
                totalAmount={mockSalesItemData.reduce((sum, item) => sum + item.value, 0)}
                infoText="항목별 금액은 수수료 차감 후(Net)기준 입니다."
              />
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

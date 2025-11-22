import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentStatCard } from '@/shared/components/ui/PaymentStatCard';
import { PaymentSearch } from '@/shared/components/ui/PaymentSearch';
import { PaymentHistoryTable } from '@/shared/components/ui/PaymentHistoryTable';
import { SettlementTable } from '@/shared/components/ui/SettlementTable';
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
import { SettlementSearch } from '@/shared/components/ui';

const Payment = () => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<PaymentTab>('history');
	const [isTableExpanded, setIsTableExpanded] = useState(false);

	const renderTabContent = () => {
		switch (activeTab) {
			case 'history':
				return (
					<div className="flex flex-col gap-5">
						{/* Info Banner */}
						<div className="flex items-center gap-2 text-primary-60">
							<img
								src={ValidationInfoIcon}
								alt={t('common.ariaLabels.info')}
								className="w-3.5 h-3.5 flex-shrink-0"
							/>
							<div className="text-14 font-normal font-pretendard">
								{t('payment.infoBanner.history')}
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
							<div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
								<PaymentStatCard
									title={t('payment.statCards.totalBilled')}
									icon={<InvoiceIcon />}
									amount={`${mockPaymentStats.totalBilled.toLocaleString()} THB`}
									date={mockPaymentStats.asOfDate}
									tooltip={t('payment.statCards.tooltips.totalBilled')}
								/>
							</div>
							<div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
								<PaymentStatCard
									title={t('payment.statCards.totalCompleted')}
									icon={<CoinsIcon />}
									amount={`${mockPaymentStats.totalCompleted.toLocaleString()} THB`}
									date={mockPaymentStats.asOfDate}
									tooltip={t('payment.statCards.tooltips.totalCompleted')}
								/>
							</div>
							<div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
								<PaymentStatCard
									title={t('payment.statCards.totalPending')}
									icon={<PayWaitingIcon />}
									amount={`${mockPaymentStats.totalPending.toLocaleString()} THB`}
									date={mockPaymentStats.asOfDate}
									tooltip={t('payment.statCards.tooltips.totalPending')}
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
				// TODO 의사 계정에서는 그냥 null 리턴
				return (
					<div className="flex flex-col gap-5">
						{/* Info Banner */}
						<div className="flex items-center gap-2 text-primary-60">
							<img
								src={ValidationInfoIcon}
								alt={t('common.ariaLabels.info')}
								className="w-3.5 h-3.5 flex-shrink-0"
							/>
							<div className="text-14 font-normal font-pretendard">
								{t('payment.infoBanner.settlement')}
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-4">
							<div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
								<PaymentStatCard
									title={t('payment.statCards.settlementExpected')}
									icon={<InvoiceIcon />}
									amount={`${mockSettlementStats.expectedAmount.toLocaleString()} THB`}
									date={mockSettlementStats.asOfDate}
								/>
							</div>
							<div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
								<PaymentStatCard
									title={t('payment.statCards.settlementCompleted')}
									icon={<CoinsIcon />}
									amount={`${mockSettlementStats.completedAmount.toLocaleString()} THB`}
									date={mockSettlementStats.asOfDate}
								/>
							</div>
							<div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
								<PaymentStatCard
									title={t('payment.statCards.deliveryUsageTotal')}
									icon={<DeliveryUsageIcon />}
									amount={`${mockSettlementStats.deliveryUsageAmount.toLocaleString()} THB`}
									date={mockSettlementStats.asOfDate}
								/>
							</div>
							<div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
								<PaymentStatCard
									title={t('payment.statCards.deliveryFeeCompleted')}
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
									title={t('payment.statCards.totalSales')}
									icon={<CoinsIcon />}
									amount={`${mockSalesReportStats.totalSales.toLocaleString()} THB`}
									date={mockSalesReportStats.dateRange}
								/>
							</div>
							<div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
								<PaymentStatCard
									title={t('payment.statCards.paymentCount')}
									icon={<PaymentCountIcon />}
									amount={`${mockSalesReportStats.paymentCount.toLocaleString()} ${t('common.units.count')}`}
									date={mockSalesReportStats.dateRange}
								/>
							</div>
							<div className="rounded-[10px] border border-stroke-input bg-bg-white px-7 py-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
								<PaymentStatCard
									title={t('payment.statCards.averagePayment')}
									icon={<AverageAmountIcon />}
									amount={`${mockSalesReportStats.averagePayment.toLocaleString()} THB/${t('common.units.count')}`}
									date={mockSalesReportStats.dateRange}
								/>
							</div>
						</div>

						<SettlementSearch />
						{/* Search Filters */}

						{/* Sales Bar Chart */}
						<SalesBarChart data={mockSalesChartData} infoText={t('payment.charts.infoText')} />

						{/* Donut Charts */}
						<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
							<SalesDonutChart
								data={mockPaymentMethodData}
								title={t('payment.charts.paymentMethodShare')}
								totalAmount={mockPaymentMethodData.reduce((sum, item) => sum + item.value, 0)}
								infoText={t('payment.charts.infoText')}
							/>
							<SalesDonutChart
								data={mockSalesItemData}
								title={t('payment.charts.salesItemShare')}
								totalAmount={mockSalesItemData.reduce((sum, item) => sum + item.value, 0)}
								infoText={t('payment.charts.infoText')}
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
							{t('payment.tabs.history')}
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
							{t('payment.tabs.settlement')}
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
							{t('payment.tabs.report')}
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
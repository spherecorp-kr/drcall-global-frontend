import { useState } from 'react';
import { PaymentStatCard } from '@/shared/components/ui/PaymentStatCard';
import { PaymentSearch } from '@/shared/components/ui/PaymentSearch';
import { PaymentHistoryTable } from '@/shared/components/ui/PaymentHistoryTable';
import { mockPaymentStats, mockPaymentHistory } from '@/mocks/paymentData';
import { type PaymentTab } from '@/shared/types/payment';

const InvoiceIcon = () => (
	<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
		<path d="M4 4h20v20l-3-2-2 2-2-2-2 2-2-2-2 2-2-2-3 2V4z" stroke="#3B82F6" strokeWidth="2" fill="none"/>
		<path d="M8 10h12M8 14h8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
	</svg>
);

const CoinsIcon = () => (
	<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
		<circle cx="11" cy="14" r="7" stroke="#3B82F6" strokeWidth="2" fill="none"/>
		<circle cx="17" cy="11" r="7" stroke="#3B82F6" strokeWidth="2" fill="none"/>
	</svg>
);

const PayWaitingIcon = () => (
	<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
		<circle cx="14" cy="14" r="10" stroke="#3B82F6" strokeWidth="2" fill="none"/>
		<path d="M14 8v6l4 4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
	</svg>
);

const InfoIcon = () => (
	<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
		<circle cx="6.5" cy="6.5" r="5.5" stroke="#3B82F6" strokeWidth="1"/>
		<path d="M6.5 6v3M6.5 4h.01" stroke="#3B82F6" strokeWidth="1" strokeLinecap="round"/>
	</svg>
);

export function Payment() {
	const [activeTab, setActiveTab] = useState<PaymentTab>('history');
	const [isTableExpanded, setIsTableExpanded] = useState(false);

	const renderTabContent = () => {
		switch (activeTab) {
			case 'history':
				return (
					<div className="flex flex-col gap-5">
						{/* Info Banner */}
						<div className="flex items-center gap-1 text-primary-60">
							<InfoIcon />
							<div className="text-14 font-normal font-pretendard">
								<span className="font-semibold">결제 내역은 환자 결제 기준(Gross)</span>으로 산출되며,{' '}
								<span className="font-semibold">실제 수령 금액은 정산 처리 탭</span>에서 확인 가능합니다.
							</div>
						</div>

						{/* Stats Cards */}
						<div className="flex gap-4">
							<PaymentStatCard
								title="총 청구 금액"
								icon={<InvoiceIcon />}
								amount={`${mockPaymentStats.totalBilled.toLocaleString()} THB`}
								date={mockPaymentStats.asOfDate}
								tooltip="선택한 기간 동안 환자에게 청구된 전체 금액입니다.(수수료 미포함 금액 기준)"
							/>
							<PaymentStatCard
								title="총 결제 완료 금액"
								icon={<CoinsIcon />}
								amount={`${mockPaymentStats.totalCompleted.toLocaleString()} THB`}
								date={mockPaymentStats.asOfDate}
								tooltip="선택한 기간 동안 환자가 결제를 완료한 총 금액입니다.(수수료 미포함 금액 기준)"
							/>
							<PaymentStatCard
								title="총 결제 대기 금액"
								icon={<PayWaitingIcon />}
								amount={`${mockPaymentStats.totalPending.toLocaleString()} THB`}
								date={mockPaymentStats.asOfDate}
								tooltip="선택한 기간 동안 청구되었으나 아직 결제되지 않은 금액의 합계입니다.(수수료 미포함 금액 기준)"
							/>
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
		<div className="relative flex flex-col h-full overflow-hidden">
			{/* Expanded Table Modal */}
			{isTableExpanded && (
				<>
					<div
						className="absolute inset-0 z-30 bg-neutral-950/40 backdrop-blur-sm"
						onClick={() => setIsTableExpanded(false)}
					/>
					<div className="absolute inset-0 z-40 flex h-full w-full flex-col overflow-hidden bg-bg-gray shadow-xl">
						<div className="h-full w-full overflow-auto p-5">
							<PaymentHistoryTable
								data={mockPaymentHistory}
								total={480}
								onExpand={() => setIsTableExpanded(false)}
								isExpanded={true}
							/>
						</div>
					</div>
				</>
			)}

			{/* Tab Header */}
			<div className="bg-white border-b border-b-[#e0e0e0] flex flex-col h-20 items-start justify-end px-5 shrink-0">
				<div className="flex gap-10 h-12 items-start px-5 self-stretch shrink-0">
					<div
						className="cursor-pointer flex flex-col gap-4 items-start"
						onClick={() => setActiveTab('history')}
					>
						<h2
							className={`leading-normal text-xl font-pretendard ${
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
							className={`leading-normal text-xl font-pretendard ${
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
							className={`leading-normal text-xl font-pretendard ${
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

			{/* Tab Content */}
			<div className={`bg-bg-gray flex flex-1 flex-col gap-5 p-5 overflow-auto ${isTableExpanded ? 'pointer-events-none select-none opacity-30' : ''}`}>
				{renderTabContent()}
			</div>
		</div>
	);
}

export default Payment;
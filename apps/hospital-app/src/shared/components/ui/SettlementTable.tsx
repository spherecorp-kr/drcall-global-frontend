import { useState, useEffect } from 'react';
import { SettlementHistoryTable } from './SettlementHistoryTable';
import { DeliveryFeeTable } from './DeliveryFeeTable';
import { SettlementSearch } from './SettlementSearch';
import type { SettlementHistoryItem, DeliveryFeeItem } from '@/shared/types/payment';

type SettlementTab = 'settlement' | 'delivery';

interface SettlementTableProps {
	settlementData: SettlementHistoryItem[];
	deliveryData: DeliveryFeeItem[];
	settlementCount: number;
	deliveryCount: number;
}

export function SettlementTable({
	settlementData,
	deliveryData,
	settlementCount,
	deliveryCount,
}: SettlementTableProps) {
	const [activeTab, setActiveTab] = useState<SettlementTab>('settlement');
	const [searchKey, setSearchKey] = useState(0);

	const settlementStatusOptions = [
		{ value: 'all', label: '전체' },
		{ value: 'completed', label: '완료' },
		{ value: 'scheduled', label: '예정' },
		{ value: 'onHold', label: '보류' },
		{ value: 'confirmed', label: '확정' },
	];

	const deliveryStatusOptions = [
		{ value: 'all', label: '전체' },
		{ value: 'completed', label: '완료' },
		{ value: 'scheduled', label: '예정' },
	];

	useEffect(() => {
		setSearchKey((prev) => prev + 1);
	}, [activeTab]);

	return (
		<div className="flex flex-col gap-5">
			{/* Search Filters */}
			<SettlementSearch
				key={searchKey}
				statusOptions={activeTab === 'settlement' ? settlementStatusOptions : deliveryStatusOptions}
			/>

			<div className="flex flex-col h-full">
				{/* Tab Buttons */}
				<div className="flex">
					<button
						type="button"
						className={`w-[240px] h-12 px-4 text-18 font-pretendard border border-stroke-input outline outline-1 outline-stroke-input outline-offset-[-1px] rounded-tl-lg flex items-center justify-center ${
							activeTab === 'settlement'
								? 'bg-primary-70 !text-white font-semibold'
								: 'bg-white text-text-100 font-normal'
						}`}
						onClick={() => setActiveTab('settlement')}
					>
						정산내역({settlementCount})
					</button>
					<button
						type="button"
						className={`w-[240px] h-12 px-4 text-18 font-pretendard border border-stroke-input outline outline-1 outline-stroke-input outline-offset-[-1px] rounded-tr-lg flex items-center justify-center ${
							activeTab === 'delivery'
								? 'bg-primary-70 !text-white font-semibold'
								: 'bg-white text-text-100 font-normal'
						}`}
						onClick={() => setActiveTab('delivery')}
					>
						배송 이용 금액({deliveryCount})
					</button>
				</div>

				{/* Tab Content */}
				<div className="flex-1 overflow-hidden">
					{activeTab === 'settlement' ? (
						<SettlementHistoryTable data={settlementData} />
					) : (
						<DeliveryFeeTable data={deliveryData} />
					)}
				</div>
			</div>
		</div>
	);
}

export default SettlementTable;

import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SettlementHistoryTable } from './SettlementHistoryTable';
import { DeliveryFeeTable } from './DeliveryFeeTable';
import type { SettlementHistoryItem, DeliveryFeeItem } from '@/shared/types/payment';
import { SettlementSearch } from '@/shared/components/ui/';

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
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<SettlementTab>('settlement');
	const [searchKey, setSearchKey] = useState(0);

	const settlementStatusOptions = useMemo(
		() => [
			{ value: 'all', label: t('payment.search.filter.status.all') },
			{ value: 'completed', label: t('payment.search.filter.status.completed') },
			{ value: 'scheduled', label: t('payment.search.filter.status.scheduled') },
			{ value: 'onHold', label: t('payment.search.filter.status.onHold') },
			{ value: 'confirmed', label: t('payment.search.filter.status.confirmed') },
		],
		[t],
	);

	const deliveryStatusOptions = useMemo(
		() => [
			{ value: 'all', label: t('payment.search.filter.status.all') },
			{ value: 'completed', label: t('payment.search.filter.status.completed') },
			{ value: 'scheduled', label: t('payment.search.filter.status.scheduled') },
		],
		[t],
	);

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
						{t('payment.settlementTable.tabs.settlement')}({settlementCount})
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
						{t('payment.settlementTable.tabs.delivery')}({deliveryCount})
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

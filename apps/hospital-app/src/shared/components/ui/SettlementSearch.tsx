import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, SearchInput, SegmentedControl } from '@/shared/components/ui';
import { Tooltip } from './Tooltip';
import CalendarIcon from '@/shared/assets/icons/Calendar_Days.svg?react';
import helpIcon from '@/shared/assets/icons/btn_circle_help.svg';
import helpIconBlue from '@/shared/assets/icons/btn_circle_help_blue.svg';
import RefreshIcon from '@/shared/assets/icons/ic_ reset.svg?react';

interface SettlementSearchProps {
	statusOptions?: Array<{ value: string; label: string }>;
}

const SettlementSearch = ({ statusOptions: customStatusOptions }: SettlementSearchProps = {}) => {
	const { t } = useTranslation();
	const [period, setPeriod] = useState<string>('today');
	const [dateFrom, setDateFrom] = useState('2025.10.28');
	const [dateTo, setDateTo] = useState('2025.10.28');
	const [keyword, setKeyword] = useState('');
	const [status, setStatus] = useState('all');

	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}.${month}.${day}`;
	};

	const calculateDates = (periodValue: string) => {
		const today = new Date(2025, 9, 28);
		const startDate = new Date(today);

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

	const periodOptions = useMemo(
		() => [
			{ value: 'today', label: t('payment.search.period.options.today') },
			{ value: '1week', label: t('payment.search.period.options.1week') },
			{ value: '1month', label: t('payment.search.period.options.1month') },
			{ value: '3months', label: t('payment.search.period.options.3months') },
			{ value: '6months', label: t('payment.search.period.options.6months') },
		],
		[t],
	);

	const defaultStatusOptions = useMemo(
		() => [
			{ value: 'all', label: t('payment.search.filter.status.all') },
			{ value: 'completed', label: t('payment.search.filter.status.completed') },
			{ value: 'scheduled', label: t('payment.search.filter.status.scheduled') },
			{ value: 'onHold', label: t('payment.search.filter.status.onHold') },
			{ value: 'confirmed', label: t('payment.search.filter.status.confirmed') },
		],
		[t],
	);

	const statusOptions = customStatusOptions || defaultStatusOptions;

	const handleReset = () => {
		setPeriod('today');
		calculateDates('today');
		setKeyword('');
		setStatus('all');
	};

	return (
		<div className="bg-bg-white rounded-[10px] border border-stroke-input p-3 sm:p-4 md:p-5 flex flex-col gap-3 sm:gap-4 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
			{/* Date Range Section */}
			<div className="flex items-center gap-[10px]">
				<div className="w-[100px] flex items-center gap-1">
					<span className="text-text-100 text-16 font-normal font-pretendard">
						{t('payment.search.period.label')}
					</span>
					<Tooltip
						content={
							<p className="whitespace-pre-line">
								{t('payment.search.period.tooltip')}
							</p>
						}
						position="bottom"
						className="w-[400px]"
					>
						{({ isOpen }) => (
							<button type="button" className="flex items-center justify-center w-5 h-5">
								{isOpen ? (
									<img alt="Help icon blue" className="w-5 h-5" src={helpIconBlue} />
								) : (
									<img alt="Help icon" className="w-5 h-5" src={helpIcon} />
								)}
							</button>
						)}
					</Tooltip>
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
						<span className="text-text-100 text-16 font-normal font-pretendard">
							{t('payment.search.filter.label')}
						</span>
					</div>
					<SearchInput
						value={keyword}
						onChange={setKeyword}
						placeholder={t('payment.search.filter.placeholder')}
						className="w-[464px]"
					/>
					<Dropdown
						options={statusOptions}
						value={status}
						onChange={setStatus}
						placeholder={t('payment.search.filter.status.all')}
						className="w-40"
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
						<span className="text-text-40 text-14 font-normal font-pretendard">
							{t('payment.search.buttons.reset')}
						</span>
					</button>
					<Button variant="primary" size="default">
						{t('payment.search.buttons.search')}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SettlementSearch;

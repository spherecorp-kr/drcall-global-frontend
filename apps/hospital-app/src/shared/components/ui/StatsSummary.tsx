import { type ReactNode, useState } from 'react';
import { Tooltip } from './Tooltip';
import { SectionTitle } from './SectionTitle';
import { cn } from '@/shared/utils/cn';
import refreshIcon from '@/shared/assets/icons/btn_refresh_grey.svg';
import helpIcon from '@/shared/assets/icons/btn_circle_help.svg';
import helpIconBlue from '@/shared/assets/icons/btn_circle_help_blue.svg';
import doctorsOfficeIcon from '@/shared/assets/icons/ic_doctors_office_blue.svg';
import invoiceIcon from '@/shared/assets/icons/ic_invoice_blue.svg';
import appointmentIcon from '@/shared/assets/icons/ic_appointment_blue.svg';
import newPatientIcon from '@/shared/assets/icons/ic_new_paient_blue.svg';
import arrowUpIcon from '@/shared/assets/icons/ic_line_arrow_up_blue.svg';
import arrowDownIcon from '@/shared/assets/icons/ic_line_arrow_down_red.svg';
import { useTranslation } from 'react-i18next';
import { formatDDMMYYYYHHMMSS } from '@/shared/utils/commonScripts';

interface SummaryStat {
	change: string;
	icon: ReactNode;
	trend: 'up' | 'down';
}

interface StatCardProps extends SummaryStat {
	description: string;
	label: string;
	tooltip: string;
	value: string;
}

const summaryStats: SummaryStat[] = [
	{
		change: '+ 8',
		icon: <img alt="Doctor's office icon" className="h-7 w-7" src={doctorsOfficeIcon} />,
		trend: 'up',
	},
	{
		icon: <img alt="Invoice icon" className="h-7 w-7" src={invoiceIcon} />,
		change: '+ 4,000',
		trend: 'up',
	},
	{
		icon: <img alt="AppointmentIcon icon" className="h-7 w-7" src={appointmentIcon} />,
		change: '- 80',
		trend: 'down',
	},
	{
		icon: <img alt="New patient icon" className="h-7 w-7" src={newPatientIcon} />,
		change: '+ 4,000',
		trend: 'up',
	},
];

function StatCard({ change, description, icon, label, tooltip, trend, value }: StatCardProps) {
	const changeColor = trend === 'up' ? 'text-primary-70' : 'text-system-error';

	return (
		<div className="flex h-full flex-1 items-center gap-3 sm:gap-5 min-w-0">
			<div className="flex h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] flex-shrink-0 items-center justify-center rounded-full bg-bg-blue text-primary-70">
				{icon}
			</div>
			<div className="flex flex-1 flex-col gap-1 sm:gap-2 min-w-0">
				<div className="flex items-center gap-1 text-13 font-semibold text-text-70">
					<span>{label}</span>
					<Tooltip content={tooltip} position="bottom">
						{({ isOpen }) => (
							<button className="flex items-center justify-center">
								{isOpen ? (
									<img
										alt="Help icon blue"
										className="h-5 w-5"
										src={helpIconBlue}
									/>
								) : (
									<img alt="Help icon" className="h-5 w-5" src={helpIcon} />
								)}
							</button>
						)}
					</Tooltip>
				</div>
				<div className="flex items-center gap-1 sm:gap-2 flex-wrap">
					<span className="text-18 sm:text-24 font-medium text-text-100 whitespace-nowrap">
						{value}
					</span>
					<div
						className={cn(
							'flex items-center gap-0.5 text-14 sm:text-16 font-normal',
							changeColor,
						)}
					>
						<img
							alt={`Arrow ${trend} icon`}
							className="h-4 w-4 sm:h-5 sm:w-5"
							src={trend === 'up' ? arrowUpIcon : arrowDownIcon}
						/>
						<span>{change.replace(/[+-]\s*/, '')}</span>
					</div>
				</div>
				<span className="text-11 sm:text-12 font-medium text-text-70 truncate">
					({description})
				</span>
			</div>
		</div>
	);
}

const todayCount: string = 'dashboard.section.summary.card.todayCount';
const todaySales: string = 'dashboard.section.summary.card.todaySales';
const monthlyCount: string = 'dashboard.section.summary.card.monthlyCount';
const monthlyNewPatient: string = 'dashboard.section.summary.card.monthlyNewPatient';

const StatsSummary = () => {
	const { t } = useTranslation();
	const [lastUpdated, setLastUpdated] = useState<string>(() => formatDDMMYYYYHHMMSS(new Date()));

	const handleRefresh = () => {
		setLastUpdated(formatDDMMYYYYHHMMSS(new Date()));
	};

	return (
		<div className="flex flex-col gap-3">
			{/* Header */}
			<div className="flex items-center justify-between">
				<SectionTitle>{t('dashboard.section.summary.title')}</SectionTitle>
				<div className="flex items-center gap-2 text-14 text-text-60">
					<img
						alt="Refresh icon"
						className="h-5 w-5 cursor-pointer"
						onClick={handleRefresh}
						src={refreshIcon}
					/>
					<span>{lastUpdated}</span>
				</div>
			</div>

			{/* Content */}
			<div className="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-2">
				{/* First group: 오늘 예약 건수 + 오늘 총 매출 */}
				<div className="flex flex-col gap-7 rounded-[10px] border border-stroke-input bg-bg-white p-3 sm:p-4 md:p-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-10">
						<StatCard
							{...summaryStats[0]}
							description={t(`${todayCount}.description`)}
							label={t(`${todayCount}.label`)}
							tooltip={t(`${todayCount}.tooltip`)}
							value={t(`${todayCount}.value`, { value: '300' })}
						/>
						<StatCard
							{...summaryStats[1]}
							description={t(`${todaySales}.description`)}
							label={t(`${todaySales}.label`)}
							tooltip={t(`${todaySales}.tooltip`)}
							value={t(`${todaySales}.value`, { value: '52,000' })}
						/>
					</div>
				</div>

				{/* Second group: 이번 달 예약 건수 + 이번달 신규 환자 */}
				<div className="flex flex-col gap-7 rounded-[10px] border border-stroke-input bg-bg-white p-3 sm:p-4 md:p-5 shadow-[0px_4px_30px_rgba(0,0,0,0.04)]">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-10">
						<StatCard
							{...summaryStats[2]}
							description={t(`${monthlyCount}.description`)}
							label={t(`${monthlyCount}.label`)}
							tooltip={t(`${monthlyCount}.tooltip`)}
							value={t(`${monthlyCount}.value`, { value: '300' })}
						/>
						<StatCard
							{...summaryStats[3]}
							description={t(`${monthlyNewPatient}.description`)}
							label={t(`${monthlyNewPatient}.label`)}
							tooltip={t(`${monthlyNewPatient}.tooltip`)}
							value={t(`${monthlyNewPatient}.value`, { value: '5,000' })}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StatsSummary;
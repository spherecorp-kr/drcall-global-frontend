import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PhrContentsProps } from '@/shared/types/phr';
import { SegmentedControl } from '@/shared/components/ui';
import { MonthlyPhr, WeeklyPhr } from '@/shared/components/ui/patient/phr';

const Contents = ({ patientkey, phrType }: PhrContentsProps) => {
	const { t } = useTranslation();

	const [viewMode, setViewMode] = useState('weekly');

	const viewOptions = useMemo(() => [
		{ value: 'weekly', label: t('phr.lbl.weekly') },
		{ value: 'monthly', label: t('phr.lbl.monthly') },
	], [t]);

	return (
		<div className='max-h-[70dvh] min-h-0 overflow-y-auto'>
			<div className="flex flex-col gap-5">
				<SegmentedControl
					buttonClassName="rounded"
					className="mx-auto my-0 rounded w-40"
					onChange={setViewMode}
					options={viewOptions}
					value={viewMode}
				/>
				<div className="flex flex-col gap-5">
					{viewMode === 'weekly'
						? <WeeklyPhr patientkey={patientkey} phrType={phrType} />
						: <MonthlyPhr patientkey={patientkey} phrType={phrType} />
					}
				</div>
			</div>
		</div>
	);
};

export default Contents;
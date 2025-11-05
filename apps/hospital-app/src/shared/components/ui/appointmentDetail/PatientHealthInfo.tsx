import { useCallback } from 'react';
import { Button } from '@/shared/components/ui';
import icWeight from '@/assets/icons/ic_weight.png';
import icHeart from '@/assets/icons/ic_heart.png';
import icDroplet from '@/assets/icons/ic_droplet.png';
import icTemperature from '@/assets/icons/ic_temperature.png';
import { useDialog } from '@/shared/hooks/useDialog.ts';
import { WeeklyPhr } from '@/shared/components/ui/patient/phi';

const MoreIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
		<path d="M10 13L13.5355 9.46445L10 5.92891" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

interface Props {
	height?: string;
	weight?: string;
	bmi?: string;
	bloodPressure?: string;
	bloodSugar?: string;
	temperature?: string;
}

const PatientHealthInfo = ({ height, weight, bmi, bloodPressure, bloodSugar, temperature }: Props) => {
	const { openDialog } = useDialog();

	const openWeightDetailDialog = useCallback(() => {
		openDialog({
			dialogClass: 'w-[36.25rem]',
			dialogContents: <WeeklyPhr patientkey={1} phrType='weight' />,
			dialogId: 'weightChartDialog',
			dialogTitle: '키/몸무게/BMI',
			hasCloseButton: true
		});
	}, [openDialog]);

	return (
		<div className="flex flex-1 flex-col gap-2.5 items-start self-stretch">
			<h2 className="font-semibold leading-normal text-text-100 text-xl">환자 건강정보</h2>
			<div className="bg-white border border-stroke-input flex flex-col gap-2 h-full items-start p-5 rounded-[0.625rem] w-full">
				{/* 키/몸무게/BMI */}
				<div className="flex gap-2.5 items-start self-stretch">
					<div className="flex gap-2 items-center w-[12.5rem]">
						<img alt='weight' className='h-6 w-6' src={icWeight} />
						<p className="flex-1 font-normal text-base text-text-70">키/몸무게/BMI</p>
					</div>
					<div className="flex flex-1 gap-2.5 items-start">
						<div className="flex flex-1 flex-col gap-1 items-start">
							<p className="font-normal text-base text-text-100">
								<b>{height}</b>&nbsp;cm / <b>{weight}</b>&nbsp;kg / <b>{bmi}</b>&nbsp;BMI
							</p>
							<p className="font-normal text-sm text-text-70">22/06/2023 15:12:14</p>
						</div>
						<Button
							icon={<MoreIcon />}
							iconPosition="right"
							onClick={openWeightDetailDialog}
							size="small"
							variant="ghost">자세히 보기</Button>
					</div>
				</div>
				{/* 혈압 */}
				<div className="flex gap-2.5 items-start self-stretch">
					<div className="flex gap-2 items-center w-[12.5rem]">
						<img alt='heart' className='h-6 w-6' src={icHeart} />
						<p className="flex-1 font-normal text-base text-text-70">혈압</p>
					</div>
					<div className="flex flex-1 gap-2.5 items-start">
						<div className="flex flex-1 flex-col gap-1 items-start">
							<p className="font-normal text-base text-text-100">
								<b>{bloodPressure}</b>&nbsp;mmHg / <b>80</b>&nbsp;BPM
							</p>
							<p className="font-normal text-sm text-text-70">22/06/2023 15:12:14</p>
						</div>
						<Button size="small" variant="ghost" icon={<MoreIcon />} iconPosition="right">
							자세히 보기
						</Button>
					</div>
				</div>
				{/* 혈당 */}
				<div className="flex gap-2.5 items-start self-stretch">
					<div className="flex gap-2 items-center w-[12.5rem]">
						<img alt='droplet' className='h-6 w-6' src={icDroplet} />
						<p className="flex-1 font-normal text-base text-text-70">혈당</p>
					</div>
					<div className="flex flex-1 gap-2.5 items-start">
						<div className="flex flex-1 flex-col gap-1 items-start">
							<p className="font-normal text-base text-text-100">
								Before Breakfast : <b>{bloodSugar}</b>&nbsp;mg/dl
							</p>
							<p className="font-normal text-sm text-text-70">22/06/2023 15:12:14</p>
						</div>
						<Button size="small" variant="ghost" icon={<MoreIcon />} iconPosition="right">
							자세히 보기
						</Button>
					</div>
				</div>
				{/* 체온 */}
				<div className="flex gap-2.5 items-start self-stretch">
					<div className="flex gap-2 items-center w-[12.5rem]">
						<img alt='temperature' className='h-6 w-6' src={icTemperature} />
						<p className="flex-1 font-normal text-base text-text-70">체온</p>
					</div>
					<div className="flex flex-1 gap-2.5 items-start">
						<div className="flex flex-1 flex-col gap-1 items-start">
							<p className="font-normal text-base text-text-100">
								<b>{temperature}</b>&nbsp;&deg;C
							</p>
							<p className="font-normal text-sm text-text-70">22/06/2023 15:12:14</p>
						</div>
						<Button size="small" variant="ghost" icon={<MoreIcon />} iconPosition="right">
							자세히 보기
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PatientHealthInfo;
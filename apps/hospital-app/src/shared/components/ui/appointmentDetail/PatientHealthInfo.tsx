import { Button } from '@/shared/components/ui';
import icWeight from '@/assets/icons/ic_weight.png';
import icHeart from '@/assets/icons/ic_heart.png';
import icDroplet from '@/assets/icons/ic_droplet.png';
import icTemperature from '@/assets/icons/ic_temperature.png';

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
	return (
		<div className="flex flex-1 flex-col gap-2.5 items-start self-stretch">
			<h2 className="font-semibold leading-normal text-text-100 text-xl">환자 건강정보</h2>
			<div className="w-full h-full p-5 bg-white rounded-[10px] border border-stroke-input flex flex-col items-start gap-2">
				{/* 키/몸무게/BMI */}
				<div className="self-stretch flex items-start gap-2.5">
					<div className="w-[200px] flex items-center gap-2">
						<img alt='weight' className='h-6 w-6' src={icWeight} />
						<div className="flex-1 text-text-70 text-base font-normal">키/몸무게/BMI</div>
					</div>
					<div className="flex-1 flex items-start gap-2.5">
						<div className="flex-1 flex flex-col items-start gap-1">
							<div className="text-text-100 text-base font-normal">
								<span className="font-bold">{height} </span>cm / <span className="font-bold">{weight} </span>kg / <span className="font-bold">{bmi} </span>BMI
							</div>
							<div className="text-text-70 text-sm font-normal">22/06/2023 15:12:14</div>
						</div>
						<Button size="small" variant="ghost" icon={<MoreIcon />} iconPosition="right">
							자세히 보기
						</Button>
					</div>
				</div>
				{/* 혈압 */}
				<div className="self-stretch flex items-start gap-2.5">
					<div className="w-[200px] flex items-center gap-2">
						<img alt='heart' className='h-6 w-6' src={icHeart} />
						<div className="flex-1 text-text-70 text-base font-normal">혈압</div>
					</div>
					<div className="flex-1 flex items-start gap-2.5">
						<div className="flex-1 flex flex-col items-start gap-1">
							<div className="text-text-100 text-base font-normal">
								<span className="font-bold">{bloodPressure} </span>mmHg / <span className="font-bold">80 </span>BPM
							</div>
							<div className="text-text-70 text-sm font-normal">22/06/2023 15:12:14</div>
						</div>
						<Button size="small" variant="ghost" icon={<MoreIcon />} iconPosition="right">
							자세히 보기
						</Button>
					</div>
				</div>
				{/* 혈당 */}
				<div className="self-stretch flex items-start gap-2.5">
					<div className="w-[200px] flex items-center gap-2">
						<img alt='droplet' className='h-6 w-6' src={icDroplet} />
						<div className="flex-1 text-text-70 text-base font-normal">혈당</div>
					</div>
					<div className="flex-1 flex items-start gap-2.5">
						<div className="flex-1 flex flex-col items-start gap-1">
							<div className="text-text-100 text-base font-normal">
								Before Breakfast : <span className="font-bold">{bloodSugar} </span>mg/dl
							</div>
							<div className="text-text-70 text-sm font-normal">22/06/2023 15:12:14</div>
						</div>
						<Button size="small" variant="ghost" icon={<MoreIcon />} iconPosition="right">
							자세히 보기
						</Button>
					</div>
				</div>
				{/* 체온 */}
				<div className="self-stretch flex items-start gap-2.5">
					<div className="w-[200px] flex items-center gap-2">
						<img alt='temperature' className='h-6 w-6' src={icTemperature} />
						<div className="flex-1 text-text-70 text-base font-normal">체온</div>
					</div>
					<div className="flex-1 flex items-start gap-2.5">
						<div className="flex-1 flex flex-col items-start gap-1">
							<div className="text-text-100 text-base font-normal">
								<span className="font-bold">{temperature} </span>℃
							</div>
							<div className="text-text-70 text-sm font-normal">22/06/2023 15:12:14</div>
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
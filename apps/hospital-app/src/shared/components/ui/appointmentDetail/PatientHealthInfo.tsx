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

const PatientHealthInfo = () => {
	return (
		<div className="flex flex-1 flex-col gap-2.5 items-start self-stretch">
			<h2 className="font-semibold leading-normal text-text-100 text-xl">환자 건강정보</h2>
			<div className="bg-white border border-stroke-input flex flex-col gap-2 h-full items-start justify-between p-5 rounded-[0.625rem] w-full">
				{/* 키/몸무게/BMI */}
				<div className='flex gap-2.5 items-start self-stretch'>
					<div className='flex gap-2 items-center w-[12.5rem]'>
						<img alt='weight' className='h-6 w-6' src={icWeight} />
						<p className='leading-normal text-base text-text-70'>키/몸무게/BMI</p>
					</div>
					<div className='flex flex-1 gap-2.5 items-start'>
						<div className='flex flex-1 flex-col gap-1'>
							<span className='font-normal leading-5 text-base text-text-100'><b>123</b> cm / <b>12.3</b> kg / <b>12.34</b> BMI</span>
							<span className='font-normal leading-5 text-sm text-text-70'>22/06/2023 15:12:14</span>
						</div>
						<Button className='h-7 px-3 rounded-sm' variant='ghost'>
							<span className='font-normal leading-normal text-sm text-text-100'>자세히 보기</span>
							<MoreIcon />
						</Button>
					</div>
				</div>
				{/* 혈압 */}
				<div className='flex gap-2.5 items-center self-stretch'>
					<div className='flex gap-2 items-center w-[12.5rem]'>
						<img alt='heart' className='h-6 w-6' src={icHeart} />
						<p className='leading-normal text-base text-text-70'>혈압</p>
					</div>
					<div className='flex flex-1 gap-2.5 items-center'>
						<span className='flex-1 leading-normal text-base text-text-30'>등록된 정보가 없습니다.</span>
						<Button className='h-7 px-3 rounded-sm' variant='ghost'>
							<span className='font-normal leading-normal text-sm text-text-100'>자세히 보기</span>
							<MoreIcon />
						</Button>
					</div>
				</div>
				{/* 혈당 */}
				<div className='flex gap-2.5 items-start self-stretch'>
					<div className='flex gap-2 items-center w-[12.5rem]'>
						<img alt='droplet' className='h-6 w-6' src={icDroplet} />
						<p className='leading-normal text-base text-text-70'>혈당</p>
					</div>
					<div className='flex flex-1 gap-2.5 items-start'>
						<div className='flex flex-1 flex-col gap-1'>
							<span className='font-normal leading-5 text-base text-text-100'>Before Breakfast : <b>107</b> mg/dL</span>
							<span className='font-normal leading-5 text-sm text-text-70'>22/06/2023 15:12:14</span>
						</div>
						<Button className='h-7 px-3 rounded-sm' variant='ghost'>
							<span className='font-normal leading-normal text-sm text-text-100'>자세히 보기</span>
							<MoreIcon />
						</Button>
					</div>
				</div>
				{/* 체온 */}
				<div className='flex gap-2.5 items-start self-stretch'>
					<div className='flex gap-2 items-center w-[12.5rem]'>
						<img alt='tempreature' className='h-6 w-6' src={icTemperature} />
						<p className='leading-normal text-base text-text-70'>체온</p>
					</div>
					<div className='flex flex-1 gap-2.5 items-start'>
						<div className='flex flex-1 flex-col gap-1'>
							<span className='font-normal leading-5 text-base text-text-100'><b>36.9</b> &#x2103;</span>
							<span className='font-normal leading-5 text-sm text-text-70'>22/06/2023 15:12:14</span>
						</div>
						<Button className='h-7 px-3 rounded-sm' variant='ghost'>
							<span className='font-normal leading-normal text-sm text-text-100'>자세히 보기</span>
							<MoreIcon />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PatientHealthInfo;
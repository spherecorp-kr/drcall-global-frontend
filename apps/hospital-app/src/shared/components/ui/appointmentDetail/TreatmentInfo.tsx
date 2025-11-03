import { Dropdown } from '@/shared/components/ui';

const TH_CLASS: string = 'font-normal leading-normal min-w-[12.5rem] text-base text-text-70';
const TEXTAREA_CLASS: string = 'border border-stroke-input flex-1 font-normal leading-normal px-4 py-2.5 resize-none rounded text-base text-text-100';

const TreatmentInfo = () => {
	return (
		<div className='flex flex-col gap-2.5'>
			<h2 className='font-semibold leading-normal text-text-100 text-xl'>진료 정보</h2>
			<div className='bg-white border border-stroke-input p-5 rounded-[0.625rem]'>
				<div className="flex gap-5 items-start self-stretch">
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>의사</p>
							<Dropdown
								className='flex-1'
								options={[]}
								placeholder='의사를 선택해주세요.'
							/>
						</div>
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>증상</p>
							<textarea className={TEXTAREA_CLASS} disabled></textarea>
						</div>
					</div>
					<div className="flex flex-1 flex-col gap-4 items-start">
					</div>
				</div>
			</div>
		</div>
	);
};

export default TreatmentInfo;
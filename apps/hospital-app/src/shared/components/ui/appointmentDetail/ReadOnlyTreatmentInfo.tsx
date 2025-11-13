import { SymptomImages } from '@/shared/components/ui/appointmentDetail';
import { useAppointmentTabStore } from '@/shared/store/appointmentTabStore';

const TH_CLASS: string = 'font-normal leading-[normal] min-w-[12.5rem] text-base text-text-70';

const ReadOnlyTreatmentInfo = () => {
	const { appointmentTab } = useAppointmentTabStore();
	return (
		<div className="flex flex-col gap-2.5">
			<h2 className="font-semibold leading-[normal] text-text-100 text-xl">진료 정보</h2>
			<div className="bg-white border border-stroke-input p-5 rounded-[0.625rem]">
				<div className="flex gap-5 items-start self-stretch">
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>의사</p>
							<div className='flex gap-1 items-center'>
								<span className='leading-[normal] text-base text-text-100'>Dr.의사이름</span>
								<span className='capitalize font-medium leading-[normal] text-xs text-text-40'>(Experts: qwerty)</span>
							</div>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>증상</p>
							<textarea
								className="border border-stroke-input flex-1 font-normal leading-[normal] h-20 px-4 py-2.5 resize-none rounded text-base text-text-100"
								disabled
							></textarea>
						</div>
						{appointmentTab === 'completed' && (
							<div className='flex gap-2.5 items-start justify-start w-full'>
								<p className={TH_CLASS}>의사 조언</p>
								<textarea
									className="border border-stroke-input flex-1 font-normal leading-[normal] h-20 px-4 py-2.5 resize-none rounded text-base text-text-100"
									disabled
								></textarea>
							</div>
						)}
					</div>
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>진료 희망 일시</p>
							<p className='leading-[normal] text-base text-text-100'>16/06/2023 14:01~14:15</p>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>증상 이미지</p>
							<SymptomImages />
						</div>
						{appointmentTab === 'completed' && (
							<div className='flex gap-2.5 items-start justify-start w-full'>
								<p className={TH_CLASS}>AI 진료 요약</p>
								<textarea
									className="border border-stroke-input flex-1 font-normal leading-[normal] h-20 px-4 py-2.5 resize-none rounded text-base text-text-100"
									disabled
								></textarea>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReadOnlyTreatmentInfo;
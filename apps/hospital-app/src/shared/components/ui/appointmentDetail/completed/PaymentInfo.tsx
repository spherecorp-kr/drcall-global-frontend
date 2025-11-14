const TH_CLASS: string = 'font-normal leading-[normal] min-w-[12.5rem] text-base text-text-70';

const PaymentInfo = () => {
	return (
		<div className="flex flex-col gap-2.5">
			<h2 className="font-semibold leading-[normal] text-text-100 text-xl">결제 정보</h2>
			<div className='bg-white border border-stroke-input p-5 rounded-[0.625rem]'>
				<div className="flex gap-5 items-start self-stretch">
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>결제 상태</p>
							<p className='leading-[normal] text-base text-text-100'>결제 완료</p>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>결제 방법</p>
							<p className='leading-[normal] text-base text-text-100'>계좌이체<br />은행 이름<br />계좌 주인 이름<br />계좌번호</p>
						</div>
					</div>
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>결제 금액</p>
							<p className='leading-[normal] text-base text-text-100'>14/11/2025</p>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>결제 완료 일시</p>
							<div className='flex flex-col items-start'>
								<p className='font-bold leading-[normal] text-base text-text-100'>400 THB</p>
								<p className='leading-[normal] text-base text-text-100'>ㄴ 진료비: 250THB</p>
								<p className='leading-[normal] text-base text-text-100'>ㄴ 조제비: 50THB</p>
								<p className='leading-[normal] text-base text-text-100'>ㄴ 서비스비: 50THB</p>
								<p className='leading-[normal] text-base text-text-100'>ㄴ 배송비: 50THB</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentInfo;
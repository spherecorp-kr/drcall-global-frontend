import { useTranslation } from 'react-i18next';

const TH_CLASS: string = 'font-normal leading-[normal] min-w-[12.5rem] text-base text-text-70';

const PaymentInfo = () => {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col gap-2.5">
			<h2 className="font-semibold leading-[normal] text-text-100 text-xl">{t('appointment.detail.payment.title')}</h2>
			<div className='bg-white border border-stroke-input p-5 rounded-[0.625rem]'>
				<div className="flex gap-5 items-start self-stretch">
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.payment.status')}</p>
							<p className='leading-[normal] text-base text-text-100'>{t('appointment.search.paymentStatus.completed')}</p>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.payment.method')}</p>
							<p className='leading-[normal] text-base text-text-100'>계좌이체<br />은행 이름<br />계좌 주인 이름<br />계좌번호</p>
						</div>
					</div>
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.payment.amount')}</p>
							<p className='leading-[normal] text-base text-text-100'>14/11/2025</p>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.payment.date')}</p>
							<div className='flex flex-col items-start'>
								<p className='font-bold leading-[normal] text-base text-text-100'>400 THB</p>
								<p className='leading-[normal] text-base text-text-100'>ㄴ {t('appointment.detail.payment.breakdown.treatment')}: 250THB</p>
								<p className='leading-[normal] text-base text-text-100'>ㄴ {t('appointment.detail.payment.breakdown.dispensing')}: 50THB</p>
								<p className='leading-[normal] text-base text-text-100'>ㄴ {t('appointment.detail.payment.breakdown.service')}: 50THB</p>
								<p className='leading-[normal] text-base text-text-100'>ㄴ {t('appointment.detail.payment.breakdown.delivery')}: 50THB</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentInfo;
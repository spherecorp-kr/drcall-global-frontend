import { useTranslation } from 'react-i18next';

const CancelInfo = () => {
	const { t } = useTranslation();
	return (
		<div className="flex flex-1 flex-col gap-2.5 items-start self-stretch">
			<h2 className='font-semibold leading-[normal] text-text-100 text-xl'>{t('appointment.detail.cancel.title')}</h2>
			<div className='bg-white border border-stroke-input flex p-5 rounded-[0.625rem] w-full'>
				<div className='flex flex-1 flex-col gap-4 items-start'>
					<div className='flex gap-2.5 items-center justify-start w-full'>
						<p className='leading-[normal] text-base text-text-70 w-[12.5rem]'>{t('appointment.detail.cancel.number')}</p>
						<p className='leading-[normal] text-base text-text-100'>123456789</p>
					</div>
					<div className='flex gap-2.5 items-center justify-start w-full'>
						<p className='leading-[normal] text-base text-text-70 w-[12.5rem]'>{t('appointment.detail.cancel.canceler')}</p>
						<p className='leading-[normal] text-base text-text-100'>{t('appointment.detail.cancel.hospital')}</p>
					</div>
				</div>
				<div className='flex flex-1 flex-col gap-4 items-start'>
					<div className='flex gap-2.5 items-center justify-start w-full'>
						<p className='leading-[normal] text-base text-text-70 w-[12.5rem]'>{t('appointment.detail.cancel.date')}</p>
						<p className='leading-[normal] text-base text-text-100'>11/11/2025 12:34:56</p>
					</div>
					<div className='flex gap-2.5 items-start justify-start w-full'>
						<p className='leading-[normal] text-base text-text-70 w-[12.5rem]'>{t('appointment.detail.cancel.reason')}</p>
						<textarea
							className='bg-bg-disabled border border-stroke-input flex-1 min-h-20 px-4 py-2.5 resize-none rounded text-text-100'
							disabled></textarea>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CancelInfo;
import React, { useCallback } from 'react';
import { Input } from '@/shared/components/ui';
import icClose from '@/shared/assets/icons/ic_close.svg';
import icWarn from '@/assets/icons/ic_warn.svg';
import { useTranslation } from 'react-i18next';

const Separator = () => <div className='bg-stroke-input h-px w-full' />

const PrescriptionEdit = () => {
	const { t } = useTranslation();
	const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e);
	}, []);

	const handleFileDelete = useCallback(() => {
		// TODO 기존에 올라간 퍼방전 파일 삭제
	}, []);

	return (
		<div className="flex flex-col gap-5 items-start">
			<div className="flex flex-col gap-5 w-full">
				<p className="font-bold leading-[normal] text-text-100 text-xl">{t('appointment.detail.treatmentInfo.doctorAdvice')}</p>
				<textarea
					className="bg-bg-disabled border border-stroke-input leading-[normal] min-h-20 placeholder:text-text-30 px-4 py-2.5 text-base text-text-100 resize-none rounded"
					defaultValue='123123'
				></textarea>
			</div>
			<div className="flex flex-col gap-5 w-full">
				<p className="font-bold leading-[normal] text-text-100 text-xl">{t('appointment.detail.treatmentInfo.aiSummary')}</p>
				<div className="bg-bg-disabled border border-stroke-input leading-[normal] min-h-20 px-4 py-2.5 text-base text-text-100 resize-none rounded"></div>
			</div>
			<Separator />
			<div className="flex flex-col gap-5 w-full">
				<p className="font-bold leading-[normal] text-text-100 text-xl">{t('appointment.detail.prescription.download')}</p>
				<div className='flex gap-2.5 h-10 items-center'>
					<div className='border border-stroke-input flex flex-1 gap-2 h-full items-center justify-between px-5 rounded'>
						<p className='leading-[normal] text-base text-text-100'>{t('appointment.detail.prescription.file')}</p>
						<img
							alt='delete'
							className='cursor-pointer h-5 w-5'
							onClick={handleFileDelete}
							src={icClose}
						/>
					</div>
					<input
						className='hidden'
						id='inputPrescriptionFile'
						onChange={handleFileChange}
						type='file'
					/>
					<label
						className='bg-primary-70 font-medium h-10 leading-10 px-5 rounded-sm text-base text-white'
						htmlFor='inputPrescriptionFile'
					>{t('appointment.detail.prescription.upload')}</label>
				</div>
			</div>
			<Separator />
			<div className="flex flex-col gap-5 w-full">
				<div className="flex flex-col gap-2.5 items-start">
					<p className="font-bold leading-[normal] text-text-100 text-xl">{t('appointment.detail.prescription.dialog.warn')}</p>
					<div className="flex gap-1 items-center justify-start">
						<img alt="warn" src={icWarn} />
						<p className="leading-[normal] text-sm text-system-error">
							{t('appointment.detail.payment.warn')}
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-5 items-start">
					<div className="flex flex-col gap-2.5 items-start w-full">
						<p className="leading-[normal] text-base text-text-50">{t('appointment.detail.payment.breakdown.treatment')}</p>
						<div className="flex gap-3 items-end w-full">
							<Input
								defaultValue='123,456'
								disabled
								name="treatmentFee"
								type="text"
							/>
							<p className="leading-[normal] text-base text-right text-text-100">
								THB
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-2.5 items-start w-full">
						<p className="leading-[normal] text-base text-text-50">{t('appointment.detail.payment.breakdown.dispensing')}</p>
						<div className="flex gap-3 items-end w-full">
							<Input
								defaultValue='123,456'
								disabled
								name="dispensingFee"
								type="text"
							/>
							<p className="leading-[normal] text-base text-right text-text-100">
								THB
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-2.5 items-start w-full">
						<p className="leading-[normal] text-base text-text-50">{t('appointment.detail.payment.breakdown.service')}</p>
						<div className="flex gap-3 items-end w-full">
							<Input
								defaultValue='123,456'
								disabled
								name="tip"
								type="text"
							/>
							<p className="leading-[normal] text-base text-right text-text-100">
								THB
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-2.5 items-start w-full">
						<p className="leading-[normal] text-base text-text-50">{t('appointment.detail.payment.breakdown.delivery')}</p>
						<div className="flex gap-3 items-end w-full">
							<Input
								defaultValue='123,456'
								disabled
								name="deliveryFee"
								type="text"
							/>
							<p className="leading-[normal] text-base text-right text-text-100">
								THB
							</p>
						</div>
					</div>
					<div className="flex items-center justify-between w-full">
						<p className="leading-[normal] text-base text-text-50">{t('appointment.detail.payment.breakdown.total')}</p>
						<div className="flex gap-3 items-center justify-end">
							<p className="font-semibold leading-[normal] text-2xl text-right text-text-100">
								12,345
							</p>
							<p className="leading-[normal] text-base text-right text-text-100">
								THB
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PrescriptionEdit;
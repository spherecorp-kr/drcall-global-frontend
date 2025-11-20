import Current from '@/shared/components/ui/icon/progress/Current';
import Next from '@/shared/components/ui/icon/progress/Next';
import Prev from '@/shared/components/ui/icon/progress/Prev';
import { Button } from '@/shared/components/ui';
import { useDialog } from '@/shared/hooks/useDialog';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const DELIVERY_STEPS: string[] = ['preparing', 'prepared', 'delivering', 'delivered'];
const TH_CLASS: string = 'font-normal leading-[normal] min-w-[12.5rem] text-base text-text-70';
const TD_CLASS: string = 'leading-[normal] text-base text-text-100';
type StepStatus = 'current' | 'next' | 'prev';

const getStepStatus = (index: number, currentIndex: number): StepStatus => {
	if (index < currentIndex) {
		return 'prev';
	}
	if (index === currentIndex) {
		return 'current';
	}
	return 'next';
};

const getPointAlignmentClass = (index: number, lastIndex: number): string => {
	if (index === 0) {
		return 'justify-start';
	}
	if (index === lastIndex) {
		return 'justify-end';
	}
	return 'justify-center';
};

const getLabelAlignmentClass = (index: number, lastIndex: number): string => {
	if (index === 0) {
		return 'items-start text-left';
	}
	if (index === lastIndex) {
		return 'items-end text-right';
	}
	return 'items-center text-center';
};

const DIALOG_BORDER_X: string = 'border-x border-x-stroke-input';
const DIALOG_BORDER_Y: string = 'border-y border-y-stroke-input';
const DIALOG_TH_CLASS: string = 'font-semibold py-2.5 text-center text-sm text-text-100';
const DIALOG_TD_CLASS: string = 'font-normal py-2.5 text-center text-xs text-text-100';

const TrackingDialogContents = () => {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col gap-5 items-start">
			<h3 className="font-bold leading-[normal] text-text-100 text-xl">{t('appointment.detail.delivery.trackingDialog.info')}</h3>
			<div className="flex flex-col gap-2.5 items-start">
				<p className="font-medium leading-[normal] text-base text-text-50">{t('appointment.detail.delivery.trackingDialog.invoice')}</p>
				<p className="leading-[normal] text-base text-text-100">송장번호</p>
			</div>
			<div className="flex flex-col gap-2.5 items-start">
				<p className="font-medium leading-[normal] text-base text-text-50">{t('appointment.detail.delivery.trackingDialog.courier')}</p>
				<p className="leading-[normal] text-base text-text-100">택배사 이름</p>
			</div>
			<table className="border-collapse w-full">
				<colgroup>
					<col width="33.33%" />
					<col width="33.33%" />
					<col width="33.34%" />
				</colgroup>
				<thead>
					<tr className={`bg-text-10 ${DIALOG_BORDER_Y}`}>
						<th className={DIALOG_TH_CLASS}>{t('appointment.detail.delivery.trackingDialog.date')}</th>
						<th className={`${DIALOG_BORDER_X} ${DIALOG_TH_CLASS}`}>{t('appointment.detail.delivery.trackingDialog.step')}</th>
						<th className={DIALOG_TH_CLASS}>{t('appointment.detail.delivery.trackingDialog.location')}</th>
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: 5 }).map((_, index) => (
						<tr className={DIALOG_BORDER_Y} key={index}>
							<td className={DIALOG_TD_CLASS}>12/09/2025 16:49</td>
							<td className={`${DIALOG_BORDER_X} ${DIALOG_TD_CLASS}`}>배달 출발</td>
							<td className={DIALOG_TD_CLASS}>방콕</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

// TODO: API 연동 시 현재 단계를 받아 currentStepIndex 값을 업데이트한다.
const currentStepIndex: number = 0;

const DeliveryInfo = () => {
	const { t } = useTranslation();
	const { openDialog } = useDialog();

	const handleOpenTrackingDialog = useCallback(() => {
		openDialog({
			dialogClass: 'w-[36.25rem]',
			dialogContents: <TrackingDialogContents />,
			dialogId: 'trackingDialog',
			dialogTitle: t('appointment.detail.delivery.trackingDialog.title'),
			hasCloseButton: true,
		});
	}, [openDialog, t]);

	return (
		<div className="flex flex-col gap-2.5">
			<div className='flex items-end justify-between'>
				<h2 className="font-semibold leading-[normal] text-text-100 text-xl">{t('appointment.detail.delivery.title')}</h2>
				<Button onClick={handleOpenTrackingDialog}>{t('appointment.detail.delivery.tracking')}</Button>
			</div>
			<div className='bg-white border border-stroke-input flex flex-col gap-5 p-5 rounded-[0.625rem]'>
				<div className='flex flex-col gap-2 px-6'>
					<div className='relative w-full'>
						<div className='absolute top-1/2 left-2 right-2 flex -translate-y-1/2'>
							{DELIVERY_STEPS.slice(0, -1).map((_, index) => (
								<div className='flex-1' key={`connector-${index}`}>
									<div
										className={
											index < currentStepIndex
												? 'bg-[#00a0d2] h-[0.125rem] w-full'
												: 'border-[#e0e0e0] border-dashed border-t-2 w-full'
										}
									/>
								</div>
							))}
						</div>
						<div className='flex justify-between relative z-10 w-full'>
							{DELIVERY_STEPS.map((step, index) => {
								const status: StepStatus = getStepStatus(index, currentStepIndex);
								const IconComponent = status === 'current' ? Current : status === 'prev' ? Prev : Next;
								const pointJustifyClass = getPointAlignmentClass(index, DELIVERY_STEPS.length - 1);

								return (
									<div className={`flex ${pointJustifyClass} w-[5.625rem]`} key={step}>
										<IconComponent />
									</div>
								);
							})}
						</div>
					</div>
					<div className='flex justify-between w-full'>
						{DELIVERY_STEPS.map((step, index) => {
							const status: StepStatus = getStepStatus(index, currentStepIndex);
							const labelAlignmentClass = getLabelAlignmentClass(index, DELIVERY_STEPS.length - 1);

							return (
								<div className={`flex flex-col gap-1 w-[5.625rem] ${labelAlignmentClass}`} key={`${step}-label`}>
									<p className={`font-semibold leading-4 text-[0.8125rem] ${status === 'current' ? 'text-primary-70' : 'text-text-100'}`}>
										{t(`appointment.detail.delivery.steps.${step}`)}
									</p>
								</div>
							);
						})}
					</div>
				</div>
				<div className="flex gap-5 items-start self-stretch">
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.delivery.info.number')}</p>
							<p className={TD_CLASS}>2025111-111</p>
						</div>
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.delivery.info.recipient')}</p>
							<p className={TD_CLASS}>김환자</p>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.delivery.info.address')}</p>
							<p className={TD_CLASS}>Seocho-gu, Seoul, Republic of Korea 162, Baumoe-ro 1902, Building 103, Raemian Apartment, 192-458</p>
						</div>
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.delivery.info.courier')}</p>
							<p className={TD_CLASS}>김배달 / 010-1111-1111</p>
						</div>
					</div>
					<div className="flex flex-1 flex-col gap-4 items-start">
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.delivery.info.method')}</p>
							<p className={TD_CLASS}>일반 택배</p>
						</div>
						<div className="flex gap-2.5 items-center justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.delivery.info.phone')}</p>
							<p className={TD_CLASS}>000-0000-0000</p>
						</div>
						<div className="flex gap-2.5 items-start justify-start w-full">
							<p className={TH_CLASS}>{t('appointment.detail.delivery.info.request')}</p>
							<textarea
								className='border border-stroke-input flex-1 min-h-20 px-4 py-2.5 resize-none rounded'
								disabled
							></textarea>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeliveryInfo;
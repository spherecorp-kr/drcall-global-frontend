import { Input, Radio } from '@/shared/components/ui';
import icClose from '@/shared/assets/icons/ic_close.svg';
import icWarn from '@/assets/icons/ic_warn.svg';
import React, { useCallback, useMemo, useState } from 'react';
import { useEffectAfterMount } from '@/shared/hooks/useEffectAfterMount';
import { useTranslation } from 'react-i18next';

interface Fee {
	treatmentFee: number,
	dispensingFee: number,
	tip: number
}

interface OptionalFee {
	treatmentFee?: number,
	dispensingFee?: number,
	tip?: number
}

interface Props {
	handleChange: (fee: Fee) => void;
	onDisabledChange?: (disabled: boolean) => void;
}

const Separator = () => <div className='bg-stroke-input h-px w-full' />

const PrescriptionRegistration = ({ handleChange, onDisabledChange }: Props) => {
	const { t } = useTranslation();
	const [fee, setFee] = useState<OptionalFee>({
		treatmentFee: undefined,
		dispensingFee: undefined,
		tip: undefined,
	});
	const [prescriptionYN, setPrescriptionYN] = useState<string>('');
	const [doctorAdvice, setDoctorAdvice] = useState<string>('');
	const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
	const [fileName, setFileName] = useState<string>(t('appointment.detail.prescription.file'));

	const handleFeeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		// 숫자(0-9)만 허용, 콤마는 제거
		const numericValue = value.replace(/[^0-9]/g, '');
		// 빈 문자열이면 undefined, 아니면 숫자로 변환
		const numValue = numericValue === '' ? undefined : Number(numericValue);
		setFee(prev => ({ ...prev, [name]: numValue }));
	}, []);

	const handlePrescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setPrescriptionYN(e.target.value);
		// 처방전 선택이 변경되면 파일 초기화
		if (e.target.value === 'N') {
			setPrescriptionFile(null);
			setFileName(t('appointment.detail.prescription.file'));
		}
	}, [t]);

	const handleDoctorAdviceChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDoctorAdvice(e.target.value);
	}, []);

	const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPrescriptionFile(file);
			setFileName(file.name);
		}
	}, []);

	const handleFileDelete = useCallback(() => {
		setPrescriptionFile(null);
		setFileName(t('appointment.detail.prescription.file'));
		// input 파일 초기화
		const fileInput = document.getElementById('inputPrescriptionFile') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}, [t]);

	// disabled 상태 계산
	const calculateDisabled = useCallback((): boolean => {
		// 의사 조언, 진료비, 조제비, 서비스비 모두 입력되었는지 확인
		const allFieldsFilled = 
			doctorAdvice.trim().length > 0 &&
			fee.treatmentFee !== undefined &&
			fee.dispensingFee !== undefined &&
			fee.tip !== undefined;

		if (!allFieldsFilled) {
			return true;
		}

		// 처방전 미포함이면 disabled = false
		if (prescriptionYN === 'N') {
			return false;
		}

		// 처방전 포함이면 파일 업로드 확인
		if (prescriptionYN === 'Y') {
			return prescriptionFile === null;
		}

		// 아무것도 선택되지 않았으면 disabled = true
		return true;
	}, [doctorAdvice, fee, prescriptionYN, prescriptionFile]);

	// 총합 계산
	const totalFee = useMemo(() => {
		const total = (fee.treatmentFee ?? 0) + (fee.dispensingFee ?? 0) + (fee.tip ?? 0);
		return total.toLocaleString();
	}, [fee.treatmentFee, fee.dispensingFee, fee.tip]);

	// disabled 상태 변경 시 부모에 알림
	useEffectAfterMount(() => {
		const disabled = calculateDisabled();
		onDisabledChange?.(disabled);
	}, [calculateDisabled, onDisabledChange]);

	useEffectAfterMount(() => {
		handleChange({
			treatmentFee: fee.treatmentFee ?? 0,
			dispensingFee: fee.dispensingFee ?? 0,
			tip: fee.tip ?? 0
		});
	}, [fee]);

	return (
		<div className="flex flex-col gap-5 items-start">
			<div className="flex flex-col gap-5 w-full">
				<p className="font-bold leading-[normal] text-text-100 text-xl">{t('appointment.detail.treatmentInfo.doctorAdvice')}</p>
				<textarea
					className="bg-white border border-stroke-input leading-[normal] min-h-20 placeholder:text-text-30 px-4 py-2.5 text-base text-text-100 resize-none rounded"
					maxLength={500}
					onChange={handleDoctorAdviceChange}
					placeholder={t('appointment.detail.prescription.placeholder')}
					value={doctorAdvice}
				></textarea>
			</div>
			<div className="flex flex-col gap-5 w-full">
				<p className="font-bold leading-[normal] text-text-100 text-xl">{t('appointment.detail.treatmentInfo.aiSummary')}</p>
				<div className="bg-white border border-stroke-input leading-[normal] min-h-20 px-4 py-2.5 text-base text-text-100 resize-none rounded"></div>
			</div>
			<Separator />
			<div className="flex flex-col gap-5 w-full">
				<p className="font-bold leading-[normal] text-text-100 text-xl">{t('appointment.detail.treatmentInfo.aiSummary')}</p>
				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-2.5 w-full">
						<Radio
							checked={prescriptionYN === 'Y'}
							label={t('appointment.detail.prescription.include')}
							name="prescriptionYN"
							onChange={handlePrescriptionChange}
							value="Y"
						/>
						{prescriptionYN === 'Y' && (
							<div className='flex gap-2.5 h-10 items-center'>
								<div className='border border-stroke-input flex flex-1 gap-2 h-full items-center justify-between px-5 rounded'>
									<p className='leading-[normal] text-base text-text-100'>{fileName}</p>
									{prescriptionFile && (
										<img
											alt='delete'
											className='cursor-pointer h-5 w-5'
											onClick={handleFileDelete}
											src={icClose}
										/>
									)}
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
								>
									{t('appointment.detail.prescription.upload')}
								</label>
							</div>
						)}
					</div>
					<Radio
						checked={prescriptionYN === 'N'}
						label={t('appointment.detail.prescription.exclude')}
						name="prescriptionYN"
						onChange={handlePrescriptionChange}
						value="N"
					/>
				</div>
			</div>
			<Separator />
			<div className="flex flex-col gap-5 w-full">
				<div className="flex flex-col gap-2.5 items-start">
					<p className="font-bold leading-[normal] text-text-100 text-xl">{t('appointment.detail.prescription.dialog.registerTitle')}</p>
					<div className="flex gap-1 items-center justify-start">
						<img alt="warn" src={icWarn} />
						<p className="leading-[normal] text-sm text-system-error">
							{t('appointment.detail.prescription.dialog.warn')}
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-5 items-start">
					<div className="flex flex-col gap-2.5 items-start w-full">
						<p className="leading-[normal] text-base text-text-50">{t('appointment.detail.payment.breakdown.treatment')}</p>
						<div className="flex gap-3 items-end w-full">
							<Input
								name="treatmentFee"
								onChange={handleFeeChange}
								placeholder="진료비를 입력해주세요."
								type="text"
								value={
									fee.treatmentFee !== undefined
										? fee.treatmentFee.toLocaleString()
										: ''
								}
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
								name="dispensingFee"
								onChange={handleFeeChange}
								placeholder="조제비를 입력해주세요."
								type="text"
								value={
									fee.dispensingFee !== undefined
										? fee.dispensingFee.toLocaleString()
										: ''
								}
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
								name="tip"
								onChange={handleFeeChange}
								placeholder="서비스비를 입력해주세요."
								type="text"
								value={fee.tip !== undefined ? fee.tip.toLocaleString() : ''}
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
								{totalFee}
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

export default PrescriptionRegistration;
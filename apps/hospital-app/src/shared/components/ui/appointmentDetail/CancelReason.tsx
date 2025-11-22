import React, { useCallback, useEffect, useState } from 'react';
import { Radio } from '@/shared/components/ui';
import { useTranslation } from 'react-i18next';

interface CancelReasonProps {
	onDisabledChange?: (disabled: boolean) => void;
}

const CancelReason = ({ onDisabledChange }: CancelReasonProps) => {
	const { t } = useTranslation();
	const [canceller, setCanceller] = useState<string>('');
	const [reason, setReason] = useState<string>('');

	// disabled 상태 계산 로직
	// PATIENT 선택 시: disabled = false
	// HOSPITAL 선택 + reason 입력 시: disabled = false
	// 그 외: disabled = true
	const calculateDisabled = useCallback((selectedCanceller: string, reasonText: string): boolean => {
		if (selectedCanceller === 'PATIENT') {
			return false;
		}
		return !(selectedCanceller === 'HOSPITAL' && reasonText.trim().length > 0);
	}, []);

	// canceller 또는 reason이 변경될 때마다 disabled 상태 업데이트
	useEffect(() => {
		const disabled = calculateDisabled(canceller, reason);
		onDisabledChange?.(disabled);
	}, [canceller, reason, calculateDisabled, onDisabledChange]);

	const handleCancellerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setCanceller(e.target.value);
	}, []);

	const handleReasonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setReason(e.target.value);
	}, []);

	return (
		<div className='flex flex-col gap-5 items-start'>
			<div className='flex flex-col gap-2.5 items-start w-full'>
				<Radio
					checked={canceller === 'HOSPITAL'}
					label={t('appointment.detail.cancel.dialog.hospitalCancel')}
					name='canceller'
					onChange={handleCancellerChange}
					value='HOSPITAL'
				/>
				<textarea
					className='border border-stroke-input h-40 leading-[normal] outline-0 px-4 py-2.5 resize-none rounded text-base w-full'
					maxLength={50}
					onChange={handleReasonChange}
					placeholder={t('appointment.detail.cancel.dialog.placeholder')}
					value={reason}
				></textarea>
			</div>
			<Radio
				checked={canceller === 'PATIENT'}
				label={t('appointment.detail.cancel.dialog.patientCancel')}
				name='canceller'
				onChange={handleCancellerChange}
				value='PATIENT'
			/>
		</div>
	);
};

export default CancelReason;
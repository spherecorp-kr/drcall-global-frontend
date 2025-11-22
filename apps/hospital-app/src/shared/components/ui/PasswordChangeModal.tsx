import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import icValidationInfo from '@/shared/assets/icons/ic_validation_info.svg';
import icEye from '@/shared/assets/icons/ic_eye.svg';
import icEyeOff from '@/shared/assets/icons/ic_eye_off.svg';

interface PasswordChangeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (currentPassword: string, newPassword: string) => void;
}

interface PasswordErrors {
	currentPassword?: string;
	newPassword?: string;
	confirmPassword?: string;
}

export function PasswordChangeModal({ isOpen, onClose, onSubmit }: PasswordChangeModalProps) {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<PasswordErrors>({});
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const validatePassword = (password: string): boolean => {
		// 10자 이상~16자 이하
		if (password.length < 10 || password.length > 16) {
			return false;
		}

		// 영문, 숫자, 특수문자 중 2종 이상 혼합
		const hasLetter = /[a-zA-Z]/.test(password);
		const hasNumber = /[0-9]/.test(password);
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
		return typeCount >= 2;
	};

	const handleSubmit = () => {
		const newErrors: PasswordErrors = {};

		// 현재 비밀번호 검증
		if (!currentPassword) {
			newErrors.currentPassword = '현재 비밀번호를 입력해 주세요.';
		}

		// 새 비밀번호 검증
		if (!newPassword) {
			newErrors.newPassword = '새 비밀번호를 입력해 주세요.';
		} else if (!validatePassword(newPassword)) {
			newErrors.newPassword = '10자 이상~16자 이하 영문, 숫자, 특수문자 2종 이상의 혼합으로 입력해 주세요.';
		} else if (currentPassword && newPassword === currentPassword) {
			newErrors.newPassword = '현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.';
		}

		// 새 비밀번호 확인 검증
		if (!confirmPassword) {
			newErrors.confirmPassword = '새 비밀번호를 다시 입력해 주세요.';
		} else if (newPassword !== confirmPassword) {
			newErrors.confirmPassword = '새 비밀번호와 일치하지 않습니다.';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		// 모든 검증 통과
		onSubmit(currentPassword, newPassword);
		handleClose();
	};

	const handleClose = () => {
		setCurrentPassword('');
		setNewPassword('');
		setConfirmPassword('');
		setErrors({});
		setShowCurrentPassword(false);
		setShowNewPassword(false);
		setShowConfirmPassword(false);
		onClose();
	};

	const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
		if (field === 'current') {
			setShowCurrentPassword(!showCurrentPassword);
		} else if (field === 'new') {
			setShowNewPassword(!showNewPassword);
		} else {
			setShowConfirmPassword(!showConfirmPassword);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="비밀번호 변경" width="580px">
			<div className="-mx-6 px-6 pb-0 flex flex-col">
				{/* 현재 비밀번호 */}
				<div className="flex flex-col gap-[10px]">
					<div className="text-text-50 text-16">현재 비밀번호</div>
					<div className="relative">
						<Input
							type={showCurrentPassword ? 'text' : 'password'}
							value={currentPassword}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setCurrentPassword(e.target.value);
								if (errors.currentPassword) {
									setErrors((prev) => ({ ...prev, currentPassword: undefined }));
								}
							}}
							placeholder="비밀번호를 입력해 주세요."
							size="medium"
							error={!!errors.currentPassword}
						/>
						<button
							type="button"
							onClick={() => togglePasswordVisibility('current')}
							className="absolute right-4 top-1/2 -translate-y-1/2"
						>
							<img src={showCurrentPassword ? icEye : icEyeOff} alt="" className="w-6 h-6" />
						</button>
					</div>
					{errors.currentPassword ? (
						<div className="text-system-error text-14 leading-tight">{errors.currentPassword}</div>
					) : (
						<div className="flex items-center gap-1 text-primary-70 text-14">
							<img src={icValidationInfo} alt="info" className="w-4 h-4" />
							<span>10자 이상~16자 이하 영문, 숫자, 특수문자 2종 이상의 혼합</span>
						</div>
					)}
				</div>

				{/* 새 비밀번호 */}
				<div className="flex flex-col gap-[10px] mt-5">
					<div className="text-text-50 text-16">새 비밀번호</div>
					<div className="relative">
						<Input
							type={showNewPassword ? 'text' : 'password'}
							value={newPassword}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setNewPassword(e.target.value);
								if (errors.newPassword) {
									setErrors((prev) => ({ ...prev, newPassword: undefined }));
								}
							}}
							placeholder="비밀번호를 입력해 주세요."
							size="medium"
							error={!!errors.newPassword}
						/>
						<button
							type="button"
							onClick={() => togglePasswordVisibility('new')}
							className="absolute right-4 top-1/2 -translate-y-1/2"
						>
							<img src={showNewPassword ? icEye : icEyeOff} alt="" className="w-6 h-6" />
						</button>
					</div>
					{errors.newPassword && <div className="text-system-error text-14 leading-tight">{errors.newPassword}</div>}
				</div>

				{/* 새 비밀번호 확인 */}
				<div className="flex flex-col gap-[10px] mt-5">
					<div className="text-text-50 text-16">새 비밀번호 확인</div>
					<div className="relative">
						<Input
							type={showConfirmPassword ? 'text' : 'password'}
							value={confirmPassword}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setConfirmPassword(e.target.value);
								if (errors.confirmPassword) {
									setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
								}
							}}
							placeholder="비밀번호를 입력해 주세요."
							size="medium"
							error={!!errors.confirmPassword}
						/>
						<button
							type="button"
							onClick={() => togglePasswordVisibility('confirm')}
							className="absolute right-4 top-1/2 -translate-y-1/2"
						>
							<img src={showConfirmPassword ? icEye : icEyeOff} alt="" className="w-6 h-6" />
						</button>
					</div>
					{errors.confirmPassword && (
						<div className="text-system-error text-14 leading-tight">{errors.confirmPassword}</div>
					)}
				</div>

			</div>

			{/* 확인 버튼 */}
			<button
				onClick={handleSubmit}
				className="h-[70px] -mx-6 -mb-6 mt-[40px] rounded-b-[10px] bg-primary-70 flex items-center justify-center text-20 font-semibold text-white hover:opacity-90 cursor-pointer transition-opacity w-[calc(100%+48px)]"
			>
				확인
			</button>
		</Modal>
	);
}

export default PasswordChangeModal;

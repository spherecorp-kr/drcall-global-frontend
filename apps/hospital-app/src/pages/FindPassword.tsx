import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/shared/components/ui';
import AuthLayout from '@/shared/components/auth/AuthLayout';
import { Eye, EyeOff } from '@/shared/components/auth/EyeIcon';
import icValidationInfo from '@/shared/assets/icons/ic_validation_info.svg';
import { useTranslation } from 'react-i18next';
import { doubleDigit } from '@/shared/utils/commonScripts.ts';
// TODO: API 구현 후 주석 해제
// import { authService } from '@/services/authService';

type FindPasswordStep = 'username' | 'verification' | 'reset';

interface ErrorState {
	username?: string;
	verification?: 'mismatch' | 'expired';
	password?: 'format' | 'mismatch';
	passwordConfirm?: 'format' | 'mismatch';
}

const VERIFICATION_TIMEOUT = 3 * 60; // 3분 (초 단위)

const FindPassword = () => {
	const navigate = useNavigate();

	const { t } = useTranslation();

	const [step, setStep] = useState<FindPasswordStep>('username');
	const [username, setUsername] = useState('');
	const [verificationCode, setVerificationCode] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [errors, setErrors] = useState<ErrorState>({});
	const [isLoading, setIsLoading] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(VERIFICATION_TIMEOUT);
	const [isCodeVerified, setIsCodeVerified] = useState(false);
	const [resetToken, setResetToken] = useState<string | null>(null);

	// 타이머 포맷 (mm:ss)
	const timerDisplay = useMemo(() => {
		const minutes = Math.floor(timeRemaining / 60);
		const seconds = timeRemaining % 60;
		return `${doubleDigit(minutes)}:${doubleDigit(seconds)}`;
	}, [timeRemaining]);

	// 인증번호 입력 단계에서 타이머 실행
	useEffect(() => {
		if (step !== 'verification') {
			setTimeRemaining(VERIFICATION_TIMEOUT);
			setIsCodeVerified(false);
			return;
		}

		const interval = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					setErrors((prevErrors) => ({
						...prevErrors,
						verification: 'expired',
					}));
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [step]);

	// 아이디 확인 및 이메일 전송
	const handleUsernameSubmit = useCallback(async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});

		if (!username.trim()) {
			setErrors({ username: t('login.idPlaceholder') });
			return;
		}

		setIsLoading(true);
		try {
			// TODO: API 호출
			// await authService.findPassword({ username });
			// 임시: 항상 성공으로 처리
			setStep('verification');
			setTimeRemaining(VERIFICATION_TIMEOUT);
		} catch (error) {
			setErrors({ username: t('login.wrongId') });
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [t, username]);

	// 인증번호 확인
	const handleVerificationSubmit = useCallback(async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});

		if (!verificationCode.trim()) {
			return;
		}

		if (timeRemaining === 0) {
			setErrors({ verification: 'expired' });
			return;
		}

		setIsLoading(true);
		try {
			// TODO: API 호출
			// const response = await authService.verifyCode({ username, code: verificationCode });
			// 임시: 항상 성공으로 처리 (실제로는 서버 응답에 따라 처리)
			console.log(username);
			const mockResponse = { success: true, token: 'mock-token' };
			
			if (mockResponse.success) {
				setIsCodeVerified(true);
				setResetToken(mockResponse.token || null);
				setTimeout(() => {
					setStep('reset');
					setErrors({});
				}, 1000);
			} else {
				setErrors({ verification: 'mismatch' });
			}
		} catch (error) {
			setErrors({ verification: 'mismatch' });
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [verificationCode, timeRemaining, username]);

	// 인증번호 재발송
	const handleResendCode = useCallback(async () => {
		setErrors({});
		setVerificationCode('');
		setIsCodeVerified(false);
		setTimeRemaining(VERIFICATION_TIMEOUT);

		try {
			// TODO: API 호출
			// await authService.resendCode({ username });
			console.log(username);
		} catch (error) {
			// 재발송 실패 시 에러 처리 (선택사항)
			console.log(error);
		}
	}, [username]);

	// 비밀번호 유효성 검증
	const validatePassword = useCallback((pwd: string): 'format' | null => {
		if (pwd.length < 10 || pwd.length > 16) {
			return 'format';
		}

		// 영문, 숫자, 특수문자 중 2종 이상 포함 확인
		const hasLetter = /[a-zA-Z]/.test(pwd);
		const hasNumber = /[0-9]/.test(pwd);
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

		const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
		if (typeCount < 2) {
			return 'format';
		}

		return null;
	}, []);

	// 비밀번호 재설정
	const handleResetPasswordSubmit = useCallback(async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});

		const passwordError = validatePassword(password);
		const passwordConfirmError = password !== passwordConfirm ? 'mismatch' : null;

		if (passwordError) {
			setErrors((prev) => ({ ...prev, password: passwordError }));
		}
		if (passwordConfirmError) {
			setErrors((prev) => ({ ...prev, passwordConfirm: passwordConfirmError }));
		}
		if (passwordError || passwordConfirmError) {
			return;
		}

		if (!resetToken) {
			return;
		}

		setIsLoading(true);
		try {
			// TODO: API 호출
			// await authService.resetPassword({
			// 	token: resetToken,
			// 	newPassword: password,
			// 	confirmPassword: passwordConfirm,
			// });
			// 성공 시 로그인 페이지로 이동
			navigate('/login');
		} catch (error) {
			setErrors({ password: 'format' });
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [password, passwordConfirm, resetToken, validatePassword, navigate]);

	// 아이디 입력 단계
	if (step === 'username') {
		return (
			<AuthLayout>
				<form className='flex flex-col gap-10 items-center justify-center w-full' onSubmit={handleUsernameSubmit}>
					<p className='leading-[normal] text-center text-lg text-text-70 whitespace-pre-line'>
						{t('findPassword.usernameStep.description')}
					</p>
					<div className='flex flex-col gap-4 w-full'>
						<label className='font-semibold leading-[normal] text-text-100 text-xl' htmlFor='username'>
							{t('login.id')}
						</label>
						<div className='flex flex-col gap-1.5'>
							<Input
								id='username'
								onChange={(e) => {
									setUsername(e.target.value);
									setErrors((prev) => ({ ...prev, username: undefined }));
								}}
								placeholder={t('login.idPlaceholder')}
								required
								type='text'
								value={username}
								wrapperClassName={errors.username ? 'outline-system-error rounded' : 'rounded'}
							/>
							{errors.username && (
								<p className='leading-[normal] text-sm text-system-error'>{errors.username}</p>
							)}
						</div>
					</div>
					<Button className='cursor-pointer w-full' disabled={isLoading} type='submit'>
						{t('login.next')}
					</Button>
				</form>
			</AuthLayout>
		);
	}

	// 인증번호 입력 단계
	if (step === 'verification') {
		return (
			<AuthLayout>
				<form className='flex flex-col gap-10 items-center justify-center w-full' onSubmit={handleVerificationSubmit}>
					<p className='leading-[normal] text-center text-lg text-text-70 whitespace-pre-line'>
						{t('findPassword.verificationStep.description')}
					</p>
					<div className='flex flex-col gap-4 w-full'>
						<label className='font-semibold leading-[normal] text-text-100 text-xl' htmlFor='verificationCode'>
							{t('findPassword.verificationStep.codeLabel')}
						</label>
						<div className='flex flex-col gap-1.5'>
							<div className='flex gap-2 items-center'>
								<Input
									icon={<span className='mr-[-0.5rem] text-system-error text-xs'>{timerDisplay}</span>}
									id='verificationCode'
									maxLength={6}
									onChange={(e) => {
										setVerificationCode(e.target.value);
										setErrors((prev) => ({ ...prev, verification: undefined }));
									}}
									placeholder={t('findPassword.verificationStep.codePlaceholder')}
									required
									type='text'
									value={verificationCode}
									wrapperClassName={errors.verification ? 'outline-system-error rounded' : 'rounded'}
								/>
								<Button className='w-24' disabled={isLoading} onClick={handleResendCode} type='button'>
									{t('findPassword.verificationStep.resend')}
								</Button>
							</div>
							{errors.verification === 'mismatch' && (
								<p className='leading-[normal] text-sm text-system-error'>{t('findPassword.verificationStep.codeMismatch')}</p>
							)}
							{errors.verification === 'expired' && (
								<p className='leading-[normal] text-sm text-system-error'>{t('findPassword.verificationStep.codeExpired')}</p>
							)}
							{isCodeVerified && (
								<p className='leading-[normal] text-sm text-system-successful2'>{t('findPassword.verificationStep.codeVerified')}</p>
							)}
						</div>
					</div>
					<Button className='cursor-pointer w-full' disabled={isLoading} type='submit'>
						{t('login.next')}
					</Button>
				</form>
			</AuthLayout>
		);
	}

	// 비밀번호 재설정 단계
	return (
		<AuthLayout>
			<form className='flex flex-col gap-10 items-center justify-center w-full' onSubmit={handleResetPasswordSubmit}>
				<p className='leading-[normal] text-center text-lg text-text-70 whitespace-pre-line'>
					{t('findPassword.resetStep.description')}
				</p>
				<div className='flex flex-col gap-4 w-full'>
					<label className='font-semibold leading-[normal] text-text-100 text-xl' htmlFor='password'>
						{t('findPassword.resetStep.newPasswordLabel')}
					</label>
					<div className='flex flex-col gap-1.5'>
						<Input
							icon={showPassword ? <Eye /> : <EyeOff />}
							id='password'
							onChange={(e) => {
								setPassword(e.target.value);
								setErrors((prev) => ({ ...prev, password: undefined }));
							}}
							onIconClick={() => setShowPassword(!showPassword)}
							placeholder={t('findPassword.resetStep.newPasswordPlaceholder')}
							required
							type={showPassword ? 'text' : 'password'}
							value={password}
							wrapperClassName={errors.password ? 'outline-system-error rounded' : 'rounded'}
						/>
						<div className='flex gap-1 items-center text-primary-70 text-14'>
							<img alt='info' className='h-4 w-4' src={icValidationInfo} />
							<span>{t('findPassword.resetStep.passwordRule')}</span>
						</div>
						{errors.password === 'format' && (
							<p className='leading-[normal] text-sm text-system-error'>{t('findPassword.resetStep.passwordFormatError')}</p>
						)}
					</div>
				</div>
				<div className='flex flex-col gap-4 w-full'>
					<label className='font-semibold leading-[normal] text-text-100 text-xl' htmlFor='passwordConfirm'>
						{t('findPassword.resetStep.passwordConfirmLabel')}
					</label>
					<div className='flex flex-col gap-1.5'>
						<Input
							icon={showPasswordConfirm ? <Eye /> : <EyeOff />}
							id='passwordConfirm'
							onChange={(e) => {
								setPasswordConfirm(e.target.value);
								setErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
							}}
							onIconClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
							placeholder={t('findPassword.resetStep.passwordConfirmPlaceholder')}
							required
							type={showPasswordConfirm ? 'text' : 'password'}
							value={passwordConfirm}
							wrapperClassName={errors.passwordConfirm ? 'outline-system-error rounded' : 'rounded'}
						/>
						<div className='flex gap-1 items-center text-primary-70 text-14'>
							<img alt='info' className='h-4 w-4' src={icValidationInfo} />
							<span>{t('findPassword.resetStep.passwordRule')}</span>
						</div>
						{errors.passwordConfirm === 'format' && (
							<p className='leading-[normal] text-sm text-system-error'>{t('findPassword.resetStep.passwordFormatError')}</p>
						)}
						{errors.passwordConfirm === 'mismatch' && (
							<p className='leading-[normal] text-sm text-system-error'>{t('findPassword.resetStep.passwordMismatch')}</p>
						)}
					</div>
				</div>
				<Button className='cursor-pointer w-full' disabled={isLoading} type='submit'>
					{t('findPassword.resetStep.complete')}
				</Button>
			</form>
		</AuthLayout>
	);
};

export default FindPassword;

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/shared/components/ui';
import AuthLayout from '@/shared/components/auth/AuthLayout';
import { Eye, EyeOff } from '@/shared/components/auth/EyeIcon';
import icValidationInfo from '@/shared/assets/icons/ic_validation_info.svg';
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
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
			setErrors({ username: '아이디를 입력해주세요.' });
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
			setErrors({ username: '아이디가 올바르지 않습니다.' });
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [username]);

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
					<p className='leading-[normal] text-center text-lg text-text-70'>
						입력하신 아이디에 등록된 이메일 주소로<br />
						비밀번호 재설정 인증번호를 보내드립니다.
					</p>
					<div className='flex flex-col gap-4 w-full'>
						<label className='font-semibold leading-[normal] text-text-100 text-xl' htmlFor='username'>
							아이디
						</label>
						<div className='flex flex-col gap-1.5'>
							<Input
								id='username'
								onChange={(e) => {
									setUsername(e.target.value);
									setErrors((prev) => ({ ...prev, username: undefined }));
								}}
								placeholder='아이디를 입력해주세요.'
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
						다음
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
					<p className='leading-[normal] text-center text-lg text-text-70'>
						비밀번호 재설정을 위한 이메일을 전송했습니다.<br />
						메일함에서 인증번호를 확인해주세요.
					</p>
					<div className='flex flex-col gap-4 w-full'>
						<label className='font-semibold leading-[normal] text-text-100 text-xl' htmlFor='verificationCode'>
							인증번호
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
									placeholder='인증번호 6자리를 입력해주세요.'
									required
									type='text'
									value={verificationCode}
									wrapperClassName={errors.verification ? 'outline-system-error rounded' : 'rounded'}
								/>
								<Button className='break-keep' disabled={isLoading} onClick={handleResendCode} type='button'>
									재발송
								</Button>
							</div>
							{errors.verification === 'mismatch' && (
								<p className='leading-[normal] text-sm text-system-error'>인증번호가 일치하지 않습니다.</p>
							)}
							{errors.verification === 'expired' && (
								<p className='leading-[normal] text-sm text-system-error'>인증번호가 만료되었습니다.</p>
							)}
							{isCodeVerified && (
								<p className='leading-[normal] text-sm text-system-successful2'>인증번호가 확인되었습니다.</p>
							)}
						</div>
					</div>
					<Button className='cursor-pointer w-full' disabled={isLoading} type='submit'>
						다음
					</Button>
				</form>
			</AuthLayout>
		);
	}

	// 비밀번호 재설정 단계
	return (
		<AuthLayout>
			<form className='flex flex-col gap-10 items-center justify-center w-full' onSubmit={handleResetPasswordSubmit}>
				<p className='leading-[normal] text-center text-lg text-text-70'>새로 사용하실 비밀번호를 입력해주세요.</p>
				<div className='flex flex-col gap-4 w-full'>
					<label className='font-semibold leading-[normal] text-text-100 text-xl' htmlFor='password'>
						새 비밀번호
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
							placeholder='새 비밀번호를 입력해주세요.'
							required
							type={showPassword ? 'text' : 'password'}
							value={password}
							wrapperClassName={errors.password ? 'outline-system-error rounded' : 'rounded'}
						/>
						<div className='flex gap-1 items-center text-primary-70 text-14'>
							<img alt='info' className='h-4 w-4' src={icValidationInfo} />
							<span>10자 이상~16자 이하 영문, 숫자, 특수문자 2종 이상의 혼합</span>
						</div>
						{errors.password === 'format' && (
							<p className='leading-[normal] text-sm text-system-error'>비밀번호 형식에 맞게 입력해주세요.</p>
						)}
					</div>
				</div>
				<div className='flex flex-col gap-4 w-full'>
					<label className='font-semibold leading-[normal] text-text-100 text-xl' htmlFor='passwordConfirm'>
						새 비밀번호 확인
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
							placeholder='새 비밀번호를 다시 입력해주세요.'
							required
							type={showPasswordConfirm ? 'text' : 'password'}
							value={passwordConfirm}
							wrapperClassName={errors.passwordConfirm ? 'outline-system-error rounded' : 'rounded'}
						/>
						<div className='flex gap-1 items-center text-primary-70 text-14'>
							<img alt='info' className='h-4 w-4' src={icValidationInfo} />
							<span>10자 이상~16자 이하 영문, 숫자, 특수문자 2종 이상의 혼합</span>
						</div>
						{errors.passwordConfirm === 'format' && (
							<p className='leading-[normal] text-sm text-system-error'>비밀번호 형식에 맞게 입력해주세요.</p>
						)}
						{errors.passwordConfirm === 'mismatch' && (
							<p className='leading-[normal] text-sm text-system-error'>비밀번호가 일치하지 않습니다.</p>
						)}
					</div>
				</div>
				<Button className='cursor-pointer w-full' disabled={isLoading} type='submit'>
					완료
				</Button>
			</form>
		</AuthLayout>
	);
};

export default FindPassword;

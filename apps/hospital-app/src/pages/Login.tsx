import { useCallback, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Button, Input } from '@/shared/components/ui';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from '@/shared/components/auth/EyeIcon';
import BigLogo from '@/assets/big_logo_drcall.svg';
import { useTranslation } from 'react-i18next';

const Login = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { login: authLogin } = useAuth();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleLogin = useCallback(async (e: FormEvent) => {
		e.preventDefault();

		// 에러 초기화
		setError('');

		// 유효성 검증
		if (!username.trim() || !password.trim()) {
			setError(t('login.emptyFields'));
			return;
		}

		setIsLoading(true);

		try {
			const response = await authService.login({
				username,
				password,
				rememberMe,
			});

			// 성공: AuthContext에 로그인 정보 저장
			authLogin(response.accessToken, response.user);

			// 대시보드로 이동
			navigate('/dashboard');
		} catch (err) {
			// 실패: 에러 메시지 표시
			let errorMessage = t('login.invalidCredentials');
			if (err instanceof AxiosError) {
				errorMessage = err.response?.data?.error?.message ||
					err.response?.data?.message ||
					errorMessage;
			}
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [authLogin, navigate, password, rememberMe, t, username]);

	return (
		<div className="bg-bg-gray flex justify-center min-h-screen">
			<div className="flex flex-col gap-[3.75rem] justify-center w-[38.75rem]">
				<div className="flex flex-col gap-[1.5625rem] items-center justify-center">
					<img alt="Dr.Call" src={BigLogo} />
					<span className="bg-primary-70 leading-[2.1875rem] px-4 rounded-[2.1875rem] text-base text-center text-white w-fit">
						{t('login.hospital')}
					</span>
				</div>
				<form
					className="flex flex-col gap-10 items-center justify-center w-full"
					onSubmit={handleLogin}
				>
					<div className="flex flex-col gap-5 w-full">
						<div className="flex flex-col gap-4">
							<label
								className="font-semibold leading-[normal] text-text-100 text-xl"
								htmlFor="username"
							>
								{t('login.id')}
							</label>
							<Input
								id="username"
								placeholder={t('login.idPlaceholder')}
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								wrapperClassName="rounded"
							/>
						</div>
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<label
									className="font-semibold leading-[normal] text-text-100 text-xl"
									htmlFor="password"
								>
									{t('login.pw')}
								</label>
								<span
									className="cursor-pointer leading-[normal] text-base text-primary-70"
									onClick={() => navigate('/find-password')}
								>
									{t('login.forget')}
								</span>
							</div>
							<div className="flex flex-col gap-1.5">
								<Input
									icon={showPassword ? <Eye /> : <EyeOff />}
									onIconClick={() => setShowPassword(!showPassword)}
									id="password"
									placeholder={t('login.pwPlaceholder')}
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									wrapperClassName={
										error ? 'outline-system-error rounded' : 'rounded'
									}
								/>
								{error && (
									<p className="leading-[normal] text-sm text-system-error">
										{error}
									</p>
								)}
							</div>
							<div className="flex gap-2 items-center justify-start">
								<input
									className="cursor-pointer"
									id="stayLogin"
									type="checkbox"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
								/>
								<label
									className="cursor-pointer leading-[normal] text-base text-text-100"
									htmlFor="stayLogin"
								>
									{t('login.keep')}
								</label>
							</div>
						</div>
					</div>
					<Button className="cursor-pointer w-full" type="submit" disabled={isLoading}>
						{isLoading ? t('login.ing') : t('login.button')}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default Login;
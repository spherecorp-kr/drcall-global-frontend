import { useCallback, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Button, Input } from '@/shared/components/ui';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from '@/shared/components/auth/EyeIcon';
import BigLogo from '@/assets/big_logo_drcall.svg';

const Login = () => {
	const navigate = useNavigate();
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
			setError('아이디와 비밀번호를 입력해주세요.');
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
			let errorMessage = '아이디 또는 비밀번호가 올바르지 않습니다.';
			if (err instanceof AxiosError) {
				errorMessage = err.response?.data?.error?.message ||
					err.response?.data?.message ||
					errorMessage;
			}
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [username, password, rememberMe, authLogin, navigate]);

	return (
		<div className='bg-bg-gray flex justify-center min-h-screen'>
			<div className='flex flex-col gap-[3.75rem] justify-center w-[38.75rem]'>
				<div className='flex flex-col gap-[1.5625rem] items-center justify-center'>
					<img alt='Dr.Call' src={BigLogo} />
					<span className='bg-primary-70 leading-[2.1875rem] px-4 rounded-[2.1875rem] text-base text-center text-white w-fit'>병원</span>
				</div>
				<form className='flex flex-col gap-10 items-center justify-center w-full' onSubmit={handleLogin}>
					<div className='flex flex-col gap-5 w-full'>
						<div className='flex flex-col gap-4'>
							<label className='font-semibold leading-[normal] text-text-100 text-xl' htmlFor='username'>아이디</label>
							<Input
								id='username'
								placeholder='아이디를 입력해주세요.'
								type='text'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								wrapperClassName='rounded'
							/>
						</div>
						<div className='flex flex-col gap-4'>
							<div className='flex items-center justify-between'>
								<label className='font-semibold leading-[normal] text-text-100 text-xl' htmlFor='password'>비밀번호</label>
								<span
									className='cursor-pointer leading-[normal] text-base text-primary-70'
									onClick={() => navigate('/find-password')}
								>비밀번호를 잊어버리셨나요?</span>
							</div>
							<div className='flex flex-col gap-1.5'>
								<Input
									icon={showPassword ? <Eye /> : <EyeOff />}
									onIconClick={() => setShowPassword(!showPassword)}
									id='password'
									placeholder='비밀번호를 입력해주세요.'
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									wrapperClassName={error ? 'outline-system-error rounded' : 'rounded'}
								/>
								{error && (
									<p className='leading-[normal] text-sm text-system-error'>{error}</p>
								)}
							</div>
							<div className='flex gap-2 items-center justify-start'>
								<input
									className='cursor-pointer'
									id='stayLogin'
									type='checkbox'
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
								/>
								<label className='cursor-pointer leading-[normal] text-base text-text-100' htmlFor='stayLogin'>로그인 상태 유지</label>
							</div>
						</div>
					</div>
					<Button className='cursor-pointer w-full' type='submit' disabled={isLoading}>
						{isLoading ? '로그인 중...' : '로그인'}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default Login;
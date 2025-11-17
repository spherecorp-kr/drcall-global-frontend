import { useCallback, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/shared/components/ui';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import BigLogo from '@/assets/big_logo_drcall.svg';

const EyeOff = () => (
	<div className='flex items-center justify-center mr-[-0.5rem]'>
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<path d="M22 12L22.9315 12.3638C23.0228 12.1299 23.0228 11.8701 22.9315 11.6362L22 12ZM2 12L1.06851 11.6362C0.977162 11.8701 0.977162 12.1299 1.06851 12.3638L2 12ZM10.6144 4.07992C10.0659 4.14387 9.67301 4.64042 9.73696 5.18898C9.80091 5.73755 10.2975 6.13041 10.846 6.06646L10.7302 5.07319L10.6144 4.07992ZM7.04044 7.37311C7.5119 7.08547 7.66093 6.47009 7.37329 5.99862C7.08566 5.52715 6.47028 5.37813 5.99881 5.66576L6.51962 6.51944L7.04044 7.37311ZM10.5858 10.5857C10.9764 10.1952 10.9764 9.56205 10.5859 9.17151C10.1954 8.78097 9.56224 8.78094 9.1717 9.17145L9.87877 9.87859L10.5858 10.5857ZM14.8286 14.8283C15.2191 14.4378 15.219 13.8046 14.8285 13.4141C14.4379 13.0236 13.8048 13.0236 13.4143 13.4142L14.1214 14.1212L14.8286 14.8283ZM19.6477 14.1836C19.3141 14.6238 19.4005 15.251 19.8407 15.5846C20.2808 15.9182 20.9081 15.8318 21.2417 15.3917L20.4447 14.7877L19.6477 14.1836ZM18.0014 18.3341C18.4729 18.0464 18.6219 17.431 18.3343 16.9596C18.0466 16.4881 17.4312 16.3391 16.9598 16.6268L17.4806 17.4804L18.0014 18.3341ZM4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L4 4L4.70711 3.29289ZM19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L20 20L19.2929 20.7071ZM12 15V14C10.8954 14 10 13.1046 10 12H9H8C8 14.2091 9.79086 16 12 16V15ZM12 5V6C16.2118 6 19.603 8.61119 21.0685 12.3638L22 12L22.9315 11.6362C21.1967 7.1941 17.1161 4 12 4V5ZM12 19V18C7.78817 18 4.39698 15.3888 2.93149 11.6362L2 12L1.06851 12.3638C2.80329 16.8059 6.8839 20 12 20V19ZM10.7302 5.07319L10.846 6.06646C11.222 6.02263 11.6069 6 12 6V5V4C11.53 4 11.0678 4.02706 10.6144 4.07992L10.7302 5.07319ZM2 12L2.93149 12.3638C3.75767 10.2482 5.19785 8.49724 7.04044 7.37311L6.51962 6.51944L5.99881 5.66576C3.76125 7.03087 2.04455 9.13695 1.06851 11.6362L2 12ZM9 12H10C10 11.4474 10.2228 10.9488 10.5858 10.5857L9.87877 9.87859L9.1717 9.17145C8.44886 9.89422 8 10.8956 8 12H9ZM14.1214 14.1212L13.4143 13.4142C13.0512 13.7772 12.5526 14 12 14V15V16C13.1044 16 14.1058 15.5511 14.8286 14.8283L14.1214 14.1212ZM22 12L21.0685 11.6362C20.7068 12.5623 20.2272 13.419 19.6477 14.1836L20.4447 14.7877L21.2417 15.3917C21.9346 14.4773 22.504 13.4585 22.9315 12.3638L22 12ZM17.4806 17.4804L16.9598 16.6268C15.5324 17.4976 13.8519 18 12 18V19V20C14.2232 20 16.2636 19.3944 18.0014 18.3341L17.4806 17.4804ZM4 4L3.29289 4.70711L19.2929 20.7071L20 20L20.7071 19.2929L4.70711 3.29289L4 4Z" fill="#00A0D2"/>
		</svg>
	</div>
);

const Eye = () => (
	<div className='flex items-center justify-center mr-[-0.5rem]'>
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="#00A0D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			<circle cx="12" cy="12" r="3" stroke="#00A0D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	</div>
);

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
		} catch (err: any) {
			// 실패: 에러 메시지 표시
			const errorMessage = err.response?.data?.error?.message ||
				err.response?.data?.message ||
				'아이디 또는 비밀번호가 올바르지 않습니다.';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [username, password, rememberMe, authLogin, navigate]);

	return (
		<div className='bg-bg-gray flex justify-center min-h-screen'>
			<div className='flex flex-col gap-[3.75rem] mt-[18.5%] w-[38.75rem]'>
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
								<span className='cursor-pointer leading-[normal] text-base text-primary-70'>비밀번호를 잊어버리셨나요?</span>
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
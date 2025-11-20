import BigLogo from '@/assets/big_logo_drcall.svg';
import BackToLoginButton from './BackToLoginButton';

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<div className='bg-bg-gray flex justify-center min-h-screen relative'>
			<BackToLoginButton />
			<div className='flex flex-col gap-[3.75rem] justify-center w-[38.75rem]'>
				<div className='flex flex-col gap-[1.5625rem] items-center justify-center'>
					<img alt='Dr.Call' src={BigLogo} />
					<span className='bg-primary-70 leading-[2.1875rem] px-4 rounded-[2.1875rem] text-base text-center text-white w-fit'>병원</span>
				</div>
				{children}
			</div>
		</div>
	);
};

export default AuthLayout;


import { useNavigate } from 'react-router-dom';

const BackToLoginButton = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate('/login');
	};

	return (
		<div className='absolute cursor-pointer flex gap-2 items-center left-10 top-10' onClick={handleClick}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path d="M9.87701 4.5L2 12.5L9.87701 20.5M3.38444 12.5635H20" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round"/>
			</svg>
			<span className='text-text-100'>로그인 화면</span>
		</div>
	);
};

export default BackToLoginButton;


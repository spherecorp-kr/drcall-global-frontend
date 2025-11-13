import { useNavigate } from 'react-router-dom';
import cancelIcon from '@/assets/icons/ic_cancel_blue.svg';
import chatIcon from '@/assets/icons/ic_chat.svg';
import checkIcon from '@/assets/icons/ic_check_white.svg';
import { Button } from '@/shared/components/ui';

const TopButtons = () => {
	const navigate = useNavigate();

	return (
		<div className='flex items-center justify-between'>
			<Button
				className='active:bg-primary-90 bg-primary-70 gap-1.5 h-10 hover:bg-primary-80 rounded-sm text-white'
				icon={<img alt='Chat' className='h-5 w-5' src={chatIcon} />}
			>Chat</Button>
			<div className='flex gap-2.5 items-center'>
				<Button
					className='active:bg-white active:border-primary-90 bg-white border border-primary-70 gap-1.5 h-10 hover:bg-bg-blue rounded-sm !text-primary-70'
					icon={<img alt='Cancel' className='h-5 w-5' src={cancelIcon} />}
					onClick={() => navigate('-1')}
				>취소</Button>
				<Button
					className='active:bg-primary-90 bg-primary-70 gap-1.5 h-10 hover:bg-primary-80 rounded-sm text-white'
					icon={<img alt='Done' className='h-5 w-5' src={checkIcon} />}
				>수정 완료</Button>
			</div>
		</div>
	);
};

export default TopButtons;
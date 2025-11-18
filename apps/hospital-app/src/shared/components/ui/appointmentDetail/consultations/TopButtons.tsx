import { useNavigate } from 'react-router-dom';
import chatIcon from '@/assets/icons/ic_chat.svg';
import { Button } from '@/shared/components/ui';
import cancelIcon from '@/assets/icons/ic_cancel_blue.svg';
import checkIcon from '@/assets/icons/ic_check_white.svg';
import doctorOfficeIcon from '@/assets/icons/ic_doctor_office.svg';

const TopButtons = () => {
	const navigate = useNavigate();

	return (
		<div className='flex items-center justify-between'>
			<Button
				className='gap-1.5 h-10 rounded-sm'
				icon={<img alt='Chat' className='h-5 w-5' src={chatIcon} />}
			>Chat</Button>
			<div className='flex gap-2.5 items-center'>
				<Button
					className='gap-1.5 h-10 rounded-sm'
					icon={<img alt='Cancel' className='h-5 w-5' src={cancelIcon} />}
					onClick={() => navigate('-1')}
					variant='outline'
				>진료 취소</Button>
				<Button
					className='gap-1.5 h-10 rounded-sm'
					icon={<img alt='Stethoscope' className='h-5 w-5' src={doctorOfficeIcon} />}
					onClick={() => { alert('todo'); }}
				>진료 시작</Button>
				<Button
					className='gap-1.5 h-10 rounded-sm'
					icon={<img alt='Done' className='h-5 w-5' src={checkIcon} />}
				>수정 완료</Button>
			</div>
		</div>
	);
};

export default TopButtons;
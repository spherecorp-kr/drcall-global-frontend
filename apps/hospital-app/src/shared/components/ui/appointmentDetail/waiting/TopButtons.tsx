import chatIcon from '@/assets/icons/ic_chat.svg';
import videoCallIcon from '@/assets/icons/ic_video_call.svg';
import cancelIcon from '@/assets/icons/ic_cancel_blue.svg';
import checkIcon from '@/assets/icons/ic_check_white.svg';
import { Button } from '@/shared/components/ui';

const TopButtons = () => {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex gap-2.5 items-center'>
				<Button
					className='active:bg-primary-90 bg-primary-70 gap-1.5 h-10 hover:bg-primary-80 rounded-sm text-white'
					icon={<img alt='Chat' className='h-5 w-5' src={chatIcon} />}
				>Chat</Button>
				<Button
					className='active:bg-text-90 bg-tap-1 gap-1.5 h-10 hover:bg-text-80 rounded-sm text-white'
					icon={<img alt='Video Call' className='h-5 w-5' src={videoCallIcon} />}
				>Video Call</Button>
			</div>
			<div className='flex gap-2.5 items-center'>
				<Button
					className='active:bg-white active:border-primary-90 bg-white border border-primary-70 gap-1.5 h-10 hover:bg-bg-blue rounded-sm !text-primary-70'
					icon={<img alt='Cancel' className='h-5 w-5' src={cancelIcon} />}
				>예약 취소</Button>
				<Button
					className='active:bg-primary-90 bg-primary-70 gap-1.5 h-10 hover:bg-primary-80 rounded-sm text-white'
					icon={<img alt='Check' className='h-5 w-5' src={checkIcon} />}
				>예약 확정</Button>
			</div>
		</div>
	);
};

export default TopButtons;
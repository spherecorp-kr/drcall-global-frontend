import chatIcon from '@/assets/icons/ic_chat.svg';
import videoCallIcon from '@/assets/icons/ic_video_call.svg';
import editIcon from '@/assets/icons/ic_edit.svg';
import cancelIcon from '@/assets/icons/ic_cancel.svg';
import checkIcon from '@/assets/icons/ic_check.svg';
import { Button } from '@/shared/components/ui';

const TopButtons = () => {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex gap-2.5 items-center'>
				<Button
					variant='primary'
					size='default'
					icon={<img alt='Chat' className='h-5 w-5' src={chatIcon} />}
				>Chat</Button>
				<Button
					variant='dark'
					size='default'
					icon={<img alt='Video Call' className='h-5 w-5' src={videoCallIcon} />}
				>Video Call</Button>
			</div>
			<div className='flex gap-2.5 items-center'>
				<Button
					variant='outline'
					size='default'
					icon={<img alt='Edit' className='h-5 w-5' src={editIcon} />}
				>예약 수정</Button>
				<Button
					variant='primary'
					size='default'
					icon={<img alt='Cancel' className='h-5 w-5' src={cancelIcon} />}
				>예약 취소</Button>
				<Button
					variant='outline'
					size='default'
					icon={<img alt='Check' className='h-5 w-5' src={checkIcon} />}
				>예약 확정</Button>
			</div>
		</div>
	);
};

export default TopButtons;
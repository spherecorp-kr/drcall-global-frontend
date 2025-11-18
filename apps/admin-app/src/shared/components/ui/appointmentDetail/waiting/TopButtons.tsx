import chatIcon from '@/assets/icons/ic_chat.svg';
import videoCallIcon from '@/assets/icons/ic_video_call.svg';
import cancelIcon from '@/assets/icons/ic_cancel_blue.svg';
import checkIcon from '@/assets/icons/ic_check_white.svg';
import { Button } from '@/shared/components/ui';
import { useAppointment } from '@/pages/AppointmentDetail';
import { appointmentService } from '@/services/appointmentService';
import { useState } from 'react';

const TopButtons = () => {
	const { appointment, refreshAppointment } = useAppointment();
	const [isLoading, setIsLoading] = useState(false);

	const handleConfirm = async () => {
		if (!appointment || isLoading) return;

		if (!window.confirm('예약을 확정하시겠습니까?')) return;

		setIsLoading(true);
		try {
			await appointmentService.confirmAppointment(appointment.id);
			await refreshAppointment();
			alert('예약이 확정되었습니다.');
		} catch (error) {
			console.error('Failed to confirm appointment:', error);
			alert('예약 확정에 실패했습니다.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = async () => {
		if (!appointment || isLoading) return;

		const reason = window.prompt('취소 사유를 입력해주세요:');
		if (!reason) return;

		setIsLoading(true);
		try {
			await appointmentService.cancelAppointment(appointment.id, {
				cancelledBy: 'HOSPITAL',
				cancellationReason: reason,
			});
			await refreshAppointment();
			alert('예약이 취소되었습니다.');
		} catch (error) {
			console.error('Failed to cancel appointment:', error);
			alert('예약 취소에 실패했습니다.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleChat = () => {
		// TODO: Open chat window
		alert('채팅 기능은 준비 중입니다.');
	};

	const handleVideoCall = () => {
		// TODO: Start video call
		alert('화상 통화 기능은 준비 중입니다.');
	};

	return (
		<div className='flex items-center justify-between'>
			<div className='flex gap-2.5 items-center'>
				<Button
					className='active:bg-primary-90 bg-primary-70 gap-1.5 h-10 hover:bg-primary-80 rounded-sm text-white'
					icon={<img alt='Chat' className='h-5 w-5' src={chatIcon} />}
					onClick={handleChat}
				>Chat</Button>
				<Button
					className='active:bg-text-90 bg-tap-1 gap-1.5 h-10 hover:bg-text-80 rounded-sm text-white'
					icon={<img alt='Video Call' className='h-5 w-5' src={videoCallIcon} />}
					onClick={handleVideoCall}
				>Video Call</Button>
			</div>
			<div className='flex gap-2.5 items-center'>
				<Button
					className='active:bg-white active:border-primary-90 bg-white border border-primary-70 gap-1.5 h-10 hover:bg-bg-blue rounded-sm !text-primary-70'
					icon={<img alt='Cancel' className='h-5 w-5' src={cancelIcon} />}
					onClick={handleCancel}
					disabled={isLoading}
				>예약 취소</Button>
				<Button
					className='active:bg-primary-90 bg-primary-70 gap-1.5 h-10 hover:bg-primary-80 rounded-sm text-white'
					icon={<img alt='Check' className='h-5 w-5' src={checkIcon} />}
					onClick={handleConfirm}
					disabled={isLoading}
				>예약 확정</Button>
			</div>
		</div>
	);
};

export default TopButtons;
import { useState } from 'react';
import chatIcon from '@/assets/icons/ic_chat.svg';
import videoCallIcon from '@/assets/icons/ic_video_call.svg';
import cancelIcon from '@/assets/icons/ic_cancel_blue.svg';
import checkIcon from '@/assets/icons/ic_check_white.svg';
import { Button } from '@/shared/components/ui';
import { useCancelReasonDialog } from '@/shared/hooks/useCancelReasonDialog.tsx';
import { useChatStore } from '@/shared/store/chatStore';
import type { Appointment } from '@/services/appointmentService';
import { createChannel, ChannelCustomType } from '@/services/chatService';
import { useTranslation } from 'react-i18next';

interface TopButtonsProps {
	appointment: Appointment;
}

const TopButtons = ({ appointment }: TopButtonsProps) => {
	const { t } = useTranslation();
	const { openCancelReasonDialog } = useCancelReasonDialog();
	const { openChat, setCurrentChannel } = useChatStore();
	const [isCreatingChat, setIsCreatingChat] = useState(false);

	/**
	 * Chat 버튼 클릭 핸들러
	 * - 환자와 1:1 채팅방 생성
	 * - 채팅 플로팅 버튼 및 윈도우 열기
	 */
	const handleChatClick = async () => {
		if (isCreatingChat) return;

		try {
			setIsCreatingChat(true);

			// TODO: Get current user ID from auth context/store
			// For now, using doctor/coordinator as user type
			const currentUserId = 'staff_' + appointment.doctorId; // Temporary

			// Create channel with patient
			const channel = await createChannel(
				{
					userIds: [
						currentUserId,
						'pat_' + appointment.patientId, // Patient external ID
					],
					customType: ChannelCustomType.STAFF_INITIATED,
					appointmentId: appointment.id,
					hospitalId: appointment.hospitalId,
				},
				currentUserId,
			);

			console.log('Chat channel created:', channel);

			// Set current channel and open chat window
			setCurrentChannel(channel);
			openChat(channel);
		} catch (error) {
			console.error('Failed to create chat channel:', error);
			// TODO: Show error toast/notification
		} finally {
			setIsCreatingChat(false);
		}
	};

	return (
		<div className='flex items-center justify-between'>
			<div className='flex gap-2.5 items-center'>
				<Button
					className='active:bg-primary-90 bg-primary-70 gap-1.5 h-10 hover:bg-primary-80 rounded-sm text-white'
					icon={<img alt='Chat' className='h-5 w-5' src={chatIcon} />}
					onClick={handleChatClick}
					disabled={isCreatingChat}
				>
					{isCreatingChat ? t('appointment.detail.buttons.processing') : t('appointment.detail.buttons.chat')}
				</Button>
				<Button
					className='active:bg-text-90 bg-tap-1 gap-1.5 h-10 hover:bg-text-80 rounded-sm text-white'
					icon={<img alt='Video Call' className='h-5 w-5' src={videoCallIcon} />}
				>{t('appointment.detail.buttons.videoCall')}</Button>
			</div>
			<div className='flex gap-2.5 items-center'>
				<Button
					className='active:bg-white active:border-primary-90 bg-white border border-primary-70 gap-1.5 h-10 hover:bg-bg-blue rounded-sm !text-primary-70'
					icon={<img alt='Cancel' className='h-5 w-5' src={cancelIcon} />}
					onClick={openCancelReasonDialog}
				>{t('appointment.detail.buttons.cancel')}</Button>
				<Button
					className='active:bg-primary-90 bg-primary-70 gap-1.5 h-10 hover:bg-primary-80 rounded-sm text-white'
					icon={<img alt='Check' className='h-5 w-5' src={checkIcon} />}
				>{t('appointment.detail.buttons.confirm')}</Button>
			</div>
		</div>
	);
};

export default TopButtons;
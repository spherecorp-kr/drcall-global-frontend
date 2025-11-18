import { useNavigate, useParams } from 'react-router-dom';
import editIcon from '@/shared/assets/icons/ic_edit.svg';
import cancelIcon from '@/assets/icons/ic_cancel_blue.svg';
import { Button } from '@/shared/components/ui';
import { useCancelReasonDialog } from '@/shared/hooks/useCancelReasonDialog.tsx';
import type { Appointment } from '@/services/appointmentService';

interface TopButtonsProps {
	appointment: Appointment;
}

const TopButtons = ({ appointment }: TopButtonsProps) => {
	const navigate = useNavigate();
	const { appointmentSequence } = useParams<{ appointmentSequence: string }>();
	const { openCancelReasonDialog } = useCancelReasonDialog();

	const handleVideoCall = () => {
		const appointmentId = appointment.id.toString();
		const doctorId = appointment.doctorId.toString();

		navigate(`/video-call?appointmentId=${appointmentId}&doctorId=${doctorId}`);
	};

	return (
		<div className='flex items-center justify-between'>
			<button
				onClick={handleVideoCall}
				style={{
					width: '100%',
					height: '100%',
					paddingLeft: 20,
					paddingRight: 20,
					background: 'var(--Tap-1, #3E3E3E)',
					borderRadius: 4,
					justifyContent: 'flex-start',
					alignItems: 'center',
					gap: 6,
					display: 'inline-flex',
					border: 'none',
					cursor: 'pointer',
				}}
			>
				<div style={{ width: 20, height: 20, position: 'relative' }}>
					<div
						style={{
							width: 20,
							height: 17.08,
							left: 0,
							top: 1.66,
							position: 'absolute',
							background: 'var(--Bg-White, white)',
						}}
					/>
				</div>
				<div
					style={{
						textAlign: 'center',
						justifyContent: 'center',
						display: 'flex',
						flexDirection: 'column',
						color: 'var(--Text-0, white)',
						fontSize: 16,
						fontFamily: 'Pretendard',
						fontWeight: '500',
						wordWrap: 'break-word',
					}}
				>
					Video Call
				</div>
			</button>
			<div className='flex gap-2.5 items-center'>
				<Button
					className='active:bg-white active:border-primary-90 bg-white border border-primary-70 gap-1.5 h-10 hover:bg-bg-blue rounded-sm !text-primary-70'
					icon={<img alt='Cancel' className='h-5 w-5' src={cancelIcon} />}
					onClick={openCancelReasonDialog}
				>
					예약 취소
				</Button>
				<Button
					className='active:bg-primary-90 bg-primary-70 gap-1.5 h-10 hover:bg-primary-80 rounded-sm text-white'
					icon={<img alt='Edit' className='h-5 w-5' src={editIcon} />}
					onClick={() => navigate(`/appointment/${appointmentSequence}/edit`)}
				>
					예약 수정
				</Button>
			</div>
		</div>
	);
};

export default TopButtons;
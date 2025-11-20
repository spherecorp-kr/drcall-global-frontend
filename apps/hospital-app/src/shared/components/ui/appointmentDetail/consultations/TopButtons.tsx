import { useNavigate } from 'react-router-dom';
import chatIcon from '@/assets/icons/ic_chat.svg';
import { Button } from '@/shared/components/ui';
import cancelIcon from '@/assets/icons/ic_cancel_blue.svg';
import checkIcon from '@/assets/icons/ic_check_white.svg';
import doctorOfficeIcon from '@/assets/icons/ic_doctor_office.svg';
import { useTranslation } from 'react-i18next';

const TopButtons = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<div className='flex items-center justify-between'>
			<Button
				className='gap-1.5 h-10 rounded-sm'
				icon={<img alt='Chat' className='h-5 w-5' src={chatIcon} />}
			>{t('appointment.detail.buttons.chat')}</Button>
			<div className='flex gap-2.5 items-center'>
				<Button
					className='gap-1.5 h-10 rounded-sm'
					icon={<img alt='Cancel' className='h-5 w-5' src={cancelIcon} />}
					onClick={() => navigate('-1')}
					variant='outline'
				>{t('appointment.detail.buttons.cancelTreatment')}</Button>
				<Button
					className='gap-1.5 h-10 rounded-sm'
					icon={<img alt='Stethoscope' className='h-5 w-5' src={doctorOfficeIcon} />}
					onClick={() => { alert('todo'); }}
				>{t('appointment.detail.buttons.startTreatment')}</Button>
				<Button
					className='gap-1.5 h-10 rounded-sm'
					icon={<img alt='Done' className='h-5 w-5' src={checkIcon} />}
				>{t('appointment.detail.buttons.editComplete')}</Button>
			</div>
		</div>
	);
};

export default TopButtons;
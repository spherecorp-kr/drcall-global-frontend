import { DetailPageLayout } from '@/shared/components/layout';
import { EditDetailLayout } from '@/shared/components/ui/appointmentDetail';

const AppointmentEdit = () => {
	return (
		<div className="flex flex-col h-full overflow-y-auto p-5">
			<DetailPageLayout className='gap-5'>
				<EditDetailLayout />
			</DetailPageLayout>
		</div>
	);
};

export default AppointmentEdit;
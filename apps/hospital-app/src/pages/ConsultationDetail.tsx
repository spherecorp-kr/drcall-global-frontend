import { DetailPageLayout } from '@/shared/components/layout';
import { ConsultationDetailLayout } from '@/shared/components/ui/appointmentDetail';

const ConsultationDetail = () => {
	return (
		<div className="flex flex-col h-full overflow-y-auto p-5">
			<DetailPageLayout className='gap-5'>
				<ConsultationDetailLayout />
			</DetailPageLayout>
		</div>
	);
};

export default ConsultationDetail;
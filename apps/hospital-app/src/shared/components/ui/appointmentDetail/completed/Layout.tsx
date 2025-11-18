import DeliveryInfo from './DeliveryInfo';
import PaymentInfo from './PaymentInfo';
import TopButtons from './TopButtons';
import {
	Memo,
	PatientHealthInfo,
	PatientInfoTable,
	ReadOnlyTreatmentInfo,
	TreatmentHistory,
} from '@/shared/components/ui/appointmentDetail';
import type { Appointment } from '@/services/appointmentService';

interface LayoutProps {
	appointment: Appointment;
}

const Layout = ({ appointment }: LayoutProps) => {
	return (
		<>
			<TopButtons appointment={appointment} />
			<PatientInfoTable />
			<ReadOnlyTreatmentInfo />
			<PaymentInfo />
			<DeliveryInfo />
			<div className='flex gap-4 items-center self-stretch'>
				<Memo />
				<PatientHealthInfo />
			</div>
			<TreatmentHistory />
		</>
	);
};

export default Layout;
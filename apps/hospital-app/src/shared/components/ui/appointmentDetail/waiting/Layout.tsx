import TopButtons from './TopButtons';
import {
	EditableTreatmentInfo,
	Memo,
	PatientHealthInfo,
	PatientInfoTable,
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
			<PatientInfoTable isEditable />
			<EditableTreatmentInfo />
			<div className='flex gap-4 items-center self-stretch'>
				<Memo />
				<PatientHealthInfo />
			</div>
			<TreatmentHistory />
		</>
	);
};

export default Layout;
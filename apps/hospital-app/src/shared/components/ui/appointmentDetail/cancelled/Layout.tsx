import CancelInfo from './CancelInfo';
import {
	Memo,
	PatientHealthInfo,
	PatientInfoTable,
	ReadOnlyTreatmentInfo,
	TreatmentHistory,
} from '@/shared/components/ui/appointmentDetail';
import type { Appointment } from '@/services/appointmentService';

const Layout = () => {
	return (
		<>
			<CancelInfo />
			<PatientInfoTable />
			<ReadOnlyTreatmentInfo />
			<div className='flex gap-4 items-center self-stretch'>
				<Memo />
				<PatientHealthInfo />
			</div>
			<TreatmentHistory />
		</>
	);
};

export default Layout;
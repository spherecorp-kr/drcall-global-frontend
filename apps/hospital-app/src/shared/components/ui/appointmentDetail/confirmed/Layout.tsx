import TopButtons from './TopButtons';
import {
	Memo,
	PatientHealthInfo,
	PatientInfoTable,
	TreatmentHistory,
	TreatmentInfo,
} from '@/shared/components/ui/appointmentDetail';

const Layout = () => {
	return (
		<>
			<TopButtons />
			<PatientInfoTable appointmentStatus='confirmed' />
			<TreatmentInfo />
			<div className='flex gap-4 items-center self-stretch'>
				<Memo />
				<PatientHealthInfo />
			</div>
			<TreatmentHistory />
		</>
	);
};

export default Layout;
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
			<PatientInfoTable />
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
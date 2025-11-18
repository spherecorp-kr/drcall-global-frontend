import TopButtons from './TopButtons';
import {
	PatientInfoTable,
	ReadOnlyTreatmentInfo,
	TreatmentHistory,
} from '@/shared/components/ui/appointmentDetail';

const Layout = () => {
	return (
		<>
			<TopButtons />
			<PatientInfoTable />
			<ReadOnlyTreatmentInfo />
			<div className='flex gap-4 items-center self-stretch'>
				
			</div>
			<TreatmentHistory />
		</>
	);
};

export default Layout;
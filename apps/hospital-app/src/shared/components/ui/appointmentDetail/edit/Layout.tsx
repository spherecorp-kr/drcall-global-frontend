import TopButtons from './TopButtons';
import {
	EditableTreatmentInfo,
	Memo,
	PatientHealthInfo,
	PatientInfoTable,
	TreatmentHistory,
} from '@/shared/components/ui/appointmentDetail';

const Layout = () => {
	return (
		<>
			<TopButtons />
			<PatientInfoTable />
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
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
				<Memo placeholder='의료진 또는 코디네이터가 숙지해야 할 특이 사항이 있다면 적어주세요.' />
				<PatientHealthInfo />
			</div>
			<TreatmentHistory />
		</>
	);
};

export default Layout;
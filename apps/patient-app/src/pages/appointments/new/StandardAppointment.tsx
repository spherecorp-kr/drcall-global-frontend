import { useTranslation } from 'react-i18next';
import { useAppointmentWizard } from '@/hooks/useAppointmentWizard';
import DoctorSelection from './DoctorSelection';
import SymptomsInput from './SymptomsInput';
import Questionnaire from './Questionnaire';
import Confirmation from './Confirmation';

export default function StandardAppointment() {
  const { t } = useTranslation();

  const { currentStepConfig } = useAppointmentWizard({
    type: 'standard',
    steps: [
      { id: 1, component: <DoctorSelection />, title: t('appointment.selectDoctor') },
      { id: 2, component: <SymptomsInput appointmentType="standard" />, title: t('appointment.symptoms') },
      { id: 3, component: <Questionnaire appointmentType="standard" />, title: t('appointment.questionnaire') },
      { id: 4, component: <Confirmation appointmentType="standard" />, title: t('appointment.confirmation') },
    ],
  });

  return currentStepConfig.component;
}

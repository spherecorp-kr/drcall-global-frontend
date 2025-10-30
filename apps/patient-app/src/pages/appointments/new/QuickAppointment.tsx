import { useTranslation } from 'react-i18next';
import { useAppointmentWizard } from '@/hooks/useAppointmentWizard';
import SymptomsInput from './SymptomsInput';
import Questionnaire from './Questionnaire';
import Confirmation from './Confirmation';

export default function QuickAppointment() {
  const { t } = useTranslation();

  const { currentStepConfig } = useAppointmentWizard({
    type: 'quick',
    steps: [
      { id: 1, component: <SymptomsInput appointmentType="quick" />, title: t('appointment.symptoms') },
      { id: 2, component: <Questionnaire appointmentType="quick" />, title: t('appointment.questionnaire') },
      { id: 3, component: <Confirmation appointmentType="quick" />, title: t('appointment.confirmation') },
    ],
  });

  return currentStepConfig.component;
}

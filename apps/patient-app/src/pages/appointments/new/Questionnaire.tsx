import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import BottomButtonLayout from '@layouts/BottomButtonLayout';
import ProgressSteps from '@ui/display/ProgressSteps';
import Button from '@ui/buttons/Button';
import TermsAgreement from '@components/TermsAgreement';
import Notice from '@ui/display/Notice';
import { useAppointmentStore } from '@store/appointmentStore';
import { useToast } from '@hooks/useToast';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import PageTitle from '@ui/layout/PageTitle';
import Divider from '@ui/layout/Divider';
import PatientBasicInfoSection from '@appointment/shared/sections/PatientBasicInfoSection';
import PatientDetailInfoSection from '@appointment/shared/sections/PatientDetailInfoSection';
import type { PatientDetailInfo } from '@/types/appointment';
import { mockQuestionnairePatientInfo } from '@mocks/appointment';

type AppointmentType = 'standard' | 'quick';

interface QuestionnaireProps {
  appointmentType?: AppointmentType;
}

export default function Questionnaire({ appointmentType = 'standard' }: QuestionnaireProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setQuestionnaireAnswers = useAppointmentStore((state) => state.setQuestionnaireAnswers);
  const setStep = useAppointmentStore((state) => state.setStep);
  const { showToast, ToastComponent } = useToast();

  // Read existing questionnaire answers from store
  const storedAnswers = useAppointmentStore((state) => state.questionnaireAnswers);

  // Mock data - TODO: 실제로는 API에서 환자 정보를 가져와야 함
  const patientBasicData = mockQuestionnairePatientInfo;

  // Health Info - using PatientDetailInfo type, initialized with stored data
  // Store에서 가져온 값은 표시값("0", "1~2" 등)이므로 그대로 사용
  const [detailInfo, setDetailInfo] = useState<PatientDetailInfo>({
    height: storedAnswers.height ? storedAnswers.height : '',
    weight: storedAnswers.weight ? storedAnswers.weight : '',
    bloodType: storedAnswers.bloodType ? (storedAnswers.bloodType as 'A' | 'B' | 'O' | 'AB') : undefined,
    alcohol: storedAnswers.alcohol ? (storedAnswers.alcohol as any) : undefined,  // 표시값 저장
    smoking: storedAnswers.smoking ? (storedAnswers.smoking as any) : undefined,  // 표시값 저장
    medications: storedAnswers.medications ? storedAnswers.medications : '',
    personalHistory: storedAnswers.personalHistory ? storedAnswers.personalHistory : '',
    familyHistory: storedAnswers.familyHistory ? storedAnswers.familyHistory : ''
  });

  // Terms - Note: Terms agreement should be reset each time
  const [allAgreed, setAllAgreed] = useState(false);
  const [term1, setTerm1] = useState(false);
  const [term2, setTerm2] = useState(false);

  const handleBack = () => {
    if (appointmentType === 'quick') {
      setStep(1); // Go back to symptoms
    } else {
      setStep(2); // Go back to symptoms
    }
  };

  const handleClose = () => {
    navigate('/appointments/new');
  };

  const handleAllAgree = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setTerm1(newValue);
    setTerm2(newValue);
  };

  const handleTerm1 = () => {
    const newValue = !term1;
    setTerm1(newValue);
    if (!newValue) setAllAgreed(false);
    else if (term2) setAllAgreed(true);
  };

  const handleTerm2 = () => {
    const newValue = !term2;
    setTerm2(newValue);
    if (!newValue) setAllAgreed(false);
    else if (term1) setAllAgreed(true);
  };

  const handleDetailInfoChange = (field: keyof PatientDetailInfo, value: string) => {
    setDetailInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-save detail info with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQuestionnaireAnswers({
        height: detailInfo.height || '',
        weight: detailInfo.weight || '',
        bloodType: detailInfo.bloodType || '',
        alcohol: detailInfo.alcohol || '',
        smoking: detailInfo.smoking || '',
        medications: detailInfo.medications || '',
        personalHistory: detailInfo.personalHistory || '',
        familyHistory: detailInfo.familyHistory || ''
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [detailInfo, setQuestionnaireAnswers]);

  const handleNext = () => {
    if (!term1 || !term2) {
      showToast(t('appointment.agreeToTerms'), 'warning');
      return;
    }

    // Data is already saved in real-time, just move to next step
    if (appointmentType === 'quick') {
      setStep(3); // Quick: 증상(1) -> 문진(2) -> 확인(3)
    } else {
      setStep(4); // Standard: 날짜(1) -> 증상(2) -> 문진(3) -> 확인(4)
    }
  };

  const isFormValid = term1 && term2;

  return (
    <MainLayout
      title={t('appointment.questionnaire')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName="p-0"
    >
      <PageContainer hasBottomButton style={{ background: 'transparent' }}>
        {/* Progress Steps */}
        <PageSection style={{ padding: '0' }}>
          <ProgressSteps
            currentStep={appointmentType === 'quick' ? 2 : 3}
            totalSteps={appointmentType === 'quick' ? 3 : 4}
            labels={appointmentType === 'quick' ? [
              t('appointment.progressSteps.symptoms'),
              t('appointment.progressSteps.questionnaire'),
              t('appointment.progressSteps.confirmation')
            ] : [
              t('appointment.progressSteps.date'),
              t('appointment.progressSteps.symptoms'),
              t('appointment.progressSteps.questionnaire'),
              t('appointment.progressSteps.confirmation')
            ]}
          />
        </PageSection>

        <Divider />

        {/* Page Title */}
        <PageSection style={{ padding: '0 1.25rem 0 1.25rem' }}>
          <PageTitle>{t('appointment.questionnaireTitle')}</PageTitle>
        </PageSection>

        {/* Patient Basic Info Section (Read-only) */}
        <PatientBasicInfoSection data={patientBasicData} />

        {/* Patient Detail Info Section (Editable, Always Expanded) */}
        <PageSection title={t('appointment.healthInfo')} gap="md" padding>
          <PatientDetailInfoSection
            data={detailInfo}
            onChange={handleDetailInfoChange}
            readOnly={false}
            expandable={false}
          />
        </PageSection>

        {/* Terms Agreement */}
        <PageSection padding>
          <TermsAgreement
            allAgreed={allAgreed}
            onAllAgreeChange={handleAllAgree}
            terms={[
              {
                checked: term1,
                onChange: handleTerm1,
                required: true,
                text: t('appointment.telemedicineTerms'),
                onDetail: () => navigate('/terms/telemedicine')
              },
              {
                checked: term2,
                onChange: handleTerm2,
                required: true,
                text: t('appointment.privacyTerms'),
                onDetail: () => navigate('/terms/privacy')
              }
            ]}
          />

          {/* Refund Policy */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem'
            }}
          >
            <div style={{ flex: 1, color: '#8A8A8A', fontSize: '1rem', fontWeight: '400' }}>
              {t('appointment.refundPolicy')}
            </div>
            <img
              src="/assets/icons/chevron-right.svg"
              alt="more"
              style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
            />
          </div>
        </PageSection>

        <Divider />

        {/* Notice */}
        <PageSection padding>
          <Notice
            items={[
              t('appointment.editProfileNotice')
            ]}
          />
        </PageSection>
      </PageContainer>

      {/* Bottom Button */}
      <BottomButtonLayout fullWidth contentClassName="">
        <Button onClick={handleNext} disabled={!isFormValid}>
          {t('appointment.appointmentRequest')}
        </Button>
      </BottomButtonLayout>

      {/* Toast */}
      {ToastComponent}
    </MainLayout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import BottomButtonLayout from '@layouts/BottomButtonLayout';
import ProgressSteps from '@ui/display/ProgressSteps';
import Button from '@ui/buttons/Button';
import { useAppointmentStore } from '@store/appointmentStore';
import { useToast } from '@hooks/useToast';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import PageTitle from '@ui/layout/PageTitle';
import Divider from '@ui/layout/Divider';
import TreatmentInfoSection from '@appointment/shared/sections/TreatmentInfoSection';
import { storageService } from '@/services/storageService';

interface SymptomsInputProps {
  appointmentType: 'standard' | 'quick';
}

export default function SymptomsInput({ appointmentType }: SymptomsInputProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setSymptomsStore = useAppointmentStore((state) => state.setSymptoms);
  const setStep = useAppointmentStore((state) => state.setStep);
  const { showToast, ToastComponent } = useToast();

  // Read existing data from store
  const storedSymptoms = useAppointmentStore((state) => state.symptoms);
  const storedImages = useAppointmentStore((state) => state.symptomImages);

  // Initialize with stored data
  const [symptoms, setSymptoms] = useState(storedSymptoms || '');
  const [images, setImages] = useState<string[]>(storedImages || []);
  const [uploading, setUploading] = useState(false);
  const maxImages = 10;

  const isQuick = appointmentType === 'quick';

  // Auto-save symptoms with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSymptomsStore(symptoms, images);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [symptoms, images, setSymptomsStore]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 최대 업로드 가능한 개수 확인
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      showToast(t('appointment.maxImagesReached', { max: maxImages }), 'warning');
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map((file) =>
        storageService.uploadFile({
          file,
          category: 'APPOINTMENT_SYMPTOM_IMAGE',
        })
      );

      const uploadedFiles = await Promise.all(uploadPromises);

      // S3 URL 또는 로컬 경로를 이미지 URL로 사용
      const imageUrls = uploadedFiles.map(
        (fileMetadata) => fileMetadata.s3Url || fileMetadata.localPath || ''
      );

      setImages((prev) => [...prev, ...imageUrls]);
      showToast(
        t('appointment.imagesUploadedSuccessfully', { count: uploadedFiles.length }),
        'success'
      );
    } catch (error) {
      console.error('Failed to upload images:', error);
      showToast(
        t('error.imageUploadFailed', {
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        'error'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    if (isQuick) {
      navigate('/appointments/new');
    } else {
      setStep(1); // Go back to doctor selection
    }
  };

  const handleClose = () => {
    navigate('/appointments/new');
  };

  const handleNext = () => {
    if (!symptoms.trim()) {
      showToast(t('appointment.enterSymptoms'), 'warning');
      return;
    }
    // Data is already saved in real-time, just move to next step
    setStep(isQuick ? 2 : 3);
  };

  return (
    <MainLayout
      title={t('appointment.symptomsInput')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName="p-0"
    >
      <PageContainer hasBottomButton style={{ background: 'transparent' }}>
        {/* Progress Steps */}
        <PageSection style={{ padding: '0' }}>
          <ProgressSteps
            currentStep={isQuick ? 1 : 2}
            totalSteps={isQuick ? 3 : 4}
            labels={isQuick ? [
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
          <PageTitle>{t('appointment.symptomsTitle')}</PageTitle>
        </PageSection>

        {/* Treatment Info Section */}
        <TreatmentInfoSection
          background='gray'
          symptoms={symptoms}
          symptomImages={images}
          onSymptomsChange={setSymptoms}
          onImageUpload={handleImageUpload}
          onImageRemove={handleDeleteImage}
          readOnly={false}
          maxImages={maxImages}
        />
      </PageContainer>

      {/* Bottom Button */}
      <BottomButtonLayout fullWidth contentClassName="">
        <Button onClick={handleNext} disabled={!symptoms.trim() || uploading}>
          {uploading ? t('common.uploading') : t('common.next')}
        </Button>
      </BottomButtonLayout>

      {/* Toast */}
      {ToastComponent}
    </MainLayout>
  );
}

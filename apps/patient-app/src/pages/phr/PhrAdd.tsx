import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhrStore } from '@store/phrStore';
import { useToast } from '@hooks/useToast';
import { logError } from '@utils/errorHandler';
import HeightWeightForm from '@components/phr/forms/HeightWeightForm';
import BloodPressureForm from '@components/phr/forms/BloodPressureForm';
import BloodSugarForm from '@components/phr/forms/BloodSugarForm';
import TemperatureForm from '@components/phr/forms/TemperatureForm';

export default function PhrAdd() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { type: typeParam } = useParams<{ type: string }>();

  const typeMap: Record<string, { type: string; title: string }> = {
    'height_weight': { type: 'height_weight', title: `${t('phr.heightWeight')} ${t('common.add')}` },
    'blood_pressure': { type: 'blood_pressure', title: `${t('phr.bloodPressure')} ${t('common.add')}` },
    'blood_sugar': { type: 'blood_sugar', title: `${t('phr.bloodSugar')} ${t('common.add')}` },
    'temperature': { type: 'temperature', title: `${t('phr.temperature')} ${t('common.add')}` },
  };

  const { createRecord, isSubmitting } = usePhrStore();
  const { showToast, ToastComponent } = useToast();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const typeInfo = typeParam ? typeMap[typeParam] : null;

  if (!typeInfo) {
    navigate(-1);
    return null;
  }

  type PhrFormData = {
    recordedAt: string;
    height?: string;
    weight?: string;
    systolic?: string;
    diastolic?: string;
    heartRate?: string;
    value?: string;
    measurementTime?: string;
  };

  type ParsedPhrData = {
    recordedAt: string;
    height?: number;
    weight?: number;
    systolic?: number;
    diastolic?: number;
    heartRate?: number;
    value?: number;
    measurementTime?: string;
  };

  const handleSubmit = async (data: PhrFormData) => {
    try {
      // Convert string values to numbers
      const parsedData: ParsedPhrData = {
        recordedAt: data.recordedAt,
      };

      if (typeInfo.type === 'height_weight') {
        parsedData.height = parseFloat(data.height || '0');
        parsedData.weight = parseFloat(data.weight || '0');
      } else if (typeInfo.type === 'blood_pressure') {
        parsedData.systolic = parseInt(data.systolic || '0', 10);
        parsedData.diastolic = parseInt(data.diastolic || '0', 10);
        parsedData.heartRate = parseInt(data.heartRate || '0', 10);
      } else if (typeInfo.type === 'blood_sugar') {
        parsedData.value = parseFloat(data.value || '0');
        parsedData.measurementTime = data.measurementTime;
      } else if (typeInfo.type === 'temperature') {
        parsedData.value = parseFloat(data.value || '0');
      }

      await createRecord(typeInfo.type, parsedData);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate(-1); // Go back to detail page
      }, 1500);
    } catch (error) {
      logError(error, { feature: 'PHR', action: 'createRecord', metadata: { type: typeInfo.type } });
      showToast(t('error.serverError'), 'error');
    }
  };

  const renderForm = () => {
    switch (typeInfo.type) {
      case 'height_weight':
        return <HeightWeightForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case 'blood_pressure':
        return <BloodPressureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case 'blood_sugar':
        return <BloodSugarForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case 'temperature':
        return <TemperatureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop - rgba(0, 0, 0, 0.60) */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50"
        onClick={() => navigate(-1)}
      />

      {/* Bottom Sheet Modal - 24px = 1.5rem, max-w 414px = 25.875rem */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[1.5rem] max-w-[25.875rem] mx-auto">
        {/* Handle - 12px = 0.75rem */}
        <div className="h-3 relative bg-white rounded-t-[1.5rem]" />

        {/* Header - 18px gap = 1.125rem */}
        <div className="px-5 flex justify-between items-center gap-[1.125rem]">
          <div className="w-full h-[1.625rem] flex items-center justify-center">
            <span className="text-[#1F1F1F] text-[1.25rem] font-semibold">
              {typeInfo.title}
            </span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-6 h-6 flex items-center justify-center flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2L14 14M2 14L14 2"
                stroke="#1F1F1F"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Spacer - 16px = 1rem */}
        <div className="h-4 bg-white" />

        {/* Form Content */}
        <div className="px-5 pb-5 bg-white">{renderForm()}</div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-[#1F1F1F] text-white px-6 py-3 rounded-lg shadow-lg">
          <span className="text-[0.875rem] font-medium">{t('common.save')}</span>
        </div>
      )}

      {/* Error Toast */}
      {ToastComponent}
    </>
  );
}

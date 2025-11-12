import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import HealthRecordListItem from '@components/phr/HealthRecordListItem';
import EmptyHealthState from '@components/phr/EmptyHealthState';
import ConfirmModal from '@ui/modals/ConfirmModal';
import Spinner from '@ui/feedback/Spinner';
import Toast from '@ui/feedback/Toast';
import { usePhrStore } from '@store/phrStore';
import HeightWeightForm from '@components/phr/forms/HeightWeightForm';
import BloodPressureForm from '@components/phr/forms/BloodPressureForm';
import BloodSugarForm from '@components/phr/forms/BloodSugarForm';
import TemperatureForm from '@components/phr/forms/TemperatureForm';
import { logError } from '@utils/errorHandler';

export default function PhrDetail() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { type: typeParam } = useParams<{ type: string }>();

  const typeMap: Record<string, { type: string; title: string }> = {
    'height_weight': { type: 'height_weight', title: t('phr.heightWeight') },
    'blood_pressure': { type: 'blood_pressure', title: t('phr.bloodPressure') },
    'blood_sugar': { type: 'blood_sugar', title: t('phr.bloodSugar') },
    'temperature': { type: 'temperature', title: t('phr.temperature') },
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { getRecordsByType, fetchRecordsByType, deleteRecord, createRecord, isLoading, isSubmitting } = usePhrStore();

  const typeInfo = typeParam ? typeMap[typeParam] : null;

  useEffect(() => {
    if (typeParam) {
      const type = typeMap[typeParam]?.type;
      if (type) {
        fetchRecordsByType(type);
      }
    }
  }, [typeParam]);

  if (!typeInfo) {
    return (
      <MainLayout title={t('phr.title')} showHeader onBack={() => navigate('/phr')} fullWidth contentClassName="p-0">
        <PageContainer background="white">
          <PageSection padding>
            <div className="text-center py-20">{t('error.notFound')}</div>
          </PageSection>
        </PageContainer>
      </MainLayout>
    );
  }

  const records = getRecordsByType(typeInfo.type);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      // 모달 먼저 닫기
      setDeleteModalOpen(false);
      setDeleteId(null);

      try {
        await deleteRecord(deleteId, typeInfo.type);
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      // Convert string values to numbers
      const parsedData: any = {
        recordedAt: data.recordedAt,
      };

      if (typeInfo.type === 'height_weight') {
        parsedData.height = parseFloat(data.height);
        parsedData.weight = parseFloat(data.weight);
      } else if (typeInfo.type === 'blood_pressure') {
        parsedData.systolic = parseInt(data.systolic, 10);
        parsedData.diastolic = parseInt(data.diastolic, 10);
        parsedData.heartRate = parseInt(data.heartRate, 10);
      } else if (typeInfo.type === 'blood_sugar') {
        parsedData.value = parseFloat(data.value);
        parsedData.measurementTime = data.measurementTime;
      } else if (typeInfo.type === 'temperature') {
        parsedData.value = parseFloat(data.value);
      }

      await createRecord(typeInfo.type, parsedData);

      // Show success toast
      setAddModalOpen(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 1500);
    } catch (error) {
      logError(error, { feature: 'PHR', action: 'createRecord', metadata: { type: typeInfo.type } });
      alert(t('error.serverError'));
    }
  };

  const handleShowToast = (message: string) => {
    setToastMessage(message);
  };

  const renderForm = () => {
    switch (typeInfo.type) {
      case 'height_weight':
        return <HeightWeightForm onSubmit={handleSubmit} isSubmitting={isSubmitting} onPickerStateChange={setIsPickerOpen} onShowToast={handleShowToast} />;
      case 'blood_pressure':
        return <BloodPressureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} onPickerStateChange={setIsPickerOpen} onShowToast={handleShowToast} />;
      case 'blood_sugar':
        return <BloodSugarForm onSubmit={handleSubmit} isSubmitting={isSubmitting} onPickerStateChange={setIsPickerOpen} onShowToast={handleShowToast} />;
      case 'temperature':
        return <TemperatureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} onPickerStateChange={setIsPickerOpen} onShowToast={handleShowToast} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout title={typeInfo.title} showHeader onBack={() => navigate('/phr')} fullWidth contentClassName="p-0">
      <PageContainer style={{ background: '#FAFAFA' }}>
        {/* Header: 상세기록 + 추가 버튼 */}
        <PageSection style={{ padding: '0 1.25rem' }}>
          <div className="flex items-center justify-between">
            <span className="text-[#1F1F1F] text-[1rem] font-normal">{t('phr.recordDetail')}</span>
            <button
              onClick={handleAddClick}
              className="w-[6.75rem] h-8 bg-[#00A0D2] rounded flex items-center justify-center"
            >
              <span className="text-white text-[1rem] font-semibold">+ {t('common.add')}</span>
            </button>
          </div>
        </PageSection>

        {/* Records List */}
        <PageSection padding>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '7.5rem 0' }}>
              <Spinner size="md" />
            </div>
          ) : records.length === 0 ? (
            <EmptyHealthState />
          ) : (
            <div className="bg-white rounded-[0.625rem] overflow-hidden">
              {records.map((record, index) => (
                <HealthRecordListItem
                  key={record.id}
                  record={record}
                  onDelete={handleDeleteClick}
                  isLast={index === records.length - 1}
                />
              ))}
            </div>
          )}
        </PageSection>
      </PageContainer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={t('phr.deleteRecordConfirm')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
      />

      {/* Add Record Bottom Modal */}
      {addModalOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 50,
              display: isPickerOpen ? 'none' : 'block',
            }}
            onClick={() => setAddModalOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              background: 'white',
              borderTopLeftRadius: '1.5rem',
              borderTopRightRadius: '1.5rem',
              maxWidth: '25.875rem',
              margin: '0 auto',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.25rem 1rem 1.25rem',
              display: isPickerOpen ? 'none' : 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <div style={{ width: '1.5rem', height: '1.5rem', background: 'transparent', visibility: 'hidden' }}></div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#1F1F1F', fontSize: '1.25rem', fontFamily: 'Pretendard', fontWeight: '600' }}>
                  {typeInfo.title} {t('common.add')}
                </span>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                style={{ width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <img src='/assets/icons/btn_close_pupup.svg' alt='close_popup' width={24} height={24}/>
              </button>
            </div>

            {/* Form Content */}
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {renderForm()}
            </div>
          </div>
        </>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div
          style={{
            position: 'fixed',
            top: '5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: '#1F1F1F',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span style={{ fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '500' }}>{t('common.save')}</span>
        </div>
      )}

      {/* Validation Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="warning"
          onClose={() => setToastMessage(null)}
        />
      )}
    </MainLayout>
  );
}

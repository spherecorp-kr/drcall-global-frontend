import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import Notice from '@ui/display/Notice';
import BottomButtons from '@ui/layout/BottomButtons';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import PageTitle from '@ui/layout/PageTitle';
import Divider from '@ui/layout/Divider';
import AlertModal from '@ui/modals/AlertModal';
import ConfirmModal from '@ui/modals/ConfirmModal';
import DoctorSelectionModal from '@components/doctor/modals/DoctorSelectionModal';
import AppointmentInfoSection from '@appointment/shared/sections/AppointmentInfoSection';
import TreatmentInfoSection from '@appointment/shared/sections/TreatmentInfoSection';
import PatientBasicInfoSection from '@appointment/shared/sections/PatientBasicInfoSection';
import PatientDetailInfoSection from '@appointment/shared/sections/PatientDetailInfoSection';
import type { PatientDetailInfo } from '@/types/appointment';
import {
  mockAppointmentsDetails,
  mockPatientBasicInfo,
  mockPatientDetailInfo
} from '@mocks/appointments-list';
import { formatDateTime } from '@utils/date';
import { useAppointmentStore } from '@store/appointmentStore';
import { useToast } from '@hooks/useToast';
import { logError } from '@utils/errorHandler';
import { appointmentService, type Appointment } from '@/services/appointmentService';

export default function AppointmentEdit() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const setSelectedListTab = useAppointmentStore((state) => state.setSelectedListTab);
  const { showToast, ToastComponent } = useToast();

  // Fetch appointment data from API
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) {
        navigate('/error/404', { replace: true });
        return;
      }

      setIsLoading(true);
      try {
        const data = await appointmentService.getAppointmentById(id);
        setAppointment(data);
      } catch (error) {
        console.error('Failed to fetch appointment:', error);
        navigate('/error/404', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [id, navigate]);

  if (isLoading || !appointment) {
    return null;
  }

  // 예약 정보 (편집 가능) - API data로 초기화
  const [appointmentData, setAppointmentData] = useState({
    appointmentNumber: appointment.externalId,
    appointmentType: appointment.appointmentType === 'QUICK' ? t('appointment.quickAppointment') : t('appointment.standardAppointment'),
    hospital: {
      name: appointment.hospital?.nameLocal || appointment.hospital?.nameEn || `Hospital ${appointment.hospitalId}`,
      nameEn: appointment.hospital?.nameEn || `Hospital ${appointment.hospitalId}`,
      phone: appointment.hospital?.phone || '-'
    },
    dateTime: appointment.scheduledAt ? formatDateTime(new Date(appointment.scheduledAt), '') : '',
    doctor: appointment.doctor?.name || appointment.doctor?.nameEn || `Doctor ${appointment.doctorId}`
  });

  // Mock data - 환자 기본 정보 (읽기 전용)
  const patientBasicData = mockPatientBasicInfo;

  // 진료 정보 (편집 가능) - API data로 초기화
  const [symptoms, setSymptoms] = useState(appointment.symptoms);
  const [symptomImages, setSymptomImages] = useState<string[]>(
    appointment.symptomImages?.slice(0, 3) || []
  );

  // 환자 상세 정보 (편집 가능) - Mock data로 초기화 (TODO: Get from patient replica)
  const [detailInfo, setDetailInfo] = useState<PatientDetailInfo>(mockPatientDetailInfo);

  // 모달 상태
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] = useState(false);
  const [isCompleteConfirmModalOpen, setIsCompleteConfirmModalOpen] = useState(false);

  // 핸들러
  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');
  const handleCancelClick = () => setIsCancelConfirmModalOpen(true);
  const handleCancelConfirm = () => {
    setIsCancelConfirmModalOpen(false);
    navigate(`/appointments/${id}`);
  };
  const handleCancelCancel = () => setIsCancelConfirmModalOpen(false);

  const handleCompleteClick = () => setIsCompleteConfirmModalOpen(true);
  const handleCompleteCancel = () => setIsCompleteConfirmModalOpen(false);

  const handleCompleteConfirm = async () => {
    setIsCompleteConfirmModalOpen(false);

    try {
      // TODO: API 호출
      // await updateAppointment(id, { symptoms, symptomImages, detailInfo });

      // 임시: 성공/실패를 랜덤으로 시뮬레이션 (나중에 실제 API로 교체)
      const isSuccess = Math.random() > 0.3; // 70% 성공률

      if (isSuccess) {
        // 예약 수정 완료 후 '예약 대기' 탭으로 이동
        setSelectedListTab('pending');
        // 수정 완료 페이지로 이동
        navigate('/appointments/edit/complete', {
          state: {
            appointmentNumber: appointmentData.appointmentNumber,
            appointmentType: appointmentData.appointmentType,
            hospital: appointmentData.hospital.name,
            dateTime: appointmentData.dateTime || '',
            doctor: appointmentData.doctor || '',
            symptoms,
            patientName: patientBasicData.name,
            patientBirthDate: patientBasicData.birthDate,
            patientGender: patientBasicData.gender,
            patientPhone: patientBasicData.phoneNumber,
            patientHeight: detailInfo.height,
            patientWeight: detailInfo.weight,
            patientBloodType: detailInfo.bloodType,
            patientAlcohol: detailInfo.alcohol,
            patientSmoking: detailInfo.smoking,
            patientMedications: detailInfo.medications,
            patientPersonalHistory: detailInfo.personalHistory,
            patientFamilyHistory: detailInfo.familyHistory
          }
        });
      } else {
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      logError(error, { feature: 'Appointment', action: 'updateAppointment', metadata: { id } });
      setIsErrorModalOpen(true);
    }
  };

  const handleErrorConfirm = () => {
    setIsErrorModalOpen(false);
  };

  const handleDatetimeEdit = () => {
    setIsDoctorModalOpen(true);
  };

  const handleDoctorSelectionConfirm = (
    date: Date,
    _doctorId: string,
    doctorName: string,
    timeSlot: string
  ) => {
    // 선택한 날짜, 의사, 시간대로 예약 정보 업데이트
    const formattedDateTime = formatDateTime(date, timeSlot);

    setAppointmentData((prev) => ({
      ...prev,
      dateTime: formattedDateTime,
      doctor: doctorName
    }));

    setIsDoctorModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 최대 이미지 개수 체크
    const remainingSlots = 10 - symptomImages.length;
    const filesToAdd = Math.min(files.length, remainingSlots);

    if (filesToAdd === 0) {
      showToast(t('appointment.maxImagesReached'), 'warning');
      return;
    }

    // 파일을 읽어서 base64 URL로 변환
    const newImages: string[] = [];
    let processed = 0;

    for (let i = 0; i < filesToAdd; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        newImages.push(reader.result as string);
        processed++;

        if (processed === filesToAdd) {
          setSymptomImages((prev) => [...prev, ...newImages]);
        }
      };

      reader.readAsDataURL(file);
    }

    // 파일 선택 후 input 초기화
    e.target.value = '';
  };

  const handleImageRemove = (index: number) => {
    setSymptomImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDetailInfoChange = (field: keyof PatientDetailInfo, value: string) => {
    setDetailInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <MainLayout
      headerBackground='white'
      title={t('appointment.editPendingStatus')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName="p-0"
    >
      <PageContainer hasBottomButton background="white">
        {/* 페이지 타이틀 */}
        <PageSection background="white" style={{ padding: '0 1.25rem' }}>
          <PageTitle>{t('appointment.editPendingTitle')}</PageTitle>
        </PageSection>

        {/* 예약 정보 섹션 (읽기 전용 + 수정 버튼) */}
        <AppointmentInfoSection
          data={appointmentData}
          onDateTimeEdit={handleDatetimeEdit}
          showEditButton
        />

        <Divider />

        {/* 진료 정보 섹션 (편집 가능) */}
        <TreatmentInfoSection
          symptoms={symptoms}
          symptomImages={symptomImages}
          onSymptomsChange={setSymptoms}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          readOnly={false}
          maxImages={10}
        />

        <Divider />

        {/* 환자 기본 정보 섹션 (읽기 전용) */}
        <PatientBasicInfoSection data={patientBasicData} />

        {/* 환자 상세 정보 섹션 (편집 가능 + 확장 가능) */}
        <PatientDetailInfoSection
          data={detailInfo}
          onChange={handleDetailInfoChange}
          readOnly={false}
          expandable
          initialExpanded={false}
        />

        <Divider />

        {/* 유의사항 */}
        <PageSection padding background="white">
          <Notice
            items={[
              t('appointment.editProfileNotice')
            ]}
          />
        </PageSection>
      </PageContainer>

      {/* 하단 버튼 */}
      <BottomButtons
        leftButton={{
          text: t('common.cancel'),
          onClick: handleCancelClick
        }}
        rightButton={{
          text: t('common.complete'),
          onClick: handleCompleteClick
        }}
      />

      {/* 취소 확인 모달 */}
      <ConfirmModal
        isOpen={isCancelConfirmModalOpen}
        message={t('appointment.cancelEditConfirm')}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelCancel}
      />

      {/* 완료 확인 모달 */}
      <ConfirmModal
        isOpen={isCompleteConfirmModalOpen}
        message={t('appointment.completeEditConfirm')}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onConfirm={handleCompleteConfirm}
        onCancel={handleCompleteCancel}
      />

      {/* 실패 모달 */}
      <AlertModal
        isOpen={isErrorModalOpen}
        onClose={handleErrorConfirm}
        message={t('appointment.editFailedMessage')}
      />

      {/* 의사 선택 모달 */}
      <DoctorSelectionModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onConfirm={handleDoctorSelectionConfirm}
      />

      {/* Toast */}
      {ToastComponent}
    </MainLayout>
  );
}

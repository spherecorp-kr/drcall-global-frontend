import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Divider from '@ui/layout/Divider';
import AppointmentInfoSection from '@appointment/shared/sections/AppointmentInfoSection';
import TreatmentInfoSection from '@appointment/shared/sections/TreatmentInfoSection';
import PaymentInfoSection from '@appointment/completed/sections/payment/PaymentInfoSection';
import MedicinePickupSection from '@appointment/completed/sections/medicine/MedicinePickupSection';
import BottomButtonLayout from '@layouts/BottomButtonLayout';
import Button from '@ui/buttons/Button';
import AppointmentDetailLayout from '@layouts/AppointmentDetailLayout';
import { mockCompletedConsultationDetails } from '@mocks/completed-consultations';
import PrescriptionViewerModal from './PrescriptionViewerModal';

export default function CompletedConsultationDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const consultationData = mockCompletedConsultationDetails[id || '1'];

  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

  useEffect(() => {
    if (!consultationData) {
      navigate('/error/404', { replace: true });
    }
  }, [consultationData, navigate]);

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  const handleViewPrescription = () => {
    // TODO: 처방전 모달 또는 페이지로 이동
    setIsPrescriptionOpen(true);
  };

  // 모달 닫기 핸들러
const handleClosePrescription = () => {
  setIsPrescriptionOpen(false);
};

// 다운로드 핸들러 (필요 시 구현)
const handleDownloadPrescription = () => {
  // TODO: 파일 저장/공유 로직 또는 새 창 다운로드 링크 트리거
};

  const handlePayment = () => {
    navigate(`/appointments/${id}/payment`);
  };

  if (!consultationData) {
    return null;
  }

  const showPaymentButton = consultationData.payment.status === 'pending_payment';

  return (
    <>
      <AppointmentDetailLayout
        title={t('appointment.completedDetail')}
        titleStyle={{ padding: '0 1.25rem' }}
        onBack={handleBack}
        onClose={handleClose}
        pageTitle={t('appointment.completedTitle')}
        appointmentInfoSection={
          <AppointmentInfoSection
            data={{
              appointmentNumber: consultationData.appointmentNumber,
              hospital: {
                name: consultationData.hospital.name,
                nameEn: consultationData.hospital.nameEn,
                phone: consultationData.hospital.phone
              },
              completedAt: consultationData.completedAt,
              doctor: `${consultationData.doctor.name} (${consultationData.doctor.nameEn})`
            }}
          />
        }
        treatmentInfoSection={
          <TreatmentInfoSection
            symptoms={consultationData.treatment.symptoms}
            symptomImages={consultationData.treatment.symptomImages}
            readOnly
            isCompleted
            aiSummary={consultationData.treatment.aiSummary}
            doctorAdvice={consultationData.treatment.doctorAdvice}
            prescriptionStatus={consultationData.prescription.status}
            paymentStatus={consultationData.payment.status}
            onViewPrescription={handleViewPrescription}
          />
        }
        additionalSections={
          <>
            <Divider />

            {/* 결제 정보 섹션 */}
            <PaymentInfoSection
              payment={consultationData.payment}
              onPayment={handlePayment}
            />

            <Divider />

            {/* 약 수령 섹션 - 결제 완료이고 약 수령 방법이 있을 때만 */}
            {consultationData.payment.status === 'payment_complete' &&
            consultationData.medicinePickup.method !== 'none' && (
              <>
                <MedicinePickupSection medicinePickup={consultationData.medicinePickup} />
                <Divider />
              </>
            )}
          </>
        }
        patientBasicInfo={{
          name: consultationData.patientInfo.name,
          birthDate: consultationData.patientInfo.birthDate,
          gender: consultationData.patientInfo.gender,
          phoneNumber: consultationData.patientInfo.phoneNumber,
          thaiId: consultationData.patientInfo.thaiIdNumber || ''
        }}
        patientDetailInfo={{
          height: consultationData.patientInfo.height || '',
          weight: consultationData.patientInfo.weight || '',
          bloodType: (consultationData.patientInfo.bloodType as 'A' | 'B' | 'O' | 'AB') || undefined,
          alcohol: undefined,
          smoking: undefined,
          medications: consultationData.patientInfo.medications || '',
          personalHistory: consultationData.patientInfo.personalHistory || '',
          familyHistory: ''
        }}
        hasBottomButton={showPaymentButton}
        bottomButton={
          showPaymentButton ? (
            <BottomButtonLayout fullWidth contentClassName="">
              <Button onClick={handlePayment}>{t('appointment.payment')}</Button>
            </BottomButtonLayout>
          ) : undefined
        }
      />
      {isPrescriptionOpen && (
        <PrescriptionViewerModal
          isOpen={isPrescriptionOpen}
          title={t('appointment.prescription') || 'Prescription'}
          fileUrl={'/prescription_2.pdf'}
          onClose={handleClosePrescription}
          onDownload={handleDownloadPrescription}
        />
      )}
    </>
  );
}

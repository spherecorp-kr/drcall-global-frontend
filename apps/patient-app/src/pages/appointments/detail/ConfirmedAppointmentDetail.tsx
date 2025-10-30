import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@ui/buttons/Button';
import BottomButtonLayout from '@layouts/BottomButtonLayout';
import AppointmentInfoSection from '@appointment/shared/sections/AppointmentInfoSection';
import TreatmentInfoSection from '@appointment/shared/sections/TreatmentInfoSection';
import ConfirmModal from '@ui/modals/ConfirmModal';
import AppointmentDetailLayout from '@layouts/AppointmentDetailLayout';
import {
  mockAppointmentsDetails,
  mockPatientBasicInfo,
  mockPatientDetailInfo
} from '@mocks/appointments-list';
import { useAppointmentStore } from '@store/appointmentStore';

/**
 * 예약 확정 상세 페이지
 * - 예약 1시간 전까지: "예약 취소" 버튼 (파란색)
 * - 예약 1시간 전~진료 예정 10분 전: "진료실 입장" 버튼 (회색, disabled)
 * - 진료 예정 10분 전부터: "진료실 입장" 버튼 (파란색, 활성화)
 */
export default function ConfirmedAppointmentDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const setSelectedListTab = useAppointmentStore((state) => state.setSelectedListTab);

  const appointmentData = mockAppointmentsDetails[id || '4'];
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    if (!appointmentData) {
      navigate('/error/404', { replace: true });
    }
  }, [appointmentData, navigate]);

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  if (!appointmentData) {
    return null;
  }

  // 예약 확정 일시 (임시 하드코딩)
  const confirmedDateTime = '08/05/2023 15:01';

  // TODO: 실제로는 현재 시간과 예약 시간을 비교해서 버튼 상태 결정
  const [buttonStatus] = useState<'before_1hour' | 'before_10min' | 'ready'>('ready');

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = () => {
    console.log('예약 취소');
    setIsCancelModalOpen(false);
    setSelectedListTab('cancelled');
    navigate('/appointments');
  };

  const handleEnterRoom = () => {
    navigate('/consultation/room');
  };

  const getButtonConfig = () => {
    switch (buttonStatus) {
      case 'before_1hour':
        return {
          text: t('appointment.cancel'),
          onClick: handleCancelClick,
          disabled: false,
          background: '#00A0D2'
        };
      case 'before_10min':
        return {
          text: t('appointment.enterRoom'),
          onClick: handleEnterRoom,
          disabled: true,
          background: '#BBBBBB'
        };
      case 'ready':
        return {
          text: t('appointment.enterRoom'),
          onClick: handleEnterRoom,
          disabled: false,
          background: '#00A0D2'
        };
    }
  };

  const buttonConfig = getButtonConfig();

  const noticeItems = [
    t('appointment.notices.confirmed.cancel'),
    t('appointment.notices.confirmed.modify'),
    t('appointment.notices.confirmed.enterRoom')
  ];

  return (
    <>
      <AppointmentDetailLayout
        title={t('appointment.confirmedDetail')}
        onBack={handleBack}
        onClose={handleClose}
        pageTitle={t('appointment.confirmedTitle')}
        additionalTitleContent={
          <div
            style={{
              color: '#00A0D2',
              fontSize: '1rem',
              fontWeight: '400',
              lineHeight: '1.5'
            }}
          >
            {t('appointment.confirmedDateTime')}{'\n'}
            {confirmedDateTime}
          </div>
        }
        appointmentInfoSection={
          <AppointmentInfoSection
            data={{
              appointmentNumber: appointmentData.appointmentNumber,
              appointmentType: appointmentData.appointmentType,
              hospital: appointmentData.hospital,
              dateTime: appointmentData.dateTime,
              doctor: appointmentData.doctor
            }}
            status="confirmed"
          />
        }
        treatmentInfoSection={
          <TreatmentInfoSection
            symptoms={appointmentData.symptoms}
            symptomImages={appointmentData.symptomImages?.slice(0, 5)}
            readOnly
          />
        }
        patientBasicInfo={mockPatientBasicInfo}
        patientDetailInfo={mockPatientDetailInfo}
        noticeItems={noticeItems}
        hasBottomButton
        bottomButton={
          <BottomButtonLayout fullWidth contentClassName="">
            <Button
              onClick={buttonConfig.onClick}
              disabled={buttonConfig.disabled}
              style={{
                ...(buttonConfig.disabled ? {} : { background: buttonConfig.background }),
                cursor: buttonConfig.disabled ? 'not-allowed' : 'pointer'
              }}
            >
              {buttonConfig.text}
            </Button>
          </BottomButtonLayout>
        }
      />

      {/* 예약 취소 확인 모달 */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        message={t('appointment.cancelConfirm')}
        onConfirm={handleCancelConfirm}
        onCancel={() => setIsCancelModalOpen(false)}
      />
    </>
  );
}

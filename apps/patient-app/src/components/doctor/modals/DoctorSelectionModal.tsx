import PageTitle from '@ui/layout/PageTitle';
import CalendarModal from '@ui/modals/CalendarModal';
import BottomButtons from '@ui/layout/BottomButtons';
import DoctorCard from '../cards/DoctorCard';
import EmptyDoctorState from '../EmptyDoctorState';
import useModalScrollLock from '@hooks/useModalScrollLock';
import { useDoctorSelection } from '@hooks/useDoctorSelection';
import { mockDoctors } from '@mocks/doctors';
import { formatDate } from '@utils/date';
import { useTranslation } from 'react-i18next';

interface DoctorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, doctorId: string, doctorName: string, timeSlot: string) => void;
  initialDate?: Date;
}

/**
 * 의사 선택 풀스크린 모달 컴포넌트
 * - 예약 수정 시 사용
 * - 전체 화면 모달
 */
export default function DoctorSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  initialDate
}: DoctorSelectionModalProps) {
  // 모달 오픈 동안 배경 스크롤 차단
  useModalScrollLock(isOpen);

  const { t } = useTranslation();

  const {
    selectedDate,
    selectedDoctor,
    selectedDoctorName,
    selectedTimeSlots,
    isCalendarOpen,
    isSelectionComplete,
    handleDateSelect,
    handleTimeSlotSelect,
    openCalendar,
    closeCalendar
  } = useDoctorSelection(initialDate);

  const handleConfirmClick = () => {
    if (isSelectionComplete && selectedDoctor && selectedDoctorName) {
      onConfirm(
        selectedDate,
        selectedDoctor,
        selectedDoctorName,
        selectedTimeSlots[selectedDoctor]
      );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Full Screen Modal */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#FAFAFA',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            height: '3.5rem',
            background: '#FAFAFA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
        >
          <h1
            style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              color: '#1F1F1F',
              margin: 0
            }}
          >
            {t('appointment.selectDoctorAndDateTime')}
          </h1>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '1.25rem',
              width: '1.875rem',
              height: '1.875rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img src='/assets/icons/btn-끄기.svg' alt='close_popup' width={30} height={30}/>
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: '5.625rem'
          }}
        >
          {/* Title */}
          <div
            style={{
              paddingLeft: '1.25rem',
              paddingRight: '1.25rem',
              marginTop: '1.875rem',
              marginBottom: '1.75rem'
            }}
          >
            <PageTitle>
              {t('appointment.selectDateTime')}
            </PageTitle>
          </div>

          {/* Date Picker Button */}
          <div
            style={{
              paddingLeft: '1.25rem',
              paddingRight: '1.25rem',
              marginBottom: '1.25rem'
            }}
          >
            <button
              onClick={openCalendar}
              style={{
                width: '100%',
                height: '2.875rem',
                paddingLeft: '1.25rem',
                paddingRight: '1.25rem',
                background: 'white',
                boxShadow: '0px 0px 10px rgba(180, 180, 180, 0.50)',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <div
                style={{
                  flex: '1',
                  textAlign: 'center',
                  color: '#1F1F1F',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {formatDate(selectedDate)}
              </div>
              <img
                src="/assets/icons/calendar-today.svg"
                alt="calendar"
                style={{ width: '1.5rem', height: '1.5rem' }}
              />
            </button>
          </div>

          {/* Doctor Cards or Empty State */}
          {mockDoctors.length > 0 ? (
            <div
              style={{
                paddingLeft: '1.25rem',
                paddingRight: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              {mockDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  selectedTimeSlot={
                    selectedDoctor === doctor.id
                      ? selectedTimeSlots[doctor.id]
                      : undefined
                  }
                  onTimeSlotSelect={handleTimeSlotSelect}
                />
              ))}
            </div>
          ) : (
            <EmptyDoctorState />
          )}
        </div>

        {/* Bottom Buttons */}
        <BottomButtons
          leftButton={{
            text: '취소',
            onClick: onClose
          }}
          rightButton={{
            text: '완료',
            onClick: handleConfirmClick,
            disabled: !isSelectionComplete
          }}
        />
      </div>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={closeCalendar}
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
      />
    </>
  );
}

import { useState } from 'react';
import { useAppointmentStore } from '@store/appointmentStore';

/**
 * 의사 선택 로직을 관리하는 custom hook
 * - 페이지와 모달 양쪽에서 재사용 가능
 * - 날짜, 의사, 시간대 선택 상태 관리
 * - Store에서 기존 선택 데이터를 읽어와 초기화
 */
export function useDoctorSelection(initialDate?: Date) {
  // Read existing selections from store
  const storedDate = useAppointmentStore((state) => state.selectedDate);
  const storedDoctorId = useAppointmentStore((state) => state.selectedDoctorId);
  const storedDoctorName = useAppointmentStore((state) => state.selectedDoctorName);
  const storedTimeSlot = useAppointmentStore((state) => state.selectedTimeSlot);
  const setDateTimeDoctor = useAppointmentStore((state) => state.setDateTimeDoctor);

  // Initialize with stored data or defaults
  const [selectedDate, setSelectedDate] = useState(storedDate || initialDate || new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(storedDoctorId);
  const [selectedDoctorName, setSelectedDoctorName] = useState<string | null>(storedDoctorName);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{
    [doctorId: string]: string;
  }>(storedDoctorId && storedTimeSlot ? { [storedDoctorId]: storedTimeSlot } : {});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Save to store immediately when date is selected
    if (selectedDoctor && selectedDoctorName && selectedTimeSlots[selectedDoctor]) {
      setDateTimeDoctor(date, selectedDoctor, selectedDoctorName, selectedTimeSlots[selectedDoctor]);
    }
  };

  const handleTimeSlotSelect = (
    doctorId: string,
    doctorName: string,
    time: string
  ) => {
    setSelectedDoctor(doctorId);
    setSelectedDoctorName(doctorName);
    setSelectedTimeSlots({ [doctorId]: time });
    // Save to store immediately when doctor/time is selected
    setDateTimeDoctor(selectedDate, doctorId, doctorName, time);
  };

  const openCalendar = () => setIsCalendarOpen(true);
  const closeCalendar = () => setIsCalendarOpen(false);

  const reset = () => {
    setSelectedDoctor(null);
    setSelectedDoctorName(null);
    setSelectedTimeSlots({});
  };

  const isSelectionComplete =
    !!selectedDoctor &&
    !!selectedDoctorName &&
    !!selectedTimeSlots[selectedDoctor];

  return {
    // State
    selectedDate,
    selectedDoctor,
    selectedDoctorName,
    selectedTimeSlots,
    isCalendarOpen,
    isSelectionComplete,

    // Actions
    handleDateSelect,
    handleTimeSlotSelect,
    openCalendar,
    closeCalendar,
    reset
  };
}

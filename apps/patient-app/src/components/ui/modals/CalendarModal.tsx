import { useState, useMemo } from 'react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  minDate?: Date; // Optional minimum selectable date
  maxDate?: Date; // Optional maximum selectable date
}

export default function CalendarModal({ isOpen, onClose, selectedDate, onSelectDate, minDate, maxDate }: CalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const canGoPrevious = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const minLimit = minDate || today;
    return prevMonth >= new Date(minLimit.getFullYear(), minLimit.getMonth());
  };

  const canGoNext = () => {
    if (!maxDate) return true;
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    return nextMonth <= new Date(maxDate.getFullYear(), maxDate.getMonth());
  };

  const previousMonth = () => {
    if (canGoPrevious()) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    }
  };

  const nextMonth = () => {
    if (canGoNext()) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    }
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelectDate(selected);
    onClose();
  };

  const isSelectedDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isDisabledDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(0, 0, 0, 0);

    const minLimit = minDate || today;
    if (date < minLimit) return true;

    if (maxDate) {
      const maxLimit = new Date(maxDate);
      maxLimit.setHours(0, 0, 0, 0);
      if (date > maxLimit) return true;
    }

    return false;
  };

  const getDayOfWeek = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.getDay();
  };

  const calendarWeeks = useMemo(() => {
    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];

    // Fill starting empty days
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill ending empty days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [daysInMonth, startingDayOfWeek]);

  const monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '21.875rem',
          background: 'white',
          borderRadius: '0.625rem',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* Header - Fixed */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.75rem',
          height: '2.5rem'
        }}>
          <img
            src="/assets/icons/calendar-prev.svg"
            alt="Previous"
            onClick={previousMonth}
            style={{
              width: '1.25rem',
              height: '1.25rem',
              cursor: canGoPrevious() ? 'pointer' : 'not-allowed',
              opacity: canGoPrevious() ? 1 : 0.5,
              transform: 'scaleX(-1)',
              flexShrink: 0
            }}
          />
          <div style={{
            minWidth: '6rem',
            textAlign: 'center',
            color: '#1F1F1F',
            fontSize: '1.0625rem',
            fontWeight: '600',
            lineHeight: '1.375rem',
            whiteSpace: 'nowrap'
          }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <img
            src="/assets/icons/calendar-prev.svg"
            alt="Next"
            onClick={nextMonth}
            style={{
              width: '1.25rem',
              height: '1.25rem',
              cursor: canGoNext() ? 'pointer' : 'not-allowed',
              opacity: canGoNext() ? 1 : 0.5,
              flexShrink: 0
            }}
          />
        </div>

        {/* Week Days - Fixed */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.25rem',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem'
        }}>
          {weekDays.map((day, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                color: '#8A8A8A',
                fontSize: '0.875rem',
                fontWeight: '600',
                lineHeight: '1.125rem'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid - Fixed height */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4375rem',
          height: '17.5rem',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem'
        }}>
          {calendarWeeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '0.25rem',
                height: '2.5rem'
              }}
            >
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return <div key={dayIndex} />;
                }

                const isSelected = isSelectedDate(day);
                const isDisabled = isDisabledDate(day);
                const dayOfWeek = getDayOfWeek(day);
                const isSunday = dayOfWeek === 0;
                const isSaturday = dayOfWeek === 6;

                return (
                  <div
                    key={dayIndex}
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isDisabled ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        width: '2.5rem',
                        height: '2.5rem',
                        background: '#00A0D2',
                        borderRadius: '50%'
                      }} />
                    )}
                    <span style={{
                      position: 'relative',
                      textAlign: 'center',
                      color: isDisabled ? '#BBBBBB' : isSelected ? 'white' : isSunday ? '#FC0606' : isSaturday ? '#007AD2' : '#1F1F1F',
                      fontSize: isSelected ? '1.5rem' : '1.25rem',
                      fontWeight: isSelected ? '500' : '400',
                      lineHeight: '1.5625rem'
                    }}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

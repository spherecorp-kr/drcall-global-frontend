import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  initialDate?: string;
  title?: string;
}

export default function DatePickerModal({ isOpen, onClose, onConfirm, initialDate, title }: DatePickerModalProps) {
  const { t } = useTranslation();
  const modalTitle = title || t('common.birthDate');
  const currentYear = new Date().getFullYear();
  const [selectedDay, setSelectedDay] = useState(6);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2023);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (initialDate) {
      const [day, month, year] = initialDate.split('/').map(Number);
      setSelectedDay(day);
      setSelectedMonth(month);
      setSelectedYear(year);
    }
  }, [initialDate]);

  const handleConfirm = () => {
    const formattedDate = `${String(selectedDay).padStart(2, '0')}/${String(selectedMonth).padStart(2, '0')}/${selectedYear}`;
    onConfirm(formattedDate);
    // onClose는 onConfirm 내부에서 호출되도록 변경
  };

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
        alignItems: 'flex-end',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'white',
          borderTopLeftRadius: '1.25rem',
          borderTopRightRadius: '1.25rem',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          position: 'relative',
          borderBottom: '1px solid #F0F0F0'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '400', color: '#1f1f1f', margin: 0 }}>
            {modalTitle}
          </h3>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '1.25rem',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer'
            }}
          >
            <img src='/assets/icons/btn_close_pupup.svg' alt='close_popup' width={24} height={24}/>
          </button>
        </div>

        {/* Picker */}
        <div style={{
          display: 'flex',
          height: '15rem',
          padding: '1rem 0.625rem',
          overflow: 'hidden'
        }}>
          {/* Day */}
          <PickerColumn
            values={days}
            selectedValue={selectedDay}
            onChange={setSelectedDay}
            isFirst
          />
          {/* Month */}
          <PickerColumn
            values={months}
            selectedValue={selectedMonth}
            onChange={setSelectedMonth}
          />
          {/* Year */}
          <PickerColumn
            values={years}
            selectedValue={selectedYear}
            onChange={setSelectedYear}
            isLast
          />
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          style={{
            width: '100%',
            padding: '1.25rem',
            background: '#00A0D2',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {t('common.confirm')}
        </button>
      </div>
    </div>
  );
}

interface PickerColumnProps {
  values: number[];
  selectedValue: number;
  onChange: (value: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

function PickerColumn({ values, selectedValue, onChange, isFirst, isLast }: PickerColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const ITEM_HEIGHT = 48; // 3rem = 48px

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollTop = scrollContainer.scrollTop;
      setScrollTop(currentScrollTop);

      const index = Math.round(currentScrollTop / ITEM_HEIGHT);
      const value = values[index];
      if (value && value !== selectedValue) {
        onChange(value);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [values, selectedValue, onChange]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const index = values.indexOf(selectedValue);
    if (index !== -1) {
      scrollContainer.scrollTop = index * ITEM_HEIGHT;
      setScrollTop(index * ITEM_HEIGHT);
    }
  }, [selectedValue, values]);

  const getItemStyle = (index: number, isSelected: boolean) => {
    const centerOffset = scrollTop / ITEM_HEIGHT;
    const distance = index - centerOffset;
    const absDistance = Math.abs(distance);

    // 3D rotation effect - tighter cylinder
    const rotateX = distance * 30; // More rotation for tighter feel
    const scale = Math.max(0.85, 1 - absDistance * 0.08); // Less scale difference
    const opacity = Math.max(0.2, 1 - absDistance * 0.4); // Faster opacity fade

    // Calculate vertical offset for cylinder curve
    const translateY = Math.sin((distance * Math.PI) / 6) * 2; // Subtle curve

    return {
      height: '3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isSelected ? '1.25rem' : '1rem',
      fontWeight: isSelected ? '500' : '400',
      color: isSelected ? '#1f1f1f' : '#BBBBBB',
      cursor: 'pointer',
      userSelect: 'none' as const,
      scrollSnapAlign: 'center' as const,
      transform: `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`,
      transformStyle: 'preserve-3d' as const,
      opacity,
      transition: 'transform 0.1s ease, opacity 0.1s ease',
    };
  };

  return (
    <div style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      perspective: '600px'
    }}>
      {/* Selection highlight */}
      <div style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: 0,
        right: 0,
        height: '3rem',
        background: '#F6F6F6',
        zIndex: 0,
        pointerEvents: 'none',
        borderTopLeftRadius: isFirst ? '0.625rem' : 0,
        borderBottomLeftRadius: isFirst ? '0.625rem' : 0,
        borderTopRightRadius: isLast ? '0.625rem' : 0,
        borderBottomRightRadius: isLast ? '0.625rem' : 0
      }} />

      <div
        ref={scrollRef}
        style={{
          height: '100%',
          overflowY: 'scroll',
          paddingTop: '6rem',
          paddingBottom: '6rem',
          position: 'relative',
          zIndex: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: 'y mandatory',
          transformStyle: 'preserve-3d'
        }}
        className="hide-scrollbar"
      >
        {values.map((value, index) => {
          const isSelected = selectedValue === value;
          return (
            <div
              key={value}
              onClick={() => {
                onChange(value);
                const targetIndex = values.indexOf(value);
                if (scrollRef.current) {
                  scrollRef.current.scrollTop = targetIndex * ITEM_HEIGHT;
                }
              }}
              style={getItemStyle(index, isSelected)}
            >
              {String(value).padStart(2, '0')}
            </div>
          );
        })}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

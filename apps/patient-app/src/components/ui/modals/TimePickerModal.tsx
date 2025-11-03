import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (time: string) => void;
  initialTime?: string; // Format: "HH:MM"
  title?: string;
}

export default function TimePickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialTime = '12:00',
  title,
}: TimePickerModalProps) {
  const { t } = useTranslation();
  const modalTitle = title || t('phr.dateTime');
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    if (initialTime) {
      const [hour, minute] = initialTime.split(':').map(Number);
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [initialTime]);

  const handleConfirm = () => {
    const formattedTime = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    onConfirm(formattedTime);
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
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f1f1f', margin: 0 }}>
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
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Hour */}
          <PickerColumn
            values={hours}
            selectedValue={selectedHour}
            onChange={setSelectedHour}
            isFirst
            padZero={false}
          />
          {/* Minute */}
          <PickerColumn
            values={minutes}
            selectedValue={selectedMinute}
            onChange={setSelectedMinute}
            isLast
            padZero={true}
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
  showHighlight?: boolean;
  padZero?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

function PickerColumn({ values, selectedValue, onChange, showHighlight = true, padZero = false, isFirst, isLast }: PickerColumnProps) {
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
      if (value !== undefined && value !== selectedValue) {
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

    // 3D rotation effect
    const rotateX = distance * 30;
    const scale = Math.max(0.85, 1 - absDistance * 0.08);
    const opacity = Math.max(0.2, 1 - absDistance * 0.4);

    // Calculate vertical offset for cylinder curve
    const translateY = Math.sin((distance * Math.PI) / 6) * 2;

    return {
      height: '3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isSelected ? '1.375rem' : '1.125rem',
      fontWeight: isSelected ? '500' : '400',
      color: isSelected ? '#1f1f1f' : '#979797',
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
      {showHighlight && (
        <div style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: 0,
          right: 0,
          height: '3rem',
          background: '#F5F5F5',
          zIndex: 0,
          pointerEvents: 'none',
          borderTopLeftRadius: isFirst ? '0.625rem' : 0,
          borderBottomLeftRadius: isFirst ? '0.625rem' : 0,
          borderTopRightRadius: isLast ? '0.625rem' : 0,
          borderBottomRightRadius: isLast ? '0.625rem' : 0
        }} />
      )}

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
              {padZero ? String(value).padStart(2, '0') : value}
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

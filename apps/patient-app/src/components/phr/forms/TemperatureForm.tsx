import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import DatePickerModal from '@ui/modals/DatePickerModal';
import TimePickerModal from '@ui/modals/TimePickerModal';

interface TemperatureFormData {
  recordedAt: string;
  temperature: string; // Changed from 'value' to match backend
}

interface TemperatureFormProps {
  onSubmit: (data: TemperatureFormData) => void;
  isSubmitting: boolean;
  onPickerStateChange?: (isOpen: boolean) => void;
  onShowToast?: (message: string) => void;
}

export default function TemperatureForm({
  onSubmit,
  isSubmitting,
  onPickerStateChange,
  onShowToast,
}: TemperatureFormProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm'));
  const [value, setValue] = useState<string>('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const isFormValid = value.trim() !== '';

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // 숫자와 소수점만 허용, 최대 2자리.1자리 (50.0)
    if (inputValue === '' || /^\d{0,2}(\.\d{0,1})?$/.test(inputValue)) {
      const numValue = parseFloat(inputValue);
      if (inputValue === '' || (numValue >= 0 && numValue <= 50)) {
        setValue(inputValue);
      }
    }
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const [hours, minutes] = time.split(':').map(Number);
    const recordedDate = new Date(date);
    recordedDate.setHours(hours, minutes, 0, 0);

    onSubmit({
      recordedAt: recordedDate.toISOString(),
      temperature: value, // Changed field name to match backend
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ padding: '0 1.25rem 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Date & Time */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <label style={{ color: '#595959', fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '400', lineHeight: '1.225rem' }}>
            {t('phr.dateTime')}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Date Input */}
            <button
              onClick={() => {
                setShowDatePicker(true);
                onPickerStateChange?.(true);
              }}
              style={{
                flex: 1,
                height: '2.5rem',
                padding: '0.75rem',
                background: 'white',
                borderRadius: '0.5625rem',
                border: '1px solid #E0E0E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: '#1F1F1F', fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '400' }}>
                {format(date, 'dd/MM/yyyy')}
              </span>
              <img src="/src/assets/icons/phr/calendar_today.svg" alt="Calendar" style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>

            {/* Time Input */}
            <button
              onClick={() => {
                setShowTimePicker(true);
                onPickerStateChange?.(true);
              }}
              style={{
                flex: 1,
                height: '2.5rem',
                padding: '0.75rem',
                background: 'white',
                borderRadius: '0.5625rem',
                border: '1px solid #E0E0E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: '#1F1F1F', fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '400' }}>{time}</span>
              <img src="/src/assets/icons/phr/Time Circle.svg" alt="Time" style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>
          </div>
        </div>

        {/* Temperature Value */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: '#595959', fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '400', lineHeight: '1.225rem' }}>
              {t('phr.temperature')}
            </label>
            <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <input
                  type="text"
                  inputMode="decimal"
                  value={value}
                  onChange={handleValueChange}
                  placeholder={t('phr.enterTemperature')}
                  style={{
                    flex: 1,
                    color: '#1F1F1F',
                    fontSize: '1rem',
                    fontFamily: 'Pretendard',
                    fontWeight: '400',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                  }}
                />
                <span style={{ textAlign: 'right', color: '#C1C1C1', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '400' }}>
                  °C
                </span>
              </div>
              <div style={{ height: '1px', background: '#E0E0E0' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || isSubmitting}
        style={{
          width: '100%',
          height: '3.9375rem',
          background: isFormValid && !isSubmitting ? '#00A0D2' : '#C1C1C1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isFormValid && !isSubmitting ? 'pointer' : 'not-allowed',
        }}
      >
        <span style={{ color: 'white', fontSize: '1.125rem', fontFamily: 'Pretendard', fontWeight: '500' }}>
          {isSubmitting ? t('phr.saving') : t('common.confirm')}
        </span>
      </button>

      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => {
          setShowDatePicker(false);
          onPickerStateChange?.(false);
        }}
        onConfirm={(dateString) => {
          const [day, month, year] = dateString.split('/').map(Number);
          const newDate = new Date(year, month - 1, day);

          // 현재 선택된 시간과 조합하여 미래 시간 체크
          const [hours, minutes] = time.split(':').map(Number);
          const selectedDateTime = new Date(newDate);
          selectedDateTime.setHours(hours, minutes, 0, 0);

          if (selectedDateTime > new Date()) {
            onShowToast?.(t('phr.cannotSelectFutureTime'));
            return;
          }

          setDate(newDate);
          setShowDatePicker(false);
          onPickerStateChange?.(false);
        }}
        initialDate={format(date, 'dd/MM/yyyy')}
        title={t('common.date')}
      />

      <TimePickerModal
        isOpen={showTimePicker}
        onClose={() => {
          setShowTimePicker(false);
          onPickerStateChange?.(false);
        }}
        onConfirm={(selectedTime) => {
          // 미래 시간 체크
          const [hours, minutes] = selectedTime.split(':').map(Number);
          const selectedDateTime = new Date(date);
          selectedDateTime.setHours(hours, minutes, 0, 0);

          if (selectedDateTime > new Date()) {
            onShowToast?.(t('phr.cannotSelectFutureTime'));
            return;
          }

          setTime(selectedTime);
          setShowTimePicker(false);
          onPickerStateChange?.(false);
        }}
        initialTime={time}
        title={t('common.time')}
      />

    </div>
  );
}

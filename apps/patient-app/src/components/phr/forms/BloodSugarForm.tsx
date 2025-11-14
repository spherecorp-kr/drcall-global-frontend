import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import DatePickerModal from '@ui/modals/DatePickerModal';
import TimePickerModal from '@ui/modals/TimePickerModal';
import type { BloodSugarMeasurementTime } from '@/types/phr';

interface BloodSugarFormData {
  recordedAt: string;
  value: string;
  measurementTime: BloodSugarMeasurementTime;
}

interface BloodSugarFormProps {
  onSubmit: (data: BloodSugarFormData) => void;
  isSubmitting: boolean;
  onPickerStateChange?: (isOpen: boolean) => void;
  onShowToast?: (message: string) => void;
}

export default function BloodSugarForm({
  onSubmit,
  isSubmitting,
  onPickerStateChange,
  onShowToast,
}: BloodSugarFormProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm'));
  const [value, setValue] = useState<string>('');
  const [measurementTime, setMeasurementTime] = useState<BloodSugarMeasurementTime | null>(null);

  const leftColumnOptions = useMemo(() => [
    { value: 'before_breakfast' as BloodSugarMeasurementTime, label: t('phr.beforeBreakfast') },
    { value: 'before_lunch' as BloodSugarMeasurementTime, label: t('phr.beforeLunch') },
    { value: 'before_dinner' as BloodSugarMeasurementTime, label: t('phr.beforeDinner') },
    { value: 'before_sleep' as BloodSugarMeasurementTime, label: t('phr.beforeSleep') },
  ], [t]);

  const rightColumnOptions = useMemo(() => [
    { value: 'after_breakfast' as BloodSugarMeasurementTime, label: t('phr.afterBreakfast') },
    { value: 'after_lunch' as BloodSugarMeasurementTime, label: t('phr.afterLunch') },
    { value: 'after_dinner' as BloodSugarMeasurementTime, label: t('phr.afterDinner') },
  ], [t]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const isFormValid = value.trim() !== '' && measurementTime !== null;

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // 숫자와 소수점만 허용, 최대 3자리.1자리 (999.9)
    if (inputValue === '' || /^\d{0,3}(\.\d{0,1})?$/.test(inputValue)) {
      const numValue = parseFloat(inputValue);
      if (inputValue === '' || (numValue >= 0 && numValue <= 600)) {
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
      value,
      measurementTime: measurementTime!,
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

        {/* Measurement Time */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <label style={{ color: '#595959', fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '400', lineHeight: '1.225rem' }}>
            {t('phr.measurementTime')}
          </label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Left Column */}
            <div style={{ width: '11.0625rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {leftColumnOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMeasurementTime(option.value)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}
                >
                  <div
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      background: 'white',
                      borderRadius: '9999px',
                      border: `1px solid ${measurementTime === option.value ? '#00A0D2' : '#E0E0E0'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {measurementTime === option.value && (
                      <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: '#00A0D2' }} />
                    )}
                  </div>
                  <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#1F1F1F', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '400' }}>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Right Column */}
            <div style={{ width: '11.0625rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {rightColumnOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMeasurementTime(option.value)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}
                >
                  <div
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      background: 'white',
                      borderRadius: '9999px',
                      border: `1px solid ${measurementTime === option.value ? '#00A0D2' : '#E0E0E0'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {measurementTime === option.value && (
                      <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: '#00A0D2' }} />
                    )}
                  </div>
                  <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#1F1F1F', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '400' }}>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blood Sugar Value */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: '#595959', fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '400', lineHeight: '1.225rem' }}>
            {t('phr.bloodSugar')}
            </label>
            <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <input
                  type="text"
                  inputMode="decimal"
                  value={value}
                  onChange={handleValueChange}
                  placeholder={t('phr.enterBloodSugar')}
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
                  mg/dL
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

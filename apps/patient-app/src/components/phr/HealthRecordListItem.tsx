import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import type {
  HealthRecord,
  HeightWeightRecord,
  BloodPressureRecord,
  BloodSugarRecord,
  TemperatureRecord,
  BloodSugarMeasurementTime,
} from '@/types/phr';

interface HealthRecordListItemProps {
  record: HealthRecord;
  onDelete: (id: string) => void;
  isLast?: boolean;
}


export default function HealthRecordListItem({
  record,
  onDelete,
  isLast = false,
}: HealthRecordListItemProps) {
  const { t } = useTranslation();
  const recordDate = format(new Date(record.recordedAt), 'dd/MM/yyyy HH:mm');

  const measurementTimeLabels = useMemo<Record<BloodSugarMeasurementTime, string>>(() => ({
    before_breakfast: t('phr.beforeBreakfast'),
    after_breakfast: t('phr.afterBreakfast'),
    before_lunch: t('phr.beforeLunch'),
    after_lunch: t('phr.afterLunch'),
    before_dinner: t('phr.beforeDinner'),
    after_dinner: t('phr.afterDinner'),
    before_sleep: t('phr.beforeSleep'),
  }), [t]);

  const renderContent = () => {
    switch (record.type) {
      case 'height_weight': {
        const hwRecord = record as HeightWeightRecord;
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '0.9375rem' }}>
            <div>
              <span style={{ color: '#1F1F1F', fontSize: '1.375rem', fontFamily: 'Pretendard', fontWeight: '600', display: 'inline-block', minWidth: '3.125rem', textAlign: 'right' }}>
                {hwRecord.height}
              </span>
              <span style={{ color: '#979797', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '400' }}>cm</span>
            </div>
            <div>
              <span style={{ color: '#1F1F1F', fontSize: '1.375rem', fontFamily: 'Pretendard', fontWeight: '600', display: 'inline-block', minWidth: '3.125rem', textAlign: 'right' }}>
                {hwRecord.weight}
              </span>
              <span style={{ color: '#979797', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '400' }}>kg</span>
            </div>
            <div>
              <span style={{ color: '#1F1F1F', fontSize: '1.375rem', fontFamily: 'Pretendard', fontWeight: '600', display: 'inline-block', minWidth: '3.125rem', textAlign: 'right' }}>
                {hwRecord.bmi}
              </span>
              <span style={{ color: '#979797', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '400' }}>BMI</span>
            </div>
          </div>
        );
      }

      case 'blood_pressure': {
        const bpRecord = record as BloodPressureRecord;
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '0.9375rem' }}>
            <div>
              <span style={{ color: '#1F1F1F', fontSize: '1.375rem', fontFamily: 'Pretendard', fontWeight: '600', display: 'inline-block', minWidth: '4.375rem', textAlign: 'right' }}>
                {bpRecord.systolic}/{bpRecord.diastolic}
              </span>
              <span style={{ color: '#979797', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '400' }}>mmHg</span>
            </div>
            <div>
              <span style={{ color: '#1F1F1F', fontSize: '1.375rem', fontFamily: 'Pretendard', fontWeight: '600', display: 'inline-block', minWidth: '3.125rem', textAlign: 'right' }}>
                {bpRecord.heartRate}
              </span>
              <span style={{ color: '#979797', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '400' }}>BPM</span>
            </div>
          </div>
        );
      }

      case 'blood_sugar': {
        const bsRecord = record as BloodSugarRecord;
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '0.9375rem' }}>
            <div style={{ color: '#1F1F1F', fontSize: '1.125rem', fontFamily: 'Pretendard', fontWeight: '600', width: '10rem', flexShrink: 0 }}>
              {measurementTimeLabels[bsRecord.measurementTime]}
            </div>
            <div>
              <span style={{ color: '#1F1F1F', fontSize: '1.375rem', fontFamily: 'Pretendard', fontWeight: '600', display: 'inline-block', minWidth: '3.125rem', textAlign: 'right' }}>
                {bsRecord.value}
              </span>
              <span style={{ color: '#979797', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '400' }}> mg/dL</span>
            </div>
          </div>
        );
      }

      case 'temperature': {
        const tempRecord = record as TemperatureRecord;
        return (
          <div>
            <span style={{ color: '#1F1F1F', fontSize: '1.375rem', fontFamily: 'Pretendard', fontWeight: '600', display: 'inline-block', minWidth: '3.125rem', textAlign: 'right' }}>
              {tempRecord.value}
            </span>
            <span style={{ color: '#979797', fontSize: '1rem', fontFamily: 'Pretendard', fontWeight: '400' }}>°C</span>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        alignSelf: 'stretch',
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        borderBottom: isLast ? 'none' : '1px var(--Stroke-Input, #E0E0E0) solid',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '1rem',
        display: 'flex'
      }}
    >
      {/* Date */}
      <div style={{ alignSelf: 'stretch', color: '#979797', fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '400' }}>
        {recordDate}
      </div>

      {/* Content & Delete Button */}
      <div style={{ alignSelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex' }}>
        {renderContent()}

        {/* Delete Button */}
        <button
          onClick={() => onDelete(record.id)}
          style={{ width: '1.25rem', height: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Delete record"
        >
          <img src="/src/assets/icons/phr/btn_trash_can.svg" alt="Delete" style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </div>
    </div>
  );
}

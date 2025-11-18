import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import type {
  HealthRecord,
  HeightWeightRecord,
  BloodPressureRecord,
  BloodSugarRecord,
  TemperatureRecord,
  HealthRecordType,
  BloodSugarMeasurementTime,
} from '@/types/phr';
import { format } from 'date-fns';

interface HealthRecordCardProps {
  record?: HealthRecord;
  type: HealthRecordType;
  title: string;
  icon: string;
  color: string;
  route: string;
}

export default function HealthRecordCard({
  record,
  type,
  title,
  icon,
  route,
}: HealthRecordCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    if (!record) {
      return null;
    }

    const recordDate = format(new Date(record.recordedAt), 'dd/MM/yyyy HH:mm');

    switch (type) {
      case 'height_weight': {
        const hwRecord = record as HeightWeightRecord;
        return (
          <>
            {/* Date - left: 20px from card (40-20), top: 50px from card (238-188), fontSize: 14px */}
            <div className="absolute left-5 top-[3.125rem] text-[#979797] text-[0.875rem] font-normal">
              {recordDate}
            </div>
            {/* Data - left: 20px from card (40-20), top: 77px from card (265-188), gap: 30px */}
            <div className="absolute left-5 top-[4.8125rem] flex items-start gap-[1.875rem]">
              <div>
                <span className="text-[#1F1F1F] text-[1.5rem] font-semibold">
                  {hwRecord.height}
                </span>
                <span className="text-[#979797] text-[1rem] font-normal">cm</span>
              </div>
              <div>
                <span className="text-[#1F1F1F] text-[1.5rem] font-semibold">
                  {hwRecord.weight}
                </span>
                <span className="text-[#979797] text-[1rem] font-normal">kg</span>
              </div>
              <div>
                <span className="text-[#1F1F1F] text-[1.5rem] font-semibold">
                  {hwRecord.bmi}
                </span>
                <span className="text-[#979797] text-[1rem] font-normal">BMI</span>
              </div>
            </div>
          </>
        );
      }

      case 'blood_pressure': {
        const bpRecord = record as BloodPressureRecord;
        return (
          <>
            {/* Date - left: 20px from card, top: 50px from card */}
            <div className="absolute left-5 top-[3.125rem] text-[#979797] text-[0.875rem] font-normal">
              {recordDate}
            </div>
            {/* Data - left: 20px from card, top: 77px from card, gap: 30px */}
            <div className="absolute left-5 top-[4.8125rem] flex items-start gap-[1.875rem]">
              <div>
                <span className="text-[#1F1F1F] text-[1.5rem] font-semibold">
                  {bpRecord.systolic}/{bpRecord.diastolic}
                </span>
                <span className="text-[#979797] text-[1rem] font-normal">mmHg</span>
              </div>
              <div>
                <span className="text-[#1F1F1F] text-[1.5rem] font-semibold">
                  {bpRecord.heartRate}
                </span>
                <span className="text-[#979797] text-[1rem] font-normal">BPM</span>
              </div>
            </div>
          </>
        );
      }

      case 'blood_sugar': {
        const bsRecord = record as BloodSugarRecord;
        return (
          <>
            {/* Date - left: 20px from card, top: 50px from card */}
            <div className="absolute left-5 top-[3.125rem] text-[#979797] text-[0.875rem] font-normal">
              {recordDate}
            </div>
            {/* Data - left: 20px from card, top: 77px from card, gap: 30px */}
            <div className="absolute left-5 top-[4.8125rem] flex items-start gap-[1.875rem]">
              <div className="text-[#1F1F1F] text-[1.5rem] font-semibold">
                {measurementTimeLabels[bsRecord.measurementTime]}
              </div>
              <div>
                <span className="text-[#1F1F1F] text-[1.5rem] font-semibold">
                  {bsRecord.value}
                </span>
                <span className="text-[#979797] text-[1rem] font-normal"> mg/dL</span>
              </div>
            </div>
          </>
        );
      }

      case 'temperature': {
        const tempRecord = record as TemperatureRecord;
        return (
          <>
            {/* Date - left: 20px from card, top: 50px from card */}
            <div className="absolute left-5 top-[3.125rem] text-[#979797] text-[0.875rem] font-normal">
              {recordDate}
            </div>
            {/* Data - left: 20px from card, top: 77px from card */}
            <div className="absolute left-5 top-[4.8125rem] flex items-start gap-[1.875rem]">
              <div>
                <span className="text-[#1F1F1F] text-[1.5rem] font-semibold">
                  {tempRecord.value}
                </span>
                <span className="text-[#979797] text-[1rem] font-normal">°C</span>
              </div>
            </div>
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    /* Card container - width: 100% responsive, height: 192px, bg: white, borderRadius: 10px */
    <div className="w-full h-[12rem] bg-white rounded-[0.625rem] relative">
      {/* Icon - left: 23px from card (43-20), top: 22px from card (210-188) */}
      <img
        src={icon}
        alt={title}
        className="absolute left-[1.4375rem] top-[1.375rem] w-[1.5rem] h-[1.5rem]"
      />

      {/* Title - left: 52px from card (72-20), top: 21px from card (209-188), fontSize: 18px */}
      <h3 className="absolute left-[3.25rem] top-[1.3125rem] text-[#1F1F1F] text-[1.125rem] font-medium">
        {title}
      </h3>

      {/* Content */}
      {renderContent()}

      {/* More Button - left: 20px, right: 20px from card, top: 126px from card (314-188), height: 46px */}
      <button
        onClick={() => navigate(route)}
        className="absolute left-5 right-5 top-[7.875rem] h-[2.875rem] bg-[#00A0D2] rounded-[0.625rem] flex items-center justify-center"
      >
        <span className="text-white text-[1.125rem] font-medium">{t('common.viewMore')}</span>
      </button>
    </div>
  );
}

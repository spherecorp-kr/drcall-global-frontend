import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditableTextInput from '@ui/inputs/EditableTextInput';
import ToggleButtonGroup from '@ui/buttons/ToggleButtonGroup';
import TextareaField from '@ui/inputs/TextareaField';
import type { AlcoholConsumption, SmokingStatus } from '@/types/appointment';

interface PatientDetailInfo {
  height?: string;
  weight?: string;
  bloodType?: 'A' | 'B' | 'O' | 'AB';
  alcohol?: '0' | '1~2' | '3+';  // 표시값
  smoking?: '0' | '1~5' | '6+';  // 표시값
  medications?: string;
  personalHistory?: string;
  familyHistory?: string;
}

interface PatientDetailInfoSectionProps {
  data: PatientDetailInfo;
  onChange?: (field: keyof PatientDetailInfo, value: string) => void;
  readOnly?: boolean;
  expandable?: boolean;
  initialExpanded?: boolean;
}

/**
 * 환자 상세 정보 섹션 컴포넌트
 * - 키&체중, 혈액형, 음주/흡연 여부, 복용약물, 개인력, 가족력
 * - 편집 가능/읽기 전용 모드 지원
 * - 확장/축소 기능 옵션 (AppointmentDetail, AppointmentEdit)
 */
export default function PatientDetailInfoSection({
  data,
  onChange,
  readOnly = false,
  expandable = false,
  initialExpanded = false
}: PatientDetailInfoSectionProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const handleChange = (field: keyof PatientDetailInfo, value: string) => {
    if (onChange && !readOnly) {
      onChange(field, value);
    }
  };

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        paddingTop: expandable ? '1.25rem' : '0'
      }}
    >
      {/* 키 */}
      {(data.height || !readOnly) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#8A8A8A',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('appointment.height')}
          </div>
          {readOnly ? (
            <div
              style={{
                color: '#1F1F1F',
                fontSize: '1rem',
                fontWeight: '400'
              }}
            >
              {data.height}
            </div>
          ) : (
            <EditableTextInput
              value={data.height || ''}
              onChange={(value) => handleChange('height', value)}
              placeholder={t('appointment.heightPlaceholder')}
              unit="cm"
              type="number"
            />
          )}
        </div>
      )}

      {/* 체중 */}
      {(data.weight || !readOnly) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#8A8A8A',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('appointment.weight')}
          </div>
          {readOnly ? (
            <div
              style={{
                color: '#1F1F1F',
                fontSize: '1rem',
                fontWeight: '400'
              }}
            >
              {data.weight}
            </div>
          ) : (
            <EditableTextInput
              value={data.weight || ''}
              onChange={(value) => handleChange('weight', value)}
              placeholder={t('appointment.weightPlaceholder')}
              unit="kg"
              type="number"
            />
          )}
        </div>
      )}

      {/* 혈액형 */}
      {(data.bloodType || !readOnly) && (
        <>
          {readOnly ? (
            data.bloodType && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem'
                }}
              >
                <div
                  style={{
                    color: '#8A8A8A',
                    fontSize: '0.875rem',
                    fontWeight: '400'
                  }}
                >
                  {t('appointment.bloodType')}
                </div>
                <div
                  style={{
                    color: '#1F1F1F',
                    fontSize: '1rem',
                    fontWeight: '400'
                  }}
                >
                  {data.bloodType}
                </div>
              </div>
            )
          ) : (
            <ToggleButtonGroup
              label={t('appointment.bloodType')}
              options={['A', 'B', 'O', 'AB'] as const}
              selectedValue={data.bloodType}
              onChange={(value) => handleChange('bloodType', value)}
            />
          )}
        </>
      )}

      {/* 음주 여부 */}
      {(data.alcohol || !readOnly) && (
        <>
          {readOnly ? (
            data.alcohol && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem'
                }}
              >
                <div
                  style={{
                    color: '#8A8A8A',
                    fontSize: '0.875rem',
                    fontWeight: '400'
                  }}
                >
                  {t('appointment.alcoholUnit')}
                </div>
                <div
                  style={{
                    color: '#1F1F1F',
                    fontSize: '1rem',
                    fontWeight: '400'
                  }}
                >
                  {data.alcohol}
                </div>
              </div>
            )
          ) : (
            <ToggleButtonGroup
              label={t('appointment.alcoholUnit')}
              options={['ZERO', 'ONE_TO_TWO', 'THREE_PLUS'] as const}
              selectedValue={data.alcohol}
              onChange={(value) => handleChange('alcohol', value)}
            />
          )}
        </>
      )}

      {/* 흡연 여부 */}
      {(data.smoking || !readOnly) && (
        <>
          {readOnly ? (
            data.smoking && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem'
                }}
              >
                <div
                  style={{
                    color: '#8A8A8A',
                    fontSize: '0.875rem',
                    fontWeight: '400'
                  }}
                >
                  {t('appointment.smokingUnit')}
                </div>
                <div
                  style={{
                    color: '#1F1F1F',
                    fontSize: '1rem',
                    fontWeight: '400'
                  }}
                >
                  {data.smoking}
                </div>
              </div>
            )
          ) : (
            <ToggleButtonGroup
              label={t('appointment.smokingUnit')}
              options={['ZERO', 'ONE_TO_FIVE', 'SIX_PLUS'] as const}
              selectedValue={data.smoking}
              onChange={(value) => handleChange('smoking', value)}
            />
          )}
        </>
      )}

      {/* 복용중인 약물 */}
      {(data.medications || !readOnly) && (
        <TextareaField
          label={t('appointment.medications')}
          value={data.medications || ''}
          onChange={
            !readOnly
              ? (value) => handleChange('medications', value)
              : undefined
          }
          placeholder={t('appointment.medicationsPlaceholder')}
          maxLength={500}
          readOnly={readOnly}
        />
      )}

      {/* 개인력 */}
      {(data.personalHistory || !readOnly) && (
        <TextareaField
          label={t('appointment.personalHistory')}
          value={data.personalHistory || ''}
          onChange={
            !readOnly
              ? (value) => handleChange('personalHistory', value)
              : undefined
          }
          placeholder={t('appointment.personalHistoryPlaceholder')}
          maxLength={500}
          readOnly={readOnly}
        />
      )}

      {/* 가족력 */}
      {(data.familyHistory || !readOnly) && (
        <TextareaField
          label={t('appointment.familyHistory')}
          value={data.familyHistory || ''}
          onChange={
            !readOnly
              ? (value) => handleChange('familyHistory', value)
              : undefined
          }
          placeholder={t('appointment.familyHistoryPlaceholder')}
          maxLength={500}
          readOnly={readOnly}
        />
      )}
    </div>
  );

  // If not expandable, return content directly
  if (!expandable) {
    return content;
  }

  // If expandable, wrap with toggle button
  return (
    <div
      style={{
        background: 'white',
        padding: '1.25rem'
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'white',
          border: '1px solid #D9D9D9',
          borderRadius: '0.5rem',
          color: '#1F1F1F',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        {isExpanded ? t('appointment.collapseDetail') : t('appointment.expandDetail')}
        <img
          src="/assets/icons/arrow-toggle.svg"
          alt=""
          style={{
            width: '1.25rem',
            height: '1.25rem',
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s'
          }}
        />
      </button>

      {/* Expandable Content */}
      {isExpanded && content}
    </div>
  );
}

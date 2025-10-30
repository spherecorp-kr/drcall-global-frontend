import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ImageGalleryField from '@ui/media/ImageGalleryField';
import PrescriptionSection from '@appointment/completed/sections/treatment/PrescriptionSection';
import DoctorAdviceSection from '@appointment/completed/sections/treatment/DoctorAdviceSection';
import AiSummarySection from '@appointment/completed/sections/treatment/AiSummarySection';

interface TreatmentInfoSectionProps {
  background?: 'white' | 'gray';

  symptoms: string;
  symptomImages?: string[];
  onSymptomsChange?: (value: string) => void;
  onImageAdd?: () => void;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove?: (index: number) => void;
  readOnly?: boolean;
  maxImages?: number;

  // 진료 완료 시 추가 필드
  isCompleted?: boolean;
  aiSummary?: string;
  doctorAdvice?: string;
  prescriptionStatus?: 'not_issued' | 'waiting_upload' | 'uploaded' | 'viewable';
  paymentStatus?: 'pending_billing' | 'pending_payment' | 'payment_complete';
  onViewPrescription?: () => void;
}

/**
 * 진료 정보 섹션 컴포넌트
 * - 주요 증상, 증상 이미지 표시
 * - readOnly 모드: 상세 페이지에서 사용
 * - 편집 모드: 수정/생성 페이지에서 사용
 * - 진료 완료 시: AI 진료 요약, 의사 조언, 처방전 업로드 표시
 */
export default function TreatmentInfoSection({
  symptoms,
  symptomImages,
  onSymptomsChange,
  onImageAdd,
  onImageUpload,
  onImageRemove,
  readOnly = false,
  maxImages = 10,
  isCompleted = false,
  aiSummary,
  doctorAdvice,
  prescriptionStatus,
  paymentStatus,
  onViewPrescription,
  background = 'white'
}: TreatmentInfoSectionProps) {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 텍스트 변경 시 높이 자동 조정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, readOnly ? 80 : 100)}px`;
    }
  }, [symptoms, readOnly]);

  return (
    <div style={{ background: background === 'white' ? '#FFFFFF' : '#FAFAFA', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 제목 */}
      <h2 style={{ color: '#1F1F1F', fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
        {t('appointment.treatmentInfo')}
      </h2>

      {/* 주요 증상 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src="/assets/icons/clipboard-text.svg"
            alt=""
            style={{ width: '1.375rem', height: '1.375rem' }}
          />
          <div style={{ color: '#1F1F1F', fontSize: '1.125rem', fontWeight: '600' }}>
            {t('appointment.primarySymptoms')}
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={symptoms}
          onChange={onSymptomsChange ? (e) => onSymptomsChange(e.target.value) : undefined}
          placeholder={t('appointment.enterSymptoms')}
          maxLength={500}
          readOnly={readOnly}
          style={{
            minHeight: readOnly ? '5rem' : '6.25rem',
            background: readOnly ? '#FAFAFA' : 'white',
            borderRadius: '0.5rem',
            border: '1px solid #E0E0E0',
            padding: '0.5rem 1rem 0.875rem 1rem',
            fontSize: '0.875rem',
            fontFamily: 'Pretendard',
            fontWeight: '400',
            color: '#1F1F1F',
            resize: 'none',
            overflow: 'hidden',
            outline: 'none',
            boxSizing: 'border-box',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}
        />
      </div>

      {/* 증상 이미지 */}
      {(symptomImages && symptomImages.length > 0) || !readOnly ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src="/assets/icons/gallery.svg"
                alt=""
                style={{ width: '1.375rem', height: '1.375rem' }}
              />
              <div style={{ color: '#1F1F1F', fontSize: '1.125rem', fontWeight: '600' }}>
                {t('appointment.symptomImages')}
              </div>
            </div>
            {readOnly && (symptomImages && symptomImages.length > 0) && (
              <div style={{ color: '#8A8A8A', fontSize: '0.875rem', fontWeight: '400' }}>
                {symptomImages.length}{t('appointment.imagesCount')}
              </div>
            )}
          </div>
          <div style={{ width: '100%', minWidth: 0 }}>
            <ImageGalleryField
              images={symptomImages || []}
              onImageAdd={onImageAdd}
              onImageUpload={onImageUpload}
              onImageRemove={onImageRemove}
              maxImages={maxImages}
              readOnly={readOnly}
              showCount={!readOnly}
              noPadding
            />
          </div>
        </div>
      ) : null}

      {/* 진료 완료 시 추가 항목들 */}
      {isCompleted && (
        <>
          {/* AI 진료 요약 - 결제 완료 시에만 표시 */}
          {aiSummary && paymentStatus === 'payment_complete' && (
            <AiSummarySection aiSummary={aiSummary} />
          )}

          {/* 의사 조언 */}
          {paymentStatus && (
            <DoctorAdviceSection
              doctorAdvice={doctorAdvice}
              paymentStatus={paymentStatus}
            />
          )}

          {/* 처방전 업로드 */}
          {prescriptionStatus && paymentStatus && (
            <PrescriptionSection
              status={prescriptionStatus}
              paymentStatus={paymentStatus}
              onViewPrescription={onViewPrescription}
            />
          )}
        </>
      )}
    </div>
  );
}

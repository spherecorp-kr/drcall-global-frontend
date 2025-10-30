import { useTranslation } from 'react-i18next';
import PageSection from '@ui/layout/PageSection';
import SectionTitle from '@ui/display/SectionTitle';

interface CompletedTreatmentSectionProps {
  symptoms: string;
  symptomImages?: string[];
  aiSummary: string;
  doctorAdvice: string;
  prescriptionStatus: string;
  onViewPrescription?: () => void;
}

export default function CompletedTreatmentSection({
  symptoms,
  symptomImages = [],
  aiSummary,
  doctorAdvice,
  prescriptionStatus,
  onViewPrescription
}: CompletedTreatmentSectionProps) {
  const { t } = useTranslation();

  return (
    <PageSection padding>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SectionTitle>{t('appointment.treatmentInfo')}</SectionTitle>

        {/* 주요 증상 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 18, fontWeight: '600', color: '#1F1F1F' }}>
            {t('appointment.symptoms')}
          </div>
          <div
            style={{
              padding: 12,
              background: '#F5F5F5',
              borderRadius: 9,
              border: '1px solid #D9D9D9',
              minHeight: 80,
              maxHeight: 200
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: '#BBBBBB',
                whiteSpace: 'pre-line',
                maxHeight: 176
              }}
            >
              {symptoms}
            </div>
          </div>
        </div>

        {/* 증상 이미지 */}
        {symptomImages.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 18, fontWeight: '600', color: '#1F1F1F' }}>
              {t('appointment.symptomImages')}
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
              {symptomImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`symptom-${idx}`}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 9,
                    border: '1px solid #D9D9D9',
                    objectFit: 'cover'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* AI 진료 요약 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 18, fontWeight: '600', color: '#1F1F1F' }}>
            {t('appointment.aiSummary')}
          </div>
          <div
            style={{
              padding: 12,
              background: '#F5F5F5',
              borderRadius: 9,
              border: '1px solid #D9D9D9',
              minHeight: 80,
              maxHeight: 200
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: '#BBBBBB',
                whiteSpace: 'pre-line',
                maxHeight: 176
              }}
            >
              {aiSummary}
            </div>
          </div>
        </div>

        {/* 의사 조언 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 18, fontWeight: '600', color: '#1F1F1F' }}>
            {t('appointment.doctorAdvice')}
          </div>
          <div
            style={{
              padding: 12,
              background: '#F5F5F5',
              borderRadius: 9,
              border: '1px solid #D9D9D9',
              minHeight: 80,
              maxHeight: 200
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: '#BBBBBB',
                whiteSpace: 'pre-line',
                maxHeight: 176
              }}
            >
              {doctorAdvice}
            </div>
          </div>
        </div>

        {/* 처방전 업로드 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: 18, fontWeight: '600', color: '#1F1F1F' }}>
            {t('appointment.prescriptionUpload')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: '600', color: '#00A0D2' }}>
              {prescriptionStatus}
            </div>
            {onViewPrescription && (
              <button
                onClick={onViewPrescription}
                style={{
                  height: 32,
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: 10,
                  paddingBottom: 10,
                  background: 'white',
                  borderRadius: 10,
                  border: '1.5px solid #D9D9D9',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#41444B'
                }}
              >
                {t('appointment.viewPrescription')}
              </button>
            )}
          </div>
        </div>
      </div>
    </PageSection>
  );
}

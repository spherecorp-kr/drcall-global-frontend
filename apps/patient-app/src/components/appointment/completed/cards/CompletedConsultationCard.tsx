import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoField from '@ui/display/InfoField';
import type { CompletedConsultationCardData } from '@/types/completed';
import PaymentStatusBadge from '../badges/PaymentStatusBadge';

interface CompletedConsultationCardProps {
  data: CompletedConsultationCardData;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CompletedConsultationCard({
  data,
  isSelected = false,
  onClick
}: CompletedConsultationCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const showPaymentButton = data.paymentStatus === 'pending_payment';

  const handleDetailClick = () => {
    navigate(`/appointments/${data.id}`);
  };

  const handlePaymentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/appointments/${data.id}`);
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '0.625rem',
        border: isSelected ? '2px solid #00A0D2' : 'none',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* 결제 상태 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.875rem', color: '#8A8A8A' }}>{t('appointment.paymentInfo').replace(' 정보', ' 상태')}</div>
        <PaymentStatusBadge status={data.paymentStatus} />
      </div>

      {/* 병원 */}
      <InfoField
        label={t('appointment.hospital')}
        value={`${data.hospitalName} (${data.hospitalNameEn})`}
      />

      {/* 의사 */}
      <InfoField
        label={t('appointment.doctor')}
        value={`${data.doctorName} (${data.doctorNameEn})`}
      />

      {/* 진료 완료 일시 */}
      <InfoField label={t('appointment.completedDetail').replace(' 상세', ' 일시')} value={data.completedAt} />

      {/* 버튼 영역 */}
      {showPaymentButton ? (
        // 결제 대기 상태: 항상 결제하기 버튼 표시
        <button
          onClick={handlePaymentClick}
          style={{
            marginTop: '0.75rem',
            width: '100%',
            height: '3rem',
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid #00A0D2',
            color: '#00A0D2',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {t('appointment.makePayment')}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="#00A0D2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : (
        // 다른 상태: 선택된 경우에만 상세보기 버튼 표시
        isSelected && (
          <button
            onClick={handleDetailClick}
            style={{
              marginTop: '0.75rem',
              width: '100%',
              height: '3rem',
              background: '#00A0D2',
              borderRadius: '1.5rem',
              border: 'none',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {t('appointment.viewDetail')}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )
      )}
    </div>
  );
}

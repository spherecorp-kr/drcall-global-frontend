import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoField from '@ui/display/InfoField';

interface CancelledAppointmentCardProps {
  id: string;
  hospital: string;
  cancelledAt: string;
  cancelledBy: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * 예약 취소 카드 컴포넌트
 * - 취소된 예약 정보를 표시
 * - 병원, 예약 취소 일시, 취소자 정보 포함
 */
export default function CancelledAppointmentCard({
  id,
  hospital,
  cancelledAt,
  cancelledBy,
  isSelected,
  onSelect
}: CancelledAppointmentCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDetailClick = () => {
    navigate(`/appointments/${id}`);
  };

  return (
    <div
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
      <div
        onClick={() => onSelect(id)}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
      >
        <InfoField label={t('appointment.hospital')} value={hospital} />
        <InfoField label={t('appointment.cancelledDetail').replace(' 상세', ' 일시')} value={cancelledAt} />
        <InfoField label={t('appointment.cancelledBy')} value={t(cancelledBy)} bold />
      </div>

      {/* 상세보기 버튼 - 선택된 경우에만 표시 */}
      {isSelected && (
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
      )}
    </div>
  );
}

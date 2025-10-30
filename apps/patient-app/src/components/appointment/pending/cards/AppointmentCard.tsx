import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoField from '@ui/display/InfoField';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface AppointmentCardData {
  id: string;
  type: string;
  hospital: string;
  doctor?: string;
  datetime?: string;
  status: AppointmentStatus;
}

interface AppointmentCardProps {
  appointment: AppointmentCardData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * 예약 카드 컴포넌트
 * - 예약 대기, 예약 확정 등 모든 탭에서 재사용
 * - 선택 시 테두리 표시 및 상세보기 버튼 표시
 */
export default function AppointmentCard({
  appointment,
  isSelected,
  onSelect
}: AppointmentCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 상태에 따라 라벨 변경
  const getDatetimeLabel = () => {
    switch (appointment.status) {
      case 'pending':
        return t('appointment.preferredDateTime');
      case 'confirmed':
        return t('appointment.preferredDateTime');
      case 'completed':
        return t('appointment.preferredDateTime');
      default:
        return t('appointment.preferredDateTime');
    }
  };

  const handleDetailClick = () => {
    // 모든 상태에서 동일한 URL로 이동
    // API에서 조회된 데이터의 status 값에 따라 다른 컴포넌트 렌더링
    navigate(`/appointments/${appointment.id}`);
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
        onClick={() => onSelect(appointment.id)}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
      >
        <InfoField label={t('appointment.appointmentType')} value={appointment.type} />
        <InfoField label={t('appointment.hospital')} value={appointment.hospital} />
        {appointment.doctor && <InfoField label={t('appointment.doctor')} value={appointment.doctor} />}
        {appointment.datetime && (
          <InfoField label={getDatetimeLabel()} value={appointment.datetime} />
        )}
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

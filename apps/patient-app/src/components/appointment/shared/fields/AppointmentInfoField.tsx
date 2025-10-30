import type { ReactNode } from 'react';

interface AppointmentInfoFieldProps {
  icon: string;
  label: string;
  value: ReactNode;
}

/**
 * 예약 정보 필드 컴포넌트
 * - 아이콘 + 라벨 + 값 형태
 * - 예약 확정 상세 페이지에서 사용
 */
export default function AppointmentInfoField({
  icon,
  label,
  value
}: AppointmentInfoFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <img
          src={icon}
          alt=""
          style={{ width: '1.375rem', height: '1.375rem' }}
        />
        <div
          style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1F1F1F'
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          fontSize: '1rem',
          fontWeight: '400',
          color: '#41444B',
          lineHeight: '1.5'
        }}
      >
        {value}
      </div>
    </div>
  );
}

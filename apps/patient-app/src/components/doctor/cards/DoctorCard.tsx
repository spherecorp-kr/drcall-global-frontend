interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  nameEn: string;
  profileImage: string;
  description: string;
  specialty: string[];
  education: string[];
  timeSlots: TimeSlot[];
}

interface DoctorCardProps {
  doctor: Doctor;
  selectedTimeSlot?: string;
  onTimeSlotSelect: (doctorId: string, doctorName: string, time: string) => void;
}

/**
 * 의사 정보 카드 컴포넌트
 * - 의사 프로필, 전문분야, 학력, 진료 시간대 표시
 * - 시간대 선택 기능
 */
export default function DoctorCard({
  doctor,
  selectedTimeSlot,
  onTimeSlotSelect
}: DoctorCardProps) {
  return (
    <div
      style={{
        width: '100%',
        background: 'white',
        borderRadius: '0.625rem',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem'
      }}
    >
      {/* Doctor Info */}
      <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
        <img
          src={doctor.profileImage || '/assets/icons/profile-default.svg'}
          alt={doctor.name}
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            flexShrink: 0,
            objectFit: 'cover'
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1.125rem',
              fontWeight: '600',
              lineHeight: '1.4',
              marginBottom: '0.375rem'
            }}
          >
            {doctor.name}
            <br />
            {doctor.nameEn}
          </div>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          color: '#8A8A8A',
          fontSize: '0.875rem',
          fontWeight: '400',
          lineHeight: '1.4',
          margin: 0,
          whiteSpace: 'pre-line'
        }}
      >
        {doctor.description}
      </p>

      {/* Specialty & Education */}
      <div
        style={{
          color: '#BBBBBB',
          fontSize: '0.875rem',
          fontWeight: '400',
          lineHeight: '1.6'
        }}
      >
        <div>•ผู้เชี่ยวชาญ</div>
        {doctor.specialty.map((spec, idx) => (
          <div key={idx} style={{ paddingLeft: '1rem' }}>
            - {spec}
          </div>
        ))}
        <div style={{ marginTop: '0.25rem' }}>•ประวัติการศึกษา</div>
        {doctor.education.map((edu, idx) => (
          <div key={idx} style={{ paddingLeft: '1rem' }}>
            - {edu}
          </div>
        ))}
      </div>

      {/* Time Slots - Horizontal Scroll */}
      <div
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          marginTop: '0.625rem',
          paddingBottom: '0.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="hide-scrollbar"
      >
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            width: 'max-content'
          }}
        >
          {doctor.timeSlots.map((slot, idx) => {
            const isSelected = selectedTimeSlot === slot.time;
            const isDisabled = !slot.available;

            return (
              <button
                key={idx}
                onClick={() =>
                  slot.available && onTimeSlotSelect(doctor.id, doctor.name, slot.time)
                }
                disabled={isDisabled}
                style={{
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.3125rem',
                  paddingBottom: '0.3125rem',
                  background: isSelected
                    ? '#00A0D2'
                    : isDisabled
                      ? '#F7F7F7'
                      : 'white',
                  borderRadius: '0.25rem',
                  border:
                    isSelected || isDisabled ? 'none' : '1px solid #41444B',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    stroke={isSelected ? 'white' : isDisabled ? '#A6A6A6' : '#41444B'}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 4V8L10.5 10.5"
                    stroke={isSelected ? 'white' : isDisabled ? '#A6A6A6' : '#41444B'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  style={{
                    color: isSelected ? 'white' : isDisabled ? '#A6A6A6' : '#41444B',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  {slot.time}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

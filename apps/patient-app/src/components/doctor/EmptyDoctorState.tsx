/**
 * 의사 검색 결과 없음 상태 컴포넌트
 * - 선택 가능한 의사가 없을 때 표시
 */
export default function EmptyDoctorState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.25rem',
        minHeight: '300px'
      }}
    >
      {/* Search Icon */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        style={{ marginBottom: '2rem' }}
      >
        <circle cx="50" cy="50" r="30" stroke="#00A0D2" strokeWidth="4" />
        <line
          x1="72"
          y1="72"
          x2="90"
          y2="90"
          stroke="#00A0D2"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line x1="20" y1="30" x2="40" y2="30" stroke="#00A0D2" strokeWidth="2" />
        <line x1="80" y1="50" x2="100" y2="50" stroke="#00A0D2" strokeWidth="2" />
      </svg>

      {/* Message */}
      <p
        style={{
          color: '#BBBBBB',
          fontSize: '1rem',
          fontWeight: '400',
          textAlign: 'center',
          margin: 0
        }}
      >
        진료 가능한 의사가 없습니다.
      </p>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  description?: string;
}

/**
 * 빈 상태 표시 컴포넌트
 * - 아이콘 (선택사항)
 * - 메시지
 * - 설명 (선택사항)
 */
export default function EmptyState({ icon, message, description }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '7.5rem',
        paddingBottom: '7.5rem'
      }}
    >
      {/* Icon */}
      {icon && (
        <div
          style={{
            width: '15.625rem',
            height: '12.5rem',
            position: 'relative',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      )}

      {/* Message */}
      <p
        style={{
          textAlign: 'center',
          color: '#979797',
          fontSize: '1rem',
          fontFamily: 'Pretendard',
          fontWeight: '500',
          margin: 0,
          whiteSpace: 'pre-line'
        }}
      >
        {message}
      </p>

      {/* Description */}
      {description && (
        <p
          style={{
            textAlign: 'center',
            color: '#B0B0B0',
            fontSize: '0.875rem',
            fontFamily: 'Pretendard',
            fontWeight: '400',
            margin: '0.5rem 0 0 0',
            whiteSpace: 'pre-line'
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

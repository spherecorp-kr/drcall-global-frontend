interface EditableTextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  type?: 'text' | 'number';
}

/**
 * 편집 가능한 텍스트 입력 필드
 * - 키, 체중 등 단위가 있는 입력에 사용
 * - 하단 언더라인 스타일
 */
export default function EditableTextInput({
  label,
  value,
  onChange,
  placeholder,
  unit,
  type = 'text'
}: EditableTextInputProps) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem'
      }}
    >
      {label && (
        <div
          style={{
            color: '#8A8A8A',
            fontSize: '0.875rem',
            fontWeight: '400'
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            fontFamily: 'Pretendard',
            color: '#1F1F1F',
            background: 'transparent'
          }}
          className="placeholder:text-[#8A8A8A]"
        />
        {unit && (
          <span
            style={{
              color: '#8A8A8A',
              fontSize: '1rem',
              fontWeight: '400'
            }}
          >
            {unit}
          </span>
        )}
      </div>
      <div
        style={{
          height: '1px',
          background: '#D9D9D9'
        }}
      />
    </div>
  );
}

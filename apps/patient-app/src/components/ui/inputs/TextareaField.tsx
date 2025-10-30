import { useEffect, useRef } from 'react';

interface TextareaFieldProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxLength?: number;
  readOnly?: boolean;
  icon?: string;
  noPadding?: boolean;
}

/**
 * Textarea 필드 컴포넌트
 * - 주요 증상, 복용중인 약물, 개인력, 가족력 등에 사용
 * - readOnly 모드 지원 (배경색 변경)
 * - 자동으로 높이 조정 (스크롤 없이 내용에 맞춰 늘어남)
 */
export default function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  minHeight = '5rem',
  maxLength,
  readOnly = false,
  icon,
  noPadding = false
}: TextareaFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 텍스트 변경 시 높이 자동 조정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, parseInt(minHeight))}px`;
    }
  }, [value, minHeight]);

  if (noPadding) {
    // 컨텐츠만 렌더링 (라벨/아이콘 없음, 환자 상세정보 스타일)
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        maxLength={maxLength}
        readOnly={readOnly}
        style={{
          width: '100%',
          minHeight,
          padding: '0.75rem',
          background: readOnly ? '#F5F5F5' : 'white',
          borderRadius: '0.5625rem',
          border: '1px solid #D9D9D9',
          fontSize: '0.875rem',
          fontFamily: 'Pretendard',
          fontWeight: '400',
          color: readOnly ? '#BBBBBB' : '#1F1F1F',
          resize: 'none',
          overflow: 'hidden',
          outline: 'none',
          boxSizing: 'border-box',
          lineHeight: '1.6'
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem'
      }}
    >
      {icon && (
        <img
          src={icon}
          alt=""
          style={{
            width: '1.375rem',
            height: '1.375rem',
            marginTop: '0.125rem'
          }}
        />
      )}
      <div style={{ flex: 1 }}>
        {label && (
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}
          >
            {label}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          style={{
            width: '100%',
            minHeight,
            padding: '0.75rem',
            background: readOnly ? '#F5F5F5' : 'white',
            borderRadius: '0.5625rem',
            border: '1px solid #D9D9D9',
            fontSize: '0.875rem',
            fontFamily: 'Pretendard',
            fontWeight: '400',
            color: readOnly ? '#BBBBBB' : '#1F1F1F',
            resize: 'none',
            overflow: 'hidden',
            outline: 'none',
            boxSizing: 'border-box',
            lineHeight: '1.6'
          }}
        />
      </div>
    </div>
  );
}

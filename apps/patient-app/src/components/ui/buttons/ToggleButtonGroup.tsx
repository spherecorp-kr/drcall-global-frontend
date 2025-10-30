import React from 'react';

interface ToggleButtonGroupProps<T extends string> {
  label: string;
  options: readonly T[];
  selectedValue: T | undefined;
  onChange: (value: T) => void;
}

/**
 * 토글 버튼 그룹 컴포넌트
 * - 혈액형, 음주, 흡연 여부 등에 사용
 * - 선택된 버튼은 Primary 색상으로 표시
 */
export default function ToggleButtonGroup<T extends string>({
  label,
  options,
  selectedValue,
  onChange
}: ToggleButtonGroupProps<T>) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem'
      }}
    >
      <div
        style={{
          color: '#8A8A8A',
          fontSize: '0.875rem',
          fontWeight: '400'
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: '0.25rem',
          background: 'white',
          borderRadius: '0.5625rem',
          border: '1px solid #D9D9D9',
          display: 'flex',
          alignItems: 'center',
          gap: 0
        }}
      >
        {options.map((option, index) => (
          <React.Fragment key={option}>
            <button
              onClick={() => onChange(option)}
              style={{
                flex: 1,
                padding: '0.4375rem 0.625rem',
                borderRadius: '0.4375rem',
                border: 'none',
                background:
                  selectedValue === option ? '#00A0D2' : 'transparent',
                color: selectedValue === option ? 'white' : '#1F1F1F',
                fontSize: '1rem',
                fontWeight: '400',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {option}
            </button>
            {index < options.length - 1 && (
              <img
                src="/assets/icons/divider-vertical.svg"
                alt="divider"
                style={{ width: '1px', height: '1.125rem' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

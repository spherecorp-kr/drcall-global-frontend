interface RadioButtonProps {
  label: string;
  value: string;
  selected: boolean;
  onChange: (value: string) => void;
}

/**
 * |$ „¼ ôì¸
 * - Ð „¼ + |¨
 * -  Ý Ü €É 0½ + pÉ 
 * - ServiceRegistration 1Ä  Ý ñÐ ¬©
 *
 * @example
 * <RadioButton
 *   label="¨"
 *   value="male"
 *   selected={gender === 'male'}
 *   onChange={setGender}
 * />
 */
export default function RadioButton({ label, value, selected, onChange }: RadioButtonProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        cursor: 'pointer'
      }}
    >
      <div
        onClick={() => onChange(value)}
        style={{
          width: '1.5rem',
          height: '1.5rem',
          borderRadius: '50%',
          border: '1px solid #D9D9D9',
          background: selected ? '#00A0D2' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {selected && (
          <div
            style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              background: 'white'
            }}
          />
        )}
      </div>
      <span
        style={{
          fontSize: '1rem',
          fontWeight: '400',
          color: '#41444B'
        }}
      >
        {label}
      </span>
    </label>
  );
}

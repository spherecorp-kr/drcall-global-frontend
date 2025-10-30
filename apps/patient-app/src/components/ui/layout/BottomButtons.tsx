interface BottomButtonsProps {
  leftButton?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  };
  rightButton?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export default function BottomButtons({ leftButton, rightButton }: BottomButtonsProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '70px',
      display: 'flex'
    }}>
      {leftButton && (
        <button
          onClick={leftButton.onClick}
          disabled={leftButton.disabled}
          style={{
            width: rightButton ? '50%' : '100%',
            height: '70px',
            background: leftButton.disabled ? '#F0F0F0' : '#BBBBBB',
            border: 'none',
            cursor: leftButton.disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            {leftButton.text}
          </div>
        </button>
      )}
      {rightButton && (
        <button
          onClick={rightButton.onClick}
          disabled={rightButton.disabled}
          style={{
            width: leftButton ? '50%' : '100%',
            height: '70px',
            background: rightButton.disabled ? '#D0D0D0' : '#00A0D2',
            border: 'none',
            cursor: rightButton.disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            {rightButton.text}
          </div>
        </button>
      )}
    </div>
  );
}

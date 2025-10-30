interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  valueColor?: string;
}

export default function InfoRow({ icon, label, value, valueColor = '#41444B' }: InfoRowProps) {
  return (
    <div
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 10,
        display: 'flex'
      }}
    >
      <div
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 8,
          display: 'inline-flex'
        }}
      >
        {icon}
        <div
          style={{
            color: '#1F1F1F',
            fontSize: 18,
            fontFamily: 'Pretendard',
            fontWeight: '600'
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          color: valueColor,
          fontSize: 16,
          fontFamily: 'Pretendard',
          fontWeight: '400',
          whiteSpace: 'pre-line'
        }}
      >
        {value}
      </div>
    </div>
  );
}

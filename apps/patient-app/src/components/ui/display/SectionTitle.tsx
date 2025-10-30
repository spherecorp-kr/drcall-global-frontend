interface SectionTitleProps {
  children: string;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div
      style={{
        color: '#1F1F1F',
        fontSize: 18,
        fontFamily: 'Pretendard',
        fontWeight: '600'
      }}
    >
      {children}
    </div>
  );
}

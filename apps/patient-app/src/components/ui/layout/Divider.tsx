interface DividerProps {
  height?: string;
  color?: string;
}

/**
 * 구분선 컴포넌트
 * - 섹션 간 구분선
 * - 기본: 0.625rem (10px) 높이, #FAFAFA 색상
 */
export default function Divider({
  height = '0.625rem',
  color = '#FAFAFA'
}: DividerProps) {
  return (
    <div
      style={{
        width: '100%',
        height,
        background: color,
      }}
    />
  );
}

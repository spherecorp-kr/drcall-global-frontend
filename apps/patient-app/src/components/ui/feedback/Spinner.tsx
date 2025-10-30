interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function Spinner({ size = 'md', color = '#00A0D2' }: SpinnerProps) {
  const sizeMap = {
    sm: '1.5rem',
    md: '2.5rem',
    lg: '4rem',
  };

  const spinnerSize = sizeMap[size];

  return (
    <div style={{ display: 'inline-block', width: spinnerSize, height: spinnerSize }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 50 50"
        style={{
          animation: 'spin 0.8s linear infinite',
        }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="90, 150"
          strokeDashoffset="0"
          style={{
            animation: 'dash 1.5s ease-in-out infinite',
          }}
        />
      </svg>
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
      `}</style>
    </div>
  );
}

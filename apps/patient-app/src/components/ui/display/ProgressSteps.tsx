interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
  paddingX?: string; // 컨테이너 좌우 여백
  paddingY?: string; // 컨테이너 상하 여백
}

export default function ProgressSteps({
  currentStep,
  totalSteps,
  labels,
  paddingX = '1.25rem',
  paddingY = '0.625rem'
}: ProgressStepsProps) {
  const renderStepIndicator = (index: number) => {
    const isCompleted = index < currentStep - 1;
    const isCurrent = index === currentStep - 1;

    if (isCompleted) {
      // Completed step - check icon
      return (
        <img
          src="/assets/icons/progress-check.svg"
          alt="completed"
          style={{ width: '1.125rem', height: '1.125rem' }}
        />
      );
    } else if (isCurrent) {
      // Current step - ing icon
      return (
        <img
          src="/assets/icons/progress-current.svg"
          alt="current"
          style={{ width: '1.125rem', height: '1.125rem' }}
        />
      );
    } else {
      // Upcoming step - pending icon
      return (
        <img
          src="/assets/icons/progress-pending.svg"
          alt="pending"
          style={{ width: '1.125rem', height: '1.125rem' }}
        />
      );
    }
  };

  const renderLine = (index: number) => {
    const isCompleted = index < currentStep - 1;

    return (
      <div
        style={{
          flex: '1 1 0',
          height: '2px',
          background: isCompleted ? '#00A0D2' : 'transparent',
          borderTop: isCompleted ? 'none' : '2px dashed #D9D9D9'
        }}
      />
    );
  };

  return (
    <div style={{
      width: '100%',
      paddingLeft: paddingX,
      paddingRight: paddingX,
      paddingTop: paddingY,
      paddingBottom: paddingY,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      {/* Steps indicator */}
      <div style={{
        width: '100%',
        height: '1.125rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} style={{ display: 'contents' }}>
            {/* Step indicator */}
            {renderStepIndicator(index)}

            {/* Line connector */}
            {index < totalSteps - 1 && renderLine(index)}
          </div>
        ))}
      </div>

      {/* Labels */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '0.25rem'
      }}>
        {labels.map((label, index) => (
          <div
            key={`label-${index}`}
            style={{
              flex: index === 0 || index === labels.length - 1 ? '0 0 3.5rem' : '1 1 0',
              maxWidth: index === 0 || index === labels.length - 1 ? '3.5rem' : '5.625rem',
              textAlign: index === 0 ? 'left' : index === labels.length - 1 ? 'right' : 'center',
              color: index === currentStep - 1 ? '#00A0D2' : '#1F1F1F',
              fontSize: '0.8125rem',
              fontWeight: '600',
              textTransform: 'capitalize',
              lineHeight: '1.2',
              wordBreak: 'keep-all',
              whiteSpace: 'normal'
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface AiSummarySectionProps {
  aiSummary: string;
}

export default function AiSummarySection({
  aiSummary
}: AiSummarySectionProps) {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, 80)}px`;
    }
  }, [aiSummary]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img
          src="/assets/icons/ic_ai comment.svg"
          alt=""
          style={{ width: '1.375rem', height: '1.375rem' }}
        />
        <div style={{ color: '#1F1F1F', fontSize: '1.125rem', fontWeight: '600' }}>
          {t('appointment.aiSummary')}
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={aiSummary}
        readOnly
        style={{
          minHeight: '5rem',
          background: '#FAFAFA',
          borderRadius: '0.5rem',
          border: '1px solid #E0E0E0',
          padding: '0.5rem 1rem 0.875rem 1rem',
          fontSize: '0.875rem',
          fontFamily: 'Pretendard',
          fontWeight: '400',
          color: '#1F1F1F',
          resize: 'none',
          overflow: 'hidden',
          outline: 'none',
          boxSizing: 'border-box',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }}
      />
    </div>
  );
}

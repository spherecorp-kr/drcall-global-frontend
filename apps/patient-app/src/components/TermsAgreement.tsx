import { useTranslation } from 'react-i18next';

interface TermItem {
  checked: boolean;
  onChange: () => void;
  required: boolean;
  text: string;
  onDetail?: () => void;
}

interface TermsAgreementProps {
  allAgreed: boolean;
  onAllAgreeChange: () => void;
  terms: TermItem[];
  showError?: boolean;
  errorMessage?: string;
}

export default function TermsAgreement({
  allAgreed,
  onAllAgreeChange,
  terms,
  showError = false,
  errorMessage = ''
}: TermsAgreementProps) {
  const { t } = useTranslation();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      <div style={{
        color: '#1F1F1F',
        fontSize: '1.125rem',
        fontWeight: '600'
      }}>
        {t('appointment.termsAgreement')}
      </div>

      {/* All Agree */}
      <div>
        <div
          onClick={onAllAgreeChange}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            cursor: 'pointer'
          }}
        >
          <img
            src={allAgreed ? '/assets/icons/checkbox-checked.svg' : '/assets/icons/checkbox-unchecked.svg'}
            alt="checkbox"
            style={{ width: '1.5rem', height: '1.5rem' }}
          />
          <div style={{
            color: '#1F1F1F',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            {t('appointment.allAgree')}
          </div>
        </div>
        {showError && errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginTop: '0.625rem'
          }}>
            <div style={{
              width: '1.125rem',
              height: '1.125rem',
              borderRadius: '50%',
              border: '1.5px solid #FC0606',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#FC0606',
                lineHeight: '1'
              }}>!</span>
            </div>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '400',
              color: '#FC0606'
            }}>
              {errorMessage}
            </span>
          </div>
        )}
      </div>

      {/* Individual Terms */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {terms.map((term, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem'
            }}
          >
            <img
              onClick={term.onChange}
              src={term.checked ? '/assets/icons/checkbox-list-checked.svg' : '/assets/icons/checkbox-list-unchecked.svg'}
              alt="checkbox"
              style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
            />
            <div style={{ flex: 1 }}>
              {term.required && (
                <span style={{
                  color: '#00A0D2',
                  fontSize: '1rem',
                  fontWeight: '400'
                }}>[{t('common.required')}] </span>
              )}
              {!term.required && (
                <span style={{
                  color: '#8A8A8A',
                  fontSize: '1rem',
                  fontWeight: '400'
                }}>[{t('common.optional')}] </span>
              )}
              <span style={{
                color: '#8A8A8A',
                fontSize: '1rem',
                fontWeight: '400'
              }}>{term.text}</span>
            </div>
            {term.onDetail && (
              <img
                onClick={term.onDetail}
                src="/assets/icons/chevron-right.svg"
                alt="more"
                style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

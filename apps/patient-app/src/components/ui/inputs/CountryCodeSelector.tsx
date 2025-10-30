import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COUNTRIES, type Country } from '@utils/countryCode';

interface CountryCodeSelectorProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
  disabled?: boolean;
}

/**
 * Country Code Selector Component
 *
 * 국가 코드 선택 컴포넌트
 * - 현재 선택된 국가를 표시
 * - 클릭 시 모달로 국가 목록 표시
 * - 검색 기능 포함
 */
export default function CountryCodeSelector({
  selectedCountry,
  onSelect,
  disabled = false,
}: CountryCodeSelectorProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = COUNTRIES.filter((country) => {
    const query = searchQuery.toLowerCase();
    return (
      country.name.toLowerCase().includes(query) ||
      country.nameLocal.toLowerCase().includes(query) ||
      country.dialCode.includes(query)
    );
  });

  const handleSelect = (country: Country) => {
    onSelect(country);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Selected Country Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: 0,
          background: 'transparent',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: '400',
          color: disabled ? '#bbbbbb' : '#41444b',
          transition: 'all 0.2s',
          minWidth: '6rem',
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>{selectedCountry.flag}</span>
        <span>{selectedCountry.dialCode}</span>
        {!disabled && (
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#8A8A8A' }}>▼</span>
        )}
      </button>

      {/* Country Selection Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: 'white',
              width: '100%',
              maxWidth: '640px',
              borderRadius: '1.25rem 1.25rem 0 0',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid #E0E0E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1F1F1F',
                  margin: 0,
                }}
              >
                {t('auth.selectCountry')}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#8A8A8A',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Search Input */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E0E0E0' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #E0E0E0',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Country List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0.5rem 0',
              }}
            >
              {filteredCountries.length === 0 ? (
                <div
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#8A8A8A',
                    fontSize: '0.875rem',
                  }}
                >
                  {t('common.noSearchResults')}
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleSelect(country)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      width: '100%',
                      padding: '1rem 1.5rem',
                      background:
                        selectedCountry.code === country.code ? '#F0F9FF' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCountry.code !== country.code) {
                        e.currentTarget.style.background = '#F5F5F5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCountry.code !== country.code) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.75rem' }}>{country.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: '500',
                          color: '#1F1F1F',
                          marginBottom: '0.125rem',
                        }}
                      >
                        {i18n.language === 'en' ? country.name : country.nameLocal}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#8A8A8A' }}>
                        {country.name !== country.nameLocal && `${country.name} • `}
                        {country.dialCode}
                      </div>
                    </div>
                    {selectedCountry.code === country.code && (
                      <span style={{ color: '#00A0D2', fontSize: '1.25rem' }}>✓</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState } from 'react';
import BottomSheetModal from '@ui/modals/BottomSheetModal';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (language: string) => void;
  currentLanguage: string;
}

type Language = {
  code: string;
  name: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
  { code: 'th', name: 'ภาษาไทย' }
];

export default function LanguageSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  currentLanguage
}: LanguageSelectionModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleConfirm = () => {
    onConfirm(selectedLanguage);
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="자막 언어"
      confirmText="확인"
      onConfirm={handleConfirm}
    >
      <div style={{ width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
        {languages.map((language) => (
          <div
            key={language.code}
            onClick={() => setSelectedLanguage(language.code)}
            style={{
              padding: '16px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: '400',
                color: '#1F1F1F'
              }}
            >
              {language.name}
            </span>
            {selectedLanguage === language.code && (
              <img
                src="/assets/icons/ic_check_v.svg"
                alt="selected"
                style={{
                  width: 24,
                  height: 24
                }}
              />
            )}
          </div>
        ))}
      </div>
    </BottomSheetModal>
  );
}

import { useState, useEffect } from 'react';
import InputField from '@ui/inputs/InputField';
import Button from '@ui/buttons/Button';
import { useTranslation } from 'react-i18next';

type VerificationStep = 'phone' | 'code';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (phoneNumber: string) => void;
  initialPhone?: string;
}

export default function PhoneVerificationModal({
  isOpen,
  onClose,
  onVerified,
  initialPhone = '',
}: PhoneVerificationModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<VerificationStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step === 'code' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setStep('phone');
      setPhoneNumber(initialPhone);
      setVerificationCode('');
      setTimeLeft(180);
      setError('');
    }
  }, [isOpen, initialPhone]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length < 10) {
      setError(t('auth.verifyPhoneNumber'));
      return;
    }
    setError('');
    // TODO: API call to send verification code
    setStep('code');
    setTimeLeft(180);
  };

  const handleCodeSubmit = async () => {
    if (verificationCode.length !== 4) {
      setError(t('auth.verifyCodeCheck'));
      return;
    }
    setError('');
    // TODO: API call to verify code
    // For now, accept any 4-digit code
    onVerified(phoneNumber);
    onClose();
  };

  const handleResendCode = () => {
    setTimeLeft(180);
    setVerificationCode('');
    setError('');
    // TODO: API call to resend code
  };

  const isPhoneValid = phoneNumber.length >= 10;
  const isCodeValid = verificationCode.length === 4;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'white',
          borderTopLeftRadius: '1.25rem',
          borderTopRightRadius: '1.25rem',
          paddingBottom: 'env(safe-area-inset-bottom)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            position: 'relative',
            borderBottom: '1px solid #F0F0F0',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f1f1f', margin: 0 }}>
            {t('mypage.phoneChange')}
          </h3>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '1.25rem',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <img src='/assets/icons/btn_close_pupup.svg' alt='close_popup' width={24} height={24}/>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem' }}>
          {/* Instructions */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f1f1f',
                lineHeight: '1.4',
                marginBottom: '0.5rem',
              }}
            >
              {step === 'phone'
                ? t('auth.enterPhoneToChange')
                : t('auth.enterVerificationCode')}
            </h2>
            <p style={{ fontSize: '0.875rem', fontWeight: '400', color: '#8A8A8A', lineHeight: '1.6' }}>
              {step === 'phone'
                ? t('mypage.verificationCodeSentToSMS')
                : t('auth.verificationCodeSent')}
            </p>
          </div>

          {/* Phone Number Input */}
          <div style={{ marginBottom: step === 'code' ? '1.25rem' : '0' }}>
            <InputField
              label={t('auth.phoneNumber')}
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t('delivery.phoneNumberPlaceholder')}
              disabled={step === 'code'}
            />
          </div>

          {/* Verification Code Input */}
          {step === 'code' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <InputField
                label={t('auth.verificationCode')}
                type="text"
                maxLength={4}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder={t('mypage.verificationCode4Digits')}
                error={error}
                rightElement={
                  <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#00A0D2', lineHeight: '1.3' }}>
                    {formatTime(timeLeft)}
                  </span>
                }
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '0.75rem',
                }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#8a8a8a' }}>
                  {t('auth.didntReceiveCode')}
                </span>
                <button
                  onClick={handleResendCode}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#444444',
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {t('auth.resend')}
                </button>
              </div>
            </div>
          )}

          {/* Button */}
          <div style={{ marginTop: '2rem' }}>
            {step === 'phone' ? (
              <Button onClick={handlePhoneSubmit} disabled={!isPhoneValid}>
                {t('auth.sendCode')}
              </Button>
            ) : (
              <Button onClick={handleCodeSubmit} disabled={!isCodeValid}>
                {t('common.confirm')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

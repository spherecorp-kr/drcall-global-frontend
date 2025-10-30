import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import BottomButtonLayout from '@layouts/BottomButtonLayout';
import InputField from '@ui/inputs/InputField';
import Button from '@ui/buttons/Button';
import CountryCodeSelector from '@ui/inputs/CountryCodeSelector';
import { authService } from '@services/authService';
import { getDefaultCountryByLocale, type Country } from '@utils/countryCode';
import { useErrorHandler } from '@hooks/useErrorHandler';
import { validatePhone } from '@utils/validation';

type VerificationStep = 'phone' | 'code' | 'verified';

export default function PhoneVerification() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { handleError, handleValidationError } = useErrorHandler();
  const [step, setStep] = useState<VerificationStep>('phone');
  const [selectedCountry, setSelectedCountry] = useState<Country>(() =>
    getDefaultCountryByLocale(i18n.language)
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 타이머 관리
  useEffect(() => {
    if (step === 'code' && timeLeft > 0 && !isVerified) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft, isVerified]);

  // 언어 변경 시 국가 코드 자동 업데이트
  useEffect(() => {
    const newCountry = getDefaultCountryByLocale(i18n.language);
    setSelectedCountry(newCountry);
  }, [i18n.language]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePhoneSubmit = async () => {
    if (!validatePhone(phoneNumber)) {
      const errorMsg = t('error.invalidPhone');
      setError(errorMsg);
      handleValidationError(errorMsg);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.sendOtp({
        phone: phoneNumber,
        phoneCountryCode: selectedCountry.dialCode,
        verificationType: 'REGISTRATION',
      });

      setStep('code');
      setTimeLeft(180);
    } catch (err) {
      const errorMsg = handleError(err, { feature: 'auth', action: 'sendOtp' });
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (verificationCode.length !== 4) {
      const errorMsg = t('auth.verificationFailed');
      setError(errorMsg);
      handleValidationError(errorMsg);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.verifyOtp({
        phone: phoneNumber,
        phoneCountryCode: selectedCountry.dialCode,
        otpCode: verificationCode,
      });

      setIsVerified(true);

      // 기존 환자면 로그인 완료, 신규면 프로필 등록 페이지로 이동
      if (result.existingPatient) {
        // 기존 환자 - 로그인 완료
        navigate('/appointments');
      } else {
        // 신규 환자 - 프로필 등록 필요
        navigate('/auth/service-registration');
      }
    } catch (err) {
      const errorMsg = handleError(err, { feature: 'auth', action: 'verifyOtp' });
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      await authService.sendOtp({
        phone: phoneNumber,
        phoneCountryCode: selectedCountry.dialCode,
        verificationType: 'REGISTRATION',
      });

      setTimeLeft(180);
      setVerificationCode('');
    } catch (err) {
      const errorMsg = handleError(err, { feature: 'auth', action: 'resendOtp' });
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const isPhoneValid = validatePhone(phoneNumber);
  const isCodeValid = verificationCode.length === 4;

  return (
    <MainLayout
      title={t('auth.phoneVerification')}
      onClose={handleClose}
      fullWidth
      contentClassName=""
    >
      <div style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingTop: '1.25rem' }}>
        {/* Instructions */}
        <section style={{ marginBottom: '5.3125rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f1f1f', lineHeight: '1.4', marginBottom: '0.75rem' }}>
            {t('auth.enterPhone')}
          </h2>
          <p style={{ fontSize: '1rem', fontWeight: '400', color: '#6e6e6e', lineHeight: '1.6' }}>
            {t('auth.sendCode')}
          </p>
        </section>

        {/* Phone Number Input with Country Code Selector */}
        <div style={{ marginBottom: (step === 'code' || isVerified) ? '2.5rem' : '0' }}>
          <div className="flex flex-col gap-[10px] w-full">
            {/* Label */}
            <label className="text-[14px] text-[#8a8a8a] font-normal leading-normal">
              {t('auth.phoneNumber')}
            </label>

            {/* Country Code + Phone Number Row */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {/* Country Code Selector */}
              <CountryCodeSelector
                selectedCountry={selectedCountry}
                onSelect={setSelectedCountry}
                disabled={step === 'code' || isVerified}
              />

              {/* Vertical Divider */}
              <div style={{ width: '1px', height: '1.5rem', background: '#d9d9d9' }} />

              {/* Phone Number Input */}
              <div className="relative flex items-center flex-1">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('auth.enterPhone')}
                  disabled={step === 'code' || isVerified}
                  className={`flex-1 text-[16px] font-normal leading-normal outline-none bg-transparent border-none p-0 ${
                    step === 'code' || isVerified
                      ? 'text-[#d0d0d0]'
                      : phoneNumber
                      ? 'text-[#41444b]'
                      : 'text-[#bbbbbb]'
                  } placeholder:text-[#bbbbbb] ${step === 'code' || isVerified ? 'cursor-not-allowed' : ''}`}
                />
                {isVerified && (
                  <div className="ml-2 flex-shrink-0">
                    <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#00A0D2' }}>
                      {t('auth.verificationSuccess')}
                    </span>
                  </div>
                )}
              </div>

              {/* Change Button - Only show when in code step (not verified yet) */}
              {step === 'code' && !isVerified && (
                <button
                  onClick={() => {
                    setStep('phone');
                    setVerificationCode('');
                    setTimeLeft(180);
                    setError('');
                  }}
                  style={{
                    padding: '0.625rem 0.9375rem',
                    background: 'white',
                    borderRadius: '0.25rem',
                    outline: '1px solid #E0E0E0',
                    outlineOffset: '-1px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ color: '#1F1F1F', fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '600' }}>
                    {t('common.edit')}
                  </div>
                </button>
              )}
            </div>

            {/* Bottom line */}
            <div className="h-[1px] w-full bg-[#d9d9d9]" />
          </div>
        </div>

        {/* Verification Code Input */}
        {(step === 'code' || isVerified) && (
          <div>
            <InputField
              label={t('auth.verificationCode')}
              type="text"
              maxLength={4}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              placeholder={t('auth.enterCode')}
              error={error}
              rightElement={
                !isVerified ? (
                  <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#00A0D2', lineHeight: '1.3' }}>
                    {formatTime(timeLeft)}
                  </span>
                ) : null
              }
            />

            {!isVerified && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#8a8a8a' }}>
                  {t('auth.didntReceiveCode')}
                </span>
                <button
                  onClick={handleResendCode}
                  style={{ fontSize: '0.875rem', fontWeight: '500', color: '#444444', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {t('auth.resend')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <BottomButtonLayout fullWidth contentClassName="">
        {step === 'phone' ? (
          <Button onClick={handlePhoneSubmit} disabled={!isPhoneValid || isLoading}>
            {isLoading ? t('common.loading') : t('common.next')}
          </Button>
        ) : (
          <Button onClick={handleCodeSubmit} disabled={!isCodeValid || isVerified || isLoading}>
            {isLoading ? t('common.loading') : t('common.confirm')}
          </Button>
        )}
      </BottomButtonLayout>
    </MainLayout>
  );
}

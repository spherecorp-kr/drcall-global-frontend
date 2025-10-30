import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import InputField from '@ui/inputs/InputField';
import RadioButton from '@ui/buttons/RadioButton';
import DatePickerModal from '@ui/modals/DatePickerModal';
import AddressSearchModal from '@components/address/modals/AddressSearchModal';
import TermsAgreement from '@components/TermsAgreement';
import Notice from '@ui/display/Notice';
import { authService } from '@services/authService';
import { getChannelUserId } from '@utils/channelUtils';

type Gender = 'male' | 'female' | null;

export default function ServiceRegistration() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [thaiId, setThaiId] = useState('');
  const [gender, setGender] = useState<Gender>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // UI state
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreements, setAgreements] = useState({
    linePrivacy: false,
    serviceTerms: false,
    personalInfo: false,
    marketing: false,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    birthdate: '',
    thaiId: '',
    gender: '',
    phone: '',
    address: '',
    agreements: ''
  });
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 상세주소 자동 포커스 제어
  const detailInputRef = useRef<HTMLInputElement>(null);
  const [shouldFocusDetail, setShouldFocusDetail] = useState(false);

  useEffect(() => {
    if (!showAddressSearch && shouldFocusDetail) {
      requestAnimationFrame(() => detailInputRef.current?.focus());
      setShouldFocusDetail(false);
    }
  }, [showAddressSearch, shouldFocusDetail]);

  // Initialize phone from PhoneVerification
  useEffect(() => {
    // Get phone from localStorage or profile
    const tempJwt = localStorage.getItem('tempJwt');
    if (tempJwt) {
      // Try to get profile to pre-fill phone
      authService.getProfile().then((profile) => {
        if (profile.phone) {
          setPhone(profile.phone);
        }
      }).catch(() => {
        // Ignore error - user can input phone manually
      });
    }
  }, []);

  const handleClose = () => {
    navigate(-1);
  };

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreements({
      linePrivacy: newValue,
      serviceTerms: newValue,
      personalInfo: newValue,
      marketing: newValue,
    });
  };

  const handleAgreementChange = (key: keyof typeof agreements) => {
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    };
    setAgreements(newAgreements);

    // Check if all required agreements are checked
    const allRequired = newAgreements.linePrivacy && newAgreements.serviceTerms && newAgreements.personalInfo;
    setAgreeAll(allRequired && newAgreements.marketing);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const validateForm = () => {
    const newErrors = {
      name: name ? '' : t('auth.enterName'),
      email: '', // Email is optional
      birthdate: birthdate ? '' : t('auth.selectBirthdate'),
      thaiId: thaiId ? '' : t('auth.enterThaiId'),
      gender: gender ? '' : t('validation.selectRequired'),
      phone: phone ? '' : t('error.invalidPhone'),
      address: address ? '' : t('auth.searchAddress'),
      agreements: (agreements.linePrivacy && agreements.serviceTerms && agreements.personalInfo)
        ? ''
        : t('validation.agreeToTerms')
    };
    setErrors(newErrors);
    setShowErrors(true);

    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. Get channelUserId based on current platform
      const channelInfo = await getChannelUserId();

      console.log('[Registration] Channel detected:', channelInfo);

      // 2. Convert birthdate from DD/MM/YYYY to YYYY-MM-DD
      let dateOfBirth = '';
      if (birthdate) {
        const parts = birthdate.split('/');
        if (parts.length === 3) {
          dateOfBirth = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
        }
      }

      // 3. Call completeProfile API
      const response = await authService.completeProfile({
        channelUserId: channelInfo.channelUserId,
        name: name.trim(),
        email: email || `${phone}@patient.drcall.global`, // Use temp email if not provided
        dateOfBirth,
        gender: gender === 'male' ? 'MALE' : 'FEMALE',
        idCardNumber: thaiId,
        emergencyContactName: emergencyContactName || '',
        emergencyContactPhone: emergencyContactPhone || '',
        address: `${address}${detailAddress ? ' ' + detailAddress : ''}`.trim(),
        marketingConsent: agreements.marketing,
        dataSharingConsent: agreements.personalInfo,
      });

      console.log('[Registration] Success:', response);

      // 5. Navigate to appointments page
      navigate('/appointments');

    } catch (error: any) {
      console.error('[Registration] Failed:', error);

      let errorMessage = t('error.networkError');

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name && birthdate && thaiId && gender && phone && address &&
    agreements.linePrivacy && agreements.serviceTerms && agreements.personalInfo;

  return (
    <MainLayout
      title={t('auth.serviceRegistration')}
      onClose={handleClose}
      fullWidth
      contentClassName=""
    >
      <div style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingTop: '1.25rem', paddingBottom: '6rem' }}>
        {/* Dr.Call Logo Section */}
        <div style={{
          background: 'white',
          padding: '1.875rem 0',
          marginLeft: '-1.25rem',
          marginRight: '-1.25rem',
          marginTop: '-1.25rem',
          marginBottom: '2.5rem',
          paddingLeft: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: '50%',
              border: '1.5px solid #D9D9D9',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white'
            }}>
              <img
                src="/img_drcall-logo.png"
                alt="Dr.Call Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00A0D2', marginBottom: '0.25rem' }}>
                Dr.Call
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: '400', color: '#8A8A8A' }}>
                Sphere Corp.
              </div>
            </div>
          </div>
        </div>

        {/* Form Title */}
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f1f1f', marginBottom: '2.5rem' }}>
          {t('auth.serviceRegistration')}
        </h2>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Name */}
          <InputField
            label={
              <>
                {t('auth.name')} <span style={{ color: '#FC0606' }}>*</span>
              </>
            }
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (showErrors) {
                setErrors(prev => ({ ...prev, name: e.target.value ? '' : t('auth.enterName') }));
              }
            }}
            placeholder=""
            error={showErrors ? errors.name : ''}
          />

          {/* Birthdate */}
          <div onClick={() => setShowDatePicker(true)}>
            <InputField
              label={
                <>
                  {t('auth.birthdate')}(DD/MM/YYYY) <span style={{ color: '#FC0606' }}>*</span>
                </>
              }
              type="text"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              placeholder=""
              readOnly
              rightElement={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#00A0D2" strokeWidth="2"/>
                  <path d="M16 2V6M8 2V6M3 10H21" stroke="#00A0D2" strokeWidth="2"/>
                </svg>
              }
            />
          </div>

          {/* Thai ID */}
          <InputField
            label={
              <>
                {t('auth.thaiId')} <span style={{ color: '#FC0606' }}>*</span>
              </>
            }
            type="text"
            value={thaiId}
            onChange={(e) => setThaiId(e.target.value)}
            placeholder=""
          />

          {/* Gender */}
          <div>
            <div style={{ marginBottom: '0.625rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: '400', color: '#41444B' }}>{t('auth.gender')} </span>
              <span style={{ fontSize: '1rem', fontWeight: '400', color: '#FC0606' }}>*</span>
            </div>
            <div style={{ display: 'flex', gap: '2.5rem' }}>
              <RadioButton
                label={t('auth.male')}
                value="male"
                selected={gender === 'male'}
                onChange={(value) => setGender(value as Gender)}
              />
              <RadioButton
                label={t('auth.female')}
                value="female"
                selected={gender === 'female'}
                onChange={(value) => setGender(value as Gender)}
              />
            </div>
          </div>

          {/* Phone */}
          <InputField
            label={
              <>
                {t('auth.phoneNumber')} <span style={{ color: '#FC0606' }}>*</span>
              </>
            }
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder=""
            readOnly
            disabled
          />

          {/* Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '400' }}>
              <span style={{ color: '#8A8A8A' }}>{t('auth.address')}</span>
              <span style={{ color: '#FC0606' }}> *</span>
            </div>
            <div
              onClick={() => setShowAddressSearch(true)}
              style={{
                padding: '0.75rem',
                background: 'white',
                borderRadius: '0.5625rem',
                border: '1px solid #D9D9D9',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                minHeight: '3.5rem'
              }}
            >
              <div style={{
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: '400',
                color: address ? '#41444B' : '#BBBBBB',
                whiteSpace: 'pre-line'
              }}>
                {address || t('auth.searchAddress')}
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="9" cy="9" r="7" stroke="#00A0D2" strokeWidth="2"/>
                <path d="M15 15L19 19" stroke="#00A0D2" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Detail Address - 주소가 선택된 후에만 표시 */}
            {address && (
              <div
                style={{
                  padding: '0.75rem',
                  background: 'white',
                  borderRadius: '0.5625rem',
                  border: '1px solid #D9D9D9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <input
                  type="text"
                  ref={detailInputRef}
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder={t('auth.enterDetailAddress')}
                  style={{
                    flex: 1,
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    color: '#41444B',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <TermsAgreement
            allAgreed={agreeAll}
            onAllAgreeChange={handleAgreeAll}
            terms={[
              {
                checked: agreements.linePrivacy,
                onChange: () => handleAgreementChange('linePrivacy'),
                required: true,
                text: t('auth.linePrivacy')
              },
              {
                checked: agreements.serviceTerms,
                onChange: () => handleAgreementChange('serviceTerms'),
                required: true,
                text: t('auth.serviceTerms')
              },
              {
                checked: agreements.personalInfo,
                onChange: () => handleAgreementChange('personalInfo'),
                required: true,
                text: t('auth.personalInfo')
              },
              {
                checked: agreements.marketing,
                onChange: () => handleAgreementChange('marketing'),
                required: false,
                text: t('auth.marketing')
              }
            ]}
            showError={showErrors}
            errorMessage={errors.agreements}
          />

          {/* Notice */}
          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
            <Notice
              items={[
                t('auth.registrationNotice1'),
                t('auth.registrationNotice2')
              ]}
            />
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        zIndex: 10
      }}>
        <button
          onClick={handleCancel}
          style={{
            flex: 1,
            height: '4.375rem',
            background: '#BBBBBB',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {t('common.cancel')}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          style={{
            flex: 1,
            height: '4.375rem',
            background: isFormValid && !isLoading ? '#00A0D2' : '#BBBBBB',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '500',
            border: 'none',
            cursor: isFormValid && !isLoading ? 'pointer' : 'not-allowed'
          }}
        >
          {isLoading ? t('common.loading') : t('auth.agree')}
        </button>
      </div>

      {/* Modals */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(date) => {
          setBirthdate(date);
          setShowDatePicker(false);
        }}
        initialDate={birthdate}
        title={t('auth.birthdate')}
      />

      <AddressSearchModal
        isOpen={showAddressSearch}
        onClose={() => setShowAddressSearch(false)}
        onSelect={({ displayAddress, postalCode }) => {
          const combined = (postalCode ? postalCode + '\n' : '') + displayAddress;
          setAddress(combined);
          setShowAddressSearch(false);
          setShouldFocusDetail(true);
        }}
        onDetailAddressReset={() => setDetailAddress('')}
      />
    </MainLayout>
  );
}


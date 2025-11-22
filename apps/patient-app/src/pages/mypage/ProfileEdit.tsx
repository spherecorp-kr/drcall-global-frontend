import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import BottomButtonLayout from '@layouts/BottomButtonLayout';
import InputField from '@ui/inputs/InputField';
import RadioButton from '@ui/buttons/RadioButton';
import DatePickerModal from '@ui/modals/DatePickerModal';
import AddressSearchModal from '@components/address/modals/AddressSearchModal';
import PhoneVerificationModal from '@ui/modals/PhoneVerificationModal';
import ConfirmModal from '@ui/modals/ConfirmModal';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import PageTitle from '@ui/layout/PageTitle';
import Divider from '@ui/layout/Divider';
import PatientDetailInfoSection from '@appointment/shared/sections/PatientDetailInfoSection';
import type { PatientDetailInfo } from '@/types/appointment';
import Button from '@ui/buttons/Button';
import { useToast } from '@hooks/useToast';

type Gender = 'male' | 'female' | null;

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast, ToastComponent } = useToast();

  // 환자 정보
  const [name, setName] = useState('홍길동');
  const [birthdate, setBirthdate] = useState('06/07/1997');
  const [thaiId, setThaiId] = useState('123456578963');
  const [gender, setGender] = useState<Gender>('male');
  const [phone, setPhone] = useState('123456578963');
  const [address, setAddress] = useState('13242\n서울 서초구 양재대로 **길 **');
  const [detailAddress, setDetailAddress] = useState('3125동 324호');

  // 건강 정보
  const [detailInfo, setDetailInfo] = useState<PatientDetailInfo>({
    height: '160',
    weight: '59',
    bloodType: 'A',
    alcohol: '0',
    smoking: '0',
    medications: '탈모 약을 3개월 째 복용 중입니다.',
    personalHistory: '14살에 심장 수술을 받은 적이 있습니다.\n17살에는 맹장수술을 받았습니다.\n22살에는 다리가 부러져서 철심을 고정하는 수술을 받았습니다.',
    familyHistory: '집안 대대로 심장병이 있습니다.\n가까워서 좋지 않습니다. 유전입니다.'
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // 상세주소 자동 포커스 제어
  const detailInputRef = useRef<HTMLInputElement>(null);
  const [shouldFocusDetail, setShouldFocusDetail] = useState(false);

  useEffect(() => {
    if (!showAddressSearch && shouldFocusDetail) {
      // 모달이 닫힌 다음 프레임에서 상세주소 입력에 포커스
      requestAnimationFrame(() => detailInputRef.current?.focus());
      setShouldFocusDetail(false);
    }
  }, [showAddressSearch, shouldFocusDetail]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleBack = () => {
    navigate('/mypage');
  };

  const handleDetailInfoChange = (field: keyof PatientDetailInfo, value: string) => {
    setDetailInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneVerified = (newPhone: string) => {
    setPhone(newPhone);
    showToast(t('mypage.phoneChanged'), 'success', 'bottom');
  };

  const handleSubmit = () => {
    setShowSubmitConfirm(true);
  };

  const handleSubmitConfirm = () => {
    // TODO: API 호출
    console.log('Submit profile update', {
      name,
      birthdate,
      thaiId,
      gender,
      phone,
      address,
      ...detailInfo
    });

    setShowSubmitConfirm(false);
    navigate('/mypage');
  };

  return (
    <MainLayout
      title={t('mypage.profile')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName="p-0"
    >
      <PageContainer hasBottomButton style={{ background: 'transparent' }}>
        {/* Page Title */}
        <PageSection style={{ padding: '0 1.25rem 0 1.25rem' }}>
          <PageTitle>{t('mypage.profileTitle')}</PageTitle>
        </PageSection>

        {/* 환자 정보 */}
        <PageSection title={t('mypage.patientInfo')} padding gap="lg">
          {/* Name */}
          <InputField
            label={
              <>
                {t('auth.name')} <span style={{ color: '#FC0606' }}>*</span>
              </>
            }
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=""
          />

          {/* Birthdate */}
          <div onClick={() => setShowDatePicker(true)}>
            <InputField
              label={
                <>
                  {t('auth.birthdate')} <span style={{ color: '#FC0606' }}>*</span>
                </>
              }
              type="text"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              placeholder=""
              readOnly
              rightElement={
                <img src="/src/assets/icons/phr/calendar_today.svg" alt="Calendar"  width={24} height={24} />
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
          <div>
            <div style={{ marginBottom: '0.625rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: '400', color: '#41444B' }}>{t('auth.phoneNumber')} </span>
              <span style={{ fontSize: '1rem', fontWeight: '400', color: '#FC0606' }}>*</span>
            </div>
            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
              <div
                style={{
                  flex: 1,
                  padding: '0.625rem 0.9375rem',
                  background: 'white',
                  borderRadius: '0.25rem',
                  outline: '1px solid #E0E0E0',
                  outlineOffset: '-1px',
                }}
              >
                <div style={{ color: '#1F1F1F', fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '400' }}>
                  {phone}
                </div>
              </div>
              <button
                onClick={() => setShowPhoneVerification(true)}
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
                }}
              >
                <div style={{ color: '#1F1F1F', fontSize: '0.875rem', fontFamily: 'Pretendard', fontWeight: '600' }}>
                  {t('common.edit')}
                </div>
              </button>
            </div>
          </div>

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
                {address || t('delivery.addressPlaceholder')}
              </div>
              <img src='/assets/icons/ic_search.svg' alt='search' width={24} height={24}/>
            </div>

            {/* Detail Address */}
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
          </div>
        </PageSection>

        <Divider height="8px" color="#F7F7F7" />

        {/* 건강 정보 */}
        <PageSection title={t('mypage.healthInfo')} padding gap="lg">
          <PatientDetailInfoSection
            data={detailInfo}
            onChange={handleDetailInfoChange}
            readOnly={false}
            expandable={false}
          />
        </PageSection>

      </PageContainer>

      {/* Bottom Button */}
      <BottomButtonLayout fullWidth>
        <Button onClick={handleSubmit}>
          {t('common.confirm')}
        </Button>
      </BottomButtonLayout>

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

      <ConfirmModal
        isOpen={showSubmitConfirm}
        message={t('mypage.confirmEdit')}
        onConfirm={handleSubmitConfirm}
        onCancel={() => setShowSubmitConfirm(false)}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
      />

      <PhoneVerificationModal
        isOpen={showPhoneVerification}
        onClose={() => setShowPhoneVerification(false)}
        onVerified={handlePhoneVerified}
        initialPhone={phone}
      />

      {/* Toast */}
      {ToastComponent}
    </MainLayout>
  );
}

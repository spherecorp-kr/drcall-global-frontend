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
import Notice from '@ui/display/Notice';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import PageTitle from '@ui/layout/PageTitle';
import Divider from '@ui/layout/Divider';
import PatientDetailInfoSection from '@appointment/shared/sections/PatientDetailInfoSection';
import type { PatientDetailInfo } from '@/types/appointment';
import Button from '@ui/buttons/Button';
import { useToast } from '@hooks/useToast';
import { patientService } from '@/services/patientService';
import type { Patient, Gender as PatientGender, BloodType, AlcoholConsumption, SmokingStatus } from '@/types/patient';
import { useAuthStore } from '@store/authStore';
import { format, parse } from 'date-fns';

type Gender = 'male' | 'female' | null;

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast, ToastComponent } = useToast();
  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);

  // 환자 정보
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [thaiId, setThaiId] = useState('');
  const [gender, setGender] = useState<Gender>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // 건강 정보
  const [detailInfo, setDetailInfo] = useState<PatientDetailInfo>({
    height: '',
    weight: '',
    bloodType: '',
    alcohol: '',
    smoking: '',
    medications: '',
    personalHistory: '',
    familyHistory: ''
  });

  // Load patient profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.patientId) {
        showToast(t('error.notLoggedIn'), 'error');
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        const data = await patientService.getProfile(user.patientId);
        setPatient(data);

        // Populate form fields
        setName(data.name || '');
        setPhone(data.phone || '');
        setThaiId(data.idCardNumber || '');

        // Convert gender from backend format (MALE/FEMALE/OTHER) to frontend format (male/female)
        if (data.gender === 'MALE') setGender('male');
        else if (data.gender === 'FEMALE') setGender('female');
        else setGender(null);

        // Convert date from YYYY-MM-DD to dd/MM/yyyy
        if (data.dateOfBirth) {
          const date = parse(data.dateOfBirth, 'yyyy-MM-dd', new Date());
          setBirthdate(format(date, 'dd/MM/yyyy'));
        }

        // Address - combine postalCode + address if both exist
        if (data.postalCode && data.address) {
          setAddress(`${data.postalCode}\n${data.address}`);
        } else if (data.address) {
          setAddress(data.address);
        }
        setDetailAddress(data.addressDetail || '');
        setPostalCode(data.postalCode || '');

        // Health info
        setDetailInfo({
          height: data.height || '',
          weight: data.weight || '',
          bloodType: data.bloodType || '',
          alcohol: data.alcoholConsumption || '',
          smoking: data.smokingStatus || '',
          medications: data.currentMedications || '',
          personalHistory: data.personalMedicalHistory || '',
          familyHistory: data.familyMedicalHistory || ''
        });
      } catch (error) {
        console.error('Failed to load patient profile:', error);
        showToast(t('error.loadFailed'), 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate, t, showToast]);

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

  const handleSubmitConfirm = async () => {
    if (!user?.patientId) {
      showToast(t('error.notLoggedIn'), 'error');
      return;
    }

    try {
      setShowSubmitConfirm(false);

      // Convert date from dd/MM/yyyy to yyyy-MM-dd for backend
      let dateOfBirth: string | undefined;
      if (birthdate) {
        try {
          const date = parse(birthdate, 'dd/MM/yyyy', new Date());
          dateOfBirth = format(date, 'yyyy-MM-dd');
        } catch (error) {
          console.error('Invalid date format:', error);
          showToast(t('error.invalidDate'), 'error');
          return;
        }
      }

      // Convert gender from frontend format to backend format
      let patientGender: PatientGender | undefined;
      if (gender === 'male') patientGender = 'MALE';
      else if (gender === 'female') patientGender = 'FEMALE';

      await patientService.updateProfile(user.patientId, {
        name,
        phone,
        idCardNumber: thaiId,
        gender: patientGender,
        dateOfBirth,
        address: address.split('\n').slice(1).join('\n') || address, // Remove postal code from address
        addressDetail: detailAddress,
        postalCode,
        height: detailInfo.height,
        weight: detailInfo.weight,
        bloodType: detailInfo.bloodType as BloodType,
        alcoholConsumption: detailInfo.alcohol as AlcoholConsumption,
        smokingStatus: detailInfo.smoking as SmokingStatus,
        currentMedications: detailInfo.medications,
        personalMedicalHistory: detailInfo.personalHistory,
        familyMedicalHistory: detailInfo.familyHistory
      });

      showToast(t('mypage.profileUpdated'), 'success');
      navigate('/mypage');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast(t('error.updateFailed'), 'error');
    }
  };

  if (isLoading) {
    return (
      <MainLayout
        title={t('mypage.profile')}
        onBack={handleBack}
        onClose={handleClose}
        fullWidth
        contentClassName="p-0"
      >
        <PageContainer style={{ background: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div>{t('common.loading')}</div>
        </PageContainer>
      </MainLayout>
    );
  }

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
        onSelect={({ displayAddress, postalCode: newPostalCode }) => {
          const combined = (newPostalCode ? newPostalCode + '\n' : '') + displayAddress;
          setAddress(combined);
          setPostalCode(newPostalCode || '');
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

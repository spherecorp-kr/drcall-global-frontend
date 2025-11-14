import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import AddressSearchModal from '@components/address/modals/AddressSearchModal';
import { useErrorHandler } from '@hooks/useErrorHandler';
import { validateRequired, validatePhone } from '@utils/validation';

interface DeliveryAddressAddProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: {
    id?: string;
    title: string;
    recipientName: string;
    address: string;
    detailAddress: string;
    phoneNumber: string;
    isDefault: boolean;
  }) => void;
  editingAddress?: {
    id: string;
    title: string;
    recipientName: string;
    address: string;
    phoneNumber: string;
    isDefault: boolean;
  } | null;
}

/**
 * 배송지 추가/수정 풀모달
 * - 배송지 이름
 * - 받는 사람
 * - 주소 검색
 * - 휴대폰 번호
 * - 기본 배송지로 설정 체크박스
 */
export default function DeliveryAddressAdd({
  isOpen,
  onClose,
  onSave,
  editingAddress
}: DeliveryAddressAddProps) {
  const { t } = useTranslation();
  const { handleValidationError } = useErrorHandler();
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);

  // 상세주소 자동 포커스 제어
  const detailInputRef = useRef<HTMLInputElement>(null);
  const [shouldFocusDetail, setShouldFocusDetail] = useState(false);

  useEffect(() => {
    if (!isAddressSearchOpen && shouldFocusDetail) {
      requestAnimationFrame(() => detailInputRef.current?.focus());
      setShouldFocusDetail(false);
    }
  }, [isAddressSearchOpen, shouldFocusDetail]);

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (editingAddress) {
      setTitle(editingAddress.title);
      setRecipientName(editingAddress.recipientName);

      // 주소를 기본주소와 상세주소로 분리
      const addressParts = editingAddress.address.split('\n');
      if (addressParts.length > 1) {
        setAddress(addressParts[0]);
        setDetailAddress(addressParts.slice(1).join('\n'));
      } else {
        setAddress(editingAddress.address);
        setDetailAddress('');
      }

      setPhoneNumber(editingAddress.phoneNumber);
      setIsDefault(editingAddress.isDefault);
    } else {
      // 추가 모드일 때는 초기화
      setTitle('');
      setRecipientName('');
      setAddress('');
      setDetailAddress('');
      setPhoneNumber('');
      setIsDefault(false);
    }
  }, [editingAddress, isOpen]);

  // 모달이 열렸을 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
  };

  const handleSave = () => {
    // 유효성 검사
    if (!validateRequired(title)) {
      handleValidationError(t('delivery.validation.titleRequired'));
      return;
    }

    if (!validateRequired(recipientName)) {
      handleValidationError(t('delivery.validation.recipientNameRequired'));
      return;
    }

    if (!validateRequired(address)) {
      handleValidationError(t('delivery.validation.addressRequired'));
      return;
    }

    if (!validateRequired(phoneNumber)) {
      handleValidationError(t('delivery.validation.phoneNumberRequired'));
      return;
    }

    if (!validatePhone(phoneNumber)) {
      handleValidationError(t('delivery.validation.phoneNumberInvalid'));
      return;
    }

    const addressData = {
      ...(editingAddress ? { id: editingAddress.id } : {}),
      title,
      recipientName,
      address: detailAddress ? `${address}\n${detailAddress}` : address,
      detailAddress,
      phoneNumber,
      isDefault
    };

    onSave(addressData);

    // 폼 초기화는 추가 모드일 때만
    if (!editingAddress) {
      setTitle('');
      setRecipientName('');
      setAddress('');
      setDetailAddress('');
      setPhoneNumber('');
      setIsDefault(false);
    }
  };

  const isSaveEnabled = title && recipientName && address && phoneNumber;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#FAFAFA',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        width: '100%',
        height: '5.625rem',
        background: '#FAFAFA',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '1.875rem',
            height: '1.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <img src="/assets/icons/back.svg" alt="Back" style={{ width: '1.875rem', height: '1.875rem' }} />
        </button>

        <h1 style={{
          textAlign: 'center',
          color: 'black',
          fontSize: '1.125rem',
          fontWeight: '500',
          margin: 0,
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          {editingAddress ? t('mypage.editDeliveryAddress') : t('mypage.addDeliveryAddress')}
        </h1>

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '1.875rem',
            height: '1.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <img src='/assets/icons/btn-끄기.svg' alt='close' width={30} height={30}/>
        </button>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          paddingBottom: '1.25rem',
          minHeight: 0
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem'
          }}
        >
          {/* 배송지 이름 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <div
                style={{
                  color: '#595959',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.225rem'
                }}
              >
                {t('delivery.addressName')}
              </div>
              <div
                style={{
                  color: '#FC0606',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.225rem'
                }}
              >
                *
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('delivery.addressNamePlaceholder')}
                style={{
                  padding: '0.5rem 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #E0E0E0',
                  color: '#1F1F1F',
                  fontSize: '1rem',
                  fontWeight: '400',
                  fontFamily: 'Pretendard',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* 받는 사람 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <div
                style={{
                  color: '#595959',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.225rem'
                }}
              >
                {t('delivery.recipientName')}
              </div>
              <div
                style={{
                  color: '#FC0606',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.225rem'
                }}
              >
                *
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={t('delivery.recipientNamePlaceholder')}
                style={{
                  padding: '0.5rem 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #E0E0E0',
                  color: '#1F1F1F',
                  fontSize: '1rem',
                  fontWeight: '400',
                  fontFamily: 'Pretendard',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* 주소 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <div
                style={{
                  color: '#595959',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.225rem'
                }}
              >
                {t('delivery.address')}
              </div>
              <div
                style={{
                  color: '#FC0606',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.225rem'
                }}
              >
                *
              </div>
            </div>
            <div
              onClick={() => setIsAddressSearchOpen(true)}
              style={{
                maxHeight: '12.5rem',
                padding: '0.75rem',
                background: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #E0E0E0',
                color: address ? '#1F1F1F' : '#979797',
                fontSize: '0.875rem',
                fontWeight: '400',
                fontFamily: 'Pretendard',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                whiteSpace: 'pre-wrap',
                gap: '0.625rem'
              }}
            >
              <div style={{ flex: 1 }}>{address || t('delivery.addressPlaceholder')}</div>
              <img src='/assets/icons/ic_search.svg' alt='search' width={24} height={24}/>
            </div>

            {/* 상세주소 입력 필드 - 주소가 선택된 후에만 표시 */}
            {address && (
              <div
                style={{
                  maxHeight: '12.5rem',
                  padding: '0.75rem',
                  background: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid #E0E0E0'
                }}
              >
                <input
                  type="text"
                  ref={detailInputRef}
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder={t('delivery.detailAddressPlaceholder')}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#1F1F1F',
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    fontFamily: 'Pretendard',
                    outline: 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* 휴대폰 번호 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <div
                style={{
                  color: '#595959',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.225rem'
                }}
              >
                {t('delivery.phoneNumber')}
              </div>
              <div
                style={{
                  color: '#FC0606',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.225rem'
                }}
              >
                *
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t('delivery.phoneNumberPlaceholder')}
                style={{
                  padding: '0.5rem 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #E0E0E0',
                  color: '#1F1F1F',
                  fontSize: '1rem',
                  fontWeight: '400',
                  fontFamily: 'Pretendard',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* 기본 배송지로 설정 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              cursor: 'pointer'
            }}
            onClick={() => setIsDefault(!isDefault)}
          >
            <div
              style={{
                width: '1.25rem',
                height: '1.25rem',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  background: isDefault ? '#00A0D2' : 'white',
                  border: isDefault ? 'none' : '1px solid #D0D0D0',
                  borderRadius: '0.125rem'
                }}
              />
              {isDefault && (
                <svg
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                  fill="none"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span
              style={{
                color: '#1F1F1F',
                fontSize: '1rem',
                fontWeight: '400'
              }}
            >
              {t('delivery.setDefault')}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div
        style={{
          width: '100%',
          height: '4.375rem',
          background: isSaveEnabled ? '#00A0D2' : '#D0D0D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isSaveEnabled ? 'pointer' : 'not-allowed',
          flexShrink: 0
        }}
        onClick={isSaveEnabled ? handleSave : undefined}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '500'
          }}
        >
          {t('common.save')}
        </div>
      </div>

      {/* 주소 검색 모달 */}
      <AddressSearchModal
        isOpen={isAddressSearchOpen}
        onClose={() => setIsAddressSearchOpen(false)}
        onSelect={({ displayAddress, postalCode }) => {
          const combined = (postalCode ? postalCode + '\n' : '') + displayAddress;
          handleAddressSelect(combined);
          setIsAddressSearchOpen(false);
          setShouldFocusDetail(true);
        }}
        onDetailAddressReset={() => setDetailAddress('')}
      />
    </div>
  );
}

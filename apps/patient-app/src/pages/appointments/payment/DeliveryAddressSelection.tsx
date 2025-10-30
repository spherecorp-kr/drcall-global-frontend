import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import DeliveryAddressCard from '@appointment/shared/payment/DeliveryAddressCard';
import ConfirmModal from '@ui/modals/ConfirmModal';
import AlertModal from '@ui/modals/AlertModal';
import DeliveryAddressAdd from '@pages/mypage/DeliveryAddressAdd';

interface DeliveryAddress {
  id: string;
  isDefault: boolean;
  title: string;
  recipientName: string;
  address: string;
  phoneNumber: string;
}

interface DeliveryAddressSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (addressId: string) => void;
  initialSelectedId?: string;
}

/**
 * 배송지 선택 풀모달
 * - 배송지 목록 표시
 * - 배송지 선택 기능
 * - 배송지 추가/수정/삭제 기능
 */
export default function DeliveryAddressSelection({
  isOpen,
  onClose,
  onConfirm,
  initialSelectedId
}: DeliveryAddressSelectionProps) {
  const { t } = useTranslation();
  // TODO: API에서 배송지 목록 가져오기
  const [addresses] = useState<DeliveryAddress[]>([
    {
      id: '1',
      isDefault: true,
      title: '회사 근처에서 약 배송 받으려고 등록해둔 강남역 인근 오피스텔 주소',
      recipientName: '김환자',
      address: '1902, Building 103, Raemian Apartment, 162 Baumoe-ro, Seocho-gu, Seoul, Republic of Korea',
      phoneNumber: '062-1234-1234'
    },
    {
      id: '2',
      isDefault: false,
      title: '서울 본가 집',
      recipientName: '김환자',
      address: '1902, Building 103, Raemian Apartment, 162 Baumoe-ro, Seocho-gu, Seoul, Republic of Korea',
      phoneNumber: '062-1234-1234'
    },
    {
      id: '3',
      isDefault: false,
      title: '부산 친구 집',
      recipientName: '이친구',
      address: '789, Haeundae-ro, Haeundae-gu, Busan, Republic of Korea',
      phoneNumber: '051-2222-3333'
    },
    {
      id: '4',
      isDefault: false,
      title: '대전 부모님 댁',
      recipientName: '김부모',
      address: '321, Dunsan-ro, Seo-gu, Daejeon, Republic of Korea',
      phoneNumber: '042-5555-6666'
    },
    {
      id: '5',
      isDefault: false,
      title: '제주도 별장',
      recipientName: '박제주',
      address: '555, Jeju-daero, Jeju-si, Jeju-do, Republic of Korea',
      phoneNumber: '064-7777-8888'
    }
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(initialSelectedId || '1');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [maxLimitAlertOpen, setMaxLimitAlertOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);

  const MAX_ADDRESSES = 10;

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

  const handleEdit = (id: string) => {
    const addressToEdit = addresses.find(addr => addr.id === id);
    if (addressToEdit) {
      setEditingAddress(addressToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      // TODO: 배송지 삭제 API 호출
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
  };

  const handleSelect = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleAddAddress = () => {
    if (addresses.length >= MAX_ADDRESSES) {
      setMaxLimitAlertOpen(true);
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleSaveAddress = (addressData: {
    id?: string;
    title: string;
    recipientName: string;
    address: string;
    detailAddress: string;
    phoneNumber: string;
    isDefault: boolean;
  }) => {
    if (addressData.id) {
      // 수정 모드
      // TODO: 배송지 수정 API 호출
      console.log('Update address:', addressData);
    } else {
      // 추가 모드
      // TODO: 배송지 추가 API 호출
      console.log('Save new address:', addressData);
    }
    setIsAddModalOpen(false);
    setEditingAddress(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingAddress(null);
  };

  const handleConfirm = () => {
    if (!selectedAddressId) {
      // TODO: 배송지 선택 알림
      return;
    }

    onConfirm(selectedAddressId);
    onClose();
  };

  const isConfirmEnabled = selectedAddressId !== null;

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
          <img src="/assets/icons/back.svg" alt={t('common.back')} style={{ width: '1.875rem', height: '1.875rem' }} />
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
          {t('appointment.deliveryAddressManagement')}
        </h1>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem',
          minHeight: 0
        }}
      >
        {/* 배송지 추가 button - 우측 정렬 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
          <button
            onClick={handleAddAddress}
            style={{
              width: '6.75rem',
              height: '2rem',
              background: '#00A0D2',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {t('appointment.addDeliveryAddress')}
            </div>
          </button>
        </div>

        {/* 카드 목록 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem'
          }}
        >
          {addresses.map((address) => (
            <DeliveryAddressCard
              key={address.id}
              id={address.id}
              isDefault={address.isDefault}
              isSelected={selectedAddressId === address.id}
              title={address.title}
              recipientName={address.recipientName}
              address={address.address}
              phoneNumber={address.phoneNumber}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div
        style={{
          width: '100%',
          height: '4.375rem',
          background: isConfirmEnabled ? '#00A0D2' : '#D0D0D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isConfirmEnabled ? 'pointer' : 'not-allowed',
          flexShrink: 0
        }}
        onClick={handleConfirm}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '500'
          }}
        >
          {t('common.confirm')}
        </div>
      </div>

      {/* 배송지 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        message={t('appointment.deleteDeliveryAddressConfirm')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
      />

      {/* 배송지 추가 불가 알림 모달 */}
      <AlertModal
        isOpen={maxLimitAlertOpen}
        onClose={() => setMaxLimitAlertOpen(false)}
        message={t('appointment.maxDeliveryAddressLimit')}
        confirmText={t('common.confirm')}
      />

      {/* 배송지 추가/수정 모달 */}
      <DeliveryAddressAdd
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveAddress}
        editingAddress={editingAddress}
      />
    </div>
  );
}

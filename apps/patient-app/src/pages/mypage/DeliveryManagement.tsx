import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import DeliveryAddressCard from '@appointment/shared/payment/DeliveryAddressCard';
import ConfirmModal from '@ui/modals/ConfirmModal';
import AlertModal from '@ui/modals/AlertModal';
import DeliveryAddressAdd from './DeliveryAddressAdd';

interface DeliveryAddress {
  id: string;
  isDefault: boolean;
  title: string;
  recipientName: string;
  address: string;
  phoneNumber: string;
}

export default function DeliveryManagement() {
  const navigate = useNavigate();
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

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [maxLimitAlertOpen, setMaxLimitAlertOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);

  const MAX_ADDRESSES = 10;

  const handleClose = () => {
    navigate(-1);
  };

  const handleBack = () => {
    navigate('/mypage');
  };

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
      console.log('Delete address:', deleteTargetId);
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
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

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <MainLayout
      title={t('mypage.deliveryManagement')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName=""
    >
      <div
        style={{
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          paddingBottom: '1.25rem'
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
              {t('mypage.addDeliveryAddress')}
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
              isSelected={false}
              title={address.title}
              recipientName={address.recipientName}
              address={address.address}
              phoneNumber={address.phoneNumber}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={() => {}}
              showSelectButton={false}
            />
          ))}
        </div>
      </div>

      {/* 배송지 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        message={t('mypage.confirmDeleteDeliveryAddress')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
      />

      {/* 배송지 추가 불가 알림 모달 */}
      <AlertModal
        isOpen={maxLimitAlertOpen}
        onClose={() => setMaxLimitAlertOpen(false)}
        message={t('delivery.maxAddressLimit', { max: 10 })}
        confirmText={t('common.confirm')}
      />

      {/* 배송지 추가/수정 모달 */}
      <DeliveryAddressAdd
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAddress}
        editingAddress={editingAddress}
      />
    </MainLayout>
  );
}

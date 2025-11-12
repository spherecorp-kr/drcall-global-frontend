import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import DeliveryAddressCard from '@appointment/shared/payment/DeliveryAddressCard';
import ConfirmModal from '@ui/modals/ConfirmModal';
import AlertModal from '@ui/modals/AlertModal';
import DeliveryAddressAdd from './DeliveryAddressAdd';
import { deliveryService } from '@/services/deliveryService';
import type { DeliveryAddress } from '@/types/delivery';
import { useAuthStore } from '@store/authStore';
import { useToast } from '@hooks/useToast';

export default function DeliveryManagement() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { showToast, ToastComponent } = useToast();

  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load delivery addresses on mount
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.patientId) {
        showToast(t('error.notLoggedIn'), 'error');
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        const data = await deliveryService.getDeliveryAddresses(user.patientId);
        setAddresses(data);
      } catch (error) {
        console.error('Failed to load delivery addresses:', error);
        showToast(t('error.loadFailed'), 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, [user, navigate, t, showToast]);

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

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId || !user?.patientId) return;

    try {
      await deliveryService.deleteDeliveryAddress(user.patientId, deleteTargetId);

      // Remove from local state
      setAddresses((prev) => prev.filter((addr) => addr.id !== deleteTargetId));

      showToast(t('mypage.deliveryAddressDeleted'), 'success');
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.error('Failed to delete delivery address:', error);
      showToast(t('error.deleteFailed'), 'error');
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

  const handleSaveAddress = async (addressData: {
    id?: string;
    title: string;
    recipientName: string;
    address: string;
    detailAddress: string;
    phoneNumber: string;
    isDefault: boolean;
  }) => {
    if (!user?.patientId) {
      showToast(t('error.notLoggedIn'), 'error');
      return;
    }

    try {
      if (addressData.id) {
        // 수정 모드
        const updated = await deliveryService.updateDeliveryAddress(user.patientId, addressData.id, {
          title: addressData.title,
          recipientName: addressData.recipientName,
          phoneNumber: addressData.phoneNumber,
          address: addressData.address,
          addressDetail: addressData.detailAddress,
          isDefault: addressData.isDefault,
        });

        setAddresses((prev) => prev.map((addr) => (addr.id === addressData.id ? updated : addr)));
        showToast(t('mypage.deliveryAddressUpdated'), 'success');
      } else {
        // 추가 모드
        const created = await deliveryService.createDeliveryAddress(user.patientId, {
          title: addressData.title,
          recipientName: addressData.recipientName,
          phoneNumber: addressData.phoneNumber,
          address: addressData.address,
          addressDetail: addressData.detailAddress,
          isDefault: addressData.isDefault,
        });

        setAddresses((prev) => [created, ...prev]);
        showToast(t('mypage.deliveryAddressAdded'), 'success');
      }

      setIsAddModalOpen(false);
      setEditingAddress(null);
    } catch (error: any) {
      console.error('Failed to save delivery address:', error);

      // Check for max limit error
      if (error?.response?.data?.message?.includes('Maximum')) {
        showToast(t('delivery.maxAddressLimit', { max: 10 }), 'warning');
      } else {
        showToast(t('error.saveFailed'), 'error');
      }
    }
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
              background: '#00A0D2',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.375rem 1.125rem'
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

      {/* Toast */}
      {ToastComponent}
    </MainLayout>
  );
}

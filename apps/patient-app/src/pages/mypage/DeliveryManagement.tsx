import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import ConfirmModal from '@ui/modals/ConfirmModal';
import AlertModal from '@ui/modals/AlertModal';
import DeliveryAddressAdd from './DeliveryAddressAdd';
import { useDeliveryAddresses } from '@/features/delivery/useDeliveryAddresses';
import DeliveryAddressList from '@/features/delivery/DeliveryAddressList';

/**
 * 배송지 관리 페이지
 * - 배송지 추가/수정/삭제 기능
 * - 배송지 선택 기능
 * - 배송지 최대 개수 제한 기능
 * - 배송지 선택 모달 오픈/클로즈 기능
 * - 배송지 선택 모달 오픈/클로즈 기능
 */
export default function DeliveryManagement() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // 공통 headless 훅: 목록/삭제/추가/수정 등 관리용 액션 제공 (선택 비활성화)
  const { addresses, ui, actions } = useDeliveryAddresses({
    selectionEnabled: false,
    labels: {
      addButtonKey: 'mypage.addDeliveryAddress',
      deleteConfirmKey: 'mypage.confirmDeleteDeliveryAddress',
      maxLimitKey: 'delivery.maxAddressLimit',
      confirmKey: 'common.confirm'
    }
  });

  const handleClose = () => {
    navigate(-1);
  };

  const handleBack = () => {
    navigate('/mypage');
  };

  const handleEdit = (id: string) => actions.edit(id);

  const handleDelete = (id: string) => actions.deleteAsk(id);

  const handleDeleteConfirm = () => actions.deleteConfirm();

  const handleDeleteCancel = () => actions.deleteCancel();

  const handleAddAddress = () => actions.addOpen();

  const handleSaveAddress = (addressData: {
    id?: string;
    title: string;
    recipientName: string;
    address: string;
    detailAddress: string;
    phoneNumber: string;
    isDefault: boolean;
  }) => actions.save(addressData);

  const handleCloseModal = () => actions.addClose();

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
        <DeliveryAddressList
          addresses={addresses}
          selectedId={null}
          selectable={false}
          onSelect={() => {}}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showSelectButton={false}
        />
      </div>

      {/* 배송지 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={ui.isDeleteConfirmOpen}
        message={t('mypage.confirmDeleteDeliveryAddress')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
      />

      {/* 배송지 추가 불가 알림 모달 */}
      <AlertModal
        isOpen={ui.isMaxLimitOpen}
        onClose={actions.maxLimitClose}
        message={t('delivery.maxAddressLimit', { max: 10 })}
        confirmText={t('common.confirm')}
      />

      {/* 배송지 추가/수정 모달 */}
      <DeliveryAddressAdd
        isOpen={ui.isAddOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAddress}
        editingAddress={ui.editingAddress}
      />
    </MainLayout>
  );
}

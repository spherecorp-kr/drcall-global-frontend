import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '@ui/modals/ConfirmModal';
import AlertModal from '@ui/modals/AlertModal';
import DeliveryAddressAdd from '@pages/mypage/DeliveryAddressAdd';
import { useDeliveryAddresses } from '@/features/delivery/useDeliveryAddresses';
import DeliveryAddressList from '@/features/delivery/DeliveryAddressList';
import DeliveryAddressConfirmButton from '@/features/delivery/DeliveryAddressConfirmButton';

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
  // 공통 headless 훅: 목록/선택/모달 상태 및 액션 제공 (i18n 라벨 키 주입)
  const { addresses, selectedId, ui, actions } = useDeliveryAddresses({
    selectionEnabled: true,
    initialSelectedId,
    labels: {
      addButtonKey: 'appointment.addDeliveryAddress',
      deleteConfirmKey: 'appointment.deleteDeliveryAddressConfirm',
      maxLimitKey: 'appointment.maxDeliveryAddressLimit',
      confirmKey: 'common.confirm'
    }
  });

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

  const handleEdit = (id: string) => actions.edit(id);
  const handleDelete = (id: string) => actions.deleteAsk(id);

  const handleConfirm = () => {
    if (!selectedId) {
      // TODO: 배송지 선택 알림
      return;
    }

    onConfirm(selectedId);
    onClose();
  };

  const isConfirmEnabled = selectedId !== null;

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
          paddingBottom: '1.25rem',
          minHeight: 0
        }}
      >
        {/* 배송지 추가 button - 우측 정렬 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
          <button
            onClick={actions.addOpen}
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
              {t('appointment.addDeliveryAddress')}
            </div>
          </button>
        </div>

        {/* 카드 목록 */}
        <DeliveryAddressList
          addresses={addresses}
          selectedId={selectedId}
          selectable
          onSelect={actions.select}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Fixed Bottom Button */}
      <DeliveryAddressConfirmButton
        enabled={isConfirmEnabled}
        labelKey={'common.confirm'}
        onConfirm={handleConfirm}
      />

      {/* 배송지 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={ui.isDeleteConfirmOpen}
        message={t('appointment.deleteDeliveryAddressConfirm')}
        onConfirm={actions.deleteConfirm}
        onCancel={actions.deleteCancel}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
      />

      {/* 배송지 추가 불가 알림 모달 */}
      <AlertModal
        isOpen={ui.isMaxLimitOpen}
        onClose={actions.maxLimitClose}
        message={t('appointment.maxDeliveryAddressLimit')}
        confirmText={t('common.confirm')}
      />

      {/* 배송지 추가/수정 모달 */}
      <DeliveryAddressAdd
        isOpen={ui.isAddOpen}
        onClose={actions.addClose}
        onSave={actions.save}
        editingAddress={ui.editingAddress}
      />
    </div>
  );
}

import DeliveryAddressCard from '@appointment/shared/payment/DeliveryAddressCard';
import type { DeliveryAddress } from './types';

/**
 * 배송지 카드 리스트 프레젠테이셔널 컴포넌트
 * - 데이터/상태는 상위(또는 headless 훅)에서 주입
 */
type Props = {
  addresses: DeliveryAddress[];
  selectedId: string | null;
  selectable: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  showSelectButton?: boolean;
};

/**
 * 리스트는 카드의 props만 연결하며, 선택 비활성화(selectable=false) 시
 * 내부 onSelect는 no-op 처리되고, 필요 시 선택 버튼 숨김 제어(showSelectButton)만 전달합니다.
 */
export default function DeliveryAddressList({
  addresses,
  selectedId,
  selectable,
  onSelect,
  onEdit,
  onDelete,
  showSelectButton
}: Props) {
  return (
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
          isSelected={!!selectedId && selectedId === address.id}
          title={address.title}
          recipientName={address.recipientName}
          address={address.address}
          phoneNumber={address.phoneNumber}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={selectable ? onSelect : () => {}}
          {...(selectable ? {} : { showSelectButton: showSelectButton ?? false })}
        />
      ))}
    </div>
  );
}

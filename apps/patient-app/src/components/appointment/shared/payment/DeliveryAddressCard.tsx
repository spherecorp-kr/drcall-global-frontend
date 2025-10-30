import { useTranslation } from 'react-i18next';

interface DeliveryAddressCardProps {
  id: string;
  isDefault?: boolean;
  isSelected?: boolean;
  title: string;
  recipientName: string;
  address: string;
  phoneNumber: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  showSelectButton?: boolean;
}

/**
 * 배송지 카드 컴포넌트
 * - 기본 배송지 태그 (선택된 경우만)
 * - 제목, 수령인, 주소, 전화번호 표시
 * - 수정/삭제 버튼 (왼쪽)
 * - 선택/선택됨 (오른쪽)
 */
export default function DeliveryAddressCard({
  id,
  isDefault = false,
  isSelected = false,
  title,
  recipientName,
  address,
  phoneNumber,
  onEdit,
  onDelete,
  onSelect,
  showSelectButton = true
}: DeliveryAddressCardProps) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        padding: '1.25rem',
        background: 'white',
        borderRadius: '0.625rem',
        outline: isSelected ? '2px solid #00A0D2' : 'none',
        outlineOffset: '-2px',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '0.625rem',
        display: 'flex'
      }}
    >
      <div
        style={{
          alignSelf: 'stretch',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '0.5rem',
          display: 'flex'
        }}
      >
        {/* 기본 배송지 태그 + 제목 */}
        <div
          style={{
            alignSelf: 'stretch',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '0.5rem',
            display: 'flex'
          }}
        >
          {/* 기본 배송지 태그 */}
          {isDefault && (
            <div
              style={{
                height: '1.25rem',
                paddingLeft: '0.875rem',
                paddingRight: '0.875rem',
                paddingTop: '0.375rem',
                paddingBottom: '0.375rem',
                background: 'white',
                overflow: 'hidden',
                borderRadius: '3.125rem',
                outline: '1px solid #00A0D2',
                outlineOffset: '-1px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.625rem',
                display: 'inline-flex'
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  color: '#00A0D2',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}
              >
                {t('delivery.defaultAddress')}
              </div>
            </div>
          )}

          {/* 제목 */}
          <div
            style={{
              alignSelf: 'stretch',
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '700'
            }}
          >
            {title}
          </div>
        </div>

        {/* 받는 사람 */}
        <div
          style={{
            alignSelf: 'stretch',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '0.5rem',
            display: 'flex'
          }}
        >
          <div
            style={{
              alignSelf: 'stretch',
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('delivery.recipientName')}
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400'
            }}
          >
            {recipientName}
          </div>
        </div>

        {/* 주소 */}
        <div
          style={{
            alignSelf: 'stretch',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '0.5rem',
            display: 'flex'
          }}
        >
          <div
            style={{
              alignSelf: 'stretch',
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('delivery.address')}
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400'
            }}
          >
            {address}
          </div>
        </div>

        {/* 휴대폰번호 */}
        <div
          style={{
            alignSelf: 'stretch',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '0.5rem',
            display: 'flex'
          }}
        >
          <div
            style={{
              alignSelf: 'stretch',
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('delivery.phoneNumber')}
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400'
            }}
          >
            {phoneNumber}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div
          style={{
            alignSelf: 'stretch',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            display: 'inline-flex'
          }}
        >
          {/* 왼쪽: 수정/삭제 버튼 */}
          <div
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '0.625rem',
              display: 'flex'
            }}
          >
            <button
              onClick={() => onEdit(id)}
              style={{
                height: '1.75rem',
                paddingLeft: '0.875rem',
                paddingRight: '0.875rem',
                paddingTop: '0.375rem',
                paddingBottom: '0.375rem',
                background: 'white',
                overflow: 'hidden',
                borderRadius: '0.25rem',
                outline: '1px solid #E0E0E0',
                outlineOffset: '-1px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.625rem',
                display: 'flex',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  color: '#1F1F1F',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}
              >
                {t('common.edit')}
              </div>
            </button>

            <button
              onClick={() => onDelete(id)}
              style={{
                height: '1.75rem',
                paddingLeft: '0.875rem',
                paddingRight: '0.875rem',
                paddingTop: '0.375rem',
                paddingBottom: '0.375rem',
                background: 'white',
                overflow: 'hidden',
                borderRadius: '0.25rem',
                outline: '1px solid #E0E0E0',
                outlineOffset: '-1px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.625rem',
                display: 'flex',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  color: '#1F1F1F',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}
              >
                {t('common.delete')}
              </div>
            </button>
          </div>

          {/* 오른쪽: 선택/선택됨 */}
          {showSelectButton && (
            <>
              {isSelected ? (
                <div
                  style={{
                    alignSelf: 'stretch',
                    paddingTop: '0.375rem',
                    paddingBottom: '0.375rem',
                    overflow: 'hidden',
                    borderRadius: '0.25rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '0.25rem',
                    display: 'flex'
                  }}
                >
                  <div style={{ width: '1rem', height: '1rem' }}>
                    <img
                      src="/assets/icons/checkbox-list-checked.svg"
                      alt="selected"
                      style={{ width: '1rem', height: '1rem' }}
                    />
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#00A0D2',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}
                  >
                    {t('delivery.selected')}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onSelect(id)}
                  style={{
                    height: '1.75rem',
                    paddingLeft: '0.875rem',
                    paddingRight: '0.875rem',
                    paddingTop: '0.375rem',
                    paddingBottom: '0.375rem',
                    background: 'rgba(0, 160, 210, 0.20)',
                    overflow: 'hidden',
                    borderRadius: '0.25rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.625rem',
                    display: 'flex',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#1F1F1F',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}
                  >
                    {t('common.select')}
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

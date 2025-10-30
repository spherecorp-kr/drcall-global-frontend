import { useTranslation } from 'react-i18next';

type DeliverySourceType = 'my-info' | 'address-list';

interface DeliveryInfoSectionProps {
  title?: string;
  recipientName: string;
  address: string;
  phoneNumber: string;
  deliveryRequest: string;
  isDefault?: boolean;
  deliverySource?: DeliverySourceType;
  onChangeAddress?: () => void;
  onChangeDeliveryRequest?: (value: string) => void;
  onChangeDeliverySource?: (source: DeliverySourceType) => void;
}

/**
 * 배송 정보 섹션 컴포넌트
 * - 기본 배송지 표시
 * - 받는 사람, 주소, 휴대폰번호
 * - 배송 요청 사항 입력
 */
export default function DeliveryInfoSection({
  title,
  recipientName,
  address,
  phoneNumber,
  deliveryRequest,
  isDefault = false,
  deliverySource = 'address-list',
  onChangeAddress,
  onChangeDeliveryRequest,
  onChangeDeliverySource
}: DeliveryInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      <div
        style={{
          color: '#1F1F1F',
          fontSize: '1.125rem',
          fontWeight: '600'
        }}
      >
        {t('delivery.title')}
      </div>

      <div
        style={{
          padding: '1.25rem',
          background: 'white',
          borderRadius: '0.625rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem'
        }}
      >
        {/* 배송지 소스 선택 */}
        {onChangeDeliverySource && (
          <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.625rem' }}>
            <button
              onClick={() => onChangeDeliverySource('my-info')}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: deliverySource === 'my-info' ? '#F0FFF4' : 'white',
                border: deliverySource === 'my-info' ? '1px solid #10B981' : '1px solid #E0E0E0',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: deliverySource === 'my-info' ? '#10B981' : '#1F1F1F'
              }}>
                {t('delivery.myInfo')}
              </span>
            </button>

            <button
              onClick={() => onChangeDeliverySource('address-list')}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: deliverySource === 'address-list' ? '#F0F9FF' : 'white',
                border: deliverySource === 'address-list' ? '1px solid #00A0D2' : '1px solid #E0E0E0',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: deliverySource === 'address-list' ? '#00A0D2' : '#1F1F1F'
              }}>
                {t('delivery.deliveryManagementShort')}
              </span>
            </button>
          </div>
        )}

        {/* 태그 & 변경 버튼 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {deliverySource === 'my-info' ? (
            <div
              style={{
                height: '1.25rem',
                paddingLeft: '0.875rem',
                paddingRight: '0.875rem',
                paddingTop: '0.375rem',
                paddingBottom: '0.375rem',
                background: 'white',
                borderRadius: '3.125rem',
                border: '1px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  color: '#10B981',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}
              >
                {t('delivery.myInfo')}
              </div>
            </div>
          ) : (
            <>
              {isDefault && (
                <div
                  style={{
                    height: '1.25rem',
                    paddingLeft: '0.875rem',
                    paddingRight: '0.875rem',
                    paddingTop: '0.375rem',
                    paddingBottom: '0.375rem',
                    background: 'white',
                    borderRadius: '3.125rem',
                    border: '1px solid #00A0D2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#00A0D2',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    {t('delivery.defaultDeliveryAddress')}
                  </div>
                </div>
              )}

              {onChangeAddress && (
                <button
                  onClick={onChangeAddress}
                  style={{
                    height: '1.75rem',
                    paddingLeft: '0.875rem',
                    paddingRight: '0.875rem',
                    paddingTop: '0.375rem',
                    paddingBottom: '0.375rem',
                    background: 'white',
                    borderRadius: '0.25rem',
                    border: '1px solid #E0E0E0',
                    cursor: 'pointer',
                    textAlign: 'center',
                    color: '#1F1F1F',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    marginLeft: 'auto'
                  }}
                >
                  {t('delivery.change')}
                </button>
              )}
            </>
          )}
        </div>

        {/* 배송지 제목 (선택사항) */}
        {title && (
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '700'
            }}
          >
            {title}
          </div>
        )}

        {/* 받는 사람 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('delivery.recipientName')}
          </div>
          <div
            style={{
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
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('delivery.address')}
          </div>
          <div
            style={{
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
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('delivery.phoneNumber')}
          </div>
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400'
            }}
          >
            {phoneNumber}
          </div>
        </div>

        {/* 배송 요청 사항 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400'
            }}
          >
            {t('delivery.deliveryRequest')}
          </div>
          <textarea
            value={deliveryRequest}
            onChange={(e) => onChangeDeliveryRequest?.(e.target.value)}
            placeholder={t('delivery.deliveryRequestPlaceholder')}
            style={{
              height: '5rem',
              minHeight: '5rem',
              background: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #E0E0E0',
              padding: '0.5rem 1rem 0.875rem 1rem',
              color: '#1F1F1F',
              fontSize: '0.875rem',
              fontWeight: '400',
              fontFamily: 'Pretendard',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
}

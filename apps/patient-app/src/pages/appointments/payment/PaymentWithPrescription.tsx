import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import MedicineDeliverySelector, { type MedicineDeliveryMethod } from '@appointment/shared/payment/MedicineDeliverySelector';
import DeliveryInfoSection from '@appointment/shared/payment/DeliveryInfoSection';
import DirectPickupInfoSection from '@appointment/shared/payment/DirectPickupInfoSection';
import PaymentAmountDisplay from '@appointment/shared/payment/PaymentAmountDisplay';
import PaymentMethodSelector, { type PaymentMethod } from '@appointment/shared/payment/PaymentMethodSelector';
import DeliveryAddressSelection from './DeliveryAddressSelection';
import { shippingService } from '@services/shippingService';

/**
 * 처방전이 있는 경우 결제 페이지
 * - 약 배송 방법 선택
 * - 배송 정보 / 직접 수령 정보
 * - 결제 금액 표시
 * - 결제 수단 선택
 * - 결제하기 버튼
 */
export default function PaymentWithPrescription() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [deliveryMethod, setDeliveryMethod] = useState<MedicineDeliveryMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [deliveryRequest, setDeliveryRequest] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('1');
  const [deliverySource, setDeliverySource] = useState<'my-info' | 'address-list'>('address-list');

  // 배송비 관련 상태
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [isLoadingShippingFee, setIsLoadingShippingFee] = useState<boolean>(false);
  const [shippingFeeError, setShippingFeeError] = useState<string | null>(null);

  // TODO: API에서 결제 정보 가져오기
  const baseAmount = 300 + 50 + 50; // consultationFee + prescriptionFee + serviceFee
  const actualDeliveryFee = deliveryMethod && deliveryMethod !== 'direct' ? shippingFee : 0;

  const paymentData = {
    totalAmount: baseAmount + actualDeliveryFee,
    consultationFee: 300,
    prescriptionFee: 50,
    serviceFee: 50,
    deliveryFee: actualDeliveryFee
  };

  // TODO: API에서 배송지 목록 가져오기
  const addressList = [
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
  ];

  // 내 정보 (마이페이지에서 가져온 정보)
  const myInfo = {
    recipientName: '홍길동',
    address: '13242\n서울 서초구 양재대로 **길 ** 3125동 324호',
    phoneNumber: '123456578963'
  };

  // 선택된 배송지 정보 가져오기
  const selectedAddress = addressList.find(addr => addr.id === selectedAddressId);

  // 배송 정보 결정 (내 정보 or 배송지 관리)
  const deliveryInfo = deliverySource === 'my-info'
    ? myInfo
    : {
        recipientName: selectedAddress?.recipientName || '김환자',
        address: selectedAddress?.address || '1902, Building 103, Raemian Apartment, 162 Baumoe-ro, Seocho-gu, Seoul, Republic of Korea',
        phoneNumber: selectedAddress?.phoneNumber || '062-1234-1234'
      };

  // TODO: API에서 직접 수령 정보 가져오기
  const pickupInfo = {
    pickupNumber: '202509-48',
    address: '1902, Building 103, Raemian Apartment, 162 Baumoe-ro, Seocho-gu, Seoul, Republic of Korea',
    pickupLocation: 'Praram9 3F 약제실',
    operatingHours: '· 월–금: 08:30 ~ 17:00\n· 토요일: 09:00 ~ 12:00\n· 일요일/공휴일: 휴무',
    phoneNumber: '+66-2-123-4567'
  };

  const handlePayment = () => {
    if (!deliveryMethod) {
      // TODO: 배송 방법 선택 알림
      return;
    }

    if (!paymentMethod) {
      // TODO: 결제 수단 선택 알림
      return;
    }

    // TODO: 결제 처리 로직
    // 결제 완료 페이지로 이동
    navigate('/appointments/payment/complete');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate('/appointments');
  };

  const handleChangeAddress = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressConfirm = (addressId: string) => {
    setSelectedAddressId(addressId);
    // TODO: 선택된 배송지로 deliveryInfo 업데이트
  };

  /**
   * 배송비 계산 함수
   * 배송지가 선택되고 배송 방법이 선택되면 SHIPPOP API를 통해 실제 배송비를 조회합니다.
   */
  const calculateShippingFee = async () => {
    // 직접 수령인 경우 배송비 0
    if (deliveryMethod === 'direct' || !deliveryMethod) {
      setShippingFee(0);
      return;
    }

    setIsLoadingShippingFee(true);
    setShippingFeeError(null);

    try {
      // 주소 파싱 (실제로는 더 정교한 파싱이 필요할 수 있음)
      // 현재는 Mock 데이터로 태국 주소 형식 가정
      const address = deliveryInfo.address;

      // TODO: 실제 주소 파싱 로직 필요
      // 예: "1902, Building 103, Raemian Apartment, 162 Baumoe-ro, Seocho-gu, Seoul, Republic of Korea"
      // → toProvince: "Seoul", toDistrict: "Seocho-gu" 등으로 파싱

      // 현재는 Mock으로 방콕 가정
      const response = await shippingService.calculateFee({
        fromProvince: 'กรุงเทพมหานคร', // Bangkok
        fromDistrict: 'ห้วยขวาง', // Huai Khwang (병원 위치 예시)
        toProvince: 'กรุงเทพมหานคร', // Bangkok
        toDistrict: 'บางรัก', // Bang Rak (환자 주소 예시)
        parcelWeight: 0.5,
        parcelValue: 100
      });

      setShippingFee(response.shippingFee);

      // Fallback 사용 시 사용자에게 알림
      if (response.fallback) {
        console.warn('Using fallback shipping fee');
      }
    } catch (error) {
      console.error('Failed to calculate shipping fee:', error);
      setShippingFeeError('배송비 조회에 실패했습니다. 기본 배송비가 적용됩니다.');
      setShippingFee(50); // Fallback to default
    } finally {
      setIsLoadingShippingFee(false);
    }
  };

  // 배송지 또는 배송 방법 변경 시 배송비 재계산
  useEffect(() => {
    if (deliveryMethod && deliveryMethod !== 'direct') {
      calculateShippingFee();
    } else {
      setShippingFee(0);
    }
  }, [deliveryMethod, selectedAddressId, deliverySource]);

  const isPaymentEnabled = deliveryMethod && paymentMethod && !isLoadingShippingFee;

  return (
    <>
      <MainLayout title={t('appointment.payment')} onBack={handleBack} onClose={handleClose} fullWidth contentClassName="">
        <div
          style={{
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            paddingTop: '1.25rem',
            paddingBottom: '6rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.875rem'
          }}
        >
        {/* 약 배송 방법 선택 섹션 */}
        <MedicineDeliverySelector
          selectedMethod={deliveryMethod}
          onSelect={setDeliveryMethod}
        />

        {/* 배송 정보 섹션 (일반/퀵/해외 배송 선택시) */}
        {deliveryMethod && deliveryMethod !== 'direct' && (
          <DeliveryInfoSection
            title={deliverySource === 'address-list' ? selectedAddress?.title : undefined}
            recipientName={deliveryInfo.recipientName}
            address={deliveryInfo.address}
            phoneNumber={deliveryInfo.phoneNumber}
            deliveryRequest={deliveryRequest}
            isDefault={selectedAddress?.isDefault}
            deliverySource={deliverySource}
            onChangeAddress={deliverySource === 'address-list' ? handleChangeAddress : undefined}
            onChangeDeliveryRequest={setDeliveryRequest}
            onChangeDeliverySource={setDeliverySource}
          />
        )}

        {/* 직접 수령 정보 섹션 (직접 수령 선택시) */}
        {deliveryMethod === 'direct' && (
          <DirectPickupInfoSection
            pickupNumber={pickupInfo.pickupNumber}
            address={pickupInfo.address}
            pickupLocation={pickupInfo.pickupLocation}
            operatingHours={pickupInfo.operatingHours}
            phoneNumber={pickupInfo.phoneNumber}
          />
        )}

        {/* 결제 정보 섹션 */}
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
            {t('appointment.paymentInfo')}
          </div>

          <PaymentAmountDisplay
            totalAmount={paymentData.totalAmount}
            consultationFee={paymentData.consultationFee}
            prescriptionFee={paymentData.prescriptionFee}
            serviceFee={paymentData.serviceFee}
            deliveryFee={paymentData.deliveryFee}
          />
        </div>

        {/* 결제 수단 섹션 */}
        <PaymentMethodSelector
          selectedMethod={paymentMethod}
          onSelect={setPaymentMethod}
        />
      </div>

      {/* 하단 결제 버튼 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '4.375rem',
          background: isPaymentEnabled ? '#00A0D2' : '#D0D0D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isPaymentEnabled ? 'pointer' : 'not-allowed'
        }}
        onClick={handlePayment}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '500'
          }}
        >
          {t('appointment.payNow', { amount: paymentData.totalAmount })}
        </div>
      </div>
      </MainLayout>

      {/* 배송지 선택 모달 */}
      <DeliveryAddressSelection
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onConfirm={handleAddressConfirm}
        initialSelectedId={selectedAddressId}
      />
    </>
  );
}

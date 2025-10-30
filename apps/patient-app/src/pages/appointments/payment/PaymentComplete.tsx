import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import Button from '@ui/buttons/Button';
import BottomButtonLayout from '@layouts/BottomButtonLayout';

/**
 * 결제 완료 페이지
 * - 결제 완료 메시지 표시
 * - 체크 아이콘
 * - 안내 메시지
 * - 확인 버튼으로 예약 상세로 이동
 */
export default function PaymentComplete() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleConfirm = () => {
    // TODO: 예약 ID를 받아서 상세 페이지로 이동
    navigate('/appointments');
  };

  return (
    <MainLayout title={t('appointment.paymentComplete')} fullWidth contentClassName="">
      <div
        style={{
          paddingBottom: '4.375rem',
          background: '#FAFAFA',
          minHeight: 'calc(100vh - 3.5rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Check Icon and Message */}
        <div
          style={{
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.625rem'
          }}
        >
          {/* Check Icon */}
          <div
            style={{
              width: '5.375rem',
              height: '5.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src="/assets/icons/check-large.svg"
              alt={t('common.complete')}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Main Message */}
          <div
            style={{
              textAlign: 'center',
              color: '#1F1F1F',
              fontSize: '1.5rem',
              fontWeight: '600',
              wordWrap: 'break-word'
            }}
          >
            {t('appointment.paymentCompleteMessage')}
          </div>

          {/* Sub Message */}
          <div
            style={{
              textAlign: 'center',
              color: '#979797',
              fontSize: '1rem',
              fontWeight: '400',
              wordWrap: 'break-word',
              lineHeight: '1.5'
            }}
          >
            {t('appointment.paymentCompleteSubMessage')}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <BottomButtonLayout fullWidth contentClassName="">
        <Button onClick={handleConfirm}>{t('common.confirm')}</Button>
      </BottomButtonLayout>
    </MainLayout>
  );
}

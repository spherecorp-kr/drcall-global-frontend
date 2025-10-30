import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';

interface ErrorPageProps {
  errorCode?: string;
  title: string;
  description: string;
  subDescription?: string;
  additionalInfo?: string;
}

export default function ErrorPage({
  errorCode,
  title,
  description,
  subDescription,
  additionalInfo,
}: ErrorPageProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 에러 페이지에서는 body 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBack = () => navigate(-1);
  const handleClose = () => navigate('/');

  return (
    <MainLayout
      title={errorCode ? `${errorCode} Error` : t('error.expiredMessage')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName="overflow-hidden"
    >
      <div style={rootStyle}>
        {/* Plug (top-left) */}
        <div style={plugWrapStyle}>
          <div style={plugShadowStyle} />
          <img
            src="/assets/icons/error-plug.svg"
            alt="plug"
            style={plugImgStyle}
          />
        </div>

        {/* Cable (bottom-right) */}
        <img
          src="/assets/icons/error-cable.svg"
          alt="cable"
          style={cableStyle}
        />

        <div style={contentWrapperStyle}>
          {/* Big Error Code */}
          {errorCode && <div style={codeStyle}>{errorCode}</div>}

          {/* Title + Description */}
          <div style={titleDescStyle}>
            {title}
            {description && `\n${description}`}
          </div>

          {/* Sub Description */}
          {subDescription && <div style={subDescStyle}>{subDescription}</div>}

          {/* Additional Info */}
          {additionalInfo && <div style={addInfoStyle}>{additionalInfo}</div>}
        </div>
      </div>
    </MainLayout>
  );
}

/* ====== styles (responsive via clamp & vw) ====== */
const rootStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '0',
  paddingBottom: '0',
  height: 'calc(100dvh - 3.5rem)',
  overflow: 'hidden',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
};

const plugWrapStyle: React.CSSProperties = {
  position: 'absolute',
  left: '20px',
  top: '60px',
  width: '180px',
  height: '180px',
};

const plugShadowStyle: React.CSSProperties = {
  position: 'absolute',
  left: '15%',
  top: '15%',
  width: '100px',
  height: '100px',
  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)',
  transform: 'rotate(-45deg)',
  filter: 'blur(4px)',
  opacity: 0.6,
};

const plugImgStyle: React.CSSProperties = {
  position: 'absolute',
  width: '140px',
  height: '205px',
  left: 0,
  top: 0,
  opacity: 0.7,
};

const cableStyle: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: '176px',
  height: 'auto',
  transform: 'rotate(9deg)',
  transformOrigin: 'bottom right',
  pointerEvents: 'none',
};

const contentWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  paddingBottom: '150px',
};

const codeStyle: React.CSSProperties = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  color: '#E9E9E9',
  fontSize: '130px',
  fontWeight: 600,
  textShadow: '0px 4px 0px rgba(255, 255, 255, 1.00)',
  lineHeight: 1,
  marginBottom: '20px',
};

const titleDescStyle: React.CSSProperties = {
  width: '374px',
  textAlign: 'center',
  color: '#1F1F1F',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.3,
  whiteSpace: 'pre-line',
  marginBottom: '10px',
};

const subDescStyle: React.CSSProperties = {
  width: '374px',
  textAlign: 'center',
  color: '#A0A0A0',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.3,
  whiteSpace: 'pre-line',
};

const addInfoStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#A0A0A0',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.5,
  whiteSpace: 'pre-line',
  maxWidth: '374px',
  marginTop: '10px',
};

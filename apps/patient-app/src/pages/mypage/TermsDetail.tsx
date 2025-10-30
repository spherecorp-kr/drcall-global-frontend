import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';

interface TermsDetailData {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  content: string;
}

export default function TermsDetail() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  // TODO: API에서 약관 상세 정보 가져오기
  const [term] = useState<TermsDetailData>({
    id: id || '1',
    title: '[필수]',
    subtitle: '서비스 이용약관',
    date: '시행일자: 2023년 8월 1일',
    content: `제1장: 총칙

제1조 목적

본 이용약관은 환자가 주식회사 라이프시맨틱스(이하 '회사')가 제공하는 비대면 의료서비스 플랫폼(이하 'DrCall')을 이용함에 있어 환자와 회사의 권리·의무 및 책임사항 등을 규정함을 목적으로 합니다.

제2조 용어의 정의

① 본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
  1. '환자'란 DrCall을 통해 비대면 진료 예약, 진료, 처방전 수령 등을 이용하는 자를 말합니다.
  2. '코디네이터'란 의료기관에서 지정한 자로, 병원 웹페이지 상에서 예약된 진료의 확정 및 취소 등 진료 관리 업무를 수행하는 자를 말합니다.
  3. '의사'란 코디네이터의 확정을 받아 환자를 직접 진료하고 비대면 진료 및 처방전 발급 서비스를 제공하는 의료인을 말합니다.

② 본 약관에서 사용하는 용어의 정의는 관계 법령에서 정하는 바에 따릅니다.

제3조 회사 정보 등의 제공
회사는 다음 각 호의 사항을 환자가 쉽게 알아볼 수 있도록 적절한 방법으로 표시합니다. 다만, 개인정보처리방침과 약관은 연결화면을 통하여 볼 수 있도록 할 수 있습니다.
  1. 회사명 및 대표자명
  2. 사업장 주소 (회원의 불만을 처리할 수 있는 주소 포함)
  3. 전화번호, 이메일주소, Line Official Account
  4. 사업자등록번호
  5. 통신판매업 신고번호
  6. 개인정보처리방침
  7. 서비스 이용약관

<서비스 이용에 따라 자동으로 생성·수집되는 정보>

수집항목

쿠키, 접속 IP 정보, 이용기록, 서비스 이용기록(Log data, 이용시간), 기기정보(제조사, 모델명, 해상도, 앱 구동 속도, 프로세서, OS 버전)

수집목적

회원 관리, 부정이용 및 사기 방지, 서비스 이용 기록 통계 및 분석, 서비스 품질 관리, 신규 서비스 개발

※ 개인정보 및 민감정보의 수집 및 이용에 대한 동의를 거부하실 수 있으나, 동의하지 않는 경우 일부 서비스 제공이 거부되거나 제한될 수 있습니다.`
  });

  const handleBack = () => {
    navigate('/mypage/terms');
  };

  const handleClose = () => {
    navigate('/mypage');
  };

  return (
    <MainLayout
      title={t('mypage.terms')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName=""
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        {/* 제목 */}
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            paddingTop: '1.25rem'
          }}
        >
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1.5rem',
              fontWeight: '600',
              fontFamily: 'Pretendard',
              lineHeight: '1.5'
            }}
          >
            {term.title}
          </div>
          <div
            style={{
              color: '#1F1F1F',
              fontSize: '1.5rem',
              fontWeight: '600',
              fontFamily: 'Pretendard',
              lineHeight: '1.5'
            }}
          >
            {term.subtitle}
          </div>
        </div>

        {/* 날짜 배지 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: '1.25rem'
          }}
        >
          <div
            style={{
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              paddingTop: '0.1875rem',
              paddingBottom: '0.1875rem',
              background: '#F6F6F6',
              borderRadius: '0.25rem',
              color: '#979797',
              fontSize: '0.875rem',
              fontWeight: '400',
              fontFamily: 'Pretendard'
            }}
          >
            {term.date}
          </div>
        </div>

        {/* 본문 내용 */}
        <div
          style={{
            color: '#1F1F1F',
            fontSize: '1rem',
            fontWeight: '400',
            fontFamily: 'Pretendard',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem'
          }}
        >
          {term.content}
        </div>

        {/* 표 */}
        <div
          style={{
            marginLeft: '1.25rem',
            marginRight: '1.25rem',
            marginBottom: '1.25rem',
            border: '1px solid #E0E0E0'
          }}
        >
          {/* 표 헤더 */}
          <div
            style={{
              display: 'flex',
              background: '#F6F6F6',
              borderBottom: '1px solid #E0E0E0'
            }}
          >
            <div
              style={{
                flex: 1,
                padding: '0.625rem',
                color: '#1F1F1F',
                fontSize: '1rem',
                fontWeight: '400',
                fontFamily: 'Pretendard',
                borderRight: '1px solid #E0E0E0'
              }}
            >
              수집항목
            </div>
            <div
              style={{
                flex: 1,
                padding: '0.625rem',
                color: '#1F1F1F',
                fontSize: '1rem',
                fontWeight: '400',
                fontFamily: 'Pretendard'
              }}
            >
              수집목적
            </div>
          </div>

          {/* 표 본문 */}
          <div style={{ display: 'flex' }}>
            <div
              style={{
                flex: 1,
                padding: '0.625rem',
                color: '#1F1F1F',
                fontSize: '0.875rem',
                fontWeight: '400',
                fontFamily: 'Pretendard',
                borderRight: '1px solid #E0E0E0',
                lineHeight: '1.6'
              }}
            >
              쿠키, 접속 IP 정보, 이용기록, 서비스 이용기록(Log data, 이용시간), 기기정보(제조사, 모델명, 해상도, 앱 구동 속도, 프로세서, OS 버전)
            </div>
            <div
              style={{
                flex: 1,
                padding: '0.625rem',
                color: '#1F1F1F',
                fontSize: '0.875rem',
                fontWeight: '400',
                fontFamily: 'Pretendard',
                lineHeight: '1.6'
              }}
            >
              회원 관리, 부정이용 및 사기 방지, 서비스 이용 기록 통계 및 분석, 서비스 품질 관리, 신규 서비스 개발
            </div>
          </div>
        </div>

        {/* 하단 안내문구 */}
        <div
          style={{
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            paddingBottom: '1.25rem',
            color: '#1F1F1F',
            fontSize: '1rem',
            fontWeight: '400',
            fontFamily: 'Pretendard',
            lineHeight: '1.6'
          }}
        >
          ※ 개인정보 및 민감정보의 수집 및 이용에 대한 동의를 거부하실 수 있으나, 동의하지 않는 경우 일부 서비스 제공이 거부되거나 제한될 수 있습니다.
        </div>
      </div>
    </MainLayout>
  );
}

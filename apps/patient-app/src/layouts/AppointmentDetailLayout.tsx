import type { ReactNode } from 'react';
import MainLayout from './MainLayout';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import PageTitle from '@ui/layout/PageTitle';
import Divider from '@ui/layout/Divider';
import PatientBasicInfoSection from '@appointment/shared/sections/PatientBasicInfoSection';
import PatientDetailInfoSection from '@appointment/shared/sections/PatientDetailInfoSection';
import Notice from '@ui/display/Notice';

interface AppointmentDetailLayoutProps {
  // Header
  title: string;
  onBack: () => void;
  onClose: () => void;

  // Page Title
  pageTitle?: string;
  additionalTitleContent?: ReactNode;

  // 커스텀 섹션 (취소 정보 등, 타이틀 바로 아래에 표시)
  customSection?: ReactNode;

  // 예약 정보 섹션
  appointmentInfoSection: ReactNode;

  // 진료 정보 섹션
  treatmentInfoSection: ReactNode;

  // 추가 섹션 (진료 완료 시 AI요약, 처방전 등)
  additionalSections?: ReactNode;

  // 환자 정보
  patientBasicInfo: {
    name: string;
    thaiId: string;
    birthDate: string;
    gender: string;
    phoneNumber: string;
  };
  patientDetailInfo: {
    height?: string;
    weight?: string;
    bloodType?: 'A' | 'B' | 'O' | 'AB';
    alcohol?: '0' | '1~2' | '3+';
    smoking?: '0' | '1~5' | '6+';
    medications?: string;
    personalHistory?: string;
    familyHistory?: string;
  };

  // 유의사항
  noticeItems?: string[];

  // 하단 버튼
  bottomButton?: ReactNode;
  hasBottomButton?: boolean;
}

/**
 * 예약/진료 상세 페이지 공통 레이아웃
 * - AppointmentDetail (예약 대기)
 * - ConfirmedAppointmentDetail (예약 확정)
 * - CompletedConsultationDetail (진료 완료)
 */
export default function AppointmentDetailLayout({
  title,
  onBack,
  onClose,
  pageTitle,
  additionalTitleContent,
  customSection,
  appointmentInfoSection,
  treatmentInfoSection,
  additionalSections,
  patientBasicInfo,
  patientDetailInfo,
  noticeItems,
  bottomButton,
  hasBottomButton = false
}: AppointmentDetailLayoutProps) {
  return (
    <MainLayout
      headerBackground='white'
      title={title}
      onBack={onBack}
      onClose={onClose}
      fullWidth
      contentClassName="p-0"
    >
      <PageContainer hasBottomButton={hasBottomButton}>
        {/* 페이지 타이틀 */}
        {pageTitle && (
          <PageSection padding>
            <PageTitle>{pageTitle}</PageTitle>
            {additionalTitleContent}
          </PageSection>
        )}

        {/* 커스텀 섹션 (취소 정보 등) */}
        {customSection && (
          <PageSection padding>
            {customSection}
          </PageSection>
        )}

        {customSection && <Divider />}

        {/* 예약 정보 섹션 */}
        {appointmentInfoSection}

        <Divider />

        {/* 진료 정보 섹션 */}
        {treatmentInfoSection}

        <Divider />

        {/* 추가 섹션 (진료 완료 시 사용) */}
        {additionalSections}

        {/* 환자 기본 정보 섹션 (읽기 전용) */}
        <PatientBasicInfoSection data={patientBasicInfo} />

        {/* 환자 상세 정보 섹션 (읽기 전용 + 확장 가능) */}
        <PatientDetailInfoSection
          data={patientDetailInfo}
          readOnly
          expandable
          initialExpanded={false}
        />

        {noticeItems && (
          <>
            <Divider />
            {/* 유의사항 */}
            <PageSection padding>
              <Notice items={noticeItems} />
            </PageSection>
          </>
        )}
      </PageContainer>

      {/* 하단 버튼 */}
      {bottomButton}
    </MainLayout>
  );
}

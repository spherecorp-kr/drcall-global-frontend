import { useTranslation } from 'react-i18next';
import PageSection from '@ui/layout/PageSection';
import InfoField from '@ui/display/InfoField';

interface PatientBasicInfo {
  name: string;
  thaiId: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
}

interface PatientBasicInfoSectionProps {
  data: PatientBasicInfo;
}

/**
 * 환자 기본 정보 섹션 컴포넌트
 * - 이름, Thai ID, 생년월일, 성별, 휴대폰 번호
 * - 읽기 전용 모드
 */
export default function PatientBasicInfoSection({
  data
}: PatientBasicInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <PageSection title={t('mypage.patientInfo')} gap="md">
      {/* 이름 */}
      <InfoField
        icon="/assets/icons/user-square.svg"
        label={t('auth.name')}
        value={data.name}
      />

      {/* Thai ID Number */}
      <InfoField
        icon="/assets/icons/ic_Thai ID Number.svg"
        label={t('auth.thaiId')}
        value={data.thaiId}
      />

      {/* 생년월일 */}
      <InfoField
        icon="/assets/icons/ic_gift.svg"
        label={t('auth.birthdate')}
        value={data.birthDate}
      />

      {/* 성별 */}
      <InfoField
        icon="/assets/icons/ic_gender.svg"
        label={t('auth.gender')}
        value={t(data.gender)}
      />

      {/* 휴대폰 번호 */}
      <InfoField
        icon="/assets/icons/ic_mobile.svg"
        label={t('auth.phoneNumber')}
        value={data.phoneNumber}
      />
    </PageSection>
  );
}

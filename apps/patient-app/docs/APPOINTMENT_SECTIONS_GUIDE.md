# 예약 섹션 통일화 가이드

## 📌 개요

예약 생성/상세/수정 페이지에서 사용하는 공통 섹션 컴포넌트 시스템입니다.

### 컴포넌트 계층 구조

```
Level 1: Field Components (필드 단위)
  - InfoField
  - EditableTextInput
  - ToggleButtonGroup
  - TextareaField
  - ImageGalleryField

Level 2: Section Components (섹션 단위)
  - AppointmentInfoSection
  - TreatmentInfoSection
  - PatientBasicInfoSection
  - PatientDetailInfoSection
```

---

## 📁 파일 구조

```
src/
├── components/
│   └── appointment/
│       ├── InfoField.tsx                    # 읽기 전용 정보 필드
│       ├── EditableTextInput.tsx            # 편집 가능 텍스트 입력
│       ├── ToggleButtonGroup.tsx            # 토글 버튼 그룹
│       ├── TextareaField.tsx                # Textarea 필드
│       ├── ImageGalleryField.tsx            # 이미지 갤러리
│       ├── AppointmentInfoSection.tsx       # 예약 정보 섹션
│       ├── TreatmentInfoSection.tsx         # 진료 정보 섹션
│       ├── PatientBasicInfoSection.tsx      # 환자 기본정보 섹션
│       └── PatientDetailInfoSection.tsx     # 환자 상세정보 섹션
└── types/
    └── appointment.ts                        # 타입 정의
```

---

## 🎯 사용 예시

### 1. **AppointmentDetail 페이지 (읽기 전용)**

```tsx
import AppointmentInfoSection from '@/components/appointment/AppointmentInfoSection';
import TreatmentInfoSection from '@/components/appointment/TreatmentInfoSection';
import PatientBasicInfoSection from '@/components/appointment/PatientBasicInfoSection';
import PatientDetailInfoSection from '@/components/appointment/PatientDetailInfoSection';
import Divider from '@/components/common/Divider';

function AppointmentDetail() {
  const appointmentData = {
    appointmentNumber: '1111111111',
    appointmentType: '일반 예약',
    hospital: {
      name: 'พระราม9 (Praram9 Hospital)',
      phone: '01-123-456'
    },
    dateTime: '10/05/2023 14:01~14:15',
    doctor: 'ดร.วิทยาวันเพ็ญ (Dr.Wittaya Wanpen)'
  };

  const treatmentData = {
    symptoms: '감기기운이 있고 머리가 아파요.',
    symptomImages: ['https://...', 'https://...']
  };

  const patientBasicData = {
    name: '홍길동',
    thaiId: '0-0000-00000-00-0',
    birthDate: '14/04/1998',
    gender: '남자',
    phoneNumber: '062-1234-1234'
  };

  const patientDetailData = {
    height: '176 cm',
    weight: '65 kg',
    bloodType: 'B',
    alcohol: '1~2',
    smoking: '1~5',
    medications: '3개월 전부터 탈모 약을 복용 중입니다.',
    personalHistory: '14살에 심장 수술을 받은 적이 있습니다.',
    familyHistory: '집안 대대로 심장병이 있습니다.'
  };

  return (
    <PageContainer hasBottomButton>
      {/* 예약 정보 */}
      <AppointmentInfoSection data={appointmentData} />

      <Divider />

      {/* 진료 정보 */}
      <TreatmentInfoSection
        symptoms={treatmentData.symptoms}
        symptomImages={treatmentData.symptomImages}
        readOnly
      />

      <Divider />

      {/* 환자 기본 정보 */}
      <PatientBasicInfoSection data={patientBasicData} />

      {/* 환자 상세 정보 (확장 가능) */}
      <PatientDetailInfoSection
        data={patientDetailData}
        readOnly
        expandable
        initialExpanded={false}
      />
    </PageContainer>
  );
}
```

---

### 2. **AppointmentEdit 페이지 (편집 가능)**

```tsx
import { useState } from 'react';
import AppointmentInfoSection from '@/components/appointment/AppointmentInfoSection';
import TreatmentInfoSection from '@/components/appointment/TreatmentInfoSection';
import PatientBasicInfoSection from '@/components/appointment/PatientBasicInfoSection';
import PatientDetailInfoSection from '@/components/appointment/PatientDetailInfoSection';

function AppointmentEdit() {
  const [symptoms, setSymptoms] = useState('감기기운이 있고...');
  const [symptomImages, setSymptomImages] = useState<string[]>([]);
  const [detailInfo, setDetailInfo] = useState({
    height: '183',
    weight: '62',
    bloodType: 'A' as 'A' | 'B' | 'O' | 'AB',
    alcohol: '0' as '0' | '1~2' | '3+',
    smoking: '0' as '0' | '1~5' | '6+',
    medications: '',
    personalHistory: '',
    familyHistory: ''
  });

  const handleDateTimeEdit = () => {
    console.log('Edit date/time');
  };

  const handleImageAdd = () => {
    console.log('Add image');
  };

  const handleImageRemove = (index: number) => {
    setSymptomImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDetailInfoChange = (field: string, value: string) => {
    setDetailInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageContainer hasBottomButton background="gray">
      {/* 예약 정보 (수정 버튼 포함) */}
      <AppointmentInfoSection
        data={appointmentData}
        onDateTimeEdit={handleDateTimeEdit}
        showEditButton
      />

      <Divider />

      {/* 진료 정보 (편집 가능) */}
      <TreatmentInfoSection
        symptoms={symptoms}
        symptomImages={symptomImages}
        onSymptomsChange={setSymptoms}
        onImageAdd={handleImageAdd}
        onImageRemove={handleImageRemove}
        readOnly={false}
      />

      <Divider />

      {/* 환자 기본 정보 (읽기 전용) */}
      <PatientBasicInfoSection data={patientBasicData} />

      {/* 환자 상세 정보 (편집 가능 + 확장) */}
      <PatientDetailInfoSection
        data={detailInfo}
        onChange={handleDetailInfoChange}
        readOnly={false}
        expandable
      />
    </PageContainer>
  );
}
```

---

### 3. **Questionnaire 페이지 (환자 정보 입력)**

```tsx
function Questionnaire() {
  const [detailInfo, setDetailInfo] = useState({...});

  return (
    <PageContainer>
      {/* 환자 기본 정보 (읽기 전용) */}
      <PatientBasicInfoSection data={patientBasicData} />

      <Divider />

      {/* 환자 상세 정보 (항상 펼쳐진 상태, 편집 가능) */}
      <PatientDetailInfoSection
        data={detailInfo}
        onChange={(field, value) => setDetailInfo(prev => ({ ...prev, [field]: value }))}
        readOnly={false}
        expandable={false}  // 항상 펼쳐짐
      />
    </PageContainer>
  );
}
```

---

## 🔧 컴포넌트 API

### **AppointmentInfoSection**

```tsx
interface AppointmentInfoSectionProps {
  data: {
    appointmentNumber: string;
    appointmentType: string;
    hospital: { name: string; phone: string };
    dateTime?: string;
    doctor?: string;
  };
  onDateTimeEdit?: () => void;      // 날짜/의사 수정 버튼 핸들러
  showEditButton?: boolean;          // 수정 버튼 표시 여부
}
```

**사용 시나리오:**
- ✅ AppointmentDetail: `readOnly`
- ✅ AppointmentEdit: `showEditButton={true}, onDateTimeEdit` 제공
- ✅ Confirmation: `readOnly`

---

### **TreatmentInfoSection**

```tsx
interface TreatmentInfoSectionProps {
  symptoms: string;
  symptomImages: string[];
  onSymptomsChange?: (value: string) => void;
  onImageAdd?: () => void;
  onImageRemove?: (index: number) => void;
  readOnly?: boolean;                // 읽기 전용 모드
  maxImages?: number;                // 최대 이미지 수 (기본: 10)
}
```

**사용 시나리오:**
- ✅ AppointmentDetail: `readOnly={true}`
- ✅ AppointmentEdit: `readOnly={false}`, 핸들러 제공
- ✅ SymptomsInput: `readOnly={false}`, 핸들러 제공

---

### **PatientBasicInfoSection**

```tsx
interface PatientBasicInfoSectionProps {
  data: {
    name: string;
    thaiId: string;
    birthDate: string;
    gender: string;
    phoneNumber: string;
  };
}
```

**특징:**
- 항상 읽기 전용
- 모든 페이지에서 동일한 방식으로 표시

---

### **PatientDetailInfoSection**

```tsx
interface PatientDetailInfoSectionProps {
  data: {
    height?: string;
    weight?: string;
    bloodType?: 'A' | 'B' | 'O' | 'AB';
    alcohol?: '0' | '1~2' | '3+';
    smoking?: '0' | '1~5' | '6+';
    medications?: string;
    personalHistory?: string;
    familyHistory?: string;
  };
  onChange?: (field: string, value: string) => void;
  readOnly?: boolean;                // 읽기 전용 모드
  expandable?: boolean;              // 확장/축소 버튼 표시 여부
  initialExpanded?: boolean;         // 초기 확장 상태
}
```

**사용 시나리오:**
- ✅ AppointmentDetail: `readOnly={true}, expandable={true}`
- ✅ AppointmentEdit: `readOnly={false}, expandable={true}`
- ✅ Questionnaire: `readOnly={false}, expandable={false}` (항상 펼쳐짐)

---

## 🎨 디자인 토큰

모든 컴포넌트는 통일된 디자인 토큰을 사용합니다:

### 색상
- Primary: `#00A0D2`
- Text Primary: `#1F1F1F`
- Text Secondary: `#8A8A8A`
- Text Disabled: `#BBBBBB`
- Border: `#D9D9D9`
- Background Gray: `#F5F5F5`

### 간격 (rem)
- 작은 간격: `0.5rem` (8px)
- 기본 간격: `0.625rem` (10px)
- 중간 간격: `1.25rem` (20px)
- 큰 간격: `2.5rem` (40px)

### 폰트 크기 (rem)
- Small: `0.75rem` (12px)
- Label: `0.875rem` (14px)
- Body: `1rem` (16px)
- Section Title: `1.125rem` (18px)
- Page Title: `1.5rem` (24px)

---

## ✅ 장점

### 1. **일관성**
- 모든 예약 관련 페이지가 동일한 디자인 시스템 사용
- 사용자 경험 향상

### 2. **유지보수성**
- 중복 코드 제거 (기존 900줄 → 100줄 이하로 축소)
- 한 곳에서 수정하면 모든 페이지에 반영

### 3. **확장성**
- 새로운 필드 추가 시 컴포넌트만 수정
- 다른 페이지에도 쉽게 적용 가능

### 4. **타입 안전성**
- TypeScript 타입 정의로 컴파일 타임 에러 감지
- 자동 완성 지원

---

## 🔄 마이그레이션 가이드

### Before (기존 코드)

```tsx
{/* 900줄의 중복 코드 */}
<div style={{ padding: '20px', background: 'white', ... }}>
  <div style={{ color: '#1F1F1F', fontSize: '18px', ... }}>
    예약 정보
  </div>
  <div style={{ display: 'flex', gap: '10px' }}>
    <img src="/assets/icons/ic_number.svg" />
    <div style={{ flex: 1 }}>
      <div style={{ color: '#8A8A8A', fontSize: '14px' }}>예약 반호</div>
      <div style={{ color: '#1F1F1F', fontSize: '16px' }}>1111111111</div>
    </div>
  </div>
  {/* ... 반복되는 필드 코드 ... */}
</div>
```

### After (통일화된 코드)

```tsx
{/* 10줄의 간결한 코드 */}
<AppointmentInfoSection data={appointmentData} />
```

**코드 감소율: ~90%**

---

## 📝 체크리스트

페이지 리팩토링 시 확인 사항:

- [ ] `AppointmentInfoSection` 사용
- [ ] `TreatmentInfoSection` 사용
- [ ] `PatientBasicInfoSection` 사용
- [ ] `PatientDetailInfoSection` 사용
- [ ] `Divider`로 섹션 구분
- [ ] `PageContainer`로 전체 래핑
- [ ] 타입 정의 import (`types/appointment.ts`)
- [ ] rem 단위 사용 확인
- [ ] readOnly/editable 모드 확인

---

## 🚀 다음 단계

1. AppointmentEdit.tsx 리팩토링
2. AppointmentDetail.tsx 리팩토링
3. Confirmation.tsx 리팩토링
4. SymptomsInput.tsx 리팩토링
5. Questionnaire.tsx 리팩토링

각 페이지를 리팩토링하면서 동일한 섹션이 동일한 컴포넌트를 사용하도록 변경합니다.

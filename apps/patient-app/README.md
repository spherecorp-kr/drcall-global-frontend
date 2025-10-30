# Patient App

환자용 애플리케이션 프론트엔드

## 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Tailwind CSS 4** - 스타일링
- **React Router** - 라우팅
- **React Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증
- **Axios** - HTTP 클라이언트
- **i18next** - 다국어 지원

## 프로젝트 구조

```
src/
├── components/         # 재사용 가능한 컴포넌트
│   └── common/        # 공통 컴포넌트 (Button, InputField 등)
├── layouts/           # 레이아웃 컴포넌트
│   ├── MainLayout.tsx           # 메인 레이아웃 (헤더 + 콘텐츠)
│   └── BottomButtonLayout.tsx   # 하단 버튼 레이아웃
├── pages/             # 페이지 컴포넌트
│   └── auth/          # 인증 관련 페이지
├── services/          # API 서비스
├── types/             # TypeScript 타입 정의
├── App.tsx            # 메인 앱 컴포넌트
└── main.tsx           # 엔트리 포인트
```

## 디자인 시스템

### 레이아웃 가이드

모든 페이지는 다음 레이아웃 기준을 따릅니다:

- **최대 너비**: 414px (모바일 기준)
- **헤더 높이**: 60px (시스템 바 제거)
- **콘텐츠 패딩**: 24px (상하좌우 모두)
- **하단 버튼 여백**: 90px

### 색상 팔레트

```css
/* Primary */
--primary-blue: #00a0d2;
--primary-red: #fc0606;
--primary-disabled: #bbbbbb;

/* Text */
--text-primary: #1f1f1f;
--text-secondary: #41444b;
--text-tertiary: #6e6e6e;
--text-label: #8a8a8a;
--text-placeholder: #bbbbbb;

/* Background */
--bg-primary: #fafafa;
--bg-white: #ffffff;

/* Border */
--border-default: #d9d9d9;
--border-light: #f0f0f0;
```

### 타이포그래피

```css
/* Headings */
h1: 24px / SemiBold / #1f1f1f / line-height: 1.4
h2: 18px / Medium / #000000

/* Body */
body: 16px / Regular / #6e6e6e / line-height: 1.5
input: 16px / Regular / #41444b

/* Labels */
label: 14px / Regular / #8a8a8a
```

### 간격 (Spacing)

```css
/* 컴포넌트 간 기본 간격 */
gap-sm: 12px (0.75rem)
gap-md: 20px (1.25rem)
gap-lg: 32px (2rem)

/* 섹션 간 간격 */
section-gap: 32px (mb-8)
```

## 시작하기

### 필수 조건

- Node.js 18+
- npm 또는 yarn

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 필요한 값을 설정합니다:

```bash
cp .env.example .env
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 주요 기능

### 휴대폰 본인 인증

- 휴대폰 번호 입력
- SMS 인증 코드 전송
- 인증 코드 검증
- 타이머 기능 (3분)
- 재전송 기능

## 레이아웃 시스템

### MainLayout
메인 페이지 레이아웃 컴포넌트

```tsx
<MainLayout title="페이지 제목" onClose={handleClose}>
  {/* 페이지 콘텐츠 */}
</MainLayout>
```

**특징:**
- 자동으로 24px 패딩 적용
- 헤더 60px (시스템 바 없음)
- 스크롤 가능한 콘텐츠 영역
- 하단 버튼을 위한 90px 여백

**Props:**
- `title`: 헤더 제목
- `showHeader`: 헤더 표시 여부 (기본: true)
- `onClose`: 닫기 버튼 클릭 핸들러

### BottomButtonLayout
하단 고정 버튼 레이아웃

```tsx
<BottomButtonLayout>
  <Button>버튼</Button>
</BottomButtonLayout>
```

## 컴포넌트

### Button
공통 버튼 컴포넌트
- **Primary (활성)**: `#00a0d2` (파란색)
- **Disabled (비활성)**: `#bbbbbb` (회색)

```tsx
<Button onClick={handleClick} disabled={!isValid}>
  Click Me
</Button>
```

### InputField
공통 입력 필드 컴포넌트

```tsx
<InputField
  label="라벨"
  type="text"
  value={value}
  onChange={handleChange}
  placeholder="입력해주세요"
  error="에러 메시지"
  rightElement={<span>우측 요소</span>}
/>
```

**특징:**
- 라벨, 입력 필드, 하단 선 자동 구성
- 에러 상태 처리
- 우측 요소 지원 (타이머, Verified 등)

## API 연동

API 서비스는 `src/services/` 디렉토리에 정의되어 있습니다.

- `api.ts` - Axios 인스턴스 및 인터셉터 설정
- `authService.ts` - 인증 관련 API

## 새 페이지 추가하기

1. `src/pages/` 디렉토리에 새 페이지 컴포넌트 생성
2. `MainLayout`과 `BottomButtonLayout` 사용
3. `src/App.tsx`에 라우트 추가

```tsx
import { MainLayout, BottomButtonLayout } from '../../layouts';
import Button from '../../components/common/Button';

export default function NewPage() {
  return (
    <MainLayout title="새 페이지" onClose={handleClose}>
      <div className="flex flex-col gap-8">
        <h2 className="text-[24px] font-semibold text-[#1f1f1f]">
          제목
        </h2>
        
        <p className="text-[16px] text-[#6e6e6e]">
          내용
        </p>
      </div>
      
      <BottomButtonLayout>
        <Button>확인</Button>
      </BottomButtonLayout>
    </MainLayout>
  );
}
```

## 코드 스타일

- ESLint 설정
- Prettier (권장)
- TypeScript strict 모드
- Tailwind CSS 유틸리티 클래스

## 라이선스

Private

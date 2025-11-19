# Frontend Onboarding Guide

## 1. 필수 도구
- Node.js 20+ (LTS)
- pnpm 9+ (`npm install -g pnpm`)
- VS Code (권장) + ESLint/Prettier Extension

## 2. 환경 변수
각 앱 디렉토리(`apps/patient-app` 등)에 `.env` 파일을 생성해야 합니다.
```env
VITE_API_URL=http://localhost:18081/api/v1
VITE_SENDBIRD_APP_ID=...
```

## 3. 실행 방법

### 의존성 설치
프로젝트 루트(`frontend/`)에서 실행합니다.
```bash
pnpm install
```

### 앱 실행
```bash
# 환자용 앱 (http://localhost:5173)
pnpm --filter patient-app dev

# 병원용 앱 (http://localhost:5174)
pnpm --filter hospital-app dev
```

### 빌드
```bash
pnpm -r build
```

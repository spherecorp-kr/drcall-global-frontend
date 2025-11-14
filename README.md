# DrCall Global Frontend

> DrCall Global 헬스케어 플랫폼 프론트엔드

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm)](https://pnpm.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 개요

pnpm workspace 기반 모노레포로 Patient App과 Hospital App을 관리합니다.

**배포 환경**
- **Patient App**: https://patient.dev.drcall.global
- **Hospital App**: https://hospital.dev.drcall.global

## 🚀 빠른 시작

```bash
# 설치
pnpm install

# 개발 서버 실행
pnpm dev:patient    # 환자용 앱
pnpm dev:hospital   # 병원용 앱

# 빌드
pnpm build:patient
pnpm build:hospital
```

## 🏗️ 프로젝트 구조

```
drcall-global-frontend/
├── apps/
│   ├── patient-app/      # 환자용 모바일 앱
│   └── hospital-app/     # 병원용 데스크톱 앱
├── packages/
│   └── shared-lib/       # 공유 라이브러리
└── docs/                 # 문서
```

## 🛠️ 기술 스택

### 코어
- React 19 + TypeScript 5.9
- Vite 6
- pnpm 9

### UI/스타일링
- TailwindCSS
- shadcn/ui
- Radix UI

### 상태 관리
- Zustand (클라이언트)
- TanStack Query (서버)

### 기타
- react-i18next (다국어)
- Axios (HTTP)
- MSW (모킹)

## 🚢 배포

### 자동 배포

```bash
# DEV 배포 (patch 버전 자동 증가)
git push origin develop

# PROD 배포 (minor 버전 자동 증가)
git push origin main
```

**자동화 프로세스:**
1. 버전 자동 증가
2. GitHub Release 생성
3. S3/CloudFront 배포
4. 배포 완료 (2-3분)

### 배포 환경

| 환경 | Patient App | Hospital App |
|------|-------------|--------------|
| **DEV** | [patient.dev.drcall.global](https://patient.dev.drcall.global) | [hospital.dev.drcall.global](https://hospital.dev.drcall.global) |
| **STG** | patient.stg.drcall.global | hospital.stg.drcall.global |
| **PROD** | patient.drcall.global | hospital.drcall.global |

### GitHub Secrets 설정

다음 시크릿이 설정되어 있어야 합니다:

```bash
# AWS 인증
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

# Patient App ({ENV} = DEV, STG, PROD)
PATIENT_APP_{ENV}_API_URL
PATIENT_APP_{ENV}_CLOUDFRONT_ID
PATIENT_APP_{ENV}_S3_BUCKET

# Hospital App
HOSPITAL_APP_{ENV}_API_URL
HOSPITAL_APP_{ENV}_CLOUDFRONT_ID
HOSPITAL_APP_{ENV}_S3_BUCKET
```

### 배포 프로세스

1. **체크아웃**: 코드 클론
2. **설치**: Node.js 20 + pnpm 9 설치
3. **빌드**: 환경변수 주입 후 빌드
4. **S3 업로드**: 정적 파일 업로드
5. **캐시 무효화**: CloudFront 캐시 삭제

**캐시 전략:**
- JS/CSS/이미지: 1년 캐시
- index.html: 캐시 없음

## 📝 커밋 규칙

Conventional Commits 사용 (commitlint 자동 검증)

```bash
# 형식
<type>(<scope>): <subject>

# 예시
feat: add appointment cancellation feature
fix: resolve login page crash on mobile
docs: update README
```

**Type**: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

## 📚 문서

- [버전 관리 가이드](docs/VERSIONING.md)
- [커밋 컨벤션](docs/COMMIT_CONVENTION.md)

## 📦 관련 저장소

- [Infrastructure](https://github.com/spherecorp-kr/drcall-global-infra)
- [Backend](https://github.com/spherecorp-kr/drcall-global-backend)

## 📄 라이선스

Private - Sphere Corp Internal Use Only

---

**Last Updated**: 2025-10-30

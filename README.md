# DrCall Global Frontend

> DrCall Global 헬스케어 플랫폼 프론트엔드 모노레포

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-Private-red)](LICENSE)

## 📋 개요

DrCall Global의 프론트엔드 애플리케이션을 pnpm workspace 기반 모노레포로 관리합니다.

**주요 앱:**
- **Patient App**: 환자용 모바일 웹 애플리케이션
- **Hospital App**: 병원 직원용 데스크톱 웹 애플리케이션

## 🏗️ 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    DrCall Global Frontend                    │
│                                                               │
│  ┌──────────────────┐              ┌──────────────────┐     │
│  │  Patient App     │              │  Hospital App    │     │
│  │  (Mobile)        │              │  (Desktop)       │     │
│  │                  │              │                  │     │
│  │  - 예약 접수     │              │  - 환자 관리     │     │
│  │  - 의사 채팅     │              │  - 스케줄링      │     │
│  │  - 의료 기록     │              │  - 의료 기록     │     │
│  │  - LINE/Telegram │              │  - 대시보드      │     │
│  └──────────────────┘              └──────────────────┘     │
│           │                                 │                │
│           └─────────────┬───────────────────┘                │
│                         │                                    │
│                ┌────────▼─────────┐                          │
│                │  Shared Library  │                          │
│                │                  │                          │
│                │  - API Client    │                          │
│                │  - Services      │                          │
│                │  - Utils         │                          │
│                │  - Types         │                          │
│                └──────────────────┘                          │
│                         │                                    │
│                ┌────────▼─────────┐                          │
│                │    Backend API    │                          │
│                └──────────────────┘                          │
└─────────────────────────────────────────────────────────────┘

                         ↓ Deploy ↓

┌─────────────────────────────────────────────────────────────┐
│                     AWS Infrastructure                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  CloudFront + S3                                   │    │
│  │  - patient.dev.drcall.global                      │    │
│  │  - hospital.dev.drcall.global                     │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 기술 스택

### Frontend Framework & Tools
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.0 | UI 라이브러리 |
| TypeScript | 5.9 | 타입 안정성 |
| Vite | 6.0 | 빌드 도구 |
| pnpm | 9.0 | 패키지 매니저 |

### UI & Styling
| 기술 | 용도 |
|------|------|
| TailwindCSS | Utility-first CSS 프레임워크 |
| shadcn/ui | UI 컴포넌트 라이브러리 |
| Radix UI | 접근성 우선 헤드리스 컴포넌트 |

### State Management & Data Fetching
| 기술 | 용도 |
|------|------|
| Zustand | 클라이언트 상태 관리 |
| TanStack Query (React Query) | 서버 상태 관리 및 캐싱 |
| Axios | HTTP 클라이언트 |

### 다국어 & Routing
| 기술 | 용도 |
|------|------|
| react-i18next | 다국어 지원 (한국어, 영어, 태국어) |
| React Router | 클라이언트 라우팅 |

### Development Tools
| 기술 | 용도 |
|------|------|
| ESLint | 코드 린팅 |
| Prettier | 코드 포맷팅 |
| commitlint | 커밋 메시지 검증 |
| Husky | Git hooks |
| MSW | API 모킹 (Patient App) |

### Infrastructure & Deployment
| 서비스 | 용도 |
|--------|------|
| AWS S3 | 정적 파일 호스팅 |
| AWS CloudFront | CDN 및 HTTPS |
| GitHub Actions | CI/CD 자동화 |
| GitHub Releases | 릴리즈 노트 관리 |

## 📁 프로젝트 구조

```
drcall-global-frontend/
├── apps/                           # 애플리케이션
│   ├── hospital-app/              # 병원용 앱
│   │   ├── src/
│   │   │   ├── components/       # UI 컴포넌트
│   │   │   ├── pages/            # 페이지 컴포넌트
│   │   │   ├── services/         # API 서비스
│   │   │   ├── stores/           # Zustand 스토어
│   │   │   └── locales/          # i18n 번역
│   │   └── package.json
│   │
│   └── patient-app/               # 환자용 앱
│       ├── src/
│       │   ├── components/       # UI 컴포넌트
│       │   ├── pages/            # 페이지 컴포넌트
│       │   ├── services/         # API 서비스
│       │   ├── stores/           # Zustand 스토어
│       │   ├── locales/          # i18n 번역
│       │   └── mocks/            # MSW 모킹
│       └── package.json
│
├── packages/                       # 공유 패키지
│   └── shared-lib/                # 공유 라이브러리
│       ├── src/
│       │   ├── api/              # API 클라이언트
│       │   ├── services/         # 공유 서비스 (SendBird 등)
│       │   ├── utils/            # 유틸리티 함수
│       │   ├── types/            # TypeScript 타입
│       │   └── config/           # 설정 파일
│       └── package.json
│
├── scripts/                        # 자동화 스크립트
│   └── release.sh                 # 릴리즈 스크립트
│
├── docs/                           # 문서
│   ├── VERSIONING.md              # 버전 관리 가이드
│   └── COMMIT_CONVENTION.md       # 커밋 컨벤션
│
├── .github/
│   └── workflows/                 # GitHub Actions
│       ├── deploy-patient-app.yml
│       └── deploy-hospital-app.yml
│
├── package.json                    # 루트 package.json
├── pnpm-workspace.yaml             # pnpm 워크스페이스 설정
├── commitlint.config.js            # commitlint 설정
└── README.md                       # 이 파일
```

## 🎯 애플리케이션 상세

### Patient App (환자용 앱)

**플랫폼**: 모바일 우선 웹 애플리케이션

**주요 기능**:
- 의사 예약 접수 및 관리
- 실시간 채팅 (SendBird 통합)
- 의료 기록 조회
- 다중 채널 지원 (LINE, Telegram, WhatsApp)
- 다국어 지원 (한국어, 영어, 태국어)

**기술 스택**: React 19, TypeScript, Vite, TailwindCSS, React Query, MSW

### Hospital App (병원용 앱)

**플랫폼**: 데스크톱 반응형 웹 애플리케이션

**주요 기능**:
- 환자 정보 관리
- 예약 스케줄링
- 의료 기록 작성 및 조회
- 분석 대시보드
- 알림 관리

**기술 스택**: React 19, TypeScript, Vite, TailwindCSS, React Query, Zustand

## 🛠️ 개발 환경 설정

### 필수 요구사항

- Node.js >= 18
- pnpm >= 9

### 설치

```bash
# 저장소 클론
git clone https://github.com/spherecorp-kr/drcall-global-frontend.git
cd drcall-global-frontend

# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
# 환자용 앱
pnpm dev:patient

# 병원용 앱
pnpm dev:hospital
```

### 빌드

```bash
# 환자용 앱
pnpm build:patient

# 병원용 앱
pnpm build:hospital

# 모든 앱
pnpm build:all
```

### 린트

```bash
# 환자용 앱
pnpm lint:patient

# 병원용 앱
pnpm lint:hospital

# 모든 앱
pnpm lint:all
```

## 📦 공유 라이브러리 (@drcall/shared-lib)

### 포함 내용

| 카테고리 | 내용 |
|----------|------|
| **API Client** | Axios 인스턴스, 인터셉터 |
| **Services** | SendBird 채팅 서비스 |
| **Utils** | 에러 핸들링, 날짜 포맷팅, 정렬, 국가 코드, cn 함수 |
| **Types** | 공유 TypeScript 타입 정의 |
| **Config** | i18n, React Query 설정 |

### 사용 예시

```typescript
// API 클라이언트
import { apiClient } from '@drcall/shared-lib';

// 유틸리티
import { cn, formatDate, handleError } from '@drcall/shared-lib/utils';

// 서비스
import { chatService } from '@drcall/shared-lib/services';

// 타입
import type { User, Appointment } from '@drcall/shared-lib/types';
```

## 🚢 배포 및 버전 관리

### 완전 자동화된 CI/CD

브랜치에 푸시만 하면 자동으로 버전 관리 및 배포가 진행됩니다.

```bash
# develop 브랜치 → DEV 환경 자동 배포
git push origin develop
# ↓
# 1. patch 버전 자동 증가 (v1.0.0 → v1.0.1-dev)
# 2. GitHub Release 생성 (Pre-release)
# 3. S3/CloudFront 배포
# 4. 배포 완료 (2-3분)

# main 브랜치 → PROD 환경 자동 배포
git push origin main
# ↓
# 1. minor 버전 자동 증가 (v1.0.0 → v1.1.0)
# 2. GitHub Release 생성 (Latest)
# 3. S3/CloudFront 배포
# 4. 배포 완료 (2-3분)
```

### 버전 관리 규칙

| 브랜치 | 환경 | 버전 증가 | 예시 |
|--------|------|-----------|------|
| `develop` | DEV | patch | v1.0.0 → v1.0.1-dev |
| `main` | PROD | minor | v1.0.0 → v1.1.0 |

### 배포 환경

| 앱 | DEV | STG | PROD |
|----|-----|-----|------|
| **Patient App** | [patient.dev.drcall.global](https://patient.dev.drcall.global) | [patient.stg.drcall.global](https://patient.stg.drcall.global) | [patient.drcall.global](https://patient.drcall.global) |
| **Hospital App** | [hospital.dev.drcall.global](https://hospital.dev.drcall.global) | [hospital.stg.drcall.global](https://hospital.stg.drcall.global) | [hospital.drcall.global](https://hospital.drcall.global) |

### GitHub Releases

모든 배포는 자동으로 GitHub Releases에 기록됩니다:
- https://github.com/spherecorp-kr/drcall-global-frontend/releases
- 커밋 히스토리 자동 생성
- 배포 URL 링크 포함
- 환경별 구분 (Pre-release / Latest)

자세한 내용: [docs/VERSIONING.md](docs/VERSIONING.md)

## 📝 커밋 컨벤션

이 프로젝트는 **Conventional Commits** 스펙을 따르며, commitlint로 자동 검증합니다.

### 형식

```
<type>(<scope>): <subject>
```

### Type 종류

| Type | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 | feat: add appointment cancellation |
| `fix` | 버그 수정 | fix: resolve login page crash |
| `docs` | 문서 변경 | docs: update README |
| `refactor` | 리팩토링 | refactor: extract payment logic |
| `perf` | 성능 개선 | perf: optimize image loading |
| `test` | 테스트 추가/수정 | test: add auth service tests |
| `build` | 빌드 시스템 변경 | build: update vite to v6 |
| `ci` | CI 설정 변경 | ci: add deploy workflow |
| `chore` | 기타 변경 | chore: update dependencies |

### 검증 규칙

- Subject 최소 10자, 최대 100자
- 소문자로 시작, 마침표 금지
- 커밋 시 자동 검증

자세한 내용: [docs/COMMIT_CONVENTION.md](docs/COMMIT_CONVENTION.md)

## 🔄 개발 워크플로우

```
1. 이슈 확인 또는 기능 정의
   ↓
2. feature 브랜치 생성
   git checkout -b feat/appointment-feature
   ↓
3. 코드 작성 및 테스트
   ↓
4. 커밋 (자동 검증)
   git commit -m "feat: add appointment cancellation feature"
   ↓
5. develop 브랜치로 PR
   ↓
6. 코드 리뷰 및 머지
   ↓
7. 자동 배포 (DEV)
   ↓
8. 검증 후 main 브랜치로 PR
   ↓
9. 자동 배포 (PROD)
```

## 📚 관련 문서

- [버전 관리 가이드](docs/VERSIONING.md)
- [커밋 컨벤션](docs/COMMIT_CONVENTION.md)

## 📞 관련 저장소

- **Infrastructure**: [spherecorp-kr/drcall-global-infra](https://github.com/spherecorp-kr/drcall-global-infra)
- **Backend**: [spherecorp-kr/drcall-global-backend](https://github.com/spherecorp-kr/drcall-global-backend)

## 📄 라이선스

Private - Sphere Corp Internal Use Only

---

**마지막 업데이트**: 2025-10-30
**관리자**: Frontend Team

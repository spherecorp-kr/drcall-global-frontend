# DrCall Global Frontend Monorepo

> Frontend applications for DrCall Global healthcare platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm)](https://pnpm.io/)

Frontend monorepo for DrCall Global applications using pnpm workspaces.

## Tech Stack

### Core
- **React 19** - UI library with latest features
- **TypeScript 5.9** - Type safety
- **Vite 6** - Fast build tool and dev server
- **pnpm 9** - Fast, disk space efficient package manager

### Styling
- **TailwindCSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript linting
- **MSW (Mock Service Worker)** - API mocking

### Infrastructure
- **AWS CloudFront** - CDN and HTTPS
- **AWS S3** - Static hosting
- **GitHub Actions** - CI/CD automation

## Structure

```
drcall-global-frontend/
├── apps/                     # Applications
│   ├── hospital-app/        # Hospital management application (Desktop)
│   └── patient-app/         # Patient mobile application
├── packages/                 # Shared packages
│   └── shared-lib/          # Shared utilities, services, and types
├── package.json             # Root package.json with workspace config
└── pnpm-workspace.yaml      # pnpm workspace configuration
```

## Setup

### Prerequisites
- Node.js >= 18
- pnpm >= 9

### Installation

```bash
# Install all dependencies
pnpm install
```

## Development

### Run Applications

```bash
# Run hospital app
pnpm dev:hospital

# Run patient app
pnpm dev:patient
```

### Build Applications

```bash
# Build hospital app
pnpm build:hospital

# Build patient app
pnpm build:patient

# Build all apps
pnpm build:all
```

### Lint

```bash
# Lint hospital app
pnpm lint:hospital

# Lint patient app
pnpm lint:patient

# Lint all apps
pnpm lint:all
```

## Shared Library (@drcall/shared-lib)

The shared library contains:

- **API Client**: Axios instance with interceptors
- **Services**: Chat service (SendBird integration)
- **Utils**:
  - Error handling
  - Validation utilities
  - Date formatting
  - Sorting utilities
  - Country codes
  - Tailwind class merging (cn)
- **Types**: Shared TypeScript types
- **Config**: i18n and React Query configurations

### Usage in Apps

```typescript
// Import from shared-lib
import { apiClient, cn, formatDate } from '@drcall/shared-lib';
import { chatService } from '@drcall/shared-lib/services';
import { handleError } from '@drcall/shared-lib/utils';
```

## Apps Overview

### Hospital App
- **Purpose**: Hospital staff management interface
- **Platform**: Desktop (responsive web)
- **Key Features**:
  - Patient management
  - Appointment scheduling
  - Medical records
  - Analytics dashboard
- **Tech Stack**: React 19, TypeScript, Vite, TailwindCSS, React Query, Zustand

### Patient App
- **Purpose**: Patient mobile application
- **Platform**: Mobile-first web application
- **Key Features**:
  - Book appointments
  - Chat with doctors
  - View medical records
  - Multi-channel support (LINE, Telegram, WhatsApp)
- **Tech Stack**: React 19, TypeScript, Vite, TailwindCSS, React Query, MSW

## Development Workflow

1. Make changes in apps or shared-lib
2. If shared code is modified, rebuild shared-lib: `cd packages/shared-lib && pnpm build`
3. Apps will automatically pick up changes via workspace linking
4. Test changes in respective apps
5. Commit and push

## Deployment & Versioning

**완전 자동화된 배포** - 브랜치에 푸시만 하면 자동으로 버전 관리 및 배포됩니다.

### Automated Deployment

```bash
# develop 브랜치 푸시 → DEV 자동 배포
git push origin develop
# → patch 버전 자동 증가 (v1.0.0 → v1.0.1-dev)
# → GitHub Release 생성 (Pre-release)
# → S3/CloudFront 배포

# main 브랜치 푸시 → PROD 자동 배포
git push origin main
# → minor 버전 자동 증가 (v1.0.0 → v1.1.0)
# → GitHub Release 생성 (Latest)
# → S3/CloudFront 배포
```

### Versioning Rules

| Branch | Environment | Version Bump | Example |
|--------|-------------|--------------|---------|
| `develop` | DEV | patch | v1.0.0 → v1.0.1-dev |
| `main` | PROD | minor | v1.0.0 → v1.1.0 |

### GitHub Releases

모든 배포는 https://github.com/spherecorp-kr/drcall-global-frontend/releases 에 자동 기록됩니다.

### Deployed URLs

| App | DEV | STG | PROD |
|-----|-----|-----|------|
| **Patient** | [patient.dev.drcall.global](https://patient.dev.drcall.global) | [patient.stg.drcall.global](https://patient.stg.drcall.global) | [patient.drcall.global](https://patient.drcall.global) |
| **Hospital** | [hospital.dev.drcall.global](https://hospital.dev.drcall.global) | [hospital.stg.drcall.global](https://hospital.stg.drcall.global) | [hospital.drcall.global](https://hospital.drcall.global) |

자세한 내용: [docs/VERSIONING.md](docs/VERSIONING.md)

## Notes

- Each app maintains its own git history from migration
- Shared code should only contain truly reusable utilities
- App-specific code (UI components, business logic) stays in respective apps
- channel-specific utilities (LINE, Telegram, etc.) remain in patient-app only

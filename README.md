# DrCall Global - Frontend

DrCall Global의 프론트엔드 저장소입니다. React 기반의 모노레포(pnpm workspace)로 구성되어 있습니다.

## 📚 문서 (Documentation)

상세한 문서는 `docs/` 디렉토리에 있습니다.

- **[시작하기 (Onboarding)](docs/ONBOARDING.md)**: 개발 환경 설정 및 실행 가이드
- **[아키텍처 (Architecture)](docs/ARCHITECTURE.md)**: 모노레포 구조 및 컴포넌트 설계
- **[컨벤션 (Conventions)](docs/CONVENTIONS.md)**: 코드 작성 규칙

## 🚀 기술 스택

- **Core**: React 19, TypeScript 5.x, Vite 7
- **State**: TanStack Query, Zustand
- **Style**: TailwindCSS, shadcn/ui
- **Package Manager**: pnpm

## ⚡️ 빠른 실행

```bash
# 의존성 설치
pnpm install

# 환자용 앱 실행
pnpm --filter patient-app dev
```

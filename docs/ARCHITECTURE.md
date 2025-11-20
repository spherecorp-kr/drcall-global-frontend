# Frontend Architecture

## 🏗 모노레포 구조

pnpm workspace를 사용하여 여러 앱과 패키지를 관리합니다.

```
frontend/
├── apps/                  # 실행 가능한 애플리케이션
│   ├── patient-app/       # 환자용 모바일 웹
│   ├── hospital-app/      # 병원용 데스크톱 웹
│   └── admin-app/         # 관리자 대시보드
└── packages/              # 공유 라이브러리
    └── shared-lib/        # 공통 컴포넌트, API 클라이언트, 유틸리티
```

## 🧩 주요 설계 원칙

### 1. Shared Library (`packages/shared-lib`)
- **재사용성**: 여러 앱에서 공통으로 사용하는 컴포넌트(Button, Input 등)와 로직(API 호출, 포맷팅)은 반드시 이곳에 정의합니다.
- **의존성 관리**: 앱은 `shared-lib`를 의존하며, `shared-lib`은 비즈니스 로직을 최소화하여 순수하게 유지합니다.

### 2. 상태 관리 (State Management)
- **Server State**: `TanStack Query`를 사용하여 서버 데이터 캐싱 및 동기화를 처리합니다.
- **Client State**: `Zustand`를 사용하여 전역 UI 상태(테마, 모달 등)를 관리합니다.

### 3. 스타일링 (Styling)
- **TailwindCSS**: 유틸리티 퍼스트 접근 방식으로 스타일링합니다.
- **shadcn/ui**: Radix UI 기반의 재사용 가능한 컴포넌트 시스템을 구축했습니다.

## 🔄 데이터 흐름
1. 컴포넌트 마운트 -> `useQuery` 호출
2. `shared-lib/api`의 Axios 인스턴스를 통해 백엔드 요청
3. 응답 데이터를 캐싱하고 UI 렌더링

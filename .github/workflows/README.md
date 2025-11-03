# GitHub Actions Workflows

DrCall Global Frontend의 CI/CD 파이프라인 문서입니다.

## 📋 전체 파이프라인 흐름

```
PR 생성
    ↓
[pr-build-check.yml] Lint + Build 체크
    ↓
✅ buildExpected Status Check 통과
    ↓
PR 승인 + 머지
    ↓
┌─────────────────────────────────┐
│  develop 브랜치에 머지          │
│  ↓                              │
│  [deploy-patient-app.yml]       │
│  [deploy-hospital-app.yml]      │
│  ↓                              │
│  DEV 환경 배포                  │
│  - patient.dev.drcall.global    │
│  - hospital.dev.drcall.global   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  main 브랜치에 머지             │
│  ↓                              │
│  [deploy-patient-app.yml]       │
│  [deploy-hospital-app.yml]      │
│  ↓                              │
│  버전 자동 증가 (minor)         │
│  태그 생성 (v1.x.x)             │
│  GitHub Release 생성            │
│  ↓                              │
│  PROD 환경 배포                 │
│  - patient.prod.drcall.global   │
│  - hospital.prod.drcall.global  │
└─────────────────────────────────┘
```

## 🔧 Workflows

### 1. PR Build Check (`pr-build-check.yml`)

**트리거:**
- Pull Request → `main`, `develop` 브랜치
- 경로: `apps/**`, `packages/**`, `package.json`, `pnpm-lock.yaml`

**작업:**
- pnpm 의존성 설치
- ESLint 검사 (`pnpm run lint:all`)
- 빌드 검사 (`pnpm run build:all`)

**Status Check 이름:** `buildExpected`

**중요:** GitHub branch protection에서 `buildExpected` status check를 필수로 설정해야 자동 머지가 가능합니다.

### 2. Deploy Patient App (`deploy-patient-app.yml`)

**트리거:**
- Push → `main`, `develop` 브랜치
- 경로: `apps/patient-app/**`, `packages/**`
- 수동 실행 (`workflow_dispatch`)

**환경별 배포:**
- `develop` → **DEV** 환경
  - 버전: patch 증가 (v1.0.x-dev)
  - URL: https://patient.dev.drcall.global

- `main` → **PROD** 환경
  - 버전: minor 증가 (v1.x.0)
  - URL: https://patient.prod.drcall.global
  - GitHub Release 생성

**배포 과정:**
1. 버전 자동 증가 및 태그 생성
2. 릴리즈 노트 자동 생성
3. 빌드 (Vite)
4. S3 업로드
5. CloudFront 캐시 무효화

### 3. Deploy Hospital App (`deploy-hospital-app.yml`)

**트리거:**
- Push → `main`, `develop` 브랜치
- 경로: `apps/hospital-app/**`, `packages/**`
- 수동 실행 (`workflow_dispatch`)

**환경별 배포:**
- `develop` → **DEV** 환경
  - URL: https://hospital.dev.drcall.global

- `main` → **PROD** 환경
  - URL: https://hospital.prod.drcall.global

**배포 과정:**
1. 환경 결정 (dev/prod)
2. 빌드 (Vite)
3. S3 업로드
4. CloudFront 캐시 무효화

### 4. Deploy Frontend (`deploy-frontend.yml`)

**트리거:**
- Push → `main` 브랜치
- 경로: `frontend/**`
- Tags: `v*`, `v*-stg`

**작업:**
- 모든 frontend 앱 빌드 및 배포 (patient-app, hospital-app, admin-app)
- S3 + CloudFront 배포

### 5. Build and Push (`build-and-push.yml`)

**트리거:**
- Push → `main` 브랜치
- Tags: `v*`, `v*-stg`

**작업:**
- 백엔드 서비스 Docker 이미지 빌드
- Amazon ECR 푸시

## 🔐 Required Secrets

### AWS
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### Patient App
- `PATIENT_APP_DEV_API_URL`
- `PATIENT_APP_STG_API_URL`
- `PATIENT_APP_PROD_API_URL`
- `PATIENT_APP_DEV_CLOUDFRONT_ID`
- `PATIENT_APP_STG_CLOUDFRONT_ID`
- `PATIENT_APP_PROD_CLOUDFRONT_ID`

### Hospital App
- `HOSPITAL_APP_DEV_API_URL`
- `HOSPITAL_APP_STG_API_URL`
- `HOSPITAL_APP_PROD_API_URL`
- `HOSPITAL_APP_DEV_CLOUDFRONT_ID`
- `HOSPITAL_APP_STG_CLOUDFRONT_ID`
- `HOSPITAL_APP_PROD_CLOUDFRONT_ID`

### 선택사항
- `SLACK_WEBHOOK_URL` (배포 알림용)

## ⚙️ Branch Protection 설정

### develop 브랜치
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - Required check: **buildExpected**
- ✅ Require branches to be up to date before merging

### main 브랜치
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - Required check: **buildExpected**
- ✅ Require branches to be up to date before merging
- ✅ Include administrators

## 📝 사용 예시

### PR 생성 → 자동 머지
```bash
# feature 브랜치에서 작업
git checkout -b feature/new-feature

# 변경사항 커밋
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# GitHub에서 PR 생성 (develop 브랜치로)
# → pr-build-check.yml 자동 실행
# → buildExpected 체크 통과
# → PR 승인 후 자동 머지
# → deploy-*-app.yml 실행으로 DEV 환경 자동 배포
```

### DEV → PROD 승격
```bash
# develop → main PR 생성
# → buildExpected 체크 통과
# → PR 승인 후 머지
# → 버전 자동 증가 (v1.x.0)
# → GitHub Release 자동 생성
# → PROD 환경 자동 배포
```

### 수동 배포
```bash
# GitHub Actions 페이지에서
# Deploy Patient App 또는 Deploy Hospital App workflow 선택
# → Run workflow 클릭
# → 환경 선택 (dev/stg/prod)
# → Run workflow
```

## 🐛 트러블슈팅

### "buildExpected — Waiting for status to be reported"
**원인:** PR workflow의 job 이름과 branch protection의 required check 이름 불일치

**해결:**
- `pr-build-check.yml`의 job ID가 `buildExpected`인지 확인
- GitHub Settings → Branches → Branch protection rules에서 required check가 `buildExpected`인지 확인

### 배포 실패
**확인사항:**
1. AWS credentials 설정 확인
2. S3 bucket 존재 여부 확인
3. CloudFront Distribution ID 정확성 확인
4. 환경변수 (VITE_API_BASE_URL 등) 설정 확인

### 버전 충돌
**원인:** 동시에 여러 PR이 머지되어 버전 충돌 발생

**해결:**
- `[skip ci]` 커밋 메시지로 버전 bump 건너뛰기
- 수동으로 package.json 버전 조정 후 재배포

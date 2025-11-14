# 버전 관리 가이드 (Version Management Guide)

DrCall Global Frontend의 **완전 자동화된** 버전 관리 및 배포 가이드입니다.

## 개요

이 프로젝트는 **Semantic Versioning (SemVer)**을 따르며, **GitHub Actions가 자동으로 버전을 관리**합니다.

### 버전 형식

```
v{major}.{minor}.{patch}[-{environment}]
```

**예시:**
- `v1.0.0` - 프로덕션 배포
- `v1.1.0-dev` - 개발 환경 배포
- `v1.2.0-stg` - 스테이징 배포

## 빠른 시작 (완전 자동화)

### 1. 코드 변경 후 브랜치에 푸시만 하세요

```bash
# 개발 환경에 배포 (자동 patch 버전 증가)
git add .
git commit -m "fix: 로그인 버그 수정"
git push origin develop

# 프로덕션 배포 (자동 minor 버전 증가)
git checkout main
git merge develop
git push origin main
```

**끝!** GitHub Actions가 자동으로:
1. 버전 증가 (develop → patch, main → minor)
2. Git 태그 생성
3. GitHub Release 생성 (릴리즈 노트 포함)
4. 빌드 및 배포

### 2. GitHub Releases에서 릴리즈 노트 확인

https://github.com/spherecorp-kr/drcall-global-frontend/releases

- 커밋 히스토리 자동 생성
- 배포된 URL 링크
- 환경별 릴리즈 구분 (Pre-release/Latest)

## 자동 버전 증가 규칙

### develop 브랜치 → DEV 환경
- **자동 patch 버전 증가**: v1.0.0 → v1.0.1-dev
- **Pre-release로 표시**: GitHub Releases에서 노란색 태그
- **배포 URL**: https://patient.dev.drcall.global

### main 브랜치 → PROD 환경
- **자동 minor 버전 증가**: v1.0.0 → v1.1.0
- **Latest로 표시**: GitHub Releases에서 녹색 태그
- **배포 URL**: https://patient.drcall.global

## 수동 릴리스 (선택 사항)

자동화를 사용하지 않고 수동으로 릴리스하려면:

```bash
# 패치 릴리스
./scripts/release.sh patch dev

# 마이너 릴리스
./scripts/release.sh minor stg

# 메이저 릴리스
./scripts/release.sh major prod
```

## 버전 유형 (Semantic Versioning)

| 버전 유형 | 설명 | 예시 |
|---------|------|------|
| **MAJOR** | 하위 호환성을 깨는 변경 | API 변경, 주요 아키텍처 변경 |
| **MINOR** | 하위 호환성을 유지하는 기능 추가 | 새로운 기능, 개선사항 |
| **PATCH** | 버그 수정 및 작은 변경 | 버그 수정, 텍스트 수정 |

## 환경별 배포 전략

### DEV 환경

- **목적**: 개발 및 테스트
- **태그 형식**: `v1.0.0-dev`
- **자동 배포**: `develop` 브랜치 푸시 시
- **수동 배포**: `pnpm release:patch` (기본값은 STG)

```bash
./scripts/release.sh patch dev
```

### STG 환경

- **목적**: 프로덕션 전 검증
- **태그 형식**: `v1.0.0-stg`
- **배포 방법**: 수동 릴리스만

```bash
./scripts/release.sh minor stg
```

### PROD 환경

- **목적**: 실서비스 운영
- **태그 형식**: `v1.0.0` (환경 접미사 없음)
- **자동 배포**: `main` 브랜치 푸시 시
- **수동 배포**: 릴리스 스크립트

```bash
./scripts/release.sh major prod
```

## 자동 배포 프로세스

### 1. 코드 변경 사항 커밋 및 푸시

```bash
# 개발 환경 배포
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin develop

# 프로덕션 배포
git checkout main
git merge develop
git push origin main
```

### 2. GitHub Actions 자동 실행

브랜치에 푸시하면 GitHub Actions가 자동으로:

1. **버전 자동 증가**
   - develop → patch 버전 (v1.0.0 → v1.0.1-dev)
   - main → minor 버전 (v1.0.0 → v1.1.0)

2. **Git 태그 생성 및 푸시**
   - 태그 형식: v{version}[-{env}]
   - 커밋 메시지에 `[skip ci]` 포함하여 무한 루프 방지

3. **GitHub Release 생성**
   - 커밋 히스토리 자동 포함
   - 배포 URL 링크
   - Pre-release (DEV) / Latest (PROD) 구분

4. **빌드 & 배포**
   - pnpm 설치 및 의존성 설치
   - Vite 빌드
   - S3 업로드
   - CloudFront 캐시 무효화

5. **배포 완료** - 2-3분 내 완료

## 배포 모니터링

### GitHub Actions 확인

https://github.com/spherecorp-kr/drcall-global-frontend/actions

### 배포된 앱 확인

**Patient App:**
- DEV: https://patient.dev.drcall.global
- STG: https://patient.stg.drcall.global
- PROD: https://patient.drcall.global

**Hospital App:**
- DEV: https://hospital.dev.drcall.global
- STG: https://hospital.stg.drcall.global
- PROD: https://hospital.drcall.global

## 예시 시나리오

### 시나리오 1: 버그 수정 후 DEV 배포

```bash
# 1. 버그 수정 커밋
git add .
git commit -m "fix: 로그인 페이지 오류 수정"

# 2. DEV 환경에 패치 릴리스
./scripts/release.sh patch dev

# 3. 배포 확인
# v1.0.1-dev 태그 생성됨
# GitHub Actions에서 자동 배포
# https://patient.dev.drcall.global 에서 확인
```

### 시나리오 2: 새 기능 추가 후 STG 배포

```bash
# 1. 기능 개발 커밋
git add .
git commit -m "feat: 예약 알림 기능 추가"

# 2. STG 환경에 마이너 릴리스
./scripts/release.sh minor stg

# 3. STG에서 테스트
# v1.1.0-stg 태그 생성됨
# https://patient.stg.drcall.global 에서 검증
```

### 시나리오 3: PROD 배포

```bash
# 1. STG 검증 완료 후
# 2. PROD 환경에 릴리스
./scripts/release.sh minor prod

# 3. PROD 배포 확인
# v1.1.0 태그 생성됨 (환경 접미사 없음)
# https://patient.drcall.global 에서 확인
```

## CHANGELOG

모든 변경사항은 `CHANGELOG.md`에 자동으로 기록됩니다.

### 자동 생성 내용

- **버전 및 날짜**: `## [v1.0.0] - 2025-10-30`
- **커밋 목록**: 마지막 태그 이후 모든 커밋
- **커밋 해시**: 추적을 위한 짧은 해시

### 수동 편집

필요시 CHANGELOG.md를 수동으로 편집하여 더 자세한 설명을 추가할 수 있습니다:

```markdown
## [v1.1.0] - 2025-11-01

### Added
- 예약 알림 기능 (SMS, 이메일)
- 환자 대시보드 개선

### Fixed
- 로그인 페이지 오류 수정
- 모바일 레이아웃 버그 수정
```

## 트러블슈팅

### 미커밋 변경사항이 있을 때

```bash
Error: You have uncommitted changes
Please commit or stash your changes first
```

**해결책:**
```bash
# 변경사항 커밋
git add .
git commit -m "your message"

# 또는 임시 저장
git stash
```

### 태그가 이미 존재할 때

```bash
fatal: tag 'v1.0.0-dev' already exists
```

**해결책:**
```bash
# 기존 태그 삭제 (신중하게!)
git tag -d v1.0.0-dev
git push origin :refs/tags/v1.0.0-dev

# 또는 다음 버전으로 릴리스
./scripts/release.sh patch dev  # v1.0.1-dev
```

### GitHub Actions 실패

**확인 사항:**
1. Secrets이 올바르게 설정되어 있는지
2. S3 버킷이 존재하는지
3. CloudFront ID가 올바른지
4. AWS 자격 증명이 유효한지

## 베스트 프랙티스

### 1. 명확한 커밋 메시지

```bash
# 좋은 예
git commit -m "feat: 예약 취소 기능 추가"
git commit -m "fix: 날짜 선택 버그 수정"

# 나쁜 예
git commit -m "update"
git commit -m "bug fix"
```

### 2. 릴리스 전 체크리스트

- [ ] 모든 테스트 통과
- [ ] 로컬에서 빌드 성공
- [ ] 변경사항 커밋 완료
- [ ] 올바른 버전 유형 선택
- [ ] 올바른 환경 선택

### 3. 환경별 검증 순서

```
DEV → STG → PROD
```

항상 하위 환경에서 검증 후 상위 환경으로 배포

### 4. 긴급 수정 (Hotfix)

프로덕션 긴급 수정 시:

```bash
# 1. main 브랜치 체크아웃
git checkout main

# 2. 핫픽스 브랜치 생성
git checkout -b hotfix/critical-bug

# 3. 수정 및 커밋
git commit -m "fix: 크리티컬 버그 긴급 수정"

# 4. 즉시 PROD 배포
./scripts/release.sh patch prod

# 5. develop에도 머지
git checkout develop
git merge hotfix/critical-bug
```

## 참고 자료

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [AWS CloudFront](https://aws.amazon.com/cloudfront/)

---

**마지막 업데이트**: 2025-10-30
**관리자**: DevOps Team

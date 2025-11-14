# Commit Convention

DrCall Global Frontend 프로젝트의 커밋 메시지 작성 규칙입니다.

## 개요

이 프로젝트는 **Conventional Commits** 스펙을 따르며, **commitlint**로 자동 검증합니다.

## 기본 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 필수 요소

- **type**: 커밋의 타입 (필수)
- **subject**: 커밋의 제목 (필수, 최소 10자, 최대 100자)

### 선택 요소

- **scope**: 변경 범위 (선택)
- **body**: 상세 설명 (선택, 한 줄 최대 100자)
- **footer**: 이슈 참조 등 (선택, 한 줄 최대 100자)

## Type 종류

| Type | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | feat: add appointment cancellation feature |
| `fix` | 버그 수정 | fix: resolve login page crash on mobile |
| `docs` | 문서만 변경 | docs: update API documentation |
| `style` | 코드 포맷팅, 세미콜론 누락 등 | style: format code with prettier |
| `refactor` | 코드 리팩토링 (기능 변경 없음) | refactor: extract payment logic to service |
| `perf` | 성능 개선 | perf: optimize image loading |
| `test` | 테스트 추가 또는 수정 | test: add unit tests for auth service |
| `build` | 빌드 시스템, 패키지 변경 | build: update vite to v6.0.0 |
| `ci` | CI 구성 파일 및 스크립트 변경 | ci: add automated deployment workflow |
| `chore` | 기타 변경사항 | chore: update dependencies |
| `revert` | 이전 커밋 되돌리기 | revert: revert feat: add payment feature |

## Subject 작성 규칙

### 필수 규칙

1. **영문 소문자로 시작** (대문자 금지)
   ```bash
   # Good
   feat: add user authentication

   # Bad
   feat: Add user authentication
   ```

2. **마침표 없음** (`.`로 끝나지 않음)
   ```bash
   # Good
   fix: resolve memory leak in chat service

   # Bad
   fix: resolve memory leak in chat service.
   ```

3. **최소 10자 이상, 최대 100자 이하**
   ```bash
   # Good
   feat: implement appointment booking validation

   # Bad (너무 짧음)
   feat: fix bug

   # Bad (너무 김)
   feat: this is a very long commit message that exceeds the maximum length limit of 100 characters which is not allowed
   ```

4. **명령형 동사 사용** (과거형 금지)
   ```bash
   # Good
   fix: resolve login issue
   refactor: extract common logic

   # Bad
   fix: resolved login issue
   refactor: extracted common logic
   ```

### Scope (선택)

변경 범위를 명시할 때 사용합니다.

```bash
feat(auth): add social login
fix(appointment): resolve date picker bug
docs(readme): update installation guide
```

**일반적인 scope 예시:**
- `auth` - 인증 관련
- `appointment` - 예약 관련
- `chat` - 채팅 관련
- `ui` - UI 컴포넌트
- `api` - API 통신
- `payment` - 결제 관련
- `i18n` - 다국어 관련

## 실제 사용 예시

### 간단한 커밋

```bash
git commit -m "feat: add appointment cancellation button"
```

### Scope를 포함한 커밋

```bash
git commit -m "fix(auth): resolve token expiration handling"
```

### Body를 포함한 커밋

```bash
git commit -m "feat: implement payment integration

- Add Stripe payment gateway
- Support credit card and bank transfer
- Add payment history page
- Add refund functionality"
```

### Breaking Change를 포함한 커밋

```bash
git commit -m "feat: change API response format

BREAKING CHANGE: API response structure has changed.
Old: { data: {...} }
New: { success: true, data: {...}, error: null }"
```

### 이슈 참조를 포함한 커밋

```bash
git commit -m "fix: resolve appointment date validation

Closes #123
Fixes #456"
```

## 실전 예시

### 신규 기능 추가

```bash
git commit -m "feat: add multi-language support for patient app

- Add i18n configuration
- Add Korean, English, Thai translations
- Add language selector component
- Update all pages with translation keys"
```

### 버그 수정

```bash
git commit -m "fix: resolve infinite loop in appointment list

The appointment list was causing infinite re-renders
when filtering by date. Fixed by memoizing the filter function."
```

### 리팩토링

```bash
git commit -m "refactor: extract appointment validation logic

Moved validation logic from component to separate service
for better reusability and testability."
```

### 문서 업데이트

```bash
git commit -m "docs: add deployment guide for production environment"
```

### 의존성 업데이트

```bash
git commit -m "build: update react and vite to latest versions

- React 18.2.0 -> 19.0.0
- Vite 5.0.0 -> 6.0.0"
```

## 검증 규칙

commitlint가 자동으로 다음을 검증합니다:

- Type이 허용된 타입인지
- Type과 Scope가 소문자인지
- Subject가 대문자로 시작하지 않는지
- Subject가 마침표로 끝나지 않는지
- Subject가 최소 10자 이상인지
- Subject가 100자를 초과하지 않는지
- Body 한 줄이 100자를 초과하지 않는지

## 커밋이 거부될 때

커밋이 규칙을 위반하면 다음과 같은 에러가 표시됩니다:

```bash
⧗   input: fix: bug
✖   subject may not be less than 10 characters [subject-min-length]
✖   found 1 problems, 0 warnings

husky - commit-msg hook exited with code 1 (error)
```

이 경우 커밋 메시지를 수정하여 다시 커밋하세요:

```bash
git commit -m "fix: resolve login page crash on mobile devices"
```

## 팁

### 1. 원자적 커밋 (Atomic Commits)

하나의 커밋은 하나의 목적만 가져야 합니다.

```bash
# Good - 각각 별도 커밋
git commit -m "feat: add user profile page"
git commit -m "fix: resolve navbar styling issue"

# Bad - 여러 목적을 하나의 커밋에
git commit -m "feat: add user profile page and fix navbar"
```

### 2. 의미 있는 커밋 메시지

커밋 메시지만 보고도 변경 내용을 이해할 수 있어야 합니다.

```bash
# Good
git commit -m "fix: resolve payment gateway timeout issue"

# Bad
git commit -m "fix: update code"
git commit -m "fix: change something"
```

### 3. 현재형, 명령형 사용

```bash
# Good
feat: add feature
fix: resolve bug
docs: update readme

# Bad
feat: added feature
fix: fixed bug
docs: updated readme
```

### 4. 구체적으로 작성

```bash
# Good
fix: resolve date picker not showing correct timezone

# Bad
fix: fix bug
fix: update component
```

## 자동 검증 비활성화

**권장하지 않지만**, 긴급한 경우 `--no-verify` 플래그로 검증을 건너뛸 수 있습니다:

```bash
git commit -m "emergency fix" --no-verify
```

단, 이는 코드 품질 저하를 초래할 수 있으므로 최소한으로 사용하세요.

## 참고 자료

- [Conventional Commits](https://www.conventionalcommits.org/)
- [commitlint](https://commitlint.js.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

---

**마지막 업데이트**: 2025-10-30

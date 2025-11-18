# Hospital App - E2E API 연동 가이드

## 현재 상태

✅ **프론트엔드 E2E 테스트 완료**
- 로그인 페이지 렌더링 확인
- 빈 필드 유효성 검증
- 잘못된 credentials 에러 처리
- AuthProvider 정상 작동 확인

⏳ **백엔드 API 연동 대기 중**
- 실제 로그인 성공 테스트
- 세션 유지 확인 테스트

---

## API 연동 방법

### 1. 백엔드 서비스 실행

#### 1.1 인프라 실행 (MySQL, Redis, Kafka)
```bash
cd /Users/muhkeun/IdeaProjects/drcall-global/backend
docker-compose up -d
```

#### 1.2 Admin Service 실행 (병원/의사/코디네이터 인증)
```bash
cd /Users/muhkeun/IdeaProjects/drcall-global/backend
./gradlew :admin-service:bootRun
```

**포트:** http://localhost:18086

#### 1.3 서비스 확인
```bash
# Health check
curl http://localhost:18086/actuator/health

# 응답 예시:
# {"status":"UP"}
```

---

### 2. 테스트 계정 생성

#### 2.1 DB 접속
```bash
docker-compose exec mysql mysql -u root -p
# 비밀번호 입력

USE drcall_admin_db;
```

#### 2.2 테스트 계정 생성 (예시)
```sql
-- 병원 생성
INSERT INTO hospital (id, external_id, name_en, name_th, name_ko, created_at, updated_at)
VALUES (1, 'hosp_test001', 'Test Hospital', 'โรงพยาบาลทดสอบ', '테스트 병원', NOW(), NOW());

-- 코디네이터 계정 생성 (예시 - 실제 스키마에 맞게 수정 필요)
INSERT INTO coordinator (id, external_id, username, password_hash, name, hospital_id, created_at, updated_at)
VALUES (1, 'coord_test001', 'test_coordinator', '$2a$10$...', 'Test Coordinator', 1, NOW(), NOW());
```

**참고:** 실제 password_hash는 BCrypt로 생성해야 합니다.

---

### 3. 환경변수 설정

#### 3.1 Frontend 환경변수 확인
`/Users/muhkeun/IdeaProjects/drcall-global/frontend/apps/hospital-app/.env.development`

```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:18086

# E2E Test Credentials
TEST_COORDINATOR_USERNAME=test_coordinator
TEST_COORDINATOR_PASSWORD=test_password123
```

#### 3.2 환경변수 적용
```bash
# .env.development 파일에 테스트 계정 정보 추가 후 재시작
cd /Users/muhkeun/IdeaProjects/drcall-global/frontend/apps/hospital-app
pnpm dev
```

---

### 4. E2E 테스트 활성화

#### 4.1 테스트 파일 수정
`e2e/login.spec.ts` 파일에서 `test.skip`을 `test`로 변경:

```typescript
// Before
test.skip('올바른 credentials로 로그인 성공', async ({ page }) => {

// After
test('올바른 credentials로 로그인 성공', async ({ page }) => {
```

```typescript
// Before
test.skip('로그인 후 세션 유지 확인', async ({ page, context }) => {

// After
test('로그인 후 세션 유지 확인', async ({ page, context }) => {
```

#### 4.2 E2E 테스트 실행
```bash
# 백엔드 서비스 실행 후
pnpm test:e2e

# 또는 UI 모드로 실행 (디버깅)
pnpm test:e2e:ui
```

---

## API 엔드포인트

### 로그인 API
**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "username": "test_coordinator",
  "password": "test_password123",
  "rememberMe": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 604800,
    "user": {
      "id": 1,
      "userType": "COORDINATOR",
      "name": "Test Coordinator",
      "hospitalId": 1,
      "hospitalName": "Test Hospital",
      "role": "COORDINATOR"
    }
  },
  "message": null,
  "error": null
}
```

### 현재 사용자 정보 조회
**Endpoint:** `GET /api/v1/auth/me`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userType": "COORDINATOR",
    "name": "Test Coordinator",
    "hospitalId": 1,
    "hospitalName": "Test Hospital",
    "role": "COORDINATOR"
  }
}
```

---

## 트러블슈팅

### 1. CORS 에러
**증상:** 브라우저 콘솔에 CORS 에러 발생

**해결:**
```yaml
# backend/admin-service/src/main/resources/application.yml
cors:
  allowed-origins:
    - http://localhost:5173
    - http://localhost:5174
```

### 2. 401 Unauthorized
**증상:** 로그인 후 다른 API 호출 시 401 에러

**원인:**
- accessToken이 localStorage에 저장되지 않음
- Authorization 헤더가 전송되지 않음

**확인:**
```javascript
// 브라우저 개발자 도구 Console
localStorage.getItem('accessToken')
```

### 3. 백엔드 서비스 실행 실패
**증상:** Gradle bootRun 실패

**확인:**
```bash
# MySQL 실행 확인
docker-compose ps mysql

# Redis 실행 확인
docker-compose ps redis

# Kafka 실행 확인
docker-compose ps kafka

# 로그 확인
docker-compose logs -f mysql
```

---

## 체크리스트

### Backend
- [ ] MySQL 컨테이너 실행 중
- [ ] Redis 컨테이너 실행 중
- [ ] Kafka 컨테이너 실행 중
- [ ] admin-service 실행 중 (포트 18086)
- [ ] 테스트 계정 생성 완료
- [ ] CORS 설정 확인

### Frontend
- [ ] .env.development 파일 생성
- [ ] VITE_API_BASE_URL 설정 (http://localhost:18086)
- [ ] TEST_COORDINATOR_USERNAME 설정
- [ ] TEST_COORDINATOR_PASSWORD 설정
- [ ] test.skip → test 변경
- [ ] 개발 서버 재시작

### E2E Test
- [ ] pnpm test:e2e 실행 성공
- [ ] 로그인 성공 테스트 통과
- [ ] 세션 유지 테스트 통과
- [ ] 대시보드 리다이렉트 확인

---

## 참고 문서
- Backend 로컬 개발: `/Users/muhkeun/IdeaProjects/drcall-global/.claude/CLAUDE.md`
- Admin Service: `/Users/muhkeun/IdeaProjects/drcall-global/backend/admin-service/`
- Playwright 문서: https://playwright.dev

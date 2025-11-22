# 배포 체크리스트 및 테스트 시나리오

## 🚀 배포 준비 체크리스트 (내일 2시 배포 목표)

### 📋 1. 백엔드 API 개발 (High Priority)

#### Patient Service
- [ ] `GET /api/v1/auth/profile` - 프로필 조회 구현
- [ ] `PUT /api/v1/auth/profile` - 프로필 수정 구현
- [ ] DeliveryAddressController 확인 (CRUD 완료 여부)
- [ ] PHRController 확인 (CRUD 완료 여부)
- [ ] 기존 Controller 통합 테스트

#### Payment Service
- [ ] `POST /api/v1/payments/charge` - Omise Charge 생성 API 구현
  - Omise.js 토큰 받아서 Charge 생성
  - PromptPay QR 코드 생성 지원
  - 배송지 정보 포함 (처방전 있을 경우)
- [ ] Omise API 테스트 계정 확인
- [ ] Webhook 수신 테스트

#### Appointment Service
- [ ] 진료 완료 API에 진료 기록 필드 확인 및 추가
  - diagnosis (진단명)
  - prescription (처방전: medications array)
  - medicalNotes (진료 메모)
  - requiresDelivery (배송 필요 여부)
- [ ] Kafka Event 발행 확인 (appointment.completed)

#### Shipping Service
- [ ] Controller 파일 확인 및 API 완성도 검증
- [ ] Shippop API 테스트 계정 확인
- [ ] 배송비 견적 API 테스트
- [ ] 배송 추적 API 테스트
- [ ] Webhook 수신 테스트

#### Video Call Service
- [ ] Controller 파일 확인 및 API 완성도 검증
- [ ] Sendbird 세션 생성 테스트
- [ ] Access Token 발급 테스트
- [ ] Room 입장/퇴장 플로우 테스트

#### Translation Service
- [ ] Controller 파일 확인 및 API 완성도 검증
- [ ] WebSocket 연결 테스트
- [ ] STT (Speech-to-Text) 테스트
- [ ] 번역 API 테스트 (OpenAI or Google Translate)

#### Messaging Service
- [ ] Chat API 확인 (Sendbird Proxy)
- [ ] SSE 스트림 테스트
- [ ] SMS 발송 테스트 (Infobank)

#### Hospital Service
- [ ] Replica 업데이트 API 확인
  - 예약 수정 (의사 배정, 시간 변경)
  - 예약 취소
- [ ] Doctor CRUD API 확인
- [ ] Dashboard API 구현 (`GET /api/v1/dashboard/stats`)

---

### 🖥️ 2. 프론트엔드 개발

#### 환자앱 (Patient App)
- [ ] 모든 페이지 라우팅 테스트
- [ ] 인증 플로우 테스트 (OTP → 프로필 등록)
- [ ] 예약 생성 플로우 테스트 (STANDARD/QUICK)
- [ ] 결제 플로우 테스트 (Omise.js 통합)
- [ ] 화상 진료 테스트 (Sendbird Video Call)
- [ ] 채팅 테스트 (Sendbird Chat)
- [ ] 약 배송 추적 테스트
- [ ] PHR 관리 테스트
- [ ] 다국어 지원 테스트 (한국어, 영어, 태국어)
- [ ] 반응형 디자인 테스트 (모바일, 태블릿, 데스크톱)
- [ ] 에러 처리 테스트 (401, 403, 404, 500)

#### 병원앱 (Hospital App)
- [ ] 모든 페이지 라우팅 테스트
- [ ] 로그인 플로우 테스트 (ID/PW)
- [ ] 대시보드 표시 테스트
- [ ] 예약 관리 테스트 (Waiting/Confirmed/Completed/Cancelled)
- [ ] 환자 등록 테스트
- [ ] 의사 관리 테스트
- [ ] 화상 진료 테스트 (의사 입장)
- [ ] 진료 기록 작성 테스트
- [ ] 처방전 발급 테스트
- [ ] 채팅 테스트 (코디네이터 → 환자)
- [ ] 다국어 지원 테스트
- [ ] 에러 처리 테스트

---

### 🗄️ 3. 데이터베이스 및 마이그레이션

- [ ] 모든 서비스의 DB 스키마 확인
- [ ] Flyway/Liquibase 마이그레이션 스크립트 확인
- [ ] 초기 데이터 (Seed Data) 준비
  - 테스트 병원 계정
  - 테스트 의사 계정
  - 테스트 코디네이터 계정
  - 테스트 환자 계정 (선택적)
- [ ] DB 백업 계획 수립

---

### 🔌 4. 외부 서비스 연동

#### Sendbird
- [ ] Sendbird App ID 확인
- [ ] Sendbird API Token 확인
- [ ] Chat 채널 생성 테스트
- [ ] Video Call Room 생성 테스트
- [ ] Webhook 설정

#### Omise (Payment Gateway)
- [ ] Omise 테스트 계정 Public Key 확인
- [ ] Omise 테스트 계정 Secret Key 확인
- [ ] 테스트 카드 정보 확인
- [ ] PromptPay QR 생성 테스트
- [ ] Webhook 설정 (결제 성공/실패)

#### Shippop (Shipping)
- [ ] Shippop API Key 확인
- [ ] 테스트 병원 주소 등록
- [ ] 배송비 견적 API 테스트
- [ ] 배송 예약 API 테스트
- [ ] Webhook 설정 (배송 상태 변경)

#### Infobank (SMS)
- [ ] Infobank API Key 확인
- [ ] SMS 발송 테스트 (태국 전화번호)
- [ ] OTP 발송 테스트

#### AWS S3 (File Storage)
- [ ] S3 Bucket 생성
- [ ] IAM 권한 설정
- [ ] 파일 업로드 테스트
- [ ] 파일 다운로드 테스트
- [ ] CORS 설정

---

### ☁️ 5. 인프라 및 배포

#### Docker
- [ ] 모든 서비스의 Dockerfile 확인
- [ ] docker-compose.yml 확인 (로컬 개발)
- [ ] 이미지 빌드 테스트

#### Kubernetes (선택적)
- [ ] Deployment YAML 작성
- [ ] Service YAML 작성
- [ ] Ingress YAML 작성
- [ ] ConfigMap 작성 (환경 변수)
- [ ] Secret 작성 (API Keys, DB 비밀번호)

#### CI/CD (GitHub Actions)
- [ ] develop 브랜치 배포 파이프라인 확인
- [ ] staging 브랜치 배포 파이프라인 확인 (선택적)
- [ ] main 브랜치 배포 파이프라인 확인 (선택적)

#### 환경 변수 설정
- [ ] 모든 서비스의 환경 변수 확인
  - DB 연결 정보
  - Redis 연결 정보
  - Kafka 연결 정보
  - 외부 API Keys
- [ ] Secret Manager 사용 (AWS Secrets Manager 또는 Kubernetes Secrets)

---

### 🧪 6. 테스트

#### 단위 테스트
- [ ] Patient Service 단위 테스트
- [ ] Appointment Service 단위 테스트
- [ ] Payment Service 단위 테스트
- [ ] 기타 서비스 단위 테스트

#### 통합 테스트
- [ ] 환자 회원가입 → 예약 → 결제 → 배송 (Full Journey)
- [ ] 빠른 예약 → 코디네이터 배정 → 진료 → 결제
- [ ] 예약 취소 → 환불 플로우
- [ ] 채팅 플로우
- [ ] 배송 추적 플로우

#### E2E 테스트 (Playwright or Cypress)
- [ ] 환자앱 E2E 시나리오 작성
- [ ] 병원앱 E2E 시나리오 작성
- [ ] E2E 테스트 실행 및 결과 확인

---

### 📊 7. 모니터링 및 로깅

#### 로그
- [ ] 모든 서비스의 로그 수집 확인 (Logback)
- [ ] 로그 레벨 설정 (INFO, DEBUG)
- [ ] 로그 포맷 통일

#### 모니터링
- [ ] Actuator Health Check 확인 (`/actuator/health`)
- [ ] Prometheus Metrics 확인 (`/actuator/prometheus`)
- [ ] Grafana 대시보드 설정 (선택적)

#### 알림
- [ ] 서비스 다운 알림 설정
- [ ] 에러 알림 설정 (Slack or Email)

---

### 🔒 8. 보안

- [ ] HTTPS 설정 (Let's Encrypt)
- [ ] CORS 설정 확인
- [ ] JWT Secret Key 확인
- [ ] Cookie 설정 (HttpOnly, Secure, SameSite)
- [ ] API Rate Limiting 설정 (선택적)
- [ ] SQL Injection 방어 확인
- [ ] XSS 방어 확인

---

### 📝 9. 문서화

- [x] 환자앱 유저 플로우 및 시퀀스 다이어그램
- [x] 병원앱 유저 플로우 및 시퀀스 다이어그램
- [x] 전체 통합 프로세스 플로우 다이어그램
- [x] 백엔드 API 분석 및 누락 API 파악
- [ ] API 명세서 최종 정리 (Swagger or Postman Collection)
- [ ] 배포 가이드 작성
- [ ] 운영 가이드 작성 (장애 대응, 스케일링 등)

---

## 🧪 테스트 시나리오

### Scenario 1: 신규 환자 Full Journey

#### 목표
신규 환자가 회원가입부터 진료, 결제, 약 배송까지 전체 과정을 완료

#### 전제 조건
- 백엔드 서비스 모두 실행 중
- 외부 서비스 연동 완료 (Sendbird, Omise, Shippop, Infobank)

#### 단계
1. **환자 회원가입**
   - [ ] 전화번호 입력 (+66-xxx-xxxx)
   - [ ] OTP 발송 확인 (SMS 수신)
   - [ ] OTP 입력 및 검증
   - [ ] 프로필 정보 입력 (이름, 성별, 생년월일)
   - [ ] 약관 동의
   - [ ] 회원가입 완료
   - [ ] 예약 목록 페이지로 이동
   - **예상 결과**: 회원가입 성공, 쿠키 발급 (sid, ctx)

2. **일반 예약 생성 (STANDARD)**
   - [ ] 예약 생성 버튼 클릭
   - [ ] STANDARD 선택
   - [ ] 의사 선택 (Dr. Smith)
   - [ ] 날짜/시간 선택 (내일 14:00)
   - [ ] 증상 입력 ("두통, 어지러움")
   - [ ] 사진 업로드 (선택적)
   - [ ] 문진표 작성 (알레르기, 복용약 등)
   - [ ] 확인 및 예약 완료
   - **예상 결과**: 예약 생성 성공 (CONFIRMED), 예약 번호 발급

3. **병원앱에서 예약 확인 (코디네이터)**
   - [ ] 병원앱 로그인 (coordinator@test.com / password)
   - [ ] 예약 탭 → Confirmed
   - [ ] 예약 목록에 새 예약 표시 확인
   - [ ] 예약 상세 확인 (환자 정보, 증상, 문진표)
   - **예상 결과**: 예약 정보 정확히 표시

4. **화상 진료 수행**
   - [ ] 예약 시간이 되면 의사가 "진료 시작" 버튼 클릭
   - [ ] Video Call 세션 생성
   - [ ] 의사 Room 입장
   - [ ] 환자가 "진료 시작" 버튼 클릭
   - [ ] 환자 Room 입장
   - [ ] 양방향 화상 통화 연결 확인
   - [ ] 실시간 번역 자막 표시 (태국어 → 한국어)
   - [ ] 진료 진행 (5분)
   - **예상 결과**: 화상 통화 원활, 자막 정상 표시

5. **진료 기록 작성 및 처방전 발급**
   - [ ] 의사가 "진료 종료" 버튼 클릭
   - [ ] 진료 기록 입력 모달 표시
   - [ ] 진단명 입력 ("감기")
   - [ ] 처방전 발급 체크
   - [ ] 약 정보 입력 (타이레놀 500mg, 1일 3회, 3일)
   - [ ] 배송 필요 체크
   - [ ] 저장
   - **예상 결과**: 진료 완료 (COMPLETED), 처방전 발급

6. **결제 (진료비 + 약값 + 배송비)**
   - [ ] 환자앱에서 예약 상세 → "결제" 버튼
   - [ ] 결제 페이지로 이동
   - [ ] 배송지 선택 (기존 또는 신규 추가)
   - [ ] 배송비 견적 조회 (Shippop)
   - [ ] 총 금액 확인 (진료비 500 + 약값 200 + 배송비 50 = 750 THB)
   - [ ] 결제 수단 선택 (카드)
   - [ ] 카드 정보 입력 (Omise 테스트 카드)
   - [ ] 결제하기
   - **예상 결과**: 결제 성공, 결제 완료 페이지로 이동

7. **약 배송 추적**
   - [ ] 환자앱에서 약 배송 탭으로 이동
   - [ ] 배송 카드 표시 확인 (상태: PENDING)
   - [ ] 병원 약사가 약 준비 완료 후 "배송 예약" 버튼
   - [ ] Shippop 예약 완료
   - [ ] 배송 상태 변경 (BOOKED)
   - [ ] 환자앱에서 실시간 추적 버튼
   - [ ] 지도에 배송 위치 표시
   - **예상 결과**: 배송 추적 정상 작동

---

### Scenario 2: 빠른 예약 (QUICK) + 코디네이터 배정

#### 목표
환자가 빠른 예약을 생성하고, 코디네이터가 의사를 배정

#### 단계
1. **환자가 빠른 예약 생성**
   - [ ] 예약 생성 → QUICK 선택
   - [ ] 증상 입력
   - [ ] 문진표 작성
   - [ ] 확인 및 예약 완료
   - **예상 결과**: 예약 생성 성공 (PENDING), "병원에서 배정 대기" 안내

2. **코디네이터가 의사 배정**
   - [ ] 병원앱 로그인
   - [ ] 예약 탭 → Waiting
   - [ ] PENDING 예약 클릭
   - [ ] 예약 상세 확인
   - [ ] "Confirm" 버튼 클릭
   - [ ] 의사 선택 모달
   - [ ] 의사 선택 + 날짜/시간 배정
   - [ ] 확인
   - **예상 결과**: 예약 상태 변경 (CONFIRMED), 환자에게 SMS 알림 발송

3. **환자가 예약 확정 확인**
   - [ ] 환자앱에서 예약 목록 확인
   - [ ] 예약 상태 변경 확인 (PENDING → CONFIRMED)
   - [ ] 예약 상세에서 의사 정보, 예약 시간 확인
   - **예상 결과**: 예약 정보 업데이트 확인

---

### Scenario 3: 예약 취소 및 환불

#### 목표
환자가 결제 완료 후 예약을 취소하고 환불 처리

#### 단계
1. **예약 생성 및 결제 완료** (Scenario 1과 동일)

2. **환자가 예약 취소**
   - [ ] 예약 상세 → "예약 취소" 버튼
   - [ ] 취소 확인 다이얼로그
   - [ ] 취소 사유 선택 ("개인 사정")
   - [ ] 확인
   - **예상 결과**: 예약 상태 변경 (CANCELLED)

3. **자동 환불 처리**
   - [ ] Payment Service가 Kafka Event 수신 (appointment.cancelled)
   - [ ] Omise Refund API 호출
   - [ ] 환불 성공
   - **예상 결과**: 결제 상태 변경 (REFUNDED), 환불 완료 (3~5 영업일)

4. **배송 취소**
   - [ ] Shipping Service가 Kafka Event 수신
   - [ ] 배송 상태 확인 (PENDING)
   - [ ] 배송 취소 또는 삭제
   - **예상 결과**: 배송 취소 완료

---

### Scenario 4: 환자-병원 채팅

#### 목표
코디네이터가 환자와 채팅으로 추가 정보 요청

#### 단계
1. **코디네이터가 채팅 시작**
   - [ ] 예약 상세 → "Chat" 버튼
   - [ ] Sendbird 채널 생성
   - [ ] 채팅 플로팅 윈도우 열기
   - [ ] 메시지 입력 ("예약 시간 10분 앞당기실 수 있나요?")
   - [ ] 전송
   - **예상 결과**: 메시지 전송 성공

2. **환자가 채팅 확인 및 답장**
   - [ ] 환자앱에서 Push 알림 수신 (새 메시지)
   - [ ] 채팅 목록 → 채팅방 클릭
   - [ ] 메시지 확인
   - [ ] 답장 ("네, 가능합니다")
   - [ ] 전송
   - **예상 결과**: 메시지 전송 성공, 코디네이터에게 실시간 전송

3. **코디네이터가 답장 확인**
   - [ ] 병원앱 채팅 윈도우에서 답장 표시 확인
   - **예상 결과**: 메시지 표시 확인

---

### Scenario 5: 다국어 지원 테스트

#### 목표
환자앱과 병원앱에서 다국어 전환 테스트

#### 단계
1. **환자앱 다국어**
   - [ ] 설정 → 언어 변경
   - [ ] 한국어 → 영어
   - [ ] 모든 화면 텍스트 영어로 표시 확인
   - [ ] 영어 → 태국어
   - [ ] 모든 화면 텍스트 태국어로 표시 확인
   - **예상 결과**: 언어 전환 정상 작동

2. **병원앱 다국어**
   - [ ] 설정 → 언어 변경
   - [ ] 한국어 → 영어
   - [ ] 모든 화면 텍스트 영어로 표시 확인
   - **예상 결과**: 언어 전환 정상 작동

---

## ⚡ 긴급 대응 시나리오

### 서비스 다운 시
1. Health Check 확인 (`/actuator/health`)
2. 로그 확인 (에러 메시지 파악)
3. 서비스 재시작
4. 필요 시 롤백

### DB 연결 실패 시
1. DB 서버 상태 확인
2. 연결 정보 확인 (환경 변수)
3. DB 재시작
4. 연결 풀 재설정

### 외부 API 장애 시
1. 외부 API 상태 확인 (Sendbird, Omise, Shippop)
2. Fallback 로직 작동 확인
3. 재시도 로직 작동 확인
4. 사용자에게 안내 메시지 표시

---

## ✅ 최종 점검 (배포 직전)

- [ ] 모든 서비스 Health Check 정상
- [ ] 모든 외부 API 연동 정상
- [ ] E2E 테스트 모두 통과
- [ ] 로그 수집 정상
- [ ] 모니터링 대시보드 확인
- [ ] 백업 확인
- [ ] 롤백 계획 수립
- [ ] 배포 후 모니터링 계획 수립

---

## 🎯 배포 후 모니터링 (첫 24시간)

- [ ] 서비스 Health Check 주기적 확인 (5분마다)
- [ ] 에러 로그 모니터링
- [ ] API 응답 시간 모니터링
- [ ] DB 커넥션 풀 모니터링
- [ ] 사용자 피드백 수집

---

## 📞 문의 및 지원

- 백엔드 개발자: [연락처]
- 프론트엔드 개발자: [연락처]
- DevOps: [연락처]
- 긴급 연락망: [Slack 채널 또는 전화번호]


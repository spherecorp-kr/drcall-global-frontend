# DrCall Global - API 플로우 및 시퀀스 다이어그램 문서

## 📚 문서 개요

비대면 글로벌 진료 서비스인 DrCall Global의 전체 유저 플로우, 시퀀스 다이어그램, API 명세, 백엔드 분석을 정리한 문서입니다.

**목표**: 내일 2시까지 모든 기능이 정상적으로 동작하는 프로토타입 배포

---

## 📂 문서 목록

### 1. [환자앱 플로우 (PATIENT_APP_FLOW.md)](./PATIENT_APP_FLOW.md)

**내용**:
- 환자앱 개요 및 주요 기능
- 회원가입 및 로그인 플로우 (OTP 인증)
- 예약 생성 플로우 (STANDARD/QUICK)
- 화상 진료 플로우 (Sendbird Video Call)
- 채팅 플로우 (Sendbird Chat)
- 결제 플로우 (Omise)
- 약 배송 추적 플로우 (Shippop)
- PHR (개인 건강 기록) 관리
- 다국어 지원

**포함 사항**:
- ✅ 시퀀스 다이어그램 (Mermaid)
- ✅ API 엔드포인트 요약
- ✅ 전체 화면 목록

---

### 2. [병원앱 플로우 (HOSPITAL_APP_FLOW.md)](./HOSPITAL_APP_FLOW.md)

**내용**:
- 병원앱 개요 및 주요 기능
- 로그인 플로우 (ID/PW 기반)
- 대시보드
- 예약 관리 (Pending → Confirmed → Completed)
- 환자 관리 (등록, 조회)
- 의사 관리
- 화상 진료 (의사 역할)
- 진료 기록 작성 및 처방전 발급
- 채팅 (환자와 1:1)
- 결제 내역 조회

**포함 사항**:
- ✅ 시퀀스 다이어그램 (Mermaid)
- ✅ API 엔드포인트 요약
- ✅ 사용자 역할별 기능 (코디네이터 vs 의사)

---

### 3. [전체 통합 프로세스 플로우 (END_TO_END_FLOW.md)](./END_TO_END_FLOW.md)

**내용**:
- 전체 시나리오 목록
  1. 신규 환자 Full Journey (회원가입 → 예약 → 진료 → 결제 → 배송)
  2. 빠른 예약 (QUICK) + 코디네이터 배정
  3. 환자-병원 채팅
  4. 약 배송 추적
  5. 예약 취소 및 환불
- 전체 시스템 아키텍처 (MSA)
- Kafka Event Topics

**포함 사항**:
- ✅ End-to-End 시퀀스 다이어그램 (환자앱 + 병원앱 + 백엔드)
- ✅ MSA 서비스 구성도
- ✅ 이벤트 기반 통신 구조

---

### 4. [백엔드 API 분석 (BACKEND_API_ANALYSIS.md)](./BACKEND_API_ANALYSIS.md)

**내용**:
- 백엔드 MSA 서비스 구성 (11개 서비스)
- 각 서비스별 API 엔드포인트 분석
  - Patient Service (18081)
  - Appointment Service (18083)
  - Payment Service (18085)
  - Hospital Service (18082)
  - Video Call Service (18089)
  - Translation Service (18088)
  - Shipping Service (18090)
  - Messaging Service (18084)
  - Storage Service (18087)
  - Admin Service (18086)
  - Webhook Receiver Service
- 누락된 API 파악 및 우선순위
- 개발 계획

**포함 사항**:
- ✅ 각 Controller 분석
- ✅ 누락된 API 목록 (High Priority)
- ✅ 개발 계획 (Phase 1~3)

**주요 누락 API**:
- ❌ `GET /api/v1/auth/profile` (Patient Service)
- ❌ `PUT /api/v1/auth/profile` (Patient Service)
- ❌ `POST /api/v1/payments/charge` (Payment Service - Omise Charge 생성)
- ❓ Delivery Address, PHR, Shipping, Video Call, Translation 등 확인 필요

---

### 5. [배포 체크리스트 및 테스트 시나리오 (DEPLOYMENT_CHECKLIST.md)](./DEPLOYMENT_CHECKLIST.md)

**내용**:
- 배포 준비 체크리스트
  1. 백엔드 API 개발 (High Priority)
  2. 프론트엔드 개발
  3. 데이터베이스 및 마이그레이션
  4. 외부 서비스 연동 (Sendbird, Omise, Shippop, Infobank, AWS S3)
  5. 인프라 및 배포 (Docker, Kubernetes, CI/CD)
  6. 테스트 (단위, 통합, E2E)
  7. 모니터링 및 로깅
  8. 보안
  9. 문서화
- 테스트 시나리오 (5개)
  1. 신규 환자 Full Journey
  2. 빠른 예약 + 코디네이터 배정
  3. 예약 취소 및 환불
  4. 환자-병원 채팅
  5. 다국어 지원
- 긴급 대응 시나리오
- 배포 후 모니터링 계획

**포함 사항**:
- ✅ 상세 체크리스트 (체크박스 포함)
- ✅ 단계별 테스트 시나리오
- ✅ 최종 점검 항목

---

## 🎯 핵심 요약

### 환자앱 주요 플로우
1. **회원가입**: 전화번호 → OTP → 프로필 등록
2. **예약**: STANDARD (의사 선택) or QUICK (병원 배정)
3. **진료**: 화상 통화 + 실시간 번역
4. **결제**: Omise (카드 or QR)
5. **배송**: Shippop 추적

### 병원앱 주요 플로우
1. **로그인**: ID/PW
2. **예약 관리**: Pending → Confirmed (의사 배정)
3. **진료**: 화상 통화 + 진료 기록 작성
4. **처방전**: 약 정보 + 배송 필요 여부
5. **채팅**: 환자와 1:1 채팅

### MSA 서비스 구성
```
Patient Service (18081) ─┐
Hospital Service (18082) ─┼─> Kafka Events
Appointment Service (18083) ─┘
Payment Service (18085)
Shipping Service (18090)
Messaging Service (18084)
Video Call Service (18089)
Translation Service (18088)
Storage Service (18087)
Admin Service (18086)
Webhook Receiver Service
```

---

## 🚀 개발 우선순위 (내일 2시까지)

### Phase 1: 핵심 API 구현 (4시간)
1. Patient Service
   - `GET /api/v1/auth/profile`
   - `PUT /api/v1/auth/profile`
2. Payment Service
   - `POST /api/v1/payments/charge` (Omise Charge 생성)
3. Appointment Service
   - 진료 완료 API에 진료 기록 필드 추가

### Phase 2: API 확인 및 테스트 (2시간)
1. 기존 Controller 파일 읽어서 누락 여부 확인
   - DeliveryAddressController
   - PHRController
   - ShipmentController
   - VideoCallController
   - TranslationController
   - ChatController
2. 각 API 통합 테스트

### Phase 3: E2E 테스트 (2시간)
1. 환자앱 Full Journey 테스트
2. 병원앱 예약 관리 테스트
3. 예약 취소 및 환불 테스트

---

## 📊 Kafka Event Topics

| Topic | Producer | Consumer | Event Types |
|-------|----------|----------|-------------|
| `appointment-events` | Appointment Service | Hospital Service, Payment Service, Shipping Service | appointment.created, appointment.confirmed, appointment.completed, appointment.cancelled |
| `payment-events` | Payment Service | Shipping Service | payment.completed, payment.refunded |
| `shipment-events` | Shipping Service | Messaging Service | shipment.created, shipment.delivered |

---

## 🔗 외부 서비스 연동

### Sendbird
- **Chat**: 1:1 채팅 (환자 ↔ 병원)
- **Video Call**: 화상 통화 (SFU)

### Omise (Thailand Payment Gateway)
- **Card**: 신용/체크 카드 결제
- **PromptPay**: QR 코드 결제

### Shippop (Thailand Shipping)
- **Price Quote**: 배송비 견적
- **Booking**: 배송 예약
- **Tracking**: 배송 추적

### Infobank (Thailand SMS)
- **OTP**: 인증 코드 발송
- **Notification**: 예약 확정/취소 알림

### AWS S3
- **File Upload**: 증상 사진, 처방전 등

---

## 📞 문의

- **백엔드 개발**: [연락처]
- **프론트엔드 개발**: [연락처]
- **DevOps**: [연락처]
- **PM**: [연락처]

---

## ✅ 최종 점검

- [x] 환자앱 플로우 문서 작성
- [x] 병원앱 플로우 문서 작성
- [x] 전체 통합 프로세스 플로우 작성
- [x] 백엔드 API 분석 및 누락 API 파악
- [x] 배포 체크리스트 및 테스트 시나리오 작성
- [ ] 누락 API 개발
- [ ] 통합 테스트
- [ ] E2E 테스트
- [ ] 배포

---

## 🎉 다음 단계

1. **누락 API 개발 착수** (즉시)
   - Patient Service: Profile 조회/수정
   - Payment Service: Omise Charge 생성
   - 기타 Controller 확인

2. **통합 테스트** (API 개발 완료 후)
   - Postman Collection 작성
   - 각 플로우별 테스트

3. **E2E 테스트** (통합 테스트 완료 후)
   - 환자앱 + 병원앱 시나리오 테스트

4. **배포** (모든 테스트 통과 후)
   - Docker 이미지 빌드
   - 서비스 배포
   - Health Check 확인
   - 모니터링 시작

**화이팅! 🚀**


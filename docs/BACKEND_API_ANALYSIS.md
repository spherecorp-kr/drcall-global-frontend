# 백엔드 API 분석 및 누락 API 파악

## 📊 백엔드 MSA 서비스 구성

| Service | Port | Database | 주요 기능 |
|---------|------|----------|---------|
| Patient Service | 18081 | patient_db | 환자 인증, 프로필, PHR, 배송지 |
| Hospital Service | 18082 | hospital_db | 병원 직원 인증, 의사 관리, CDC Replica |
| Appointment Service | 18083 | appointment_db | 예약 생성/관리, 상태 전환 |
| Messaging Service | 18084 | messaging_db | SMS, 채팅 (Sendbird), 알림 |
| Payment Service | 18085 | payment_db | 결제 (Omise), 환불 |
| Admin Service | 18086 | admin_db | 시스템 관리 |
| Storage Service | 18087 | storage_db | 파일 업로드 (S3) |
| Translation Service | 18088 | translation_db | 실시간 번역 (STT + MT) |
| Video Call Service | 18089 | videocall_db | 화상 통화 (Sendbird SFU) |
| Shipping Service | 18090 | shipping_db | 배송 관리 (Shippop) |
| Webhook Receiver Service | - | - | 외부 웹훅 수신 (Omise, Shippop) |

---

## 🔍 API 엔드포인트 분석

### 1. Patient Service (Port: 18081)

#### 1.1 Authentication (`AuthController.java`)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/auth/otp/send` | OTP 발송 | ✅ 구현됨 |
| POST | `/api/v1/auth/otp/verify` | OTP 검증 + tempJwt 발급 | ✅ 구현됨 |
| POST | `/api/v1/auth/profile/register` | 프로필 등록 (회원가입 완료) | ✅ 구현됨 |
| POST | `/api/v1/auth/logout` | 로그아웃 | ✅ 구현됨 |
| GET | `/api/v1/auth/profile` | 프로필 조회 | ❌ **누락** |
| PUT | `/api/v1/auth/profile` | 프로필 수정 | ❌ **누락** |

**누락된 API**:
- `GET /api/v1/auth/profile`: 기존 환자 여부 확인 및 프로필 조회 (프론트엔드에서 사용 중)
- `PUT /api/v1/auth/profile`: 프로필 정보 수정

---

#### 1.2 Appointment (Read-Only) (`AppointmentController.java`)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| GET | `/api/v1/appointments` | 내 예약 목록 조회 (Pagination) | ✅ 구현됨 |
| GET | `/api/v1/appointments/{id}` | 예약 상세 조회 | ✅ 구현됨 |

**참고**: 이 Controller는 Read-Only입니다. 예약 생성/수정/삭제는 Appointment Service로 직접 호출해야 합니다.

---

#### 1.3 Delivery Address (`DeliveryAddressController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| GET | `/api/v1/delivery-addresses` | 배송지 목록 조회 | ❓ 확인 필요 |
| GET | `/api/v1/delivery-addresses/{id}` | 배송지 상세 조회 | ❓ 확인 필요 |
| POST | `/api/v1/delivery-addresses` | 배송지 추가 | ❓ 확인 필요 |
| PUT | `/api/v1/delivery-addresses/{id}` | 배송지 수정 | ❓ 확인 필요 |
| DELETE | `/api/v1/delivery-addresses/{id}` | 배송지 삭제 | ❓ 확인 필요 |

---

#### 1.4 PHR (Personal Health Record) (`PHRController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| GET | `/api/v1/phr` | PHR 요약 | ❓ 확인 필요 |
| GET | `/api/v1/phr/allergies` | 알레르기 목록 | ❓ 확인 필요 |
| POST | `/api/v1/phr/allergies` | 알레르기 추가 | ❓ 확인 필요 |
| GET | `/api/v1/phr/medications` | 복용약 목록 | ❓ 확인 필요 |
| POST | `/api/v1/phr/medications` | 복용약 추가 | ❓ 확인 필요 |
| GET | `/api/v1/phr/diagnoses` | 진단 기록 목록 | ❓ 확인 필요 |
| POST | `/api/v1/phr/diagnoses` | 진단 기록 추가 | ❓ 확인 필요 |

---

#### 1.5 Hospital Info (`HospitalController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| GET | `/api/v1/hospitals` | 병원 목록 조회 | ❓ 확인 필요 |
| GET | `/api/v1/hospitals/{id}` | 병원 상세 조회 | ❓ 확인 필요 |
| GET | `/api/v1/hospitals/{id}/doctors` | 병원 의사 목록 | ❓ 확인 필요 |

---

#### 1.6 Chat Proxy (`ChatProxyController.java`)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| GET | `/api/v1/chat/channels` | 채팅 목록 (Sendbird Proxy) | ❓ 확인 필요 |
| GET | `/api/v1/chat/channels/{channelUrl}` | 채팅방 정보 | ❓ 확인 필요 |
| GET | `/api/v1/chat/channels/{channelUrl}/messages` | 메시지 목록 | ❓ 확인 필요 |
| POST | `/api/v1/chat/channels/{channelUrl}/messages` | 메시지 전송 | ❓ 확인 필요 |

---

### 2. Appointment Service (Port: 18083)

#### 2.1 Appointment CRUD (`AppointmentController.java`)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/appointments` | 예약 생성 | ✅ 구현됨 |
| GET | `/api/v1/appointments` | 예약 목록 조회 (상태 필터, Pagination) | ✅ 구현됨 |
| GET | `/api/v1/appointments/{id}` | 예약 상세 조회 | ✅ 구현됨 |
| GET | `/api/v1/appointments/external/{externalId}` | externalId로 예약 조회 | ✅ 구현됨 |
| GET | `/api/v1/appointments/patient/{patientId}` | 환자별 예약 목록 | ✅ 구현됨 |
| GET | `/api/v1/appointments/patient/{patientId}/active` | 환자 활성 예약 | ✅ 구현됨 |
| GET | `/api/v1/appointments/doctor/{doctorId}` | 의사별 예약 목록 | ✅ 구현됨 |
| GET | `/api/v1/appointments/doctor/{doctorId}/range` | 의사 예약 (날짜 범위) | ✅ 구현됨 |
| PUT | `/api/v1/appointments/{id}` | 예약 수정 | ✅ 구현됨 |
| POST | `/api/v1/appointments/{id}/confirm` | 예약 확정 | ✅ 구현됨 |
| POST | `/api/v1/appointments/{id}/start` | 진료 시작 | ✅ 구현됨 |
| POST | `/api/v1/appointments/{id}/complete` | 진료 완료 | ✅ 구현됨 |
| POST | `/api/v1/appointments/{id}/cancel` | 예약 취소 | ✅ 구현됨 |
| POST | `/api/v1/appointments/{id}/no-show` | No-Show 처리 | ✅ 구현됨 |

**누락된 API**:
- ❌ **진료 기록 작성 API**: `PUT /api/v1/appointments/{id}/complete`에 진료 기록 (diagnosis, prescription, medicalNotes) 포함 가능한지 확인 필요

---

#### 2.2 Prescription (`PrescriptionController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/prescriptions` | 처방전 발급 | ❓ 확인 필요 |
| GET | `/api/v1/prescriptions/{id}` | 처방전 조회 | ❓ 확인 필요 |
| GET | `/api/v1/prescriptions/appointment/{appointmentId}` | 예약별 처방전 조회 | ❓ 확인 필요 |

---

### 3. Payment Service (Port: 18085)

#### 3.1 Payment (`PaymentController.java`)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/payments` | 결제 생성 | ✅ 구현됨 |
| GET | `/api/v1/payments/{id}` | 결제 조회 | ✅ 구현됨 |
| GET | `/api/v1/payments/external/{externalId}` | externalId로 결제 조회 | ✅ 구현됨 |
| GET | `/api/v1/payments/appointment/{appointmentId}` | 예약별 결제 조회 | ✅ 구현됨 |
| GET | `/api/v1/payments/omise/{omiseChargeId}` | Omise Charge ID로 결제 조회 | ✅ 구현됨 |
| GET | `/api/v1/payments/patient/{patientId}` | 환자별 결제 목록 | ✅ 구현됨 |
| GET | `/api/v1/payments/hospital/{hospitalId}` | 병원별 결제 목록 | ✅ 구현됨 |
| GET | `/api/v1/payments/status/{status}` | 상태별 결제 목록 | ✅ 구현됨 |
| POST | `/api/v1/payments/{id}/process` | 결제 처리 (Omise Charge ID 연결) | ✅ 구현됨 |
| POST | `/api/v1/payments/{id}/success` | 결제 성공 처리 | ✅ 구현됨 |
| POST | `/api/v1/payments/{id}/failed` | 결제 실패 처리 | ✅ 구현됨 |
| POST | `/api/v1/payments/{id}/refund` | 환불 처리 | ✅ 구현됨 |

**누락된 API**:
- ❌ **Charge 생성 API**: 프론트엔드에서 Omise 토큰을 받아서 Charge를 생성하는 API 필요
  - `POST /api/v1/payments/charge` 또는 `POST /api/v1/payments/{id}/charge`
  - Request: `{ paymentId, omiseToken, returnUri }`

---

### 4. Hospital Service (Port: 18082)

#### 4.1 Authentication (`AuthController.java`)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/auth/login` | 로그인 (ID/PW) | ✅ 구현됨 |
| POST | `/api/v1/auth/logout` | 로그아웃 | ✅ 구현됨 |
| GET | `/api/v1/auth/me` | 현재 사용자 정보 조회 (JWT) | ✅ 구현됨 |

---

#### 4.2 Doctor Management (`DoctorController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| GET | `/api/v1/doctors` | 의사 목록 조회 | ❓ 확인 필요 |
| GET | `/api/v1/doctors/{id}` | 의사 상세 조회 | ❓ 확인 필요 |
| POST | `/api/v1/doctors` | 의사 등록 | ❓ 확인 필요 |
| PUT | `/api/v1/doctors/{id}` | 의사 정보 수정 | ❓ 확인 필요 |
| PUT | `/api/v1/doctors/{id}/schedule` | 의사 스케줄 관리 | ❓ 확인 필요 |

---

#### 4.3 Hospital Management (`HospitalController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| GET | `/api/v1/hospitals` | 병원 목록 조회 | ❓ 확인 필요 |
| GET | `/api/v1/hospitals/{id}` | 병원 상세 조회 | ❓ 확인 필요 |
| PUT | `/api/v1/hospitals/{id}` | 병원 정보 수정 | ❓ 확인 필요 |

---

#### 4.4 Replica Data (CDC Sync)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| GET | `/api/v1/appointments` | 예약 목록 조회 (Replica) | ❓ 확인 필요 |
| GET | `/api/v1/appointments/{sequence}` | 예약 상세 조회 (Replica) | ❓ 확인 필요 |
| PUT | `/api/v1/appointments/{sequence}` | 예약 수정 (의사 배정, 시간 변경) | ❓ 확인 필요 |
| PUT | `/api/v1/appointments/{sequence}/cancel` | 예약 취소 | ❓ 확인 필요 |
| GET | `/api/v1/patients` | 환자 목록 조회 (Replica) | ❓ 확인 필요 |
| GET | `/api/v1/patients/{id}` | 환자 상세 조회 (Replica) | ❓ 확인 필요 |
| POST | `/api/v1/patients` | 환자 등록 (Patient Service로 전달) | ❓ 확인 필요 |
| GET | `/api/v1/payments` | 결제 내역 목록 (Replica) | ❓ 확인 필요 |

---

### 5. Video Call Service (Port: 18089)

#### 5.1 Video Call Session (`VideoCallController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/video-calls` | 세션 생성 | ❓ 확인 필요 |
| GET | `/api/v1/video-calls/{id}` | 세션 조회 | ❓ 확인 필요 |
| GET | `/api/v1/video-calls/appointment/{appointmentId}` | 예약별 세션 조회 | ❓ 확인 필요 |
| POST | `/api/v1/video-calls/{id}/join` | 세션 참여 (Access Token 발급) | ❓ 확인 필요 |
| POST | `/api/v1/video-calls/{id}/end` | 세션 종료 | ❓ 확인 필요 |
| POST | `/api/v1/video-calls/{id}/leave` | 세션 퇴장 | ❓ 확인 필요 |

---

### 6. Translation Service (Port: 18088)

#### 6.1 Translation Session (`TranslationController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/translations/sessions` | 번역 세션 생성 | ❓ 확인 필요 |
| GET | `/api/v1/translations/sessions/{id}` | 번역 세션 조회 | ❓ 확인 필요 |
| DELETE | `/api/v1/translations/sessions/{id}` | 번역 세션 종료 | ❓ 확인 필요 |

#### 6.2 Subtitle (Real-time Translation)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| WebSocket | `/api/v1/translations/sessions/{id}/stream` | 실시간 번역 WebSocket | ❓ 확인 필요 |

---

### 7. Shipping Service (Port: 18090)

#### 7.1 Shipment Management (`ShipmentController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/shipments/quote` | 배송비 견적 조회 | ❓ 확인 필요 |
| POST | `/api/v1/shipments` | 배송 생성 | ❓ 확인 필요 |
| GET | `/api/v1/shipments/{id}` | 배송 조회 | ❓ 확인 필요 |
| GET | `/api/v1/shipments?patientId={id}` | 환자별 배송 목록 | ❓ 확인 필요 |
| POST | `/api/v1/shipments/{id}/confirm` | 배송 예약 (Shippop) | ❓ 확인 필요 |
| GET | `/api/v1/shipments/tracking/{trackingNumber}` | 배송 추적 | ❓ 확인 필요 |

---

### 8. Messaging Service (Port: 18084)

#### 8.1 Chat (`ChatController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/chat/channels` | 채팅방 생성 | ❓ 확인 필요 |
| GET | `/api/v1/chat/channels/{channelUrl}` | 채팅방 정보 조회 | ❓ 확인 필요 |
| GET | `/api/v1/chat/channels/{channelUrl}/messages` | 메시지 목록 조회 | ❓ 확인 필요 |
| POST | `/api/v1/chat/channels/{channelUrl}/messages` | 메시지 전송 | ❓ 확인 필요 |
| GET | `/api/v1/chat/channels/{channelUrl}/stream` | SSE 스트림 (실시간 메시지) | ❓ 확인 필요 |

#### 8.2 Notification

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/notifications/sms` | SMS 발송 | ❓ 확인 필요 |
| POST | `/api/v1/notifications/push` | Push 알림 발송 | ❓ 확인 필요 |

---

### 9. Storage Service (Port: 18087)

#### 9.1 File Storage (`StorageController.java` - 파악 필요)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/v1/storage/upload` | 파일 업로드 (S3) | ❓ 확인 필요 |
| GET | `/api/v1/storage/download/{key}` | 파일 다운로드 | ❓ 확인 필요 |
| DELETE | `/api/v1/storage/{key}` | 파일 삭제 | ❓ 확인 필요 |

---

### 10. Webhook Receiver Service

#### 10.1 Omise Webhook (`OmiseWebhookController.java`)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/webhooks/omise` | Omise 웹훅 수신 | ❓ 확인 필요 |

#### 10.2 Shippop Webhook (`ShippopWebhookController.java`)

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | `/api/webhooks/shippop` | Shippop 웹훅 수신 | ❓ 확인 필요 |

---

## ❌ 누락된 API 요약

### 🔴 High Priority (내일 2시까지 필수)

1. **Patient Service**
   - ❌ `GET /api/v1/auth/profile` - 프로필 조회 (기존 환자 확인 용도)
   - ❌ `PUT /api/v1/auth/profile` - 프로필 수정

2. **Payment Service**
   - ❌ `POST /api/v1/payments/charge` - Omise Charge 생성 (프론트엔드에서 토큰 받아서 Charge 생성)
   - Request: `{ appointmentId, paymentMethod, omiseToken, returnUri, deliveryAddressId (optional) }`

3. **Appointment Service**
   - ❌ `PUT /api/v1/appointments/{id}/complete` - 진료 완료 시 진료 기록 및 처방전 포함 여부 확인
   - Request: `{ diagnosis, prescription: { medications: [...] }, medicalNotes, requiresDelivery }`

4. **Delivery Address (Patient Service)**
   - Controller 파일 확인 필요: 모든 CRUD 구현되어 있는지 확인

5. **PHR (Patient Service)**
   - Controller 파일 확인 필요: 알레르기, 복용약, 진단 기록 등 CRUD 구현되어 있는지 확인

6. **Shipping Service**
   - 모든 엔드포인트 확인 필요: 배송비 견적, 배송 생성, 추적 등

7. **Video Call Service**
   - 모든 엔드포인트 확인 필요: 세션 생성, 참여, 종료

8. **Translation Service**
   - 모든 엔드포인트 확인 필요: 번역 세션 관리, WebSocket

9. **Chat Service (Messaging Service)**
   - 모든 엔드포인트 확인 필요: 채팅 CRUD, SSE 스트림

10. **Hospital Service - Replica 업데이트 API**
    - 예약 수정 (의사 배정, 시간 변경)
    - 예약 취소

---

## 🟡 Medium Priority (추후 개선)

1. **Dashboard API (Hospital Service)**
   - ❌ `GET /api/v1/dashboard/stats` - 대시보드 통계

2. **Patient Registration (Hospital Service)**
   - ❌ `POST /api/v1/patients` - 환자 등록 (Walk-in 환자)

3. **Hospital Management**
   - ❌ `GET /api/v1/hospitals/{id}/doctors` - 병원 의사 목록

---

## 🔧 개발 계획 (내일 2시까지)

### Phase 1: 핵심 API 구현 (4시간)
1. **Patient Service**
   - `GET /api/v1/auth/profile`
   - `PUT /api/v1/auth/profile`

2. **Payment Service**
   - `POST /api/v1/payments/charge` (Omise 통합)

3. **Appointment Service**
   - 진료 완료 API에 진료 기록 필드 추가

### Phase 2: 확인 및 테스트 (2시간)
1. 기존 Controller 파일 읽어서 누락 여부 확인:
   - DeliveryAddressController
   - PHRController
   - ShipmentController
   - VideoCallController
   - TranslationController
   - ChatController

2. 각 API 통합 테스트

### Phase 3: 프론트엔드 연동 테스트 (2시간)
1. 환자앱 → 백엔드 API 연동
2. 병원앱 → 백엔드 API 연동
3. E2E 플로우 테스트

---

## ✅ 다음 단계
1. 나머지 Controller 파일 읽어서 누락 API 최종 확인
2. 누락 API 개발 착수
3. 통합 테스트 및 배포 준비


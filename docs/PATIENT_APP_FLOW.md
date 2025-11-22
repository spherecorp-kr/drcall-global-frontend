# 환자앱 (Patient App) - 유저 플로우 및 시퀀스

## 📱 환자앱 개요

환자가 비대면 진료를 받기 위한 모바일 웹 애플리케이션

**주요 기능**:
- 전화번호 기반 회원가입/로그인 (OTP 인증)
- 예약 생성 (STANDARD/QUICK)
- 화상 진료 (Sendbird Video Call)
- 실시간 채팅 (Sendbird Chat)
- 결제 (Omise)
- 약 배송 추적 (Shippop)
- 개인 건강 기록 (PHR) 관리
- 다국어 지원 (한국어, 영어, 태국어)

---

## 🔐 1. 회원가입 및 로그인 플로우

### 1.1 사용자 시나리오

#### 신규 사용자 (회원가입)
1. 전화번호 입력
2. OTP 인증 코드 수신 (SMS)
3. OTP 코드 입력 및 검증
4. 프로필 정보 입력 (이름, 성별, 생년월일 등)
5. 약관 동의
6. 회원가입 완료 → 예약 목록으로 이동

#### 기존 사용자 (로그인)
1. 전화번호 입력
2. OTP 인증 코드 수신 (SMS)
3. OTP 코드 입력 및 검증
4. 로그인 완료 → 예약 목록으로 이동

#### 병원 등록 환자 (SMS 초대)
1. 병원에서 환자 등록 (이름, 전화번호 등 입력)
2. 환자에게 SMS 발송 (가입 URL 포함)
3. URL 클릭 → 전화번호 입력
4. OTP 인증 코드 수신 (SMS)
5. OTP 코드 입력 및 검증
6. **프로필 등록 화면에 병원에서 입력한 정보가 자동으로 세팅됨**
   - 이름, 전화번호, 이메일, 생년월일, 성별, 주소, 비상연락처
   - 모든 필드 수정 가능
7. 약관 동의 및 정보 확인/수정
8. 회원가입 완료 → PENDING 예약이 있으면 자동 확정 → 예약 목록으로 이동

---

### 1.2 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant Patient as 환자
    participant PatientApp as 환자앱
    participant AuthAPI as Patient Service<br/>(Auth API)
    participant SMS as Messaging Service<br/>(SMS)

    %% Step 1: 전화번호 입력
    Patient->>PatientApp: 전화번호 입력 (+66-xxx-xxxx)
    PatientApp->>PatientApp: 전화번호 유효성 검증
    PatientApp->>AuthAPI: POST /api/auth/otp/send
    Note right of AuthAPI: {<br/>  phone: "xxx",<br/>  phoneCountryCode: "+66",<br/>  verificationType: "REGISTRATION"<br/>}
    
    AuthAPI->>SMS: OTP 발송 요청
    SMS->>Patient: SMS 전송 (OTP 코드)
    AuthAPI-->>PatientApp: 200 OK
    PatientApp->>Patient: OTP 입력 화면 표시 (3분 타이머)

    %% Step 2: OTP 검증
    Patient->>PatientApp: OTP 코드 입력 (4자리)
    PatientApp->>AuthAPI: POST /api/auth/otp/verify
    Note right of AuthAPI: {<br/>  phone: "xxx",<br/>  phoneCountryCode: "+66",<br/>  otpCode: "1234"<br/>}
    
    AuthAPI->>AuthAPI: OTP 검증
    AuthAPI-->>PatientApp: 200 OK + tempJwt
    Note left of AuthAPI: {<br/>  tempToken: "eyJhbG...",<br/>  expiresIn: 300<br/>}
    
    PatientApp->>PatientApp: tempJwt를 localStorage에 저장
    PatientApp->>AuthAPI: GET /api/auth/profile<br/>(Header: Bearer tempJwt)
    
    alt 기존 환자 (Profile 있음)
        AuthAPI-->>PatientApp: 200 OK + Profile
        PatientApp->>Patient: 로그인 완료 → /appointments
    else 신규 환자 (Profile 없음)
        AuthAPI-->>PatientApp: 404 Not Found
        PatientApp->>Patient: 프로필 등록 화면 → /auth/service-registration
        
        %% Step 3-A: 병원 등록 정보 조회 (있는 경우)
        PatientApp->>AuthAPI: GET /api/auth/profile<br/>(Header: Bearer tempJwt)
        
        alt 병원에서 등록한 환자
            AuthAPI-->>PatientApp: 200 OK + HospitalPatient Info
            Note left of AuthAPI: {<br/>  name: "홍길동",<br/>  phone: "0812345678",<br/>  email: "hong@example.com",<br/>  dateOfBirth: "1990-01-01",<br/>  gender: "MALE",<br/>  address: "123 Main St"<br/>}
            PatientApp->>PatientApp: Form 자동 세팅<br/>(모든 필드 수정 가능)
            Patient->>PatientApp: 정보 확인/수정 + 약관 동의
        else 완전 신규 환자
            AuthAPI-->>PatientApp: 404 Not Found
            Patient->>PatientApp: 프로필 정보 입력<br/>(이름, 성별, 생년월일, 약관 동의)
        end
        
        %% Step 3-B: 프로필 등록 완료
        PatientApp->>AuthAPI: POST /api/auth/profile<br/>(Header: Bearer tempJwt)
        Note right of AuthAPI: {<br/>  name: "홍길동",<br/>  gender: "MALE",<br/>  birthDate: "1990-01-01",<br/>  termsAgreed: true,<br/>  privacyAgreed: true,<br/>  dataSharingConsent: true<br/>}
        
        AuthAPI->>AuthAPI: 환자 계정 생성<br/>+ 세션 쿠키 발급 (sid)<br/>+ PENDING 예약 자동 확정
        AuthAPI-->>PatientApp: 200 OK + Cookies (sid, ctx-{subdomain})
        Note left of AuthAPI: Set-Cookie: sid=xxx; HttpOnly; Secure<br/>Set-Cookie: ctx-th=xxx; HttpOnly; Secure
        
        PatientApp->>PatientApp: tempJwt 삭제
        PatientApp->>Patient: 회원가입 완료 → /appointments
    end
```

---

### 1.3 API 명세

#### 1.3.1 OTP 발송
```
POST /api/auth/otp/send
Content-Type: application/json

Request:
{
  "phone": "0812345678",
  "phoneCountryCode": "+66",
  "verificationType": "REGISTRATION",
  "invitationToken": null
}

Response (200 OK):
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### 1.3.2 OTP 검증 및 임시 JWT 발급
```
POST /api/auth/otp/verify
Content-Type: application/json

Request:
{
  "phone": "0812345678",
  "phoneCountryCode": "+66",
  "otpCode": "1234"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "tempToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 300
  }
}
```

#### 1.3.3 프로필 조회 (기존 환자 확인)
```
GET /api/auth/profile
Authorization: Bearer {tempJwt}

Response (200 OK - 기존 환자):
{
  "success": true,
  "data": {
    "id": 123,
    "name": "홍길동",
    "phone": "0812345678",
    "phoneCountryCode": "+66",
    "birthDate": "1990-01-01",
    "gender": "MALE"
  }
}

Response (404 Not Found - 신규 환자):
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile not found"
  }
}
```

#### 1.3.4 프로필 완성 (회원가입 완료)
```
POST /api/auth/profile/complete
Authorization: Bearer {tempJwt}
Content-Type: application/json

Request:
{
  "name": "홍길동",
  "gender": "MALE",
  "birthDate": "1990-01-01",
  "termsAgreed": true,
  "privacyAgreed": true,
  "dataSharingConsent": true
}

Response (200 OK):
{
  "success": true,
  "data": {
    "patientId": 123,
    "subscriptionId": "sub_xxx",
    "ctxToken": "ctx_token_xxx",
    "sidToken": "sid_token_xxx"
  }
}

Set-Cookie: sid=xxx; HttpOnly; Secure; Max-Age=604800; Path=/
Set-Cookie: ctx-th=xxx; HttpOnly; Secure; Max-Age=2592000; Path=/
```

---

### 1.4 인증 전략

#### 인증 토큰 종류
1. **tempJwt** (임시 JWT)
   - 용도: OTP 검증 후 ~ 프로필 완성 전
   - 저장: localStorage
   - 유효기간: 5분
   - 사용: `Authorization: Bearer {tempJwt}` 헤더

2. **sid** (세션 쿠키)
   - 용도: 로그인 완료 후 모든 API 호출
   - 저장: HttpOnly Cookie
   - 유효기간: 7일
   - 사용: 자동 전송 (withCredentials: true)

3. **ctx-{subdomain}** (컨텍스트 쿠키)
   - 용도: Sendbird 채널 컨텍스트
   - 저장: HttpOnly Cookie
   - 유효기간: 30일
   - 사용: 자동 전송

#### 인증 플로우
```
┌──────────────────┐      tempJwt       ┌──────────────────┐
│  OTP 검증 완료   │ ─────────────────> │  프로필 등록     │
│  (신규 사용자)   │   localStorage     │                  │
└──────────────────┘                    └──────────────────┘
                                                 │
                                                 │ POST /auth/profile/complete
                                                 │
                                                 ▼
┌──────────────────┐    sid + ctx 쿠키   ┌──────────────────┐
│  로그인 완료     │ <───────────────── │  회원가입 완료   │
│  (모든 API)      │   HttpOnly Cookie   │                  │
└──────────────────┘                    └──────────────────┘
```

---

## 📅 2. 예약 생성 플로우

### 2.1 예약 유형

#### STANDARD (일반 예약)
- 환자가 의사와 시간을 선택
- 즉시 예약 확정 (CONFIRMED)
- 플로우: 의사 선택 → 날짜/시간 선택 → 증상 입력 → 문진표 → 확인

#### QUICK (빠른 예약)
- 병원이 나중에 의사와 시간 할당
- 초기 상태: PENDING (대기)
- 플로우: 증상 입력 → 문진표 → 확인

---

### 2.2 시퀀스 다이어그램 - STANDARD 예약

```mermaid
sequenceDiagram
    participant Patient as 환자
    participant PatientApp as 환자앱
    participant HospitalAPI as Hospital Service
    participant AppointmentAPI as Appointment Service
    participant StorageAPI as Storage Service
    participant KafkaEvent as Kafka

    %% Step 1: 의사 및 시간 선택
    Patient->>PatientApp: 예약 생성 버튼 클릭
    PatientApp->>PatientApp: /appointments/new/standard
    
    Patient->>PatientApp: Step 1: 의사 선택
    PatientApp->>HospitalAPI: GET /api/v1/hospitals/{id}/doctors
    HospitalAPI-->>PatientApp: 의사 목록
    
    Patient->>PatientApp: 의사 선택 + 날짜/시간 선택
    PatientApp->>PatientApp: Zustand Store 저장<br/>(selectedDoctorId, selectedDate, selectedTimeSlot)
    
    %% Step 2: 증상 입력
    Patient->>PatientApp: Step 2: 증상 입력
    Patient->>PatientApp: 증상 설명 + 사진 업로드
    
    alt 사진 업로드
        PatientApp->>StorageAPI: POST /api/v1/storage/upload
        Note right of StorageAPI: Content-Type: multipart/form-data
        StorageAPI->>StorageAPI: S3 업로드
        StorageAPI-->>PatientApp: 200 OK + imageUrl
    end
    
    PatientApp->>PatientApp: Zustand Store 저장<br/>(symptoms, symptomImages)
    
    %% Step 3: 문진표 작성
    Patient->>PatientApp: Step 3: 문진표 작성
    Patient->>PatientApp: 알레르기, 복용약, 기저질환, 가족력 입력
    PatientApp->>PatientApp: Zustand Store 저장<br/>(questionnaireAnswers)
    
    %% Step 4: 확인 및 예약 생성
    Patient->>PatientApp: Step 4: 확인 및 예약 완료
    PatientApp->>AppointmentAPI: POST /api/v1/appointments
    Note right of AppointmentAPI: {<br/>  appointmentType: "STANDARD",<br/>  hospitalId: "xxx",<br/>  doctorId: "doc_xxx",<br/>  dateTime: "2024-01-15T14:00:00",<br/>  symptoms: "두통, 어지러움",<br/>  symptomImages: ["https://..."],<br/>  questionnaireAnswers: {...}<br/>}
    
    AppointmentAPI->>AppointmentAPI: 예약 생성 (CONFIRMED)
    AppointmentAPI->>KafkaEvent: Publish: appointment.created
    AppointmentAPI-->>PatientApp: 201 Created + Appointment
    Note left of AppointmentAPI: {<br/>  id: 123,<br/>  externalId: "appt_xxx",<br/>  status: "CONFIRMED",<br/>  appointmentNumber: "A20240115001"<br/>}
    
    PatientApp->>Patient: 예약 완료 토스트 표시
    PatientApp->>Patient: 예약 목록으로 이동 (/appointments)
```

---

### 2.3 시퀀스 다이어그램 - QUICK 예약

```mermaid
sequenceDiagram
    participant Patient as 환자
    participant PatientApp as 환자앱
    participant AppointmentAPI as Appointment Service
    participant KafkaEvent as Kafka

    Patient->>PatientApp: 빠른 예약 버튼 클릭
    PatientApp->>PatientApp: /appointments/new/quick
    
    %% Step 1: 증상 입력
    Patient->>PatientApp: Step 1: 증상 입력 (사진 업로드 가능)
    
    %% Step 2: 문진표 작성
    Patient->>PatientApp: Step 2: 문진표 작성
    
    %% Step 3: 확인 및 예약 생성
    Patient->>PatientApp: Step 3: 확인 및 예약 완료
    PatientApp->>AppointmentAPI: POST /api/v1/appointments
    Note right of AppointmentAPI: {<br/>  appointmentType: "QUICK",<br/>  hospitalId: "xxx",<br/>  doctorId: null,  // 나중에 할당<br/>  dateTime: null,  // 나중에 할당<br/>  symptoms: "...",<br/>  questionnaireAnswers: {...}<br/>}
    
    AppointmentAPI->>AppointmentAPI: 예약 생성 (PENDING)
    AppointmentAPI->>KafkaEvent: Publish: appointment.created
    AppointmentAPI-->>PatientApp: 201 Created + Appointment
    Note left of AppointmentAPI: {<br/>  id: 123,<br/>  status: "PENDING",<br/>  assignedAt: null<br/>}
    
    PatientApp->>Patient: 예약 완료 (병원에서 배정 대기)
    PatientApp->>Patient: 예약 목록으로 이동
```

---

### 2.4 API 명세 - 예약 생성

```
POST /api/v1/appointments
Authorization: Cookie (sid)
Content-Type: application/json

Request (STANDARD):
{
  "appointmentType": "STANDARD",
  "hospitalId": "hosp_abc123",
  "doctorId": "doc_xyz789",
  "dateTime": "2024-01-15T14:00:00Z",
  "symptoms": "두통, 어지러움",
  "symptomImages": ["https://s3.amazonaws.com/..."],
  "questionnaireAnswers": {
    "allergies": "페니실린 알레르기",
    "currentMedications": "혈압약",
    "chronicDiseases": "고혈압",
    "familyHistory": "당뇨"
  }
}

Request (QUICK):
{
  "appointmentType": "QUICK",
  "hospitalId": "hosp_abc123",
  "doctorId": null,
  "dateTime": null,
  "symptoms": "...",
  "questionnaireAnswers": {...}
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 123,
    "externalId": "appt_abc123",
    "appointmentNumber": "A20240115001",
    "patientId": 456,
    "hospitalId": "hosp_abc123",
    "doctorId": "doc_xyz789",
    "appointmentType": "STANDARD",
    "status": "CONFIRMED",
    "scheduledAt": "2024-01-15T14:00:00Z",
    "symptoms": "두통, 어지러움",
    "symptomImages": ["https://..."],
    "createdAt": "2024-01-10T10:00:00Z"
  }
}
```

---

## 💬 3. 채팅 플로우

### 3.1 시나리오
- 환자가 병원 코디네이터 또는 의사와 1:1 채팅
- Sendbird Chat SDK 사용
- 실시간 메시지 수신 (SSE)

### 3.2 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant Patient as 환자
    participant PatientApp as 환자앱
    participant ChatAPI as Messaging Service<br/>(Chat API)
    participant Sendbird as Sendbird Chat
    participant SSE as SSE Stream

    %% Step 1: 채팅 목록 조회
    Patient->>PatientApp: 채팅 탭 클릭 (/chat)
    PatientApp->>ChatAPI: GET /api/v1/chat/channels?userId={patientId}
    ChatAPI->>Sendbird: List Group Channels
    Sendbird-->>ChatAPI: Channels
    ChatAPI-->>PatientApp: 채팅 목록
    PatientApp->>Patient: 채팅 목록 표시
    
    %% Step 2: 채팅방 입장
    Patient->>PatientApp: 채팅방 선택
    PatientApp->>PatientApp: /chat/{channelUrl}
    PatientApp->>ChatAPI: GET /api/v1/chat/channels/{channelUrl}
    ChatAPI->>Sendbird: Get Channel Info
    Sendbird-->>ChatAPI: Channel
    ChatAPI-->>PatientApp: 채팅방 정보
    
    PatientApp->>ChatAPI: GET /api/v1/chat/channels/{channelUrl}/messages?limit=50
    ChatAPI->>Sendbird: Get Messages
    Sendbird-->>ChatAPI: Messages
    ChatAPI-->>PatientApp: 메시지 목록
    PatientApp->>Patient: 채팅 메시지 표시
    
    %% Step 3: SSE 연결 (실시간 메시지)
    PatientApp->>SSE: EventSource: /api/v1/chat/channels/{channelUrl}/stream
    Note right of SSE: SSE 연결 유지
    
    %% Step 4: 메시지 전송
    Patient->>PatientApp: 메시지 입력 및 전송
    PatientApp->>ChatAPI: POST /api/v1/chat/channels/{channelUrl}/messages
    Note right of ChatAPI: {<br/>  message: "안녕하세요",<br/>  userId: "pat_123",<br/>  customType: "text"<br/>}
    
    ChatAPI->>Sendbird: Send Message
    Sendbird->>Sendbird: Broadcast to Channel Members
    Sendbird-->>ChatAPI: Message
    ChatAPI-->>PatientApp: 201 Created + Message
    PatientApp->>Patient: 메시지 표시 (본인)
    
    %% Step 5: 실시간 메시지 수신 (SSE)
    Sendbird->>SSE: New Message Event
    SSE->>PatientApp: event: message<br/>data: {...}
    PatientApp->>Patient: 메시지 표시 (상대방)
```

---

## 🎥 4. 화상 진료 플로우

### 4.1 시나리오
- 예약 시간이 되면 환자가 진료실 입장
- Sendbird Video Call (SFU) 사용
- 실시간 음성 번역 (Translation Service)

### 4.2 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant Patient as 환자
    participant PatientApp as 환자앱
    participant VideoAPI as Video Call Service
    participant TranslationAPI as Translation Service
    participant Sendbird as Sendbird SFU
    participant Doctor as 의사 (병원앱)

    %% Step 1: 진료실 입장 버튼 클릭
    Patient->>PatientApp: 예약 상세에서 "진료 시작" 버튼
    PatientApp->>PatientApp: /consultation/room?appointmentId=123
    
    %% Step 2: 세션 조회 또는 생성
    PatientApp->>VideoAPI: GET /api/v1/video-calls/appointment/123
    
    alt 세션이 이미 있음
        VideoAPI-->>PatientApp: 200 OK + Session
    else 세션이 없음
        VideoAPI-->>PatientApp: 404 Not Found
        PatientApp->>VideoAPI: POST /api/v1/video-calls
        Note right of VideoAPI: {<br/>  appointmentId: 123,<br/>  patientId: 456,<br/>  doctorId: 0,<br/>  isVideoEnabled: true,<br/>  autoCreateRoom: true<br/>}
        VideoAPI->>Sendbird: Create Room
        Sendbird-->>VideoAPI: Room ID
        VideoAPI-->>PatientApp: 201 Created + Session
    end
    
    %% Step 3: 세션 참여 (Access Token 발급)
    PatientApp->>VideoAPI: POST /api/v1/video-calls/{sessionId}/join
    Note right of VideoAPI: {<br/>  userId: 456,<br/>  userType: "PATIENT",<br/>  isAudioEnabled: true,<br/>  isVideoEnabled: true<br/>}
    
    VideoAPI->>Sendbird: Generate Access Token
    Sendbird-->>VideoAPI: Access Token
    VideoAPI-->>PatientApp: 200 OK + Join Info
    Note left of VideoAPI: {<br/>  sendbirdUserId: "pat_456",<br/>  sendbirdAccessToken: "xxx",<br/>  sendbirdRoomId: "room_abc"<br/>}
    
    %% Step 4: Sendbird 인증 및 Room 입장
    PatientApp->>Sendbird: authenticate(userId, accessToken)
    Sendbird-->>PatientApp: Authenticated
    PatientApp->>Sendbird: connectWebSocket()
    Sendbird-->>PatientApp: Connected
    
    PatientApp->>PatientApp: getUserMedia (카메라, 마이크)
    PatientApp->>Sendbird: fetchRoomById(roomId)
    Sendbird-->>PatientApp: Room
    PatientApp->>Sendbird: room.enter({ audio: true, video: true })
    Sendbird-->>PatientApp: Entered
    
    PatientApp->>Patient: 로컬 비디오 표시
    
    %% Step 5: 의사 입장 (이미 입장했다고 가정)
    Note over Doctor: 의사가 이미 대기 중
    Sendbird->>PatientApp: onRemoteParticipantEntered
    PatientApp->>Patient: 원격 비디오 표시 (의사)
    
    %% Step 6: 실시간 번역 세션 생성
    PatientApp->>TranslationAPI: POST /api/v1/translations/sessions
    Note right of TranslationAPI: {<br/>  appointmentId: 123,<br/>  sourceLanguage: "th",<br/>  targetLanguage: "ko"<br/>}
    
    TranslationAPI-->>PatientApp: 201 Created + Session
    Note left of TranslationAPI: {<br/>  sessionId: "sess_abc",<br/>  websocketUrl: "wss://..."<br/>}
    
    PatientApp->>TranslationAPI: WebSocket 연결
    TranslationAPI->>PatientApp: 음성 → 텍스트 변환 → 번역 결과
    PatientApp->>Patient: 자막 표시 (한국어)
    
    %% Step 7: 진료 종료
    Patient->>PatientApp: 진료 종료 버튼
    PatientApp->>Sendbird: room.exit()
    Sendbird-->>PatientApp: Exited
    
    PatientApp->>VideoAPI: POST /api/v1/video-calls/{sessionId}/end
    VideoAPI->>VideoAPI: 세션 종료 (상태: COMPLETED)
    VideoAPI-->>PatientApp: 200 OK
    
    PatientApp->>TranslationAPI: DELETE /api/v1/translations/sessions/{sessionId}
    TranslationAPI-->>PatientApp: 200 OK
    
    PatientApp->>Patient: 진료 완료 → /appointments
```

---

## 💳 5. 결제 플로우

### 5.1 시나리오

#### Case 1: 진료비만 결제 (처방전 없음)
- 진료 완료 후 결제 페이지로 이동
- Omise.js로 결제 토큰 생성
- Payment Service에서 Charge 생성

#### Case 2: 진료비 + 약값 + 배송비 (처방전 있음)
- 진료 완료 후 처방전 발급
- 배송지 선택
- 배송비 견적 조회
- 총 금액 결제

### 5.2 시퀀스 다이어그램 - 진료비만 결제

```mermaid
sequenceDiagram
    participant Patient as 환자
    participant PatientApp as 환자앱
    participant PaymentAPI as Payment Service
    participant OmiseJS as Omise.js
    participant OmiseGateway as Omise Gateway
    participant KafkaEvent as Kafka

    %% Step 1: 결제 페이지 진입
    Patient->>PatientApp: 진료 완료 후 결제 버튼
    PatientApp->>PatientApp: /appointments/{id}/payment
    
    PatientApp->>PaymentAPI: GET /api/v1/payments/appointment/{appointmentId}
    
    alt 결제 정보 있음
        PaymentAPI-->>PatientApp: 200 OK + Payment
    else 결제 정보 없음
        PaymentAPI-->>PatientApp: 404 Not Found
        Note over PatientApp: 새 결제 생성 필요
    end
    
    PatientApp->>Patient: 결제 금액 표시<br/>(진료비 + 서비스비)
    
    %% Step 2: 결제 수단 선택
    Patient->>PatientApp: 결제 수단 선택 (카드 or QR)
    
    alt 카드 결제
        Patient->>PatientApp: 카드 정보 입력
        PatientApp->>OmiseJS: Omise.createToken(card)
        OmiseJS->>OmiseGateway: Tokenize Card
        OmiseGateway-->>OmiseJS: tokn_xxx
        OmiseJS-->>PatientApp: Token
    else QR 결제 (PromptPay)
        Note over PatientApp: QR 코드는 Charge 생성 후 표시
    end
    
    %% Step 3: Charge 생성
    PatientApp->>PaymentAPI: POST /api/v1/payments/charge
    Note right of PaymentAPI: {<br/>  appointmentId: 123,<br/>  paymentMethod: "card",<br/>  omiseToken: "tokn_xxx",<br/>  amount: 500.00,<br/>  currency: "THB",<br/>  returnUri: "https://..."<br/>}
    
    PaymentAPI->>PaymentAPI: Payment 생성 (PENDING)
    PaymentAPI->>OmiseGateway: Create Charge
    Note right of OmiseGateway: {<br/>  amount: 50000 (satang),<br/>  currency: "thb",<br/>  card: "tokn_xxx"<br/>}
    
    OmiseGateway-->>PaymentAPI: chrg_xxx (status: successful)
    PaymentAPI->>PaymentAPI: Payment 업데이트 (SUCCESS)
    PaymentAPI->>KafkaEvent: Publish: payment.completed
    PaymentAPI-->>PatientApp: 200 OK + Payment
    
    PatientApp->>Patient: 결제 완료 페이지 → /appointments/payment/complete
```

---

### 5.3 시퀀스 다이어그램 - 약값 + 배송비 포함

```mermaid
sequenceDiagram
    participant Patient as 환자
    participant PatientApp as 환자앱
    participant DeliveryAPI as Patient Service<br/>(Delivery Address)
    participant ShippingAPI as Shipping Service
    participant PaymentAPI as Payment Service
    participant OmiseGateway as Omise Gateway

    %% Step 1: 결제 페이지 진입
    Patient->>PatientApp: 처방전 있는 예약 결제
    PatientApp->>PatientApp: /appointments/{id}/payment-with-prescription
    
    %% Step 2: 배송지 선택
    PatientApp->>DeliveryAPI: GET /api/v1/delivery-addresses?patientId={id}
    DeliveryAPI-->>PatientApp: 배송지 목록
    PatientApp->>Patient: 배송지 선택
    
    Patient->>PatientApp: 배송지 선택 (기존 또는 신규)
    
    alt 신규 배송지 추가
        Patient->>PatientApp: 배송지 정보 입력
        PatientApp->>DeliveryAPI: POST /api/v1/delivery-addresses
        DeliveryAPI-->>PatientApp: 201 Created
    end
    
    %% Step 3: 배송비 견적 조회
    PatientApp->>ShippingAPI: POST /api/v1/shipments/quote
    Note right of ShippingAPI: {<br/>  appointmentId: 123,<br/>  deliveryAddressId: "addr_xxx",<br/>  parcelValue: 200.00<br/>}
    
    ShippingAPI->>ShippingAPI: Shippop API 호출
    ShippingAPI-->>PatientApp: 200 OK + Quote
    Note left of ShippingAPI: {<br/>  shippingCost: 50.00,<br/>  estimatedDays: 2,<br/>  courier: "Kerry Express"<br/>}
    
    PatientApp->>Patient: 총 금액 표시<br/>(진료비 + 조제비 + 배송비)
    
    %% Step 4: 결제
    Patient->>PatientApp: 결제하기
    PatientApp->>PaymentAPI: POST /api/v1/payments/charge
    Note right of PaymentAPI: {<br/>  appointmentId: 123,<br/>  amount: 750.00,  // 진료비 500 + 조제비 200 + 배송비 50<br/>  currency: "THB",<br/>  deliveryAddressId: "addr_xxx"<br/>}
    
    PaymentAPI->>OmiseGateway: Create Charge
    OmiseGateway-->>PaymentAPI: chrg_xxx (SUCCESS)
    PaymentAPI-->>PatientApp: 200 OK + Payment
    
    %% Step 5: 배송 생성 (Kafka Event Listener)
    Note over ShippingAPI: Kafka: payment.completed 수신
    ShippingAPI->>ShippingAPI: Shipment 생성 (PENDING)
    ShippingAPI->>ShippingAPI: Shippop 예약 (나중에)
    
    PatientApp->>Patient: 결제 완료 + 배송 추적 안내
```

---

## 📦 6. 약 배송 추적 플로우

### 6.1 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant Patient as 환자
    participant PatientApp as 환자앱
    participant ShippingAPI as Shipping Service
    participant Shippop as Shippop API

    %% Step 1: 배송 목록 조회
    Patient->>PatientApp: 약 배송 탭 (/medications)
    PatientApp->>ShippingAPI: GET /api/v1/shipments?patientId={id}
    ShippingAPI-->>PatientApp: 배송 목록
    PatientApp->>Patient: 배송 카드 목록 표시
    
    %% Step 2: 배송 상세 조회
    Patient->>PatientApp: 배송 카드 클릭
    PatientApp->>PatientApp: /medications/{id}
    PatientApp->>ShippingAPI: GET /api/v1/shipments/{id}
    ShippingAPI-->>PatientApp: 배송 정보
    PatientApp->>Patient: 배송 상세 표시<br/>(주문 정보, 배송지, 상태)
    
    %% Step 3: 실시간 배송 추적
    Patient->>PatientApp: 배송 추적 버튼
    PatientApp->>PatientApp: /medications/live-delivery-tracking
    
    PatientApp->>ShippingAPI: GET /api/v1/shipments/tracking/{trackingNumber}
    ShippingAPI->>Shippop: GET /tracking/{trackingNumber}
    Shippop-->>ShippingAPI: Tracking Info
    Note left of Shippop: {<br/>  status: "IN_TRANSIT",<br/>  location: "...",<br/>  estimatedDelivery: "2024-01-16"<br/>}
    
    ShippingAPI-->>PatientApp: 200 OK + Tracking
    PatientApp->>Patient: 지도에 배송 위치 표시
```

---

## 🏥 7. 개인 건강 기록 (PHR) 플로우

### 7.1 시나리오
- 환자가 자신의 건강 정보를 관리
- 카테고리: 알레르기, 복용약, 진단 기록, 수술 기록, 예방접종 등

### 7.2 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant Patient as 환자
    participant PatientApp as 환자앱
    participant PHRAPI as Patient Service<br/>(PHR API)

    %% Step 1: PHR 대시보드
    Patient->>PatientApp: PHR 탭 (/phr)
    PatientApp->>PHRAPI: GET /api/v1/phr?patientId={id}
    PHRAPI-->>PatientApp: PHR 요약 (카테고리별 개수)
    PatientApp->>Patient: 대시보드 표시
    
    %% Step 2: 카테고리별 목록 조회
    Patient->>PatientApp: "알레르기" 카테고리 클릭
    PatientApp->>PatientApp: /phr/allergies
    PatientApp->>PHRAPI: GET /api/v1/phr/allergies?patientId={id}
    PHRAPI-->>PatientApp: 알레르기 목록
    PatientApp->>Patient: 목록 표시
    
    %% Step 3: 새 기록 추가
    Patient->>PatientApp: "추가" 버튼
    PatientApp->>PatientApp: /phr/allergies/add
    Patient->>PatientApp: 알레르기 정보 입력
    PatientApp->>PHRAPI: POST /api/v1/phr/allergies
    Note right of PHRAPI: {<br/>  patientId: 123,<br/>  allergen: "페니실린",<br/>  severity: "HIGH",<br/>  reaction: "발진"<br/>}
    
    PHRAPI-->>PatientApp: 201 Created
    PatientApp->>Patient: 추가 완료 → 목록으로
```

---

## 🌐 8. 다국어 지원

### 8.1 지원 언어
- 한국어 (ko)
- 영어 (en)
- 태국어 (th)

### 8.2 구현
- **i18n**: react-i18next
- **번역 파일**: `src/locales/{lang}/translation.json`
- **언어 변경**: Settings 페이지에서 변경
- **저장**: localStorage (`i18nextLng`)

---

## 📱 9. 환자앱 전체 화면 목록

### 인증
- `/auth/phone-verification` - 전화번호 인증
- `/auth/service-registration` - 프로필 등록

### 예약
- `/appointments` - 예약 목록 (Pending/Confirmed/Completed/Cancelled)
- `/appointments/new` - 예약 유형 선택 (STANDARD/QUICK)
- `/appointments/new/standard` - 일반 예약 (4단계)
- `/appointments/new/quick` - 빠른 예약 (3단계)
- `/appointments/:id` - 예약 상세 (상태별 UI 다름)
- `/appointments/:id/edit` - 예약 수정
- `/appointments/edit/complete` - 예약 수정 완료
- `/appointments/:id/payment` - 결제 (진료비만)
- `/appointments/:id/payment-with-prescription` - 결제 (약값 포함)
- `/appointments/payment/complete` - 결제 완료

### 약 배송
- `/medications` - 배송 목록
- `/medications/:id` - 배송 상세
- `/medications/delivery-tracking` - 배송 추적
- `/medications/live-delivery-tracking` - 실시간 배송 추적

### 진료
- `/consultation/room` - 화상 진료실

### PHR
- `/phr` - PHR 대시보드
- `/phr/:type` - 카테고리별 목록 (allergies, medications, diagnoses 등)
- `/phr/:type/add` - 새 기록 추가

### 채팅
- `/chat` - 채팅 목록
- `/chat/:channelUrl` - 채팅방

### 마이페이지
- `/mypage` - 마이페이지
- `/mypage/profile` - 프로필 수정
- `/mypage/delivery` - 배송지 관리
- `/mypage/announcements` - 공지사항 목록
- `/mypage/announcement/:id` - 공지사항 상세
- `/mypage/terms` - 약관 목록
- `/mypage/terms/:id` - 약관 상세
- `/mypage/faq` - FAQ
- `/mypage/settings` - 설정 (언어, 알림)

### 에러
- `/error/403` - 권한 없음
- `/error/404` - 페이지 없음
- `/error/500` - 서버 오류
- `/error/expired` - 세션 만료

---

## 🔗 10. 주요 API 엔드포인트 요약

### Patient Service (Port: 18081)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/otp/send` | OTP 발송 |
| POST | `/api/auth/otp/verify` | OTP 검증 + tempJwt 발급 |
| GET | `/api/auth/profile` | 프로필 조회 |
| POST | `/api/auth/profile/complete` | 프로필 완성 (회원가입) |
| GET | `/api/v1/delivery-addresses` | 배송지 목록 |
| POST | `/api/v1/delivery-addresses` | 배송지 추가 |
| GET | `/api/v1/phr` | PHR 요약 |
| GET | `/api/v1/phr/{category}` | PHR 카테고리별 목록 |
| POST | `/api/v1/phr/{category}` | PHR 추가 |

### Appointment Service (Port: 18083)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/appointments` | 예약 생성 |
| GET | `/api/v1/appointments` | 예약 목록 |
| GET | `/api/v1/appointments/{id}` | 예약 상세 |
| PUT | `/api/v1/appointments/{id}` | 예약 수정 |
| DELETE | `/api/v1/appointments/{id}` | 예약 취소 |

### Payment Service (Port: 18085)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/payments/charge` | Charge 생성 |
| GET | `/api/v1/payments/{id}` | 결제 조회 |
| GET | `/api/v1/payments/appointment/{id}` | 예약별 결제 조회 |

### Shipping Service (Port: 18090)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/shipments/quote` | 배송비 견적 |
| POST | `/api/v1/shipments` | 배송 생성 |
| GET | `/api/v1/shipments/{id}` | 배송 조회 |
| GET | `/api/v1/shipments/tracking/{trackingNumber}` | 배송 추적 |

### Messaging Service (Port: 18084)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/chat/channels` | 채팅 목록 |
| GET | `/api/v1/chat/channels/{channelUrl}` | 채팅방 정보 |
| GET | `/api/v1/chat/channels/{channelUrl}/messages` | 메시지 목록 |
| POST | `/api/v1/chat/channels/{channelUrl}/messages` | 메시지 전송 |
| GET | `/api/v1/chat/channels/{channelUrl}/stream` | SSE 스트림 |

### Video Call Service (Port: 18089)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/video-calls` | 세션 생성 |
| GET | `/api/v1/video-calls/{id}` | 세션 조회 |
| GET | `/api/v1/video-calls/appointment/{id}` | 예약별 세션 조회 |
| POST | `/api/v1/video-calls/{id}/join` | 세션 참여 |
| POST | `/api/v1/video-calls/{id}/end` | 세션 종료 |

### Translation Service (Port: 18088)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/translations/sessions` | 번역 세션 생성 |
| DELETE | `/api/v1/translations/sessions/{id}` | 번역 세션 종료 |
| WebSocket | `/api/v1/translations/sessions/{id}/stream` | 실시간 번역 |

### Storage Service (Port: 18087)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/storage/upload` | 파일 업로드 (S3) |
| GET | `/api/v1/storage/download/{key}` | 파일 다운로드 |

---

## ✅ 다음 단계
- 병원앱 플로우 문서 작성
- 전체 통합 프로세스 플로우 작성
- API 누락 분석 및 개발 계획 수립


# 병원앱 (Hospital App) - 유저 플로우 및 시퀀스

## 🏥 병원앱 개요

병원 직원(코디네이터, 의사)이 환자 예약 및 진료를 관리하는 웹 애플리케이션

**주요 사용자**:
- **코디네이터**: 예약 관리, 환자 등록, 의사 배정
- **의사**: 진료 수행, 처방전 발급, 진료 기록 작성

**주요 기능**:
- 로그인 (ID/PW 기반)
- 대시보드 (일일 통계)
- 예약 관리 (Pending → Confirmed → In Progress → Completed)
- 환자 관리 (등록, 조회, 수정)
- 의사 관리 (등록, 스케줄 관리)
- 화상 진료 (Sendbird Video Call)
- 채팅 (환자와 1:1 채팅)
- 결제 내역 조회
- 진료 기록 작성
- 다국어 지원 (한국어, 영어, 태국어)

---

## 🔐 1. 로그인 플로우

### 1.1 사용자 시나리오

#### 병원 직원 로그인
1. 아이디/비밀번호 입력
2. 로그인 API 호출
3. Access Token 발급
4. 대시보드로 이동

**인증 전략**:
- JWT 기반 (Access Token)
- localStorage에 저장
- 유효기간: 24시간
- 자동 로그인 (Remember Me)

---

### 1.2 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant Staff as 병원 직원
    participant HospitalApp as 병원앱
    participant AuthAPI as Hospital Service<br/>(Auth API)
    participant DB as Database

    %% Step 1: 로그인 페이지
    Staff->>HospitalApp: 로그인 페이지 접속 (/login)
    
    %% Step 2: 로그인
    Staff->>HospitalApp: 아이디/비밀번호 입력
    HospitalApp->>HospitalApp: 유효성 검증
    
    HospitalApp->>AuthAPI: POST /api/v1/auth/login
    Note right of AuthAPI: {<br/>  username: "coordinator1",<br/>  password: "password123",<br/>  rememberMe: true<br/>}
    
    AuthAPI->>DB: 사용자 조회 (username)
    DB-->>AuthAPI: User
    AuthAPI->>AuthAPI: 비밀번호 검증 (BCrypt)
    
    alt 로그인 성공
        AuthAPI->>AuthAPI: JWT 생성 (Access Token)
        AuthAPI-->>HospitalApp: 200 OK + Token
        Note left of AuthAPI: {<br/>  accessToken: "eyJhbG...",<br/>  tokenType: "Bearer",<br/>  expiresIn: 86400,<br/>  user: {<br/>    id: 1,<br/>    username: "coordinator1",<br/>    name: "홍길동",<br/>    role: "COORDINATOR",<br/>    hospitalId: 1<br/>  }<br/>}
        
        HospitalApp->>HospitalApp: localStorage에 저장<br/>(accessToken, user)
        HospitalApp->>Staff: 대시보드로 이동 (/dashboard)
    else 로그인 실패
        AuthAPI-->>HospitalApp: 401 Unauthorized
        Note left of AuthAPI: {<br/>  error: {<br/>    code: "INVALID_CREDENTIALS",<br/>    message: "아이디 또는 비밀번호가 올바르지 않습니다."<br/>  }<br/>}
        
        HospitalApp->>Staff: 에러 메시지 표시
    end
```

---

### 1.3 API 명세 - 로그인

```
POST /api/v1/auth/login
Content-Type: application/json

Request:
{
  "username": "coordinator1",
  "password": "password123",
  "rememberMe": true
}

Response (200 OK):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "username": "coordinator1",
      "name": "홍길동",
      "role": "COORDINATOR",
      "hospitalId": 1,
      "hospitalName": "Global Medical Center"
    }
  }
}

Response (401 Unauthorized):
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "아이디 또는 비밀번호가 올바르지 않습니다."
  }
}
```

---

## 📊 2. 대시보드

### 2.1 사용자 시나리오
- 오늘의 예약 통계 (대기/확정/완료/취소)
- 최근 예약 목록 (빠른 접근)
- 금일 진료 완료 건수
- 금일 매출

### 2.2 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant Staff as 병원 직원
    participant HospitalApp as 병원앱
    participant DashboardAPI as Hospital Service<br/>(Dashboard API)

    Staff->>HospitalApp: 대시보드 접속 (/dashboard)
    HospitalApp->>DashboardAPI: GET /api/v1/dashboard/stats?date=2024-01-15
    Note right of DashboardAPI: Authorization: Bearer {accessToken}
    
    DashboardAPI->>DashboardAPI: 통계 계산
    DashboardAPI-->>HospitalApp: 200 OK + Stats
    Note left of DashboardAPI: {<br/>  totalAppointments: 45,<br/>  pending: 12,<br/>  confirmed: 18,<br/>  inProgress: 3,<br/>  completed: 10,<br/>  cancelled: 2,<br/>  totalRevenue: 22500.00,<br/>  recentAppointments: [...]<br/>}
    
    HospitalApp->>Staff: 대시보드 표시
```

---

## 📅 3. 예약 관리 플로우

### 3.1 예약 상태 전환

```
PENDING (대기) → CONFIRMED (확정) → IN_PROGRESS (진행 중) → COMPLETED (완료)
                                ↓
                            CANCELLED (취소)
```

### 3.2 코디네이터 역할

#### PENDING 예약 처리 (QUICK 예약)
1. 예약 목록 조회 (Waiting 탭)
2. 예약 상세 확인 (증상, 문진표)
3. 의사 배정
4. 날짜/시간 배정
5. 예약 확정 (PENDING → CONFIRMED)

#### CONFIRMED 예약 관리
1. 예약 목록 조회 (Confirmed 탭)
2. 예약 상세 확인
3. 환자와 채팅 (필요 시)
4. 예약 수정 (날짜/시간/의사 변경)
5. 예약 취소 (Cancellation Reason 입력)

---

### 3.3 시퀀스 다이어그램 - PENDING 예약 확정

```mermaid
sequenceDiagram
    participant Coordinator as 코디네이터
    participant HospitalApp as 병원앱
    participant AppointmentAPI as Hospital Service<br/>(Appointment Replica)
    participant DoctorAPI as Hospital Service<br/>(Doctor API)
    participant KafkaEvent as Kafka
    participant AppointmentService as Appointment Service

    %% Step 1: 대기 예약 목록 조회
    Coordinator->>HospitalApp: 예약 탭 → Waiting
    HospitalApp->>AppointmentAPI: GET /api/v1/appointments?status=PENDING
    AppointmentAPI-->>HospitalApp: PENDING 예약 목록
    HospitalApp->>Coordinator: 대기 예약 테이블 표시
    
    %% Step 2: 예약 상세 확인
    Coordinator->>HospitalApp: 예약 클릭
    HospitalApp->>HospitalApp: /appointment/{appointmentSequence}
    HospitalApp->>AppointmentAPI: GET /api/v1/appointments/{sequence}
    AppointmentAPI-->>HospitalApp: 예약 상세 (증상, 문진표)
    HospitalApp->>Coordinator: 예약 상세 표시
    
    %% Step 3: 의사 배정
    Coordinator->>HospitalApp: "Confirm" 버튼 클릭
    HospitalApp->>HospitalApp: 의사 선택 모달 표시
    
    HospitalApp->>DoctorAPI: GET /api/v1/doctors?status=ACTIVE
    DoctorAPI-->>HospitalApp: 의사 목록
    
    Coordinator->>HospitalApp: 의사 선택 + 날짜/시간 선택
    HospitalApp->>AppointmentAPI: PUT /api/v1/appointments/{sequence}
    Note right of AppointmentAPI: {<br/>  doctorId: 5,<br/>  scheduledAt: "2024-01-16T14:00:00",<br/>  status: "CONFIRMED"<br/>}
    
    AppointmentAPI->>KafkaEvent: Publish: appointment.confirmed
    Note right of KafkaEvent: Topic: appointment-events<br/>Event: AppointmentConfirmedEvent
    
    AppointmentService->>AppointmentService: Kafka Consumer: 예약 업데이트
    
    AppointmentAPI-->>HospitalApp: 200 OK + Updated Appointment
    HospitalApp->>Coordinator: 예약 확정 완료 토스트
    HospitalApp->>Coordinator: Confirmed 탭으로 이동
```

---

### 3.4 시퀀스 다이어그램 - 예약 취소

```mermaid
sequenceDiagram
    participant Coordinator as 코디네이터
    participant HospitalApp as 병원앱
    participant AppointmentAPI as Hospital Service<br/>(Appointment Replica)
    participant KafkaEvent as Kafka
    participant MessagingService as Messaging Service<br/>(Notification)
    participant Patient as 환자 (알림)

    Coordinator->>HospitalApp: 예약 상세에서 "Cancel" 버튼
    HospitalApp->>HospitalApp: 취소 사유 입력 다이얼로그 표시
    
    Coordinator->>HospitalApp: 취소 사유 입력 + 확인
    HospitalApp->>AppointmentAPI: PUT /api/v1/appointments/{sequence}/cancel
    Note right of AppointmentAPI: {<br/>  cancellationReason: "의사 부재",<br/>  cancelledBy: "HOSPITAL"<br/>}
    
    AppointmentAPI->>KafkaEvent: Publish: appointment.cancelled
    AppointmentAPI-->>HospitalApp: 200 OK
    
    %% 알림 전송
    MessagingService->>MessagingService: Kafka: appointment.cancelled 수신
    MessagingService->>MessagingService: SMS 발송 준비
    MessagingService->>Patient: SMS 발송 (예약 취소 안내)
    
    HospitalApp->>Coordinator: 취소 완료 토스트
    HospitalApp->>Coordinator: Cancelled 탭으로 이동
```

---

### 3.5 시퀀스 다이어그램 - 환자와 채팅

```mermaid
sequenceDiagram
    participant Coordinator as 코디네이터
    participant HospitalApp as 병원앱
    participant ChatAPI as Messaging Service<br/>(Chat API)
    participant Sendbird as Sendbird Chat
    participant Patient as 환자

    %% Step 1: 채팅 시작
    Coordinator->>HospitalApp: 예약 상세에서 "Chat" 버튼
    HospitalApp->>ChatAPI: POST /api/v1/chat/channels
    Note right of ChatAPI: {<br/>  userIds: [<br/>    "staff_1",  // Coordinator<br/>    "pat_123"   // Patient<br/>  ],<br/>  customType: "STAFF_INITIATED",<br/>  appointmentId: 123,<br/>  hospitalId: 1<br/>}
    
    ChatAPI->>Sendbird: Create Group Channel
    Sendbird-->>ChatAPI: Channel
    ChatAPI-->>HospitalApp: 201 Created + Channel
    Note left of ChatAPI: {<br/>  channelUrl: "sendbird_group_channel_xxx",<br/>  members: [...],<br/>  customType: "STAFF_INITIATED"<br/>}
    
    HospitalApp->>HospitalApp: 채팅 플로팅 윈도우 열기
    HospitalApp->>Coordinator: 채팅 UI 표시
    
    %% Step 2: 메시지 전송
    Coordinator->>HospitalApp: 메시지 입력 및 전송
    HospitalApp->>ChatAPI: POST /api/v1/chat/channels/{channelUrl}/messages
    ChatAPI->>Sendbird: Send Message
    Sendbird->>Patient: 실시간 메시지 전송 (SSE or WebSocket)
    Sendbird-->>ChatAPI: Message
    ChatAPI-->>HospitalApp: 201 Created
    HospitalApp->>Coordinator: 메시지 표시
```

---

## 👥 4. 환자 관리 플로우

### 4.1 코디네이터 역할
- 환자 등록 (Walk-in 환자)
- 환자 조회 (검색: 이름, 전화번호, Thai ID)
- 환자 상세 조회 (기본 정보, 건강 정보, 예약 기록, 진료 기록)
- 환자 정보 수정

---

### 4.2 시퀀스 다이어그램 - 환자 등록

```mermaid
sequenceDiagram
    participant Coordinator as 코디네이터
    participant HospitalApp as 병원앱
    participant PatientAPI as Hospital Service<br/>(Patient Replica)
    participant PatientService as Patient Service
    participant KafkaEvent as Kafka

    %% Step 1: 환자 등록 페이지
    Coordinator->>HospitalApp: 환자 탭 → "등록" 버튼
    HospitalApp->>HospitalApp: /patient/new
    
    %% Step 2: 환자 정보 입력
    Coordinator->>HospitalApp: 환자 정보 입력
    Note over Coordinator: - 이름, 성별, 생년월일<br/>- 전화번호, Thai ID<br/>- 주소, 우편번호<br/>- 키, 몸무게, 혈액형<br/>- 음주, 흡연 습관<br/>- 복용약, 기저질환, 가족력
    
    HospitalApp->>HospitalApp: 유효성 검증
    HospitalApp->>PatientAPI: POST /api/v1/patients
    Note right of PatientAPI: {<br/>  name: "John Doe",<br/>  phone: "0812345678",<br/>  phoneCountryCode: "+66",<br/>  birthDate: "1990-01-01",<br/>  gender: "MALE",<br/>  thaiId: "1234567890123",<br/>  address: "...",<br/>  height: "175",<br/>  weight: "70",<br/>  bloodType: "A+"<br/>}
    
    PatientAPI->>PatientService: REST API 호출 (또는 Kafka Event)
    PatientService->>PatientService: Patient 생성
    PatientService->>KafkaEvent: Publish: patient.created
    PatientService-->>PatientAPI: 201 Created + Patient
    
    PatientAPI->>KafkaEvent: Kafka Consumer: PatientReplica 생성
    PatientAPI-->>HospitalApp: 201 Created
    Note left of PatientAPI: {<br/>  id: 123,<br/>  externalId: "pat_abc",<br/>  name: "John Doe",<br/>  phone: "0812345678"<br/>}
    
    HospitalApp->>Coordinator: 등록 완료 → 환자 목록
```

---

### 4.3 시퀀스 다이어그램 - 환자 조회 및 상세

```mermaid
sequenceDiagram
    participant Coordinator as 코디네이터
    participant HospitalApp as 병원앱
    participant PatientAPI as Hospital Service<br/>(Patient Replica)
    participant AppointmentAPI as Hospital Service<br/>(Appointment Replica)

    %% Step 1: 환자 목록 조회
    Coordinator->>HospitalApp: 환자 탭
    HospitalApp->>PatientAPI: GET /api/v1/patients?search=John&page=1&size=10
    PatientAPI-->>HospitalApp: 환자 목록 (Pagination)
    HospitalApp->>Coordinator: 환자 테이블 표시
    
    %% Step 2: 환자 상세 조회
    Coordinator->>HospitalApp: 환자 클릭
    HospitalApp->>HospitalApp: /patient/{id}
    
    %% 환자 기본 정보
    HospitalApp->>PatientAPI: GET /api/v1/patients/{id}
    PatientAPI-->>HospitalApp: 환자 상세 정보
    
    %% 환자 예약 기록
    HospitalApp->>AppointmentAPI: GET /api/v1/appointments?patientId={id}
    AppointmentAPI-->>HospitalApp: 예약 기록 목록
    
    HospitalApp->>Coordinator: 환자 상세 페이지 표시<br/>(기본 정보 + 예약 기록)
```

---

## 👨‍⚕️ 5. 의사 관리 플로우

### 5.1 코디네이터 역할
- 의사 등록
- 의사 조회
- 의사 스케줄 관리 (근무 시간, 휴무일)
- 의사 계정 활성화/비활성화

---

### 5.2 시퀀스 다이어그램 - 의사 등록

```mermaid
sequenceDiagram
    participant Coordinator as 코디네이터
    participant HospitalApp as 병원앱
    participant DoctorAPI as Hospital Service<br/>(Doctor API)

    Coordinator->>HospitalApp: 의사 탭 → "등록" 버튼
    HospitalApp->>HospitalApp: /doctor/new
    
    Coordinator->>HospitalApp: 의사 정보 입력
    Note over Coordinator: - 이름, 전문과<br/>- 면허 번호<br/>- 경력, 학력<br/>- 진료 가능 언어<br/>- 진료 시간
    
    HospitalApp->>DoctorAPI: POST /api/v1/doctors
    Note right of DoctorAPI: {<br/>  name: "Dr. Smith",<br/>  specialty: "CARDIOLOGY",<br/>  licenseNumber: "TH12345",<br/>  languages: ["en", "th"],<br/>  workingHours: {...}<br/>}
    
    DoctorAPI->>DoctorAPI: Doctor 생성
    DoctorAPI-->>HospitalApp: 201 Created + Doctor
    HospitalApp->>Coordinator: 등록 완료 → 의사 목록
```

---

## 🎥 6. 화상 진료 플로우 (의사)

### 6.1 의사 역할
- 예약 시간에 진료실 입장
- 환자와 화상 통화
- 실시간 번역 (필요 시)
- 진료 기록 작성
- 처방전 발급
- 진료 종료

---

### 6.2 시퀀스 다이어그램 - 진료 시작 및 완료

```mermaid
sequenceDiagram
    participant Doctor as 의사
    participant HospitalApp as 병원앱
    participant VideoAPI as Video Call Service
    participant Sendbird as Sendbird SFU
    participant AppointmentAPI as Appointment Service
    participant KafkaEvent as Kafka
    participant Patient as 환자 (환자앱)

    %% Step 1: 진료 시작
    Doctor->>HospitalApp: 예약 상세에서 "진료 시작" 버튼
    HospitalApp->>HospitalApp: /consultation/{appointmentSequence}
    
    HospitalApp->>VideoAPI: GET /api/v1/video-calls/appointment/{id}
    
    alt 세션 있음
        VideoAPI-->>HospitalApp: 200 OK + Session
    else 세션 없음
        VideoAPI-->>HospitalApp: 404 Not Found
        HospitalApp->>VideoAPI: POST /api/v1/video-calls
        VideoAPI->>Sendbird: Create Room
        Sendbird-->>VideoAPI: Room ID
        VideoAPI-->>HospitalApp: 201 Created + Session
    end
    
    %% Step 2: 세션 참여
    HospitalApp->>VideoAPI: POST /api/v1/video-calls/{sessionId}/join
    Note right of VideoAPI: {<br/>  userId: {doctorId},<br/>  userType: "DOCTOR",<br/>  isAudioEnabled: true,<br/>  isVideoEnabled: true<br/>}
    
    VideoAPI->>Sendbird: Generate Access Token
    Sendbird-->>VideoAPI: Access Token
    VideoAPI-->>HospitalApp: 200 OK + Join Info
    
    HospitalApp->>Sendbird: authenticate + connectWebSocket
    HospitalApp->>Sendbird: room.enter()
    Sendbird-->>HospitalApp: Entered
    
    HospitalApp->>Doctor: 진료실 화면 표시 (환자 대기 중)
    
    %% Step 3: 환자 입장 (이미 대기 중이거나 새로 입장)
    Patient->>Sendbird: room.enter()
    Sendbird->>HospitalApp: onRemoteParticipantEntered
    HospitalApp->>Doctor: 환자 비디오 표시
    
    %% Step 4: 진료 진행 (대화, 진찰)
    Note over Doctor,Patient: 화상 진료 진행 중
    
    %% Step 5: 진료 기록 작성
    Doctor->>HospitalApp: 진료 종료 버튼
    HospitalApp->>HospitalApp: 진료 기록 입력 모달
    Doctor->>HospitalApp: 진료 기록 입력<br/>(진단명, 처방, 메모)
    
    HospitalApp->>AppointmentAPI: PUT /api/v1/appointments/{id}/complete
    Note right of AppointmentAPI: {<br/>  status: "COMPLETED",<br/>  diagnosis: "감기",<br/>  prescription: "타이레놀 500mg",<br/>  medicalNotes: "충분한 휴식 필요"<br/>}
    
    AppointmentAPI->>AppointmentAPI: 예약 상태 변경 (COMPLETED)
    AppointmentAPI->>KafkaEvent: Publish: appointment.completed
    AppointmentAPI-->>HospitalApp: 200 OK
    
    %% Step 6: 화상 통화 종료
    HospitalApp->>Sendbird: room.exit()
    Sendbird-->>HospitalApp: Exited
    HospitalApp->>VideoAPI: POST /api/v1/video-calls/{sessionId}/end
    VideoAPI-->>HospitalApp: 200 OK
    
    HospitalApp->>Doctor: 진료 완료 → 예약 목록 (Completed 탭)
```

---

## 💊 7. 처방전 발급 및 약 배송

### 7.1 의사 역할
- 진료 완료 시 처방전 발급 여부 선택
- 처방전 발급 시 약 정보 입력
- 배송 필요 여부 선택

### 7.2 시퀀스 다이어그램 - 처방전 발급

```mermaid
sequenceDiagram
    participant Doctor as 의사
    participant HospitalApp as 병원앱
    participant AppointmentAPI as Appointment Service
    participant ShippingAPI as Shipping Service
    participant KafkaEvent as Kafka
    participant Patient as 환자 (알림)

    %% Step 1: 진료 완료 시 처방전 발급
    Doctor->>HospitalApp: 진료 기록 입력 중<br/>"처방전 발급" 체크
    Doctor->>HospitalApp: 약 정보 입력
    Note over Doctor: - 약 이름, 용량<br/>- 복용 방법<br/>- 복용 기간
    
    HospitalApp->>AppointmentAPI: PUT /api/v1/appointments/{id}/complete
    Note right of AppointmentAPI: {<br/>  status: "COMPLETED",<br/>  prescription: {<br/>    medications: [<br/>      {<br/>        name: "Tylenol",<br/>        dosage: "500mg",<br/>        frequency: "TID",<br/>        duration: "3 days"<br/>      }<br/>    ],<br/>    requiresDelivery: true<br/>  }<br/>}
    
    AppointmentAPI->>KafkaEvent: Publish: appointment.completed (with prescription)
    AppointmentAPI-->>HospitalApp: 200 OK
    
    %% Step 2: 배송 필요 시 Shipment 생성 (Kafka Event Listener)
    ShippingAPI->>ShippingAPI: Kafka: appointment.completed 수신
    alt requiresDelivery = true
        ShippingAPI->>ShippingAPI: Shipment 생성 (PENDING)<br/>(환자가 결제 완료 후 배송 시작)
    end
    
    HospitalApp->>Doctor: 진료 완료 + 처방전 발급 완료
```

---

## 💳 8. 결제 내역 조회

### 8.1 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant Staff as 병원 직원
    participant HospitalApp as 병원앱
    participant PaymentAPI as Hospital Service<br/>(Payment Replica)

    Staff->>HospitalApp: 결제 탭
    HospitalApp->>PaymentAPI: GET /api/v1/payments?startDate=2024-01-01&endDate=2024-01-31
    PaymentAPI-->>HospitalApp: 결제 내역 목록 (Pagination)
    Note left of PaymentAPI: {<br/>  payments: [<br/>    {<br/>      id: 1,<br/>      appointmentId: 123,<br/>      patientName: "홍길동",<br/>      amount: 500.00,<br/>      status: "SUCCESS",<br/>      paidAt: "2024-01-15T14:30:00"<br/>    }<br/>  ],<br/>  totalAmount: 22500.00,<br/>  totalCount: 45<br/>}
    
    HospitalApp->>Staff: 결제 내역 테이블 표시
```

---

## 📱 9. 병원앱 전체 화면 목록

### 인증
- `/login` - 로그인

### 대시보드
- `/dashboard` - 대시보드 (통계, 최근 예약)

### 예약 관리
- `/appointment` - 예약 목록 (Waiting/Confirmed/Completed/Cancelled)
- `/appointment/:appointmentSequence` - 예약 상세 (상태별 UI 다름)
- `/appointment/:appointmentSequence/edit` - 예약 수정

### 진료
- `/consultation` - 진료 목록 (Today's Consultations)
- `/consultation/:appointmentSequence` - 진료 상세 (화상 통화)

### 환자 관리
- `/patient` - 환자 목록 (검색, Pagination)
- `/patient/new` - 환자 등록
- `/patient/:id` - 환자 상세 (기본 정보, 예약 기록, 진료 기록)

### 의사 관리
- `/doctor` - 의사 목록
- `/doctor/new` - 의사 등록
- `/doctor/:id` - 의사 상세 (기본 정보, 스케줄, 진료 통계)

### 결제
- `/payment` - 결제 내역 목록

### 병원 정보
- `/hospital` - 병원 정보 (설정, 운영 시간)

### 내 정보
- `/myinfo` - 내 정보 (프로필, 비밀번호 변경)

---

## 🔗 10. 주요 API 엔드포인트 요약

### Hospital Service (Port: 18082)

#### 인증
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/auth/login` | 로그인 |
| POST | `/api/v1/auth/logout` | 로그아웃 |
| GET | `/api/v1/auth/me` | 현재 사용자 정보 |

#### 대시보드
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/dashboard/stats` | 대시보드 통계 |

#### 예약 (Replica)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/appointments` | 예약 목록 (CDC Replica) |
| GET | `/api/v1/appointments/{sequence}` | 예약 상세 |
| PUT | `/api/v1/appointments/{sequence}` | 예약 수정 (의사 배정, 시간 변경) |
| PUT | `/api/v1/appointments/{sequence}/cancel` | 예약 취소 |

#### 환자 (Replica)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/patients` | 환자 목록 (CDC Replica) |
| GET | `/api/v1/patients/{id}` | 환자 상세 |
| POST | `/api/v1/patients` | 환자 등록 (Patient Service로 전달) |

#### 의사
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/doctors` | 의사 목록 |
| GET | `/api/v1/doctors/{id}` | 의사 상세 |
| POST | `/api/v1/doctors` | 의사 등록 |
| PUT | `/api/v1/doctors/{id}` | 의사 정보 수정 |
| PUT | `/api/v1/doctors/{id}/schedule` | 의사 스케줄 관리 |

#### 결제 (Replica)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/payments` | 결제 내역 목록 (CDC Replica) |

---

### Appointment Service (Port: 18083)

| Method | Endpoint | 설명 |
|--------|----------|------|
| PUT | `/api/v1/appointments/{id}/complete` | 진료 완료 (진료 기록, 처방전) |
| PUT | `/api/v1/appointments/{id}/start` | 진료 시작 (상태: IN_PROGRESS) |

---

### Video Call Service (Port: 18089)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/video-calls` | 세션 생성 |
| GET | `/api/v1/video-calls/{id}` | 세션 조회 |
| GET | `/api/v1/video-calls/appointment/{id}` | 예약별 세션 조회 |
| POST | `/api/v1/video-calls/{id}/join` | 세션 참여 (의사) |
| POST | `/api/v1/video-calls/{id}/end` | 세션 종료 |

---

### Messaging Service (Port: 18084)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/chat/channels` | 채팅방 생성 (환자와 1:1) |
| GET | `/api/v1/chat/channels/{channelUrl}` | 채팅방 정보 |
| GET | `/api/v1/chat/channels/{channelUrl}/messages` | 메시지 목록 |
| POST | `/api/v1/chat/channels/{channelUrl}/messages` | 메시지 전송 |

---

## 📊 11. 병원앱 사용자 역할별 기능

### 코디네이터 (Coordinator)
- ✅ 예약 관리 (PENDING → CONFIRMED)
- ✅ 환자 등록
- ✅ 환자 조회/수정
- ✅ 의사 배정
- ✅ 환자와 채팅
- ✅ 결제 내역 조회
- ❌ 진료 수행 (의사만)
- ❌ 처방전 발급 (의사만)

### 의사 (Doctor)
- ✅ 예약 조회 (본인 예약만)
- ✅ 환자 조회
- ✅ 화상 진료 수행
- ✅ 진료 기록 작성
- ✅ 처방전 발급
- ✅ 환자와 채팅
- ❌ 예약 배정/취소 (코디네이터만)
- ❌ 환자 등록 (코디네이터만)

---

## ✅ 다음 단계
- 전체 통합 프로세스 플로우 작성
- API 누락 분석 및 개발 계획 수립
- 데이터 모델 및 타입 정의 문서 작성


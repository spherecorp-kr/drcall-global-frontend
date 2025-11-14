import { http, HttpResponse } from 'msw';
import type { Patient } from '@contexts/AuthContext';

/**
 * MSW Handlers for Mock API
 * 개발 환경에서 백엔드 없이 전체 인증 플로우를 테스트할 수 있습니다.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:18081';

/**
 * Mock user data
 */
const MOCK_USER: Patient = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phoneCountryCode: '+82',
  phone: '01012345678',
  dateOfBirth: '1990-01-01',
  gender: 'MALE',
  idCardNumber: '900101-1234567',
  emergencyContactName: 'Jane Doe',
  emergencyContactPhone: '01087654321',
  address: 'Seoul, South Korea',
  addressDetail: 'Apt 101',
  postalCode: '12345',
  profileImageUrl: undefined,
  allergies: 'Penicillin',
  grade: 'NORMAL',
  marketingConsent: true,
  dataSharingConsent: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

/**
 * Mock temp JWT token
 */
const MOCK_TEMP_TOKEN = 'mock-temp-jwt-token-for-development';

/**
 * 프로필 등록 완료 여부를 추적하는 플래그
 * 신규 가입 플로우를 시뮬레이션하기 위함
 */
let isProfileCompleted = false;

export const handlers = [
  /**
   * POST /api/auth/otp/send
   * OTP 발송 - 항상 성공 반환
   */
  http.post(`${API_BASE_URL}/api/auth/otp/send`, async ({ request }) => {
    const body = await request.json();
    console.log('[MSW] 📨 OTP 발송 요청:', body);

    // 약간의 딜레이로 실제 API처럼 느껴지게
    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      success: true,
      message: 'OTP가 발송되었습니다.',
    });
  }),

  /**
   * POST /api/auth/otp/verify
   * OTP 검증 - 모든 OTP 코드를 성공으로 처리
   */
  http.post(`${API_BASE_URL}/api/auth/otp/verify`, async ({ request }) => {
    const body = await request.json();
    console.log('[MSW] 🔐 OTP 검증 요청:', body);

    // OTP 검증 시 프로필 완료 상태 초기화 (신규 가입 플로우)
    isProfileCompleted = false;

    // 약간의 딜레이
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      verified: true,
      message: 'OTP 인증에 성공했습니다.',
      tempToken: MOCK_TEMP_TOKEN,
    });
  }),

  /**
   * GET /api/auth/profile
   * 프로필 조회
   * - tempToken으로 조회 시: 프로필 완료 전이면 404, 완료 후면 사용자 정보 반환
   * - 쿠키로 조회 시: 항상 사용자 정보 반환 (로그인 상태)
   */
  http.get(`${API_BASE_URL}/api/auth/profile`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const hasTempToken = authHeader?.includes(MOCK_TEMP_TOKEN);
    const hasCookie = request.headers.get('Cookie')?.includes('sid');

    console.log('[MSW] 👤 프로필 조회 요청, hasTempToken:', hasTempToken, 'hasCookie:', hasCookie, 'isProfileCompleted:', isProfileCompleted);

    // 쿠키로 조회 (로그인 후)
    if (hasCookie) {
      return HttpResponse.json(MOCK_USER);
    }

    // tempToken으로 조회 (OTP 검증 직후)
    if (hasTempToken) {
      if (isProfileCompleted) {
        // 프로필 등록 완료 후
        return HttpResponse.json(MOCK_USER);
      } else {
        // 프로필 등록 전 - 404 반환 (신규 사용자)
        console.log('[MSW] 🆕 신규 사용자 - 프로필 미등록 상태');
        return HttpResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }
    }

    // 인증 정보가 없으면 401 반환
    return HttpResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }),

  /**
   * POST /api/auth/profile
   * 프로필 완성 (회원가입) - 성공 반환 및 쿠키 설정
   */
  http.post(`${API_BASE_URL}/api/auth/profile`, async ({ request }) => {
    const body = await request.json();
    console.log('[MSW] 📝 프로필 완성 요청:', body);

    // 프로필 등록 완료 플래그 설정
    isProfileCompleted = true;

    // 약간의 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));

    // 쿠키 설정 (실제로는 브라우저가 자동으로 처리하지만 mock에서는 수동)
    const mockSidToken = 'mock-sid-token';
    const mockCtxToken = 'mock-ctx-token';

    return HttpResponse.json(
      {
        success: true,
        message: '프로필이 등록되었습니다.',
        patientId: MOCK_USER.id,
        subscriptionId: 'mock-subscription-id',
        ctxToken: mockCtxToken,
        sidToken: mockSidToken,
      },
      {
        headers: {
          'Set-Cookie': [
            `sid=${mockSidToken}; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax`,
            `ctx-mock=${mockCtxToken}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax`,
          ].join(', '),
        },
      }
    );
  }),

  /**
   * POST /api/auth/logout
   * 로그아웃 - 성공 반환 및 쿠키 삭제
   */
  http.post(`${API_BASE_URL}/api/auth/logout`, async () => {
    console.log('[MSW] 👋 로그아웃 요청');

    // 프로필 완료 상태 초기화
    isProfileCompleted = false;

    // 약간의 딜레이
    await new Promise(resolve => setTimeout(resolve, 200));

    return HttpResponse.json(
      {
        success: true,
        message: '로그아웃되었습니다.',
      },
      {
        headers: {
          'Set-Cookie': [
            'sid=; Path=/; Max-Age=0',
            'ctx-mock=; Path=/; Max-Age=0',
          ].join(', '),
        },
      }
    );
  }),

  /**
   * GET /api/v1/hospital
   * 병원 정보 조회
   */
  http.get(`${API_BASE_URL}/api/v1/hospital`, () => {
    console.log('[MSW] 🏥 병원 정보 조회');
    return HttpResponse.json({
      id: 1,
      name: 'Dr.Call Global Hospital',
      address: '123 Medical Street, Bangkok',
      phone: '+66-2-123-4567',
      email: 'info@drcall.com',
    });
  }),

  /**
   * GET /api/v1/doctors
   * 의사 목록 조회
   */
  http.get(`${API_BASE_URL}/api/v1/doctors`, () => {
    console.log('[MSW] 👨‍⚕️ 의사 목록 조회');
    return HttpResponse.json([
      {
        id: 1,
        name: 'Dr. Smith',
        specialty: 'General',
        available: true,
      },
      {
        id: 2,
        name: 'Dr. Johnson',
        specialty: 'Pediatrics',
        available: true,
      },
    ]);
  }),

  /**
   * GET /api/v1/doctors/available
   * 예약 가능한 의사 목록 조회
   */
  http.get(`${API_BASE_URL}/api/v1/doctors/available`, () => {
    console.log('[MSW] 👨‍⚕️ 예약 가능한 의사 목록 조회');
    return HttpResponse.json([
      {
        id: 1,
        name: 'Dr. Smith',
        specialty: 'General',
        available: true,
      },
    ]);
  }),

  /**
   * GET /api/v1/doctors/:id
   * 의사 상세 정보 조회
   */
  http.get(`${API_BASE_URL}/api/v1/doctors/:id`, ({ params }) => {
    console.log('[MSW] 👨‍⚕️ 의사 상세 정보 조회:', params.id);
    return HttpResponse.json({
      id: Number(params.id),
      name: 'Dr. Smith',
      specialty: 'General',
      available: true,
      bio: 'Experienced general practitioner',
    });
  }),

  /**
   * GET /api/v1/appointments
   * 예약 목록 조회
   */
  http.get(`${API_BASE_URL}/api/v1/appointments`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    console.log('[MSW] 📅 예약 목록 조회, status:', status);

    return HttpResponse.json({
      appointments: [],
      total: 0,
      hasMore: false,
    });
  }),

  /**
   * GET /api/v1/appointments/:id
   * 예약 상세 조회
   */
  http.get(`${API_BASE_URL}/api/v1/appointments/:id`, ({ params }) => {
    console.log('[MSW] 📅 예약 상세 조회:', params.id);
    return HttpResponse.json({
      id: params.id,
      doctorName: 'Dr. Smith',
      date: '2024-01-15',
      time: '10:00',
      status: 'confirmed',
    });
  }),

  /**
   * POST /api/v1/appointments
   * 예약 생성
   */
  http.post(`${API_BASE_URL}/api/v1/appointments`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    console.log('[MSW] 📅 예약 생성:', body);

    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      id: 'new-appointment-id',
      ...body,
      status: 'pending',
    });
  }),

  /**
   * PUT /api/v1/appointments/:id
   * 예약 수정
   */
  http.put(`${API_BASE_URL}/api/v1/appointments/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    console.log('[MSW] 📅 예약 수정:', params.id, body);

    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      id: params.id,
      ...body,
    });
  }),

  /**
   * DELETE /api/v1/appointments/:id
   * 예약 취소
   */
  http.delete(`${API_BASE_URL}/api/v1/appointments/:id`, async ({ params }) => {
    console.log('[MSW] 📅 예약 취소:', params.id);

    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      success: true,
      message: '예약이 취소되었습니다.',
    });
  }),

  /**
   * GET /api/v1/phr/latest
   * 최신 건강 기록 조회
   */
  http.get(`${API_BASE_URL}/api/v1/phr/latest`, () => {
    console.log('[MSW] 📊 최신 건강 기록 조회');
    return HttpResponse.json({
      bloodPressure: null,
      bloodSugar: null,
      weight: null,
      height: null,
    });
  }),

  /**
   * GET /api/v1/phr
   * 건강 기록 목록 조회
   */
  http.get(`${API_BASE_URL}/api/v1/phr`, ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    console.log('[MSW] 📊 건강 기록 조회, type:', type);

    return HttpResponse.json({
      records: [],
      total: 0,
      hasMore: false,
    });
  }),

  /**
   * POST /api/v1/phr
   * 건강 기록 생성
   */
  http.post(`${API_BASE_URL}/api/v1/phr`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    console.log('[MSW] 📊 건강 기록 생성:', body);

    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      id: 'new-record-id',
      ...body,
      createdAt: new Date().toISOString(),
    });
  }),

  /**
   * PUT /api/v1/phr/:id
   * 건강 기록 수정
   */
  http.put(`${API_BASE_URL}/api/v1/phr/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    console.log('[MSW] 📊 건강 기록 수정:', params.id, body);

    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      id: params.id,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  }),

  /**
   * DELETE /api/v1/phr/:id
   * 건강 기록 삭제
   */
  http.delete(`${API_BASE_URL}/api/v1/phr/:id`, async ({ params }) => {
    console.log('[MSW] 📊 건강 기록 삭제:', params.id);

    await new Promise(resolve => setTimeout(resolve, 200));

    return HttpResponse.json({
      success: true,
    });
  }),

  /**
   * POST /api/v1/chat/channels
   * 채팅 채널 생성
   */
  http.post(`${API_BASE_URL}/api/v1/chat/channels`, async ({ request }) => {
    const body = await request.json();
    console.log('[MSW] 💬 채팅 채널 생성:', body);

    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      channel_url: 'mock-channel-url',
      name: 'Mock Channel',
      members: [],
      custom_type: 'STAFF_INITIATED',
      metadata: {
        status: 'active',
      },
    });
  }),

  /**
   * GET /api/v1/chat/channels/:channelUrl
   * 채팅 채널 조회
   */
  http.get(`${API_BASE_URL}/api/v1/chat/channels/:channelUrl`, ({ params }) => {
    console.log('[MSW] 💬 채팅 채널 조회:', params.channelUrl);

    return HttpResponse.json({
      channel_url: params.channelUrl,
      name: 'Mock Channel',
      members: [],
      custom_type: 'STAFF_INITIATED',
      metadata: {
        status: 'active',
      },
    });
  }),

  /**
   * GET /api/v1/chat/users/:userId/channels
   * 사용자 채팅 채널 목록 조회
   */
  http.get(`${API_BASE_URL}/api/v1/chat/users/:userId/channels`, ({ params }) => {
    console.log('[MSW] 💬 사용자 채팅 채널 목록 조회:', params.userId);

    return HttpResponse.json({
      channels: [],
      next: null,
    });
  }),

  /**
   * POST /api/v1/chat/channels/:channelUrl/messages
   * 채팅 메시지 전송
   */
  http.post(`${API_BASE_URL}/api/v1/chat/channels/:channelUrl/messages`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    console.log('[MSW] 💬 채팅 메시지 전송:', params.channelUrl, body);

    await new Promise(resolve => setTimeout(resolve, 200));

    return HttpResponse.json({
      message_id: Date.now(),
      channel_url: params.channelUrl,
      message: body.message,
      user: {
        user_id: 'mock-user-id',
        nickname: 'Mock User',
      },
      created_at: Date.now(),
    });
  }),

  /**
   * GET /api/v1/chat/channels/:channelUrl/messages
   * 채팅 메시지 목록 조회
   */
  http.get(`${API_BASE_URL}/api/v1/chat/channels/:channelUrl/messages`, ({ params }) => {
    console.log('[MSW] 💬 채팅 메시지 목록 조회:', params.channelUrl);

    return HttpResponse.json({
      messages: [],
      next: null,
    });
  }),

  /**
   * POST /api/v1/chat/channels/:channelUrl/read
   * 채팅 메시지 읽음 처리
   */
  http.post(`${API_BASE_URL}/api/v1/chat/channels/:channelUrl/read`, async ({ params }) => {
    console.log('[MSW] 💬 채팅 메시지 읽음 처리:', params.channelUrl);

    await new Promise(resolve => setTimeout(resolve, 100));

    return HttpResponse.json({
      success: true,
    });
  }),

  /**
   * PUT /api/v1/chat/channels/:channelUrl/close
   * 채팅 채널 닫기
   */
  http.put(`${API_BASE_URL}/api/v1/chat/channels/:channelUrl/close`, async ({ params }) => {
    console.log('[MSW] 💬 채팅 채널 닫기:', params.channelUrl);

    await new Promise(resolve => setTimeout(resolve, 200));

    return HttpResponse.json({
      success: true,
    });
  }),

  /**
   * GET /api/v1/chat/users/:userId/unread
   * 사용자 읽지 않은 메시지 수 조회
   */
  http.get(`${API_BASE_URL}/api/v1/chat/users/:userId/unread`, ({ params }) => {
    console.log('[MSW] 💬 읽지 않은 메시지 수 조회:', params.userId);

    return HttpResponse.json({
      unread_count: 0,
    });
  }),
];

import { test, expect } from '@playwright/test';

test.describe('Hospital App - Login', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('http://localhost:5173/login');
  });

  test('로그인 페이지 렌더링 확인', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle('hospital-app');

    // 로그인 폼 요소 확인
    await expect(page.getByLabel('아이디')).toBeVisible();
    await expect(page.getByLabel('비밀번호')).toBeVisible();
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible();

    // Dr.Call 로고 확인
    await expect(page.getByAltText('Dr.Call')).toBeVisible();

    // "병원" 배지 확인
    await expect(page.getByText('병원')).toBeVisible();
  });

  test('빈 필드로 로그인 시도 시 에러 표시', async ({ page }) => {
    // 로그인 버튼 클릭
    await page.getByRole('button', { name: '로그인' }).click();

    // 에러 메시지 확인
    await expect(page.getByText('아이디와 비밀번호를 입력해주세요.')).toBeVisible();
  });

  test('잘못된 credentials로 로그인 시 에러 메시지 표시', async ({ page }) => {
    // 잘못된 계정 정보 입력
    await page.getByLabel('아이디').fill('invalid_user');
    await page.getByLabel('비밀번호').fill('wrong_password');

    // 로그인 버튼 클릭
    await page.getByRole('button', { name: '로그인' }).click();

    // 에러 메시지 확인 (API 응답 대기)
    await expect(page.getByText(/아이디 또는 비밀번호가 올바르지 않습니다/i)).toBeVisible({ timeout: 10000 });
  });

  test.skip('올바른 credentials로 로그인 성공', async ({ page }) => {
    // TODO: 백엔드 API 연결 후 활성화
    // 테스트 계정 정보는 환경변수로 관리
    const username = process.env.TEST_COORDINATOR_USERNAME || 'test_coordinator';
    const password = process.env.TEST_COORDINATOR_PASSWORD || 'test_password';

    // 로그인 정보 입력
    await page.getByLabel(/아이디|username/i).fill(username);
    await page.getByLabel(/비밀번호|password/i).fill(password);

    // 로그인 버튼 클릭
    await page.getByRole('button', { name: /로그인/i }).click();

    // 대시보드로 리다이렉트 확인
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // 로그인 후 요소 확인
    await expect(page.getByText(/대시보드|Dashboard/i)).toBeVisible();
  });

  test.skip('로그인 후 세션 유지 확인', async ({ page, context }) => {
    // TODO: 백엔드 API 연결 후 활성화
    const username = process.env.TEST_COORDINATOR_USERNAME || 'test_coordinator';
    const password = process.env.TEST_COORDINATOR_PASSWORD || 'test_password';

    // 로그인
    await page.getByLabel(/아이디|username/i).fill(username);
    await page.getByLabel(/비밀번호|password/i).fill(password);
    await page.getByRole('button', { name: /로그인/i }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // 쿠키 확인
    const cookies = await context.cookies();
    const accessTokenCookie = cookies.find(c => c.name === 'accessToken');
    expect(accessTokenCookie).toBeTruthy();

    // 로컬스토리지 확인
    const user = await page.evaluate(() => localStorage.getItem('user'));
    expect(user).toBeTruthy();
  });

  test('AuthProvider가 정상적으로 작동하는지 확인', async ({ page }) => {
    // 페이지 로드 시 AuthProvider 에러가 발생하지 않는지 확인
    page.on('pageerror', error => {
      // "useAuth must be used within AuthProvider" 에러가 발생하면 테스트 실패
      expect(error.message).not.toContain('useAuth must be used within AuthProvider');
    });

    // 페이지 로드
    await page.goto('http://localhost:5173/login');

    // 페이지가 정상적으로 렌더링되었는지 확인
    await expect(page.getByRole('button', { name: /로그인/i })).toBeVisible();
  });
});

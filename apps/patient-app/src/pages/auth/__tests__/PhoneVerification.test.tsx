import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PhoneVerification from '../PhoneVerification';
import { BrowserRouter } from 'react-router-dom';
import { authService } from '@services/authService';

// Mock dependencies
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth.phoneVerification': 'Phone Verification',
        'auth.enterPhone': 'Enter Phone',
        'auth.sendCode': 'Send Code',
        'auth.phoneNumber': 'Phone Number',
        'auth.verificationSuccess': 'Verification Success',
        'common.edit': 'Edit',
        'auth.verificationCode': 'Verification Code',
        'auth.enterCode': 'Enter Code',
        'auth.didntReceiveCode': "Didn't receive code?",
        'auth.resend': 'Resend',
        'common.loading': 'Loading',
        'common.next': 'Next',
        'common.confirm': 'Confirm',
        'error.invalidPhone': 'Invalid Phone',
        'auth.verificationFailed': 'Verification Failed',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'ko',
    },
  }),
}));

vi.mock('@services/authService', () => ({
  authService: {
    sendOtp: vi.fn(),
    verifyOtp: vi.fn(),
  },
}));

vi.mock('@hooks/useErrorHandler', () => ({
  useErrorHandler: () => ({
    handleError: vi.fn((err) => 'Error occurred'),
    handleValidationError: vi.fn(),
  }),
}));

  describe('PhoneVerification', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });


  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <PhoneVerification />
      </BrowserRouter>
    );
  };

  it('renders initial phone input state correctly', () => {
    renderComponent();

    expect(screen.getByText('Phone Verification')).toBeInTheDocument();
    expect(screen.getByText('Enter Phone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Phone')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('validates phone number and disables next button for invalid input', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Enter Phone');
    const nextButton = screen.getByText('Next');

    // Empty input
    expect(nextButton).toBeDisabled();

    // Invalid input (too short)
    fireEvent.change(input, { target: { value: '123' } });
    expect(nextButton).toBeDisabled();
  });

  it('enables next button for valid phone number', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Enter Phone');
    fireEvent.change(input, { target: { value: '01012345678' } });

    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
  });

  it('sends OTP and switches to code verification step', async () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Enter Phone');
    fireEvent.change(input, { target: { value: '01012345678' } });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(authService.sendOtp).toHaveBeenCalledWith({
        phone: '01012345678',
        phoneCountryCode: '+82', // Default KR code
        verificationType: 'REGISTRATION',
      });
    });

    // Check if UI switched to code input
    expect(screen.getByPlaceholderText('Enter Code')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('verifies OTP and navigates to appointments for existing patient', async () => {
    (authService.verifyOtp as any).mockResolvedValue({ existingPatient: true });
    renderComponent();

    // Step 1: Send OTP
    const phoneInput = screen.getByPlaceholderText('Enter Phone');
    fireEvent.change(phoneInput, { target: { value: '01012345678' } });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter Code')).toBeInTheDocument();
    });

    // Step 2: Enter Code
    const codeInput = screen.getByPlaceholderText('Enter Code');
    fireEvent.change(codeInput, { target: { value: '1234' } });

    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).not.toBeDisabled();
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(authService.verifyOtp).toHaveBeenCalledWith({
        phone: '01012345678',
        phoneCountryCode: '+82',
        otpCode: '1234',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/appointments');
    });
  });

  it('verifies OTP and navigates to service registration for new patient', async () => {
    (authService.verifyOtp as any).mockResolvedValue({ existingPatient: false });
    renderComponent();

    // Step 1: Send OTP
    const phoneInput = screen.getByPlaceholderText('Enter Phone');
    fireEvent.change(phoneInput, { target: { value: '01012345678' } });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter Code')).toBeInTheDocument();
    });

    // Step 2: Enter Code
    const codeInput = screen.getByPlaceholderText('Enter Code');
    fireEvent.change(codeInput, { target: { value: '1234' } });

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/service-registration');
    });
  });

  it('handles resend code', async () => {
    renderComponent();

    // Step 1: Send OTP
    const phoneInput = screen.getByPlaceholderText('Enter Phone');
    fireEvent.change(phoneInput, { target: { value: '01012345678' } });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByText('Resend')).toBeInTheDocument();
    });

    // Clear mock to check second call
    (authService.sendOtp as any).mockClear();

    // Click Resend
    fireEvent.click(screen.getByText('Resend'));

    await waitFor(() => {
      expect(authService.sendOtp).toHaveBeenCalledTimes(1);
    });
  });

  it('allows editing phone number', async () => {
    renderComponent();

    // Step 1: Send OTP
    const phoneInput = screen.getByPlaceholderText('Enter Phone');
    fireEvent.change(phoneInput, { target: { value: '01012345678' } });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    // Click Edit
    fireEvent.click(screen.getByText('Edit'));

    // Should return to phone input state
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter Code')).not.toBeInTheDocument();
  });

  it('timer decreases over time', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true }); // 타이머 테스트가 필요한 곳에서만 옵션과 함께 사용
    renderComponent();

    // Step 1: Send OTP
    const phoneInput = screen.getByPlaceholderText('Enter Phone');
    fireEvent.change(phoneInput, { target: { value: '01012345678' } });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByText('03:00')).toBeInTheDocument();
    });

    // Advance time by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('02:59')).toBeInTheDocument();
    vi.useRealTimers();
  });
});

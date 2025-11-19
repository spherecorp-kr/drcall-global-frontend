import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ServiceRegistration from '../ServiceRegistration';
import { BrowserRouter } from 'react-router-dom';
import { authService } from '@services/authService';
import * as channelUtils from '@utils/channelUtils';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth.serviceRegistration': 'Service Registration',
        'auth.userRegistration': 'User Registration',
        'auth.name': 'Name',
        'auth.enterName': 'Enter Name',
        'auth.birthdate': 'Birthdate',
        'auth.birthdatePlaceholder': 'DD/MM/YYYY',
        'auth.thaiId': 'Thai ID',
        'auth.enterThaiId': 'Enter Thai ID',
        'auth.gender': 'Gender',
        'auth.male': 'Male',
        'auth.female': 'Female',
        'auth.phoneNumber': 'Phone Number',
        'auth.enterPhone': 'Enter Phone',
        'auth.address': 'Address',
        'auth.searchAddress': 'Search Address',
        'auth.enterDetailAddress': 'Enter Detail Address',
        'auth.linePrivacy': 'LINE Privacy Policy',
        'auth.serviceTerms': 'Service Terms',
        'auth.personalInfo': 'Personal Info Consent',
        'auth.marketing': 'Marketing Consent',
        'auth.agree': 'Agree',
        'common.cancel': 'Cancel',
        'validation.selectRequired': 'Required',
        'error.invalidPhone': 'Invalid Phone',
        'validation.agreeToTerms': 'Please agree to terms',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('@services/authService', () => ({
  authService: {
    getProfile: vi.fn(),
    completeProfile: vi.fn(),
  },
}));

vi.mock('@utils/channelUtils', () => ({
  getChannelUserId: vi.fn(),
}));

// Mock Modals to simplify testing
vi.mock('@ui/modals/DatePickerModal', () => ({
  default: ({ isOpen, onConfirm }: any) => (
    isOpen ? <button data-testid="date-picker-confirm" onClick={() => onConfirm('01/01/1990')}>Confirm Date</button> : null
  ),
}));

vi.mock('@components/address/modals/AddressSearchModal', () => ({
  default: ({ isOpen, onSelect }: any) => (
    isOpen ? <button data-testid="address-search-select" onClick={() => onSelect({ displayAddress: 'Bangkok', postalCode: '10110' })}>Select Address</button> : null
  ),
}));

describe('ServiceRegistration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (authService.getProfile as any).mockResolvedValue({ phone: '01012345678' });
    (channelUtils.getChannelUserId as any).mockResolvedValue({ channelUserId: 'test-channel-user' });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ServiceRegistration />
      </BrowserRouter>
    );
  };

  it('renders all required fields', () => {
    renderComponent();

    expect(screen.getByText('User Registration')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('DD/MM/YYYY')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Thai ID')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Phone')).toBeInTheDocument();
    expect(screen.getByText('Search Address')).toBeInTheDocument();
    expect(screen.getByText('LINE Privacy Policy')).toBeInTheDocument();
  });

  it('validates required fields on submit', async () => {
    renderComponent();

    const submitButton = screen.getByText('Agree');
    // Initially disabled
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when all fields are valid', async () => {
    renderComponent();

    // 1. Name
    fireEvent.change(screen.getByPlaceholderText('Enter Name'), { target: { value: 'Test User' } });

    // 2. Birthdate (via Mock Modal)
    fireEvent.click(screen.getByPlaceholderText('DD/MM/YYYY'));
    fireEvent.click(screen.getByTestId('date-picker-confirm'));

    // 3. Thai ID
    fireEvent.change(screen.getByPlaceholderText('Enter Thai ID'), { target: { value: '1234567890123' } });

    // 4. Gender
    fireEvent.click(screen.getByText('Male'));

    // 5. Phone (Pre-filled or manually entered)
    fireEvent.change(screen.getByPlaceholderText('Enter Phone'), { target: { value: '01012345678' } });

    // 6. Address (via Mock Modal)
    fireEvent.click(screen.getByText('Search Address'));
    fireEvent.click(screen.getByTestId('address-search-select'));

    // 7. Terms (All Agree)
    // Finding the checkbox might be tricky due to custom implementation.
    // Assuming the text "All Agree" or similar is clickable or the checkbox image.
    // In the component, TermsAgreement uses images. We can try clicking the text.
    // The mock translation for 'appointment.allAgree' is missing in my mock above, let's add it or click individual terms.
    // Let's click individual required terms.
    
    // Actually, let's update the mock to include 'appointment.allAgree' or just click the images.
    // Since we can't easily select images by alt text if there are multiple, let's try to find by text.
    
    // Let's click the "LINE Privacy Policy" checkbox wrapper
    const privacyPolicy = screen.getByText('LINE Privacy Policy');
    fireEvent.click(privacyPolicy.previousSibling as Element); // Clicking the image

    const serviceTerms = screen.getByText('Service Terms');
    fireEvent.click(serviceTerms.previousSibling as Element);

    const personalInfo = screen.getByText('Personal Info Consent');
    fireEvent.click(personalInfo.previousSibling as Element);

    // Now submit should be enabled
    const submitButton = screen.getByText('Agree');
    await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
    });
  });

  it('submits the form with correct data', async () => {
    renderComponent();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter Name'), { target: { value: 'Test User' } });
    
    fireEvent.click(screen.getByPlaceholderText('DD/MM/YYYY'));
    fireEvent.click(screen.getByTestId('date-picker-confirm')); // Sets 01/01/1990

    fireEvent.change(screen.getByPlaceholderText('Enter Thai ID'), { target: { value: '1234567890123' } });
    fireEvent.click(screen.getByText('Male'));
    fireEvent.change(screen.getByPlaceholderText('Enter Phone'), { target: { value: '01012345678' } });

    fireEvent.click(screen.getByText('Search Address'));
    fireEvent.click(screen.getByTestId('address-search-select')); // Sets Bangkok, 10110

    // Agree to terms
    const privacyPolicy = screen.getByText('LINE Privacy Policy');
    fireEvent.click(privacyPolicy.previousSibling as Element);
    const serviceTerms = screen.getByText('Service Terms');
    fireEvent.click(serviceTerms.previousSibling as Element);
    const personalInfo = screen.getByText('Personal Info Consent');
    fireEvent.click(personalInfo.previousSibling as Element);

    // Submit
    const submitButton = screen.getByText('Agree');
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.completeProfile).toHaveBeenCalledWith({
        channelUserId: 'test-channel-user',
        name: 'Test User',
        email: '01012345678@patient.drcall.global', // Default email logic
        dateOfBirth: '1990-01-01', // Formatted YYYY-MM-DD
        gender: 'MALE',
        idCardNumber: '1234567890123',
        emergencyContactName: '',
        emergencyContactPhone: '',
        address: '10110\nBangkok', // Combined address
        marketingConsent: false,
        dataSharingConsent: true,
      });
    });
  });
});

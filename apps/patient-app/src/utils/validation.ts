/**
 * Common validation utilities
 * Provides reusable validation functions
 */

/**
 * Validate phone number
 */
export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's at least 10 digits
  return cleaned.length >= 10;
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate required field
 */
export function validateRequired(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim().length > 0;
}

/**
 * Validate min length
 */
export function validateMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Validate max length
 */
export function validateMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

/**
 * Validate postal code (Korean format)
 */
export function validatePostalCode(postalCode: string): boolean {
  // Korean postal code: 5 digits
  const cleaned = postalCode.replace(/\D/g, '');
  return cleaned.length === 5;
}

/**
 * Validate address fields
 */
export interface AddressValidation {
  isValid: boolean;
  errors: {
    address?: string;
    detailAddress?: string;
    postalCode?: string;
  };
}

export function validateAddress(
  address: string,
  detailAddress: string,
  postalCode: string
): AddressValidation {
  const errors: AddressValidation['errors'] = {};

  if (!validateRequired(address)) {
    errors.address = '주소를 입력해주세요';
  }

  if (!validateRequired(detailAddress)) {
    errors.detailAddress = '상세 주소를 입력해주세요';
  }

  if (!validateRequired(postalCode)) {
    errors.postalCode = '우편번호를 입력해주세요';
  } else if (!validatePostalCode(postalCode)) {
    errors.postalCode = '올바른 우편번호를 입력해주세요';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Get validation error message
 */
export function getValidationErrorMessage(
  fieldName: string,
  errorType: 'required' | 'invalid' | 'minLength' | 'maxLength'
): string {
  const messages: Record<string, string> = {
    required: `${fieldName}을(를) 입력해주세요`,
    invalid: `올바른 ${fieldName}을(를) 입력해주세요`,
    minLength: `${fieldName}이(가) 너무 짧습니다`,
    maxLength: `${fieldName}이(가) 너무 깁니다`,
  };

  return messages[errorType] || `${fieldName} 입력 오류`;
}

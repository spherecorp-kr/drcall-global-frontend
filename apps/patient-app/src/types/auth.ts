export interface PhoneVerificationRequest {
  phoneNumber: string;
}

export interface PhoneVerificationResponse {
  success: boolean;
  message: string;
}

export interface VerifyCodeRequest {
  phoneNumber: string;
  code: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  verified: boolean;
  message?: string;
}

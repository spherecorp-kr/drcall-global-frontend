/**
 * OMISE.js 타입 정의
 * https://www.omise.co/omise-js
 */

declare global {
  interface Window {
    Omise: {
      setPublicKey(publicKey: string): void;
      createToken(
        type: 'card',
        data: OmiseCardData,
        callback: (statusCode: number, response: OmiseTokenResponse | OmiseErrorResponse) => void
      ): void;
      createSource(
        type: string,
        data: OmiseSourceData,
        callback: (statusCode: number, response: OmiseSourceResponse | OmiseErrorResponse) => void
      ): void;
    };
  }
}

export interface OmiseCardData {
  name: string;
  number: string;
  expiration_month: string;
  expiration_year: string;
  security_code: string;
}

export interface OmiseSourceData {
  type: 'promptpay' | 'mobile_banking_scb' | 'mobile_banking_kbank' | 'mobile_banking_bay';
  amount: number;
  currency: string;
}

export interface OmiseTokenResponse {
  object: 'token';
  id: string; // tok_xxx
  livemode: boolean;
  location: string;
  used: boolean;
  charge_status: string;
  card: {
    object: 'card';
    id: string;
    livemode: boolean;
    location: string;
    country: string;
    city: string | null;
    postal_code: string | null;
    financing: string;
    bank: string;
    brand: string;
    fingerprint: string;
    first_digits: string | null;
    last_digits: string;
    name: string;
    expiration_month: number;
    expiration_year: number;
    security_code_check: boolean;
    created_at: string;
  };
  created_at: string;
}

export interface OmiseSourceResponse {
  object: 'source';
  id: string; // src_xxx
  livemode: boolean;
  location: string;
  amount: number;
  currency: string;
  type: string;
  flow: string;
  created_at: string;
}

export interface OmiseErrorResponse {
  object: 'error';
  location: string;
  code: string;
  message: string;
}

export {};

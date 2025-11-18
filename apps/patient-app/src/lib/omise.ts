/**
 * OMISE.js Integration
 *
 * 카드 토큰화 및 소스 생성을 위한 OMISE.js 래퍼
 * https://docs.opn.ooo/omise-js
 */

// OMISE.js 타입 정의
declare global {
  interface Window {
    Omise: {
      setPublicKey: (key: string) => void;
      createToken: (
        type: 'card',
        data: OmiseCardData,
        callback: (statusCode: number, response: OmiseTokenResponse) => void
      ) => void;
      createSource: (
        type: string,
        data: OmiseSourceData,
        callback: (statusCode: number, response: OmiseSourceResponse) => void
      ) => void;
    };
  }
}

export interface OmiseCardData {
  name: string; // 카드 소유자 이름
  number: string; // 카드 번호 (16자리)
  expiration_month: string; // 만료 월 (MM)
  expiration_year: string; // 만료 년 (YYYY)
  security_code: string; // CVC/CVV (3-4자리)
}

export interface OmiseTokenResponse {
  id: string; // tok_xxx
  object: 'token';
  livemode: boolean;
  used: boolean;
  card: {
    object: 'card';
    id: string;
    livemode: boolean;
    brand: string; // Visa, MasterCard, etc.
    last_digits: string;
    name: string;
    expiration_month: number;
    expiration_year: number;
    fingerprint: string;
    security_code_check: boolean;
  };
  message?: string; // 에러 메시지
}

export interface OmiseSourceData {
  type: string; // 'promptpay', 'mobile_banking_bay', etc.
  amount: number; // Satang 단위 (1 THB = 100 satang)
  currency: string; // 'THB'
}

export interface OmiseSourceResponse {
  id: string; // src_xxx
  object: 'source';
  type: string;
  flow: string; // 'redirect', 'offline', etc.
  amount: number;
  currency: string;
  scannable_code?: {
    type: string;
    image: {
      download_uri: string; // QR 코드 이미지 URL
    };
  };
  message?: string; // 에러 메시지
}

/**
 * OMISE.js 로드 확인
 */
export function isOmiseLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.Omise !== 'undefined';
}

/**
 * OMISE 공개 키 설정
 */
export function setOmisePublicKey(): void {
  if (!isOmiseLoaded()) {
    throw new Error('OMISE.js is not loaded');
  }

  const publicKey = import.meta.env.VITE_OMISE_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error('OMISE_PUBLIC_KEY is not configured');
  }

  window.Omise.setPublicKey(publicKey);
}

/**
 * 카드 토큰 생성
 *
 * @param cardData 카드 정보
 * @returns OMISE 카드 토큰 (tok_xxx)
 */
export function createOmiseCardToken(cardData: OmiseCardData): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isOmiseLoaded()) {
      reject(new Error('OMISE.js is not loaded'));
      return;
    }

    setOmisePublicKey();

    window.Omise.createToken('card', cardData, (statusCode, response) => {
      if (statusCode === 200 && response.id) {
        resolve(response.id); // tok_xxx
      } else {
        reject(new Error(response.message || 'Failed to create card token'));
      }
    });
  });
}

/**
 * 소스 생성 (PromptPay, Mobile Banking, etc.)
 *
 * @param type 소스 타입 ('promptpay', 'mobile_banking_bay', etc.)
 * @param amount 금액 (satang 단위)
 * @param currency 통화 ('THB')
 * @returns OMISE 소스 정보
 */
export function createOmiseSource(
  type: string,
  amount: number,
  currency: string = 'THB'
): Promise<OmiseSourceResponse> {
  return new Promise((resolve, reject) => {
    if (!isOmiseLoaded()) {
      reject(new Error('OMISE.js is not loaded'));
      return;
    }

    setOmisePublicKey();

    const sourceData: OmiseSourceData = {
      type,
      amount,
      currency,
    };

    window.Omise.createSource(type, sourceData, (statusCode, response) => {
      if (statusCode === 200 && response.id) {
        resolve(response);
      } else {
        reject(new Error(response.message || 'Failed to create source'));
      }
    });
  });
}

/**
 * THB를 Satang으로 변환
 */
export function thbToSatang(thb: number): number {
  return Math.round(thb * 100);
}

/**
 * Satang를 THB로 변환
 */
export function satangToThb(satang: number): number {
  return satang / 100;
}

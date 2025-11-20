/**
 * Hospital Onboarding Types
 */

export type ChannelType = 'LINE' | 'FACEBOOK' | 'TELEGRAM' | 'WHATSAPP';

export interface LiffConfig {
	liffId: string;
	channelId: string;
	channelSecret: string;
	channelAccessToken?: string;
}

export interface HospitalFormData {
	hospitalCode?: string;  // 선택적 - 서버에서 자동 생성
	nameEn: string;
	nameLocal?: string;
	email: string;
	phone: string;
	website?: string;
	address: string;
	city?: string;
	state?: string;
	postalCode: string;
	countryCode?: string;
	timezone: string;
	currency: string;
}

export interface ChannelFormData {
	channelType: ChannelType;
	subdomain: string;
	liffConfig?: LiffConfig;
}

export interface MessagingProviderFormData {
	providerName: string;
	channelAccessToken: string;
	channelSecret: string;
	rateLimitPerMinute?: number;
	rateLimitPerDay?: number;
}

export interface OmiseFormData {
	publicKey: string;
	secretKey: string;
	apiVersion?: string;
}

export interface PaymentFormData {
	gateway: 'OMISE';
	omise: OmiseFormData;
}

export interface ShippopFormData {
	apiKey: string;
	email: string;
	defaultSenderName?: string;
	defaultSenderPhone?: string;
	defaultSenderAddress?: string;
}

export interface ShippingFormData {
	provider: 'SHIPPOP';
	shippop: ShippopFormData;
}

export interface HospitalOnboardingRequest {
	hospital: HospitalFormData;
	channel: ChannelFormData;
	messagingProvider?: MessagingProviderFormData;
	payment: PaymentFormData;
	shipping: ShippingFormData;
}

export interface HospitalOnboardingResponse {
	hospitalId: number;
	hospitalExternalId: string;
	channelId: number;
	channelExternalId: string;
	channelUrl: string;
	messagingProviderId?: number;
	omiseEventId?: string;
	shippopEventId?: string;
	status: string;
	message: string;
}

export type OnboardingStep = 
	| 'hospital'
	| 'channel'
	| 'messaging'
	| 'payment'
	| 'shipping'
	| 'review'
	| 'complete';


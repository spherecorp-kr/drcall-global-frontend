import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select } from '@/shared/components/ui';
import { onboardingService } from '@/services/onboardingService';
import type {
	HospitalFormData,
	ChannelFormData,
	MessagingProviderFormData,
	PaymentFormData,
	ShippingFormData,
	OnboardingStep,
	HospitalOnboardingRequest,
} from '@/types/onboarding';

const STEPS: OnboardingStep[] = ['hospital', 'channel', 'messaging', 'payment', 'shipping', 'review'];

const STEP_LABELS: Record<OnboardingStep, string> = {
	hospital: '병원 정보',
	channel: '채널 설정',
	messaging: '메시징 설정',
	payment: '결제 설정',
	shipping: '배송 설정',
	review: '검토',
	complete: '완료',
};

export default function HospitalOnboarding() {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState<OnboardingStep>('hospital');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form data
	const [hospitalData, setHospitalData] = useState<HospitalFormData>({
		hospitalCode: '',
		nameEn: '',
		nameLocal: '',
		email: '',
		phone: '',
		website: '',
		address: '',
		city: '',
		state: '',
		postalCode: '',
		countryCode: 'TH',
		timezone: 'Asia/Bangkok',
		currency: 'THB',
	});

	const [channelData, setChannelData] = useState<ChannelFormData>({
		channelType: 'LINE',
		subdomain: '',
		liffConfig: {
			liffId: '',
			channelId: '',
			channelSecret: '',
		},
	});

	const [messagingData, setMessagingData] = useState<MessagingProviderFormData>({
		providerName: '',
		channelAccessToken: '',
		channelSecret: '',
		rateLimitPerMinute: 1000,
		rateLimitPerDay: 100000,
	});

	const [paymentData, setPaymentData] = useState<PaymentFormData>({
		gateway: 'OMISE',
		omise: {
			publicKey: '',
			secretKey: '',
		},
	});

	const [shippingData, setShippingData] = useState<ShippingFormData>({
		provider: 'SHIPPOP',
		shippop: {
			apiKey: '',
			email: '',
			defaultSenderName: '',
			defaultSenderPhone: '',
			defaultSenderAddress: '',
		},
	});

	const currentStepIndex = STEPS.indexOf(currentStep);

	const handleNext = useCallback(() => {
		if (currentStepIndex < STEPS.length - 1) {
			setCurrentStep(STEPS[currentStepIndex + 1]);
		}
	}, [currentStepIndex]);

	const handlePrev = useCallback(() => {
		if (currentStepIndex > 0) {
			setCurrentStep(STEPS[currentStepIndex - 1]);
		}
	}, [currentStepIndex]);

	const handleSubmit = useCallback(async () => {
		setIsSubmitting(true);
		try {
			const request: HospitalOnboardingRequest = {
				hospital: hospitalData,
				channel: channelData,
				messagingProvider: messagingData,
				payment: paymentData,
				shipping: shippingData,
			};

			const response = await onboardingService.onboardHospital(request);
			
			// 성공 시 완료 페이지로 이동
			setCurrentStep('complete');
		} catch (error: any) {
			console.error('Onboarding failed:', error);
			alert(error.response?.data?.message || '온보딩에 실패했습니다.');
		} finally {
			setIsSubmitting(false);
		}
	}, [hospitalData, channelData, messagingData, paymentData, shippingData]);

	const handleComplete = useCallback(() => {
		navigate('/hospitals');
	}, [navigate]);

	const renderStepContent = () => {
		switch (currentStep) {
			case 'hospital':
				return (
					<div className="flex flex-col gap-6">
						<h2 className="text-2xl font-bold">병원 정보</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block mb-2">병원 코드 *</label>
								<Input
									value={hospitalData.hospitalCode}
									onChange={(e) => setHospitalData({ ...hospitalData, hospitalCode: e.target.value })}
									placeholder="HOSPITAL-001"
								/>
							</div>
							<div>
								<label className="block mb-2">영문명 *</label>
								<Input
									value={hospitalData.nameEn}
									onChange={(e) => setHospitalData({ ...hospitalData, nameEn: e.target.value })}
									placeholder="Hospital Name (English)"
								/>
							</div>
							<div>
								<label className="block mb-2">로컬명</label>
								<Input
									value={hospitalData.nameLocal || ''}
									onChange={(e) => setHospitalData({ ...hospitalData, nameLocal: e.target.value })}
									placeholder="병원명"
								/>
							</div>
							<div>
								<label className="block mb-2">이메일 *</label>
								<Input
									type="email"
									value={hospitalData.email}
									onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
									placeholder="hospital@example.com"
								/>
							</div>
							<div>
								<label className="block mb-2">전화번호 *</label>
								<Input
									value={hospitalData.phone}
									onChange={(e) => setHospitalData({ ...hospitalData, phone: e.target.value })}
									placeholder="+66-2-123-4567"
								/>
							</div>
							<div>
								<label className="block mb-2">웹사이트</label>
								<Input
									value={hospitalData.website || ''}
									onChange={(e) => setHospitalData({ ...hospitalData, website: e.target.value })}
									placeholder="https://hospital.com"
								/>
							</div>
							<div className="col-span-2">
								<label className="block mb-2">주소 *</label>
								<Input
									value={hospitalData.address}
									onChange={(e) => setHospitalData({ ...hospitalData, address: e.target.value })}
									placeholder="Full address"
								/>
							</div>
							<div>
								<label className="block mb-2">도시</label>
								<Input
									value={hospitalData.city || ''}
									onChange={(e) => setHospitalData({ ...hospitalData, city: e.target.value })}
									placeholder="Bangkok"
								/>
							</div>
							<div>
								<label className="block mb-2">주/도</label>
								<Input
									value={hospitalData.state || ''}
									onChange={(e) => setHospitalData({ ...hospitalData, state: e.target.value })}
									placeholder="Bangkok"
								/>
							</div>
							<div>
								<label className="block mb-2">우편번호 *</label>
								<Input
									value={hospitalData.postalCode}
									onChange={(e) => setHospitalData({ ...hospitalData, postalCode: e.target.value })}
									placeholder="10110"
								/>
							</div>
							<div>
								<label className="block mb-2">국가 코드</label>
								<Input
									value={hospitalData.countryCode || 'TH'}
									onChange={(e) => setHospitalData({ ...hospitalData, countryCode: e.target.value })}
									placeholder="TH"
								/>
							</div>
							<div>
								<label className="block mb-2">타임존 *</label>
								<Select
									value={hospitalData.timezone}
									onChange={(e) => setHospitalData({ ...hospitalData, timezone: e.target.value })}
								>
									<option value="Asia/Bangkok">Asia/Bangkok</option>
									<option value="Asia/Seoul">Asia/Seoul</option>
									<option value="UTC">UTC</option>
								</Select>
							</div>
							<div>
								<label className="block mb-2">통화 *</label>
								<Select
									value={hospitalData.currency}
									onChange={(e) => setHospitalData({ ...hospitalData, currency: e.target.value })}
								>
									<option value="THB">THB (Thai Baht)</option>
									<option value="USD">USD (US Dollar)</option>
									<option value="KRW">KRW (Korean Won)</option>
								</Select>
							</div>
						</div>
					</div>
				);

			case 'channel':
				return (
					<div className="flex flex-col gap-6">
						<h2 className="text-2xl font-bold">채널 설정</h2>
						<div className="flex flex-col gap-4">
							<div>
								<label className="block mb-2">채널 타입 *</label>
								<Select
									value={channelData.channelType}
									onChange={(e) => setChannelData({ ...channelData, channelType: e.target.value as ChannelFormData['channelType'] })}
								>
									<option value="LINE">LINE</option>
									<option value="FACEBOOK">Facebook</option>
									<option value="TELEGRAM">Telegram</option>
									<option value="WHATSAPP">WhatsApp</option>
								</Select>
							</div>
							<div>
								<label className="block mb-2">서브도메인 *</label>
								<Input
									value={channelData.subdomain}
									onChange={(e) => setChannelData({ ...channelData, subdomain: e.target.value })}
									placeholder="hospital-name"
								/>
								<p className="text-sm text-gray-500 mt-1">
									URL: https://{channelData.subdomain || 'hospital-name'}.drcall.global
								</p>
							</div>
							{channelData.channelType === 'LINE' && (
								<div className="flex flex-col gap-4 border-t pt-4">
									<h3 className="font-semibold">LINE LIFF 설정</h3>
									<div>
										<label className="block mb-2">LIFF ID *</label>
										<Input
											value={channelData.liffConfig?.liffId || ''}
											onChange={(e) => setChannelData({
												...channelData,
												liffConfig: { ...channelData.liffConfig!, liffId: e.target.value }
											})}
											placeholder="1234567890-abcdefgh"
										/>
									</div>
									<div>
										<label className="block mb-2">Channel ID *</label>
										<Input
											value={channelData.liffConfig?.channelId || ''}
											onChange={(e) => setChannelData({
												...channelData,
												liffConfig: { ...channelData.liffConfig!, channelId: e.target.value }
											})}
											placeholder="Channel ID"
										/>
									</div>
									<div>
										<label className="block mb-2">Channel Secret *</label>
										<Input
											type="password"
											value={channelData.liffConfig?.channelSecret || ''}
											onChange={(e) => setChannelData({
												...channelData,
												liffConfig: { ...channelData.liffConfig!, channelSecret: e.target.value }
											})}
											placeholder="Channel Secret"
										/>
									</div>
									<div>
										<label className="block mb-2">Channel Access Token</label>
										<Input
											type="password"
											value={channelData.liffConfig?.channelAccessToken || ''}
											onChange={(e) => setChannelData({
												...channelData,
												liffConfig: { ...channelData.liffConfig!, channelAccessToken: e.target.value }
											})}
											placeholder="Channel Access Token (optional)"
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				);

			case 'messaging':
				return (
					<div className="flex flex-col gap-6">
						<h2 className="text-2xl font-bold">메시징 설정</h2>
						<div className="flex flex-col gap-4">
							<div>
								<label className="block mb-2">프로바이더 이름 *</label>
								<Input
									value={messagingData.providerName}
									onChange={(e) => setMessagingData({ ...messagingData, providerName: e.target.value })}
									placeholder="LINE Provider"
								/>
							</div>
							<div>
								<label className="block mb-2">Channel Access Token *</label>
								<Input
									type="password"
									value={messagingData.channelAccessToken}
									onChange={(e) => setMessagingData({ ...messagingData, channelAccessToken: e.target.value })}
									placeholder="Channel Access Token"
								/>
							</div>
							<div>
								<label className="block mb-2">Channel Secret *</label>
								<Input
									type="password"
									value={messagingData.channelSecret}
									onChange={(e) => setMessagingData({ ...messagingData, channelSecret: e.target.value })}
									placeholder="Channel Secret"
								/>
							</div>
							<div>
								<label className="block mb-2">분당 전송 제한</label>
								<Input
									type="number"
									value={messagingData.rateLimitPerMinute || ''}
									onChange={(e) => setMessagingData({ ...messagingData, rateLimitPerMinute: parseInt(e.target.value) || undefined })}
									placeholder="1000"
								/>
							</div>
							<div>
								<label className="block mb-2">일일 전송 제한</label>
								<Input
									type="number"
									value={messagingData.rateLimitPerDay || ''}
									onChange={(e) => setMessagingData({ ...messagingData, rateLimitPerDay: parseInt(e.target.value) || undefined })}
									placeholder="100000"
								/>
							</div>
						</div>
					</div>
				);

			case 'payment':
				return (
					<div className="flex flex-col gap-6">
						<h2 className="text-2xl font-bold">결제 설정 (OMISE)</h2>
						<div className="flex flex-col gap-4">
							<div>
								<label className="block mb-2">Public Key *</label>
								<Input
									type="password"
									value={paymentData.omise.publicKey}
									onChange={(e) => setPaymentData({
										...paymentData,
										omise: { ...paymentData.omise, publicKey: e.target.value }
									})}
									placeholder="pkey_test_..."
								/>
							</div>
							<div>
								<label className="block mb-2">Secret Key *</label>
								<Input
									type="password"
									value={paymentData.omise.secretKey}
									onChange={(e) => setPaymentData({
										...paymentData,
										omise: { ...paymentData.omise, secretKey: e.target.value }
									})}
									placeholder="skey_test_..."
								/>
							</div>
							<div>
								<label className="block mb-2">API Version</label>
								<Input
									value={paymentData.omise.apiVersion || ''}
									onChange={(e) => setPaymentData({
										...paymentData,
										omise: { ...paymentData.omise, apiVersion: e.target.value }
									})}
									placeholder="2019-05-29"
								/>
							</div>
						</div>
					</div>
				);

			case 'shipping':
				return (
					<div className="flex flex-col gap-6">
						<h2 className="text-2xl font-bold">배송 설정 (SHIPPOP)</h2>
						<div className="flex flex-col gap-4">
							<div>
								<label className="block mb-2">API Key *</label>
								<Input
									type="password"
									value={shippingData.shippop.apiKey}
									onChange={(e) => setShippingData({
										...shippingData,
										shippop: { ...shippingData.shippop, apiKey: e.target.value }
									})}
									placeholder="API Key"
								/>
							</div>
							<div>
								<label className="block mb-2">이메일 *</label>
								<Input
									type="email"
									value={shippingData.shippop.email}
									onChange={(e) => setShippingData({
										...shippingData,
										shippop: { ...shippingData.shippop, email: e.target.value }
									})}
									placeholder="shippop@example.com"
								/>
							</div>
							<div>
								<label className="block mb-2">기본 발송자 이름</label>
								<Input
									value={shippingData.shippop.defaultSenderName || ''}
									onChange={(e) => setShippingData({
										...shippingData,
										shippop: { ...shippingData.shippop, defaultSenderName: e.target.value }
									})}
									placeholder="Hospital Name"
								/>
							</div>
							<div>
								<label className="block mb-2">기본 발송자 전화번호</label>
								<Input
									value={shippingData.shippop.defaultSenderPhone || ''}
									onChange={(e) => setShippingData({
										...shippingData,
										shippop: { ...shippingData.shippop, defaultSenderPhone: e.target.value }
									})}
									placeholder="+66-2-123-4567"
								/>
							</div>
							<div>
								<label className="block mb-2">기본 발송자 주소</label>
								<Input
									value={shippingData.shippop.defaultSenderAddress || ''}
									onChange={(e) => setShippingData({
										...shippingData,
										shippop: { ...shippingData.shippop, defaultSenderAddress: e.target.value }
									})}
									placeholder="Full address"
								/>
							</div>
						</div>
					</div>
				);

			case 'review':
				return (
					<div className="flex flex-col gap-6">
						<h2 className="text-2xl font-bold">정보 검토</h2>
						<div className="bg-gray-50 p-6 rounded-lg space-y-4">
							<div>
								<h3 className="font-semibold mb-2">병원 정보</h3>
								<p>코드: {hospitalData.hospitalCode}</p>
								<p>영문명: {hospitalData.nameEn}</p>
								<p>로컬명: {hospitalData.nameLocal || '-'}</p>
								<p>이메일: {hospitalData.email}</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">채널 정보</h3>
								<p>타입: {channelData.channelType}</p>
								<p>서브도메인: {channelData.subdomain}</p>
								<p>URL: https://{channelData.subdomain}.drcall.global</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">메시징 정보</h3>
								<p>프로바이더: {messagingData.providerName}</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">결제 정보</h3>
								<p>게이트웨이: {paymentData.gateway}</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">배송 정보</h3>
								<p>프로바이더: {shippingData.provider}</p>
								<p>이메일: {shippingData.shippop.email}</p>
							</div>
						</div>
					</div>
				);

			case 'complete':
				return (
					<div className="flex flex-col gap-6 items-center justify-center py-12">
						<div className="text-6xl mb-4">✅</div>
						<h2 className="text-3xl font-bold">온보딩이 완료되었습니다!</h2>
						<p className="text-gray-600">병원이 성공적으로 등록되었습니다.</p>
						<Button onClick={handleComplete} className="mt-4">
							병원 목록으로 이동
						</Button>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="p-8">
			{/* Progress Steps */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					{STEPS.map((step, index) => (
						<div key={step} className="flex items-center flex-1">
							<div className="flex flex-col items-center flex-1">
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
										index < currentStepIndex
											? 'bg-green-500 text-white'
											: index === currentStepIndex
											? 'bg-primary-70 text-white'
											: 'bg-gray-200 text-gray-600'
									}`}
								>
									{index < currentStepIndex ? '✓' : index + 1}
								</div>
								<div className="mt-2 text-sm text-center">{STEP_LABELS[step]}</div>
							</div>
							{index < STEPS.length - 1 && (
								<div
									className={`h-1 flex-1 mx-2 ${
										index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
									}`}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Step Content */}
			<div className="bg-white rounded-lg p-8 shadow-sm min-h-[500px]">
				{renderStepContent()}
			</div>

			{/* Navigation Buttons */}
			{currentStep !== 'complete' && (
				<div className="flex justify-between mt-8">
					<Button
						variant="outline"
						onClick={handlePrev}
						disabled={currentStepIndex === 0}
					>
						이전
					</Button>
					{currentStep === 'review' ? (
						<Button onClick={handleSubmit} disabled={isSubmitting}>
							{isSubmitting ? '처리 중...' : '온보딩 완료'}
						</Button>
					) : (
						<Button onClick={handleNext}>
							다음
						</Button>
					)}
				</div>
			)}
		</div>
	);
}


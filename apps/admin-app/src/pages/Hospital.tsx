import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import icEdit from '@/shared/assets/icons/ic_edit.svg';
import icEditSmall from '@/shared/assets/icons/ic_edit_small.svg';
import icEditBg from '@/shared/assets/icons/ic_edit_bg.svg';
import icSearch from '@/shared/assets/icons/ic_search.svg';
import icCancel from '@/shared/assets/icons/ic_cancel.svg';
import icSave from '@/shared/assets/icons/ic_register.svg';
import TextLogo from '@/assets/logo_drcall.svg';
import CircleLogo from '@/assets/logo_circle.png';
// import { uploadFile } from '@/services/storageService';
import { hospitalService, type HospitalDetailResponse, type UpdateHospitalRequest } from '@/services/hospitalService';
import { toast } from 'react-hot-toast';

// Mock data
const mockHospital = {
	id: '1',
	nameLocal: 'Lorem Ipsum',
	nameEn: 'Lorem Ipsum',
	logoUrl: '',
	mobileLogoUrl: '',
	bankName: 'Lorem Ipsum',
	accountHolder: 'Lorem Ipsum',
	accountNumber: '123456789000',
	website: 'https://spherecorp.kr',
	address: 'Seocho-gu, Seoul, Republic of Korea 162, Baumoe-ro 1902, Building 103, Raemian Apartment, 192-458',
	postalCode: '192-458',
	addressDetail: 'Building 103, Raemian Apartment',
	phone: '01-123-456',
	phoneCountryCode: '+66',
};

interface ValidationErrors {
	nameLocal?: string;
	nameEn?: string;
	bankName?: string;
	accountHolder?: string;
	accountNumber?: string;
	website?: string;
	postalCode?: string;
	address?: string;
	addressDetail?: string;
	phone?: string;
}

export function Hospital() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [isEditMode, setIsEditMode] = useState(false);
	const [loading, setLoading] = useState(true);
	const [hospitalData, setHospitalData] = useState<HospitalDetailResponse | null>(null);
	const [formData, setFormData] = useState(mockHospital);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [webBiPreview, setWebBiPreview] = useState<string | null>(null);
	const [mobileBiPreview, setMobileBiPreview] = useState<string | null>(null);
	// const [webBiFileId, setWebBiFileId] = useState<number | null>(null);
	// const [mobileBiFileId, setMobileBiFileId] = useState<number | null>(null);
	const webBiInputRef = useRef<HTMLInputElement>(null);
	const mobileBiInputRef = useRef<HTMLInputElement>(null);

	// 병원 정보 로드
	useEffect(() => {
		const fetchHospital = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const hospital = await hospitalService.getHospitalById(id);
				setHospitalData(hospital);

				// 폼 데이터 설정
				setFormData({
					id: hospital.id.toString(),
					nameLocal: hospital.nameLocal || '',
					nameEn: hospital.nameEn || '',
					logoUrl: hospital.logoUrl || '',
					mobileLogoUrl: hospital.mobileLogoUrl || '',
					bankName: hospital.bankName || '',
					accountHolder: hospital.accountHolder || '',
					accountNumber: hospital.accountNumber || '',
					website: hospital.website || '',
					address: hospital.address || '',
					postalCode: hospital.postalCode || '',
					addressDetail: hospital.addressDetail || '',
					phone: hospital.phone || '',
					phoneCountryCode: hospital.countryCode || '+66',
				});

				// 로고 미리보기 설정
				if (hospital.logoUrl) {
					setWebBiPreview(hospital.logoUrl);
				}
				if (hospital.mobileLogoUrl) {
					setMobileBiPreview(hospital.mobileLogoUrl);
				}
			} catch (error) {
				console.error('병원 정보 로드 실패:', error);
				toast.error('병원 정보를 불러오는데 실패했습니다.');
				navigate('/hospitals');
			} finally {
				setLoading(false);
			}
		};

		fetchHospital();
	}, [id, navigate]);

	const handleNewHospital = () => {
		navigate('/hospitals/onboarding');
	};

	const handleEditClick = () => {
		setIsEditMode(true);
	};

	const handleCancelEdit = () => {
		setIsEditMode(false);
		// 원본 데이터로 복원
		if (hospitalData) {
			setFormData({
				id: hospitalData.id.toString(),
				nameLocal: hospitalData.nameLocal || '',
				nameEn: hospitalData.nameEn || '',
				logoUrl: hospitalData.logoUrl || '',
				mobileLogoUrl: hospitalData.mobileLogoUrl || '',
				bankName: hospitalData.bankName || '',
				accountHolder: hospitalData.accountHolder || '',
				accountNumber: hospitalData.accountNumber || '',
				website: hospitalData.website || '',
				address: hospitalData.address || '',
				postalCode: hospitalData.postalCode || '',
				addressDetail: hospitalData.addressDetail || '',
				phone: hospitalData.phone || '',
				phoneCountryCode: hospitalData.countryCode || '+66',
			});
			setWebBiPreview(hospitalData.logoUrl || null);
			setMobileBiPreview(hospitalData.mobileLogoUrl || null);
		}
		setErrors({});
		// setWebBiFileId(null);
		// setMobileBiFileId(null);
	};

	const handleSaveEdit = async () => {
		// Validation
		const newErrors: ValidationErrors = {};

		if (!formData.nameLocal.trim()) {
			newErrors.nameLocal = '병원명을 입력해 주세요.';
		}
		if (!formData.nameEn.trim()) {
			newErrors.nameEn = '병원명(영문명)을 입력해 주세요.';
		}
		if (!formData.bankName?.trim()) {
			newErrors.bankName = '은행명을 입력해 주세요.';
		}
		if (!formData.accountHolder?.trim()) {
			newErrors.accountHolder = '예금주를 입력해 주세요.';
		}
		if (!formData.accountNumber?.trim()) {
			newErrors.accountNumber = '계좌번호를 입력해 주세요.';
		}
		if (!formData.website?.trim()) {
			newErrors.website = '병원 홈페이지 주소를 입력해 주세요.';
		}
		if (!formData.postalCode?.trim()) {
			newErrors.postalCode = '우편번호를 검색해 주세요.';
		}
		if (!formData.address?.trim()) {
			newErrors.address = '주소를 입력해 주세요.';
		}
		if (!formData.addressDetail?.trim()) {
			newErrors.addressDetail = '상세 주소를 입력해 주세요.';
		}
		if (!formData.phone?.trim()) {
			newErrors.phone = '병원 연락처를 입력해 주세요.';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		if (!id) return;

		try {
			// 로고 업로드 처리
			let logoUrl = formData.logoUrl;
			let mobileLogoUrl = formData.mobileLogoUrl;

			if (webBiPreview && webBiPreview !== formData.logoUrl) {
				logoUrl = webBiPreview; // 이미 업로드된 URL 사용
			}

			if (mobileBiPreview && mobileBiPreview !== formData.mobileLogoUrl) {
				mobileLogoUrl = mobileBiPreview; // 이미 업로드된 URL 사용
			}

			// 병원 정보 업데이트 요청
			const updateRequest: UpdateHospitalRequest = {
				nameEn: formData.nameEn,
				nameLocal: formData.nameLocal,
				email: hospitalData?.email, // 기존 이메일 유지
				phone: formData.phone,
				website: formData.website,
				address: formData.address,
				addressDetail: formData.addressDetail,
				postalCode: formData.postalCode,
				countryCode: formData.phoneCountryCode,
				timezone: hospitalData?.timezone,
				currency: hospitalData?.currency,
				logoUrl,
				mobileLogoUrl,
				bankName: formData.bankName,
				accountHolder: formData.accountHolder,
				accountNumber: formData.accountNumber,
			};

			const updatedHospital = await hospitalService.updateHospital(id, updateRequest);
			setHospitalData(updatedHospital);

			toast.success('병원 정보가 성공적으로 수정되었습니다.');
			setIsEditMode(false);
			setErrors({});
		} catch (error) {
			console.error('병원 정보 수정 실패:', error);
			toast.error('병원 정보 수정에 실패했습니다.');
		}
	};

	const handleInputChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field as keyof ValidationErrors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	// 이미지 리사이징 및 Blob 변환 유틸리티
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const resizeImageToBlob = (
		file: File,
		maxWidth: number,
		maxHeight: number,
		isSquare: boolean = false,
	): Promise<{ blob: Blob; preview: string }> => {
		return new Promise((resolve, reject) => {
			// 파일 크기 체크 (5MB)
			if (file.size > 5 * 1024 * 1024) {
				reject(new Error('파일 크기는 5MB 이하여야 합니다.'));
				return;
			}

			// 파일 형식 체크
			if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
				reject(new Error('JPG, PNG 형식만 업로드 가능합니다.'));
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');
					if (!ctx) {
						reject(new Error('Canvas를 생성할 수 없습니다.'));
						return;
					}

					let width = img.width;
					let height = img.height;

					if (isSquare) {
						// 모바일 BI: 정사각형으로 크롭
						const size = Math.min(width, height);
						const x = (width - size) / 2;
						const y = (height - size) / 2;

						canvas.width = maxWidth;
						canvas.height = maxHeight;
						ctx.drawImage(img, x, y, size, size, 0, 0, maxWidth, maxHeight);
					} else {
						// 웹 BI: 비율 유지하면서 리사이징
						if (width > maxWidth || height > maxHeight) {
							const ratio = Math.min(maxWidth / width, maxHeight / height);
							width = width * ratio;
							height = height * ratio;
						}

						canvas.width = width;
						canvas.height = height;
						ctx.drawImage(img, 0, 0, width, height);
					}

					// Blob으로 변환 (Storage Service 업로드용)
					canvas.toBlob(
						(blob) => {
							if (!blob) {
								reject(new Error('이미지 변환에 실패했습니다.'));
								return;
							}
							// 미리보기용 base64
							const preview = canvas.toDataURL('image/jpeg', 0.9);
							resolve({ blob, preview });
						},
						'image/jpeg',
						0.9
					);
				};
				img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다.'));
				img.src = e.target?.result as string;
			};
			reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
			reader.readAsDataURL(file);
		});
	};

	const handleWebBiChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!id) return;

		try {
			// 파일 크기 체크 (5MB)
			if (file.size > 5 * 1024 * 1024) {
				toast.error('파일 크기는 5MB 이하여야 합니다.');
				return;
			}

			// 파일 형식 체크
			if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
				toast.error('JPG, PNG 형식만 업로드 가능합니다.');
				return;
			}

			// hospitalService를 통해 업로드
			const fileUrl = await hospitalService.uploadHospitalLogo(id, file, 'web');

			// 미리보기 설정
			setWebBiPreview(fileUrl);
			toast.success('웹 로고가 업로드되었습니다.');
		} catch (error) {
			console.error('웹 BI 업로드 실패:', error);
			toast.error('이미지 업로드에 실패했습니다.');
			setWebBiPreview(hospitalData?.logoUrl || null);
		}
	};

	const handleMobileBiChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!id) return;

		try {
			// 파일 크기 체크 (5MB)
			if (file.size > 5 * 1024 * 1024) {
				toast.error('파일 크기는 5MB 이하여야 합니다.');
				return;
			}

			// 파일 형식 체크
			if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
				toast.error('JPG, PNG 형식만 업로드 가능합니다.');
				return;
			}

			// hospitalService를 통해 업로드
			const fileUrl = await hospitalService.uploadHospitalLogo(id, file, 'mobile');

			// 미리보기 설정
			setMobileBiPreview(fileUrl);
			toast.success('모바일 로고가 업로드되었습니다.');
		} catch (error) {
			console.error('모바일 BI 업로드 실패:', error);
			toast.error('이미지 업로드에 실패했습니다.');
			setMobileBiPreview(hospitalData?.mobileLogoUrl || null);
		}
	};

	// 로딩 중일 때 표시
	if (loading) {
		return (
			<div className="h-full bg-bg-gray flex items-center justify-center">
				<div className="text-gray-500">로딩 중...</div>
			</div>
		);
	}

	return (
		<div className="h-full bg-bg-gray flex flex-col overflow-hidden">
			{/* 버튼 영역 */}
			<div className="px-5 pt-4 pb-3 flex justify-between items-center gap-2.5 flex-shrink-0">
				{!isEditMode && (
					<Button
						variant="primary"
						size="default"
						icon={<img src={icSave} alt="새 병원 등록" className="w-5 h-5" />}
						onClick={handleNewHospital}
					>
						새 병원 등록
					</Button>
				)}
				<div className="flex gap-2.5 ml-auto">
					{isEditMode ? (
						<>
							<Button
								variant="outline"
								size="default"
								icon={<img src={icCancel} alt="취소" className="w-5 h-5" />}
								onClick={handleCancelEdit}
							>
								취소하기
							</Button>
							<Button
								variant="primary"
								size="default"
								icon={<img src={icSave} alt="저장" className="w-5 h-5" />}
								onClick={handleSaveEdit}
							>
								저장하기
							</Button>
						</>
					) : (
						<Button
							variant="primary"
							size="default"
							icon={<img src={icEdit} alt="edit" className="w-5 h-5" />}
							onClick={handleEditClick}
						>
							정보 수정하기
						</Button>
					)}
				</div>
			</div>

			{/* 병원 정보 영역 */}
			<div className="flex-1 px-5 pb-5 overflow-auto">
				<div className="bg-white rounded-[10px] border border-stroke-input p-5">
					<div className="flex flex-col gap-5">
						{/* 웹 BI */}
						<div className="flex items-start gap-2.5">
							<div className="w-[200px] text-text-70 text-16">웹 BI</div>
							<div className="p-5 bg-white rounded-lg border border-stroke-input relative">
								<img
									src={webBiPreview || TextLogo}
									alt="Dr.Call"
									className="w-[164px] h-[42px] object-contain"
								/>
								{isEditMode && (
									<>
										<input
											type="file"
											ref={webBiInputRef}
											onChange={handleWebBiChange}
											accept="image/*"
											className="hidden"
										/>
										<button
											type="button"
											onClick={() => webBiInputRef.current?.click()}
											className="absolute bottom-2 right-2 w-[30px] h-[30px] flex items-center justify-center"
										>
											<img src={icEditBg} alt="background" className="w-[30px] h-[30px] absolute" />
											<img src={icEditSmall} alt="edit" className="w-4 h-4 relative z-10" />
										</button>
									</>
								)}
							</div>
						</div>

						{/* 모바일 웹 앱 BI */}
						<div className="flex items-start gap-2.5">
							<div className="w-[200px] text-text-70 text-16">모바일 웹 앱 BI</div>
							<div className="relative inline-block">
								<div className="w-[72px] h-[72px] rounded-full border-[1.5px] border-stroke-input overflow-hidden">
									<img
										src={mobileBiPreview || CircleLogo}
										alt="Dr.Call"
										className="w-full h-full object-cover"
									/>
								</div>
								{isEditMode && (
									<>
										<input
											type="file"
											ref={mobileBiInputRef}
											onChange={handleMobileBiChange}
											accept="image/*"
											className="hidden"
										/>
										<button
											type="button"
											onClick={() => mobileBiInputRef.current?.click()}
											className="absolute bottom-0 left-[46px] w-[30px] h-[30px] flex items-center justify-center"
										>
											<img src={icEditBg} alt="background" className="w-[30px] h-[30px] absolute" />
											<img src={icEditSmall} alt="edit" className="w-4 h-4 relative z-10" />
										</button>
									</>
								)}
							</div>
						</div>

						{/* 병원명 */}
						<div className="flex items-center gap-2.5 min-h-[28px]">
							<div className="w-[200px] text-text-70 text-16">
								병원명
								{isEditMode && <span className="text-system-error">*</span>}
							</div>
							{isEditMode ? (
								<div className="flex-1 flex flex-col gap-1.5">
									<Input
										value={formData.nameLocal}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('nameLocal', e.target.value)}
										placeholder="병원명을 입력해 주세요."
										size="small"
										error={!!errors.nameLocal}
									/>
									{errors.nameLocal && (
										<span className="text-system-error text-14">{errors.nameLocal}</span>
									)}
								</div>
							) : (
								<div className="flex-1 text-text-100 text-16">{formData.nameLocal}</div>
							)}
						</div>

						{/* 병원명(영문명) */}
						<div className="flex items-center gap-2.5 min-h-[28px]">
							<div className="w-[200px] text-text-70 text-16">
								병원명(영문명)
								{isEditMode && <span className="text-system-error">*</span>}
							</div>
							{isEditMode ? (
								<div className="flex-1 flex flex-col gap-1.5">
									<Input
										value={formData.nameEn}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('nameEn', e.target.value)}
										placeholder="영문 병원명을 입력해 주세요."
										size="small"
										error={!!errors.nameEn}
									/>
									{errors.nameEn && (
										<span className="text-system-error text-14">{errors.nameEn}</span>
									)}
								</div>
							) : (
								<div className="flex-1 text-text-100 text-16">{formData.nameEn}</div>
							)}
						</div>

						{/* 계좌 정보 */}
						<div className="flex items-start gap-2.5">
							<div className="w-[200px] text-text-70 text-16">
								계좌 정보
								{isEditMode && <span className="text-system-error">*</span>}
							</div>
							<div className="flex-1 flex flex-col gap-5">
								{/* 은행명 */}
								<div className="flex items-center gap-2.5 min-h-[28px]">
									<div className="w-[160px] text-text-40 text-16">은행명</div>
									{isEditMode ? (
										<div className="flex-1 flex flex-col gap-1.5">
											<Input
												value={formData.bankName}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('bankName', e.target.value)}
												placeholder="은행명을 입력해 주세요."
												size="small"
												error={!!errors.bankName}
											/>
											{errors.bankName && (
												<span className="text-system-error text-14">{errors.bankName}</span>
											)}
										</div>
									) : (
										<div className="flex-1 text-text-100 text-16">{formData.bankName}</div>
									)}
								</div>
								{/* 예금주 */}
								<div className="flex items-center gap-2.5 min-h-[28px]">
									<div className="w-[160px] text-text-40 text-16">예금주</div>
									{isEditMode ? (
										<div className="flex-1 flex flex-col gap-1.5">
											<Input
												value={formData.accountHolder}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('accountHolder', e.target.value)}
												placeholder="예금주를 입력해 주세요."
												size="small"
												error={!!errors.accountHolder}
											/>
											{errors.accountHolder && (
												<span className="text-system-error text-14">{errors.accountHolder}</span>
											)}
										</div>
									) : (
										<div className="flex-1 text-text-100 text-16">{formData.accountHolder}</div>
									)}
								</div>
								{/* 계좌번호 */}
								<div className="flex items-center gap-2.5 min-h-[28px]">
									<div className="w-[160px] text-text-40 text-16">계좌번호</div>
									{isEditMode ? (
										<div className="flex-1 flex flex-col gap-1.5">
											<Input
												value={formData.accountNumber}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('accountNumber', e.target.value)}
												placeholder="계좌번호를 입력해 주세요."
												size="small"
												error={!!errors.accountNumber}
											/>
											{errors.accountNumber && (
												<span className="text-system-error text-14">{errors.accountNumber}</span>
											)}
										</div>
									) : (
										<div className="flex-1 text-text-100 text-16">{formData.accountNumber}</div>
									)}
								</div>
							</div>
						</div>

						{/* 병원 홈페이지 */}
						<div className="flex items-center gap-2.5 min-h-[28px]">
							<div className="w-[200px] text-text-70 text-16">
								병원 홈페이지
								{isEditMode && <span className="text-system-error">*</span>}
							</div>
							{isEditMode ? (
								<div className="flex-1 flex flex-col gap-1.5">
									<Input
										value={formData.website}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('website', e.target.value)}
										placeholder="병원 홈페이지 주소를 입력해 주세요."
										size="small"
										error={!!errors.website}
									/>
									{errors.website && (
										<span className="text-system-error text-14">{errors.website}</span>
									)}
								</div>
							) : (
								<div className="flex-1 text-text-100 text-16">{formData.website}</div>
							)}
						</div>

						{/* 주소 */}
						<div className="flex items-start gap-2.5">
							<div className="w-[200px] text-text-70 text-16">
								주소
								{isEditMode && <span className="text-system-error">*</span>}
							</div>
							<div className="flex-1 flex flex-col gap-5">
								{/* 우편번호 */}
								{isEditMode ? (
									<div className="flex flex-col gap-1.5">
										<Input
											value={formData.postalCode}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('postalCode', e.target.value)}
											placeholder="우편번호를 검색해 주세요."
											size="small"
											error={!!errors.postalCode}
											icon={<img src={icSearch} alt="search" className="w-7 h-7" />}
										/>
										{errors.postalCode && (
											<span className="text-system-error text-14">{errors.postalCode}</span>
										)}
									</div>
								) : (
									<div className="text-text-100 text-16">{formData.postalCode}</div>
								)}

								{/* 주소 */}
								{isEditMode ? (
									<div className="flex flex-col gap-1.5">
										<Input
											value={formData.address}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
											placeholder="주소를 입력해 주세요."
											size="small"
											error={!!errors.address}
										/>
										{errors.address && (
											<span className="text-system-error text-14">{errors.address}</span>
										)}
									</div>
								) : (
									<div className="text-text-100 text-16">{formData.address}</div>
								)}

								{/* 상세 주소 */}
								{isEditMode ? (
									<div className="flex flex-col gap-1.5">
										<Input
											value={formData.addressDetail}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('addressDetail', e.target.value)}
											placeholder="상세 주소를 입력해 주세요."
											size="small"
											error={!!errors.addressDetail}
										/>
										{errors.addressDetail && (
											<span className="text-system-error text-14">{errors.addressDetail}</span>
										)}
									</div>
								) : (
									<div className="text-text-100 text-16">{formData.addressDetail}</div>
								)}
							</div>
						</div>

						{/* 연락처 */}
						<div className="flex items-center gap-2.5 min-h-[28px]">
							<div className="w-[200px] text-text-70 text-16">
								연락처
								{isEditMode && <span className="text-system-error">*</span>}
							</div>
							{isEditMode ? (
								<div className="flex-1 flex flex-col gap-1.5">
									<div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
										<Input
											value={formData.phoneCountryCode || '+66'}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phoneCountryCode', e.target.value)}
											placeholder="+66"
											size="small"
											style={{ width: '100px', flexShrink: 0 }}
										/>
										<div style={{ width: '1px', height: '1.5rem', background: '#d9d9d9' }} />
										<Input
											value={formData.phone}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
											placeholder="병원 연락처를 입력해 주세요."
											size="small"
											error={!!errors.phone}
											style={{ flex: 1 }}
										/>
									</div>
									{errors.phone && (
										<span className="text-system-error text-14">{errors.phone}</span>
									)}
								</div>
							) : (
								<div className="flex-1 text-text-100 text-16">{formData.phoneCountryCode ? `${formData.phoneCountryCode} ${formData.phone}` : formData.phone}</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Hospital;

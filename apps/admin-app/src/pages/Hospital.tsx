import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { uploadFile } from '@/services/storageService';

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
	const [isEditMode, setIsEditMode] = useState(false);
	const [formData, setFormData] = useState(mockHospital);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [webBiPreview, setWebBiPreview] = useState<string | null>(null);
	const [mobileBiPreview, setMobileBiPreview] = useState<string | null>(null);
	const [webBiFileId, setWebBiFileId] = useState<number | null>(null);
	const [mobileBiFileId, setMobileBiFileId] = useState<number | null>(null);
	const webBiInputRef = useRef<HTMLInputElement>(null);
	const mobileBiInputRef = useRef<HTMLInputElement>(null);

	const handleNewHospital = () => {
		navigate('/hospitals/onboarding');
	};

	const handleEditClick = () => {
		setIsEditMode(true);
	};

	const handleCancelEdit = () => {
		setIsEditMode(false);
		setFormData(mockHospital);
		setErrors({});
		setWebBiPreview(null);
		setMobileBiPreview(null);
		setWebBiFileId(null);
		setMobileBiFileId(null);
	};

	const handleSaveEdit = () => {
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

		// TODO: API 호출
		console.log('Save hospital info', formData);
		console.log('Web BI fileId:', webBiFileId);
		console.log('Mobile BI fileId:', mobileBiFileId);
		setIsEditMode(false);
		setErrors({});
	};

	const handleInputChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field as keyof ValidationErrors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	// 이미지 리사이징 및 Blob 변환 유틸리티
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

		try {
			// 웹 BI: 최대 500px 너비/높이, 비율 유지
			const { blob, preview } = await resizeImageToBlob(file, 500, 500, false);
			
			// 미리보기 설정
			setWebBiPreview(preview);

			// Storage Service에 업로드
			// TODO: 실제 hospitalId는 인증된 사용자 정보에서 가져와야 함
			const fileId = await uploadFile(blob, {
				category: 'LOGO',
				ownerId: 1, // TODO: 실제 hospital ID
				ownerType: 'HOSPITAL',
				hospitalId: 1, // TODO: 실제 hospital ID
				accessLevel: 'PUBLIC',
			});

			setWebBiFileId(fileId);
		} catch (error) {
			console.error('웹 BI 업로드 실패:', error);
			alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
			setWebBiPreview(null);
			setWebBiFileId(null);
		}
	};

	const handleMobileBiChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			// 모바일 BI: 200x200px 정사각형으로 크롭
			const { blob, preview } = await resizeImageToBlob(file, 200, 200, true);
			
			// 미리보기 설정
			setMobileBiPreview(preview);

			// Storage Service에 업로드
			// TODO: 실제 hospitalId는 인증된 사용자 정보에서 가져와야 함
			const fileId = await uploadFile(blob, {
				category: 'LOGO',
				ownerId: 1, // TODO: 실제 hospital ID
				ownerType: 'HOSPITAL',
				hospitalId: 1, // TODO: 실제 hospital ID
				accessLevel: 'PUBLIC',
			});

			setMobileBiFileId(fileId);
		} catch (error) {
			console.error('모바일 BI 업로드 실패:', error);
			alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
			setMobileBiPreview(null);
			setMobileBiFileId(null);
		}
	};

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

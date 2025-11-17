import { useState } from 'react';
import { Modal } from './Modal';
import { Input, Textarea } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import ValidationInfoIcon from '@/shared/assets/icons/ic_validation_info.svg';
import BlankProfileImage from '@/shared/assets/icons/img_blank_profile.svg';
import CameraIcon from '@/shared/assets/icons/ic_camera.svg';
import { uploadFile } from '@/services/storageService';

interface DoctorRegistrationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: DoctorFormData) => void;
}

export interface DoctorFormData {
	userId: string;
	name: string;
	nameEn: string;
	introduction: string;
	careerEducation: string;
	profileImageFileId?: number; // Storage Service File ID
}

type IdCheckStatus = 'idle' | 'error-format' | 'error-duplicate' | 'success';

export function DoctorRegistrationModal({
	isOpen,
	onClose,
	onSubmit,
}: DoctorRegistrationModalProps) {
	const [formData, setFormData] = useState<DoctorFormData>({
		userId: '',
		name: '',
		nameEn: '',
		introduction: '',
		careerEducation: '',
	});

	const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
	const [idCheckStatus, setIdCheckStatus] = useState<IdCheckStatus>('idle');

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// 파일 크기 체크 (5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert('파일 크기는 5MB 이하여야 합니다.');
			return;
		}

		// 파일 형식 체크
		if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
			alert('JPG, PNG 형식만 업로드 가능합니다.');
			return;
		}

		setIsUploading(true);

		try {
			// 미리보기 설정
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfileImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);

			// Storage Service에 업로드
			// TODO: 실제 hospitalId와 doctorId는 인증된 사용자 정보에서 가져와야 함
			const fileId = await uploadFile(file, {
				category: 'PROFILE_IMAGE',
				ownerId: 1, // TODO: 실제 doctor ID (등록 전이므로 임시값)
				ownerType: 'DOCTOR',
				hospitalId: 1, // TODO: 실제 hospital ID
				accessLevel: 'PUBLIC',
			});

			setFormData({ ...formData, profileImageFileId: fileId });
		} catch (error) {
			console.error('프로필 이미지 업로드 실패:', error);
			alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
			setProfileImagePreview(null);
		} finally {
			setIsUploading(false);
		}
	};

	const handleCheckDuplicate = () => {
		// 형식 검사
		const isIdValid = /^[a-zA-Z0-9]{5,12}$/.test(formData.userId);
		if (!isIdValid) {
			setIdCheckStatus('error-format');
			return;
		}

		// TODO: 실제 중복 확인 API 호출
		console.log('중복 확인:', formData.userId);

		// 임시: 랜덤으로 중복 여부 결정 (실제로는 API 응답 사용)
		const isDuplicate = Math.random() > 0.5;
		setIdCheckStatus(isDuplicate ? 'error-duplicate' : 'success');
	};

	const handleSubmit = () => {
		// TODO: 유효성 검사
		onSubmit(formData);
		onClose();
	};

	// 모든 필수 필드가 채워졌는지 확인
	const isFormValid =
		formData.userId &&
		formData.name &&
		formData.nameEn &&
		formData.introduction &&
		formData.careerEducation &&
		idCheckStatus === 'success';

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="의료진 등록" width="580px">
			<div className="-mx-6 px-5 pb-5 flex gap-5">
				{/* 프로필 이미지 */}
				<div className="flex-shrink-0">
					<label className="block w-40 h-[200px] rounded cursor-pointer relative overflow-hidden">
						{profileImagePreview ? (
							<img
								src={profileImagePreview}
								alt="프로필 미리보기"
								className="w-full h-full object-cover"
							/>
						) : (
							<img
								src={BlankProfileImage}
								alt="프로필 이미지 없음"
								className="w-full h-full"
							/>
						)}
						<input
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleImageUpload}
						/>
						{/* 카메라 아이콘 */}
						<div className="absolute bottom-1.5 right-1.5 w-[30px] h-[30px] bg-primary-70 rounded-full flex items-center justify-center">
							<img src={CameraIcon} alt="" className="w-[18px] h-[15px]" />
						</div>
					</label>
				</div>

				{/* 폼 필드 */}
				<div className="flex-1 flex flex-col gap-5">
					{/* 아이디 */}
					<div className="flex flex-col gap-2.5">
						<label className="text-16 text-text-50 leading-none">
							아이디<span className="text-system-error">*</span>
						</label>
						<div className="flex flex-col gap-1.5">
							<div className="flex gap-2.5">
								<Input
									placeholder="아이디를 입력해 주세요."
									value={formData.userId}
									onChange={(e) => {
										setFormData({ ...formData, userId: e.target.value });
										setIdCheckStatus('idle');
									}}
									size="medium"
									compact
								/>
								<button
									onClick={handleCheckDuplicate}
									disabled={!formData.userId}
									className={cn(
										'px-5 h-10 rounded-[50px] text-18 font-normal whitespace-nowrap',
										formData.userId
											? 'bg-primary-70 text-white'
											: 'bg-text-30 text-white cursor-not-allowed',
									)}
								>
									중복 확인
								</button>
							</div>
							<div className="flex flex-col gap-1.5">
								<div className="flex items-center gap-1">
									<img src={ValidationInfoIcon} alt="" className="w-[14px] h-[14px]" />
									<div className="flex-1 text-primary-70 text-14 font-pretendard font-normal">
										5~12자 영어와 숫자 혼합
									</div>
								</div>
								{idCheckStatus !== 'idle' && (
									<div
										className={cn(
											'w-full text-14 font-pretendard font-normal',
											idCheckStatus === 'success'
												? 'text-[#11AC51]'
												: 'text-system-error',
										)}
									>
										{idCheckStatus === 'error-format' &&
											'5~12자 영어와 숫자를 조합하여 입력해 주세요.'}
										{idCheckStatus === 'error-duplicate' &&
											'이미 사용중인 아이디 입니다.'}
										{idCheckStatus === 'success' && '사용 가능한 아이디 입니다.'}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* 이름 */}
					<div className="flex flex-col gap-2.5">
						<label className="text-16 text-text-50 leading-none">
							이름<span className="text-system-error">*</span>
						</label>
						<Input
							placeholder="이름을 입력해 주세요."
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							size="medium"
							compact
						/>
					</div>

					{/* 이름(영문명) */}
					<div className="flex flex-col gap-2.5">
						<label className="text-16 text-text-50 leading-none">
							이름(영문명)<span className="text-system-error">*</span>
						</label>
						<Input
							placeholder="이름(영문명)을 입력해 주세요."
							value={formData.nameEn}
							onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
							size="medium"
							compact
						/>
					</div>

					{/* 자기소개 */}
					<div className="flex flex-col gap-2.5">
						<label className="text-16 text-text-50 leading-none">
							자기소개<span className="text-system-error">*</span>
						</label>
						<Textarea
							placeholder="환자에게 표시될 자기소개를 입력해 주세요.&#10;(최대 50자 입력 가능)"
							value={formData.introduction}
							onChange={(e) =>
								setFormData({ ...formData, introduction: e.target.value })
							}
							maxLength={50}
							wrapperClassName='gap-2.5'
						/>
					</div>

					{/* 경력&학력 */}
					<div className="flex flex-col gap-2.5">
						<label className="text-16 text-text-50 leading-none">
							경력&학력<span className="text-system-error">*</span>
						</label>
						<Textarea
							placeholder="환자에게 표시될 경력&학력을 입력해 주세요.&#10;(최대 50자 입력 가능)"
							value={formData.careerEducation}
							onChange={(e) =>
								setFormData({ ...formData, careerEducation: e.target.value })
							}
							maxLength={50}
							wrapperClassName='gap-2.5'
						/>
					</div>
				</div>
			</div>

			{/* 확인 버튼 */}
			<div
				className={cn(
					'h-[70px] -mx-6 -mb-6 rounded-b-[10px] flex items-center justify-center',
					isFormValid ? 'bg-primary-70' : 'bg-text-30',
				)}
			>
				<button
					onClick={handleSubmit}
					disabled={!isFormValid}
					className={cn(
						'text-20 font-semibold text-white transition-opacity',
						isFormValid ? 'hover:opacity-90 cursor-pointer' : 'cursor-not-allowed',
					)}
				>
					확인
				</button>
			</div>
		</Modal>
	);
}

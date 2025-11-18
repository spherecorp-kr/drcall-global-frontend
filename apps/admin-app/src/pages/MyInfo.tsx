import { useState, useRef } from 'react';
import Button from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import PasswordChangeModal from '@/shared/components/ui/PasswordChangeModal';
import icEdit from '@/shared/assets/icons/ic_edit.svg';
import icEditSmall from '@/shared/assets/icons/ic_edit_small.svg';
import icEditBg from '@/shared/assets/icons/ic_edit_bg.svg';
import icLock from '@/shared/assets/icons/ic_lock.svg';
import icCancel from '@/shared/assets/icons/ic_cancel.svg';
import icSave from '@/shared/assets/icons/ic_register.svg';
import imgBlankProfile from '@/shared/assets/icons/img_blank_profile.svg';

// Mock data
const mockProfile = {
	id: '1',
	name: 'Lorem Ipsum',
	username: 'Lorem Ipsum',
	profileImageUrl: '',
};

export function MyInfo() {
	const [isEditMode, setIsEditMode] = useState(false);
	const [formData, setFormData] = useState(mockProfile);
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const profileInputRef = useRef<HTMLInputElement>(null);

	const handleEditClick = () => {
		setIsEditMode(true);
	};

	const handleCancelEdit = () => {
		setIsEditMode(false);
		setFormData(mockProfile);
		setProfilePreview(null);
	};

	const handleSave = () => {
		// TODO: API 호출
		console.log('Save profile', formData);
		console.log('Profile image:', profilePreview);
		setIsEditMode(false);
	};

	const handlePasswordChange = () => {
		setIsPasswordModalOpen(true);
	};

	const handlePasswordSubmit = (currentPassword: string, newPassword: string) => {
		// TODO: API 호출
		console.log('Password change:', { currentPassword, newPassword });
	};

	const handleInputChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// 이미지 리사이징 유틸리티
	const resizeImage = (file: File, size: number): Promise<string> => {
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

					// 정사각형으로 크롭
					const minSize = Math.min(img.width, img.height);
					const x = (img.width - minSize) / 2;
					const y = (img.height - minSize) / 2;

					canvas.width = size;
					canvas.height = size;
					ctx.drawImage(img, x, y, minSize, minSize, 0, 0, size, size);

					// 최적화된 이미지를 base64로 변환 (quality: 0.9)
					resolve(canvas.toDataURL('image/jpeg', 0.9));
				};
				img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다.'));
				img.src = e.target?.result as string;
			};
			reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
			reader.readAsDataURL(file);
		});
	};

	const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				// 프로필 이미지: 200x200px 정사각형으로 크롭
				const resizedImage = await resizeImage(file, 200);
				setProfilePreview(resizedImage);
			} catch (error) {
				console.error('프로필 이미지 업로드 실패:', error);
				alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
			}
		}
	};

	return (
		<>
			<PasswordChangeModal
				isOpen={isPasswordModalOpen}
				onClose={() => setIsPasswordModalOpen(false)}
				onSubmit={handlePasswordSubmit}
			/>
			<div className="h-full bg-bg-gray flex flex-col overflow-hidden">
				{/* 버튼 영역 */}
				<div className="px-5 pt-4 pb-3 flex justify-end items-center gap-2.5 flex-shrink-0">
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
							onClick={handleSave}
						>
							저장하기
						</Button>
					</>
				) : (
					<>
						<Button
							variant="outline"
							size="default"
							icon={<img src={icLock} alt="비밀번호" className="w-5 h-5" />}
							onClick={handlePasswordChange}
						>
							비밀번호 변경하기
						</Button>
						<Button
							variant="primary"
							size="default"
							icon={<img src={icEdit} alt="수정" className="w-5 h-5" />}
							onClick={handleEditClick}
						>
							정보 수정하기
						</Button>
					</>
				)}
			</div>

			{/* 프로필 정보 영역 */}
			<div className="flex-1 px-5 pb-5 overflow-auto">
				<div className="bg-white rounded-[10px] border border-stroke-input p-5">
					<div className="flex flex-col gap-5">
						{/* 프로필 사진 */}
						<div className="flex items-start gap-2.5">
							<div className="w-[200px] text-text-70 text-16">프로필 사진</div>
							<div className="relative inline-block">
								<div className="w-[72px] h-[72px] rounded-full overflow-hidden">
									<img
										src={profilePreview || imgBlankProfile}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								</div>
								{isEditMode && (
									<>
										<input
											type="file"
											ref={profileInputRef}
											onChange={handleProfileImageChange}
											accept="image/*"
											className="hidden"
										/>
										<button
											type="button"
											onClick={() => profileInputRef.current?.click()}
											className="absolute bottom-0 left-[46px] w-[30px] h-[30px] flex items-center justify-center"
										>
											<img src={icEditBg} alt="background" className="w-[30px] h-[30px] absolute" />
											<img src={icEditSmall} alt="edit" className="w-4 h-4 relative z-10" />
										</button>
									</>
								)}
							</div>
						</div>

						{/* 이름 */}
						<div className="flex items-center gap-2.5 min-h-[28px]">
							<div className="w-[200px] text-text-70 text-16">이름</div>
							{isEditMode ? (
								<div className="flex-1">
									<Input
										value={formData.name}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
										placeholder="이름을 입력해 주세요."
										size="small"
									/>
								</div>
							) : (
								<div className="flex-1 text-text-100 text-16 pl-3">{formData.name}</div>
							)}
						</div>

						{/* 아이디 */}
						<div className="flex items-center gap-2.5 min-h-[28px]">
							<div className="w-[200px] text-text-70 text-16">아이디</div>
							<div className="flex-1 text-text-100 text-16 pl-3">{formData.username}</div>
						</div>
					</div>
				</div>
			</div>
			</div>
		</>
	);
}

export default MyInfo;

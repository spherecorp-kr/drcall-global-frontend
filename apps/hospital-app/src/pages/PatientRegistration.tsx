import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Input, Radio, Textarea } from '@/shared/components/ui';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import icCancel from '@/shared/assets/icons/ic_cancel.svg';
import icRegister from '@/shared/assets/icons/ic_register.svg';
import icSearch from '@/shared/assets/icons/ic_search.svg';
import CalendarIcon from '@/shared/assets/icons/Calendar_Days.svg?react';

interface PatientFormData {
	name: string;
	gender: 'male' | 'female' | '';
	thaiId: string;
	phoneNumber: string;
	postalCode: string;
	address: string;
	detailAddress: string;
	height: string;
	weight: string;
	bloodType: string;
	drinkingHabit: string;
	smokingHabit: string;
	birthDate: string;
	patientGrade: string;
	currentMedications: string;
	personalHistory: string;
	familyHistory: string;
}

interface ValidationErrors {
	name?: string;
	gender?: string;
	thaiId?: string;
	phoneNumber?: string;
	address?: string;
	detailAddress?: string;
	birthDate?: string;
	patientGrade?: string;
}

export function PatientRegistration() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<PatientFormData>({
		name: '',
		gender: '',
		thaiId: '',
		phoneNumber: '',
		postalCode: '',
		address: '',
		detailAddress: '',
		height: '',
		weight: '',
		bloodType: '',
		drinkingHabit: '',
		smokingHabit: '',
		birthDate: '',
		patientGrade: '',
		currentMedications: '',
		personalHistory: '',
		familyHistory: '',
	});

	const [errors, setErrors] = useState<ValidationErrors>({});

	const handleInputChange = (field: keyof PatientFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// 입력 시 해당 필드의 에러 제거
		if (errors[field as keyof ValidationErrors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleCancel = () => {
		navigate(-1);
	};

	const validateForm = (): boolean => {
		const newErrors: ValidationErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = '이름을 입력해 주세요.';
		}

		if (!formData.gender) {
			newErrors.gender = '성별을 선택해 주세요.';
		}

		if (!formData.thaiId.trim()) {
			newErrors.thaiId = 'Thai ID Number를 입력해 주세요.';
		} else if (!/^\d{13}$/.test(formData.thaiId)) {
			newErrors.thaiId = 'Thai ID Number를 확인해 주세요.';
		}

		if (!formData.phoneNumber.trim()) {
			newErrors.phoneNumber = '휴대폰 번호를 입력해 주세요.';
		} else if (!/^\d{10}$/.test(formData.phoneNumber)) {
			newErrors.phoneNumber = '휴대폰 번호를 확인해 주세요.';
		}

		if (!formData.address.trim()) {
			newErrors.address = '주소를 입력해 주세요.';
		}

		if (!formData.detailAddress.trim()) {
			newErrors.detailAddress = '상세 주소를 입력해 주세요.';
		}

		if (!formData.birthDate) {
			newErrors.birthDate = '생년월일을 선택해 주세요.';
		}

		if (!formData.patientGrade) {
			newErrors.patientGrade = '환자 등급을 선택해 주세요.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (!validateForm()) {
			return;
		}

		// TODO: 실제 API 호출
		console.log('환자 등록:', formData);
		navigate(-1);
	};

	const bloodTypeOptions = [
		{ value: 'A', label: 'A형' },
		{ value: 'B', label: 'B형' },
		{ value: 'AB', label: 'AB형' },
		{ value: 'O', label: 'O형' },
	];

	const handleBloodTypeChange = (value: string) => {
		// 이미 선택된 값을 다시 클릭하면 해제
		if (formData.bloodType === value) {
			handleInputChange('bloodType', '');
		} else {
			handleInputChange('bloodType', value);
		}
	};

	const patientGradeOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'vip', label: 'VIP' },
		{ value: 'risk', label: 'Risk' },
	];

	const drinkingOptions = [
		{ value: '1', label: '1' },
		{ value: '1-2', label: '1~2' },
		{ value: '3+', label: '3+' },
	];

	const smokingOptions = [
		{ value: '1', label: '1' },
		{ value: '1-5', label: '1~5' },
		{ value: '6+', label: '6+' },
	];

	const handleDrinkingChange = (value: string) => {
		// 이미 선택된 값을 다시 클릭하면 해제
		if (formData.drinkingHabit === value) {
			handleInputChange('drinkingHabit', '');
		} else {
			handleInputChange('drinkingHabit', value);
		}
	};

	const handleSmokingChange = (value: string) => {
		// 이미 선택된 값을 다시 클릭하면 해제
		if (formData.smokingHabit === value) {
			handleInputChange('smokingHabit', '');
		} else {
			handleInputChange('smokingHabit', value);
		}
	};

	return (
		<div className="h-full bg-bg-gray flex flex-col overflow-hidden">
			{/* 버튼 영역 */}
			<div className="px-5 pt-4 pb-3 flex justify-end items-center gap-2.5 flex-shrink-0">
				<Button
					variant="outline"
					size="default"
					icon={<img src={icCancel} alt="cancel" className="w-5 h-5" />}
					onClick={handleCancel}
				>
					취소하기
				</Button>
				<Button
					variant="primary"
					size="default"
					icon={<img src={icRegister} alt="register" className="w-5 h-5" />}
					onClick={handleSubmit}
				>
					등록하기
				</Button>
			</div>

			{/* 폼 영역 */}
			<div className="flex-1 px-5 pb-5 overflow-auto">
				<div className="bg-white rounded-[10px] border border-stroke-input p-5">
					<div className="flex items-start gap-5">
						{/* 왼쪽 컬럼 */}
						<div className="flex-1 flex flex-col gap-4">
							{/* 이름 */}
							<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
								<div className="pt-1">
									<span className="text-text-70 text-16">이름</span>
									<span className="text-system-error text-16">*</span>
								</div>
								<div className="flex flex-col gap-1.5">
									<Input
										value={formData.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										placeholder="이름을 입력해 주세요."
										size="small"
										error={!!errors.name}
									/>
									{errors.name && (
										<span className="text-system-error text-14">{errors.name}</span>
									)}
								</div>
							</div>

							{/* 성별 */}
							<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
								<div className="pt-1">
									<span className="text-text-70 text-16">성별</span>
									<span className="text-system-error text-16">*</span>
								</div>
								<div className="flex flex-col gap-1.5">
									<div className="flex items-center gap-5">
										<Radio
											label="남자"
											checked={formData.gender === 'male'}
											onChange={() => handleInputChange('gender', 'male')}
										/>
										<Radio
											label="여자"
											checked={formData.gender === 'female'}
											onChange={() => handleInputChange('gender', 'female')}
										/>
									</div>
									{errors.gender && (
										<span className="text-system-error text-14">{errors.gender}</span>
									)}
								</div>
							</div>

							{/* Thai ID Number */}
							<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
								<div className="pt-1">
									<span className="text-text-70 text-16">Thai ID Number</span>
									<span className="text-system-error text-16">*</span>
								</div>
								<div className="flex flex-col gap-1.5">
									<Input
										value={formData.thaiId}
										onChange={(e) => handleInputChange('thaiId', e.target.value)}
										placeholder="'-'없이 숫자만 입력해 주세요."
										size="small"
										error={!!errors.thaiId}
									/>
									{errors.thaiId && (
										<span className="text-system-error text-14">{errors.thaiId}</span>
									)}
								</div>
							</div>

							{/* 휴대폰 번호 */}
							<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
								<div className="pt-1">
									<span className="text-text-70 text-16">휴대폰 번호</span>
									<span className="text-system-error text-16">*</span>
								</div>
								<div className="flex flex-col gap-1.5">
									<Input
										value={formData.phoneNumber}
										onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
										placeholder="'-'없이 숫자만 입력해 주세요."
										size="small"
										error={!!errors.phoneNumber}
									/>
									{errors.phoneNumber && (
										<span className="text-system-error text-14">{errors.phoneNumber}</span>
									)}
								</div>
							</div>

							{/* 주소 */}
							<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
								<div>
									<span className="text-text-70 text-16">주소</span>
									<span className="text-system-error text-16">*</span>
								</div>
								<div className="flex flex-col gap-2.5">
									<Input
										value={formData.postalCode}
										onChange={(e) => handleInputChange('postalCode', e.target.value)}
										placeholder="우편번호를 검색해 주세요."
										size="medium"
										icon={<img src={icSearch} alt="search" className="w-7 h-7" />}
									/>
									<div className="flex flex-col gap-1.5">
										<Input
											value={formData.address}
											onChange={(e) => handleInputChange('address', e.target.value)}
											placeholder="주소를 검색해 주세요."
											size="small"
											error={!!errors.address}
										/>
										{errors.address && (
											<span className="text-system-error text-14">{errors.address}</span>
										)}
									</div>
									<div className="flex flex-col gap-1.5">
										<Input
											value={formData.detailAddress}
											onChange={(e) => handleInputChange('detailAddress', e.target.value)}
											placeholder="나머지 주소를 입력해 주세요."
											size="small"
											error={!!errors.detailAddress}
										/>
										{errors.detailAddress && (
											<span className="text-system-error text-14">{errors.detailAddress}</span>
										)}
									</div>
								</div>
							</div>

							{/* 키/체중/혈액형 */}
							<div className="grid grid-cols-[200px_1fr] items-center gap-2.5">
								<div className="text-text-70 text-16">키/체중/혈액형</div>
								<div className="grid grid-cols-3 items-center gap-5">
									<div className="flex items-center gap-1.5 min-w-0">
										<Input
											value={formData.height}
											onChange={(e) => handleInputChange('height', e.target.value)}
											placeholder="키"
											size="small"
											wrapperClassName="flex-1 min-w-0"
										/>
										<span className="text-text-70 text-16 whitespace-nowrap">cm</span>
									</div>
									<div className="flex items-center gap-1.5 min-w-0">
										<Input
											value={formData.weight}
											onChange={(e) => handleInputChange('weight', e.target.value)}
											placeholder="체중"
											size="small"
											wrapperClassName="flex-1 min-w-0"
										/>
										<span className="text-text-70 text-16 whitespace-nowrap">kg</span>
									</div>
									<Dropdown
										options={bloodTypeOptions}
										value={formData.bloodType}
										onChange={handleBloodTypeChange}
										placeholder="선택"
										className="[&>button]:h-8 [&>button]:text-14"
									/>
								</div>
							</div>

							{/* 음주 습관 */}
							<div className="grid grid-cols-[200px_1fr] items-center gap-2.5">
								<div className="text-text-70 text-16">음주 습관(200ml, 1W)</div>
								<SegmentedControl
									options={drinkingOptions}
									value={formData.drinkingHabit}
									onChange={handleDrinkingChange}
								/>
							</div>

							{/* 흡연 */}
							<div className="grid grid-cols-[200px_1fr] items-center gap-2.5">
								<div className="text-text-70 text-16">흡연(개피)</div>
								<SegmentedControl
									options={smokingOptions}
									value={formData.smokingHabit}
									onChange={handleSmokingChange}
								/>
							</div>
						</div>

						{/* 오른쪽 컬럼 */}
						<div className="flex-1 flex flex-col gap-4">
							{/* 생년월일 */}
							<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
								<div className="pt-1">
									<span className="text-text-70 text-16">생년월일(dd/mm/yyyy)</span>
									<span className="text-system-error text-16">*</span>
								</div>
								<div className="flex flex-col gap-1.5">
									<Input
										type="text"
										value={formData.birthDate}
										onChange={(e) => handleInputChange('birthDate', e.target.value)}
										placeholder="생년월일을 선택해 주세요."
										size="small"
										error={!!errors.birthDate}
										icon={<CalendarIcon className="w-5 h-5" />}
										readOnly
									/>
									{errors.birthDate && (
										<span className="text-system-error text-14">{errors.birthDate}</span>
									)}
								</div>
							</div>

							{/* 환자 등급 */}
							<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
								<div className="pt-1">
									<span className="text-text-70 text-16">환자 등급</span>
									<span className="text-system-error text-16">*</span>
								</div>
								<div className="flex flex-col gap-1.5">
									<Dropdown
										options={patientGradeOptions}
										value={formData.patientGrade}
										onChange={(value) => handleInputChange('patientGrade', value)}
										placeholder="선택"
										error={!!errors.patientGrade}
									/>
									{errors.patientGrade && (
										<span className="text-system-error text-14">{errors.patientGrade}</span>
									)}
								</div>
							</div>

							{/* 복용중인 약물 */}
							<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
								<div className="text-text-70 text-16">복용중인 약물</div>
								<Textarea
									value={formData.currentMedications}
									onChange={(e) => handleInputChange('currentMedications', e.target.value)}
									placeholder="복용중인 약물을 입력해 주세요."
									className="px-4 py-2.5 rounded-lg h-[100px]"
								/>
							</div>

							{/* 개인력 */}
							<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
								<div className="text-text-70 text-16">개인력</div>
								<Textarea
									value={formData.personalHistory}
									onChange={(e) => handleInputChange('personalHistory', e.target.value)}
									placeholder="개인력을 입력해 주세요."
									className="px-4 py-2.5 rounded-lg h-[100px]"
								/>
							</div>

							{/* 가족력 */}
							<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
								<div className="text-text-70 text-16">가족력</div>
								<Textarea
									value={formData.familyHistory}
									onChange={(e) => handleInputChange('familyHistory', e.target.value)}
									placeholder="가족력을 입력해 주세요."
									className="px-4 py-2.5 rounded-lg h-[100px]"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PatientRegistration;

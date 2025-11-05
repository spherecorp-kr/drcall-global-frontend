import { Button, Dropdown, Input, Radio } from '@/shared/components/ui';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
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

interface PatientFormProps {
	formData: PatientFormData;
	errors: ValidationErrors;
	onInputChange: (field: keyof PatientFormData, value: string) => void;
}

export function PatientForm({ formData, errors, onInputChange }: PatientFormProps) {
	const bloodTypeOptions = [
		{ value: 'A', label: 'A형' },
		{ value: 'B', label: 'B형' },
		{ value: 'AB', label: 'AB형' },
		{ value: 'O', label: 'O형' },
	];

	const handleBloodTypeChange = (value: string) => {
		// 이미 선택된 값을 다시 클릭하면 해제
		if (formData.bloodType === value) {
			onInputChange('bloodType', '');
		} else {
			onInputChange('bloodType', value);
		}
	};

	const patientGradeOptions = [
		{ value: 'normal', label: '일반환자' },
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
			onInputChange('drinkingHabit', '');
		} else {
			onInputChange('drinkingHabit', value);
		}
	};

	const handleSmokingChange = (value: string) => {
		// 이미 선택된 값을 다시 클릭하면 해제
		if (formData.smokingHabit === value) {
			onInputChange('smokingHabit', '');
		} else {
			onInputChange('smokingHabit', value);
		}
	};

	return (
		<div className="bg-white rounded-[10px] border border-stroke-input p-5">
			<div className="flex items-stretch gap-5">
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
								onChange={(e) => onInputChange('name', e.target.value)}
								placeholder="이름을 입력해 주세요."
								size="small"
								error={!!errors.name}
							/>
							{errors.name && (
								<span className="text-system-error text-14">{errors.name}</span>
							)}
						</div>
					</div>

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
								onChange={(e) => onInputChange('birthDate', e.target.value)}
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

					{/* Thai ID Number */}
					<div className="grid grid-cols-[200px_1fr] items-start gap-2.5">
						<div className="pt-1">
							<span className="text-text-70 text-16">Thai ID Number</span>
							<span className="text-system-error text-16">*</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<Input
								value={formData.thaiId}
								onChange={(e) => onInputChange('thaiId', e.target.value)}
								placeholder="'-'없이 숫자만 입력해 주세요."
								size="small"
								error={!!errors.thaiId}
							/>
							{errors.thaiId && (
								<span className="text-system-error text-14">{errors.thaiId}</span>
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
									onChange={() => onInputChange('gender', 'male')}
								/>
								<Radio
									label="여자"
									checked={formData.gender === 'female'}
									onChange={() => onInputChange('gender', 'female')}
								/>
							</div>
							{errors.gender && (
								<span className="text-system-error text-14">{errors.gender}</span>
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
								onChange={(e) => onInputChange('phoneNumber', e.target.value)}
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
								onChange={(e) => onInputChange('postalCode', e.target.value)}
								placeholder="우편번호를 검색해 주세요."
								size="small"
								icon={<img src={icSearch} alt="search" className="w-7 h-7" />}
							/>
							<div className="flex flex-col gap-1.5">
								<Input
									value={formData.address}
									onChange={(e) => onInputChange('address', e.target.value)}
									placeholder="주소를 입력해 주세요."
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
									onChange={(e) => onInputChange('detailAddress', e.target.value)}
									placeholder="상세 주소를 입력해 주세요."
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
									onChange={(e) => onInputChange('height', e.target.value)}
									placeholder="키"
									size="small"
									wrapperClassName="flex-1 min-w-0"
								/>
								<span className="text-text-70 text-16 whitespace-nowrap">cm</span>
							</div>
							<div className="flex items-center gap-1.5 min-w-0">
								<Input
									value={formData.weight}
									onChange={(e) => onInputChange('weight', e.target.value)}
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
						<div className="text-text-70 text-16">흡연(개비)</div>
						<SegmentedControl
							options={smokingOptions}
							value={formData.smokingHabit}
							onChange={handleSmokingChange}
						/>
					</div>
				</div>

				{/* 오른쪽 컬럼 */}
				<div className="flex-1 flex flex-col gap-4">
					{/* 환자 등급 */}
					<div className="flex items-start gap-2.5">
						<div className="w-[200px] pt-1">
							<span className="text-text-70 text-16">환자 등급</span>
						</div>
						<div className="flex-1 flex flex-col gap-1.5">
							<Dropdown
								options={patientGradeOptions}
								value={formData.patientGrade}
								onChange={(value) => onInputChange('patientGrade', value)}
								placeholder="선택"
								error={!!errors.patientGrade}
								className="[&>button]:h-8 [&>button]:text-14"
							/>
							{errors.patientGrade && (
								<span className="text-system-error text-14">{errors.patientGrade}</span>
							)}
						</div>
					</div>

					{/* 복용중인 약물 */}
					<div className="flex items-start gap-2.5 flex-1">
						<div className="w-[200px] text-text-70 text-16">복용중인 약물</div>
						<textarea
							value={formData.currentMedications}
							onChange={(e) => onInputChange('currentMedications', e.target.value)}
							placeholder="복용중인 약물을 입력해 주세요."
							className="flex-1 h-full px-4 py-2.5 bg-bg-white rounded-lg outline outline-1 outline-stroke-input text-16 font-pretendard text-text-100 placeholder:text-text-30 resize-none focus:outline-2 focus:outline-primary-70"
						/>
					</div>

					{/* 개인력 */}
					<div className="flex items-start gap-2.5 flex-1">
						<div className="w-[200px] text-text-70 text-16">개인력</div>
						<textarea
							value={formData.personalHistory}
							onChange={(e) => onInputChange('personalHistory', e.target.value)}
							placeholder="개인력을 입력해 주세요."
							className="flex-1 h-full px-4 py-2.5 bg-bg-white rounded-lg outline outline-1 outline-stroke-input text-16 font-pretendard text-text-100 placeholder:text-text-30 resize-none focus:outline-2 focus:outline-primary-70"
						/>
					</div>

					{/* 가족력 */}
					<div className="flex items-start gap-2.5 flex-1">
						<div className="w-[200px] text-text-70 text-16">가족력</div>
						<textarea
							value={formData.familyHistory}
							onChange={(e) => onInputChange('familyHistory', e.target.value)}
							placeholder="가족력을 입력해 주세요."
							className="flex-1 h-full px-4 py-2.5 bg-bg-white rounded-lg outline outline-1 outline-stroke-input text-16 font-pretendard text-text-100 placeholder:text-text-30 resize-none focus:outline-2 focus:outline-primary-70"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export type { PatientFormData, ValidationErrors };

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Button } from '@/shared/components/ui';
import { PatientForm, type PatientFormData, type ValidationErrors } from '@/shared/components/ui/PatientForm';
import { patientService } from '@/services/patientService';
import icCancel from '@/shared/assets/icons/ic_cancel.svg';
import icRegister from '@/shared/assets/icons/ic_register.svg';

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

		if (!formData.birthDate.trim()) {
			newErrors.birthDate = '생년월일을 선택해 주세요.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			// 날짜 형식 변환 (YYYY-MM-DD)
			const birthDate = formData.birthDate 
				? formData.birthDate.split('/').reverse().join('-') // DD/MM/YYYY -> YYYY-MM-DD
				: undefined;

			// API 호출
			await patientService.registerPatient({
				name: formData.name,
				phone: formData.phoneNumber,
				phoneCountryCode: '+66',
				birthDate,
				gender: formData.gender === 'male' ? 'MALE' : formData.gender === 'female' ? 'FEMALE' : undefined,
				thaiId: formData.thaiId,
				address: formData.address,
				addressDetail: formData.detailAddress,
				postalCode: formData.postalCode,
				height: formData.height,
				weight: formData.weight,
				bloodType: formData.bloodType,
				drinkingHabit: formData.drinkingHabit,
				smokingHabit: formData.smokingHabit,
				currentMedications: formData.currentMedications,
				personalHistory: formData.personalHistory,
				familyHistory: formData.familyHistory,
			});

			// 성공 시 이전 페이지로 이동
			navigate(-1);
		} catch (error) {
			console.error('환자 등록 실패:', error);
			let errorMessage = '환자 등록에 실패했습니다.';
			if (error instanceof AxiosError) {
				errorMessage = error.response?.data?.message || errorMessage;
			}
			alert(errorMessage);
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
				<PatientForm formData={formData} errors={errors} onInputChange={handleInputChange} />
			</div>
		</div>
	);
}

export default PatientRegistration;

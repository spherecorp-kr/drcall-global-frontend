import { useParams } from 'react-router-dom';
import Button from '@/shared/components/ui/Button';
import Dropdown from '@/shared/components/ui/Dropdown';
import { Section } from '@/shared/components/ui/Section';
import Table from '@/shared/components/ui/Table';
import Pagination from '@/shared/components/ui/Pagination';
import Memo from '@/shared/components/ui/appointmentDetail/Memo';
import PatientHealthInfo from '@/shared/components/ui/appointmentDetail/PatientHealthInfo';
import { PatientForm, type PatientFormData, type ValidationErrors } from '@/shared/components/ui/PatientForm';
import { DateAndTimePicker } from '@/shared/components/ui/datepicker';
import { DoubleDialogBottomButton } from '@/shared/components/ui/dialog';
import { createColumnHelper, type PaginationState } from '@tanstack/react-table';
import { useState, useCallback, useMemo } from 'react';
import { useDialog } from '@/shared/hooks/useDialog';
import type { BottomButtonProps } from '@/shared/types/dialog';
import chatIcon from '@/shared/assets/icons/ic_chat_circle.svg';
import appointmentIcon from '@/shared/assets/icons/ic_appointment_blue.svg';
import editIcon from '@/shared/assets/icons/ic_edit.svg';
import saveIcon from '@/shared/assets/icons/ic_register.svg';
import cancelIcon from '@/shared/assets/icons/ic_cancel.svg';
import genderMaleIcon from '@/shared/assets/icons/ic_gender_male.svg';
import genderFemaleIcon from '@/shared/assets/icons/ic_gender_female.svg';
import actionArrowIcon from '@/shared/assets/icons/ic_action_arrow.svg';
import actionArrowHoverIcon from '@/shared/assets/icons/ic_action_arrow_hover.svg';
import { mockPatients } from '@/mocks/patientData';
import type { PatientGrade } from '@/shared/types/patient';
import { PATIENT_GRADE_COLOR_MAP, PATIENT_GRADE_MAP } from '@/shared/types/patient';

// Types
interface AppointmentStatus {
	id: string;
	date: string;
	time: string;
	doctor: string;
	symptom: string;
}

interface TreatmentHistory {
	id: string;
	date: string;
	doctor: string;
	symptom: string;
}

// Mock Data
const mockAppointments: AppointmentStatus[] = [
	{
		id: '1',
		date: '29/09/2025 14:01 ~ 14:15',
		time: '14:00',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: '열이 있고 구토 증상이 있음',
	},
	{
		id: '2',
		date: '08/10/2025 14:01 ~ 14:15',
		time: '10:00',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: '불안하고 잠을 못자요.',
	},
	{
		id: '3',
		date: '10/11/2025 14:01 ~ 14:15',
		time: '14:00',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lor...',
	},
];

const mockTreatmentHistory: TreatmentHistory[] = [
	{
		id: '1',
		date: '16/05/2023 16:27',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: '열이 있고 구토 증상이 있음',
	},
	{
		id: '2',
		date: '15/05/2023 16:27',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: '불안하고 잠을 못자요.',
	},
	{
		id: '3',
		date: '14/05/2023 16:27',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ip...',
	},
	{
		id: '4',
		date: '13/05/2023 16:27',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ip...',
	},
	{
		id: '5',
		date: '12/05/2023 16:27',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ip...',
	},
	{
		id: '6',
		date: '11/05/2023 16:27',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ip...',
	},
	{
		id: '7',
		date: '10/05/2023 16:27',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ip...',
	},
	{
		id: '8',
		date: '09/05/2023 16:27',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ip...',
	},
	{
		id: '9',
		date: '08/05/2023 16:27',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ip...',
	},
	{
		id: '10',
		date: '07/05/2023 16:27',
		doctor: 'Dr.Wittaya Wanpen',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ip...',
	},
];

// 클래스 상수
const TH_CLASS = 'w-[200px] color-text-70 text-base font-normal';
const TD_CLASS = 'flex-1 color-text-100 text-base font-normal';
const TEXTAREA_CLASS = 'flex-1 self-stretch px-4 py-2.5 bg-bg-disabled rounded-lg border border-stroke-input flex items-start justify-start gap-2.5';

// 환자 등급 뱃지 컴포넌트
function PatientGradeBadge({ grade }: { grade: PatientGrade }) {
	if (grade === 'normal') {
		return null;
	}

	const colorConfig = PATIENT_GRADE_COLOR_MAP[grade];
	const label = PATIENT_GRADE_MAP[grade];

	return (
		<div
			className="h-6 px-2.5 py-1.5 rounded-[19px] inline-flex items-center justify-center"
			style={{ background: colorConfig.bg }}
		>
			<span
				className="text-[0.8125rem] font-semibold capitalize text-center"
				style={{ color: colorConfig.text }}
			>
				{label}
			</span>
		</div>
	);
}


const PatientDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const { openDialog, closeDialog } = useDialog();
	const [memo, setMemo] = useState('');
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<Set<string>>(new Set());
	const [selectedTreatmentIds, setSelectedTreatmentIds] = useState<Set<string>>(new Set());
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedDoctor, setSelectedDoctor] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<string>('');
	const [selectedTime, setSelectedTime] = useState<string>('');
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

	// 환자 데이터 찾기
	const patient = mockPatients.find(p => p.id === id);

	// 예약 일시 변경 핸들러
	const handleDateTimeChange = useCallback((date: string, time?: string) => {
		setSelectedDate(date);
		setSelectedTime(time || '');
		console.log('예약 일시 선택:', date, time);
	}, []);

	// 의사 선택 핸들러
	const handleDoctorChange = useCallback((value: string) => {
		setSelectedDoctor(value);
	}, []);

	// 예약 가능 여부 체크
	const canMakeAppointment = useMemo(() => {
		return !!(selectedDoctor && selectedDate && selectedTime);
	}, [selectedDoctor, selectedDate, selectedTime]);

	// 다이얼로그 하단 버튼 설정
	const appointmentDialogActions = useMemo((): BottomButtonProps[] => [
		{
			disabled: false,
			onClick: () => {
				closeDialog('appointmentDialog');
				// 상태 초기화
				setSelectedDoctor('');
				setSelectedDate('');
				setSelectedTime('');
			},
			text: '취소'
		},
		{
			disabled: !canMakeAppointment,
			onClick: () => {
				// TODO: 예약 API 호출
				console.log('예약하기:', {
					doctor: selectedDoctor,
					date: selectedDate,
					time: selectedTime,
				});
				closeDialog('appointmentDialog');
				// 상태 초기화
				setSelectedDoctor('');
				setSelectedDate('');
				setSelectedTime('');
			},
			text: '예약하기'
		}
	], [closeDialog, canMakeAppointment, selectedDoctor, selectedDate, selectedTime]);

	// Mock doctor options
	const doctorOptions = useMemo(() => [
		{
			label: (
				<div className='flex flex-col items-start justify-center'>
					<span className='font-normal text-sm text-text-100'>Dr.Wittaya Wanpen</span>
					<span className='capitalize font-medium text-text-40 text-xs'>(Expert : General Practitioner)</span>
				</div>
			),
			value: '1'
		},
		{
			label: (
				<div className='flex flex-col items-start justify-center'>
					<span className='font-normal text-sm text-text-100'>Dr.Somchai Kumar</span>
					<span className='capitalize font-medium text-text-40 text-xs'>(Expert : Specialist In Psychiatry)</span>
				</div>
			),
			value: '2'
		}
	], []);

	// 예약 다이얼로그 콘텐츠
	const appointmentDialogContent = useMemo(() => (
		<div className='flex flex-col gap-5'>
			{/* 의사 선택 */}
			<div className="flex flex-col gap-2.5">
				<p className='text-text-100 text-20 font-bold'>의사 선택</p>
				<Dropdown
					className='w-full'
					menuClassName='max-h-[13.5rem]'
					onChange={handleDoctorChange}
					optionClassName='h-10 rounded-sm'
					options={doctorOptions}
					placeholder='의사를 선택해주세요.'
					value={selectedDoctor}
				/>
			</div>

			{/* 날짜/시간 선택 */}
			<div className="flex flex-col gap-2.5">
				<p className='text-text-100 text-20 font-bold'>진료 희망 날짜&시간 선택</p>
				<DateAndTimePicker onDateTimeChange={handleDateTimeChange} />
			</div>
		</div>
	), [selectedDoctor, handleDoctorChange, handleDateTimeChange, doctorOptions]);

	// 예약 다이얼로그 열기
	const handleAppointmentClick = useCallback(() => {
		// 상태 초기화
		setSelectedDoctor('');
		setSelectedDate('');
		setSelectedTime('');

		openDialog({
			dialogButtons: <DoubleDialogBottomButton actions={appointmentDialogActions} />,
			dialogClass: 'w-[36.25rem] bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.25)] rounded-[10px]',
			dialogContents: appointmentDialogContent,
			dialogId: 'appointmentDialog',
			dialogTitle: '예약하기',
		});
	}, [appointmentDialogActions, appointmentDialogContent, openDialog]);

	// 수정 모드 진입 시 formData 초기화
	const handleEditClick = () => {
		if (patient) {
			setFormData({
				name: patient.name,
				gender: patient.gender === '남자' ? 'male' : 'female',
				thaiId: patient.thaiId || '',
				phoneNumber: patient.phoneNumber,
				postalCode: '',
				address: patient.address || '',
				detailAddress: '',
				height: patient.height?.toString() || '',
				weight: patient.weight?.toString() || '',
				bloodType: patient.bloodType || '',
				drinkingHabit: '',
				smokingHabit: '',
				birthDate: patient.birthDate,
				patientGrade: patient.grade,
				currentMedications: '',
				personalHistory: '',
				familyHistory: '',
			});
			setIsEditMode(true);
		}
	};

	const handleCancelEdit = () => {
		setIsEditMode(false);
		setErrors({});
	};

	const handleInputChange = (field: keyof PatientFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field as keyof ValidationErrors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleSaveEdit = () => {
		// TODO: Validation and API call
		console.log('환자 정보 수정:', formData);
		setIsEditMode(false);
	};

	// 진료 예약 행 클릭 핸들러
	const handleAppointmentRowClick = (appointment: AppointmentStatus) => {
		console.log('Appointment clicked:', appointment);
		// TODO: 진료 예약 상세 페이지로 이동
	};

	// 진료 내역 행 클릭 핸들러
	const handleTreatmentRowClick = (treatment: TreatmentHistory) => {
		console.log('Treatment clicked:', treatment);
		// TODO: 진료 내역 상세 페이지로 이동
	};

	// 환자를 찾지 못한 경우
	if (!patient) {
		return (
			<div className="h-full bg-bg-gray flex items-center justify-center">
				<p className="text-text-70 text-lg">환자를 찾을 수 없습니다.</p>
			</div>
		);
	}

	// Appointment Status Table
	const appointmentColumnHelper = createColumnHelper<AppointmentStatus>();
	const appointmentColumns = [
		appointmentColumnHelper.accessor('date', {
			header: '진료 예약 일시',
			cell: (info) => info.getValue(),
			size: 240,
		}),
		appointmentColumnHelper.accessor('doctor', {
			header: '담당 의사',
			cell: (info) => info.getValue(),
			size: 300,
		}),
		appointmentColumnHelper.accessor('symptom', {
			header: '증상',
			cell: (info) => (
				<div className="truncate" title={info.getValue()}>
					{info.getValue()}
				</div>
			),
		}),
		appointmentColumnHelper.display({
			id: 'action',
			header: '액션',
			cell: () => (
				<div className="flex justify-center">
					<button className="w-[30px] h-[30px] group relative">
					<img src={actionArrowIcon} alt="액션" className="w-full h-full group-hover:hidden" />
					<img src={actionArrowHoverIcon} alt="액션" className="w-full h-full hidden group-hover:block" />
				</button>
				</div>
			),
			size: 100,
		}),
	];

	// Treatment History Table
	const treatmentColumnHelper = createColumnHelper<TreatmentHistory>();
	const treatmentColumns = [
		treatmentColumnHelper.accessor('date', {
			header: '진료 완료 일시',
			cell: (info) => info.getValue(),
			size: 200,
		}),
		treatmentColumnHelper.accessor('doctor', {
			header: '담당 의사',
			cell: (info) => info.getValue(),
			size: 300,
		}),
		treatmentColumnHelper.accessor('symptom', {
			header: '증상',
			cell: (info) => (
				<div className="truncate" title={info.getValue()}>
					{info.getValue()}
				</div>
			),
		}),
		treatmentColumnHelper.display({
			id: 'action',
			header: '액션',
			cell: () => (
				<div className="flex justify-center">
					<button className="w-[30px] h-[30px] group relative">
					<img src={actionArrowIcon} alt="액션" className="w-full h-full group-hover:hidden" />
					<img src={actionArrowHoverIcon} alt="액션" className="w-full h-full hidden group-hover:block" />
				</button>
				</div>
			),
			size: 100,
		}),
	];

	const handleMemoChange = (newMemo: string) => {
		setMemo(newMemo);
	};

	const handleMemoSave = (savedMemo: string) => {
		console.log('Memo saved:', savedMemo);
	};

	const paginatedTreatmentHistory = mockTreatmentHistory.slice(
		pagination.pageIndex * pagination.pageSize,
		(pagination.pageIndex + 1) * pagination.pageSize,
	);

	return (
		<div className="h-full bg-bg-gray flex flex-col overflow-hidden">
			{/* 버튼 영역 */}
			<div className="flex-shrink-0 px-5 pt-4 pb-3 flex justify-between items-center">
				{isEditMode ? (
					<>
						<div />
						<div className="flex gap-2.5">
							<Button
								variant="outline"
								size="default"
								icon={<img src={cancelIcon} alt="취소" className="w-5 h-5" />}
								onClick={handleCancelEdit}
							>
								취소하기
							</Button>
							<Button
								variant="primary"
								size="default"
								icon={<img src={saveIcon} alt="저장" className="w-5 h-5" />}
								onClick={handleSaveEdit}
							>
								저장하기
							</Button>
						</div>
					</>
				) : (
					<>
						<Button
							variant="primary"
							size="default"
							icon={<img src={chatIcon} alt="Chat" className="w-5 h-5" />}
						>
							Chat
						</Button>
						<div className="flex gap-2.5">
							<Button
								variant="outline"
								size="default"
								icon={<img src={appointmentIcon} alt="예약" className="w-5 h-5" />}
							onClick={handleAppointmentClick}
							>
								예약하기
							</Button>
							<Button
								variant="primary"
								size="default"
								icon={<img src={editIcon} alt="수정" className="w-5 h-5" />}
								onClick={handleEditClick}
							>
								정보 수정하기
							</Button>
						</div>
					</>
				)}
			</div>

			{/* 콘텐츠 영역 */}
			<div className="flex-1 px-5 pb-5 overflow-auto">
				{isEditMode ? (
					<PatientForm formData={formData} errors={errors} onInputChange={handleInputChange} />
				) : (
					<div className="flex flex-col gap-5">
					{/* Patient Basic Info */}
					<div className="bg-white border border-stroke-input flex flex-col p-5 rounded-[10px] gap-2.5">
						<div className="flex flex-col gap-5">
							<div className="flex flex-col gap-2.5">
								<div className="flex items-start gap-2">
									<PatientGradeBadge grade={patient.grade} />
								</div>
								<div className="flex items-center gap-2">
									<div className="flex justify-center flex-col text-text-100 text-lg font-semibold">
										{patient.name}
									</div>
									<div className="h-5 flex items-center gap-1">
										<span className="text-text-40 text-sm font-normal">
											({patient.birthDateDisplay} /
										</span>
										<img
											src={patient.gender === 'female' ? genderFemaleIcon : genderMaleIcon}
											alt={patient.genderDisplay}
											className="w-4 h-4"
										/>
										<span className="text-text-40 text-sm font-normal">
											)
										</span>
									</div>
								</div>
							</div>
							<div className="self-stretch flex items-start gap-5">
								<div className="flex-1 flex flex-col items-start gap-4">
									<div className="self-stretch h-7 flex items-center gap-2.5">
										<div className={TH_CLASS}>Thai ID Number</div>
										<div className={TD_CLASS}>0-1234-56789-01-2</div>
									</div>
									<div className="self-stretch h-7 flex items-center gap-2.5">
										<div className={TH_CLASS}>휴대폰 번호</div>
										<div className={TD_CLASS}>{patient.phoneNumber}</div>
									</div>
									<div className="self-stretch flex items-start gap-2.5">
										<div className={TH_CLASS}>주소</div>
										<div className={TD_CLASS}>
											Seocho-gu, Seoul, Republic of Korea 162, Baumoe-ro<br />
											1902, Building 103, Raemian Apartment, 192-458
										</div>
									</div>
									<div className="self-stretch h-7 flex items-center gap-2.5">
										<div className={TH_CLASS}>키/체중/혈액형</div>
										<div className={TD_CLASS}>167/55/A(RH+)</div>
									</div>
									<div className="self-stretch h-7 flex items-center gap-2.5">
										<div className={TH_CLASS}>음주 습관(200ml, 1W)</div>
										<div className={TD_CLASS}>1~5</div>
									</div>
									<div className="self-stretch h-7 flex items-center gap-2.5">
										<div className={TH_CLASS}>흡연(개비)</div>
										<div className={TD_CLASS}>6+</div>
									</div>
								</div>
								<div className="flex-1 h-[258px] flex flex-col items-start gap-4">
									<div className="self-stretch flex-1 flex items-start gap-2.5">
										<div className={TH_CLASS}>복용중인 약물</div>
										<div className={TEXTAREA_CLASS}>
											<div className="flex-1 text-text-100 text-base font-normal">없음</div>
										</div>
									</div>
									<div className="self-stretch flex-1 flex items-start gap-2.5">
										<div className={TH_CLASS}>개인력</div>
										<div className={TEXTAREA_CLASS}>
											<div className="flex-1 text-text-100 text-base font-normal">없음</div>
										</div>
									</div>
									<div className="self-stretch flex-1 flex items-start gap-2.5">
										<div className={TH_CLASS}>가족력</div>
										<div className={TEXTAREA_CLASS}>
											<div className="flex-1 text-text-100 text-base font-normal">없음</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Memo and Health Info Row */}
					<div className="flex gap-4 items-center self-stretch">
						<Memo value={memo} onChange={handleMemoChange} onSave={handleMemoSave} />
						<PatientHealthInfo
							height="172"
							weight="61.2"
							bmi="19.98"
							bloodPressure="180/77"
							bloodSugar="108"
							temperature="38.9"
						/>
					</div>

					{/* Appointment Status */}
					<Section title="진료 예약 현황">
						<Table
							data={mockAppointments}
							columns={appointmentColumns}
							enableSorting={false}
							enablePagination={false}
						enableSelection={true}
						selectedIds={selectedAppointmentIds}
						onSelectionChange={setSelectedAppointmentIds}
						onRowClick={(row) => handleAppointmentRowClick(row.original)}
						/>
					</Section>

					{/* Past Treatment History */}
					<Section title="과거 진료 내역">
						<div className="flex flex-col h-full">
							<div className="flex-1">
								<Table
									data={paginatedTreatmentHistory}
									columns={treatmentColumns}
									enableSorting={false}
									enablePagination={false}
									enableSelection={true}
									selectedIds={selectedTreatmentIds}
									onSelectionChange={setSelectedTreatmentIds}
									onRowClick={(row) => handleTreatmentRowClick(row.original)}
								/>
							</div>
							<div className="flex justify-center items-center py-4">
								<Pagination
									currentPage={pagination.pageIndex + 1}
									totalPages={Math.ceil(mockTreatmentHistory.length / pagination.pageSize)}
									onPageChange={(page) =>
										setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
									}
								/>
							</div>
						</div>
					</Section>
				</div>
				)}
			</div>
		</div>
	);
};

export default PatientDetailPage;

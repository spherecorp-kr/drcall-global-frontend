import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Input, ScheduleTimeTable } from '@/shared/components/ui';
import PasswordChangeModal from '@/shared/components/ui/PasswordChangeModal';
import icAccount from '@/shared/assets/icons/btn_account.svg';
import icEdit from '@/shared/assets/icons/ic_edit.svg';
import icEditSmall from '@/shared/assets/icons/ic_edit_small.svg';
import icEditBg from '@/shared/assets/icons/ic_edit_bg.svg';
import icLock from '@/shared/assets/icons/ic_lock.svg';
import icCancel from '@/shared/assets/icons/ic_cancel.svg';
import icSave from '@/shared/assets/icons/ic_register.svg';
import imgBlankProfile from '@/shared/assets/icons/img_blank_profile.svg';
import icValidationInfo from '@/shared/assets/icons/ic_validation_info.svg';
import icCopy from '@/shared/assets/icons/ic_copy.svg';
import icMail from '@/shared/assets/icons/ic_mail.svg';
import icReturn from '@/shared/assets/icons/ic_return.svg';
import icClock from '@/shared/assets/icons/ic_clock.svg';
import icReset from '@/shared/assets/icons/ic_reset.png';
import icArrowUp from '@/shared/assets/icons/ic_arrow_up.svg';
import icArrowDown from '@/shared/assets/icons/ic_arrow_down.svg';
import closeCircle from '@/shared/assets/icons/close_circle.svg';
import grayWarning from '@/shared/assets/icons/ic_circle_warning_grey.svg';
import { useDialog } from '@/shared/hooks/useDialog.ts';
import { SingleDialogBottomButton } from '@/shared/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn.ts';
import { doubleDigit } from '@/shared/utils/commonScripts.ts';

// Mock data
const mockProfile = {
	id: '1',
	name: 'Lorem Ipsum',
	username: 'Lorem Ipsum',
	profileImageUrl: '',
	englishName: 'qwe123',
	specialty: 'qwe123',
	introduction: '',
	experience: '',
};

// 에러 메시지 상수
const ERROR_MESSAGES = {
	name: '이름을 입력해주세요.',
	englishName: '영문명을 입력해주세요.',
	specialty: '전공을 입력해주세요.',
	introduction: '자기소개를 입력해주세요.',
	experience: '경력&학력을 입력해주세요.',
} as const;

type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
const WEEKDAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// 시간대 타입 정의
interface TimeSlot {
	endAmPm: string;
	endHour: string;
	endMinute: string;
	id: string;
	startAmPm: string;
	startHour: string;
	startMinute: string;
}

// 이미지 리사이징 유틸리티 (컴포넌트 외부로 이동하여 재생성 방지)
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

// 시간을 분 단위로 변환 (비교를 위해)
const timeToMinutes = (hour: string, minute: string, amPm: string): number => {
	let h = Number(hour);
	if (amPm === 'PM' && h !== 12) {
		h += 12;
	} else if (amPm === 'AM' && h === 12) {
		h = 0;
	}
	return h * 60 + Number(minute);
};

// 시간 선택기 컴포넌트
interface TimePickerProps {
	displayValue: string;
	hour: string;
	minute: string;
	amPm: string;
	isOpen: boolean;
	onHourChange: (hour: string) => void;
	onMinuteChange: (minute: string) => void;
	onAmPmChange: (amPm: string) => void;
	onToggle: () => void;
}

const TimePicker = ({ displayValue, hour, minute, amPm, isOpen, onHourChange, onMinuteChange, onAmPmChange, onToggle }: TimePickerProps) => {
	const handleClockIconClick = useCallback(() => {
		onToggle();
	}, [onToggle]);

	const handleHourIncrease = useCallback(() => {
		const h = Number(hour) + 1;
		onHourChange(h > 12 ? '00' : doubleDigit(h));
	}, [hour, onHourChange]);

	const handleHourDecrease = useCallback(() => {
		const h = Number(hour) - 1;
		onHourChange(h < 0 ? '12' : doubleDigit(h));
	}, [hour, onHourChange]);

	const handleMinuteIncrease = useCallback(() => {
		const m = Number(minute) + 1;
		onMinuteChange(m > 59 ? '00' : doubleDigit(m));
	}, [minute, onMinuteChange]);

	const handleMinuteDecrease = useCallback(() => {
		const m = Number(minute) - 1;
		onMinuteChange(m < 0 ? '59' : doubleDigit(m));
	}, [minute, onMinuteChange]);

	const handleAmPmChange = useCallback((value: string) => {
		onAmPmChange(value);
	}, [onAmPmChange]);

	return (
		<div className='border border-stroke-input flex flex-1 gap-2 h-full items-center justify-between px-3 relative rounded'>
			<span className='text-text-100'>{displayValue}</span>
			<img
				alt='clock'
				className='h-6 w-6 cursor-pointer'
				onClick={handleClockIconClick}
				src={icClock}
			/>
			{isOpen && (
				<div
					className='absolute bg-white left-0 flex gap-10 px-6 py-2.5 rounded-[0.265rem] top-12 z-10'
					style={{ boxShadow: '0 0 20px 4px rgba(191, 191, 191, 0.25)' }}
				>
					<div className='flex gap-5 items-center justify-center'>
						<div className='flex flex-col gap-2.5 items-center justify-center w-[3.75rem]'>
							<button
								className='flex h-9 items-center justify-center w-9'
								onClick={handleHourIncrease}
								type='button'
							>
								<img alt='up' className='h-6 w-6' src={icArrowUp} />
							</button>
							<input
								className='border border-stroke-input h-10 px-2 rounded text-center w-full'
								readOnly
								type='text'
								value={hour}
							/>
							<button
								className='flex h-9 items-center justify-center w-9'
								onClick={handleHourDecrease}
								type='button'
							>
								<img alt='down' className='h-6 w-6' src={icArrowDown} />
							</button>
						</div>
						<span className='text-lg text-text-100'>:</span>
						<div className='flex flex-col gap-2.5 items-center justify-center w-[3.75rem]'>
							<button
								className='flex h-9 items-center justify-center w-9'
								onClick={handleMinuteIncrease}
								type='button'
							>
								<img alt='up' className='h-6 w-6' src={icArrowUp} />
							</button>
							<input
								className='border border-stroke-input h-10 px-2 rounded text-center w-full'
								readOnly
								type='text'
								value={minute}
							/>
							<button
								className='flex h-9 items-center justify-center w-9'
								onClick={handleMinuteDecrease}
								type='button'
							>
								<img alt='down' className='h-6 w-6' src={icArrowDown} />
							</button>
						</div>
					</div>
					<div className='flex flex-col gap-2.5 justify-center'>
						<label
							className={cn(
								'cursor-pointer flex h-9 items-center justify-center rounded-sm w-[3.75rem]',
								amPm === 'AM'
									? 'bg-primary-70 text-white'
									: 'text-text-100'
							)}
						>
							AM
							<input
								checked={amPm === 'AM'}
								className='hidden'
								name={`ampm-${displayValue}`}
								onChange={() => handleAmPmChange('AM')}
								type='radio'
								value='AM'
							/>
						</label>
						<label
							className={cn(
								'cursor-pointer flex h-9 items-center justify-center rounded-sm w-[3.75rem]',
								amPm === 'PM'
									? 'bg-primary-70 text-white'
									: 'text-text-100'
							)}
						>
							PM
							<input
								checked={amPm === 'PM'}
								className='hidden'
								name={`ampm-${displayValue}`}
								onChange={() => handleAmPmChange('PM')}
								type='radio'
								value='PM'
							/>
						</label>
					</div>
				</div>
			)}
		</div>
	);
};

// 시간 추가 다이얼로그 내용
const AddTimeDialogContents = () => {
	const { t } = useTranslation();
	const [selectedDays, setSelectedDays] = useState<Set<DayOfWeek>>(new Set());
	const [startHour, setStartHour] = useState<string>('09');
	const [startMinute, setStartMinute] = useState<string>('00');
	const [startAmPm, setStartAmPm] = useState<string>('AM');
	const [endHour, setEndHour] = useState<string>('06');
	const [endMinute, setEndMinute] = useState<string>('00');
	const [endAmPm, setEndAmPm] = useState<string>('PM');
	const [openTimePickerId, setOpenTimePickerId] = useState<'start' | 'end' | null>(null);
	const [timeSlots, setTimeSlots] = useState<Record<DayOfWeek, TimeSlot[]>>({
		fri: [],
		mon: [],
		sat: [],
		sun: [],
		thu: [],
		tue: [],
		wed: [],
	});

	const handleDayChange = useCallback((day: DayOfWeek, checked: boolean) => {
		setSelectedDays((prev) => {
			const newSet = new Set(prev);
			if (checked) {
				newSet.add(day);
			} else {
				newSet.delete(day);
			}
			return newSet;
		});
	}, []);

	// 시작 시간 표시 값 계산
	const startDisplayValue = useMemo(() => {
		return `${startAmPm} ${startHour}:${startMinute}`;
	}, [startAmPm, startHour, startMinute]);

	// 종료 시간 표시 값 계산
	const endDisplayValue = useMemo(() => {
		return `${endAmPm} ${endHour}:${endMinute}`;
	}, [endAmPm, endHour, endMinute]);

	// 시작 시간 피커 토글 핸들러
	const handleStartTimePickerToggle = useCallback(() => {
		setOpenTimePickerId((prev) => (prev === 'start' ? null : 'start'));
	}, []);

	// 종료 시간 피커 토글 핸들러
	const handleEndTimePickerToggle = useCallback(() => {
		setOpenTimePickerId((prev) => (prev === 'end' ? null : 'end'));
	}, []);

	// 시간대 통합 함수 (연속된 시간대를 합침)
	const mergeTimeSlots = useCallback((slots: TimeSlot[]): TimeSlot[] => {
		if (slots.length === 0) return [];

		// 시작 시간 순으로 정렬
		const sorted = [...slots].sort((a, b) => {
			const aStart = timeToMinutes(a.startHour, a.startMinute, a.startAmPm);
			const bStart = timeToMinutes(b.startHour, b.startMinute, b.startAmPm);
			return aStart - bStart;
		});

		const merged: TimeSlot[] = [];
		let current = { ...sorted[0] };

		for (let i = 1; i < sorted.length; i++) {
			const next = sorted[i];
			const currentEnd = timeToMinutes(current.endHour, current.endMinute, current.endAmPm);
			const nextStart = timeToMinutes(next.startHour, next.startMinute, next.startAmPm);

			// 연속된 시간대인 경우 통합
			if (currentEnd >= nextStart) {
				// 더 늦은 종료 시간으로 업데이트
				const currentEndMinutes = timeToMinutes(current.endHour, current.endMinute, current.endAmPm);
				const nextEndMinutes = timeToMinutes(next.endHour, next.endMinute, next.endAmPm);
				if (nextEndMinutes > currentEndMinutes) {
					current.endHour = next.endHour;
					current.endMinute = next.endMinute;
					current.endAmPm = next.endAmPm;
				}
			} else {
				// 연속되지 않은 경우 현재 시간대를 저장하고 다음으로 이동
				merged.push(current);
				current = { ...next };
			}
		}
		merged.push(current);

		return merged;
	}, []);

	// 시간대 추가 핸들러
	const handleAddTimeSlot = useCallback(() => {
		if (selectedDays.size === 0) {
			alert('요일을 선택해주세요.');
			return;
	}

		const startMinutes = timeToMinutes(startHour, startMinute, startAmPm);
		const endMinutes = timeToMinutes(endHour, endMinute, endAmPm);

		if (startMinutes >= endMinutes) {
			alert('시작 시간은 종료 시간보다 빨라야 합니다.');
			return;
		}

		setTimeSlots((prev) => {
			const newSlots = { ...prev };
			selectedDays.forEach((day) => {
				const newSlot: TimeSlot = {
					endAmPm,
					endHour,
					endMinute,
					id: `${day}-${Date.now()}-${Math.random()}`,
					startAmPm,
					startHour,
					startMinute,
				};
				newSlots[day] = mergeTimeSlots([...prev[day], newSlot]);
			});
			return newSlots;
		});
	}, [endAmPm, endHour, endMinute, mergeTimeSlots, selectedDays, startAmPm, startHour, startMinute]);

	// 시간대 삭제 핸들러
	const handleDeleteTimeSlot = useCallback((day: DayOfWeek, slotId: string) => {
		setTimeSlots((prev) => ({
			...prev,
			[day]: prev[day].filter((slot) => slot.id !== slotId),
		}));
	}, []);

	// 시간대 표시 형식 변환
	const formatTimeSlot = useCallback((slot: TimeSlot): string => {
		return `${slot.startAmPm} ${slot.startHour}:${slot.startMinute} ~ ${slot.endAmPm} ${slot.endHour}:${slot.endMinute}`;
	}, []);

	return (
		<div className="flex flex-col gap-5 min-h-[20.125rem]">
			<div className="flex flex-col gap-5 items-start">
				<p className="leading-[normal] text-base text-text-100">요일 & 시간 추가</p>
				<div className="flex gap-2.5 h-10 items-center w-full">
					{WEEKDAYS.map((day) => {
						const isChecked = selectedDays.has(day);
						return (
							<label
								className={cn(
									'border cursor-pointer flex flex-1 h-full items-center justify-center rounded-sm text-base w-full',
									isChecked
										? 'bg-primary-70 border-primary-70 text-white'
										: 'border-stroke-input text-text-100'
								)}
								htmlFor={`day-${day}`}
								key={`day-${day}`}
							>
								{t(`calendar.week.${day}`)}
								<input
									checked={isChecked}
									className='hidden'
									id={`day-${day}`}
									onChange={(e) => handleDayChange(day, e.target.checked)}
									type="checkbox"
									value={String(day)}
								/>
							</label>
						);
					})}
				</div>
				<div className='flex gap-2.5 items-center w-full'>
					<div className='flex flex-1 gap-2 h-10 items-center'>
						<TimePicker
							amPm={startAmPm}
							displayValue={startDisplayValue}
							hour={startHour}
							isOpen={openTimePickerId === 'start'}
							minute={startMinute}
							onAmPmChange={setStartAmPm}
							onHourChange={setStartHour}
							onMinuteChange={setStartMinute}
							onToggle={handleStartTimePickerToggle}
						/>
						<span className='text-text-100'>~</span>
						<TimePicker
							amPm={endAmPm}
							displayValue={endDisplayValue}
							hour={endHour}
							isOpen={openTimePickerId === 'end'}
							minute={endMinute}
							onAmPmChange={setEndAmPm}
							onHourChange={setEndHour}
							onMinuteChange={setEndMinute}
							onToggle={handleEndTimePickerToggle}
						/>
					</div>
					<Button onClick={handleAddTimeSlot}>추가</Button>
				</div>
			</div>
			<div className="bg-stroke-input h-px w-full" />
			<div className="flex flex-col gap-5 items-start">
				<div className='flex flex-col gap-2'>
					<p className='font-medium leading-[normal] text-text-100'>추가된 구간</p>
					<div className='flex gap-1 items-center'>
						<img alt='info' src={icValidationInfo} />
						<p className='leading-[normal] text-sm text-primary-70'>중복된 시간은 자동으로 통합됩니다.</p>
					</div>
				</div>
				<ul className='flex flex-col gap-2.5 items-start w-full'>
					{WEEKDAYS.map((day) => {
						const slots = timeSlots[day];
						if (slots.length === 0) return null;

						return (
							<li className='flex gap-2.5 items-center w-full' key={day}>
								<span>
									{`${t(`calendar.week.${day}`)} : `}
									{slots.map((slot, index) => (
										<span key={slot.id}>
											{formatTimeSlot(slot)}
											{index < slots.length - 1 && ', '}
										</span>
									))}
								</span>
								<div className='flex gap-1 items-center'>
									{slots.map((slot) => (
										<img
											alt='delete'
											className='cursor-pointer'
											key={`delete-${slot.id}`}
											onClick={() => handleDeleteTimeSlot(day, slot.id)}
											src={closeCircle}
										/>
									))}
								</div>
							</li>
						);
					})}
					{Object.values(timeSlots).every((slots) => slots.length === 0) && (
						<li className='text-text-50'>추가된 시간대가 없습니다.</li>
					)}
				</ul>
			</div>
		</div>
	);
}

// 예정된 진료 예약 타입 정의
interface ScheduledAppointment {
	appointmentNumber: string;
	endDateTime: string;
	id: string;
	patientName: string;
	startDateTime: string;
}

// 계정 비활성화 다이얼로그 내용
const AccountDialogContents = () => {
	// TODO: API로 대체 예정
	const [scheduledAppointments] = useState<ScheduledAppointment[]>([]);
	// const [scheduledAppointments] = useState<ScheduledAppointment[]>([
	// 	{
	// 		appointmentNumber: 'APT-001',
	// 		endDateTime: '15/01/2024 14:00',
	// 		id: '1',
	// 		patientName: '환자 이름',
	// 		startDateTime: '15/01/2024 13:00',
	// 	},
	// ]);

	const hasAppointments = scheduledAppointments.length > 0;
	const appointmentCount = scheduledAppointments.length;

	return (
		<div className='flex flex-col gap-4 h-[37rem] items-start overflow-y-auto w-full'>
			<div className='flex gap-5 w-full'>
				<img alt='profile' className='h-[7.5rem] object-contain object-top rounded-sm w-24' src={imgBlankProfile} />
				<div className='flex flex-1 flex-col gap-4 items-start'>
					<div className='flex gap-2.5 items-center'>
						<p className='font-semibold leading-[normal] text-sm text-text-70'>이름</p>
						<p className='font-semibold leading-[normal] text-sm text-text-100'>asdfzxcvqwer</p>
					</div>
					<div className='flex gap-2.5 items-center'>
						<p className='font-semibold leading-[normal] text-sm text-text-70'>아이디</p>
						<p className='font-semibold leading-[normal] text-sm text-text-100'>asdfzxcvqwer</p>
					</div>
				</div>
			</div>
			<div className='flex flex-1 flex-col gap-1 w-full'>
				<div className='flex flex-col gap-1'>
					<p className='font-semibold leading-[normal] text-sm text-text-70'>
						예정된 진료 예약 {appointmentCount}건
					</p>
					{hasAppointments && (
						<div className='flex gap-1 items-center'>
							<img alt='info' src={icValidationInfo} />
							<p className='leading-[normal] text-primary-70 text-sm'>예정된 진료 예약이 있을 경우 계정을 비활성화할 수 없어요.</p>
						</div>
					)}
				</div>
				<div className='flex-1'>
					{hasAppointments ? (
						<div className='flex flex-col gap-1'>
							{scheduledAppointments.map((appointment) => (
								<div className='bg-white border border-stroke-segmented gap-0.5 px-4 py-2 rounded' key={appointment.id}>
									<p className='leading-[normal] text-sm text-text-70'>{appointment.patientName}</p>
									<p className='leading-[normal] text-text-40 text-xs'>{appointment.appointmentNumber}</p>
									<p className='leading-[normal] text-text-100 text-xs'>{appointment.startDateTime} ~ {appointment.endDateTime}</p>
								</div>
							))}
						</div>
					) : (
						<div className='bg-bg-gray border border-stroke-segmented flex gap-1.5 h-full items-center justify-center rounded-[0.625rem] w-full'>
							<img alt='warn' className='h-6 w-6' src={grayWarning} />
							<p className='text-text-40'>예정된 진료 예약이 없습니다.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

const MyInfo = () => {
	const { openDialog } = useDialog();

	const [isEditMode, setIsEditMode] = useState(false);
	const [formData, setFormData] = useState(mockProfile);
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const profileInputRef = useRef<HTMLInputElement>(null);

	const handleEditClick = useCallback(() => {
		setIsEditMode(true);
	}, []);

	const handleCancelEdit = useCallback(() => {
		setIsEditMode(false);
		setFormData(mockProfile);
		setProfilePreview(null);
		setErrors({});
	}, []);

	// 유효성 검사 함수
	const validateForm = useCallback((): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = ERROR_MESSAGES.name;
		}
		if (!formData.englishName.trim()) {
			newErrors.englishName = ERROR_MESSAGES.englishName;
		}
		if (!formData.specialty.trim()) {
			newErrors.specialty = ERROR_MESSAGES.specialty;
		}
		if (!formData.introduction.trim()) {
			newErrors.introduction = ERROR_MESSAGES.introduction;
		}
		if (!formData.experience.trim()) {
			newErrors.experience = ERROR_MESSAGES.experience;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	const handleSave = useCallback(() => {
		if (!validateForm()) {
			return;
		}

		// TODO: API 호출
		console.log('Save profile', formData);
		console.log('Profile image:', profilePreview);
		setIsEditMode(false);
		setErrors({});
	}, [formData, profilePreview, validateForm]);

	const handlePasswordChange = useCallback(() => {
		setIsPasswordModalOpen(true);
	}, []);

	const handlePasswordSubmit = useCallback((currentPassword: string, newPassword: string) => {
		// TODO: API 호출
		console.log('Password change:', { currentPassword, newPassword });
	}, []);

	const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// 입력 시 해당 필드의 에러 제거
		setErrors((prev) => {
			if (prev[field]) {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			}
			return prev;
		});
	}, []);

	const handleProfileImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
	}, []);

	const handleProfileImageButtonClick = useCallback(() => {
		profileInputRef.current?.click();
	}, []);

	const handlePasswordModalClose = useCallback(() => {
		setIsPasswordModalOpen(false);
	}, []);

	// 각 필드별 onChange 핸들러 (인라인 함수 생성 방지)
	const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		handleInputChange('name', e.target.value);
	}, [handleInputChange]);

	const handleEnglishNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		handleInputChange('englishName', e.target.value);
	}, [handleInputChange]);

	const handleSpecialtyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		handleInputChange('specialty', e.target.value);
	}, [handleInputChange]);

	const handleIntroductionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		handleInputChange('introduction', e.target.value);
	}, [handleInputChange]);

	const handleExperienceChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		handleInputChange('experience', e.target.value);
	}, [handleInputChange]);

	// 계정 비활성화 다이얼로그 열기
	const openAccountDialog = useCallback(() => {
		openDialog({
			dialogButtons: <SingleDialogBottomButton onClick={() => {alert('todo')}} text='확인' />,
			dialogClass: 'w-[36.25rem]',
			dialogContents: <AccountDialogContents />,
			dialogId: 'accountDialog',
			dialogTitle: '계정 비활성화',
			hasCloseButton: true
		});
	}, [openDialog]);

	// 시간 추가 다이얼로그 열기
	const openAddTimeDialog = useCallback(() => {
		openDialog({
			dialogButtons: <SingleDialogBottomButton onClick={() => {alert('todo')}} text='완료' />,
			dialogClass: 'w-[36.25rem]',
			dialogContents: <AddTimeDialogContents />,
			dialogId: 'addTimeDialog',
			dialogTitle: '시간 추가',
			hasCloseButton: true
		});
	}, [openDialog]);

	return (
		<>
			<PasswordChangeModal
				isOpen={isPasswordModalOpen}
				onClose={handlePasswordModalClose}
				onSubmit={handlePasswordSubmit}
			/>
			<div className="bg-bg-gray flex flex-col h-full overflow-auto">
				{/* 버튼 영역 */}
				<div className="flex gap-2.5 items-center justify-end pb-3 pt-4 px-5 shrink-0">
					{isEditMode ? (
						<>
							<Button
								icon={<img src={icCancel} alt="취소" className="w-5 h-5" />}
								onClick={handleCancelEdit}
								size="default"
								variant="outline"
							>
								취소
							</Button>
							<Button
								icon={<img src={icSave} alt="저장" className="w-5 h-5" />}
								onClick={handleSave}
								size="default"
								variant="primary"
							>
								수정 완료
							</Button>
						</>
					) : (
						<>
							<Button
								icon={<img src={icAccount} alt='계정' className='w-5 h-5' />}
								onClick={openAccountDialog}
								size="default"
								variant="outline"
							>계정 비활성화
							</Button>
							<Button
								icon={<img src={icLock} alt="비밀번호" className="w-5 h-5" />}
								onClick={handlePasswordChange}
								size="default"
								variant="outline"
							>
								비밀번호 변경
							</Button>
							<Button
								icon={<img src={icMail} alt="이메일" className="w-5 h-5" />}
								size="default"
								variant="outline"
							>
								이메일 변경
							</Button>
							<Button
								icon={<img src={icEdit} alt="수정" className="w-5 h-5" />}
								onClick={handleEditClick}
								size="default"
								variant="primary"
							>
								정보 수정
							</Button>
						</>
					)}
				</div>

				<div className="flex flex-1 flex-col gap-5 pb-5 px-5">
					{/* 프로필 정보 영역 */}
					<div className="bg-white border border-stroke-input flex gap-5 items-start p-5 rounded-[0.625rem]">
						<div className="relative">
							<img
								alt="profile"
								className="h-40 object-contain object-top w-[8.75rem]"
								src={imgBlankProfile}
							/>
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
										onClick={handleProfileImageButtonClick}
										className="absolute bottom-0 right-0 w-[30px] h-[30px] flex items-center justify-center"
									>
										<img
											src={icEditBg}
											alt="background"
											className="w-[30px] h-[30px] absolute"
										/>
										<img
											src={icEditSmall}
											alt="edit"
											className="w-4 h-4 relative z-10"
										/>
									</button>
								</>
							)}
						</div>
						<div className="flex flex-1 flex-col gap-4 items-start">
							<div className="flex gap-2.5 items-center min-h-7 w-full">
								<span className="leading-[normal] min-w-[7.5rem] text-base text-text-70">
									계정
								</span>
								<div className="flex gap-2 items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										viewBox="0 0 12 12"
										fill="none"
									>
										<circle cx="6" cy="6" r="6" fill="#D5D5D5" />
									</svg>
									<p className="leading-[normal] text-base text-text-100">
										비활성화
									</p>
								</div>
							</div>
							<div className="flex gap-2.5 items-center min-h-7 w-full">
								<span className="leading-[normal] min-w-[7.5rem] text-base text-text-70">
									아이디
								</span>
								<p className="leading-[normal] text-base text-text-100">{formData.username}</p>
							</div>
							<div className="flex gap-2.5 items-center min-h-7 w-full">
								<span className="leading-[normal] min-w-[7.5rem] text-base text-text-70">
									이름
								</span>
								{isEditMode ? (
									<div className="flex flex-1 flex-col gap-1.5 items-start">
										<Input
											onChange={handleNameChange}
											placeholder="이름을 입력해 주세요."
											value={formData.name}
											wrapperClassName={errors.name ? 'outline-system-error rounded' : 'rounded'}
										/>
										{errors.name && (
											<p className='leading-[normal] text-sm text-system-error'>{errors.name}</p>
										)}
									</div>
								) : (
									<p className="leading-[normal] text-base text-text-100">{formData.name}</p>
								)}
							</div>
							<div className="flex gap-2.5 items-center min-h-7 w-full">
								<span className="leading-[normal] min-w-[7.5rem] text-base text-text-70">
									이름(영문명)
								</span>
								{isEditMode ? (
									<div className="flex flex-1 flex-col gap-1.5 items-start">
										<Input
											onChange={handleEnglishNameChange}
											placeholder="영문명을 입력해 주세요."
											value={formData.englishName}
											wrapperClassName={errors.englishName ? 'outline-system-error rounded' : 'rounded'}
										/>
										{errors.englishName && (
											<p className='leading-[normal] text-sm text-system-error'>{errors.englishName}</p>
										)}
									</div>
								) : (
									<p className="leading-[normal] text-base text-text-100">{formData.englishName}</p>
								)}
							</div>
							<div className="flex gap-2.5 items-center min-h-7 w-full">
								<span className="leading-[normal] min-w-[7.5rem] text-base text-text-70">
									이메일
								</span>
								<p className="leading-[normal] text-base text-text-100">qwe123</p>
							</div>
							<div className="flex gap-2.5 items-center min-h-7 w-full">
								<span className="leading-[normal] min-w-[7.5rem] text-base text-text-70">
									전공
								</span>
								{isEditMode ? (
									<div className="flex flex-1 flex-col gap-1.5 items-start">
										<Input
											onChange={handleSpecialtyChange}
											placeholder="전공을 입력해 주세요."
											value={formData.specialty}
											wrapperClassName={errors.specialty ? 'outline-system-error rounded' : 'rounded'}
										/>
										{errors.specialty && (
											<p className='leading-[normal] text-sm text-system-error'>{errors.specialty}</p>
										)}
									</div>
								) : (
									<p className="leading-[normal] text-base text-text-100">{formData.specialty}</p>
								)}
							</div>
						</div>
						<div className="flex flex-1 flex-col gap-4 h-full items-start">
							<div className="flex flex-1 gap-2.5 items-start w-full">
								<span className="leading-[normal] min-w-[7.5rem] text-base text-text-70">
									자기소개
								</span>
								<div className='flex flex-1 flex-col gap-1.5 h-full items-start'>
									<textarea
										className={`flex-1 h-full leading-[normal] min-h-[7.25rem] outline px-4 py-2.5 resize-none rounded text-base text-text-100 w-full ${errors.introduction ? 'outline-system-error' : 'outline-stroke-input'}`}
										disabled={!isEditMode}
										maxLength={50}
										onChange={handleIntroductionChange}
										placeholder="환자에게 표시될 자기소개를 입력해주세요.&#10;(최대 50자 입력 가능)"
										value={formData.introduction}
									></textarea>
									{errors.introduction && (
										<p className='leading-[normal] text-sm text-system-error'>{errors.introduction}</p>
									)}
								</div>
							</div>
							<div className="flex flex-1 gap-2.5 items-start w-full">
								<span className="leading-[normal] min-w-[7.5rem] text-base text-text-70">
									경력&학력
								</span>
								<div className='flex flex-1 flex-col gap-1.5 h-full items-start'>
									<textarea
										className={`flex-1 h-full leading-[normal] min-h-[7.25rem] outline px-4 py-2.5 resize-none rounded text-base text-text-100 w-full ${errors.experience ? 'outline-system-error' : 'outline-stroke-input'}`}
										disabled={!isEditMode}
										maxLength={50}
										onChange={handleExperienceChange}
										placeholder="환자에게 표시될 경력&학력을 입력해주세요.&#10;(최대 50자 입력 가능)"
										value={formData.experience}
									></textarea>
									{errors.experience && (
										<p className='leading-[normal] text-sm text-system-error'>{errors.experience}</p>
									)}
								</div>
							</div>
						</div>
					</div>
					{/* 진료 기능 시간 */}
					<div className="flex flex-col gap-2.5 items-start">
						<h3 className="font-semibold leading-[normal] text-text-100 text-xl">
							진료 가능 시간
						</h3>
						<div className="bg-white border border-stroke-input flex flex-col p-5 rounded-[0.625rem] w-full">
							<p className="leading-[normal] text-base text-text-100">
								월 : 09:00 ~ 12:00 / 18:00 ~ 20:00
							</p>
							<p className="leading-[normal] text-base text-text-100">
								수 : 09:00 ~ 12:00 / 18:00 ~ 20:00
							</p>
							<p className="leading-[normal] text-base text-text-100">
								금 : 09:00 ~ 12:00 / 18:00 ~ 20:00
							</p>
						</div>
					</div>
					{/* 진료 시간표 */}
					<div className="flex flex-col gap-2.5 items-start">
						<div className="flex min-h-10 items-end justify-between w-full">
							<div className="flex gap-2.5 items-center">
								<h3 className="font-semibold leading-[normal] text-text-100 text-xl">
									진료 시간표
								</h3>
								<div className="flex gap-1 items-center justify-start">
									<img
										alt="info"
										className="h-3.5 w-3.5"
										src={icValidationInfo}
									/>
									<p className="leading-[normal] text-primary-70 text-sm">
										블록(30분)을 클릭해 진료 가능 시간을 추가/제거하세요.
									</p>
								</div>
							</div>
							{isEditMode && (
								<div className="flex gap-2.5 items-center">
									<Button
										className="font-medium !text-text-70"
										icon={<img alt="copy" className="h-5 w-5" src={icCopy} />}
										onClick={openAddTimeDialog}
										type="button"
										variant="ghost"
									>
										시간 추가
									</Button>
									<Button
										className="font-medium !text-text-70"
										icon={
											<img alt="return" className="h-5 w-5" src={icReturn} />
										}
										type="button"
										variant="ghost"
									>
										되돌리기
									</Button>
									<Button
										className="font-medium !text-text-70"
										icon={<img alt="reset" className="h-5 w-5" src={icReset} />}
										type="button"
										variant="ghost"
									>
										초기화
									</Button>
								</div>
							)}
						</div>
						<div className="h-full w-full">
							<ScheduleTimeTable />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default MyInfo;
import { useParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import type { DayOfWeek, TimeSlotDto, AvailableScheduleDto } from '@/shared/types/doctor';
import icAccount from '@/shared/assets/icons/ic_account.svg';
import icLock from '@/shared/assets/icons/ic_lock.svg';
import icEdit from '@/shared/assets/icons/ic_edit.svg';
import ValidationInfoIcon from '@/shared/assets/icons/ic_validation_info.svg';

// Mock data - 실제로는 API에서 가져와야 함
const mockDoctorData = {
	id: '1',
	name: 'Lorem Ipsum',
	englishName: 'WittayaWanpen',
	userId: 'asdf123',
	email: 'example@email.com',
	isActive: true,
	profileImage: '/src/shared/assets/icons/img_blank_profile.svg',
	introduction: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
	experience: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
	availableSchedule: {
		monday: [
			{ startTime: '09:00', endTime: '12:00' },
			{ startTime: '18:00', endTime: '20:00' },
		],
		tuesday: [{ startTime: '09:00', endTime: '12:00' }],
		wednesday: [
			{ startTime: '12:00', endTime: '13:00' },
			{ startTime: '18:00', endTime: '19:00' },
		],
		thursday: [
			{ startTime: '09:00', endTime: '12:00' },
			{ startTime: '13:00', endTime: '14:00' },
		],
		friday: [
			{ startTime: '13:00', endTime: '14:00' },
			{ startTime: '15:00', endTime: '16:00' },
		],
		saturday: [{ startTime: '10:00', endTime: '12:00' }],
		sunday: [],
	} as AvailableScheduleDto,
};

const DAY_MAP: Record<DayOfWeek, string> = {
	monday: '월',
	tuesday: '화',
	wednesday: '수',
	thursday: '목',
	friday: '금',
	saturday: '토',
	sunday: '일',
};

const WEEKDAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// 시간 문자열을 분 단위로 변환
function timeToMinutes(time: string): number {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes;
}

// 시간표에 표시할 시간 범위 (6:00 ~ 5:00 다음날)
const HOURS = [
	6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5,
];

export function DoctorDetail() {
	const { id } = useParams<{ id: string }>();
	// TODO: API에서 id를 사용하여 의사 정보 가져오기
	console.log('Doctor ID:', id);
	const [doctor] = useState(mockDoctorData);

	const handlePasswordChange = () => {
		console.log('비밀번호 변경');
	};

	const handlePasswordReset = () => {
		console.log('비밀번호 초기화');
	};

	const handleEditInfo = () => {
		console.log('의사 정보 수정');
	};

	const handleToggleAccount = () => {
		console.log('계정 활성화/비활성화');
	};

	// 진료 가능 시간 문자열 생성
	const formatAvailableTime = (slots: TimeSlotDto[] | undefined) => {
		if (!slots || slots.length === 0) return '-';
		return slots.map((slot) => `${slot.startTime} - ${slot.endTime}`).join(' / ');
	};

	return (
		<div className="relative h-full w-full overflow-hidden">
			<div className="h-full w-full overflow-auto">
				<div className="flex flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:gap-5 md:px-5 md:py-5">
					{/* 계정 비활성화 섹션 */}
					<div className="bg-bg-white rounded-[10px] border border-stroke-input px-5 py-2.5">
						<div className="flex items-center justify-between">
							<div className="flex flex-1 items-center gap-2.5">
								<img src={icAccount} alt="account" className="w-6 h-6" />
								<span className="text-16 font-medium text-text-100">계정 비활성화</span>
							</div>
							<div className="h-8 px-5 py-1.5 bg-bg-white rounded-[99px] border border-primary-60 flex items-center justify-center">
								<span className="text-14 text-primary-60">{doctor.isActive ? '비활성화' : '활성화'}</span>
							</div>
						</div>
					</div>

					{/* 비밀번호 초기화 섹션 */}
					<div className="bg-bg-white rounded-[10px] border border-stroke-input px-5 py-2.5">
						<div className="flex items-center justify-between">
							<div className="flex flex-1 items-center gap-2.5">
								<img src={icLock} alt="lock" className="w-6 h-6" />
								<span className="text-16 font-medium text-text-100">비밀번호 초기화</span>
							</div>
							<div className="h-8 px-5 py-1.5 bg-bg-white rounded-[99px] border border-primary-60 flex items-center justify-center">
								<span className="text-14 text-primary-60">초기화</span>
							</div>
						</div>
					</div>

					{/* 의사 정보 수정 버튼 */}
					<div className="flex justify-end">
						<Button
							variant="primary"
							size="default"
							icon={<img src={icEdit} alt="edit" className="w-5 h-5" />}
							iconPosition="left"
							onClick={handleEditInfo}
						>
							의사 정보 수정하기
						</Button>
					</div>

					{/* 프로필 섹션 */}
					<div>
						<h2 className="text-text-100 text-20 font-semibold font-pretendard mb-2.5">프로필</h2>

						<div className="bg-bg-white rounded-[10px] border border-stroke-input p-5">
							<div className="flex items-start gap-5">
								{/* 프로필 이미지 */}
								<div className="flex-shrink-0">
									<img
										src={doctor.profileImage}
										alt={doctor.name}
										className="w-[180px] h-[208px] rounded object-cover"
									/>
								</div>

								{/* 왼쪽 정보 */}
								<div className="flex-1 flex flex-col gap-4">
									{/* 계정 */}
									<div className="h-7 flex items-center gap-2.5">
										<div className="w-[200px] text-16 text-text-70">계정</div>
										<div className="flex-1 flex items-center gap-2">
											<div
												className={cn(
													'w-3 h-3 rounded-full',
													doctor.isActive ? 'bg-primary-60' : 'bg-text-40',
												)}
											/>
											<span className="flex-1 text-16 text-text-100">
												{doctor.isActive ? '활성화' : '비활성화'}
											</span>
										</div>
									</div>

									{/* 아이디 */}
									<div className="h-7 flex items-center gap-2.5">
										<div className="w-[200px] text-16 text-text-70">아이디</div>
										<div className="flex-1 text-16 text-text-100">{doctor.userId}</div>
									</div>

									{/* 이름 */}
									<div className="h-7 flex items-center gap-2.5">
										<div className="w-[200px] text-16 text-text-70">이름</div>
										<div className="flex-1 text-16 text-text-100">{doctor.name}</div>
									</div>

									{/* 이름(영문명) */}
									<div className="h-7 flex items-center gap-2.5">
										<div className="w-[200px] text-16 text-text-70">이름(영문명)</div>
										<div className="flex-1 text-16 text-text-100">{doctor.englishName}</div>
									</div>
								</div>

								{/* 오른쪽 정보 */}
								<div className="flex-1 flex flex-col gap-4">
									{/* 자기소개 */}
									<div className="flex items-start gap-2.5">
										<div className="w-[200px] text-16 text-text-70">자기소개</div>
										<div className="flex-1 h-[96px] px-4 py-2.5 bg-bg-disabled rounded-lg border border-stroke-input overflow-auto">
											<div className="text-16 text-text-100 break-words">{doctor.introduction}</div>
										</div>
									</div>

									{/* 경력&학력 */}
									<div className="flex items-start gap-2.5">
										<div className="w-[200px] text-16 text-text-70">경력&학력</div>
										<div className="flex-1 h-[96px] px-4 py-2.5 bg-bg-disabled rounded-lg border border-stroke-input overflow-auto">
											<div className="text-16 text-text-100 break-words">{doctor.experience}</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 진료 가능 시간 */}
					<div>
						<h2 className="text-text-100 text-20 font-semibold font-pretendard mb-2.5">
							진료 가능 시간
						</h2>
						<div className="bg-bg-white rounded-[10px] border border-stroke-input p-5">
							<div className="flex-1 text-16 text-text-100 break-words whitespace-pre-line">
								{WEEKDAYS.filter((day) => doctor.availableSchedule[day]?.length > 0)
									.map((day) => `${DAY_MAP[day]} : ${formatAvailableTime(doctor.availableSchedule[day])}`)
									.join('\n')}
							</div>
						</div>
					</div>

					{/* 진료 시간표 */}
					<div>
						<h2 className="text-text-100 text-20 font-semibold font-pretendard mb-2.5">진료 시간표</h2>
						<div className="bg-bg-white rounded-[10px] border border-stroke-input p-5">
							{/* 안내 메시지 */}
							<div className="flex justify-end items-center gap-1 mb-2.5">
								<img src={ValidationInfoIcon} alt="info" className="w-3 h-3" />
								<div className="text-14 text-primary-70 text-right">
									파란색 블록은 진료 가능 시간을 표시하며, 한 블록은 30분을 의미합니다.
								</div>
							</div>

							{/* 시간표 그리드 */}
							<div className="overflow-x-auto">
								<div className="relative">
									{/* 헤더 */}
									<div className="flex items-center">
										<div className="w-[60px] h-6 flex items-center justify-center border-b border-stroke-input" />
										{WEEKDAYS.map((day) => (
											<div
												key={day}
												className={cn(
													'flex-1 h-6 flex items-center justify-center text-14 border-b border-stroke-input',
													day === 'saturday' && 'text-[#3076DF]',
													day === 'sunday' && 'text-[#FC0606]',
													day !== 'saturday' && day !== 'sunday' && 'text-text-100',
												)}
											>
												{DAY_MAP[day]}
											</div>
										))}
									</div>

									{/* 시간 행들 - 30분 단위 */}
									{HOURS.map((hour) => (
										<>
											{/* 정시 (00분) */}
											<div key={`${hour}-00`} className="flex items-center">
												<div className="w-[60px] px-3 py-2.5 flex items-center justify-center text-14 text-text-100 border-b border-stroke-input">
													{hour.toString().padStart(2, '0')}:00
												</div>
												{WEEKDAYS.map((day) => {
													const slots = doctor.availableSchedule[day] || [];
													const currentMinutes = hour * 60;
													const nextHalfMinutes = hour * 60 + 30;

													const isAvailable = slots.some((slot: TimeSlotDto) => {
														const startMinutes = timeToMinutes(slot.startTime);
														const endMinutes = timeToMinutes(slot.endTime);
														return startMinutes < nextHalfMinutes && endMinutes > currentMinutes;
													});

													return (
														<div
															key={day}
															className={cn(
																'flex-1 px-3 py-2.5 border-l border-t border-stroke-input',
																isAvailable && 'bg-[#80D0E9]',
															)}
														/>
													);
												})}
											</div>

											{/* 30분 */}
											<div key={`${hour}-30`} className="flex items-center">
												<div className="w-[60px] px-3 py-2.5 flex items-center justify-center text-14 text-text-100 border-b border-stroke-input" />
												{WEEKDAYS.map((day) => {
													const slots = doctor.availableSchedule[day] || [];
													const currentMinutes = hour * 60 + 30;
													const nextHourMinutes = (hour + 1) * 60;

													const isAvailable = slots.some((slot: TimeSlotDto) => {
														const startMinutes = timeToMinutes(slot.startTime);
														const endMinutes = timeToMinutes(slot.endTime);
														return startMinutes < nextHourMinutes && endMinutes > currentMinutes;
													});

													return (
														<div
															key={day}
															className={cn(
																'flex-1 px-3 py-2.5 border-l border-t border-stroke-input',
																isAvailable && 'bg-[#80D0E9]',
															)}
														/>
													);
												})}
											</div>
										</>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DoctorDetail;

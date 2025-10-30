import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export type BadgeVariant =
	| 'status-available' // 가능, 확정
	| 'status-confirmed' // 확정, 완료
	| 'status-unavailable' // 불가능, 취소
	| 'status-progress' // 진행 중
	| 'status-waiting' // 대기
	| 'status-complete' // 완료(중립)
	| 'appointment-regular' // 일반 진료
	| 'appointment-quick' // 빠른 진료
	| 'patient-vip' // VIP
	| 'patient-risk' // Risk
	| 'role-coordinator' // Coordinator
	| 'role-doctor' // Doctor
	| 'role-patient'; // Patient

export type BadgeSize = 'small' | 'medium';

interface BadgeProps {
	variant: BadgeVariant;
	size?: BadgeSize;
	children: ReactNode;
	className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
	// 상태 뱃지
	'status-available': 'bg-badge-7 text-system-successful2',
	'status-confirmed': 'bg-badge-8 text-text-100',
	'status-unavailable': 'bg-badge-6 text-system-error',
	'status-progress': 'bg-badge-2 text-system-caution',
	'status-waiting': 'bg-badge-5 text-primary-70',
	'status-complete': 'bg-badge-8 text-text-70',

	// 진료 예약 뱃지
	'appointment-regular': 'bg-badge-7 text-system-successful',
	'appointment-quick': 'bg-badge-2 text-system-caution',

	// 환자 등급 뱃지
	'patient-vip': 'bg-badge-5 text-primary-70',
	'patient-risk': 'bg-badge-6 text-system-error',

	// 계정 뱃지
	'role-coordinator': 'bg-badge-3 text-badge-3-text',
	'role-doctor': 'bg-badge-4 text-primary-70',
	'role-patient': 'bg-badge-7 text-system-successful2',
};

const sizeStyles: Record<BadgeSize, string> = {
	small: 'px-2.5 pt-[4px] pb-[3px] text-[12px] leading-[1]', // 계정 뱃지용
	medium: 'px-5 py-1.5 text-[12px] leading-[1]', // 나머지 뱃지용 (20px 좌우 패딩)
};

export function Badge({ variant, size = 'medium', children, className }: BadgeProps) {
	return (
		<div
			className={cn(
				'inline-flex items-center justify-center gap-2.5',
				'overflow-hidden rounded-full',
				'font-pretendard font-semibold capitalize',
				'text-center',
				variantStyles[variant],
				sizeStyles[size],
				className,
			)}
		>
			{children}
		</div>
	);
}

// 편의 컴포넌트들
export const StatusBadge = ({
	status,
	children,
}: {
	status: 'available' | 'confirmed' | 'unavailable';
	children: ReactNode;
}) => {
	const variantMap = {
		available: 'status-available' as const,
		confirmed: 'status-confirmed' as const,
		unavailable: 'status-unavailable' as const,
	};
	return (
		<Badge variant={variantMap[status]} size="medium">
			{children}
		</Badge>
	);
};

export const AppointmentBadge = ({
	type,
	children,
}: {
	type: 'regular' | 'quick';
	children: ReactNode;
}) => {
	const variantMap = {
		regular: 'appointment-regular' as const,
		quick: 'appointment-quick' as const,
	};
	return (
		<Badge variant={variantMap[type]} size="medium">
			{children}
		</Badge>
	);
};

export const PatientBadge = ({
	level,
	children,
}: {
	level: 'vip' | 'risk';
	children: ReactNode;
}) => {
	const variantMap = {
		vip: 'patient-vip' as const,
		risk: 'patient-risk' as const,
	};
	return (
		<Badge variant={variantMap[level]} size="medium">
			{children}
		</Badge>
	);
};

export const RoleBadge = ({
	role,
	children,
}: {
	role: 'coordinator' | 'doctor' | 'patient';
	children: ReactNode;
}) => {
	const variantMap = {
		coordinator: 'role-coordinator' as const,
		doctor: 'role-doctor' as const,
		patient: 'role-patient' as const,
	};
	return (
		<Badge variant={variantMap[role]} size="small">
			{children}
		</Badge>
	);
};

export const DoctorStatusBadge = ({
	status,
	children,
}: {
	status: '진료 가능' | '진료 불가능' | '진료 중';
	children: ReactNode;
}) => {
	const variantMap = {
		'진료 가능': 'status-available' as const,
		'진료 불가능': 'status-unavailable' as const,
		'진료 중': 'status-progress' as const,
	};
	return (
		<Badge variant={variantMap[status]} size="medium">
			{children}
		</Badge>
	);
};

export const AppointmentStatusBadge = ({
	status,
	children,
}: {
	status: '진료 대기' | '진료 중' | '진료 완료' | '예약 취소';
	children: ReactNode;
}) => {
	const variantMap = {
		'진료 대기': 'status-waiting' as const,
		'진료 중': 'status-progress' as const,
		'진료 완료': 'status-complete' as const,
		'예약 취소': 'status-unavailable' as const,
	};
	return (
		<Badge variant={variantMap[status]} size="medium">
			{children}
		</Badge>
	);
};

export type NumberBadgeColor = 'red' | 'blue' | 'green' | 'yellow';
export type NumberBadgeSize = 'small' | 'medium'; // small: 14px height, medium: 24px height

interface NumberBadgeProps {
	count: number | 'dot';
	color?: NumberBadgeColor;
	size?: NumberBadgeSize;
	outline?: boolean;
	className?: string;
}

const numberBadgeColorStyles: Record<NumberBadgeColor, string> = {
	red: 'bg-badge-1',
	blue: 'bg-primary-70',
	green: 'bg-system-successful',
	yellow: 'bg-system-caution',
};

export const NumberBadge = ({
	count,
	color = 'red',
	size = 'medium',
	outline = false,
	className,
}: NumberBadgeProps) => {
	if (count === 'dot') {
		return (
			<div className={cn('w-3 h-3 rounded-full', numberBadgeColorStyles[color], className)} />
		);
	}

	const displayCount = count > 99 ? '99+' : count.toString();
	const isLarge = count > 99;

	// 사이즈별 스타일 - 실제 Figma 사이즈에 맞춤
	if (size === 'small') {
		return (
			<div className={cn('p-[1px] rounded-full relative', className)}>
				<div
					className={cn(
						'h-[14px] px-[4.5px] rounded-full flex items-center justify-center',
						numberBadgeColorStyles[color],
					)}
				>
					<div className="text-text-0 text-[9px] font-semibold font-pretendard leading-none pt-[1px]">
						{displayCount}
					</div>
				</div>
				{outline && (
					<div className="w-[15px] h-[15px] left-[0.5px] top-[0.5px] absolute rounded-full outline outline-[1px] outline-text-0 outline-offset-[-0.5px]" />
				)}
			</div>
		);
	}

	// medium size
	return (
		<div className={cn('p-[1px] rounded-full relative', className)}>
			<div
				className={cn(
					'h-[23px] rounded-full flex items-center justify-center',
					isLarge ? 'w-9 px-2' : 'px-2',
					numberBadgeColorStyles[color],
				)}
			>
				<div className="text-text-0 text-[14px] font-semibold font-pretendard leading-none pt-[1px]">
					{displayCount}
				</div>
			</div>
			{outline && (
				<div className="w-6 h-6 left-[0.5px] top-[0.5px] absolute rounded-full outline outline-[1px] outline-text-0 outline-offset-[-0.5px]" />
			)}
		</div>
	);
};

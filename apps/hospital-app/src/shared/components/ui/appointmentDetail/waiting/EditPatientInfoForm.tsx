import { useCallback, useState } from 'react';
import type { DropdownOption } from '@/shared/types/dropdown';
import { Dropdown, Input, Radio } from '@/shared/components/ui';
import { CalendarIcon } from '@/shared/components/ui/icon';
import { cn } from '@/shared/utils/cn';
import icSearch from '@/shared/assets/icons/ic_search.svg';

const BLOOD_TYPES: DropdownOption[] = [
	{ label: 'A(RH+)', value: 'A(RH+)' },
	{ label: 'B(RH+)', value: 'B(RH+)' },
	{ label: 'O(RH+)', value: 'O(RH+)' },
	{ label: 'AB(RH+)', value: 'AB(RH+)' },
	{ label: 'A(RH-)', value: 'A(RH-)' },
	{ label: 'B(RH-)', value: 'B(RH-)' },
	{ label: 'O(RH-)', value: 'O(RH-)' },
	{ label: 'AB(RH-)', value: 'AB(RH-)' },
];

const LEVEL_OPTIONS: DropdownOption[] = [
	{ label: 'VIP', value: 'VIP' },
	{ label: 'Risk', value: 'Risk' },
];

const HABIT_CLASS: string = 'cursor-pointer flex flex-1 h-full items-center justify-center rounded-[0.4375rem]';
const TEXTAREA_CLASS: string = 'bg-white border border-1 border-stroke-input focus:border-primary-70 min-h-20 outline-0 placeholder:text-text-30 px-4 py-2.5 resize-none rounded text-base text-text-100';

const Required = () => <span className='text-system-error'>*</span>;

const Separator = () => <div className='bg-stroke-segmented h-3 opacity-30 rounded-[0.03125rem] w-px' />;

const EditPatientInfoForm = () => {
	const [drinking, setDrinking] = useState<string>('');
	const [smoking, setSmoking] = useState<string>('');

	const handleCalendarIconClick = useCallback(() => {}, []);

	const handleDrinkingChange = useCallback((value: string) => {
		setDrinking(value);
	}, []);

	const handleSmokingChange = useCallback((value: string) => {
		setSmoking(value);
	}, []);

	return (
		<form className="flex flex-col gap-4 h-[38.25rem] overflow-auto">
			{/* 이름 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70" htmlFor="patientName">
					이름
					<Required />
				</label>
				<Input
					className="p-0 text-sm"
					compact
					name="patientName"
					required
					type="text"
					wrapperClassName="h-8 px-3 rounded"
				/>
			</div>
			{/* 생년월일 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70" htmlFor="patientBirthday">
					생년월일 (dd/mm/yyyy)
					<Required />
				</label>
				<Input
					className="cursor-default placeholder:text-text-70 px-0 text-sm text-text-100"
					compact
					icon={<CalendarIcon handleClick={handleCalendarIconClick} />}
					placeholder="진료 희망 일시를 선택해주세요."
					readOnly
					defaultValue="29/10/1997"
					wrapperClassName="h-8 px-3 rounded"
				/>
			</div>
			{/* Thai ID Number */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70" htmlFor="thaiIdNumber">
					Thai ID Number
					<Required />
				</label>
				<Input
					className="p-0 text-sm"
					compact
					name="thaiIdNumber"
					required
					type="text"
					wrapperClassName="h-8 px-3 rounded"
				/>
			</div>
			{/* 성별 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70" htmlFor="patientGender">
					생년월일 (dd/mm/yyyy)
					<Required />
				</label>
				<div className="flex gap-5 items-center">
					<Radio label="남자" name="patientGender" />
					<Radio label="여자" name="patientGender" />
				</div>
			</div>
			{/* 휴대폰 번호 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70" htmlFor="patientPhone">
					휴대폰 번호
					<Required />
				</label>
				<Input
					className="p-0 text-sm"
					compact
					name="patientPhone"
					required
					type="tel"
					wrapperClassName="h-8 px-3 rounded"
				/>
			</div>
			{/* 주소 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70">
					주소
					<Required />
				</label>
				<div className="flex flex-col gap-2.5 items-start self-stretch">
					<Input
						className="cursor-default p-0 text-sm"
						compact
						icon={
							<img alt="search" className="cursor-pointer h-7 w-7" src={icSearch} />
						}
						readOnly
						required
						type="text"
						wrapperClassName="h-8 px-3 rounded"
					/>
					<Input
						className="cursor-default p-0 text-sm"
						compact
						readOnly
						required
						type="text"
						wrapperClassName="h-8 px-3 rounded"
					/>
					<Input
						className="p-0 text-sm"
						compact
						required
						type="text"
						wrapperClassName="h-8 px-3 rounded"
					/>
				</div>
			</div>
			{/* 키/체중/혈액형 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70">키/체중/혈액형</label>
				<div className="flex gap-3 items-center">
					<div className="flex flex-1 gap-1.5 items-center">
						<Input
							className="p-0 text-sm w-[6.25rem]"
							compact
							min={1}
							step={1}
							type="number"
							wrapperClassName="h-8 px-3 rounded"
						/>
						<span className="text-base text-text-70">cm</span>
					</div>
					<div className="flex flex-1 gap-1.5 items-center">
						<Input
							className="p-0 text-sm w-[6.25rem]"
							compact
							min={1}
							step={1}
							type="number"
							wrapperClassName="h-8 px-3 rounded"
						/>
						<span className="text-base text-text-70">kg</span>
					</div>
					<Dropdown
						buttonClassName="h-8 px-3"
						className="flex-1 h-8 text-sm"
						options={BLOOD_TYPES}
					/>
				</div>
			</div>
			{/* 음주 습관 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70">음주 습관(200ml, 1W)</label>
				<div className="bg-white border border-stroke-input flex h-8 items-center justify-center p-px rounded self-stretch">
					<label className={cn(HABIT_CLASS, drinking === '1' && 'bg-primary-70')} htmlFor="drinking-1">
						<input
							checked={drinking === '1'}
							className="hidden"
							id="drinking-1"
							name="drinking"
							onChange={() => handleDrinkingChange('1')}
							type="radio"
							value="1"
						/>
						<span
							className={cn(
								'font-semibold text-xs',
								drinking === '1'
									? 'text-white'
									: 'text-text-100')}>1</span>
					</label>
					<Separator />
					<label className={cn(HABIT_CLASS, drinking === '2' && 'bg-primary-70')} htmlFor="drinking-2">
						<input
							checked={drinking === '2'}
							className="hidden"
							id="drinking-2"
							name="drinking"
							onChange={() => handleDrinkingChange('2')}
							type="radio"
							value="2"
						/>
						<span
							className={cn(
								'font-semibold text-xs',
								drinking === '2'
									? 'text-white'
									: 'text-text-100')}>2</span>
					</label>
					<Separator />
					<label className={cn(HABIT_CLASS, drinking === '3' && 'bg-primary-70')} htmlFor="drinking-3">
						<input
							checked={drinking === '3'}
							className="hidden"
							id="drinking-3"
							name="drinking"
							onChange={() => handleDrinkingChange('3')}
							type="radio"
							value="3"
						/>
						<span
							className={cn(
								'font-semibold text-xs',
								drinking === '3'
									? 'text-white'
									: 'text-text-100')}>3</span>
					</label>
				</div>
			</div>
			{/* 흡연 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70">흡연(개비)</label>
				<div className="bg-white border border-stroke-input flex h-8 items-center justify-center p-px rounded self-stretch">
					<label className={cn(HABIT_CLASS, smoking === '1' && 'bg-primary-70')} htmlFor="smoking-1">
						<input
							checked={smoking === '1'}
							className="hidden"
							id="smoking-1"
							name="smoking"
							onChange={() => handleSmokingChange('1')}
							type="radio"
							value="1"
						/>
						<span
							className={cn(
								'font-semibold text-xs',
								smoking === '1'
									? 'text-white'
									: 'text-text-100')}>1</span>
					</label>
					<Separator />
					<label className={cn(HABIT_CLASS, smoking === '2' && 'bg-primary-70')} htmlFor="smoking-2">
						<input
							checked={smoking === '2'}
							className="hidden"
							id="smoking-2"
							name="smoking"
							onChange={() => handleSmokingChange('2')}
							type="radio"
							value="2"
						/>
						<span
							className={cn(
								'font-semibold text-xs',
								smoking === '2'
									? 'text-white'
									: 'text-text-100')}>2</span>
					</label>
					<Separator />
					<label className={cn(HABIT_CLASS, smoking === '3' && 'bg-primary-70')} htmlFor="smoking-3">
						<input
							checked={smoking === '3'}
							className="hidden"
							id="smoking-3"
							name="smoking"
							onChange={() => handleSmokingChange('3')}
							type="radio"
							value="3"
						/>
						<span
							className={cn(
								'font-semibold text-xs',
								smoking === '3'
									? 'text-white'
									: 'text-text-100')}>3</span>
					</label>
				</div>
			</div>
			{/* 환자 등급 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70">환자 등급</label>
				<Dropdown buttonClassName="h-8 px-3" className="h-8" options={LEVEL_OPTIONS} />
			</div>
			{/* 복용 중인 약물 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70">복용 중인 약물</label>
				<textarea className={TEXTAREA_CLASS}></textarea>
			</div>
			{/* 개인력 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70">개인력</label>
				<textarea className={TEXTAREA_CLASS}></textarea>
			</div>
			{/* 가족력 */}
			<div className="flex flex-col gap-2">
				<label className="text-base text-text-70">가족력</label>
				<textarea className={TEXTAREA_CLASS}></textarea>
			</div>
		</form>
	);
};

export default EditPatientInfoForm;
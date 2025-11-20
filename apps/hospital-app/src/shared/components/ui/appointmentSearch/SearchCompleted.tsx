import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Dropdown, DropdownCheckbox, Input, SearchIcon } from '@/shared/components/ui';
import { useTranslation } from 'react-i18next';
import type { DropdownOption } from '@/shared/types/dropdown';

const SearchCompleted = () => {
	const { t } = useTranslation();

	const [keyword, setKeyword] = useState<string>('');

	// 각 Select의 상태 관리
	const [prescription, setPrescription] = useState<string>('all');
	const [payment, setPayment] = useState<string>('all');
	const [sort, setSort] = useState<string>('0');

	const prescriptionOptions: DropdownOption[] = useMemo(() => [
		{ label: t('appointment.search.all'), value: 'all' },
		{ label: t('appointment.search.prescriptionStatus.uploadWaiting'), value: '업로드 대기' },
		{ label: t('appointment.search.prescriptionStatus.completed'), value: '완료' },
	], [t]);

	const paymentOptions: DropdownOption[] = useMemo(() => [
		{ label: t('appointment.search.all'), value: 'all' },
		{ label: t('appointment.search.paymentStatus.scheduled'), value: '청구 예정' },
		{ label: t('appointment.search.paymentStatus.waiting'), value: '결제 대기' },
		{ label: t('appointment.search.paymentStatus.completed'), value: '완료' },
	], [t]);

	const sortOptions: DropdownOption[] = useMemo(() => [
		{ label: t('appointment.search.sort.newest'), value: '0' },
		{ label: t('appointment.search.sort.oldest'), value: '1' },
	], [t]);

	const handlePrescriptionChange = useCallback((value: string) => {
		setPrescription(value);
		console.log('처방전 상태 변경:', value);
		// 여기에 추가 로직 작성
	}, []);

	const handlePaymentChange = useCallback((value: string) => {
		setPayment(value);
		console.log('처방전 상태 변경:', value);
		// 여기에 추가 로직 작성
	}, []);

	const handleSortChange = useCallback((value: string) => {
		setSort(value);
		console.log('정렬 변경:', value);
		// 여기에 추가 로직 작성
	}, []);

	// 검색어 변경 핸들러
	const handleKeywordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
	}, []);

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-3">
				<DropdownCheckbox
					className="w-auto"
					hasImage
					menuClassName="min-w-[15.25rem]"
					options={[
						{ label: 'q', value: 'q' },
						{ label: 'w', value: 'w' },
					]}
					text={t('role.doctor')}
				/>
				<Dropdown
					className="w-auto"
					menuClassName="min-w-[9.375rem]"
					onChange={handlePrescriptionChange}
					options={prescriptionOptions}
					placeholder={t('appointment.search.prescriptionStatus.all')}
					value={prescription}
				/>
				<Dropdown
					className="w-auto"
					menuClassName="min-w-[9.375rem]"
					onChange={handlePaymentChange}
					options={paymentOptions}
					placeholder={t('appointment.search.paymentStatus.all')}
					value={payment}
				/>
				<Dropdown
					className="w-auto"
					menuClassName="min-w-[9.375rem]"
					onChange={handleSortChange}
					options={sortOptions}
					placeholder={t('appointment.search.sort.newest')}
					value={sort}
				/>
			</div>
			<Input
				className="px-0"
				icon={<SearchIcon className="cursor-pointer h-7 w-7" />}
				onChange={handleKeywordChange}
				placeholder={t('appointment.search.placeholders.appointmentOrPatient')}
				type="text"
				value={keyword}
				wrapperClassName="w-[36.125rem]"
			/>
		</div>
	);
};

export default SearchCompleted;
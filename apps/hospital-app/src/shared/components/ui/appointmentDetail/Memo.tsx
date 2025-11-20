import { type ChangeEvent, useCallback, useState } from 'react';
import { Button } from '@/shared/components/ui';
import { useTranslation } from 'react-i18next';

interface Props {
	initialValue?: string;
	maxLength?: number;
	onChange?: (value: string) => void;
	onSave?: () => void;
}

const Memo = ({
	initialValue = '',
	maxLength = 500,
	onChange,
	onSave,
}: Props) => {
	const { t } = useTranslation();
	const [value, setValue] = useState(initialValue);

	const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value);
		onChange?.(e.target.value);
	}, [onChange]);

	return (
		<div className="flex flex-1 flex-col gap-2.5 items-start self-stretch">
			<h2 className="font-semibold leading-[normal] text-text-100 text-xl">{t('appointment.detail.memo.title')}</h2>
			<div className="bg-white border border-stroke-input flex flex-1 flex-col gap-2.5 p-5 rounded-[0.625rem] w-full">
				<textarea
					className="flex-1 outline-0 resize-none w-full"
					maxLength={maxLength}
					onChange={handleChange}
					placeholder={t('appointment.detail.memo.placeholder')}
					value={value}
				/>
				<div className='flex items-center justify-end'>
					<Button className="h-10 rounded-sm" onClick={onSave} type="button">{t('appointment.detail.memo.save')}</Button>
				</div>
			</div>
		</div>
	);
};

export default Memo;
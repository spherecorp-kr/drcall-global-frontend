import { type ChangeEvent, useCallback, useState } from 'react';
import { Button } from '@/shared/components/ui';

interface Props {
	initialValue?: string;
	maxLength?: number;
	onChange?: (value: string) => void;
	onSave?: () => void;
	placeholder?: string;
}

const Memo = ({
	initialValue = '',
	maxLength = 500,
	onChange,
	onSave,
	placeholder
}: Props) => {
	const [value, setValue] = useState(initialValue);

	const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value);
		onChange?.(e.target.value);
	}, [onChange]);

	return (
		<div className="flex flex-1 flex-col gap-2.5 items-start self-stretch">
			<h2 className="font-semibold leading-normal text-text-100 text-xl">메모</h2>
			<div className="flex h-full relative w-full">
				<textarea
					className="bg-white border border-stroke-input flex-1 font-normal leading-normal p-5 placeholder:text-text-30 resize-none rounded-[0.625rem] text-base text-text-100"
					maxLength={maxLength}
					onChange={handleChange}
					placeholder={placeholder}
					value={value}
				/>
				<div className='absolute bottom-5 right-5'>
					<Button className="h-10 rounded-sm" onClick={onSave} type="button">저장</Button>
				</div>
			</div>
		</div>
	);
};

export default Memo;
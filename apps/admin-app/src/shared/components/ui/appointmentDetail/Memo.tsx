import { type ChangeEvent, useCallback, useState } from 'react';
import { Button } from '@/shared/components/ui';

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
	const [value, setValue] = useState(initialValue);

	const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value);
		onChange?.(e.target.value);
	}, [onChange]);

	return (
		<div className="flex flex-1 flex-col gap-2.5 items-start self-stretch">
			<h2 className="font-semibold leading-normal text-text-100 text-xl">메모</h2>
			<div className="bg-white border border-stroke-input flex flex-1 flex-col gap-2.5 p-5 rounded-[0.625rem] w-full">
				<textarea
					className="flex-1 outline-0 resize-none w-full"
					maxLength={maxLength}
					onChange={handleChange}
					placeholder='의료진 또는 코디네이터가 숙지해야 할 특이 사항이 있다면 적어주세요.'
					value={value}
				/>
				<div className='flex items-center justify-end'>
					<Button className="h-10 rounded-sm" onClick={onSave} type="button">저장</Button>
				</div>
			</div>
		</div>
	);
};

export default Memo;
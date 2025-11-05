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
	placeholder = '의료진 또는 코디네이터가 숙지해야 할 특이 사항이 있다면 적어주세요.'
}: Props) => {
	const [value, setValue] = useState(initialValue);

	const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value);
		onChange?.(e.target.value);
	}, [onChange]);

	return (
		<div className="flex flex-1 flex-col gap-2.5 items-start self-stretch">
			<h2 className="font-semibold leading-normal text-text-100 text-xl">메모</h2>
			<div className="w-full h-full p-5 bg-white rounded-[10px] border border-stroke-input flex items-start gap-2.5 relative">
				<textarea
					className="flex-1 self-stretch text-text-100 text-base font-normal resize-none border-none outline-none bg-transparent placeholder:text-text-30 pr-20 pb-12"
					maxLength={maxLength}
					onChange={handleChange}
					placeholder={placeholder}
					value={value}
				/>
				<div className="absolute bottom-5 right-5">
					<Button
						className="h-10 px-5 bg-primary-70 rounded"
						onClick={onSave}
						type="button"
					>
						<div className="text-center flex justify-center flex-col text-white text-base font-medium">저장</div>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Memo;
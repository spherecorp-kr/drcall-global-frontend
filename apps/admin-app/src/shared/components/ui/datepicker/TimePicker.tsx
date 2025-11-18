import { useCallback, useState } from 'react';
import { Button } from '@/shared/components/ui';
import { useEffectAfterMount } from '@/shared/hooks/useEffectAfterMount';
import { cn } from '@/shared/utils/cn';
import type { DoctorSchedule } from '@/shared/types/appointment';

interface Props {
	dateStr: string;
	initialTime?: string;
	onTimeSelect: (time: string) => void;
	times: DoctorSchedule[];
}

const TimePicker = ({ dateStr, initialTime, onTimeSelect, times }: Props) => {
	const [selectedTime, setSelectedTime] = useState(initialTime);

	const handleTimeClick = useCallback((time: string) => {
		setSelectedTime(time);
		onTimeSelect(time);
	}, [onTimeSelect]);

	useEffectAfterMount(() => {
		setSelectedTime(undefined);
	}, [dateStr]);

	return (
		<div className="grid grid-cols-3 gap-x-2 gap-y-3">
			{times.map(({ displayTime, time }, index) => (
				<Button
					className={cn('h-10', selectedTime === time ? 'border-tap-1' : '')}
					key={index}
					onClick={() => handleTimeClick(time)}
					variant='ghost'
				>{displayTime}</Button>
			))}
		</div>
	);
};

export default TimePicker;
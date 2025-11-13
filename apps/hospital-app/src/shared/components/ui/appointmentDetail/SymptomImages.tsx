import { useCallback, useRef } from 'react';
import { useDialog } from '@/shared/hooks/useDialog';
import { ImageViewer } from '@/shared/components/ui';
import reactIcon from '@/assets/react.svg';

const SlideLeftIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
		<path d="M24 0.5H4C2.067 0.5 0.5 2.067 0.5 4V24C0.5 25.933 2.067 27.5 4 27.5H24C25.933 27.5 27.5 25.933 27.5 24V4C27.5 2.067 25.933 0.5 24 0.5Z" fill="white" stroke="#E0E0E0"/>
		<path d="M16.3359 21.2031L9.74195 14.2116L16.3359 7.22002" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

const SlideRightIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
		<path d="M24 0.5H4C2.067 0.5 0.5 2.067 0.5 4V24C0.5 25.933 2.067 27.5 4 27.5H24C25.933 27.5 27.5 25.933 27.5 24V4C27.5 2.067 25.933 0.5 24 0.5Z" fill="white" stroke="#E0E0E0"/>
		<path d="M11.6641 21.2031L18.2581 14.2116L11.6641 7.22002" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

const SymptomImages = () => {
	const { openDialog } = useDialog();
	const imageScrollRef = useRef<HTMLDivElement>(null);

	// 이미지 슬라이드 핸들러
	const handleSlideLeft = useCallback(() => {
		if (imageScrollRef.current) {
			const scrollAmount = 88; // 이미지 너비(80px) + gap(8px) = 88px
			imageScrollRef.current.scrollBy({ behavior: 'smooth', left: -scrollAmount });
		}
	}, []);

	const handleSlideRight = useCallback(() => {
		if (imageScrollRef.current) {
			const scrollAmount = 88; // 이미지 너비(80px) + gap(8px) = 88px
			imageScrollRef.current.scrollBy({ behavior: 'smooth', left: scrollAmount });
		}
	}, []);

	// 증상 이미지 클릭 핸들러 (다이얼로그 열기)
	const handleSymptomImageClick = useCallback((imageIndex: number) => {
		// TODO: 다이얼로그 열기 및 이미지 크게 보기
		console.log('이미지 클릭:', imageIndex);
		openDialog({
			dialogClass: 'w-[36.25rem]',
			dialogContents: <ImageViewer images={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']} initialIndex={imageIndex} />,
			dialogId: 'symptomImageDialog',
			dialogTitle: '증상 이미지',
			hasCloseButton: true
		});
	}, [openDialog]);

	return (
		<div className="flex gap-3 h-20 items-center w-full">
			<button className="h-7 w-7" onClick={handleSlideLeft} type="button">
				<SlideLeftIcon />
			</button>
			<div
				className="flex flex-1 gap-2 items-center overflow-x-hidden"
				ref={imageScrollRef}
			>
				{Array.from({ length: 10 }, (_, i) => (
					<img
						alt="sample"
						className="bg-black border border-stroke-input cursor-pointer h-20 rounded-sm w-20"
						key={i}
						onClick={() => handleSymptomImageClick(i)}
						src={reactIcon}
					/>
				))}
			</div>
			<button
				className="h-7 w-7"
				onClick={handleSlideRight}
				type="button"
			>
				<SlideRightIcon />
			</button>
		</div>
	);
};

export default SymptomImages;
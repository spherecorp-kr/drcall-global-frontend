import { useCallback, useRef, useState } from 'react';
import  { type ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import reactIcon from '@/assets/react.svg';
import { cn } from '@/shared/utils/cn.ts';
import { Button } from '@/shared/components/ui';
import btnZoomIn from '@/assets/icons/btn_zoom_in.png';
import btnZoomOut from '@/assets/icons/btn_zoom_out.png';
import { useEffectAfterMount } from '@/shared/hooks/useEffectAfterMount';

interface Props {
	images: string[];
	initialIndex?: number;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

const slideVariants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 1000 : -1000,
		opacity: 0
	}),
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1
	},
	exit: (direction: number) => ({
		zIndex: 0,
		x: direction < 0 ? 1000 : -1000,
		opacity: 0
	})
};

const contentStyle = { height: '100%', justifyContent: 'center', width: '100%' };
const wrapperStyle = { height: '100%', width: '100%' };
const transition = {
	opacity: { duration: 0.2 },
	x: { damping: 30, stiffness: 300, type: 'spring' as const }
};

const ImageViewer = ({
	images,
	initialIndex = 0
}: Props) => {
	const [[page, direction], setPage] = useState([initialIndex, 0]);
	const transformRefs = useRef<Map<number, ReactZoomPanPinchRef>>(new Map());
	const [currentTransformRef, setCurrentTransformRef] = useState<ReactZoomPanPinchRef | null>(null);

	const paginate = useCallback((newDirection: number) => {
		setPage(prev => {
			const [currentPage] = prev;
			const nextPage = currentPage + newDirection;

			if (nextPage < 0) return [images.length - 1, newDirection];
			if (nextPage >= images.length) return [0, newDirection];
			return [nextPage, newDirection];
		});
	}, [images.length]);

	const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
		const swipe = swipePower(offset.x, velocity.x);

		if (swipe < -swipeConfidenceThreshold) {
			paginate(1);
		} else if (swipe > swipeConfidenceThreshold) {
			paginate(-1);
		}
	}, [paginate]);

	// 줌인 핸들러
	const handleZoomIn = useCallback(() => {
		if (currentTransformRef) {
			currentTransformRef.zoomIn();
		}
	}, [currentTransformRef]);

	// 줌아웃 핸들러
	const handleZoomOut = useCallback(() => {
		if (currentTransformRef) {
			currentTransformRef.zoomOut();
		}
	}, [currentTransformRef]);

	// 왼쪽으로 이동
	const handlePrevPage = useCallback(() => {
		paginate(-1);
	}, [paginate]);

	// 오른쪽으로 이동
	const handleNextPage = useCallback(() => {
		paginate(1);
	}, [paginate]);

	// 페이지 변경 시 해당 페이지의 ref를 현재 ref로 설정
	useEffectAfterMount(() => {
		const ref = transformRefs.current.get(page);
		if (ref) {
			setCurrentTransformRef(ref);
			// 새 이미지로 전환할 때 줌 리셋
			ref.resetTransform();
		}
	}, [page]);

	return (
		<div className='flex flex-col gap-2 w-[33.75rem]'>
			<div className='bg-text-90 flex gap-2 h-[25.75rem] items-center relative'>
				<div className='absolute flex gap-2 items-center right-4 top-4 z-10'>
					<Button
						className='flex h-7 items-center justify-center p-0 rounded-sm w-7'
						onClick={handleZoomIn}
					>
						<img alt='zoom in' className='h-4 w-4' src={btnZoomIn} />
					</Button>
					<Button
						className='flex h-7 items-center justify-center p-0 rounded-sm w-7'
						onClick={handleZoomOut}
					>
						<img alt='zoom out' className='h-4 w-4' src={btnZoomOut} />
					</Button>
				</div>
				<button onClick={handlePrevPage}>
					<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
						<path fillRule="evenodd" clipRule="evenodd" d="M10.9482 20.3271C10.7675 20.1464 10.7675 19.8536 10.9482 19.6729L24.0321 6.58902C24.2127 6.40837 24.5056 6.40837 24.6863 6.58902C24.8669 6.76967 24.8669 7.06257 24.6863 7.24322L11.9295 20L24.6863 32.7568C24.8669 32.9374 24.8669 33.2303 24.6863 33.411C24.5056 33.5916 24.2127 33.5916 24.0321 33.411L10.9482 20.3271Z" fill="white"/>
					</svg>
				</button>
				<AnimatePresence initial={false} custom={direction}>
					<motion.div
						animate='center'
						className='active:cursor-grabbing cursor-grab h-full w-full'
						custom={direction}
						drag='x'
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={1}
						exit='exit'
						initial='enter'
						key={page}
						onDragEnd={handleDragEnd}
						transition={transition}
						variants={slideVariants}
					>
						<TransformWrapper
							centerOnInit
							doubleClick={{ disabled: true }}
							initialScale={1}
							maxScale={2}
							minScale={0.5}
							onInit={(ref) => {
								transformRefs.current.set(page, ref);
								if (page === initialIndex || transformRefs.current.size === 1) {
									setCurrentTransformRef(ref);
								}
							}}
							panning={{ disabled: false }}
							pinch={{ disabled: true }}
							wheel={{ disabled: true }}
						>
							<TransformComponent
								contentStyle={contentStyle}
								wrapperStyle={wrapperStyle}
							>
								<img
									alt={`image ${page + 1}`}
									className='h-full object-contain w-auto'
									draggable={false}
									// src={images[page]}
									src={reactIcon}
								/>
							</TransformComponent>
						</TransformWrapper>
					</motion.div>
				</AnimatePresence>
				<button onClick={handleNextPage}>
					<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
						<path fillRule="evenodd" clipRule="evenodd" d="M29.0518 19.6729C29.2325 19.8536 29.2325 20.1464 29.0518 20.3271L15.9679 33.411C15.7873 33.5916 15.4944 33.5916 15.3137 33.411C15.1331 33.2303 15.1331 32.9374 15.3137 32.7568L28.0705 20L15.3137 7.24322C15.1331 7.06257 15.1331 6.76967 15.3137 6.58902C15.4944 6.40837 15.7873 6.40837 15.9679 6.58902L29.0518 19.6729Z" fill="white"/>
					</svg>
				</button>
			</div>
			<div className='flex gap-2 items-center justify-center'>
				{images.map((_, i) => (
					<img
						alt='image'
						className={cn('border-2 h-[2.875rem] w-[2.925rem]', i === page ? 'border-primary-70' : 'border-transparent')}
						key={`symptom-image-${i}`}
						src={reactIcon}
					/>
				))}
			</div>
		</div>
	);
};

export default ImageViewer;
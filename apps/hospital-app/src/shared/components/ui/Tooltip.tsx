import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
	content: ReactNode;
	children: ReactNode | ((props: { isOpen: boolean }) => ReactNode);
	position?: 'top' | 'bottom' | 'left' | 'right';
	className?: string;
	delay?: number;
}

export function Tooltip({
	content,
	children,
	position = 'bottom',
	className = '',
	delay = 0,
}: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
	const triggerRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const showTooltip = () => {
		if (delay > 0) {
			timeoutRef.current = setTimeout(() => {
				setIsVisible(true);
			}, delay);
		} else {
			setIsVisible(true);
		}
	};

	const hideTooltip = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setIsVisible(false);
	};

	const toggleTooltip = () => {
		setIsVisible(!isVisible);
	};

	useEffect(() => {
		if (isVisible && triggerRef.current && tooltipRef.current) {
			const triggerRect = triggerRef.current.getBoundingClientRect();
			const tooltipRect = tooltipRef.current.getBoundingClientRect();
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			let top = 0;
			let left = 0;

			// 기본 위치: 아이콘 아래, 왼쪽 정렬
			if (position === 'bottom') {
				top = triggerRect.bottom + 8;
				left = triggerRect.left;
			} else if (position === 'top') {
				top = triggerRect.top - tooltipRect.height - 8;
				left = triggerRect.left;
			} else if (position === 'left') {
				top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
				left = triggerRect.left - tooltipRect.width - 8;
			} else if (position === 'right') {
				top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
				left = triggerRect.right + 8;
			}

			// 화면 경계 체크 및 조정
			const padding = 16;

			// 위로 넘어가면 아래로
			if (top < padding) {
				top = triggerRect.bottom + 8;
			}

			// 아래로 넘어가면 위로
			if (top + tooltipRect.height > viewportHeight - padding) {
				top = triggerRect.top - tooltipRect.height - 8;
			}

			// 오른쪽으로 넘어가는 만큼만 왼쪽으로 이동
			const overflowRight = left + tooltipRect.width - (viewportWidth - padding);
			if (overflowRight > 0) {
				left = left - overflowRight;
			}

			// 왼쪽으로 넘어가는 만큼만 오른쪽으로 이동
			const overflowLeft = padding - left;
			if (overflowLeft > 0) {
				left = left + overflowLeft;
			}

			setTooltipStyle({
				top: `${top}px`,
				left: `${left}px`,
			});
		}
	}, [isVisible, position]);

	// 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				tooltipRef.current &&
				triggerRef.current &&
				!tooltipRef.current.contains(event.target as Node) &&
				!triggerRef.current.contains(event.target as Node)
			) {
				hideTooltip();
			}
		};

		if (isVisible) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isVisible]);

	// 컴포넌트 언마운트 시 타이머 정리
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const renderChildren =
		typeof children === 'function' ? children({ isOpen: isVisible }) : children;

	return (
		<>
			<div className={`relative inline-block ${className}`}>
				<div
					ref={triggerRef}
					onMouseEnter={showTooltip}
					onMouseLeave={hideTooltip}
					onClick={(e) => {
						e.stopPropagation();
						toggleTooltip();
					}}
				>
					{renderChildren}
				</div>
			</div>

			{isVisible &&
				createPortal(
					<div
						ref={tooltipRef}
						style={tooltipStyle}
						className="fixed z-[9999] w-[248px] rounded-[10px] bg-tap-1 p-4 shadow-lg animate-in fade-in zoom-in-95 duration-200"
						onClick={(e) => e.stopPropagation()}
					>
						<div
							className="w-full text-text-0 text-16 font-pretendard font-normal leading-[24px]"
							style={{
								wordBreak: 'keep-all',
								overflowWrap: 'break-word',
								whiteSpace: 'normal',
							}}
						>
							{content}
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}

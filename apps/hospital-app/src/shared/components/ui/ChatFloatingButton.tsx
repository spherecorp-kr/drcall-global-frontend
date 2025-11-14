import { useState, useEffect, useRef } from 'react';
import { cn } from '@/shared/utils/cn';
import { useTranslation } from 'react-i18next';
import chatBgIcon from '@/shared/assets/icons/ic_chat_bg.svg';
import chatCircleIcon from '@/shared/assets/icons/ic_chat_circle.svg';
import chatCloseIcon from '@/shared/assets/icons/ic_chat_close.svg';

interface ChatFloatingButtonProps {
	onClick?: () => void;
	unreadCount?: number;
	className?: string;
	isOpen?: boolean;
	onPositionChange?: (position: Position) => void;
}

export interface Position {
	x: number;
	y: number;
}

const STORAGE_KEY = 'chat-floating-button-position';

const ChatFloatingButton = ({
	onClick,
	unreadCount = 0,
	className,
	isOpen = false,
	onPositionChange,
}: ChatFloatingButtonProps) => {
	const { t } = useTranslation();
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState<Position>({ x: 32, y: 32 });
	const [clickStartPos, setClickStartPos] = useState<{ x: number; y: number } | null>(null);
	const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
		startX: 0,
		startY: 0,
		initialX: 32,
		initialY: 32,
	});

	// Load position from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const savedPosition = JSON.parse(saved);
				setPosition(savedPosition);
				onPositionChange?.(savedPosition);
			} catch (e) {
				console.error('Failed to parse saved position', e);
			}
		} else {
			onPositionChange?.(position);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Save position to localStorage
	const savePosition = (pos: Position) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		// 채팅 윈도우가 열려있으면 드래그 비활성화
		if (isOpen) {
			onClick?.();
			return;
		}

		setClickStartPos({ x: e.clientX, y: e.clientY });
		setIsDragging(true);
		dragRef.current = {
			startX: e.clientX,
			startY: e.clientY,
			initialX: position.x,
			initialY: position.y,
		};
	};

	useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: MouseEvent) => {
			const deltaX = dragRef.current.startX - e.clientX;
			const deltaY = dragRef.current.startY - e.clientY;

			// 버튼 크기 (84px)를 고려하여 화면 경계 계산
			const buttonSize = 84;
			const maxX = window.innerWidth - buttonSize;
			const maxY = window.innerHeight - buttonSize;

			const newX = Math.max(0, Math.min(maxX, dragRef.current.initialX + deltaX));
			const newY = Math.max(0, Math.min(maxY, dragRef.current.initialY + deltaY));

			const newPos = { x: newX, y: newY };
			setPosition(newPos);
			onPositionChange?.(newPos);
		};

		const handleMouseUp = (e: MouseEvent) => {
			setIsDragging(false);
			savePosition(position);

			// If the mouse hasn't moved much, treat it as a click
			if (clickStartPos) {
				const deltaX = Math.abs(e.clientX - clickStartPos.x);
				const deltaY = Math.abs(e.clientY - clickStartPos.y);
				if (deltaX < 5 && deltaY < 5) {
					onClick?.();
				}
			}
			setClickStartPos(null);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDragging, position, clickStartPos, onClick]);

	return (
		<button
			onMouseDown={handleMouseDown}
			className={cn(
				'fixed z-50 select-none',
				isOpen ? 'cursor-pointer' : isDragging ? 'cursor-grabbing' : 'cursor-grab',
				className,
			)}
			style={{
				right: `${position.x}px`,
				bottom: `${position.y}px`,
			}}
		>
			{/* Main Circle with Badge */}
			<div className="relative w-[84px] h-[84px]">
				<img src={chatBgIcon} alt="" className="w-full h-full" draggable={false} />

				{/* Badge */}
				{unreadCount > 0 && (
					<div
						className="absolute -top-[2px] -right-[2px] h-[25px] min-w-[25px] px-2 rounded-full flex items-center justify-center border border-white"
						style={{ background: '#FF4A55' }}
					>
						<span className="text-white text-14 font-semibold font-pretendard leading-[19.6px] whitespace-nowrap">
							{unreadCount > 99 ? '99+' : unreadCount}
						</span>
					</div>
				)}

				{/* Icon and Text - Centered inside circle */}
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
					{/* Icon */}
					<div className="w-8 h-8 flex items-center justify-center">
						{isOpen ? (
							<img
								src={chatCloseIcon}
								alt="Close chat"
								className="w-full h-full"
								draggable={false}
							/>
						) : (
							<img
								src={chatCircleIcon}
								alt="Chat"
								className="w-full h-full"
								draggable={false}
							/>
						)}
					</div>

					{/* Text */}
					<div className="text-center text-white text-16 font-semibold font-pretendard capitalize">
						{t('chat.title')}
					</div>
				</div>
			</div>
		</button>
	);
}

export default ChatFloatingButton;
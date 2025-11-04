import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/utils/cn';
import CloseIcon from '@/shared/assets/icons/ic_close.svg';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	title?: string;
	width?: string;
	className?: string;
}

export function Modal({
	isOpen,
	onClose,
	children,
	title,
	width = '580px',
	className,
}: ModalProps) {
	// ESC 키로 닫기
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			// body 스크롤 방지
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return createPortal(
		<div className="fixed inset-0 z-[9999] flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/70"
				onClick={onClose}
			/>

			{/* Modal Content */}
			<div
				className={cn(
					'relative bg-white rounded-[10px] shadow-[4px_4px_10px_rgba(0,0,0,0.25)] overflow-hidden',
					className,
				)}
				style={{ width }}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				{title && (
					<div className="relative px-6 pt-5 pb-[22px]">
						<h2 className="text-center text-20 font-semibold text-text-100">
							{title}
						</h2>
						{/* Close Button */}
						<button
							onClick={onClose}
							className="absolute top-5 right-6 w-7 h-7 flex items-center justify-center"
							aria-label="닫기"
						>
							<img src={CloseIcon} alt="" className="w-7 h-7" />
						</button>
					</div>
				)}

				{/* Body */}
				<div className={cn('px-6 pb-6', !title && 'pt-6')}>{children}</div>
			</div>
		</div>,
		document.body,
	);
}

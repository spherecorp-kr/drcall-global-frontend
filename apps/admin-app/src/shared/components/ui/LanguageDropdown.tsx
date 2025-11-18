import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/shared/utils/cn';
import checkIcon from '@/shared/assets/icons/ic_v_p.svg';
import dropdownBg from '@/shared/assets/icons/language_dropdown_bg.svg';
import { useTranslation } from 'react-i18next';
import { type Language, useLanguage } from '@/shared/hooks/useLanguage.ts';

interface LanguageOptionsProps {
	handleSelect: (language: Language) => void;
}

const ChevronUpDownIcon = ({ direction }: { direction: 'up' | 'down' }) => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path
			d={direction === 'up' ? 'M4 10L8 6L12 10' : 'M4 6L8 10L12 6'}
			stroke="#1F1F1F"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const VerticalDivider = () => (
	<svg
		width="1"
		height="36"
		viewBox="0 0 1 36"
		fill="none"
		className="absolute right-0 top-1/2 -translate-y-1/2"
	>
		<line x1="0.5" y1="0" x2="0.5" y2="36" stroke="#E0E0E0" />
	</svg>
);

const CheckIconWrapper = ({ visible }: { visible: boolean }) => (
	<div className="w-[10px] h-[10px] flex items-center justify-center flex-shrink-0">
		{visible && <img alt="checkIcon" className="w-[10px] h-[10px]" src={checkIcon} />}
	</div>
);

const LanguageOptions: React.FC<LanguageOptionsProps> = ({ handleSelect }) => {
	const { availableLanguages, currentLanguage } = useLanguage();
	const { t } = useTranslation();
	return (
		<>
			{availableLanguages.map((language) => (
				<div
					key={language}
					className={cn(
						'flex items-center text-left',
						'font-normal font-pretendard leading-normal whitespace-nowrap',
						'transition-opacity',
						'hover:opacity-80',
					)}
					onClick={() => handleSelect(language)}
					style={{
						color: 'white',
						fontSize: '14px',
						fontWeight: '400',
					}}
				>
					<CheckIconWrapper visible={currentLanguage === language} />
					<div style={{ width: '4px' }} />
					<span>{t(`language.${language}`)}</span>
				</div>
			))}
		</>
	);
};

export function LanguageDropdown() {
	const { changeLanguage, currentLanguage } = useLanguage();
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleSelect = useCallback(
		(language: Language) => {
			changeLanguage(language);
			setIsOpen(false);
		},
		[changeLanguage],
	);

	return (
		<div ref={dropdownRef} className="relative flex h-[70px] items-center justify-end px-5">
			{/* Trigger Button */}
			<button
				ref={triggerRef}
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-0.5 h-full relative"
			>
				<span className="text-right text-text-100 text-16 font-normal font-pretendard leading-normal">
					{t(`language.${currentLanguage}`)}
				</span>
				<ChevronUpDownIcon direction={isOpen ? 'up' : 'down'} />

				{/* Dropdown Menu - Bubble Style */}
				{isOpen && (
					<div
						className="absolute z-50 animate-in fade-in slide-in-from-top-1 duration-150 pointer-events-none"
						style={{
							top: 'calc(100% + 6px)',
							right: '0',
							transform: 'translateX(7px)',
						}}
					>
						<div className="relative w-[99px] h-[96px]">
							{/* Background SVG */}
							<img
								alt="dropdownBg"
								className="absolute inset-0 w-full h-full"
								src={dropdownBg}
							/>

							{/* Content */}
							<div
								className="absolute flex flex-col justify-start items-start pointer-events-auto"
								style={{
									left: '9px',
									right: '30px',
									top: '17px',
									bottom: '12px',
								}}
							>
								<LanguageOptions handleSelect={handleSelect} />
							</div>
						</div>
					</div>
				)}
			</button>

			{/* Right Divider */}
			<VerticalDivider />
		</div>
	);
}

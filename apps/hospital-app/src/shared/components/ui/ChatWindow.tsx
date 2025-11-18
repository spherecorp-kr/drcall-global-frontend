import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';
import closeIcon from '@/shared/assets/icons/ic_close.svg';
import profileBgIcon from '@/shared/assets/icons/ic_profile_bg.svg';
import userIcon from '@/shared/assets/icons/ic_user.svg';
import warningIcon from '@/shared/assets/icons/ic_circle_warning.svg';
import resetIcon from '@/shared/assets/icons/ic_reset.svg';
import { SearchInput } from '@/shared/components/ui';
import { ChatRoom } from './ChatRoom';
import { Badge } from './Badge';
import { listUserChannels, closeChannel, type ChatChannel } from '@/services/chatService';
import { useChatStore } from '@/shared/store/chatStore';

interface ChatWindowProps {
	isOpen: boolean;
	onClose: () => void;
	className?: string;
	buttonPosition?: { x: number; y: number };
}


const ChatWindow = ({ isOpen, onClose, className, buttonPosition }: ChatWindowProps) => {
	const { t } = useTranslation();
	const { currentChannel } = useChatStore();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedChat, setSelectedChat] = useState<string | null>(null);
	const [showFilterMenu, setShowFilterMenu] = useState(false);
	const [selectedFilters, setSelectedFilters] = useState<
		('patient' | 'doctor' | 'coordinator')[]
	>([]);
	const [channels, setChannels] = useState<ChatChannel[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const filterMenuRef = useRef<HTMLDivElement>(null);

	// TODO: Get current user ID from auth context/store
	const currentUserId = 'staff_1'; // Temporary

	// Fetch channels when window opens
	useEffect(() => {
		if (isOpen && currentUserId) {
			fetchChannels();
		}
	}, [isOpen, currentUserId]);

	// Open channel directly if passed from TopButtons
	useEffect(() => {
		if (isOpen && currentChannel) {
			setSelectedChat(currentChannel.channel_url);
		}
	}, [isOpen, currentChannel]);

	const fetchChannels = async () => {
		try {
			setIsLoading(true);
			const response = await listUserChannels(currentUserId, 50);
			setChannels(response.channels || []);
		} catch (error) {
			console.error('Failed to fetch channels:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
				setShowFilterMenu(false);
			}
		};

		if (showFilterMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showFilterMenu]);

	if (!isOpen) return null;

	const handleEndChat = async () => {
		if (!selectedChat) return;

		try {
			await closeChannel(selectedChat, currentUserId);
			// 채팅방에 그대로 머물러서 "대화가 종료되었습니다" 시스템 메시지를 볼 수 있도록 함
			// SSE를 통해 CHANNEL_CLOSED 이벤트를 받아서 UI 업데이트됨
		} catch (error) {
			console.error('Failed to close channel:', error);
		}
	};

	// Show ChatRoom when a chat is selected
	if (selectedChat) {
		const channel = channels.find((c) => c.channel_url === selectedChat);
		if (channel) {
			// Get other member (not current user)
			const otherMember = channel.members?.find((m) => m.user_id !== currentUserId);
			const patientName = otherMember?.nickname || 'Unknown';

			// 임직원끼리 채팅 시 대화 종료 버튼 숨기기 (channel custom_type이 INTERNAL인 경우)
			const isStaffToStaffChat = channel.custom_type === 'INTERNAL';
			const isClosed = channel.metadata?.status === 'closed';

			return (
				<ChatRoom
					channelUrl={channel.channel_url}
					patientName={patientName}
					isClosed={isClosed}
					onClose={onClose}
					onBack={() => {
						setSelectedChat(null);
						fetchChannels(); // Refresh channel list
					}}
					onEndChat={isStaffToStaffChat ? undefined : handleEndChat}
					className={className}
					buttonPosition={buttonPosition}
				/>
			);
		}
	}

	// 필터 토글
	const toggleFilter = (filterType: 'patient' | 'doctor' | 'coordinator') => {
		setSelectedFilters((prev) =>
			prev.includes(filterType)
				? prev.filter((f) => f !== filterType)
				: [...prev, filterType],
		);
	};

	// Helper: Determine user type from channel members
	const getUserType = (channel: ChatChannel): 'patient' | 'doctor' | 'coordinator' => {
		// INTERNAL = staff-to-staff
		if (channel.custom_type === 'INTERNAL') {
			// Check member nicknames or metadata to determine if doctor or coordinator
			// For now, default to coordinator for staff
			return 'coordinator';
		}
		// STAFF_INITIATED = patient
		return 'patient';
	};

	// Format timestamp to time/date string
	const formatTime = (timestamp: number): string => {
		const date = new Date(timestamp);
		const now = new Date();
		const isToday = date.toDateString() === now.toDateString();

		if (isToday) {
			return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
		} else {
			return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', year: 'numeric' });
		}
	};

	// 검색 및 필터링
	const filteredChats = channels.filter((channel) => {
		const otherMember = channel.members?.find((m) => m.user_id !== currentUserId);
		const name = otherMember?.nickname || '';
		const lastMessage = channel.last_message?.message || '';
		const userType = getUserType(channel);

		// 검색 필터
		const matchesSearch =
			!searchQuery ||
			name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

		// 사용자 타입 필터
		const matchesFilter =
			selectedFilters.length === 0 || selectedFilters.includes(userType);

		return matchesSearch && matchesFilter;
	});

	// 버튼 위치를 기반으로 윈도우 위치 계산
	const buttonSize = 84;
	const windowWidth = 414;
	const windowHeight = 600;
	const gap = 8; // 버튼과 윈도우 사이 간격

	// 버튼의 bottom 위치 + 버튼 높이 + 간격
	let bottom = buttonPosition ? buttonPosition.y + buttonSize + gap : 120;
	// 버튼의 right 위치에 맞춰 정렬
	let right = buttonPosition ? buttonPosition.x : 32;

	// 화면 경계 체크 및 버튼과 겹치지 않도록 조정
	if (typeof window !== 'undefined' && buttonPosition) {
		// 윈도우의 상단 위치 계산 (화면 하단에서부터의 거리)
		const windowTop = bottom + windowHeight;

		// 윈도우가 화면 위쪽으로 넘어가는지 체크
		if (windowTop > window.innerHeight - 10) {
			// 화면 위쪽을 넘어가면 버튼 옆으로 배치
			// 먼저 버튼 왼쪽에 배치 시도
			bottom = buttonPosition.y;
			right = buttonPosition.x - windowWidth - gap;

			// 왼쪽 공간이 부족하면 버튼 오른쪽에 배치
			const leftEdge = window.innerWidth - right - windowWidth;
			if (right < 10 || leftEdge < 10) {
				right = buttonPosition.x + buttonSize + gap;

				// 오른쪽도 부족하면 화면에 맞춰 조정
				if (right + windowWidth > window.innerWidth - 10) {
					right = window.innerWidth - windowWidth - 10;
				}
			}

			// 버튼 높이를 고려하여 윈도우가 화면 위로 넘어가지 않도록
			if (bottom + windowHeight > window.innerHeight - 10) {
				bottom = window.innerHeight - windowHeight - 10;
			}
		}

		// 윈도우가 화면 왼쪽으로 넘어가는지 체크
		const leftPosition = window.innerWidth - right - windowWidth;
		if (leftPosition < 10) {
			// 화면 왼쪽을 넘어가면 화면 좌측에서 10px 떨어진 위치로 조정
			right = window.innerWidth - windowWidth - 10;
		}

		// 윈도우가 화면 오른쪽으로 넘어가는지 체크 (right가 너무 작거나 음수면)
		if (right < 10) {
			right = 10;
		}

		// bottom이 10 미만이 되지 않도록
		if (bottom < 10) {
			bottom = 10;
		}
	}

	return (
		<div
			className={cn(
				'fixed w-full sm:w-[414px] h-[600px] bg-bg-white shadow-lg z-40 flex flex-col overflow-hidden rounded-[10px]',
				className,
			)}
			style={{
				bottom: `${bottom}px`,
				right: `${right}px`,
			}}
		>
			{/* Header */}
			<div className="h-[62px] relative bg-bg-white border-b border-stroke-input flex-shrink-0 rounded-t-[10px]">
				<div className="absolute left-5 top-5 flex items-center justify-between w-[calc(100%-40px)]">
					<div className="flex items-center justify-center gap-3">
						<h2 className="text-text-100 text-18 font-semibold font-pretendard">
							{t('chat.title')}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="w-7 h-7 flex items-center justify-center hover:opacity-70 transition-opacity"
						aria-label="Close chat"
					>
						<img src={closeIcon} alt="Close" className="w-full h-full" />
					</button>
				</div>
			</div>

			{/* Content Area */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Search Box & Filter */}
				<div className="px-5 pt-5 pb-1 flex-shrink-0">
					<div className="flex items-center gap-2">
						<div className="flex-1">
							<SearchInput
								value={searchQuery}
								onChange={setSearchQuery}
								placeholder={t('chat.search')}
							/>
						</div>
						{/* Filter Button */}
						<div className="relative" ref={filterMenuRef}>
							<button
								onClick={() => setShowFilterMenu(!showFilterMenu)}
								className={cn(
									'w-10 h-10 flex items-center justify-center rounded-lg border transition-colors',
									selectedFilters.length > 0
										? 'border-primary-70 bg-primary-5'
										: 'border-stroke-input bg-bg-white hover:bg-bg-gray',
								)}
								aria-label="Filter chats"
							>
								{/* Filter Icon */}
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M3 5h14M5 10h10M8 15h4"
										stroke={selectedFilters.length > 0 ? '#00A0D2' : '#6E6E6E'}
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
								</svg>
								{/* Active Filter Badge */}
								{selectedFilters.length > 0 && (
									<div
										style={{
											position: 'absolute',
											top: '-4px',
											right: '-4px',
											width: '18px',
											height: '18px',
											background: '#00A0D2',
											borderRadius: '9999px',
											border: '2px solid white',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<div
											style={{
												color: 'white',
												fontSize: '10px',
												fontWeight: '600',
												fontFamily: 'Pretendard',
												lineHeight: '1',
											}}
										>
											{selectedFilters.length}
										</div>
									</div>
								)}
							</button>

							{/* Filter Dropdown Menu */}
							{showFilterMenu && (
								<div
									className="absolute right-0 top-[calc(100%+4px)] bg-white rounded-lg shadow-lg z-50"
									style={{
										outline: '1px var(--Stroke-Input, #E0E0E0) solid',
										outlineOffset: '-1px',
										minWidth: '160px',
									}}
								>
									<div className="p-2 flex flex-col gap-1">
										{/* Patient Filter */}
										<button
											onClick={() => toggleFilter('patient')}
											className="min-h-8 py-1.5 px-3 flex items-center gap-2 rounded transition-colors bg-white hover:bg-bg-gray"
										>
											<div className="w-5 h-5 relative">
												<div
													className={cn(
														'w-5 h-5 absolute transition-colors',
														selectedFilters.includes('patient')
															? 'bg-primary-70'
															: 'bg-white',
													)}
												/>
												<div
													className={cn(
														'w-[18.95px] h-[18.95px] absolute left-[0.53px] top-[0.52px] transition-colors',
														selectedFilters.includes('patient')
															? 'bg-primary-70'
															: 'bg-white',
													)}
													style={{
														outline: selectedFilters.includes('patient')
															? '1px var(--Primary-70, #00A0D2) solid'
															: '1px var(--Stroke-Input, #E0E0E0) solid',
														outlineOffset: '-0.50px',
													}}
												/>
												{selectedFilters.includes('patient') && (
													<svg
														width="20"
														height="20"
														viewBox="0 0 20 20"
														fill="none"
														className="absolute"
													>
														<path
															d="M4 10L8 14L16 6"
															stroke="white"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												)}
											</div>
											<Badge variant="role-patient" size="small">
												{t('role.patient')}
											</Badge>
										</button>

										{/* Doctor Filter */}
										<button
											onClick={() => toggleFilter('doctor')}
											className="min-h-8 py-1.5 px-3 flex items-center gap-2 rounded transition-colors bg-white hover:bg-bg-gray"
										>
											<div className="w-5 h-5 relative">
												<div
													className={cn(
														'w-5 h-5 absolute transition-colors',
														selectedFilters.includes('doctor')
															? 'bg-primary-70'
															: 'bg-white',
													)}
												/>
												<div
													className={cn(
														'w-[18.95px] h-[18.95px] absolute left-[0.53px] top-[0.52px] transition-colors',
														selectedFilters.includes('doctor')
															? 'bg-primary-70'
															: 'bg-white',
													)}
													style={{
														outline: selectedFilters.includes('doctor')
															? '1px var(--Primary-70, #00A0D2) solid'
															: '1px var(--Stroke-Input, #E0E0E0) solid',
														outlineOffset: '-0.50px',
													}}
												/>
												{selectedFilters.includes('doctor') && (
													<svg
														width="20"
														height="20"
														viewBox="0 0 20 20"
														fill="none"
														className="absolute"
													>
														<path
															d="M4 10L8 14L16 6"
															stroke="white"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												)}
											</div>
											<Badge variant="role-doctor" size="small">
												{t('role.doctor')}
											</Badge>
										</button>

										{/* Coordinator Filter */}
										<button
											onClick={() => toggleFilter('coordinator')}
											className="min-h-8 py-1.5 px-3 flex items-center gap-2 rounded transition-colors bg-white hover:bg-bg-gray"
										>
											<div className="w-5 h-5 relative">
												<div
													className={cn(
														'w-5 h-5 absolute transition-colors',
														selectedFilters.includes('coordinator')
															? 'bg-primary-70'
															: 'bg-white',
													)}
												/>
												<div
													className={cn(
														'w-[18.95px] h-[18.95px] absolute left-[0.53px] top-[0.52px] transition-colors',
														selectedFilters.includes('coordinator')
															? 'bg-primary-70'
															: 'bg-white',
													)}
													style={{
														outline: selectedFilters.includes(
															'coordinator',
														)
															? '1px var(--Primary-70, #00A0D2) solid'
															: '1px var(--Stroke-Input, #E0E0E0) solid',
														outlineOffset: '-0.50px',
													}}
												/>
												{selectedFilters.includes('coordinator') && (
													<svg
														width="20"
														height="20"
														viewBox="0 0 20 20"
														fill="none"
														className="absolute"
													>
														<path
															d="M4 10L8 14L16 6"
															stroke="white"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												)}
											</div>
											<Badge variant="role-coordinator" size="small">
												{t('role.coordinator')}
											</Badge>
										</button>

										{/* Separator */}
										<div className="h-px bg-stroke-input mx-3 mt-2 mb-2" />

										{/* Clear All */}
										<div className="pb-1">
											<button
												onClick={() => setSelectedFilters([])}
												className="h-7 px-3 flex items-center gap-2 rounded transition-colors hover:bg-bg-gray w-full"
											>
												<div className="w-5 h-5 relative overflow-hidden flex items-center justify-center">
													<img
														src={resetIcon}
														alt=""
														className="w-5 h-5"
													/>
												</div>
												<div className="flex-1 text-text-40 text-14 font-normal font-pretendard text-left">
													{t('chat.filter.reset')}
												</div>
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Chat List */}
				<div className="flex-1 overflow-y-auto overflow-x-hidden">
					{isLoading ? (
						<div className="h-full flex items-center justify-center">
							<div className="text-text-40 text-16 font-medium">
								{t('common.loading', 'Loading...')}
							</div>
						</div>
					) : filteredChats.length === 0 ? (
						<div className="h-full px-5 pt-4 pb-5">
							<div className="h-full bg-bg-gray rounded-[10px] flex items-center justify-center gap-[6px]">
								<div className="w-6 h-6 relative overflow-hidden flex-shrink-0">
									<img
										src={warningIcon}
										alt=""
										className="w-5 h-5 absolute left-0.5 top-0.5"
									/>
								</div>
								<div className="text-text-40 text-16 font-medium font-pretendard whitespace-nowrap">
									{searchQuery || selectedFilters.length > 0
										? t('chat.noSearchResults')
										: t('chat.noChats')}
								</div>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-3 px-5 py-3">
							{filteredChats.map((channel, index) => {
								const otherMember = channel.members?.find((m) => m.user_id !== currentUserId);
								const name = otherMember?.nickname || 'Unknown';
								const lastMessage = channel.last_message?.message || '';
								const time = channel.last_message?.created_at
									? formatTime(channel.last_message.created_at)
									: '';
								const unreadCount = channel.unread_message_count || 0;

								return (
									<div key={channel.channel_url} className="flex flex-col gap-3">
										<div
											className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-100 transition-colors px-5 py-3 -mx-5 -my-3"
											onClick={() => setSelectedChat(channel.channel_url)}
										>
										{/* Avatar */}
										<div className="flex-shrink-0 relative">
											<div className="w-10 h-10 relative">
												<img
													src={profileBgIcon}
													alt=""
													className="w-full h-full"
												/>
												<img
													src={userIcon}
													alt=""
													className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6"
												/>
											</div>
										</div>

										{/* Content */}
										<div className="w-[220px] flex flex-col gap-1">
											<div className="text-text-100 text-16 font-normal font-pretendard truncate">
												{name}
											</div>
											<div className="text-text-70 text-14 font-normal font-pretendard truncate">
												{lastMessage}
											</div>
										</div>

										{/* Time & Unread Count */}
										<div className="w-[74px] flex flex-col items-end gap-1">
											<div className="text-right text-text-100 text-12 font-medium font-pretendard leading-[14.4px]">
												{time}
											</div>
											{/* Unread Count Badge */}
											{unreadCount > 0 && (
												<div
													style={{
														padding: 1,
														borderRadius: 240,
														justifyContent: 'center',
														alignItems: 'center',
														display: 'inline-flex',
													}}
												>
													<div
														style={{
															height: 14,
															paddingLeft: 4.5,
															paddingRight: 4.5,
															background: '#FF4A55',
															borderRadius: 240,
															flexDirection: 'column',
															justifyContent: 'center',
															alignItems: 'center',
															display: 'inline-flex',
														}}
													>
														<div
															style={{
																textAlign: 'center',
																justifyContent: 'center',
																display: 'flex',
																flexDirection: 'column',
																color: 'white',
																fontSize: 9,
																fontFamily: 'Pretendard',
																fontWeight: '600',
																lineHeight: '12.6px',
																wordWrap: 'break-word',
															}}
														>
															{unreadCount > 99 ? '99+' : unreadCount}
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
									{/* Divider */}
									{index < filteredChats.length - 1 && (
										<div className="w-full h-0 border-t border-stroke-input" />
									)}
								</div>
							);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default ChatWindow;
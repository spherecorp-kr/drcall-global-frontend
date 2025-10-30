import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';
import closeIcon from '@/shared/assets/icons/ic_close.svg';
import profileBgIcon from '@/shared/assets/icons/ic_profile_bg.svg';
import userIcon from '@/shared/assets/icons/ic_user.svg';
import backIcon from '@/shared/assets/icons/ic_back.svg';
import chatReadIcon from '@/shared/assets/icons/ic_chat_read.svg';
import logoutIcon from '@/shared/assets/icons/ic_logout_error.svg';
// import { ChatEventType } from '@/services/chatEvent'; // 추후 SSE 이벤트 타입 사용 시 활성화

interface ChatRoomProps {
	channelUrl: string;
	patientName: string;
	// patientAvatar?: string; // 추후 아바타 기능 추가 시 활성화
	isClosed?: boolean;
	onClose: () => void;
	onBack: () => void;
	onEndChat?: () => void;
}

interface Message {
	id: string;
	type: 'sent' | 'received' | 'system';
	content: string;
	time: string;
	timestamp: number;
	isRead?: boolean;
	date?: string;
	unread?: boolean;
	systemMessageType?: 'channelCreated' | 'channelClosed' | 'channelReopened'; // 시스템 메시지 타입
}

interface NewMessageToast {
	id: string;
	name: string;
	content: string;
}

interface ChatRoomPropsExtended extends ChatRoomProps {
	className?: string;
	buttonPosition?: { x: number; y: number };
}

export function ChatRoom({
	channelUrl,
	patientName,
	// patientAvatar,
	isClosed = false,
	onClose,
	onBack,
	onEndChat,
	className,
	buttonPosition,
}: ChatRoomPropsExtended) {
	const { t } = useTranslation();
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState('');
	const [isReopening, setIsReopening] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [isUserScrolling, setIsUserScrolling] = useState(false);
	const [isInputLocked, setIsInputLocked] = useState(false);
	const [lockMessage, setLockMessage] = useState('');
	const [, setCooldownSeconds] = useState(0); // cooldownSeconds는 lockMessage에 포함되어 사용됨
	const [newMessageToast, setNewMessageToast] = useState<NewMessageToast | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const firstUnreadRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const isSendingRef = useRef(false);
	const messageTimestamps = useRef<number[]>([]);

	// Get user ID from localStorage or use default for staff
	const userId = `staff-${localStorage.getItem('userId') || '1'}`;

	// Mock messages for demo
	useEffect(() => {
		const mockMessages: Message[] = [
			{
				id: '0',
				type: 'system',
				content: '', // 렌더링 시 번역됨
				systemMessageType: 'channelCreated',
				time: '09:28',
				timestamp: Date.now() - 3720000,
				date: '2025/10/29',
			},
			{
				id: '1',
				type: 'received',
				content: '안녕하세요. 예약 관련 문의드립니다.',
				time: '09:30',
				timestamp: Date.now() - 3600000,
				date: '2025/10/29',
			},
			{
				id: '2',
				type: 'sent',
				content: '네, 안녕하세요. 어떤 도움이 필요하신가요?',
				time: '09:32',
				timestamp: Date.now() - 3540000,
				isRead: true,
			},
			{
				id: '3',
				type: 'received',
				content: '다음 주 화요일 예약 가능한가요?',
				time: '09:35',
				timestamp: Date.now() - 3480000,
			},
		];

		// Add closed message if channel is closed
		if (isClosed) {
			mockMessages.push({
				id: '999',
				type: 'system',
				content: '', // 렌더링 시 번역됨
				systemMessageType: 'channelClosed',
				time: new Date().toLocaleTimeString('ko-KR', {
					hour: '2-digit',
					minute: '2-digit',
				}),
				timestamp: Date.now(),
			});
		}

		setMessages(mockMessages);
	}, [channelUrl, isClosed]);

	// SSE connection for real-time events

	useEffect(() => {
		if (!channelUrl || !userId) return;

		// Mock mode에서는 SSE 사용 안 함
		const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
		if (useMockData) return;

		const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:18083';
		const eventSourceUrl = `${baseUrl}/api/v1/chat/channels/${channelUrl}/stream`;

		console.log('Connecting to SSE:', eventSourceUrl);
		const eventSource = new EventSource(eventSourceUrl);

		// 새 메시지 이벤트
		eventSource.addEventListener('message', (event) => {
			try {
				const chatEvent = JSON.parse(event.data);
				const messageData = chatEvent.data;

				console.log('Received message event:', messageData);

				// 새 메시지 추가
				const newMessage: Message = {
					id: messageData.message_id.toString(),
					type: messageData.user?.user_id === userId ? 'sent' : 'received',
					content: messageData.message,
					time: new Date(messageData.created_at).toLocaleTimeString('ko-KR', {
						hour: '2-digit',
						minute: '2-digit',
					}),
					timestamp: messageData.created_at,
					isRead: false,
				};

				setMessages((prev) => {
					// 중복 체크
					if (prev.some((m) => m.id === newMessage.id)) {
						return prev;
					}
					return [...prev, newMessage].sort((a, b) => a.timestamp - b.timestamp);
				});

				// 받은 메시지만 토스트 표시 (내가 보낸 메시지는 제외)
				if (newMessage.type === 'received') {
					// 스크롤이 아래에 있으면 자동 스크롤, 위에 있으면 토스트 표시
					if (!isUserScrolling) {
						setTimeout(() => {
							messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
						}, 100);
					} else {
						// 토스트 표시
						setNewMessageToast({
							id: newMessage.id,
							name: messageData.user?.nickname || patientName,
							content: newMessage.content,
						});
					}
				}
			} catch (error) {
				console.error('Error handling message event:', error);
			}
		});

		// 읽음 상태 변경 이벤트
		eventSource.addEventListener('read', (event) => {
			try {
				const chatEvent = JSON.parse(event.data);
				const readData = chatEvent.data;

				console.log('Received read event:', readData);

				// 메시지 읽음 상태 업데이트
				setMessages((prev) =>
					prev.map((msg) => (msg.type === 'sent' ? { ...msg, isRead: true } : msg)),
				);
			} catch (error) {
				console.error('Error handling read event:', error);
			}
		});

		// 타이핑 이벤트
		eventSource.addEventListener('typing', (event) => {
			try {
				const chatEvent = JSON.parse(event.data);
				const typingData = chatEvent.data;

				// 상대방이 타이핑 중일 때만 표시 (본인은 제외)
				if (typingData.user_id && typingData.user_id !== userId) {
					setIsTyping(true);

					// 기존 타이머가 있으면 취소
					if (typingTimeoutRef.current) {
						clearTimeout(typingTimeoutRef.current);
					}

					// 3초 후 타이핑 인디케이터 자동 숨김
					typingTimeoutRef.current = setTimeout(() => {
						setIsTyping(false);
					}, 3000);
				}
			} catch (error) {
				console.error('Error handling typing event:', error);
			}
		});

		// 연결 에러
		eventSource.onerror = (error) => {
			console.error('SSE connection error:', error);
			eventSource.close();
		};

		// 컴포넌트 언마운트 시 연결 종료
		return () => {
			console.log('Closing SSE connection');
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
			eventSource.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channelUrl, userId, isUserScrolling]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// 채팅방 진입 시 첫 안읽은 메시지로 스크롤
	useEffect(() => {
		const timer = setTimeout(() => {
			if (firstUnreadRef.current) {
				firstUnreadRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
			} else {
				// 안읽은 메시지 없으면 맨 아래로
				messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
			}
		}, 100);

		return () => clearTimeout(timer);
	}, [channelUrl]); // channelUrl이 바뀔 때만 실행 (채팅방 변경 시)

	// Scroll detection to manage toast
	useEffect(() => {
		const container = messagesContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

			setIsUserScrolling(!isAtBottom);

			// 스크롤 내리면 토스트 제거
			if (isAtBottom && newMessageToast) {
				setNewMessageToast(null);
			}
		};

		container.addEventListener('scroll', handleScroll);
		return () => container.removeEventListener('scroll', handleScroll);
	}, [newMessageToast]);

	const handleToastClick = () => {
		if (!newMessageToast) return;

		// 토스트 클릭 시 맨 아래로 스크롤
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		setNewMessageToast(null);
	};

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setShowMenu(false);
			}
		};

		if (showMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showMenu]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleSend = async () => {
		// 전송 중이거나, 입력이 잠겨있거나, 메시지가 비어있으면 리턴
		if (isSendingRef.current || isInputLocked || !message.trim()) return;

		// 전송 플래그 먼저 설정 (중복 호출 방지)
		isSendingRef.current = true;

		const now = Date.now();

		// 현재 메시지 타임스탬프 먼저 추가 (도배 감지 전에)
		messageTimestamps.current.push(now);

		// 1초 이전 타임스탬프 제거 (슬라이딩 윈도우)
		messageTimestamps.current = messageTimestamps.current.filter((time) => now - time < 1000);

		// 1초 내 메시지 개수 확인
		const recentMessageCount = messageTimestamps.current.length;

		// 도배 방지: 1초 내 5개 이상 메시지 차단
		if (recentMessageCount > 5) {
			// 입력창 잠금
			setIsInputLocked(true);
			setCooldownSeconds(10);
			setLockMessage(`${t('chat.spamWarning')} (10s)`);

			// 1초마다 카운터 업데이트
			const interval = setInterval(() => {
				setCooldownSeconds((prev) => {
					const next = prev - 1;
					if (next > 0) {
						setLockMessage(`${t('chat.spamWarning')} (${next}s)`);
						return next;
					} else {
						clearInterval(interval);
						setIsInputLocked(false);
						setLockMessage('');
						return 0;
					}
				});
			}, 1000);

			// 전송 플래그 해제
			isSendingRef.current = false;
			return;
		}

		try {
			// 종료된 채팅이면 먼저 재개방
			if (isClosed) {
				setIsReopening(true);
				// TODO: Call API to reopen channel
				await new Promise((resolve) => setTimeout(resolve, 500));
				setIsReopening(false);
			}

			const newMessage: Message = {
				id: Date.now().toString(),
				type: 'sent',
				content: message.trim(),
				time: new Date().toLocaleTimeString('ko-KR', {
					hour: '2-digit',
					minute: '2-digit',
				}),
				timestamp: Date.now(),
			};

			setMessages([...messages, newMessage]);
			setMessage('');

			// Reset textarea height
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto';
			}
		} finally {
			// 전송 플래그 해제
			isSendingRef.current = false;
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
		// Auto-resize
		const textarea = e.target;
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
	};

	const formatDate = (date: string) => {
		const today = new Date();
		const messageDate = new Date(date);
		if (today.toDateString() === messageDate.toDateString()) {
			return t('chat.today');
		}
		return date;
	};

	// 버튼 위치를 기반으로 윈도우 위치 계산 (ChatWindow와 동일)
	const buttonSize = 84;
	const windowWidth = 414;
	const windowHeight = 600;
	const gap = 8;

	let bottom = buttonPosition ? buttonPosition.y + buttonSize + gap : 120;
	let right = buttonPosition ? buttonPosition.x : 32;

	if (typeof window !== 'undefined' && buttonPosition) {
		const windowTop = bottom + windowHeight;

		if (windowTop > window.innerHeight - 10) {
			bottom = buttonPosition.y;
			right = buttonPosition.x - windowWidth - gap;

			const leftEdge = window.innerWidth - right - windowWidth;
			if (right < 10 || leftEdge < 10) {
				right = buttonPosition.x + buttonSize + gap;

				if (right + windowWidth > window.innerWidth - 10) {
					right = window.innerWidth - windowWidth - 10;
				}
			}

			if (bottom + windowHeight > window.innerHeight - 10) {
				bottom = window.innerHeight - windowHeight - 10;
			}
		}

		const leftPosition = window.innerWidth - right - windowWidth;
		if (leftPosition < 10) {
			right = window.innerWidth - windowWidth - 10;
		}

		if (right < 10) {
			right = 10;
		}

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
					<div className="flex items-center gap-3">
						{/* Back Button */}
						<button
							onClick={onBack}
							className="w-7 h-7 flex items-center justify-center hover:opacity-70 transition-opacity"
							aria-label="Back"
						>
							<img src={backIcon} alt="Back" className="w-full h-full" />
						</button>

						{/* Profile */}
						<div className="w-7 h-7 relative flex-shrink-0">
							<img src={profileBgIcon} alt="" className="w-full h-full" />
							<img
								src={userIcon}
								alt=""
								className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px]"
							/>
						</div>

						{/* Name */}
						<h2 className="text-text-100 text-18 font-semibold font-pretendard">
							{patientName}
						</h2>

						{/* Closed Badge */}
						{isClosed && (
							<div className="px-2 py-1 bg-badge-2 rounded text-system-caution text-12 font-medium">
								{t('chat.closed')}
							</div>
						)}
					</div>

					<div className="flex items-center gap-2">
						{/* Menu Button - Only show if chat is not closed and onEndChat is provided */}
						{!isClosed && onEndChat && (
							<div className="relative" ref={menuRef}>
								<button
									onClick={() => setShowMenu(!showMenu)}
									className="w-7 h-7 flex items-center justify-center hover:opacity-70 transition-opacity"
									aria-label="메뉴"
								>
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
										<circle cx="10" cy="4" r="1.5" fill="#6E6E6E" />
										<circle cx="10" cy="10" r="1.5" fill="#6E6E6E" />
										<circle cx="10" cy="16" r="1.5" fill="#6E6E6E" />
									</svg>
								</button>

								{/* Dropdown Menu */}
								{showMenu && (
									<div
										className="absolute right-0 top-[calc(100%+4px)] bg-white rounded-lg shadow-lg border border-stroke-input overflow-hidden z-50"
										style={{ minWidth: '160px' }}
									>
										<button
											onClick={() => {
												setShowMenu(false);
												onEndChat();
											}}
											className="w-full px-4 py-3 text-left hover:bg-bg-gray transition-colors flex items-center gap-2"
										>
											<img src={logoutIcon} alt="" className="w-6 h-6" />
											<span className="text-14 font-medium font-pretendard text-system-error">
												{t('chat.endSession')}
											</span>
										</button>
									</div>
								)}
							</div>
						)}

						<button
							onClick={onClose}
							className="w-7 h-7 flex items-center justify-center hover:opacity-70 transition-opacity"
							aria-label="Close chat"
						>
							<img src={closeIcon} alt="Close" className="w-full h-full" />
						</button>
					</div>
				</div>
			</div>

			{/* Messages Area */}
			<div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-5 py-4">
				{messages.map((msg, index) => {
					const showDate = index === 0 || messages[index - 1].date !== msg.date;
					const isFirstUnread =
						msg.unread && (index === 0 || !messages[index - 1].unread);

					return (
						<div key={msg.id}>
							{/* Date Separator */}
							{showDate && msg.date && (
								<div className="flex items-center justify-center my-4">
									<div className="px-3 py-1 bg-bg-gray rounded-full text-text-70 text-12 font-normal">
										{formatDate(msg.date)}
									</div>
								</div>
							)}

							{/* New Message Separator */}
							{isFirstUnread && (
								<div
									style={{
										alignSelf: 'stretch',
										height: '1px',
										background: '#00A0D2',
										position: 'relative',
										marginTop: '0.5rem',
										marginBottom: '0.5rem',
									}}
								>
									<div
										style={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											background: 'white',
											paddingLeft: '0.5rem',
											paddingRight: '0.5rem',
											color: '#00A0D2',
											fontSize: '0.75rem',
											fontWeight: '600',
											fontFamily: 'Pretendard',
										}}
									>
										{t('chat.newMessage')}
									</div>
								</div>
							)}

							{/* Message */}
							{msg.type === 'system' ? (
								<div className="flex items-center justify-center my-2">
									<div className="px-3 py-1 bg-bg-gray rounded text-text-70 text-12 font-normal">
										{msg.systemMessageType
											? t(`chat.systemMessage.${msg.systemMessageType}`)
											: msg.content}
									</div>
								</div>
							) : (
								<div
									ref={
										isFirstUnread && msg.type === 'received'
											? firstUnreadRef
											: null
									}
									style={{
										width: '100%',
										flexDirection: 'column',
										justifyContent: 'flex-start',
										alignItems: msg.type === 'sent' ? 'flex-end' : 'flex-start',
										gap: 8,
										display: 'inline-flex',
										marginBottom: '0.75rem',
									}}
								>
									<div
										style={{
											padding: 16,
											background: msg.type === 'sent' ? '#00A0D2' : '#F6F6F6',
											overflow: 'hidden',
											borderTopLeftRadius: 15,
											borderTopRightRadius: msg.type === 'sent' ? 15 : 15,
											borderBottomLeftRadius: msg.type === 'sent' ? 15 : 15,
											borderBottomRightRadius: msg.type === 'sent' ? 0 : 15,
											justifyContent: 'flex-start',
											alignItems: 'center',
											gap: 10,
											display: 'inline-flex',
											maxWidth: '70%',
										}}
									>
										<div
											style={{
												color: msg.type === 'sent' ? 'white' : '#1F1F1F',
												fontSize: 16,
												fontFamily: 'Pretendard',
												fontWeight: '400',
												wordWrap: 'break-word',
											}}
										>
											{msg.content}
										</div>
									</div>
									<div
										style={{
											justifyContent: 'flex-start',
											alignItems: 'center',
											gap: 8,
											display: 'inline-flex',
										}}
									>
										{msg.type === 'sent' && msg.isRead && (
											<img
												src={chatReadIcon}
												alt="read"
												style={{
													width: '0.375rem',
													height: '0.25rem',
												}}
											/>
										)}
										<div
											style={{
												color: '#1F1F1F',
												fontSize: 12,
												fontFamily: 'Pretendard',
												fontWeight: '500',
												textTransform: 'capitalize',
												wordWrap: 'break-word',
											}}
										>
											{msg.time}
										</div>
									</div>
								</div>
							)}
						</div>
					);
				})}

				{/* Typing Indicator */}
				{isTyping && (
					<div
						style={{
							alignSelf: 'stretch',
							paddingRight: '1.875rem',
							paddingBottom: '0.5rem',
							display: 'flex',
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
						}}
					>
						<div
							style={{
								padding: '0.625rem 0.875rem',
								background: '#F6F6F6',
								borderRadius: '0.625rem',
								display: 'inline-flex',
								gap: '0.25rem',
								alignItems: 'center',
							}}
						>
							<div
								className="typing-dot"
								style={{
									width: '0.375rem',
									height: '0.375rem',
									background: '#9E9E9E',
									borderRadius: '50%',
									animation: 'typing-bounce 1.4s infinite ease-in-out',
									animationDelay: '0s',
								}}
							/>
							<div
								className="typing-dot"
								style={{
									width: '0.375rem',
									height: '0.375rem',
									background: '#9E9E9E',
									borderRadius: '50%',
									animation: 'typing-bounce 1.4s infinite ease-in-out',
									animationDelay: '0.2s',
								}}
							/>
							<div
								className="typing-dot"
								style={{
									width: '0.375rem',
									height: '0.375rem',
									background: '#9E9E9E',
									borderRadius: '50%',
									animation: 'typing-bounce 1.4s infinite ease-in-out',
									animationDelay: '0.4s',
								}}
							/>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			<style>
				{`
					@keyframes typing-bounce {
						0%, 60%, 100% {
							transform: translateY(0);
							opacity: 0.7;
						}
						30% {
							transform: translateY(-0.375rem);
							opacity: 1;
						}
					}
					@keyframes slideUp {
						from {
							transform: translateY(20px);
							opacity: 0;
						}
						to {
							transform: translateY(0);
							opacity: 1;
						}
					}
				`}
			</style>

			{/* 새 메시지 토스트 */}
			{newMessageToast && (
				<div
					onClick={handleToastClick}
					style={{
						position: 'absolute',
						bottom: '90px',
						left: '20px',
						right: '20px',
						background: 'white',
						borderRadius: '12px',
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
						padding: '12px',
						display: 'flex',
						alignItems: 'center',
						gap: '12px',
						cursor: 'pointer',
						zIndex: 30,
						animation: 'slideUp 0.3s ease-out',
					}}
				>
					<div
						style={{
							width: '40px',
							height: '40px',
							position: 'relative',
							flexShrink: 0,
						}}
					>
						<img src={profileBgIcon} alt="" className="w-full h-full" />
						<img
							src={userIcon}
							alt=""
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px]"
						/>
					</div>
					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							gap: '4px',
							minWidth: 0,
						}}
					>
						<div
							style={{
								color: '#1F1F1F',
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'Pretendard',
							}}
						>
							{newMessageToast.name}
						</div>
						<div
							style={{
								color: '#6E6E6E',
								fontSize: '14px',
								fontWeight: '400',
								fontFamily: 'Pretendard',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{newMessageToast.content}
						</div>
					</div>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path
							d="M10 4L10 16M10 16L15 11M10 16L5 11"
							stroke="#00A0D2"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			)}

			{/* Input Area */}
			<div
				style={{
					width: '100%',
					paddingLeft: 20,
					paddingRight: 20,
					paddingTop: 16,
					paddingBottom: 16,
					background: 'white',
					flexDirection: 'column',
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					display: 'inline-flex',
				}}
			>
				<div
					style={{
						alignSelf: 'stretch',
						paddingLeft: 16,
						paddingRight: 16,
						paddingTop: 10,
						paddingBottom: 10,
						background: 'white',
						borderRadius: 8,
						outline: '1px #E0E0E0 solid',
						outlineOffset: '-1px',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						display: 'inline-flex',
					}}
				>
					<div
						style={{
							flex: '1 1 0',
							alignSelf: 'stretch',
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
							gap: 8,
							display: 'flex',
						}}
					>
						<div
							style={{
								flex: '1 1 0',
								paddingTop: 2,
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
								gap: 10,
								display: 'flex',
							}}
						>
							<textarea
								ref={textareaRef}
								value={message}
								onChange={handleTextareaChange}
								onKeyDown={handleKeyDown}
								placeholder={
									isInputLocked
										? lockMessage
										: isClosed
											? t('chat.closedPlaceholder')
											: isReopening
												? t('chat.reopening')
												: t('chat.enterMessage')
								}
								disabled={isReopening || isInputLocked}
								rows={1}
								style={{
									flex: '1 1 0',
									color: '#1F1F1F',
									fontSize: 16,
									fontFamily: 'Pretendard',
									fontWeight: '400',
									wordWrap: 'break-word',
									border: 'none',
									outline: 'none',
									resize: 'none',
									background: 'transparent',
									minHeight: '24px',
									maxHeight: '160px',
								}}
								className="placeholder:text-text-30"
							/>
						</div>
						<div
							style={{
								justifyContent: 'flex-start',
								alignItems: 'center',
								gap: 4,
								display: 'flex',
							}}
						>
							<button
								onClick={handleSend}
								disabled={!message.trim() || isReopening || isInputLocked}
								style={{
									width: 24,
									height: 24,
									position: 'relative',
									overflow: 'hidden',
									border: 'none',
									background: 'transparent',
									cursor:
										message.trim() && !isReopening && !isInputLocked
											? 'pointer'
											: 'not-allowed',
									padding: 0,
								}}
							>
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
										stroke={
											message.trim() && !isReopening && !isInputLocked
												? '#00A0D2'
												: '#ACACAC'
										}
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Closed Channel Warning (if closed) */}
			{isClosed && (
				<div className="bg-badge-2 border-t border-system-caution px-4 py-2 flex items-center gap-2">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path
							d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
							stroke="#FF5F06"
							strokeWidth="2"
						/>
						<path d="M10 6V10" stroke="#FF5F06" strokeWidth="2" strokeLinecap="round" />
						<path
							d="M10 14H10.01"
							stroke="#FF5F06"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
					<div className="flex-1 text-system-caution text-14 font-normal">
						{t('chat.closedMessage')}
						<span className="font-semibold"> {t('chat.willReopenOnSend')}</span>
					</div>
				</div>
			)}
		</div>
	);
}

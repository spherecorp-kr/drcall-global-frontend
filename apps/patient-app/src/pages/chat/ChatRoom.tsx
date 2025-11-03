import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getChatService, authService, type ChatMessage, type ChatChannel } from '@services';
import { formatMessageTime, formatMessageDate, isSystemMessage, isSameDay } from '@services/chatService';

interface DisplayMessage {
  id: string;
  type: 'sent' | 'received' | 'system';
  content: string;
  time: string;
  timestamp: number;
  isRead?: boolean;
  unread?: boolean;
  date?: string; // For date separators
}

interface NewMessageToast {
  id: string;
  name: string;
  content: string;
  profileImage?: string;
}

interface ChatRoomProps {
  channelUrl?: string;
  onClose?: () => void;
}

export default function ChatRoom({ channelUrl: propChannelUrl, onClose }: ChatRoomProps) {
  const navigate = useNavigate();
  const { id: paramChannelUrl } = useParams();
  const channelUrl = propChannelUrl || paramChannelUrl;
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const firstUnreadRef = useRef<HTMLDivElement>(null);
  const [newMessageToast, setNewMessageToast] = useState<NewMessageToast | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const isSendingRef = useRef(false);
  const messageTimestamps = useRef<number[]>([]);
  const [isInputLocked, setIsInputLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Chat state
  const [userId, setUserId] = useState<string>('');
  const [channel, setChannel] = useState<ChatChannel | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);

  // Fetch channel and messages
  useEffect(() => {
    if (!channelUrl) return;

    const fetchData = async () => {
      const chatService = getChatService();

      try {
        // 1. Get current user (with fallback for mock mode)
        let currentUserId = 'patient-1'; // Default mock user ID

        // Only try to get profile if not using mock data
        const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
        if (!useMockData) {
          try {
            const profile = await authService.getProfile();
            currentUserId = `patient-${profile.id}`;
          } catch (authError) {
            // Use fallback user ID
          }
        }
        setUserId(currentUserId);

        // 2. Fetch channel info
        const channelData = await chatService.getChannel(channelUrl);
        setChannel(channelData);

        // 3. Fetch messages
        const messagesData = await chatService.getMessages(channelUrl, 100);
        const sortedMessages = (messagesData.messages || []).sort((a, b) => a.created_at - b.created_at);
        setChatMessages(sortedMessages);

        // 4. Mark as read
        await chatService.markAsRead(channelUrl, currentUserId);
      } catch (error) {
        console.error('Failed to fetch chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelUrl]);

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
        const newMessage: ChatMessage = {
          message_id: messageData.message_id,
          message_type: messageData.message_type,
          message: messageData.message,
          custom_type: messageData.custom_type,
          created_at: messageData.created_at,
          user: messageData.user,
        };

        setChatMessages(prev => {
          // 중복 체크
          if (prev.some(m => m.message_id === newMessage.message_id)) {
            return prev;
          }
          return [...prev, newMessage].sort((a, b) => a.created_at - b.created_at);
        });

        // 스크롤이 아래에 있으면 자동 스크롤
        if (!isUserScrolling) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
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
        setChatMessages(prev =>
          prev.map(msg => ({
            ...msg,
            read_by: msg.read_by
              ? [...new Set([...msg.read_by, readData.user_id])]
              : [readData.user_id]
          }))
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
      eventSource.close();
    };
  }, [channelUrl, userId, isUserScrolling]);

  // Transform ChatMessage[] to DisplayMessage[]
  const messages: DisplayMessage[] = [];
  let lastDate: number | null = null;

  chatMessages.forEach((msg, index) => {
    // Add date separator if needed
    const msgDate = msg.created_at;
    if (lastDate === null || !isSameDay(lastDate, msgDate)) {
      messages.push({
        id: `date-${msgDate}`,
        type: 'system',
        content: '',
        time: '',
        timestamp: msgDate,
        date: formatMessageDate(msgDate),
      });
      lastDate = msgDate;
    }

    // Add message
    const isMyMessage = msg.user?.user_id === userId;

    // Read receipt logic: Check if other member has read this message
    let isRead = false;
    if (isMyMessage && !isSystemMessage(msg)) {
      // Get other member's user_id
      const otherMember = channel?.members?.find(m => m.user_id !== userId);

      // Check if read_by includes the other member
      if (msg.read_by && otherMember) {
        isRead = msg.read_by.includes(otherMember.user_id);
      }
    }

    messages.push({
      id: msg.message_id.toString(),
      type: isSystemMessage(msg) ? 'system' : (isMyMessage ? 'sent' : 'received'),
      content: msg.message,
      time: formatMessageTime(msg.created_at),
      timestamp: msg.created_at,
      isRead,
    });
  });

  // Get other member name
  const otherMember = channel?.members?.find(m => m.user_id !== userId);
  const chatName = otherMember?.nickname || channel?.name || t('chat.unknownUser');
  const profileImage = otherMember?.profile_url || '/assets/icons/chat-profile-default.svg';

  // Check if channel is closed
  const isClosed = channel?.metadata?.status === 'closed';


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
  }, []);

  // 스크롤 감지
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

  // TODO: 실제로는 WebSocket이나 polling으로 새 메시지 받기
  // 새 메시지 도착 시 처리 예시:
  // const handleNewMessage = (newMsg: Message) => {
  //   setMessages(prev => [...prev, newMsg]);
  //   if (isUserScrolling) {
  //     setNewMessageToast({
  //       id: newMsg.id,
  //       name: '김코디',
  //       content: newMsg.content,
  //       profileImage: '/assets/icons/chat-profile-default.svg'
  //     });
  //   } else {
  //     setTimeout(() => {
  //       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  //     }, 100);
  //   }
  // };

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  }, [onClose, navigate]);

  const handleSendMessage = useCallback(async () => {
    if (isSendingRef.current || isInputLocked || !channelUrl || !userId || isClosed) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    // 전송 플래그 먼저 설정 (중복 호출 방지)
    isSendingRef.current = true;

    const now = Date.now();

    // 현재 메시지 타임스탬프 먼저 추가 (도배 감지 전에)
    messageTimestamps.current.push(now);

    // 1초 이전 타임스탬프 제거 (슬라이딩 윈도우)
    messageTimestamps.current = messageTimestamps.current.filter(
      time => now - time < 1000
    );

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
        setCooldownSeconds(prev => {
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
      // Send message to backend
      const chatService = getChatService();
      const newMsg = await chatService.sendMessage(channelUrl, {
        user_id: userId,
        message: trimmedMessage,
      });

      // Add to local state and sort
      setChatMessages(prev => [...prev, newMsg].sort((a, b) => a.created_at - b.created_at));

      // 입력창 비우기
      setMessage('');

      // textarea 높이 초기화
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.value = '';
      }

      // 메시지 전송 후 맨 아래로 스크롤
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Error toast is handled by apiClient interceptor
    } finally {
      // 전송 완료 플래그
      isSendingRef.current = false;
    }
  }, [channelUrl, userId, message, isInputLocked, isClosed, t]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);

    // 높이 자동 조절
    requestAnimationFrame(() => {
      const textarea = e.target;
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 160); // 최대 10rem (160px)
      textarea.style.height = newHeight + 'px';
    });
  }, []);

  const handleToastClick = useCallback(() => {
    if (!newMessageToast) return;

    // 토스트 클릭 시 맨 아래로 스크롤
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setNewMessageToast(null);
  }, [newMessageToast]);

  // 첫 안읽은 메시지 찾기
  const firstUnreadIndex = messages.findIndex(msg => msg.unread);

  // Loading state
  if (loading) {
    return (
      <div style={{ width: '100%', height: '100vh', position: 'relative', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #E0E0E0', borderTop: '4px solid #00A0D2', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ color: '#6E6E6E', fontSize: '0.875rem', fontFamily: 'Pretendard' }}>{t('chat.loading')}</div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div
        style={{
          width: '100%',
          height: '5.625rem',
          paddingTop: '1.75rem',
          paddingBottom: '1rem',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          borderBottom: '1px solid #E0E0E0',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '0.625rem',
          display: 'flex'
        }}
      >
        <div
          style={{
            alignSelf: 'stretch',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <div
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '0.75rem',
              display: 'flex'
            }}
          >
            {/* 뒤로가기 버튼 */}
            <div
              onClick={handleBack}
              style={{
                width: '1.875rem',
                height: '1.875rem',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
            <img src="/assets/icons/btn_back.svg" alt='back' width={30} height={30}/>
            </div>

            {/* 프로필 이미지 */}
            <img
              src={profileImage}
              alt="profile"
              style={{
                width: '2.75rem',
                height: '2.75rem'
              }}
            />

            {/* 이름 */}
            <div
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '0.25rem',
                display: 'flex'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div
                  style={{
                    color: '#1F1F1F',
                    fontSize: '1.125rem',
                    fontFamily: 'Pretendard',
                    fontWeight: '400',
                    wordWrap: 'break-word'
                  }}
                >
                  {chatName}
                </div>
                {isClosed && (
                  <div
                    style={{
                      padding: '0.125rem 0.5rem',
                      background: '#E0E0E0',
                      borderRadius: '0.25rem',
                      color: '#6E6E6E',
                      fontSize: '0.625rem',
                      fontWeight: '600',
                      fontFamily: 'Pretendard'
                    }}
                  >
                    {t('chat.closed')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 빈 공간 (닫기 버튼 자리) */}
          <div style={{ width: '1.875rem', height: '1.875rem' }} />
        </div>
      </div>

      {/* 메시지 영역 */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          paddingTop: '1.25rem',
          paddingBottom: '6rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          overflowY: 'auto'
        }}
      >
        {messages.map((msg, index) => {
          const isFirstUnread = index === firstUnreadIndex;

          // 날짜 구분선
          if (msg.date) {
            return (
              <div
                key={msg.id}
                style={{
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '0.625rem',
                  display: 'flex'
                }}
              >
                <div
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '0.625rem',
                    display: 'flex'
                  }}
                >
                  <div
                    style={{
                      height: '1rem',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    <div
                      style={{
                        color: '#979797',
                        fontSize: '0.75rem',
                        fontFamily: 'Pretendard',
                        fontWeight: '500',
                        wordWrap: 'break-word'
                      }}
                    >
                      {msg.date}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // 시스템 메시지
          if (msg.type === 'system' && !msg.date) {
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '0.5rem 0'
                }}
              >
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#F6F6F6',
                    borderRadius: '1rem',
                    color: '#6E6E6E',
                    fontSize: '0.875rem',
                    fontFamily: 'Pretendard',
                    fontWeight: '400',
                    textAlign: 'center'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          }

          // 받은 메시지
          if (msg.type === 'received') {
            return (
              <div
                key={msg.id}
                ref={isFirstUnread ? firstUnreadRef : null}
                style={{
                  alignSelf: 'stretch',
                  paddingRight: '1.875rem',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  display: 'flex'
                }}
              >
                {/* 안읽은 메시지 구분선 */}
                {isFirstUnread && (
                  <div
                    style={{
                      alignSelf: 'stretch',
                      height: '1px',
                      background: '#00A0D2',
                      position: 'relative',
                      marginTop: '0.5rem',
                      marginBottom: '0.5rem'
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
                        fontFamily: 'Pretendard'
                      }}
                    >
                      {t('chat.newMessage')}
                    </div>
                  </div>
                )}
                <div
                  style={{
                    alignSelf: 'stretch',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    display: 'flex'
                  }}
                >
                  <div
                    style={{
                      padding: '1rem',
                      background: '#F6F6F6',
                      overflow: 'hidden',
                      borderTopLeftRadius: '0.9375rem',
                      borderTopRightRadius: '0.9375rem',
                      borderBottomRightRadius: '0.9375rem',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '0.625rem',
                      display: 'inline-flex'
                    }}
                  >
                    <div
                      style={{
                        color: '#1F1F1F',
                        fontSize: '1rem',
                        fontFamily: 'Pretendard',
                        fontWeight: '400',
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                  <div
                    style={{
                      color: '#1F1F1F',
                      fontSize: '0.75rem',
                      fontFamily: 'Pretendard',
                      fontWeight: '500',
                      wordWrap: 'break-word'
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          }

          // 보낸 메시지
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: 'stretch',
                paddingLeft: '1.875rem',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                gap: '0.625rem',
                display: 'flex'
              }}
            >
              <div
                style={{
                  alignSelf: 'stretch',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                  gap: '0.5rem',
                  display: 'flex'
                }}
              >
                <div
                  style={{
                    padding: '1rem',
                    background: '#00A0D2',
                    overflow: 'hidden',
                    borderTopLeftRadius: '0.9375rem',
                    borderTopRightRadius: '0.9375rem',
                    borderBottomLeftRadius: '0.9375rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '0.625rem',
                    display: 'inline-flex'
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontFamily: 'Pretendard',
                      fontWeight: '400',
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
                <div
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '0.5rem',
                    display: 'flex'
                  }}
                >
                  {msg.isRead && (
                    <img
                      src="/assets/icons/chat-read.svg"
                      alt="read"
                      style={{
                        width: '0.375rem',
                        height: '0.25rem'
                      }}
                    />
                  )}
                  <div
                    style={{
                      color: '#1F1F1F',
                      fontSize: '0.75rem',
                      fontFamily: 'Pretendard',
                      fontWeight: '500',
                      wordWrap: 'break-word'
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 타이핑 인디케이터 */}
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
                  background: '#979797',
                  borderRadius: '50%',
                  animation: 'typing-bounce 1.4s infinite ease-in-out',
                }}
              />
              <div
                className="typing-dot"
                style={{
                  width: '0.375rem',
                  height: '0.375rem',
                  background: '#979797',
                  borderRadius: '50%',
                  animation: 'typing-bounce 1.4s infinite ease-in-out 0.2s',
                }}
              />
              <div
                className="typing-dot"
                style={{
                  width: '0.375rem',
                  height: '0.375rem',
                  background: '#979797',
                  borderRadius: '50%',
                  animation: 'typing-bounce 1.4s infinite ease-in-out 0.4s',
                }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 타이핑 애니메이션 */}
      <style>{`
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
      `}</style>

      {/* 새 메시지 토스트 */}
      {newMessageToast && (
        <div
          onClick={handleToastClick}
          style={{
            position: 'fixed',
            bottom: '6rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 2.5rem)',
            maxWidth: '25rem',
            background: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            zIndex: 20,
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <img
            src={newMessageToast.profileImage || '/assets/icons/chat-profile-default.svg'}
            alt="profile"
            style={{
              width: '2.5rem',
              height: '2.5rem',
              flexShrink: 0
            }}
          />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              minWidth: 0
            }}
          >
            <div
              style={{
                color: '#1F1F1F',
                fontSize: '0.875rem',
                fontWeight: '600',
                fontFamily: 'Pretendard'
              }}
            >
              {newMessageToast.name}
            </div>
            <div
              style={{
                color: '#6E6E6E',
                fontSize: '0.875rem',
                fontWeight: '400',
                fontFamily: 'Pretendard',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {newMessageToast.content}
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4L10 16M10 16L15 11M10 16L5 11" stroke="#00A0D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* 입력 영역 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          padding: '1.25rem',
          background: 'white',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          display: 'flex',
          gap: '0.5rem'
        }}
      >
        {/* 종료된 대화 안내 */}
        {isClosed && (
          <div
            style={{
              alignSelf: 'stretch',
              paddingLeft: '0.75rem',
              paddingRight: '0.75rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              background: '#FFF3E0',
              borderRadius: '0.5rem',
              border: '1px solid #FFB74D',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#FF9800" strokeWidth="2"/>
              <path d="M8 4V8M8 11H8.01" stroke="#FF9800" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div
              style={{
                color: '#FF9800',
                fontSize: '0.875rem',
                fontFamily: 'Pretendard',
                fontWeight: '600'
              }}
            >
              {t('chat.closedMessage')}
            </div>
          </div>
        )}

        {/* 잠금 안내 메시지 */}
        {isInputLocked && lockMessage && (
          <div
            style={{
              alignSelf: 'stretch',
              paddingLeft: '0.75rem',
              paddingRight: '0.75rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              background: '#E6F7FC',
              borderRadius: '0.5rem',
              border: '1px solid #00A0D2',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#00A0D2" strokeWidth="2"/>
              <path d="M8 4V8L10.5 10.5" stroke="#00A0D2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div
              style={{
                color: '#00A0D2',
                fontSize: '0.875rem',
                fontFamily: 'Pretendard',
                fontWeight: '600'
              }}
            >
              {lockMessage}
            </div>
          </div>
        )}

        <div
          style={{
            alignSelf: 'stretch',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '0.625rem',
            paddingBottom: '0.625rem',
            background: 'white',
            borderRadius: '0.5625rem',
            border: `1px solid ${(isInputLocked || isClosed) ? '#E0E0E0' : '#E0E0E0'}`,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            display: 'flex',
            opacity: (isInputLocked || isClosed) ? 0.6 : 1
          }}
        >
          <div
            style={{
              flex: '1 1 0',
              alignSelf: 'stretch',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '0.5rem',
              display: 'flex'
            }}
          >
            <div
              style={{
                flex: '1 1 0',
                paddingTop: '0.125rem',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '0.625rem',
                display: 'flex'
              }}
            >
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!e.nativeEvent.isComposing) {
                      handleSendMessage();
                    }
                  }
                }}
                placeholder={isClosed ? t('chat.closedPlaceholder') : (isInputLocked ? t('chat.waitPlease') : t('chat.enterMessage'))}
                rows={1}
                disabled={isInputLocked || isClosed}
                style={{
                  flex: '1 1 0',
                  color: message ? '#1F1F1F' : '#C1C1C1',
                  fontSize: '1rem',
                  fontFamily: 'Pretendard',
                  fontWeight: '400',
                  wordWrap: 'break-word',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  resize: 'none',
                  minHeight: '1.5rem',
                  maxHeight: '10rem',
                  overflowY: 'auto'
                }}
              />
            </div>
            <div
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '0.25rem',
                display: 'flex'
              }}
            >
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isInputLocked || isClosed}
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'transparent',
                  border: 'none',
                  cursor: (message.trim() && !isInputLocked && !isClosed) ? 'pointer' : 'default',
                  padding: 0
                }}
              >
                <img
                  src={(message.trim() && !isInputLocked && !isClosed) ? '/assets/icons/send-active.svg' : '/assets/icons/send-disabled.svg'}
                  alt="send"
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 토스트 애니메이션 CSS */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

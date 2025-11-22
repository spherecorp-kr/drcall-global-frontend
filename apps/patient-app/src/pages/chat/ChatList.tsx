import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@layouts/MainLayout';
import EmptyState from '@ui/display/EmptyState';
import ChatRoom from './ChatRoom';
import { getChatService, authService, type ChatChannel } from '@services';
import { formatMessageTime, formatMessageDate, isChannelClosed } from '@services/chatService';
import { sortByTimestampNewest } from '@utils/sort';

export default function ChatList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  // Fetch current user and chat channels
  useEffect(() => {
    const chatService = getChatService();

    const fetchChannels = async () => {
      try {
        // 1. Get current user profile (with fallback for mock mode)
        let currentUserId = 'patient-1'; // Default mock user ID

        // Only try to get profile if not using mock data
        const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
        if (!useMockData) {
          try {
            const profile = await authService.getProfile();
            currentUserId = `patient-${profile.id}`;
          } catch {
            // Use fallback user ID
          }
        }
        setUserId(currentUserId);

        // 2. Fetch chat channels
        const response = await chatService.listUserChannels(currentUserId, 50);
        // Filter out channels without proper member data to avoid showing "Unknown User"
        const validChannels = (response.channels || []).filter(channel => {
          const otherMember = channel.members?.find(m => m.user_id !== currentUserId);
          return otherMember?.nickname || channel.name;
        });
        setChatChannels(validChannels);
      } catch (error) {
        console.error('Failed to fetch chat channels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // Transform ChatChannel to display format and sort by last message time
  const chatRooms = sortByTimestampNewest(
    chatChannels.map((channel) => {
      // Get other member (not current user)
      const otherMember = channel.members?.find(m => m.user_id !== userId);
      const lastMsg = channel.last_message;
      const lastMsgTime = lastMsg?.created_at || channel.created_at || 0;

      return {
        id: channel.channel_url,
        name: otherMember?.nickname || channel.name || t('chat.unknownUser'),
        lastMessage: lastMsg?.message || '',
        time: lastMsgTime
          ? (Date.now() - lastMsgTime < 86400000 // < 24h
              ? formatMessageTime(lastMsgTime)
              : formatMessageDate(lastMsgTime))
          : '',
        timestamp: lastMsgTime,
        unreadCount: channel.unread_message_count || 0,
        profileImage: otherMember?.profile_url,
        isClosed: isChannelClosed(channel),
      };
    }),
    (item) => item.timestamp
  );


  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleChatClick = (chatId: string) => {
    setSelectedChannelId(chatId);
  };

  // 검색어로 필터링
  const filteredChatRooms = chatRooms.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <MainLayout
      title={t('chat.title')}
      onBack={handleBack}
      onClose={handleClose}
      fullWidth
      contentClassName=""
    >
      <div
        style={{
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* 검색 입력 */}
        <div
          style={{
            position: 'relative',
            width: '100%'
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('chat.search')}
            style={{
              width: '100%',
              height: '2.5rem',
              paddingLeft: '1rem',
              paddingRight: '3rem',
              background: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #E0E0E0',
              color: '#1F1F1F',
              fontSize: '1rem',
              fontWeight: '400',
              fontFamily: 'Pretendard',
              outline: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <img src='/assets/icons/btn_search.svg' alt='search' width={28} height={28}/>
          </div>
        </div>

        {/* 채팅 목록 */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #E0E0E0', borderTop: '4px solid #00A0D2', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
            <div style={{ color: '#6E6E6E', fontSize: '0.875rem', fontFamily: 'Pretendard' }}>{t('chat.loading')}</div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : filteredChatRooms.length === 0 ? (
          <EmptyState
            icon={
              <img
                src="/assets/icons/search-empty-state.svg"
                alt={searchQuery ? t('chat.noSearchResults') : t('chat.noChats')}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            }
            message={searchQuery ? t('chat.noSearchResults') : t('chat.noChats')}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {filteredChatRooms.map((chat, index) => (
            <div key={chat.id}>
              <div
                onClick={() => handleChatClick(chat.id)}
                style={{
                  paddingTop: '0.625rem',
                  paddingBottom: '0.625rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  cursor: 'pointer'
                }}
              >
                {/* 프로필 이미지 */}
                <div
                  style={{
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={chat.profileImage || '/assets/icons/chat-profile-default.svg'}
                    alt="profile"
                    style={{
                      width: '2.5rem',
                      height: '2.5rem'
                    }}
                  />
                  {chat.unreadCount > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        minWidth: '1.125rem',
                        height: '1.125rem',
                        paddingLeft: '0.25rem',
                        paddingRight: '0.25rem',
                        background: '#00A0D2',
                        borderRadius: '0.5625rem',
                        border: '2px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div
                        style={{
                          color: 'white',
                          fontSize: '0.625rem',
                          fontWeight: '700',
                          fontFamily: 'Pretendard',
                          lineHeight: '1'
                        }}
                      >
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </div>
                    </div>
                  )}
                </div>

                {/* 채팅 내용 */}
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <div
                      style={{
                        color: '#1F1F1F',
                        fontSize: '1rem',
                        fontWeight: '400',
                        fontFamily: 'Pretendard'
                      }}
                    >
                      {chat.name}
                    </div>
                    {chat.isClosed && (
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
                    {chat.lastMessage}
                  </div>
                </div>

                {/* 시간 */}
                <div
                  style={{
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      color: '#979797',
                      fontSize: '0.75rem',
                      fontWeight: '400',
                      fontFamily: 'Pretendard',
                      lineHeight: '0.9rem'
                    }}
                  >
                    {chat.time}
                  </div>
                </div>
              </div>

              {/* 구분선 */}
              {index < filteredChatRooms.length - 1 && (
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    background: '#E0E0E0'
                  }}
                />
              )}
            </div>
          ))}
          </div>
        )}
      </div>
    </MainLayout>

    {/* Chat Room Modal */}
    {selectedChannelId && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background: 'white',
        }}
      >
        <ChatRoom channelUrl={selectedChannelId} onClose={() => setSelectedChannelId(null)} />
      </div>
    )}
  </>
  );
}

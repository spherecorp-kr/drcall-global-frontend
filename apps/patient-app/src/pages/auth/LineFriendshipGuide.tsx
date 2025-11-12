import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * LINE Friendship Guide Page
 *
 * Shown when user tries to register but hasn't added LINE official account as friend
 * Provides deep link to add friend and retry button
 */
export const LineFriendshipGuide: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get error info from navigation state (passed from registration page)
  const friendshipUrl = location.state?.friendshipUrl || '';
  const lineId = location.state?.lineId || '';
  const message = location.state?.message || 'LINE 공식계정 친구추가가 필요합니다';

  const handleAddFriend = () => {
    // Open LINE app to add friend
    if (friendshipUrl) {
      window.location.href = friendshipUrl;
    } else {
      console.error('Friendship URL not provided');
    }
  };

  const handleRetry = () => {
    // Go back to registration page to retry
    navigate('/auth/register', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        {/* LINE Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.477 2 2 5.84 2 10.615c0 4.12 3.663 7.575 8.616 8.486.336.072.793.22.909.505.104.257.068.66.034.92l-.148.88c-.045.263-.208 1.028.9.56 1.11-.467 5.98-3.52 8.16-6.026C21.694 13.9 22 12.314 22 10.615 22 5.84 17.523 2 12 2zm-3.41 11.508h-2.33a.41.41 0 01-.41-.41V8.902c0-.227.184-.41.41-.41s.41.183.41.41v3.787h1.92c.226 0 .41.184.41.41s-.184.41-.41.41zm1.64-.41a.41.41 0 01-.82 0V8.902a.41.41 0 01.82 0v4.196zm3.69 0a.41.41 0 01-.41.41c-.15 0-.282-.082-.354-.204l-2.31-3.14v2.934a.41.41 0 01-.82 0V8.902c0-.226.184-.41.41-.41.15 0 .282.082.354.204l2.31 3.14V8.902c0-.227.184-.41.41-.41s.41.183.41.41v4.196zm3.69 0c0 .226-.184.41-.41.41h-2.33a.41.41 0 01-.41-.41V8.902c0-.227.184-.41.41-.41h2.33c.226 0 .41.183.41.41s-.184.41-.41.41h-1.92v1.025h1.92c.226 0 .41.183.41.41s-.184.41-.41.41h-1.92v1.025h1.92c.226 0 .41.184.41.41z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          친구추가가 필요합니다
        </h1>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">{message}</p>

        {/* LINE ID */}
        {lineId && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-500 mb-1">LINE 공식계정</p>
            <p className="text-lg font-semibold text-gray-900">{lineId}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              1
            </span>
            <p className="text-gray-700 pt-0.5">아래 버튼을 눌러 친구추가를 완료해주세요</p>
          </div>
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              2
            </span>
            <p className="text-gray-700 pt-0.5">친구추가 후 다시 시도 버튼을 눌러주세요</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAddFriend}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.477 2 2 5.84 2 10.615c0 4.12 3.663 7.575 8.616 8.486.336.072.793.22.909.505.104.257.068.66.034.92l-.148.88c-.045.263-.208 1.028.9.56 1.11-.467 5.98-3.52 8.16-6.026C21.694 13.9 22 12.314 22 10.615 22 5.84 17.523 2 12 2z" />
            </svg>
            친구추가 하기
          </button>

          <button
            onClick={handleRetry}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-sm mt-6">
        친구추가는 서비스 이용을 위해 필수입니다
      </p>
    </div>
  );
};

export default LineFriendshipGuide;

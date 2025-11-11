import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@layouts/MainLayout';
import useModalScrollLock from '@hooks/useModalScrollLock';

interface ImageViewerModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

/**
 * 이미지 뷰어 모달
 * - 전체 화면 모달 형태
 * - 좌우 화살표로 이미지 탐색
 * - 경계에서는 화살표 숨김
 * - 상단에 "현재/전체" 인디케이터 표시
 * - 우측 상단 닫기 버튼
 */
export default function ImageViewerModal({
  isOpen,
  images,
  initialIndex = 0,
  onClose
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // 모달 오픈 동안 배경 스크롤 차단
  useModalScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0)));
    }
  }, [isOpen, initialIndex, images.length]);

  const hasPrev = useMemo(() => currentIndex > 0, [currentIndex]);
  const hasNext = useMemo(() => currentIndex < images.length - 1, [currentIndex, images.length]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
      }}
    >
      <MainLayout
        headerBackground='white'
        title=""
        onClose={onClose}
        fullWidth
      >
        {/* 상단 인디케이터 */}
        {images.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '5px 24px',
              borderRadius: 100,
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: 18,
              zIndex: 2,
              pointerEvents: 'none'
            }}
          >
            {`${currentIndex + 1} / ${images.length}`}
          </div>
        )}

        <div
          style={{
            position: 'relative',
            backgroundColor: 'white',
            height: 'calc(100vh - 5.625rem)', // 헤더 영역 제외
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* 이미지 영역 */}
          {images.length > 0 && (
            <img
              src={images[currentIndex]}
              alt={`image-${currentIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          )}

          {/* 좌측 화살표 (처음이면 숨김) */}
          {hasPrev && (
            <button
              aria-label="previous-image"
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: 22,
                border: '1px solid #E0E0E0',
                background: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <img src="/assets/icons/arrow-left.svg" alt="prev" style={{ width: 24, height: 24 }} />
            </button>
          )}

          {/* 우측 화살표 (마지막이면 숨김) */}
          {hasNext && (
            <button
              aria-label="next-image"
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1))}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: 22,
                border: '1px solid #E0E0E0',
                background: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <img src="/assets/icons/arrow-right.svg" alt="next" style={{ width: 24, height: 24 }} />
            </button>
          )}
        </div>
      </MainLayout>
    </div>
  );
}



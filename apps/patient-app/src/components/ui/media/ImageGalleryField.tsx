import { useTranslation } from 'react-i18next';

interface ImageGalleryFieldProps {
  label?: string;
  images: string[];
  onImageAdd?: () => void;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove?: (index: number) => void;
  maxImages?: number;
  readOnly?: boolean;
  icon?: string;
  showCount?: boolean;
  noPadding?: boolean;
}

/**
 * 이미지 갤러리 필드 컴포넌트
 * - 증상 이미지 표시 및 업로드
 * - readOnly 모드에서는 추가/삭제 버튼 숨김
 */
export default function ImageGalleryField({
  label,
  images,
  onImageAdd,
  onImageUpload,
  onImageRemove,
  maxImages = 10,
  readOnly = false,
  icon,
  showCount = true,
  noPadding = false
}: ImageGalleryFieldProps) {
  const { t } = useTranslation();
  if (noPadding) {
    // 컨텐츠만 렌더링 (라벨/아이콘 없음)
    return (
      <div style={{ minWidth: 0, width: '100%' }}>
        {/* 이미지 갤러리 */}
        <div
          style={{
            display: 'flex',
            gap: '0.625rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: '0.3125rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            width: '100%',
            scrollSnapType: 'x proximity'
          }}
          className="hide-scrollbar"
        >
          {/* Add Image Button */}
          {!readOnly && (onImageAdd || onImageUpload) && (
            <>
              {onImageUpload ? (
                <label
                  style={{
                    width: '5rem',
                    height: '5rem',
                    flexShrink: 0,
                    background: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #D9D9D9',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    padding: 0,
                    scrollSnapAlign: 'start'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImageUpload}
                    style={{ display: 'none' }}
                  />
                  <img
                    src="/assets/icons/perm_media.svg"
                    alt="이미지 추가"
                    style={{ width: '1.5rem', height: '1.5rem' }}
                  />
                </label>
              ) : (
                <button
                  onClick={onImageAdd}
                  style={{
                    width: '5rem',
                    height: '5rem',
                    flexShrink: 0,
                    background: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #D9D9D9',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    padding: 0,
                    scrollSnapAlign: 'start'
                  }}
                >
                  <img
                    src="/assets/icons/perm_media.svg"
                    alt="이미지 추가"
                    style={{ width: '1.5rem', height: '1.5rem' }}
                  />
                </button>
              )}
            </>
          )}

          {/* Existing Images */}
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                width: '5rem',
                height: '5rem',
                flexShrink: 0,
                scrollSnapAlign: 'start'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#F0F0F0',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: '1px solid #D9D9D9'
                }}
              >
                <img
                  src={image}
                  alt={`이미지 ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Delete button - only show in edit mode */}
              {!readOnly && onImageRemove && (
                <button
                  onClick={() => onImageRemove(index)}
                  style={{
                    position: 'absolute',
                    top: '-0.375rem',
                    right: '-0.375rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    padding: 0,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src="/assets/icons/btn_img_delete.svg"
                    alt="삭제"
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Image count indicator for edit mode */}
        {!readOnly && showCount && (
          <div
            style={{
              color: '#8A8A8A',
              fontSize: '0.75rem',
              fontWeight: '400',
              marginTop: '0.5rem'
            }}
          >
            {t('appointment.imageAttachment', { count: images.length, max: maxImages })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem'
      }}
    >
      {icon && (
        <img
          src={icon}
          alt=""
          style={{
            width: '1.375rem',
            height: '1.375rem',
            marginTop: '0.125rem'
          }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}
        >
          {label && (
            <div
              style={{
                color: '#1F1F1F',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}
            >
              {label}
            </div>
          )}
          {showCount && readOnly && (
            <div
              style={{
                color: '#8A8A8A',
                fontSize: '0.875rem',
                fontWeight: '400'
              }}
            >
              {images.length}개
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.625rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: '0.3125rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            width: '100%',
            scrollSnapType: 'x proximity'
          }}
          className="hide-scrollbar"
        >
          {/* Add Image Button */}
          {!readOnly && (onImageAdd || onImageUpload) && (
            <>
              {onImageUpload ? (
                <label
                  style={{
                    width: '5rem',
                    height: '5rem',
                    flexShrink: 0,
                    background: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #D9D9D9',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    padding: 0,
                    scrollSnapAlign: 'start'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImageUpload}
                    style={{ display: 'none' }}
                  />
                  <img
                    src="/assets/icons/perm_media.svg"
                    alt="이미지 추가"
                    style={{ width: '1.5rem', height: '1.5rem' }}
                  />
                </label>
              ) : (
                <button
                  onClick={onImageAdd}
                  style={{
                    width: '5rem',
                    height: '5rem',
                    flexShrink: 0,
                    background: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #D9D9D9',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    padding: 0,
                    scrollSnapAlign: 'start'
                  }}
                >
                  <img
                    src="/assets/icons/perm_media.svg"
                    alt="이미지 추가"
                    style={{ width: '1.5rem', height: '1.5rem' }}
                  />
                </button>
              )}
            </>
          )}

          {/* Existing Images */}
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                width: '5rem',
                height: '5rem',
                flexShrink: 0,
                scrollSnapAlign: 'start'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#F0F0F0',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: '1px solid #D9D9D9'
                }}
              >
                <img
                  src={image}
                  alt={`이미지 ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Delete button - only show in edit mode */}
              {!readOnly && onImageRemove && (
                <button
                  onClick={() => onImageRemove(index)}
                  style={{
                    position: 'absolute',
                    top: '-0.375rem',
                    right: '-0.375rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    padding: 0,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src="/assets/icons/btn_img_delete.svg"
                    alt="삭제"
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Image count indicator for edit mode */}
        {!readOnly && showCount && (
          <div
            style={{
              color: '#8A8A8A',
              fontSize: '0.75rem',
              fontWeight: '400',
              marginTop: '0.5rem'
            }}
          >
            {t('appointment.imageAttachment', { count: images.length, max: maxImages })}
          </div>
        )}
      </div>
    </div>
  );
}

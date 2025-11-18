import { useEffect, useMemo, useRef, useState } from 'react';
import type { SelectedAddress } from '@/constants/address';
import { finalizePlaceSelection } from '@components/address/utils/select';
import { searchPlacesSuggestions } from '@components/address/utils/places';
import { fetchAddressResults } from '@components/address/utils/address';
import type { AddressSuggestion } from '@components/address/utils/address';
import { useLanguageStore } from '@/stores/languageStore';
import { ADDRESS_SEARCH_MIN_CHARS } from '@/constants/address';
import { createAutocompleteSessionToken, ensurePlacesAvailable, loadGoogleMaps } from '@/utils/gmaps';
import { prefetchPlaceDetails } from '@components/address/utils/prefetch';
import { useTranslation } from 'react-i18next';

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetailAddressReset?: () => void;
  onSelect?: (address: SelectedAddress) => void; // 최종 선택 가능한 객체를 전달하는 콜백
}

export default function AddressSearchModal({ isOpen, onClose, onDetailAddressReset, onSelect }: AddressSearchModalProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AddressSuggestion[]>([]);
  const [isReady, setIsReady] = useState(false);
  const seqRef = useRef(0);
  const sessionRef = useRef<any | null>(null);

  const apiKey = useMemo(() => (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY as string | undefined, []);

  // 모달 오픈 시 Google Maps 로드 및 입력 포커스
  useEffect(() => {
    if (!isOpen) return;
    // zustand의 language만 사용하여 Google Maps를 로드합니다.
    loadGoogleMaps({ apiKey, language }, () => setIsReady(true)); // Google Maps 로드 및 준비 완료 시 상태 업데이트
    const t = setTimeout(() => {
      const el = document.getElementById('address-search-input') as HTMLInputElement | null;
      el?.focus();
      el?.select?.();
    }, 200);
    return () => {
      clearTimeout(t);
      setIsReady(false);
    };
  }, [isOpen, apiKey, language]);

  // 디바운스 + 최소 글자 수 게이트 + Places/폴백
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = (searchQuery || '').trim(); // 검색어 전처리 (공백 제거)
    const hasQuery = trimmed.length >= ADDRESS_SEARCH_MIN_CHARS; // 최소 글자 수 게이트
    const currentSeq = ++seqRef.current; // 동시성 제어를 위한 시퀀스 카운터

    // 디바운스 타이머 설정
    // 검색어 변경 시 250ms 디바운스 적용하여 불필요한 요청 감소
    // 검색어가 없거나 최소 글자 수 미만이면 빈 결과 반환
    // 검색어가 있으면 Places 우선, 불가 시 서버 폴백
    const h = setTimeout(async () => {
      if (!hasQuery) {
        setSearchResults([]);
        return;
      }

      // Places 우선, 불가 시 서버 폴백
      if (isReady && ensurePlacesAvailable()) {
        if (!sessionRef.current) sessionRef.current = createAutocompleteSessionToken();
        const suggestions = await searchPlacesSuggestions(trimmed, { sessionToken: sessionRef.current });
        if (currentSeq !== seqRef.current) return;
        const enriched = await prefetchPlaceDetails(suggestions, { maxCount: 5, concurrency: 2 });
        if (currentSeq !== seqRef.current) return;
        setSearchResults(enriched);
        return;
      }

      // 서버 폴백 (Places 사용 불가 시)
      const fallback = await fetchAddressResults(trimmed);
      if (currentSeq !== seqRef.current) return;
      setSearchResults(fallback);
    }, 250);

    return () => clearTimeout(h);
  }, [searchQuery, isOpen, isReady]);

  // 모달 오픈 동안 배경(문서) 스크롤 완전 차단 및 체이닝 방지
  useEffect(() => {
    if (!isOpen) return;

    // 기존 스크롤 위치, overflow, position, top, width, overscrollBehaviorY 저장
    const scrollY = window.scrollY;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevHtmlObsY = document.documentElement.style.overscrollBehaviorY;

    document.body.style.overflow = 'hidden'; // 배경 스크롤 차단
    document.body.style.position = 'fixed'; // 배경 위치 고정
    document.body.style.top = `-${scrollY}px`; // 배경 위치 조정
    document.body.style.width = '100%'; // 배경 너비 조정
    document.documentElement.style.overscrollBehaviorY = 'none'; // 배경 스크롤 체이닝 방지

    // 모달 닫힐 시 기존 스크롤 위치, overflow, position, top, width, overscrollBehaviorY 복원
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      document.documentElement.style.overscrollBehaviorY = prevHtmlObsY;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // 주소 선택 처리 함수
  const handleSelect = async (s: AddressSuggestion) => {
    const { object } = await finalizePlaceSelection(s, { ensureDetails: true });

    onDetailAddressReset && onDetailAddressReset();
    onSelect && onSelect(object);

    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#FAFAFA',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        position: 'relative'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f1f1f', margin: 0 }}>
          {t('common.addressSearch')}
        </h3>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
          <img src='/assets/icons/btn-끄기.svg' alt='close' width={24} height={24}/>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.6875rem 1.25rem',
          background: 'white',
          borderRadius: '3.125rem',
          border: '1px solid #00A0D2',
          boxShadow: '0px 0px 4px 3px rgba(179.56, 179.56, 179.56, 0.15)'
        }}>
          <img src='/assets/icons/search.svg' alt='search' width={24} height={24}/>
          <input
            id="address-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            placeholder={t('common.enterSearchTerm')}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '1rem',
              fontWeight: '400',
              color: '#1F1F1F'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '9999px',
                background: '#D5D5D5',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              <img src='/assets/icons/btn_txt_delete.svg' alt='close' width={24} height={24}/>
            </button>
          )}
        </div>
      </div>

      {/* Search Results Container */}
      <div style={{ padding: '0 1.25rem', paddingBottom: '40px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{
          background: 'white',
          borderRadius: '0.625rem',
          overflowX: 'hidden',
          overflowY: searchResults.length > 0 ? 'auto' : 'hidden',
          flex: searchResults.length > 0 ? '1 1 auto' : 1,
          minHeight: 0,
          maxHeight: '100%',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}>
        {searchResults.length === 0 && searchQuery && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            paddingTop: '7.5rem',
            paddingBottom: '7.5rem'
          }}>
            <div style={{
              width: '15.625rem',
              height: '12.5rem',
              position: 'relative',
              marginBottom: '1.25rem'
            }}>
              <img
                src="/assets/icons/search-empty-state.svg"
                alt={t('common.noSearchResults')}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <p style={{
              margin: 0,
              textAlign: 'center',
              color: '#979797',
              fontSize: '1rem',
              fontFamily: 'Pretendard',
              fontWeight: '500'
            }}>
              {t('common.noSearchResults')}
            </p>
          </div>
        )}

        {searchResults.length === 0 && !searchQuery && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            paddingTop: '7.5rem',
            paddingBottom: '7.5rem'
          }}>
            <p style={{
              margin: 0,
              textAlign: 'center',
              color: '#979797',
              fontSize: '1rem',
              fontFamily: 'Pretendard',
              fontWeight: '500'
            }}>
              {t('common.searchForAddress')}
            </p>
          </div>
        )}

        {searchResults.filter(s => !!s.postalCode).map((s, index) => {
          const zipCode = s.postalCode || '';
          const fullAddress = s.detail ? `${s.displayAddress} ${s.detail}` : s.displayAddress;

          return (
            <div
              key={index}
              style={{
                padding: '1.25rem',
                borderBottom: '1px solid #E0E0E0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{
                fontSize: '1rem',
                fontWeight: '500',
                color: '#1F1F1F',
                fontFamily: 'Pretendard'
              }}>
                {zipCode}
              </div>
              <div onClick={() => handleSelect(s)} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  flex: 1,
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#1F1F1F',
                  fontFamily: 'Pretendard'
                }}>
                  {fullAddress}
                </div>
                <button
                  onClick={() => handleSelect(s)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    background: 'rgba(0, 160, 210, 0.20)',
                    borderRadius: '0.25rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    textAlign: 'center',
                    color: '#1F1F1F',
                    fontSize: '0.75rem',
                    fontFamily: 'Pretendard',
                    fontWeight: '500'
                  }}>
                    {t('common.select')}
                  </div>
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

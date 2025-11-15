import { useEffect, useMemo, useRef, useState } from 'react';
import type { SelectedAddress } from '@/shared/constants/address';
import { finalizePlaceSelection } from '@/shared/components/address/utils/select';
import { searchPlacesSuggestions } from '@/shared/components/address/utils/places';
import { fetchAddressResults } from '@/shared/components/address/utils/address';
import type { AddressSuggestion } from '@/shared/components/address/utils/address';
import { ADDRESS_SEARCH_MIN_CHARS } from '@/shared/constants/address';
import { createAutocompleteSessionToken, ensurePlacesAvailable, loadGoogleMaps } from '@/shared/utils/gmaps';
import { prefetchPlaceDetails } from '@/shared/components/address/utils/prefetch';

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (address: SelectedAddress) => void;
}

export default function AddressSearchModal({ isOpen, onClose, onSelect }: AddressSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AddressSuggestion[]>([]);
  const [isReady, setIsReady] = useState(false);
  const seqRef = useRef(0);
  const sessionRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const apiKey = useMemo(() => (import.meta.env as { VITE_GOOGLE_MAPS_API_KEY?: string }).VITE_GOOGLE_MAPS_API_KEY, []);

  // 모달 오픈 시 Google Maps 로드 및 입력 포커스
  useEffect(() => {
    if (!isOpen) return;
    loadGoogleMaps({ apiKey, language: 'ko' }, () => setIsReady(true));
    const t = setTimeout(() => {
      const el = document.getElementById('hospital-address-search-input') as HTMLInputElement | null;
      el?.focus();
      el?.select?.();
    }, 200);
    return () => {
      clearTimeout(t);
      setIsReady(false);
    };
  }, [isOpen, apiKey]);

  // 디바운스 + 최소 글자 수 게이트 + Places/폴백
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = (searchQuery || '').trim();
    const hasQuery = trimmed.length >= ADDRESS_SEARCH_MIN_CHARS;
    const currentSeq = ++seqRef.current;

    const h = setTimeout(async () => {
      if (!hasQuery) {
        setSearchResults([]);
        return;
      }

      // Places 우선, 불가 시 서버 폴백
      if (isReady && ensurePlacesAvailable()) {
        if (!sessionRef.current) sessionRef.current = createAutocompleteSessionToken();
        const suggestions = await searchPlacesSuggestions(trimmed, { sessionToken: sessionRef.current || undefined });
        if (currentSeq !== seqRef.current) return;
        const enriched = await prefetchPlaceDetails(suggestions, { maxCount: 5, concurrency: 2 });
        if (currentSeq !== seqRef.current) return;
        setSearchResults(enriched);
        return;
      }

      // 서버 폴백
      const fallback = await fetchAddressResults(trimmed);
      if (currentSeq !== seqRef.current) return;
      setSearchResults(fallback);
    }, 250);

    return () => clearTimeout(h);
  }, [searchQuery, isOpen, isReady]);

  // 주소 선택 처리
  const handleSelect = async (s: AddressSuggestion) => {
    const { object } = await finalizePlaceSelection(s, { ensureDetails: true });
    if (onSelect) {
      onSelect(object);
    }
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stroke-input">
          <h3 className="text-lg font-semibold text-text-100">주소 검색</h3>
          <button
            onClick={onClose}
            className="text-text-40 hover:text-text-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Search Input */}
        <div className="px-6 py-4 border-b border-stroke-input">
          <div className="relative">
            <input
              id="hospital-address-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
              placeholder="주소를 입력해 주세요."
              className="w-full px-4 py-2.5 pr-10 border border-stroke-input rounded focus:outline-none focus:border-primary text-16"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-40 hover:text-text-100"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {searchResults.length === 0 && searchQuery && (
            <div className="text-center py-12 text-text-40">
              검색 결과가 없습니다.
            </div>
          )}

          {searchResults.length === 0 && !searchQuery && (
            <div className="text-center py-12 text-text-40">
              주소를 검색해 주세요.
            </div>
          )}

          {searchResults.filter(s => !!s.postalCode).map((s, index) => {
            const zipCode = s.postalCode || '';
            const fullAddress = s.detail ? `${s.displayAddress} ${s.detail}` : s.displayAddress;

            return (
              <div
                key={index}
                onClick={() => handleSelect(s)}
                className="py-3 border-b border-stroke-input cursor-pointer hover:bg-bg-gray transition-colors"
              >
                <div className="text-14 text-text-70 mb-1">{zipCode}</div>
                <div className="text-16 text-text-100">{fullAddress}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

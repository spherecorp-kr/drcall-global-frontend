import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import { loadGoogleMaps, ensurePlacesAvailable, createAutocompleteSessionToken } from '@/utils/gmaps';
import icClose from '@/shared/assets/icons/ic_close.svg';
import icSearch from '@/shared/assets/icons/ic_search.svg';

export interface SelectedAddress {
	displayAddress: string;
	detail?: string;
	postalCode: string;
	latitude: number | '';
	longitude: number | '';
	placeId?: string;
	countryCode?: string;
}

interface AddressSuggestion {
	displayAddress: string;
	detail: string;
	postalCode: string;
	latitude: number | '';
	longitude: number | '';
	placeId?: string;
	types?: string[];
	countryCode?: string;
}

interface AddressSearchModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect?: (address: SelectedAddress) => void;
}

const ADDRESS_SEARCH_MIN_CHARS = 3;
const ADDRESS_PREFETCH_MAX = 5;

export function AddressSearchModal({ isOpen, onClose, onSelect }: AddressSearchModalProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
	const searchTimeoutRef = useRef<number | null>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	// Google Maps 로드
	useEffect(() => {
		if (isOpen && !ensurePlacesAvailable()) {
			const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
			if (apiKey) {
				loadGoogleMaps(
					{
						apiKey,
						language: 'ko',
						region: 'KR',
					},
					() => {
						sessionToken.current = createAutocompleteSessionToken();
					}
				);
			}
		} else if (isOpen) {
			sessionToken.current = createAutocompleteSessionToken();
		}
	}, [isOpen]);

	// 배경 스크롤 차단
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	}, [isOpen]);

	// Places API로 주소 검색
	const searchPlaces = useCallback(async (query: string) => {
		if (!ensurePlacesAvailable() || !sessionToken.current) {
			return [];
		}

		try {
			const service = new google.maps.places.AutocompleteService();
			const response = await service.getPlacePredictions({
				input: query,
				sessionToken: sessionToken.current,
				componentRestrictions: { country: ['kr', 'th', 'us'] }, // 한국, 태국, 미국 우선
			});

			if (!response || !response.predictions) {
				return [];
			}

			const results: AddressSuggestion[] = response.predictions.map((prediction: google.maps.places.AutocompletePrediction) => ({
				displayAddress: prediction.structured_formatting.main_text || '',
				detail: prediction.structured_formatting.secondary_text || '',
				postalCode: '',
				latitude: '',
				longitude: '',
				placeId: prediction.place_id,
				types: prediction.types,
			}));

			// 상위 5개만 상세 정보 조회
			const detailedResults = await prefetchPlaceDetails(results.slice(0, ADDRESS_PREFETCH_MAX));
			return [...detailedResults, ...results.slice(ADDRESS_PREFETCH_MAX)];
		} catch (error) {
			console.error('주소 검색 실패:', error);
			return [];
		}
	}, []);

	// Place 상세 정보 조회
	const prefetchPlaceDetails = async (suggestions: AddressSuggestion[]): Promise<AddressSuggestion[]> => {
		if (!ensurePlacesAvailable()) {
			return suggestions;
		}

		const service = new google.maps.places.PlacesService(document.createElement('div'));

		const detailedSuggestions = await Promise.all(
			suggestions.map(async (suggestion) => {
				if (!suggestion.placeId) {
					return suggestion;
				}

				try {
					return new Promise<AddressSuggestion>((resolve) => {
						service.getDetails(
							{
								placeId: suggestion.placeId!,
								fields: ['formatted_address', 'address_components', 'geometry'],
							},
							(place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
								if (status === google.maps.places.PlacesServiceStatus.OK && place) {
									const postalCode = place.address_components?.find(
										(component: google.maps.GeocoderAddressComponent) => component.types.includes('postal_code')
									)?.long_name || '';

									const countryCode = place.address_components?.find(
										(component: google.maps.GeocoderAddressComponent) => component.types.includes('country')
									)?.short_name || '';

									resolve({
										...suggestion,
										postalCode,
										latitude: place.geometry?.location?.lat() || '',
										longitude: place.geometry?.location?.lng() || '',
										countryCode,
									});
								} else {
									resolve(suggestion);
								}
							}
						);
					});
				} catch {
					return suggestion;
				}
			})
		);

		return detailedSuggestions;
	};

	// 검색 핸들러 (디바운스 적용)
	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setSelectedIndex(null);

		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		if (query.length < ADDRESS_SEARCH_MIN_CHARS) {
			setSuggestions([]);
			return;
		}

		setLoading(true);
		searchTimeoutRef.current = setTimeout(async () => {
			const results = await searchPlaces(query);
			setSuggestions(results);
			setLoading(false);
		}, 250);
	};

	// 주소 선택
	const handleSelect = (suggestion: AddressSuggestion) => {
		const address: SelectedAddress = {
			displayAddress: suggestion.displayAddress,
			detail: suggestion.detail,
			postalCode: suggestion.postalCode,
			latitude: suggestion.latitude,
			longitude: suggestion.longitude,
			placeId: suggestion.placeId,
			countryCode: suggestion.countryCode,
		};

		onSelect?.(address);
		handleClose();
	};

	// 모달 닫기
	const handleClose = () => {
		setSearchQuery('');
		setSuggestions([]);
		setSelectedIndex(null);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* 배경 오버레이 */}
			<div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />

			{/* 모달 */}
			<div ref={modalRef} className="relative bg-white rounded-lg w-[600px] max-h-[80vh] shadow-xl">
				{/* 헤더 */}
				<div className="flex items-center justify-between px-6 py-4 border-b">
					<h2 className="text-xl font-semibold">주소 검색</h2>
					<button onClick={handleClose} className="p-1">
						<img src={icClose} alt="닫기" className="w-6 h-6" />
					</button>
				</div>

				{/* 검색 영역 */}
				<div className="px-6 py-4 border-b">
					<div className="relative">
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							placeholder="주소를 입력하세요 (예: 서울 강남구)"
							className="pl-10"
							autoFocus
						/>
						<img
							src={icSearch}
							alt="검색"
							className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
						/>
					</div>
				</div>

				{/* 검색 결과 */}
				<div className="overflow-y-auto max-h-[400px]">
					{loading ? (
						<div className="flex justify-center items-center py-8">
							<div className="text-gray-500">검색 중...</div>
						</div>
					) : suggestions.length === 0 ? (
						<div className="flex justify-center items-center py-8">
							<div className="text-gray-500">
								{searchQuery.length >= ADDRESS_SEARCH_MIN_CHARS
									? '검색 결과가 없습니다.'
									: '주소를 입력해 주세요.'}
							</div>
						</div>
					) : (
						<div className="py-2">
							{suggestions.map((suggestion, index) => (
								<div
									key={index}
									className={`px-6 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${
										selectedIndex === index ? 'bg-blue-50' : ''
									}`}
									onClick={() => setSelectedIndex(index)}
									onDoubleClick={() => handleSelect(suggestion)}
								>
									<div className="font-medium text-gray-900">
										{suggestion.displayAddress}
									</div>
									<div className="text-sm text-gray-500 mt-1">
										{suggestion.detail}
									</div>
									{suggestion.postalCode && (
										<div className="text-sm text-gray-400 mt-1">
											우편번호: {suggestion.postalCode}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* 액션 버튼 */}
				{suggestions.length > 0 && selectedIndex !== null && (
					<div className="px-6 py-4 border-t">
						<Button
							variant="primary"
							size="default"
							onClick={() => handleSelect(suggestions[selectedIndex])}
							className="w-full"
						>
							선택
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

export default AddressSearchModal;
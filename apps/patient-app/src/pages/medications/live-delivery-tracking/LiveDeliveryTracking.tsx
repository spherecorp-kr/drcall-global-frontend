import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import PageContainer from '@ui/layout/PageContainer';
import PageSection from '@ui/layout/PageSection';
import { loadGoogle } from '@/lib/googleMapsLoader';

/**
 * 실시간 배송 조회 페이지 (퀵 배송일 때 '실시간 배송 조회' 버튼 클릭 시 이동)
 */
export default function LiveDeliveryTracking() {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const serverMarkersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const overlayCardRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const g = await loadGoogle();
        if (!isMounted || !mapContainerRef.current) return;
        mapInstanceRef.current = new g.maps.Map(mapContainerRef.current, {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: 'greedy',
        });

        // Mock 서버 좌표 2쌍 (예: 방콕 중심 인근)
        const mockLocations = [
          { lat: 13.7563, lng: 100.5018, iconUrl: '/assets/icons/ic_delivery_motorcycle.svg' },
          { lat: 13.7463, lng: 100.5118, iconUrl: '/assets/icons/ic_delivery_truck.svg' },
        ];

        // 커스텀 아이콘 생성 유틸
        const createIcon = (url: string) =>
          ({
            url,
            scaledSize: new g.maps.Size(36, 36),
            anchor: new g.maps.Point(18, 18),
          }) as google.maps.Icon;

        // 마커 생성
        const created: google.maps.Marker[] = mockLocations.map((loc) => {
          return new g.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map: mapInstanceRef.current!,
            icon: createIcon(loc.iconUrl),
          });
        });
        serverMarkersRef.current = created;

        // 초기 bounds: 서버 마커 기준
        const bounds = new g.maps.LatLngBounds();
        created.forEach((m) => {
          const p = m.getPosition();
          if (p) bounds.extend(p);
        });
        if (!bounds.isEmpty()) {
          const overlayHeight = overlayCardRef.current?.offsetHeight ?? 0;
          const bottomPadding = Math.max(overlayHeight + 16, 12);
          mapInstanceRef.current!.fitBounds(bounds, {
            top: 12,
            left: 12,
            right: 12,
            bottom: bottomPadding,
          });
        }

        // 사용자 현재 위치: Geolocation
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              if (!mapInstanceRef.current) return;
              const { latitude, longitude } = pos.coords;
              const here = new g.maps.LatLng(latitude, longitude);
              userMarkerRef.current = new g.maps.Marker({
                position: here,
                map: mapInstanceRef.current,
                icon: {
                  url: '/assets/icons/ic_delivery_address.svg',
                  scaledSize: new g.maps.Size(36, 36),
                  anchor: new g.maps.Point(18, 18),
                },
              });
              // 서버 마커 + 사용자 위치로 bounds 업데이트
              const allBounds = new g.maps.LatLngBounds();
              serverMarkersRef.current.forEach((m) => {
                const p = m.getPosition();
                if (p) allBounds.extend(p);
              });
              allBounds.extend(here);
              {
                const overlayHeight = overlayCardRef.current?.offsetHeight ?? 0;
                const bottomPadding = Math.max(overlayHeight + 16, 12);
                mapInstanceRef.current.fitBounds(allBounds, {
                  top: 12,
                  left: 12,
                  right: 12,
                  bottom: bottomPadding,
                });
              }
              setGeoMessage(null);
            },
            (err) => {
              setGeoMessage('현재 위치를 가져올 수 없습니다. 브라우저 위치 권한을 확인해주세요.');
            },
            { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000 }
          );
        } else {
          setGeoMessage('이 브라우저는 위치 정보를 지원하지 않습니다.');
        }
      } catch (e) {
        setLoadError(
          '지도를 불러올 수 없습니다. VITE_GOOGLE_MAPS_API_KEY 환경변수를 확인해주세요.'
        );
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <MainLayout title="실시간 배송 조회" onClose={handleClose}>
      <PageContainer>
        <PageSection>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 'calc(100vh - 3.5rem)', // 헤더를 제외한 영역을 지도에 할당
              backgroundColor: '#F0F0F0',
            }}
          >
            <div
              ref={mapContainerRef}
              style={{
                position: 'absolute',
                inset: 0,
              }}
            />
            {loadError ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B00020',
                  background: 'rgba(255,255,255,0.9)',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  padding: '1rem',
                }}
              >
                {loadError}
              </div>
            ) : null}
            {!loadError && geoMessage ? (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: '1rem',
                  background: '#FFFFFF',
                  color: '#1F1F1F',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  fontSize: '0.75rem',
                }}
              >
                {geoMessage}
              </div>
            ) : null}
            {/* 하단 오버레이 (Figma 요건 반영, 인라인 스타일만 사용) */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                padding: '0.75rem 1rem',
                pointerEvents: 'none',
                // 상단 그라데이션로 지도와 자연스럽게 겹침
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 24%, rgba(255,255,255,0.92) 56%, #FFFFFF 100%)',
              }}
            >
              <div
                style={{
                  margin: '0 auto',
                  maxWidth: '640px',
                  background: '#FFFFFF',
                  border: '1px solid #E6E6E6',
                  borderRadius: '12px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  padding: '0.875rem 1rem',
                  pointerEvents: 'auto',
                }}
                ref={overlayCardRef}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.875rem', color: '#8A8A8A' }}>현재 상태</div>
                    <div style={{ fontSize: '1rem', color: '#1F1F1F', fontWeight: 600 }}>
                      라이더가 이동 중입니다
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', color: '#8A8A8A' }}>예상 도착</div>
                    <div style={{ fontSize: '1rem', color: '#1F1F1F', fontWeight: 600 }}>15분</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.625rem' }}>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      height: '44px',
                      borderRadius: '8px',
                      border: '1px solid #E6E6E6',
                      background: '#FFFFFF',
                      color: '#1F1F1F',
                      fontSize: '0.9375rem',
                    }}
                  >
                    배송 상세
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      height: '44px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#2F6FED',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                    }}
                  >
                    연락하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </PageSection>
      </PageContainer>
    </MainLayout>
  );
}
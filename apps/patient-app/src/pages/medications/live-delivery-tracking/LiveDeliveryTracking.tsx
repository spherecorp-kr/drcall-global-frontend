import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const serverMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const overlayCardRef = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation();
  const [etaMinutes, setEtaMinutes] = useState<number>(15);
  const [etaTimeText, setEtaTimeText] = useState<string>('');

  const handleBack = () => navigate(-1);
  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    // ETA 텍스트 초기화(모의: 현재로부터 etaMinutes 분 후)
    const minutes = etaMinutes;
    const arrival = new Date(Date.now() + minutes * 60_000);
    const hh = String(arrival.getHours()).padStart(2, '0');
    const mm = String(arrival.getMinutes()).padStart(2, '0');
    setEtaTimeText(`${hh}:${mm}`);
  }, [etaMinutes]);

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

        // Advanced Marker 라이브러리 보장
        await g.maps.importLibrary('marker');

        // Mock 서버 좌표 2쌍 (예: 방콕 중심 인근)
        const mockLocations = [
          { lat: 13.7563, lng: 100.5018, iconUrl: '/assets/icons/ic_delivery_motorcycle.svg' },
          { lat: 13.7463, lng: 100.5118, iconUrl: '/assets/icons/ic_delivery_truck.svg' },
        ];

        // 커스텀 마커 콘텐츠(HTML Element) 생성
        const createContent = (url: string) => {
          const img = document.createElement('img');
          img.src = url;
          img.alt = 'marker';
          img.style.width = '36px';
          img.style.height = '36px';
          img.style.objectFit = 'contain';
          return img;
        };

        // 마커 생성
        const created: google.maps.marker.AdvancedMarkerElement[] = mockLocations.map((loc) => (
          new g.maps.marker.AdvancedMarkerElement({
            map: mapInstanceRef.current!,
            position: { lat: loc.lat, lng: loc.lng },
            content: createContent(loc.iconUrl),
          })
        ));
        serverMarkersRef.current = created;

        // 초기 bounds: 서버 마커 기준
        const bounds = new g.maps.LatLngBounds();
        created.forEach((m) => {
          const pos = m.position;
          if (pos instanceof g.maps.LatLng) {
            bounds.extend(pos);
          } else if (pos) {
            bounds.extend(new g.maps.LatLng(pos as google.maps.LatLngLiteral));
          }
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
              userMarkerRef.current = new g.maps.marker.AdvancedMarkerElement({
                map: mapInstanceRef.current,
                position: here,
                content: createContent('/assets/icons/ic_delivery_address.svg'),
              });
              // 서버 마커 + 사용자 위치로 bounds 업데이트
              const allBounds = new g.maps.LatLngBounds();
              serverMarkersRef.current.forEach((m) => {
                const pos2 = m.position;
                if (pos2 instanceof g.maps.LatLng) {
                  allBounds.extend(pos2);
                } else if (pos2) {
                  allBounds.extend(new g.maps.LatLng(pos2 as google.maps.LatLngLiteral));
                }
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
    <MainLayout 
      title={t('medication.liveTracking.pageTitle')} 
      onBack={handleBack} 
      onClose={handleClose}
    >
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
                  padding: '1rem 1.25rem',
                  pointerEvents: 'auto',
                }}
                ref={overlayCardRef}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.375rem',
                  }}
                >
                  <div
                    style={{
                      color: '#1F1F1F',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      lineHeight: 1.1,
                    }}
                  >
                    {t('medication.liveTracking.etaMinutes', { minutes: etaMinutes })}
                  </div>
                  <div
                    style={{
                      color: '#1F1F1F',
                      fontSize: '1rem',
                      fontWeight: '400',
                    }}
                  >
                    {t('medication.liveTracking.etaArrivalAt', { time: etaTimeText })}
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      // TODO: 전화번호 데이터 연동 시 tel: 링크 적용
                      console.log('Call button clicked');
                    }}
                    style={{
                      width: '100%',
                      height: '3rem',
                      background: '#00A0D2',
                      borderRadius: '1.5rem',
                      border: 'none',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {t('medication.liveTracking.actions.callNow')}
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
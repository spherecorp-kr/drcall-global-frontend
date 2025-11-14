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
        </PageSection>
      </PageContainer>
    </MainLayout>
  );
}
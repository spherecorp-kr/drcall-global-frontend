import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Worker, Viewer, type Plugin, type ViewerState, SpecialZoomLevel } from '@react-pdf-viewer/core';
import MainLayout from '@layouts/MainLayout';
import BottomButtonLayout from '@layouts/BottomButtonLayout';
import Button from '@ui/buttons/Button';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PrescriptionViewerModalProps {
  isOpen: boolean;
  title: string;
  fileUrl: string;
  onClose: () => void;
  onDownload: () => void;
}

export default function PrescriptionViewerModal({
  isOpen,
  title,
  fileUrl,
  onClose,
  onDownload
}: PrescriptionViewerModalProps) {
  const { t } = useTranslation();
  // 페이지 라벨용 상태
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // 뷰어 컨테이너 참조 (핀치 제스처 바인딩용)
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);

  // 현재 배율을 추적하기 위한 상태 (플러그인에서 읽고/업데이트)
  const [currentScale, setCurrentScale] = useState<number>(1);

  // 커스텀 플러그인: 뷰어의 zoom 함수와 viewerState 접근자를 획득
  // - zoomTo: 배율을 외부에서 설정하기 위한 함수
  // - getScale: 현재 배율 조회용
  const pinchZoomPlugin = useMemo(() => {
    let zoomFn: ((scale: number | SpecialZoomLevel) => void) | null = null; // zoom 함수
    let getViewerState: (() => ViewerState) | null = null; // viewerState 접근자

    const plugin: Plugin = {
      install(pluginFns) { // 플러그인 설치 시 호출되는 함수
        zoomFn = pluginFns.zoom;
        getViewerState = pluginFns.getViewerState;
      },
      onViewerStateChange(nextState) {
        // 내부 배율 변경에 동기화
        setCurrentScale(nextState.scale); // 현재 배율 업데이트
        return nextState; // 변경된 viewerState 반환
      }
    };

    return {
      plugin,
      zoomTo: (scale: number | SpecialZoomLevel) => { // 배율 설정 함수
        if (zoomFn) zoomFn(scale);
      },
      getScale: (): number => { // 현재 배율 조회 함수
        if (getViewerState) return getViewerState().scale;
        return currentScale;
      }
    };
  }, [currentScale]);

  // 핀치 제스처 상태 보관
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map()); // 두 손가락 좌표
  const initialDistanceRef = useRef<number | null>(null); // 핀치 시작 순간 거리
  const baseScaleRef = useRef<number>(1); // 시작 배율
  const rafIdRef = useRef<number | null>(null); // 예약한 requestAnimationFrame ID 저장
  const touchActionPrevRef = useRef<string | null>(null); // 한 화면 프레임마다 최대 한 번만 배율 변경을 반영하도록 조절

  // 두 포인터 사이 거리 계산
  const distanceBetween = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  };

  // 배율 적용(스로틀: rAF)
  // 한 화면 프레임마다 최대 한 번만 배율 변경을 반영하도록 조절
  // 포인터 이동 이벤트는 매우 자주 발생하므로 매번 바로 zoom을 호출하면 과도한 재렌더링으로 버벅임
  const applyZoom = (nextScale: number) => {
    const clamped = Math.max(0.5, Math.min(4, nextScale));
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current); // 이전 애니메이션 취소
    }

    rafIdRef.current = requestAnimationFrame(() => { 
      pinchZoomPlugin.zoomTo(clamped); // 최신 값으로 애니메이션 예약
    });
  };

  // 포인터 이벤트 바인딩
  useEffect(() => {
    const container = viewerContainerRef.current;
    if (!container) return;

    // 핀치 시작 이벤트 처리
    const handlePointerDown = (e: PointerEvent) => {
      // 한 손가락 스크롤은 유지하고, 두 손가락부터 제스처 개시
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (activePointersRef.current.size === 2) {
        const [p1, p2] = Array.from(activePointersRef.current.values());
        initialDistanceRef.current = distanceBetween(p1, p2);
        baseScaleRef.current = pinchZoomPlugin.getScale();
        // 핀치 동작 동안 기본 스크롤/줌 방지
        touchActionPrevRef.current = (container.style as any).touchAction || '';
        (container.style as any).touchAction = 'none';
      }
    };

    // 핀치 동작 동안 기본 스크롤/줌 방지
    const handlePointerMove = (e: PointerEvent) => {
      if (!initialDistanceRef.current) return; // 핀치 시작 순간 거리가 없으면 처리하지 않음
      const info = activePointersRef.current.get(e.pointerId);
      if (!info) return; // 현재 포인터 정보가 없으면 처리하지 않음
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); // 현재 포인터 정보 업데이트
      if (activePointersRef.current.size === 2) { // 두 손가락이 터치되어 있으면 처리
        e.preventDefault(); // 기본 스크롤/줌 방지
        const [p1, p2] = Array.from(activePointersRef.current.values()); // 두 손가락 좌표 가져오기
        const currentDistance = distanceBetween(p1, p2);
        if (currentDistance > 0) { // 두 손가락 사이 거리가 0보다 크면 처리
          const ratio = currentDistance / initialDistanceRef.current; // 두 손가락 사이 거리 비율 계산
          const next = baseScaleRef.current * ratio; // 다음 배율 계산
          applyZoom(next); // 배율 적용
        }
      }
    };

    // 핀치 동작 종료 이벤트 처리
    const handlePointerUpOrCancel = (e: PointerEvent) => {
      activePointersRef.current.delete(e.pointerId); // 현재 포인터 정보 삭제 (핀치 동작 종료)
      if (activePointersRef.current.size < 2) { // 두 손가락이 터치되어 있지 않으면 처리
        initialDistanceRef.current = null; // 핀치 시작 순간 거리 초기화
        (container.style as any).touchAction = touchActionPrevRef.current || ''; // 터치 액션 복원
        touchActionPrevRef.current = null; // 터치 액션 초기화
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove, { passive: false });
    container.addEventListener('pointerup', handlePointerUpOrCancel);
    container.addEventListener('pointercancel', handlePointerUpOrCancel);
    container.addEventListener('pointerleave', handlePointerUpOrCancel);

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove as any);
      container.removeEventListener('pointerup', handlePointerUpOrCancel);
      container.removeEventListener('pointercancel', handlePointerUpOrCancel);
      container.removeEventListener('pointerleave', handlePointerUpOrCancel);
    };
  }, [pinchZoomPlugin]);

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
        title={title}
        onClose={onClose}
        fullWidth
      >
        
        <div ref={viewerContainerRef} style={{ 
          position: 'relative', 
          backgroundColor: 'white',
          height: 'calc(100vh - 5.625rem)',   // 헤더(5.625rem=90px) 제외
          overflowY: 'auto',                   // 이 영역에서만 스크롤
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '90px',               // 하단 고정 버튼 가림 방지
          boxSizing: 'border-box'
        }}>
          {/* 페이지 라벨 */}
          {numPages > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              padding: '5px 24px',
              borderRadius: 100,
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: 18,
              zIndex: 1,
              pointerEvents: 'none'
            }}
          >
            {`${currentPage + 1} / ${numPages}`}
          </div>
          )}

          <Worker workerUrl='/pdf.worker.min.js'>
            <Viewer
              fileUrl={encodeURI(fileUrl)}
              theme="light"
              characterMap={{ url: '/cmaps/', isCompressed: true }}
              onDocumentLoad={(e) => setNumPages(e.doc.numPages)}
              onPageChange={(e) => setCurrentPage(e.currentPage)}
              plugins={[pinchZoomPlugin.plugin]}
            />
          </Worker>
        </div>
        <BottomButtonLayout fullWidth contentClassName="">
          <Button onClick={onDownload}>{t('appointment.download')}</Button>
        </BottomButtonLayout>
      </MainLayout>
    </div>
  );
}

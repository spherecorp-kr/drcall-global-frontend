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
        
        <div style={{ 
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

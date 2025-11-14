import { useEffect } from 'react';

/**
 * 모달이 열려있는 동안 배경(문서) 스크롤을 완전히 차단하고,
 * 모달이 닫히면 원래 상태로 복구합니다.
 *
 * - body: overflow/position/top/width 복구
 * - html(documentElement): overscrollBehaviorY 복구
 * - 스크롤 위치 원복
 */
export default function useModalScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevHtmlObsY = document.documentElement.style.overscrollBehaviorY;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.documentElement.style.overscrollBehaviorY = 'none';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      document.documentElement.style.overscrollBehaviorY = prevHtmlObsY;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
}



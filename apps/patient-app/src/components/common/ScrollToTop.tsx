import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 라우트 변경 시 스크롤을 최상단으로 이동시키는 컴포넌트
 * - 페이지 전환 시 자동으로 window.scrollTo(0, 0) 실행
 * - App.tsx에서 BrowserRouter 내부에 위치시켜야 함
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

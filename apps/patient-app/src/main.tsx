import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * MSW (Mock Service Worker) 설정
 * VITE_USE_MOCK_API=true일 때 mock API를 사용합니다.
 */
async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK_API !== 'true') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // Service Worker 시작
  return worker.start({
    onUnhandledRequest: 'bypass', // Mock되지 않은 요청은 실제 API로 전달
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

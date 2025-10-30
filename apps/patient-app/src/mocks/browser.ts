import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW Browser Worker
 * 브라우저 환경에서 Service Worker를 사용하여 API를 mock합니다.
 */
export const worker = setupWorker(...handlers);

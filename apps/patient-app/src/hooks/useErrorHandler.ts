import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { logError, handleApiError } from '@utils/errorHandler';

/**
 * Custom hook for consistent error handling
 */
export function useErrorHandler() {
  const { t } = useTranslation();

  /**
   * Handle API errors with toast notification
   */
  const handleError = useCallback(
    (error: unknown, context?: { feature?: string; action?: string }) => {
      // Log error
      logError(error, context);

      // Get user-friendly message (may be i18n key or actual message)
      const message = handleApiError(error);

      // i18n 키인지 확인 (auth., common. 등으로 시작하면 i18n 키)
      const isI18nKey = message.includes('.');
      const translatedMessage = isI18nKey ? t(message) : message;

      // Show toast if available
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(translatedMessage, 'error', 'bottom');
      }

      return translatedMessage;
    },
    [t]
  );

  /**
   * Handle form validation errors
   */
  const handleValidationError = useCallback(
    (message: string) => {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(message, 'error', 'bottom');
      }
      return message;
    },
    []
  );

  /**
   * Handle success with toast notification
   */
  const handleSuccess = useCallback((message: string) => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast(message, 'success', 'bottom');
    }
  }, []);

  return {
    handleError,
    handleValidationError,
    handleSuccess,
  };
}

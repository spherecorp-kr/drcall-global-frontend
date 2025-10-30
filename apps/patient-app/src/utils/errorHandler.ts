/**
 * Centralized Error Handling Utility
 * Provides consistent error logging and user notification
 */

type ErrorContext = {
  feature?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  type?: string;
  status?: number;
};

class ErrorHandler {
  private isDevelopment = import.meta.env.DEV;

  /**
   * Log error for debugging purposes
   * In production, this would send to error tracking service (Sentry, etc.)
   */
  log(error: Error | unknown, context?: ErrorContext): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    if (this.isDevelopment) {
      console.error('[Error]', {
        message: errorMessage,
        stack: errorStack,
        context,
        timestamp: new Date().toISOString(),
      });
    } else {
      // In production, send to error tracking service
      // Example: Sentry.captureException(error, { contexts: { custom: context } });
    }
  }

  /**
   * Handle API errors with user-friendly messages
   */
  handleApiError(error: unknown, defaultMessage: string = '오류가 발생했습니다'): string {
    let userMessage = defaultMessage;

    // Type guard for axios error
    if (this.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        const status = error.response.status;

        switch (status) {
          case 400:
            userMessage = '잘못된 요청입니다';
            break;
          case 401:
            userMessage = '인증이 필요합니다';
            break;
          case 403:
            userMessage = '접근 권한이 없습니다';
            break;
          case 404:
            userMessage = '요청하신 정보를 찾을 수 없습니다';
            break;
          case 500:
            userMessage = '서버 오류가 발생했습니다';
            break;
          default:
            userMessage = error.response.data?.message || defaultMessage;
        }
      } else if (error.request) {
        // Request made but no response
        userMessage = '네트워크 연결을 확인해주세요';
      }

      this.log(error, { type: 'api_error', status: error.response?.status });
    } else {
      this.log(error, { type: 'api_error' });
    }

    return userMessage;
  }

  /**
   * Type guard for axios errors
   */
  private isAxiosError(error: unknown): error is { response?: { status: number; data?: { message?: string } }; request?: unknown } {
    return typeof error === 'object' && error !== null && ('response' in error || 'request' in error);
  }

  /**
   * Handle form validation errors
   */
  handleValidationError(fieldName: string, errorType: string): string {
    const messages: Record<string, string> = {
      required: `${fieldName}을(를) 입력해주세요`,
      invalid: `올바른 ${fieldName}을(를) 입력해주세요`,
      minLength: `${fieldName}이(가) 너무 짧습니다`,
      maxLength: `${fieldName}이(가) 너무 깁니다`,
    };

    return messages[errorType] || `${fieldName} 입력 오류`;
  }

  /**
   * Handle unexpected errors with fallback
   */
  handleUnexpectedError(error: unknown, context?: ErrorContext): string {
    this.log(error, { ...context, type: 'unexpected_error' });
    return '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.';
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Convenience exports for common use cases
export const logError = (error: Error | unknown, context?: ErrorContext) => {
  errorHandler.log(error, context);
};

export const handleApiError = (error: unknown, defaultMessage?: string) => {
  return errorHandler.handleApiError(error, defaultMessage);
};

export const handleValidationError = (fieldName: string, errorType: string) => {
  return errorHandler.handleValidationError(fieldName, errorType);
};

export const handleUnexpectedError = (error: unknown, context?: ErrorContext) => {
  return errorHandler.handleUnexpectedError(error, context);
};

/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logError } from '@utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to error tracking service
    logError(error, {
      feature: 'ErrorBoundary',
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-50">
          <div className="flex flex-col items-center gap-6 max-w-md text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold text-gray-900">
                오류가 발생했습니다
              </h1>
              <p className="text-sm text-gray-600">
                일시적인 문제가 발생했습니다.
                <br />
                다시 시도해주세요.
              </p>
            </div>

            {/* Error Details (Development only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="w-full p-4 bg-red-50 rounded-lg text-left">
                <p className="text-xs font-mono text-red-800 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={this.handleReset}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full h-12 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

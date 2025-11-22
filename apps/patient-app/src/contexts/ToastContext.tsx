import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import Toast, { type ToastType, type ToastPosition } from '@ui/feedback/Toast';

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, position?: ToastPosition) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastState {
  message: string;
  type: ToastType;
  position: ToastPosition;
  visible: boolean;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    position: 'center',
    visible: false,
  });

  const showToast = useCallback((message: string, type: ToastType = 'info', position: ToastPosition = 'center') => {
    setToast({ message, type, position, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // window 객체에 showToast 함수를 노출하여 어디서든 사용 가능하게 함
  React.useEffect(() => {
    (window as any).showToast = showToast;
    return () => {
      delete (window as any).showToast;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          position={toast.position}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}

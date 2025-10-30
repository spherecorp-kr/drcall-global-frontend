import { useState, useCallback } from 'react';
import Toast, { type ToastType, type ToastPosition } from '@ui/feedback/Toast';

interface ToastState {
  message: string;
  type: ToastType;
  position: ToastPosition;
  visible: boolean;
}

export function useToast() {
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

  const ToastComponent = toast.visible ? (
    <Toast message={toast.message} type={toast.type} position={toast.position} onClose={hideToast} />
  ) : null;

  return {
    showToast,
    hideToast,
    ToastComponent,
  };
}

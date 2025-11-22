import { useState, useCallback } from 'react';

/**
 * Custom hook for modal state management
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

/**
 * Custom hook for managing multiple modals
 */
export function useModals<T extends string>() {
  const [openModals, setOpenModals] = useState<Set<T>>(new Set());

  const open = useCallback((key: T) => {
    setOpenModals((prev) => new Set(prev).add(key));
  }, []);

  const close = useCallback((key: T) => {
    setOpenModals((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const toggle = useCallback((key: T) => {
    setOpenModals((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const isOpen = useCallback((key: T) => openModals.has(key), [openModals]);

  const closeAll = useCallback(() => {
    setOpenModals(new Set());
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    closeAll,
  };
}

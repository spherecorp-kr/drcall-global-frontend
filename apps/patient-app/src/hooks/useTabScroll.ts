import { useEffect, useRef } from 'react';

/**
 * Custom hook to automatically scroll selected tab into view
 */
export function useTabScroll<T extends string>(selectedTab: T, dependencies: any[] = []) {
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const selectedTabButton = tabRefs.current[selectedTab];
    if (selectedTabButton) {
      selectedTabButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, ...dependencies]);

  const setTabRef = (key: T) => (el: HTMLButtonElement | null) => {
    tabRefs.current[key] = el;
  };

  return { setTabRef, tabRefs };
}

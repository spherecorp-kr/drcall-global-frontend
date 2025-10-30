import { useState, useEffect, useRef, useCallback, DependencyList } from 'react';

interface UseInfiniteScrollOptions {
  itemsPerPage?: number;
  totalItems: number;
  dependencies?: DependencyList;
}

/**
 * Custom hook for infinite scroll functionality
 * Uses Intersection Observer API to detect when user scrolls to bottom
 */
export function useInfiniteScroll({
  itemsPerPage = 10,
  totalItems,
  dependencies = [],
}: UseInfiniteScrollOptions) {
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset count when dependencies change
  useEffect(() => {
    setDisplayedCount(itemsPerPage);
  }, dependencies);

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && displayedCount < totalItems) {
        setDisplayedCount((prev) => prev + itemsPerPage);
      }
    },
    [displayedCount, totalItems, itemsPerPage]
  );

  // Set up Intersection Observer
  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  const hasMore = displayedCount < totalItems;

  return {
    displayedCount,
    observerTarget,
    hasMore,
  };
}

/**
 * Picture-in-Picture Drag Hook
 * Handles dragging logic for PIP video element with snap-to-side functionality
 */

import { useState, useEffect, useCallback } from 'react';

interface PIPSize {
  width: number;
  height: number;
}

interface PIPPosition {
  x: number;
  y: number;
}

interface UsePIPDragOptions {
  /**
   * Initial size of PIP element
   */
  initialSize?: PIPSize;

  /**
   * Minimum PIP width
   */
  minWidth?: number;

  /**
   * Maximum PIP width
   */
  maxWidth?: number;

  /**
   * Screen width percentage for responsive sizing
   */
  responsiveWidthPercentage?: number;

  /**
   * Distance from edges when snapped
   */
  edgeMargin?: number;
}

export function usePIPDrag({
  initialSize = { width: 103, height: 170 },
  minWidth = 103,
  maxWidth = 150,
  responsiveWidthPercentage = 0.25,
  edgeMargin = 20,
}: UsePIPDragOptions = {}) {
  // PIP state
  const [pipSide, setPipSide] = useState<'left' | 'right'>('right');
  const [pipSize, setPipSize] = useState<PIPSize>(initialSize);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<PIPPosition>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<PIPPosition>({ x: 0, y: 0 });
  const [dragStartTime, setDragStartTime] = useState(0);
  const [lastDragX, setLastDragX] = useState(0);

  /**
   * Calculate PIP position based on current state
   */
  const getPipPosition = useCallback((): PIPPosition => {
    if (isDragging) {
      return dragPosition;
    }

    // Snapped position
    return {
      x: pipSide === 'left' ? edgeMargin : window.innerWidth - pipSize.width - edgeMargin,
      y: edgeMargin,
    };
  }, [isDragging, dragPosition, pipSide, pipSize.width, edgeMargin]);

  /**
   * Start dragging (Mouse)
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStartTime(Date.now());

      const currentPos = getPipPosition();
      setDragStart({
        x: e.clientX - currentPos.x,
        y: e.clientY - currentPos.y,
      });
      setDragPosition(currentPos);
      setLastDragX(e.clientX);
    },
    [getPipPosition]
  );

  /**
   * Start dragging (Touch)
   */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStartTime(Date.now());

      const currentPos = getPipPosition();
      setDragStart({
        x: touch.clientX - currentPos.x,
        y: touch.clientY - currentPos.y,
      });
      setDragPosition(currentPos);
      setLastDragX(touch.clientX);
    },
    [getPipPosition]
  );

  /**
   * Handle dragging movement (Mouse)
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      setDragPosition({ x: newX, y: newY });
      setLastDragX(e.clientX);
    },
    [isDragging, dragStart]
  );

  /**
   * Handle dragging movement (Touch)
   */
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;

      setDragPosition({ x: newX, y: newY });
      setLastDragX(touch.clientX);
    },
    [isDragging, dragStart]
  );

  /**
   * End dragging with snap-to-side logic
   */
  const handleDragEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;

      const currentX = 'clientX' in e ? e.clientX : e.changedTouches[0].clientX;
      const dragDuration = Date.now() - dragStartTime;
      const dragDistance = currentX - lastDragX;

      // Calculate velocity (pixels per millisecond)
      const velocity = Math.abs(dragDistance / Math.max(dragDuration, 1));

      // Detect fast swipe (velocity > 0.5 = swipe)
      const isSwipe = velocity > 0.5;

      const currentSideX =
        pipSide === 'left' ? edgeMargin : window.innerWidth - pipSize.width - edgeMargin;
      const draggedX = dragPosition.x;

      // Swipe requires 50px movement, normal drag requires 30% of screen
      const threshold = isSwipe
        ? 50
        : (window.innerWidth - pipSize.width - edgeMargin * 2) * 0.3;

      if (pipSide === 'left') {
        // Moving from left to right
        if (draggedX - currentSideX > threshold || (isSwipe && dragDistance > 0)) {
          setPipSide('right');
        }
      } else {
        // Moving from right to left
        if (currentSideX - draggedX > threshold || (isSwipe && dragDistance < 0)) {
          setPipSide('left');
        }
      }

      setIsDragging(false);
    },
    [isDragging, dragStartTime, lastDragX, pipSide, pipSize.width, dragPosition.x, edgeMargin]
  );

  /**
   * Handle window resize - adjust PIP size responsively
   */
  useEffect(() => {
    const aspectRatio = initialSize.height / initialSize.width;

    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const width = Math.max(minWidth, Math.min(screenWidth * responsiveWidthPercentage, maxWidth));
      const height = width * aspectRatio; // Maintain aspect ratio
      setPipSize({ width, height });
    };

    // Initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minWidth, maxWidth, responsiveWidthPercentage]);

  return {
    // PIP state
    pipSide,
    pipSize,
    pipPosition: getPipPosition(),
    isDragging,

    // Event handlers
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleTouchMove,
    handleMouseUp: handleDragEnd,
    handleTouchEnd: handleDragEnd,

    // Manual control
    setPipSide,
  };
}

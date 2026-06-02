import { useState, useRef, useEffect, useCallback } from 'react';
import './SlideToUnlock.scss';

const SlideToUnlock = ({
  onUnlock,
  onLock,
  isLocked,
  lockedText = 'Slide to unlock',
  orientation = 'horizontal',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const trackRef = useRef(null);
  const handleRef = useRef(null);
  const startPositionRef = useRef(0);
  const maxDragRef = useRef(1);
  const isDraggingRef = useRef(false);
  const isVertical = orientation === 'vertical';
  const lockedTextParts = lockedText.trim().split(/\s+/);
  const verticalLockedText = lockedTextParts.length > 2
    ? [
        lockedTextParts.slice(0, -1).join(' '),
        lockedTextParts[lockedTextParts.length - 1],
      ]
    : lockedTextParts;

  const getMaxDrag = useCallback(() => {
    if (!trackRef.current || !handleRef.current) return 1;

    const trackRect = trackRef.current.getBoundingClientRect();
    const handleRect = handleRef.current.getBoundingClientRect();
    const trackSize = isVertical ? trackRect.height : trackRect.width;
    const handleSize = isVertical ? handleRect.height : handleRect.width;
    const maxDrag = trackSize - handleSize - 16;

    return Math.max(1, maxDrag);
  }, [isVertical]);

  // Reset drag position when locked externally
  useEffect(() => {
    if (isLocked) {
      setIsUnlocked(false);
      setDragPosition(0);
      setIsDragging(false);
      isDraggingRef.current = false;
    }
  }, [isLocked]);

  const handleStart = useCallback((pointerPosition) => {
    if (isUnlocked) return;
    
    isDraggingRef.current = true;
    setIsDragging(true);
    startPositionRef.current = pointerPosition;
    maxDragRef.current = getMaxDrag();
  }, [getMaxDrag, isUnlocked]);

  const handleMove = useCallback((pointerPosition) => {
    if (!isDraggingRef.current || isUnlocked) return;

    const delta = pointerPosition - startPositionRef.current;
    const newPosition = Math.max(0, Math.min(delta, maxDragRef.current));
    
    setDragPosition(newPosition);
  }, [isUnlocked]);

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);
    
    const maxDrag = maxDragRef.current;
    const threshold = maxDrag * 0.8; // 80% threshold

    if (dragPosition >= threshold) {
      // Unlock
      setDragPosition(maxDrag);
      setIsUnlocked(true);
      onUnlock();
    } else {
      // Snap back
      setDragPosition(0);
    }
  }, [dragPosition, onUnlock]);

  // Mouse events
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleStart(isVertical ? e.clientY : e.clientX);
  };

  const onMouseMove = (e) => {
    handleMove(isVertical ? e.clientY : e.clientX);
  };

  const onMouseUp = () => {
    handleEnd();
  };

  const onMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  // Touch events
  const captureSliderTouch = (e) => {
    e.stopPropagation();
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const onTouchStart = (e) => {
    captureSliderTouch(e);
    handleStart(isVertical ? e.touches[0].clientY : e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (isDraggingRef.current) {
      captureSliderTouch(e);
    } else {
      e.stopPropagation();
    }
    handleMove(isVertical ? e.touches[0].clientY : e.touches[0].clientX);
  };

  const onTouchEnd = (e) => {
    if (isDraggingRef.current) {
      captureSliderTouch(e);
    } else {
      e.stopPropagation();
    }
    handleEnd();
  };

  // Keyboard support
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsUnlocked(true);
      onUnlock();
    }
  };

  return (
    <div 
      className={`slide-to-unlock slide-to-unlock--${orientation} ${isUnlocked ? 'unlocked' : ''}`}
      ref={trackRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div className="slide-track">
        <div className="slide-text">
          {isVertical && !isUnlocked
            ? verticalLockedText.map((line) => (
                <span key={line}>{line}</span>
              ))
            : isUnlocked ? 'Unlocked' : lockedText}
        </div>
        <div 
          className="slide-fill"
          style={isVertical ? { height: `${dragPosition + 50}px` } : { width: `${dragPosition + 50}px` }}
        />
        <div
          ref={handleRef}
          className={`slide-handle ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: isVertical
              ? `translateX(-50%) translateY(${dragPosition}px)`
              : `translateX(${dragPosition}px)`,
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onKeyDown={onKeyDown}
          role="slider"
          aria-label="Slide to unlock fixture controls"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((dragPosition / maxDragRef.current) * 100)}
          tabIndex={0}
        >
          <span className={`handle-icon pi ${isVertical ? 'pi-arrow-down' : 'pi-arrow-right'}`}></span>
        </div>
      </div>
    </div>
  );
};

export default SlideToUnlock;

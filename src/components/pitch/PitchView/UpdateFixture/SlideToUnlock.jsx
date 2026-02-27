import { useState, useRef, useEffect, useCallback } from 'react';
import './SlideToUnlock.scss';

const SlideToUnlock = ({ onUnlock, onLock, isLocked }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const trackRef = useRef(null);
  const handleRef = useRef(null);
  const startXRef = useRef(0);
  const trackWidthRef = useRef(0);

  // Reset drag position when locked externally
  useEffect(() => {
    if (isLocked) {
      setIsUnlocked(false);
      setDragPosition(0);
      setIsDragging(false);
    }
  }, [isLocked]);

  const handleStart = useCallback((clientX) => {
    if (isUnlocked) return;
    
    setIsDragging(true);
    startXRef.current = clientX;
    
    if (trackRef.current) {
      trackWidthRef.current = trackRef.current.getBoundingClientRect().width;
    }
  }, [isUnlocked]);

  const handleMove = useCallback((clientX) => {
    if (!isDragging || isUnlocked) return;

    const deltaX = clientX - startXRef.current;
    const maxDrag = trackWidthRef.current - 96; // 96px total handle width (77px + margins)
    const newPosition = Math.max(0, Math.min(deltaX, maxDrag));
    
    setDragPosition(newPosition);
  }, [isDragging, isUnlocked]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    
    const maxDrag = trackWidthRef.current - 96;
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
  }, [isDragging, dragPosition, onUnlock]);

  // Mouse events
  const onMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const onMouseMove = (e) => {
    handleMove(e.clientX);
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
  const onTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
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
      className={`slide-to-unlock ${isUnlocked ? 'unlocked' : ''}`}
      ref={trackRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="slide-track">
        <div className="slide-text">
          {isUnlocked ? 'Unlocked' : 'Slide to unlock'}
        </div>
        <div 
          className="slide-fill"
          style={{ width: `${dragPosition + 48}px` }}
        />
        <div
          ref={handleRef}
          className={`slide-handle ${isDragging ? 'dragging' : ''}`}
          style={{ transform: `translateX(${dragPosition}px)` }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onKeyDown={onKeyDown}
          role="slider"
          aria-label="Slide to unlock fixture controls"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((dragPosition / (trackWidthRef.current - 96)) * 100)}
          tabIndex={0}
        >
          <span className="handle-icon">→</span>
        </div>
      </div>
    </div>
  );
};

export default SlideToUnlock;

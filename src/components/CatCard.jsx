import { useState, useEffect, useRef, useCallback } from 'react'
import './CatCard.css'

function CatCard({ cat, index, isActive, onSwipe }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const startPosRef = useRef({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const isDraggingRef = useRef(false)
  const [rotation, setRotation] = useState(0)
  const cardRef = useRef(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const isActiveRef = useRef(isActive)

  useEffect(() => {
    isActiveRef.current = isActive
    if (!isActive) {
      setPosition({ x: 0, y: 0 })
      positionRef.current = { x: 0, y: 0 }
      setRotation(0)
      setIsDragging(false)
      isDraggingRef.current = false
    }
  }, [isActive])

  const handleStart = useCallback((clientX, clientY) => {
    if (!isActiveRef.current) return
    startPosRef.current = { x: clientX, y: clientY }
    setIsDragging(true)
    isDraggingRef.current = true
  }, [])

  const handleMove = useCallback((clientX, clientY) => {
    if (!isActiveRef.current || !isDraggingRef.current) return

    const deltaX = clientX - startPosRef.current.x
    const deltaY = clientY - startPosRef.current.y

    const newPosition = { x: deltaX, y: deltaY }
    setPosition(newPosition)
    positionRef.current = newPosition
    
    // Add rotation based on horizontal movement
    const rotationValue = deltaX * 0.1
    setRotation(rotationValue)
  }, [])

  const handleEnd = useCallback(() => {
    if (!isActiveRef.current || !isDraggingRef.current) return

    const threshold = 100
    const absX = Math.abs(positionRef.current.x)

    if (absX > threshold) {
      // Swipe detected
      if (positionRef.current.x > 0) {
        onSwipe('right') // Like
      } else {
        onSwipe('left') // Dislike
      }
    } else {
      // Snap back to center
      setPosition({ x: 0, y: 0 })
      positionRef.current = { x: 0, y: 0 }
      setRotation(0)
    }

    setIsDragging(false)
    isDraggingRef.current = false
  }, [onSwipe])

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX, e.clientY)
  }, [handleMove])

  const handleMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e) => {
    if (isDragging) {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  // Add global mouse listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const opacity = isActive ? 1 : 0.95
  const scale = isActive ? 1 : 0.95
  const zIndex = isActive ? 10 : 5

  // Calculate opacity and color based on swipe direction
  const swipeOpacity = Math.min(Math.abs(position.x) / 200, 1)
  const isLiking = position.x > 0
  const isDisliking = position.x < 0

  return (
    <div
      ref={cardRef}
      className={`cat-card ${isActive ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
        opacity,
        zIndex,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="card-image-container">
        <img 
          src={cat.url} 
          alt={`Cat ${index + 1}`}
          className="cat-image"
          draggable={false}
          onError={(e) => {
            console.error('Image failed to load:', cat.url)
            // Fallback to a direct cat image
            e.target.src = `https://cataas.com/cat?t=${Date.now()}`
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', cat.url)
          }}
        />
        {isActive && (
          <>
            {isLiking && (
              <div 
                className="swipe-indicator like-indicator"
                style={{ opacity: swipeOpacity }}
              >
                <span className="indicator-text">LIKE</span>
              </div>
            )}
            {isDisliking && (
              <div 
                className="swipe-indicator dislike-indicator"
                style={{ opacity: swipeOpacity }}
              >
                <span className="indicator-text">NOPE</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CatCard


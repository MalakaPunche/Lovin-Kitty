import { useState, useEffect } from 'react'
import './CatCard.css'

function CatCard({ cat, index, swipeDirection }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Reset image loading state when cat changes
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [cat.id])

  return (
    <div className="cat-card">
      <div className="card-image-container">
        <img 
          src={cat.url} 
          alt={`Cat ${index + 1}`}
          className="cat-image"
          draggable={false}
        />
        {swipeDirection && (
          <>
            {swipeDirection === 'right' && (
              <div className="swipe-indicator like-indicator">
                <span className="indicator-text">LIKE</span>
              </div>
            )}
            {swipeDirection === 'left' && (
              <div className="swipe-indicator dislike-indicator">
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

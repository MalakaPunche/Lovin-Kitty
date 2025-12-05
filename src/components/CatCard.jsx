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
        {!imageLoaded && !imageError && (
          <div className="image-loading">
            <div className="loading-spinner-small"></div>
            <p>Loading cat...</p>
          </div>
        )}
        {imageError && (
          <div className="image-error">
            <p>😿 Failed to load image</p>
            <p className="error-url">{cat.url}</p>
          </div>
        )}
        <img 
          src={cat.url} 
          alt={`Cat ${index + 1}`}
          className="cat-image"
          draggable={false}
          style={{ display: imageLoaded && !imageError ? 'block' : 'none' }}
          onError={(e) => {
            console.error('Image failed to load:', cat.url, e)
            setImageError(true)
            setImageLoaded(false)
            // Try fallback URL
            const fallbackUrl = `https://cataas.com/cat?${Date.now()}`
            console.log('Trying fallback URL:', fallbackUrl)
            e.target.src = fallbackUrl
            // Reset error state after a moment to try fallback
            setTimeout(() => {
              setImageError(false)
            }, 100)
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', cat.url)
            setImageLoaded(true)
            setImageError(false)
          }}
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

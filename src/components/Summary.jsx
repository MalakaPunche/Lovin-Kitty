import { useState } from 'react'
import './Summary.css'

const EMOTICONS = {
  celebration: '🎉',
  cat: '🐱',
  sad: '😿',
  heart: '❤️',
}

function Summary({ likedCats, totalCats, onReset }) {
  const likedCount = likedCats.length
  const percentage = Math.round((likedCount / totalCats) * 100)
  const [imageErrors, setImageErrors] = useState({})
  const [imageLoading, setImageLoading] = useState({})

  // Debug: Log liked cats data
  console.log('Summary - Liked cats:', likedCats.map(cat => ({ id: cat.id, url: cat.url })))

  const handleImageError = (catId, index, e) => {
    const cat = likedCats[index]
    console.error('Summary image failed to load:', catId, cat?.url)
    
    // Try fallback URL
    if (cat && e.target) {
      // Try using the cat ID to construct a new URL
      if (cat.id && !cat.id.startsWith('fallback') && !cat.id.startsWith('cat-')) {
        const fallbackUrl = `https://cataas.com/cat/${cat.id}`
        console.log('Trying fallback URL:', fallbackUrl)
        e.target.src = fallbackUrl
        // Don't mark as error yet, wait to see if fallback works
        return
      }
      
      // Last resort: try direct endpoint
      const directUrl = `https://cataas.com/cat?${Date.now()}-${index}`
      console.log('Trying direct URL:', directUrl)
      e.target.src = directUrl
      return
    }
    
    // If all fallbacks failed, mark as error
    setImageErrors(prev => ({ ...prev, [catId]: true }))
  }

  const handleImageLoad = (catId) => {
    setImageLoading(prev => ({ ...prev, [catId]: false }))
    setImageErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[catId]
      return newErrors
    })
  }

  const handleImageStartLoad = (catId) => {
    setImageLoading(prev => ({ ...prev, [catId]: true }))
  }

  return (
    <div className="summary-container">
      <div className="summary-content">
        <h1>{EMOTICONS.celebration} All Done!</h1>
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{likedCount}</div>
            <div className="stat-label">Cats Liked</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalCats - likedCount}</div>
            <div className="stat-label">Cats Passed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{percentage}%</div>
            <div className="stat-label">Match Rate</div>
          </div>
        </div>

        {likedCount > 0 ? (
          <>
            <h2>Your Favourite Kitties {EMOTICONS.cat}</h2>
            <div className="liked-cats-grid">
              {likedCats.map((cat, index) => (
                <div key={cat.id || index} className="liked-cat-card">
                  {imageErrors[cat.id] ? (
                    <div className="summary-image-error">
                      <span className="error-emoji">{EMOTICONS.sad}</span>
                      <p>Image unavailable</p>
                      <button 
                        className="retry-button"
                        onClick={() => {
                          setImageErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors[cat.id]
                            return newErrors
                          })
                          setImageLoading(prev => ({ ...prev, [cat.id]: true }))
                          // Force reload by updating src with cache buster
                          const img = document.querySelector(`img[data-cat-id="${cat.id}"]`)
                          if (img) {
                            // Try original URL first, then fallback
                            if (cat.id && !cat.id.startsWith('fallback') && !cat.id.startsWith('cat-')) {
                              img.src = `https://cataas.com/cat/${cat.id}?retry=${Date.now()}`
                            } else {
                              img.src = `${cat.url}?retry=${Date.now()}`
                            }
                          }
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <>
                      {imageLoading[cat.id] && (
                        <div className="summary-image-loading">
                          <div className="loading-spinner-small"></div>
                        </div>
                      )}
                      <img 
                        data-cat-id={cat.id}
                        src={cat.url} 
                        alt={`Liked cat ${index + 1}`}
                        className="liked-cat-image"
                        style={{ display: imageLoading[cat.id] ? 'none' : 'block' }}
                        onError={(e) => handleImageError(cat.id, index, e)}
                        onLoad={() => handleImageLoad(cat.id)}
                        onLoadStart={() => handleImageStartLoad(cat.id)}
                        loading="lazy"
                      />
                      {!imageLoading[cat.id] && !imageErrors[cat.id] && (
                        <div className="liked-cat-overlay">
                          <span className="heart-icon">{EMOTICONS.heart}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-likes">
            <p>You didn't like any cats this time. {EMOTICONS.sad}</p>
            <p>Try again to find your purr-fect match!</p>
          </div>
        )}

        <button className="reset-button" onClick={onReset}>
          Start Over
        </button>
      </div>
    </div>
  )
}

export default Summary


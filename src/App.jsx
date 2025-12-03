import { useState, useEffect } from 'react'
import './App.css'
import CatCard from './components/CatCard'
import Summary from './components/Summary'

const TOTAL_CATS = 15 // Fixed number of cats as per assignment

function App() {
  const [cats, setCats] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedCats, setLikedCats] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch cat images from Cataas API
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catPromises = Array.from({ length: TOTAL_CATS }, async (_, index) => {
          try {
            // Fetch JSON data from Cataas API
            const response = await fetch('https://cataas.com/cat?json=true', {
              headers: {
                'Accept': 'application/json',
              }
            })
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            console.log(`Cat ${index + 1} API response:`, data)
            
            // Construct the image URL - Cataas returns url like "/cat/abc123" or "/cat/abc123.jpg"
            let imageUrl
            if (data.url) {
              // The URL from API typically starts with "/cat/"
              imageUrl = data.url.startsWith('http') 
                ? data.url 
                : `https://cataas.com${data.url}`
            } else if (data._id) {
              // Fallback: construct URL from ID
              imageUrl = `https://cataas.com/cat/${data._id}`
            } else {
              // Last resort: direct endpoint with cache busting
              imageUrl = `https://cataas.com/cat?${Date.now()}-${index}`
            }
            
            console.log(`Cat ${index + 1} final URL:`, imageUrl)
            
            return {
              id: data._id || `cat-${Date.now()}-${index}`,
              url: imageUrl,
              tags: data.tags || []
            }
          } catch (err) {
            console.error(`Error fetching cat ${index + 1}:`, err)
            // Return a fallback image
            const fallbackUrl = `https://cataas.com/cat?${Date.now()}-${index}`
            return {
              id: `fallback-${Date.now()}-${index}`,
              url: fallbackUrl,
              tags: []
            }
          }
        })
        
        const catData = await Promise.all(catPromises)
        console.log('Successfully fetched', catData.length, 'cats')
        console.log('Sample cat data:', catData[0])
        setCats(catData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching cats:', error)
        setLoading(false)
      }
    }

    fetchCats()
  }, [])

  const handleSwipe = (direction) => {
    if (currentIndex >= cats.length) return

    const currentCat = cats[currentIndex]
    
    if (direction === 'right') {
      console.log('Liking cat:', currentCat.id, currentCat.url)
      setLikedCats(prev => {
        const updated = [...prev, currentCat]
        console.log('Liked cats so far:', updated.length, updated.map(c => ({ id: c.id, url: c.url })))
        return updated
      })
    }

    setCurrentIndex(prev => prev + 1)
  }

  const resetApp = () => {
    setCurrentIndex(0)
    setLikedCats([])
    // Optionally refetch cats for a new session
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading adorable cats...</p>
        </div>
      </div>
    )
  }

  // Show summary when all cats have been swiped
  if (currentIndex >= cats.length) {
    return <Summary likedCats={likedCats} totalCats={cats.length} onReset={resetApp} />
  }

  // Show current cat and next cat for smooth transitions
  const currentCat = cats[currentIndex]
  const nextCat = cats[currentIndex + 1]

  return (
    <div className="app">
      <div className="header">
        <h1>🐱 Paws & Preferences</h1>
        <p className="progress">
          {currentIndex + 1} / {cats.length}
        </p>
      </div>

      <div className="cards-container">
        {nextCat && (
          <CatCard
            cat={nextCat}
            index={currentIndex + 1}
            isActive={false}
            onSwipe={handleSwipe}
          />
        )}
        {currentCat && (
          <CatCard
            cat={currentCat}
            index={currentIndex}
            isActive={true}
            onSwipe={handleSwipe}
          />
        )}
      </div>

      <div className="action-buttons">
        <button 
          className="dislike-btn" 
          onClick={() => handleSwipe('left')}
          aria-label="Dislike"
        >
          ❌
        </button>
        <button 
          className="like-btn" 
          onClick={() => handleSwipe('right')}
          aria-label="Like"
        >
          ❤️
        </button>
      </div>
    </div>
  )
}

export default App

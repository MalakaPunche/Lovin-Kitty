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
        // const catPromises = Array.from({ length: TOTAL_CATS }, () =>
        //   fetch('https://cataas.com/cat?json=true')
        //     .then(res => res.json())
        //     .then(data => ({
        //       id: data._id,
        //       url: `https://cataas.com${data.url}`,
        //       tags: data.tags || []
        //     }))
        // )
        
        // const catData = await Promise.all(catPromises)

                // NOTE:
        // The JSON endpoint on Cataas (`/cat?json=true`) does not send CORS headers,
        // which means browsers will often block it and no images will load.
        // To avoid this, we generate image URLs directly instead of fetching JSON.
        const catData = Array.from({ length: TOTAL_CATS }, (_v, i) => ({
          id: i,
          // `random` query param helps prevent aggressive caching
          url: `https://cataas.com/cat?random=${Date.now()}-${i}`,
          tags: []
        }))

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
      setLikedCats(prev => [...prev, currentCat])
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
        <h1>🐱 Kitty-Lovin'</h1>
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

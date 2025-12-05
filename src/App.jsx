import { useState, useEffect, useRef } from 'react'
import './App.css'
import TinderCard from 'react-tinder-card'
import CatCard from './components/CatCard'
import Summary from './components/Summary'

const TOTAL_CATS = 15 // Fixed number of cats as per assignment

function App() {
  const [cats, setCats] = useState([])
  const [currentIndex, setCurrentIndex] = useState(TOTAL_CATS - 1)
  const [likedCats, setLikedCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastDirection, setLastDirection] = useState()
  const [swipeDirection, setSwipeDirection] = useState(null)
  // Used to trigger programmatic swipes from buttons
  const childRefs = useRef([])

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
        // Initialize refs array
        childRefs.current = Array(catData.length).fill(null).map(() => ({ current: null }))
      } catch (error) {
        console.error('Error fetching cats:', error)
        setLoading(false)
      }
    }

    fetchCats()
  }, [])

  // Handle swipe completion
  const swiped = (direction, nameToDelete, index) => {
    console.log('Swiped:', direction, nameToDelete, index)
    setLastDirection(direction)
    
    const swipedCat = cats[index]
    
    if (direction === 'right') {
      console.log('Liking cat:', swipedCat.id, swipedCat.url)
      setLikedCats(prev => {
        const updated = [...prev, swipedCat]
        console.log('Liked cats so far:', updated.length, updated.map(c => ({ id: c.id, url: c.url })))
        return updated
      })
    }
    
    setCurrentIndex(prev => prev - 1)
  }

  // Handle swipe out of frame
  const outOfFrame = (name, index) => {
    console.log('Out of frame:', name, index)
  }

  // Handle swipe requirement fulfilled (for showing indicators)
  const handleSwipeRequirementFulfilled = (direction) => {
    setSwipeDirection(direction)
  }

  // Handle swipe requirement unfulfilled (for hiding indicators)
  const handleSwipeRequirementUnfulfilled = () => {
    setSwipeDirection(null)
  }

  // Programmatic swipe for buttons
  const swipe = async (dir) => {
    if (currentIndex < 0 || !childRefs.current[currentIndex]?.current) return
    
    await childRefs.current[currentIndex].current.swipe(dir)
  }

  const resetApp = () => {
    setCurrentIndex(TOTAL_CATS - 1)
    setLikedCats([])
    setLastDirection(undefined)
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
  if (currentIndex < 0) {
    return <Summary likedCats={likedCats} totalCats={cats.length} onReset={resetApp} />
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🐱 Paws & Preferences</h1>
        <p className="progress">
          {cats.length - currentIndex} / {cats.length}
        </p>
      </div>

      <div className="cards-container">
        {cats.map((cat, index) => (
          <TinderCard
            ref={childRefs.current[index]}
            className="swipe"
            key={cat.id}
            onSwipe={(dir) => swiped(dir, cat.id, index)}
            onCardLeftScreen={() => outOfFrame(cat.id, index)}
            onSwipeRequirementFulfilled={index === currentIndex ? handleSwipeRequirementFulfilled : undefined}
            onSwipeRequirementUnfulfilled={index === currentIndex ? handleSwipeRequirementUnfulfilled : undefined}
            preventSwipe={['up', 'down']}
          >
            <CatCard 
              cat={cat} 
              index={index} 
              swipeDirection={index === currentIndex ? swipeDirection : null}
            />
          </TinderCard>
        ))}
      </div>

      <div className="action-buttons">
        <button 
          className="dislike-btn" 
          onClick={() => swipe('left')}
          aria-label="Dislike"
        >
          ❌
        </button>
        <button 
          className="like-btn" 
          onClick={() => swipe('right')}
          aria-label="Like"
        >
          ❤️
        </button>
      </div>
    </div>
  )
}

export default App

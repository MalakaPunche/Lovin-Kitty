import React, { useState, useEffect, useMemo } from 'react'
import './App.css'
import TinderCard from 'react-tinder-card'
import CatCard from './components/CatCard'
import Summary from './components/Summary'
import LikeDislikeButton from './components/LikeDislikeButton'

const TOTAL_CATS = 15

function App() {
  const [cats, setCats] = useState([])
  const [currentIndex, setCurrentIndex] = useState(TOTAL_CATS - 1)
  const [likedCats, setLikedCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastDirection, setLastDirection] = useState()
  const [swipeDirection, setSwipeDirection] = useState(null)

  // Create refs for TinderCards
  const childRefs = useMemo(
    () => Array(TOTAL_CATS).fill(0).map(() => React.createRef()),
    []
  )

  // Fetch cat data from Cataas API
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catPromises = Array.from({ length: TOTAL_CATS }, async (_, index) => {
          try {
            const res = await fetch("https://cataas.com/cat?json=true", {
              headers: { Accept: "application/json" }
            })

            if (!res.ok) throw new Error("Failed to load cat")

            const data = await res.json()
            const imageUrl = data.url
              ? data.url.startsWith("http")
                ? data.url
                : `https://cataas.com${data.url}`
              : `https://cataas.com/cat/${data._id}`

            return {
              id: data._id || `fallback-${index}-${Date.now()}`,
              url: imageUrl,
              tags: data.tags || []
            }
          } catch (err) {
            console.error("Cat fetch failed:", err)
            return {
              id: `fallback-${index}-${Date.now()}`,
              url: `https://cataas.com/cat?${Date.now()}-${index}`,
              tags: []
            }
          }
        })

        const results = await Promise.all(catPromises)
        setCats(results)
        setLoading(false)
      } catch (err) {
        console.error("General fetching error:", err)
        setLoading(false)
      }
    }

    fetchCats()
  }, [])

  // Swipe handlers
  const swiped = (direction, catId, index) => {
    setLastDirection(direction)

    if (direction === "right") {
      setLikedCats(prev => [...prev, cats[index]])
    }

    setCurrentIndex(prev => prev - 1)
  }

  const outOfFrame = (id) => {
    console.log(id + " left the screen")
  }

  const handleSwipeRequirementFulfilled = (direction) => {
    setSwipeDirection(direction)
  }

  const handleSwipeRequirementUnfulfilled = () => {
    setSwipeDirection(null)
  }

  // Programmatic swipe
  const swipe = async (dir) => {
    if (currentIndex < 0) return
    const ref = childRefs[currentIndex].current
    if (ref) await ref.swipe(dir)
  }

  // Handle Like/Dislike toggle button clicks
  // const handleLikeDislike = (state) => {
  //   if (state === "liked" && currentIndex >= 0) {
  //     // Add current cat to likedCats
  //     setLikedCats(prev => [...prev, cats[currentIndex]])
  //   }
  const handleLikeDislike = async (state) => {
    if (currentIndex < 0) return
    
    // Determine swipe direction
    const direction = state === "liked" ? "right" : "left"
    
    // Trigger the swipe animation
    await swipe(direction)
    
    // The rest is handled by the swiped() callback
    // which already updates likedCats and currentIndex
  }
    // Move to next cat in both cases
  //   setCurrentIndex(prev => prev - 1)
  //   setSwipeDirection(null)
  // }

  // Reset app
  const resetApp = () => {
    window.location.reload()
  }

  // Loading screen
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

  // Summary screen
  if (currentIndex < 0) {
    return (
      <Summary 
        likedCats={likedCats} 
        totalCats={cats.length}
        onReset={resetApp} 
      />
    )
  }

  // Main UI
  return (
    <div className="app">
      <div className="header">
        <h1>🐾 Paws & Preferences</h1>
        <p className="progress">
          {cats.length - currentIndex} / {cats.length}
        </p>
      </div>

      <div className="cards-container">
        {cats.map((cat, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={cat.id}
            onSwipe={(dir) => swiped(dir, cat.id, index)}
            onCardLeftScreen={() => outOfFrame(cat.id)}
            onSwipeRequirementFulfilled={
              index === currentIndex ? handleSwipeRequirementFulfilled : undefined
            }
            onSwipeRequirementUnfulfilled={
              index === currentIndex ? handleSwipeRequirementUnfulfilled : undefined
            }
            preventSwipe={["up", "down"]}
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
        <LikeDislikeButton onChange={handleLikeDislike} />
      </div>


    </div>
  )
}

export default App

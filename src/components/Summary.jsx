import './Summary.css'

function Summary({ likedCats, totalCats, onReset }) {
  const likedCount = likedCats.length
  const percentage = Math.round((likedCount / totalCats) * 100)

  return (
    <div className="summary-container">
      <div className="summary-content">
        <h1>🎉 All Done!</h1>
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
            <h2>Your Favourite Kitties 🐱</h2>
            <div className="liked-cats-grid">
              {likedCats.map((cat, index) => (
                <div key={cat.id} className="liked-cat-card">
                  <img 
                    src={cat.url} 
                    alt={`Liked cat ${index + 1}`}
                    className="liked-cat-image"
                  />
                  <div className="liked-cat-overlay">
                    <span className="heart-icon">❤️</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-likes">
            <p>You didn't like any cats this time. 😿</p>
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


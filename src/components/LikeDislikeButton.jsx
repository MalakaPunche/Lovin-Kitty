import React, { useState } from 'react'
import { AiFillLike, AiFillDislike } from 'react-icons/ai'
import './LikeDislikeButton.css'

// export default function LikeDislikeButton({ onChange }) {
//   const [liked, setLiked] = useState(null) // null = none, true = liked, false = disliked

//   const handleLike = () => {
//     const newState = liked === true ? null : true
//     setLiked(newState)
//     if (onChange) onChange(newState ? 'liked' : 'none')
//   }

//   const handleDislike = () => {
//     const newState = liked === false ? null : false
//     setLiked(newState)
//     if (onChange) onChange(newState === false ? 'disliked' : 'none')
//   }

export default function LikeDislikeButton({ onChange }) {
    const handleLike = () => {
      if (onChange) onChange('liked')
    }
  
    const handleDislike = () => {
      if (onChange) onChange('disliked')
    }
  
    return (
      <div className="like-dislike-btn-group">
        <button className="dislike-btn" onClick={handleDislike}>
          <AiFillDislike size={40} />
        </button>
  
        <button className="like-btn" onClick={handleLike}>
          <AiFillLike size={40} />
        </button>
      </div>
    )
  }

//   return (
//     <div className="like-dislike-btn-group">
//       <button
//         className={`dislike-btn ${liked === false ? 'active' : ''}`}
//         onClick={handleDislike}
//       >
//         <AiFillDislike size={40} />
//       </button>

//       <button
//         className={`like-btn ${liked === true ? 'active' : ''}`}
//         onClick={handleLike}
//       >
//         <AiFillLike size={40} />
//       </button>
//     </div>
//   )
// }

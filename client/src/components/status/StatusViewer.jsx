import React from 'react'
import Stories from 'react-insta-stories';

const status = () => {
    const stories=[
        "https://i.pinimg.com/474x/85/59/09/855909df65727e5c7ba5e11a8c45849a.jpg",
        "https://i.pinimg.com/474x/85/59/09/855909df65727e5c7ba5e11a8c45849a.jpg",
        "https://i.pinimg.com/474x/85/59/09/855909df65727e5c7ba5e11a8c45849a.jpg",
        "https://i.pinimg.com/474x/85/59/09/855909df65727e5c7ba5e11a8c45849a.jpg",
        "https://i.pinimg.com/474x/85/59/09/855909df65727e5c7ba5e11a8c45849a.jpg"
    ]
  return (
    <Stories
			stories={stories}
			defaultInterval={1500}
			width={432}
			height={768}
		/>
  )
}

export default status
import React, { useEffect, useState } from 'react'
import { VStack, Spinner, Text, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Status from '../components/home/Status'
import HomePostCard from '../components/home/HomePostCard'
import axios from 'axios'
import AddStory from '../components/AddStory'

const Home = () => {
  const token = localStorage.getItem('tokenValue');
  const navigate = useNavigate()
  const [postData, setPostData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [statusArray, setStatusArray] = useState([])

  const checkLogin = async () => {
    if (token) {
      try {
        await axios.post('https://chit-chat-6id8.onrender.com/api/v1/user/verify', { token });
      } catch (error) {
        navigate('/login')
      }
    } else {
      navigate('/login')
    }
  };

  const getFollowingPosts = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('https://chit-chat-6id8.onrender.com/api/v1/followingposts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setPostData(response.data.result)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const getStatus = async () => {
    try {
      const { data } = await axios.get('https://chit-chat-6id8.onrender.com/api/v1/user/following/story', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setStatusArray(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    try {
      checkLogin().then(() => {
        getFollowingPosts()
        getStatus()
      })
    } catch (error) {
      navigate('/login')
    }
  }, []);

  return (
    <>
      <VStack display={'flex'}>
        <div className="scroll-container">
          <div className="status-wrapper">
            <HStack >
              <VStack w={'70px'} borderRadius={'50%'} >
                <AddStory />
              </VStack>
              {statusArray?.map((story, index) => (
                <VStack width={'70px'} cursor={'pointer'} key={index}>
                  <Status story={story} />
                  <Text textAlign={'center'} color={'cyan.700'} fontSize={'12px'} w={'60px'} noOfLines={1}>{story.userName}</Text>
                </VStack>
              ))}
            </HStack>
          </div>
        </div>
        {
          isLoading ? <Spinner color='cyan.700' /> : <>
            {postData.length > 0 ? (
              postData.map((data, i) => <HomePostCard post={data} key={i} />)
            ) : (
              <p>Follow users to see post</p>
            )}
          </>
        }
      </VStack>
    </>
  )
}

export default Home
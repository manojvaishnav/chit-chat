import React, { useEffect, useState } from 'react'
import { Box, Center, Grid, useToast, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import PostCard from '../components/PostCard'

const Explore = () => {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [postData, setPostData] = useState([])

  const getAllPosts = async () => {
    const yourBearerToken = localStorage.getItem('tokenValue')
    try {
      await axios.get('http://localhost:5000/api/v1/posts/', {
        headers: {
          'Authorization': `Bearer ${yourBearerToken}`
        }
      }).then((result) => {
        setPostData(result.data.result)
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something Went Wrong',
        description: "All field are required",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top"
      })
    }
  }

  useEffect(() => {
    getAllPosts().then(() => {
      setIsLoading(false)
    })
  }, [getAllPosts])
  return (
    <>
      <Center>
        <Box p={2}>
          <Grid templateColumns={['1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr 1fr']} gap={6}>
            {
              isLoading ? <Spinner color='cyan.700' /> :
                postData.map((data, i) => (
                  <PostCard post={data} key={i} />
                ))
            }
          </Grid>
        </Box>
      </Center>
    </>
  )
}

export default Explore
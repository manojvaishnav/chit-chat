import React, { useEffect, useState } from 'react'
import { Box, Center, Grid, Text } from '@chakra-ui/react'
import PostCard from '../components/PostCard'
import axios from 'axios'

const LikedPost = () => {
    const [postData, setPostData] = useState([])

    const getLikedPosts = async () => {
        const token = localStorage.getItem('tokenValue')
        try {
            await axios.get(`https://chit-chat-6id8.onrender.com/api/v1/posts/liked`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                setPostData(response.data.data.likedPost)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getLikedPosts()
    }, [])

    return (
        <Center>
            <Box p={2}>
                <Center>
                    <Text fontSize={['1xl', '2xl']} fontFamily={'cursive'}>Liked Posts</Text>
                </Center>
                {
                    postData.length > 0 ? <Center py={4}>
                        <Grid templateColumns={['1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr 1fr']} gap={6}>
                            {
                                postData?.map((data, i) => {
                                    return <PostCard post={data} key={i} />
                                })
                            }
                        </Grid>
                    </Center> : <Center py={4}>
                        <Text>No Liked post yet</Text>
                    </Center>
                }
            </Box>
        </Center>
    )
}

export default LikedPost
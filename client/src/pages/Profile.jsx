import { useEffect, useState } from 'react'
import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  HStack,
  Divider,
  AbsoluteCenter,
  Grid,
  useToast,
  Spinner
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import ListMenu from '../components/profile/ListMenu'
import axios from 'axios'
import PostCard from '../components/PostCard'
import EditProfile from '../components/EditProfile'

const Profile = () => {
  const { username } = useParams()
  const token = localStorage.getItem('tokenValue')
  const toast = useToast()
  const navigate = useNavigate()

  const [follow, setFollow] = useState(false)
  const [userDetail, setUserDetail] = useState("")
  const [postData, setPostData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [followersArray, setFollowersArray] = useState([])
  const [followingsArray, setFollowingsArray] = useState([])
  const loggedInUserId = localStorage.getItem('userId')

  const getUserProfile = async () => {
    const userId = localStorage.getItem('userId')
    try {
      await axios.get(`https://chit-chat-6id8.onrender.com/api/v1/user/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((result) => {
        setUserDetail(result.data.user)
        setPostData(result.data.post)
        setFollowersArray(result.data.user.followers)
        setFollowingsArray(result.data.user.following)
        const isUserAlreadyFollowed = result.data.user.followers.some(data => data._id === userId);
        setFollow(isUserAlreadyFollowed);
      })
    } catch (error) {
      toast({
        title: 'Something Went Wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top"
      })
    }
  }

  const handleFollowButton = async (userId) => {
    try {
      await axios.post(`https://chit-chat-6id8.onrender.com/api/v1/user/togglefollow/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      getUserProfile()
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something Went Wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top"
      })
    }
  }

  const handelDeletePost = async (postId) => {
    try {
      await axios.delete(`https://chit-chat-6id8.onrender.com/api/v1/post/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(() => {
        getUserProfile()
        toast({
          title: 'Post deleted',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: "top"
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleMessageButton = async () => {
    try {
      const { data } = await axios.post(`https://chit-chat-6id8.onrender.com/api/v1/chat`, { userId: userDetail._id }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const user = {
        _id: userDetail._id,
        name: userDetail.name,
        userName: userDetail.userName,
        profile: userDetail.profile
      }
      localStorage.setItem('selectedChat', JSON.stringify(user))
      navigate(`/inbox/${data.chat._id}`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserProfile().then(() => {
      setIsLoading(false)
    })
  }, [username])

  return (
    <Center py={6}>
      {isLoading ? <Spinner color='cyan.700' /> :
        <Box
          maxW={'700px'}
          w={'full'}
          bg={'white'}
          boxShadow={'2xl'}
          rounded={'md'}
          overflow={'hidden'}>
          <Image
            h={'200px'}
            w={'full'}
            src={
              'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
            }
            objectFit="cover"
            alt="Cover Image"
          />
          <Flex justify={'center'} mt={-12}>
            <Avatar
              size={'xl'}
              src={
                userDetail.profile
              }
              css={{
                border: '2px solid white',
              }}
            />
          </Flex>

          <Box p={6}>
            <Stack spacing={0} align={'center'} mb={5}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {userDetail.name}
              </Heading>
              <Text color={'gray.500'}>@{userDetail.userName}</Text>
            </Stack>

            <Stack direction={'row'} justify={'center'} spacing={6}>
              <Stack spacing={0} align={'center'}>
                <Text fontWeight={600}>{postData.length}</Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  Posts
                </Text>
              </Stack>
              <Stack spacing={0} align={'center'}>
                <Text fontWeight={600}>{followersArray.length}</Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  <ListMenu content={followersArray} name="Followers" />
                </Text>
              </Stack>
              <Stack spacing={0} align={'center'}>
                <Text fontWeight={600}>{followingsArray.length}</Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  <ListMenu content={followingsArray} name="Following" />
                </Text>
              </Stack>
            </Stack>
            <HStack>
              {userDetail._id === loggedInUserId ? <EditProfile getUserProfile={getUserProfile} /> : <>
                <Button
                  w={'full'}
                  mt={8}
                  bg={'cyan.700'}
                  color={'white'}
                  rounded={'md'}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  onClick={handleMessageButton}
                >
                  Messaage
                </Button>
                <Button
                  w={'full'}
                  mt={8}
                  bg={'cyan.700'}
                  color={'white'}
                  rounded={'md'}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }} onClick={() => { handleFollowButton(userDetail._id) }}>
                  {follow ? "Unfollow" : "Follow"}
                </Button>
              </>}
            </HStack>
          </Box>
          <Box p={6} pb={10}>
            <Box position='relative' padding='10'>
              <Divider />
              <AbsoluteCenter bg='white' px='4'>
                POSTS
              </AbsoluteCenter>
            </Box>
            <Box p={2}>
              {
                postData.length > 0 ? <Grid templateColumns={['1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr 1fr']} gap={6}>
                  {
                    isLoading ? <Spinner color='cyan.700' /> :
                      postData.map((data, i) => (
                        <PostCard post={data} key={i} handelDeletePost={handelDeletePost} />
                      ))
                  }
                </Grid> : <Text textAlign={'center'}>No post to show</Text>
              }
            </Box>
          </Box>
        </Box>}

    </Center>
  )
}

export default Profile

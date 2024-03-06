import { Avatar, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Stack, Text, VStack, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FcLike } from 'react-icons/fc'
import { FaRegHeart } from 'react-icons/fa6'

const LikesCard = ({ postId }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [likesArray, setLikesArray] = useState([])
    const userId = localStorage.getItem('userId')

    const getLikes = async () => {
        const token = localStorage.getItem('tokenValue')
        try {
            await axios.get(`https://chit-chat-6id8.onrender.com/api/v1/post/likes/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                setLikesArray(response.data.likes.likes)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const likeButton = async () => {
        const token = localStorage.getItem('tokenValue')
        try {
            await axios.post(`https://chit-chat-6id8.onrender.com/api/v1/post/togglelike/${postId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                getLikes()
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getLikes()
    }, [postId, getLikes])

    return (
        <>
            <VStack>
                <Button w={'40px'} h={'40px'} size={'10px'} onClick={likeButton}>
                    {likesArray.some(user => user._id === userId) ? <FcLike /> : <FaRegHeart />}
                </Button>
                <Text onClick={() => {
                    onOpen()
                    getLikes()
                }} cursor={'pointer'} color={'black'}>{likesArray.length} likes</Text>
            </VStack>
            <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} >
                <DrawerOverlay />
                <DrawerContent >
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>All Likes</DrawerHeader>
                    <DrawerBody>
                        {
                            likesArray.length > 0 ? <>
                                {likesArray?.map((data, i) => {
                                    return <Link to={`/profile/${data.userName}`} key={i}>
                                        <Stack mt={6} direction={'row'} spacing={4} alignItems={'inherit'}>
                                            <Avatar name={"/profile"} src={data.profile} />
                                            <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                                                <Text fontWeight={600}>{data.name}</Text>
                                                <Text fontWeight={400}>@{data.userName}</Text>
                                            </Stack>
                                        </Stack>
                                    </Link>
                                })}
                            </> : <Text>No Likes Yet</Text>
                        }
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default LikesCard
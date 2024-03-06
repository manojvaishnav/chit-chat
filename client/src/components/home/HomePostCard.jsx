import React, { useState } from 'react'
import {
    Box,
    Heading,
    Text,
    Flex,
    Center,
    CardHeader,
    Avatar,
    CardBody,
    Image,
    Button,
    Card,
    HStack,
    useColorModeValue,
    InputGroup,
    Input,
    InputRightElement,
    useToast,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerHeader,
    DrawerBody,
    DrawerContent,
    DrawerCloseButton,
    IconButton,
    Stack,
    VStack,
} from '@chakra-ui/react'
import { FaRegComment } from 'react-icons/fa6'
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom'
import axios from 'axios';
import LikesCard from '../LikesCard';
import SavePostButton from '../SavePostButton';


const PostCard = ({ post, handelDeletePost }) => {
    const toast = useToast()
    const token = localStorage.getItem('tokenValue')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [commentButton, setCommentButton] = useState(false)
    const [commentText, setCommentText] = useState("")
    const [commentsArray, setCommentsArray] = useState([])

    const getComments = async (postId) => {
        try {
            await axios.get(`http://localhost:5000/api/v1/post/comment/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                setCommentsArray(response.data.comment.comments)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handlePostCommentButton = async (commentId) => {
        if (!commentText) {
            return toast({
                title: 'Please add a comment',
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: "top"
            })
        }
        try {
            await axios.post(`http://localhost:5000/api/v1/post/comment/${commentId}`, { comment: commentText }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                toast({
                    title: 'Comment Added Successfully',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: "top"
                })
                setCommentText("")
                setCommentButton(false)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteComment = async (postId, commentId) => {
        const token = localStorage.getItem('tokenValue')
        try {
            await axios.delete(`http://localhost:5000/api/v1/post/comment/${postId}/${commentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                toast({
                    title: 'Comment deleted',
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

    return (
        <>
            <Center py={6}>
                <Card maxW='md' w={['300px', '350px', '450px']} maxH={'full'} border={'1px solid black'}>
                    <CardHeader>
                        <Box
                            w={'full'}
                        >
                            <Flex w={'full'}>
                                <Box
                                    w={'full'}
                                    transition="0.3s ease"
                                    bg={useColorModeValue('white', 'gray.900')}

                                    borderRadius={'10px'}
                                    _hover={{
                                        bg: 'cyan.700',
                                        color: 'white',
                                    }}>

                                    <Link to={`/profile/${post.postedBy.userName}`} minH='48px' style={{ textDecoration: 'none', width: "100%" }}>
                                        <Box p={2}>
                                            <Flex flex='1' gap='4' alignItems='center' >
                                                <Avatar name={post.postedBy.name} src={post.postedBy.profile} />
                                                <Box>
                                                    <Heading size='sm' noOfLines={1}>{post.postedBy.userName}</Heading>
                                                    <Text fontSize={'14px'} noOfLines={1}>{new Date(post.createdAt).toLocaleString()}</Text>
                                                </Box>
                                            </Flex>
                                        </Box>
                                    </Link>
                                </Box>
                                {
                                    post.postedBy._id === localStorage.getItem('userId') ? <IconButton icon={<MdDelete />} onClick={() => {
                                        handelDeletePost(post._id)
                                        onClose()
                                    }} /> : ""
                                }
                            </Flex>
                        </Box>
                    </CardHeader>
                    <CardBody>
                        <Box>
                            <Box h={['150px', '200px']} >
                                <Image w={'full'} h={'full'} objectFit={'cover'} src={post.photo} />
                            </Box>
                            <Box mt={'10px'}>
                                <HStack alignItems={'inherit'}>
                                    <Box>
                                        <VStack>
                                            <LikesCard postId={post._id} />
                                        </VStack>
                                    </Box>
                                    <Box>
                                        <Button w={'40px'} h={'40px'} size={'10px'} onClick={() => { setCommentButton(!commentButton) }}>
                                            <FaRegComment />
                                        </Button>
                                    </Box>
                                    <Box>
                                        <SavePostButton postId={post._id} />
                                    </Box>
                                </HStack>
                            </Box>
                            <Box mt={'10px'}>
                                <Text >
                                    @{post.postedBy.userName}~ {post.description}
                                </Text>
                            </Box>
                        </Box>
                        <Box w={'full'} mt={'10px'}>
                            {
                                commentButton ? <>
                                    <Text>Add a comment</Text>
                                    <InputGroup size='md'>
                                        <Input
                                            pr='4.5rem'
                                            type='text'
                                            placeholder='Enter comment'
                                            value={commentText}
                                            onChange={(e) => { setCommentText(e.target.value) }}
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <Button
                                                h='1.75rem'
                                                size='sm'
                                                _hover={{
                                                    bg: 'cyan.700',
                                                    color: 'white',
                                                }}
                                                onClick={() => { handlePostCommentButton(post._id) }}
                                            >
                                                Post
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </> : ""
                            }
                            <Box mt={'10px'} textDecoration={'underline'} color={'cyan.700'}>
                                <Text cursor={'pointer'} onClick={() => {
                                    onOpen()
                                    getComments(post._id)
                                }}>View All Comments</Text>
                                <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} >
                                    <DrawerOverlay />
                                    <DrawerContent >
                                        <DrawerCloseButton />
                                        <DrawerHeader borderBottomWidth='1px'>All Comments</DrawerHeader>
                                        <DrawerBody>
                                            {
                                                commentsArray.length > 0 ? <>
                                                    {commentsArray?.map((data) => {
                                                        return <Stack mt={6} direction={'row'} spacing={4} justifyContent={'space-between'} alignItems={'inherit'}>
                                                            <HStack alignItems={'baseline'}>
                                                                <Link to={`/profile/${data.postedBy.userName}`}>
                                                                    <Avatar name={"/profile"} src={data.postedBy.profile} />
                                                                </Link>
                                                                <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                                                                    <Link to={`profile/${data.postedBy.userName}`}>
                                                                        <Text fontWeight={600}>@{data.postedBy.userName}</Text>
                                                                    </Link>
                                                                    <Text color={'gray.500'}>{data.comment}</Text>
                                                                </Stack>
                                                            </HStack>
                                                            {
                                                                data.postedBy._id === localStorage.getItem('userId') ? <IconButton onClick={() => {
                                                                    handleDeleteComment(post._id, data._id)
                                                                    onClose()
                                                                }} icon={<MdDelete />} /> : ""
                                                            }
                                                        </Stack>
                                                    })}
                                                </> : <Text textAlign={'center'}>No comments yet</Text>
                                            }
                                        </DrawerBody>
                                    </DrawerContent>
                                </Drawer>
                            </Box>
                        </Box>
                    </CardBody>
                </Card>
            </Center>
        </>
    )
}

export default PostCard



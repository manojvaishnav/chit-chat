import { Avatar, Box, Button, Center, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, Spinner, IconButton } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { MdDelete } from "react-icons/md";

const Status = ({ story, handleStatusDelete }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [storyText, setStoryText] = useState("")
    const [storyFont, setStoryFont] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const token = localStorage.getItem('tokenValue')

    const getStatusButton = async (storyId) => {
        onOpen()
        setIsLoading(true)
        const { data } = await axios.get(`https://chit-chat-6id8.onrender.com/api/v1/user/story/${storyId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        setStoryText(data.data.storyText)
        setStoryFont(data.data.textFont)
        setIsLoading(false)
    }

    return (
        <>
            <Center w='60px' h='60px' borderRadius={'50%'} color='white'>
                <Avatar
                    src={story.profile}
                    height={'full'}
                    width={'full'}
                    alignSelf={'center'}
                    onClick={() => getStatusButton(story.story)}
                />
            </Center>
            <Modal onClose={onClose} isOpen={isOpen} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    {
                        story._id ? <ModalHeader>
                            <IconButton onClick={() => handleStatusDelete(story.story)} icon={<MdDelete />} />
                        </ModalHeader> : ""
                    }
                    <ModalBody >
                        <Link to={`/profile/${story.userName}`} >
                            <Box p={2}>
                                <Flex flex='1' gap='4' alignItems='center'>
                                    <Avatar name={story.profile} src={story.profile} />
                                    <Box>
                                        <Heading size='sm' noOfLines={1}>{story.name}</Heading>
                                        <Text noOfLines={1}>@{story.userName}</Text>
                                    </Box>
                                </Flex>
                            </Box>
                        </Link>
                        <Center py={6} border={'1px solid'} borderColor={'cyan.700'}>
                            {isLoading ? <Spinner color='cyan.700' /> : <Text fontFamily={storyFont}>
                                {storyText}
                            </Text>}
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Status
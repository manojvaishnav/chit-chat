import { Button, Center, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Text, Textarea, VStack, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { IoIosAddCircle } from 'react-icons/io'
import axios from 'axios'
import Status from './home/Status'

const AddStory = () => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [storyText, setStoryText] = useState("")
    const [fontValue, setFontValue] = useState('monospace')
    const [expireTime, setExpireTime] = useState('1')
    const [story, setStory] = useState(null)
    const [storyId, setStoryId] = useState(null)
    const token = localStorage.getItem('tokenValue')

    const handlePostStoryButton = async () => {
        onClose()
        try {
            await axios.post(`https://chit-chat-6id8.onrender.com/api/v1/user/story`, {
                storyText: storyText,
                textFont: fontValue,
                expire: expireTime
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                toast({
                    title: 'Story post successfully',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'top'
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getStory = async () => {
        try {
            await axios.get(`https://chit-chat-6id8.onrender.com/api/v1/user/story/login/story`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                setStory(response.data.data)
                setStoryId(response.data.data.story)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleStatusDelete = async (storyId) => {
        try {
            await axios.delete(`https://chit-chat-6id8.onrender.com/api/v1/user/story/${storyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                getStory()
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getStory()
    }, [handlePostStoryButton, getStory])

    return (
        <>{
            storyId ? <>
                <VStack width={'70px'} cursor={'pointer'}>
                    <Status story={story} handleStatusDelete={handleStatusDelete} />
                    <Text textAlign={'center'} color={'cyan.700'} fontSize={'12px'} w={'60px'} noOfLines={1}>Your Story</Text>
                </VStack>
            </> : <>
                <Center w='60px' h='60px' borderRadius={'50%'} color='white'>
                    <IconButton onClick={onOpen} w={'full'} h={'full'} fontSize={'60px'} icon={<IoIosAddCircle />} />
                </Center>
                <Text textAlign={'center'} color={'cyan.700'} fontSize={'12px'} w={'60px'} noOfLines={1}>Add story</Text>

                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add Story</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack>
                                <Textarea placeholder='Enter story text' value={storyText} onChange={(e) => { setStoryText(e.target.value) }} fontFamily={fontValue} />
                                <Text>Font Style</Text>
                                <RadioGroup onChange={setFontValue} value={fontValue}>
                                    <Stack direction='row'>
                                        <Radio value='monospace'><Text fontFamily={'monospace'}>Monospace</Text></Radio>
                                        <Radio value='cursive'><Text fontFamily={'cursive'}>Cursive</Text></Radio>
                                        <Radio value='fantasy'><Text fontFamily={'fantasy'}>Fantasy</Text></Radio>
                                        <Radio value='sans-serif'><Text fontFamily={'sans-serif'}>Sans-Serif</Text></Radio>
                                    </Stack>
                                </RadioGroup>
                                <Text>Expiration Time</Text>
                                <RadioGroup onChange={setExpireTime} value={expireTime}>
                                    <Stack direction='row'>
                                        <Radio value='1'>1 Day</Radio>
                                        <Radio value='2'>2 Day</Radio>
                                        <Radio value='3'>3 Day</Radio>
                                        <Radio value='4'>4 Day</Radio>
                                    </Stack>
                                </RadioGroup>
                            </Stack>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={handlePostStoryButton}>
                                Post Story
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        }

        </>

    )
}

export default AddStory
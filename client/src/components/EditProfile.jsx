import { Avatar, Button, Center, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const EditProfile = ({ getUserProfile }) => {
    const { username } = useParams()
    const toast = useToast()
    const token = localStorage.getItem('tokenValue')
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [name, setName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userProfile, setUserProfile] = useState("")
    const [viewImage, setViewImage] = useState(null)


    const getUserDetail = async () => {
        try {
            await axios.get(`http://localhost:5000/api/v1/user/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((result) => {
                setUserEmail(result.data.user.email)
                setName(result.data.user.name)
                setUserProfile(result.data.user.profile)
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

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setUserProfile(event.target.files[0])

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setViewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setViewImage(null);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const form = new FormData();
            form.append('name', name)
            form.append('email', userEmail)
            form.append('profile', userProfile)

            await axios.put('http://localhost:5000/api/v1/user/', form, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                const { name, email, userName, profile, _id } = response.data.user
                localStorage.setItem('userName', name)
                localStorage.setItem('userEmail', email)
                localStorage.setItem('userUsername', userName)
                localStorage.setItem('userProfile', profile)
                localStorage.setItem('userId', _id)
                onClose()
                getUserProfile()
                toast({
                    title: 'Profile update successfully',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'top'
                })
            })

        } catch (error) {
            console.log(error)
            toast({
                title: 'Something went wrong',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }
    }

    return (
        <>
            <Button w={'full'}
                mt={8}
                bg={'cyan.700'}
                color={'white'}
                rounded={'md'}
                _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                }} onClick={() => {
                    getUserDetail()
                    onOpen()
                }}>Edit Profile</Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl id="fileInput">
                            <FormLabel>Profile Image</FormLabel>
                            <Stack direction={['column', 'row']} spacing={6}>
                                <Center>
                                    <Avatar size="xl" src={viewImage ? viewImage : userProfile}>
                                    </Avatar>
                                </Center>
                                <Center w="full">
                                    <Button as={FormLabel} w="full">Change Profile</Button>
                                    <Input id='fileInput' display={'none'} type='file' accept="image/png, image/gif, image/jpeg" isRequired onChange={handleFileInputChange} />
                                </Center>
                            </Stack>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                type='text'
                                placeholder='Full name'
                                isRequired
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                }} />
                        </FormControl>
                        <FormControl mt={4} >
                            <FormLabel>Email</FormLabel>
                            <Input
                                type='email'
                                placeholder='Email'
                                value={userEmail}
                                onChange={(e) => {
                                    setUserEmail(e.target.value)
                                }} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleProfileUpdate}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default EditProfile





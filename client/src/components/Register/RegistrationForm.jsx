import React, { useState } from 'react'
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
    useToast,
    FormErrorMessage,
    Spinner
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RegistrationForm = () => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [profile, setProfile] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [viewImage, setViewImage] = useState(null)
    const navigate = useNavigate()
    const toast = useToast()

    const [isValidUserName, setIsValidUserName] = useState(true);

    const validateUserName = (input) => {
        const regex = /^[a-z0-9]+$/;
        return regex.test(input);
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setProfile(event.target.files[0])

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

    const handleRegistrationButton = async () => {
        if (!email || !password || !name || !userName || !profile) {
            toast({
                title: 'All Field Are Required',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        } else {
            setIsLoading(true)
            try {
                const form = new FormData();
                form.append('name', name)
                form.append('userName', userName)
                form.append('email', email)
                form.append('password', password)
                form.append('profile', profile)

                const result = await axios.post('https://chit-chat-6id8.onrender.com/api/v1/user/signup', form)
                if (result.data.user) {
                    const { name, email, userName, profile, _id } = result.data.user
                    const { token } = result.data
                    localStorage.setItem('tokenValue', token)
                    localStorage.setItem('userName', name)
                    localStorage.setItem('userEmail', email)
                    localStorage.setItem('userUsername', userName)
                    localStorage.setItem('userProfile', profile)
                    localStorage.setItem('userId', _id)
                }
                toast({
                    title: 'Registration Successfully',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'top'
                })
                setTimeout(() => {
                    navigate('/');
                }, 1000);
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
            setIsLoading(false)
        }
    }

    return (
        <>
            {
                isLoading ? <Center h={'100vh'}><Spinner color='cyan.700' /></Center> : <Flex
                    minH={'100vh'}
                    align={'center'}
                    justify={'center'}
                    bg={'gray.50'}>
                    <Stack
                        spacing={4}
                        w={'full'}
                        maxW={'md'}
                        bg={'white'}
                        rounded={'xl'}
                        boxShadow={'lg'}
                        p={6}
                        my={12}>
                        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                            Registration Form
                        </Heading>
                        <FormControl id="fileInput" isRequired>
                            <FormLabel>Profile Image</FormLabel>
                            <Stack direction={['column', 'row']} spacing={6}>
                                <Center>
                                    <Avatar size="xl" src={viewImage ? viewImage : "https://png.pngtree.com/png-vector/20231201/ourmid/pngtree-round-button-in-cyan-and-blue-colors-for-user-png-image_10806433.png"}>
                                    </Avatar>
                                </Center>
                                <Center w="full">
                                    <Button as={FormLabel} w="full">Change Profile</Button>
                                    <Input id='fileInput' display={'none'} type='file' accept="image/png, image/gif, image/jpeg" isRequired onChange={handleFileInputChange} />
                                </Center>
                            </Stack>
                        </FormControl>
                        <FormControl id="name" isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input
                                placeholder="Name"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                isRequired
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                            />
                        </FormControl>
                        <FormControl id="userName" isRequired isInvalid={!isValidUserName}>
                            <FormLabel>User name</FormLabel>
                            <Input
                                placeholder="UserName"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                isRequired
                                value={userName}
                                onChange={(e) => {
                                    setUserName(e.target.value)
                                    setIsValidUserName(validateUserName(e.target.value))
                                }}
                            />
                            <FormErrorMessage>
                                {isValidUserName ? "" : "Username should contain only lowercase letters and numbers without spaces."}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                placeholder="your-email@example.com"
                                _placeholder={{ color: 'gray.500' }}
                                type="email"
                                value={email}
                                isRequired
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                placeholder="password"
                                _placeholder={{ color: 'gray.500' }}
                                type="password"
                                value={password}
                                isRequired
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handleRegistrationButton();
                                    }
                                }}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                        </FormControl>
                        <Stack spacing={6} direction={['column', 'row']}>
                            <Button
                                bg={'red.400'}
                                color={'white'}
                                w="full"
                                _hover={{
                                    bg: 'red.500',
                                }}

                                onClick={() => { navigate('/login') }}
                            >
                                Login?
                            </Button>
                            <Button
                                bg={'cyan.700'}
                                color={'white'}
                                w="full"
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleRegistrationButton}
                            >
                                Register
                            </Button>
                        </Stack>
                    </Stack>
                </Flex>
            }

        </>
    )
}

export default RegistrationForm
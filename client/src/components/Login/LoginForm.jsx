import React, { useState } from 'react'
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useToast,
  InputGroup,
  InputRightElement,
  Spinner,
  Center
} from '@chakra-ui/react'
import { avatars } from '../../Data/AvtarsHome'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import ForgotPassword from '../ForgotPassword'

const LoginForm = () => {
  const toast = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLoginButton = async () => {
    setIsLoading(true)
    try {
      const result = await axios.post('http://localhost:5000/api/v1/user/signin', { email, password })
      if (result.data.user) {
        const { name, email, userName, profile, _id } = result.data.user
        const { token } = result.data
        localStorage.setItem('tokenValue', token)
        localStorage.setItem('userName', name)
        localStorage.setItem('userEmail', email)
        localStorage.setItem('userUsername', userName)
        localStorage.setItem('userProfile', profile)
        localStorage.setItem('userId', _id)
        toast({
          title: 'Login Successfully',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'top'
        })
        navigate('/');
      }
    } catch (error) {
      toast({
        title: error.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    }
    setIsLoading(false)
  }

  return (
    <>
      {
        isLoading ? <Center py={6} h={'100vh'}><Spinner /></Center> : <Box position={'relative'}>
          <Container
            as={SimpleGrid}
            maxW={'7xl'}
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 10, lg: 32 }}
            py={{ base: 10, sm: 20, lg: 32 }}>
            <Stack spacing={{ base: 10, md: 20 }}>
              <Heading
                lineHeight={1.1}
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
                The All{' '}
                <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                  New
                </Text>{' '}
                ChitChat
              </Heading>
              <Stack direction={'row'} spacing={4} align={'center'}>
                <AvatarGroup>
                  {avatars.map((avatar) => (
                    <Avatar
                      key={avatar.name}
                      name={avatar.name}
                      src={avatar.profile}
                      size={['md', 'lg']}
                      position={'relative'}
                      zIndex={2}
                      _before={{
                        content: '""',
                        width: 'full',
                        height: 'full',
                        rounded: 'full',
                        transform: 'scale(1.125)',
                        bgGradient: 'linear(to-bl, red.400,pink.400)',
                        position: 'absolute',
                        zIndex: -1,
                        top: 0,
                        left: 0,
                      }}
                    />
                  ))}
                </AvatarGroup>
                <Text fontFamily={'heading'} fontSize={{ base: '4xl', md: '6xl' }}>
                  +
                </Text>
                <Flex
                  align={'center'}
                  justify={'center'}
                  fontFamily={'heading'}
                  fontSize={{ base: 'sm', md: 'lg' }}
                  bg={'gray.800'}
                  color={'white'}
                  rounded={'full'}
                  minWidth={['44px', '60px']}
                  minHeight={['44px', '60px']}
                  position={'relative'}
                  _before={{
                    content: '""',
                    width: 'full',
                    height: 'full',
                    rounded: 'full',
                    transform: 'scale(1.125)',
                    bgGradient: 'linear(to-bl, orange.400,yellow.400)',
                    position: 'absolute',
                    zIndex: -1,
                    top: 0,
                    left: 0,
                  }}>
                  YOU
                </Flex>
              </Stack>
            </Stack>
            <Stack
              bg={'gray.50'}
              rounded={'xl'}
              p={{ base: 4, sm: 6, md: 8 }}
              spacing={{ base: 8 }}
              maxW={{ lg: 'lg' }}>
              <Stack spacing={4}>
                <Heading
                  color={'gray.800'}
                  lineHeight={1.1}
                  fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                  Login Here
                  <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                    !
                  </Text>
                </Heading>
              </Stack>
              <Box as={'form'} mt={10}>
                <Stack spacing={4}>
                  <Input
                    type='email'
                    placeholder="Email"
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    isRequired
                    _placeholder={{
                      color: 'gray.500',
                    }}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                  />
                  <InputGroup>
                    <Input placeholder="Password"
                      bg={'gray.100'}
                      border={0}
                      color={'gray.500'}
                      isRequired
                      _placeholder={{
                        color: 'gray.500',
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleLoginButton();
                        }
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'} />
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={() => setShowPassword((showPassword) => !showPassword)} size={'50px'}>
                        {showPassword ? <IoEyeSharp /> : <IoEyeOffSharp />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </Stack>
                <Button
                  fontFamily={'heading'}
                  mt={8}
                  w={'full'}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  color={'white'}
                  _hover={{
                    bgGradient: 'linear(to-r, red.400,pink.400)',
                    boxShadow: 'xl',
                  }}
                  onClick={() => {
                    handleLoginButton()
                  }}

                >
                  Submit
                </Button>
                <Stack pt={6}>
                  <ForgotPassword />
                </Stack>
              </Box>
              <Stack
                bg={'gray.50'}
                rounded={'xl'}
                p={{ base: 4, sm: 6, md: 8 }}
                spacing={{ base: 8 }}
                maxW={{ lg: 'lg' }}
                border={'1px  solid black'}>
                <Text align={'center'}>
                  Don't have an account? <Link to={'/register'} style={{ textDecoration: 'none', color: '#F06590' }} color={'blue.400'}>Sign up</Link>
                </Text>
              </Stack>
            </Stack>
          </Container>
        </Box>
      }
    </>

  )
}

export default LoginForm


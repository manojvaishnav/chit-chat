import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")


  const handleSubmitButton = async () => {
    if (password !== confirmPassword) {
      return toast({
        title: 'Password & confirm password are not equal',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: "top"
      })
    }
    if (!password || !confirmPassword) {
      return toast({
        title: 'All field are required',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: "top"
      })
    }
    try {
      const form = new FormData()
      form.append('token', token)
      form.append('newPassword', password)
      await axios.post(`https://chit-chat-6id8.onrender.com/api/v1/user/password/reset-password`, form).then(() => {
        toast({
          title: 'Password Changed',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: "top"
        })
        navigate('/login')
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something went wrong',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: "top"
      })
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Password Reset
        </Heading>
        <FormControl id="password" isRequired>
          <FormLabel>New Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
            <InputRightElement h={'full'}>
              <Button
                variant={'ghost'}
                onClick={() => setShowPassword((showPassword) => !showPassword)} size={'50px'}>
                {showPassword ? <IoEyeSharp /> : <IoEyeOffSharp />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="cpassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type='password'
            placeholder="Enter password"
            _placeholder={{ color: 'gray.500' }}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
            }}
          />
        </FormControl>

        <Stack spacing={6}>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
            onClick={handleSubmitButton}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default ResetPassword
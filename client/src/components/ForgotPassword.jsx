import {
    Button,
    FormControl,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
    ModalBody,
    ModalContent,
    ModalCloseButton,
    ModalOverlay,
    Modal,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'

const ForgotPassword = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const [email, setEmail] = useState("")

    const handlePasswordResetButton = async () => {
        if (!email) {
            return toast({
                title: 'Email is required',
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: "top"
            })
        }
        try {
            const form = new FormData()
            form.append('email', email)
            await axios.post(`https://chit-chat-6id8.onrender.com/api/v1/user/password/forgot-password`, form).then(() => {
                toast({
                    title: 'Reset link sent',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: "top"
                })
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
        <>
            <Text cursor={'pointer'} align={'center'} onClick={onOpen}>
                Forgot Password?
            </Text>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton _hover={
                        { bg: 'cyan.700' }
                    } />
                    <ModalBody>
                        <Flex
                            align={'center'}
                            justify={'center'}
                        >
                            <Stack
                                spacing={4}
                                w={'full'}
                                maxW={'md'}
                                rounded={'xl'}
                                p={6}
                                my={12}>
                                <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                                    Forgot your password?
                                </Heading>
                                <Text
                                    fontSize={{ base: 'sm', sm: 'md' }}
                                    color={useColorModeValue('gray.800', 'gray.400')}>
                                    You&apos;ll get an email with a reset link
                                </Text>
                                <FormControl id="email">
                                    <Input
                                        placeholder="your-email@example.com"
                                        _placeholder={{ color: 'gray.500' }}
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FormControl>
                                <Stack spacing={6}>
                                    <Button
                                        bg={'cyan.700'}
                                        color={'white'}
                                        _hover={{
                                            bg: 'pink.400',
                                        }}
                                        onClick={() => {
                                            handlePasswordResetButton()
                                            onClose()
                                        }}
                                    >
                                        Request Reset
                                    </Button>
                                </Stack>
                            </Stack>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    )
}

export default ForgotPassword
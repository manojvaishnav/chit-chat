import { useState } from 'react'
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  SimpleGrid,
  Textarea,
  Center,
  Container,
  VStack,
  Text,
  useToast,
  Image,
  Spinner,
} from '@chakra-ui/react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const loggedInUser = localStorage.getItem('userUsername')

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(50)
  const [desc, setDesc] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleReupload = () => {
    setFile(null)
    setPreview(null)
  }

  const handleCreatePostButton = async () => {
    if (!desc || !file) {
      return toast({
        title: 'Please Fill All Field',
        description: "All field are required",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top"
      })
    }
    try {
      setIsLoading(true)
      const bearerToken = localStorage.getItem('tokenValue')
      const form = new FormData()
      form.append('description', desc)
      form.append('photo', file)
      const result = await axios.post('https://chit-chat-6id8.onrender.com/api/v1/post/', form, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        }
      })
      toast({
        title: result.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top"
      })
      setIsLoading(false)
      navigate(`/profile/${loggedInUser}`)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something Went Wrong',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top"
      })
    }
  }

  return (
    <>
      {
        isLoading ? <Center py={6}><Spinner color='cyan.700' /></Center> : <Box
          borderWidth="1px"
          rounded="lg"
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          p={6}
          m="10px auto"
          as="form">
          <Center py={2}>
            <Text fontSize={'2xl'} fontFamily={'cursive'}>Create A Post</Text>
          </Center>
          <Progress colorScheme='cyan' hasStripe value={progress} mb="5%" mx="5%" isAnimated></Progress>
          {step === 1 ? <>
            <Center>
              <Container>
                {file ? <Center>
                  <VStack>
                    <Image w={'150px'} h={'150px'} src={preview} />
                    <Text cursor={'pointer'} textDecoration={'underline'} onClick={handleReupload}>Reupload?</Text>
                  </VStack>
                </Center>
                  :
                  <label htmlFor="fileInput">
                    <FormControl as={GridItem} colSpan={6}>
                      <VStack cursor="pointer">
                        <Container display={'flex'} alignItems={'center'} justifyContent={'center'}>
                          <FaCloudUploadAlt size={'50px'} />
                        </Container>
                        <Text>Upload A File</Text>
                        <Input id="fileInput" border={'none'} display={'none'} type='file' accept="image/png, image/gif, image/jpeg" onChange={handleUpload} required />
                      </VStack>
                    </FormControl>
                  </label>}
              </Container>
            </Center>
          </> : <>
            <SimpleGrid columns={1} spacing={6}>
              <FormControl id="email" mt={1}>
                <FormLabel
                  fontSize="sm"
                  fontWeight="md"
                  color="gray.700"
                  _dark={{
                    color: 'gray.50',
                  }}>
                  Caption
                </FormLabel>
                <Textarea
                  placeholder="Enter Here"
                  rows={3}
                  shadow="sm"
                  focusBorderColor="brand.400"
                  fontSize={{
                    sm: 'sm',
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCreatePostButton();
                    }
                  }}
                  onChange={(event) => {
                    setDesc(event.target.value)
                  }}
                />
              </FormControl>
            </SimpleGrid>
          </>}
          <ButtonGroup mt="5%" w="100%">
            <Flex w="100%" justifyContent="space-between">
              <Flex>
                <Button
                  onClick={() => {
                    setStep(step - 1)
                    setProgress(progress - 50)
                  }}
                  isDisabled={step === 1}
                  display={step === 1 ? 'none' : 'block'}
                  bg={'cyan.400'}
                  _hover={{ bg: "cyan.700" }}
                  variant="solid"
                  w="7rem"
                  mr="5%">
                  Back
                </Button>
                <Button
                  w="7rem"
                  isDisabled={step === 2}
                  display={step === 2 ? 'none' : 'block'}
                  onClick={() => {
                    setStep(step + 1)
                    setProgress(100)
                  }}
                  bg={'cyan.400'}
                  _hover={{ bg: "cyan.700" }}
                  variant="outline">
                  Next
                </Button>
              </Flex>
              {step === 2 ? (
                <Button
                  w="7rem"
                  variant="solid"
                  bg={'cyan.400'}
                  _hover={{ bg: "cyan.700" }}
                  onClick={handleCreatePostButton}>
                  Post
                </Button>
              ) : null}
            </Flex>
          </ButtonGroup>
        </Box>
      }

    </>
  )
}

export default CreatePost
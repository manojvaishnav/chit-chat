import React, { useEffect, useState } from 'react'
import MessageCard from '../components/MessageCard'
import { Box, Center, Divider, Spinner, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import axios from 'axios'

const Messages = () => {

  const [messageList, setMessageList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchChats = async () => {
    const token = localStorage.getItem('tokenValue')
    try {
      setIsLoading(true)
      await axios.get(`https://chit-chat-6id8.onrender.com/api/v1/chat`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((response) => {
        setMessageList(response.data.chat)
      })
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchChats()
  }, [])

  return (
    <>
      <Center py={6}>
        <Box maxW={'500px'}
          w={'full'}
          h={'500px'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'md'}
          overflowY={'scroll'}>
          <VStack w={'full'} p={2}>
            <Text w={'full'} pl={'10px'} fontSize='2xl' fontFamily={'cursive'}>Messages</Text>
            <Divider />
            <VStack w={'full'} h={'100%'}>
              {
                isLoading ? <Spinner color='cyan.700' /> : <>
                  {
                    messageList.length > 0 ? <>
                      {messageList?.map((data, i) => {
                        return <MessageCard content={data} key={i} />
                      })}
                    </> : (<Text>No Message Found</Text>)
                  }
                </>
              }

            </VStack>
          </VStack>
        </Box>
      </Center>
    </>
  )
}

export default Messages
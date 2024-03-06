import { Box, Card, Center, Flex, Text, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Divider from "../components/chat/Divider";
import Footer from "../components/chat/Footer";
import Header from "../components/chat/Header";
import Messages from "../components/chat/Messages";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackOutline } from 'react-icons/io5';
import axios from "axios";
import { io } from 'socket.io-client'

const ENDPOINT = 'https://chit-chat-6id8.onrender.com';

var socket, selectedChatCompare;

const Chat = () => {
  const { chatId } = useParams()
  const token = localStorage.getItem('tokenValue')
  const loggedUser = localStorage.getItem('userId')

  const [userDetail, setUserDetail] = useState(JSON.parse(localStorage.getItem('selectedChat')));
  const [messages, setMessages] = useState([]);
  // const [arr, setArr] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendIsLoading, setSendIsLoading] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', loggedUser)
    socket.on('connection', () => {
      setSocketConnected(true)
    })
  }, [])

  const fetchAllMessages = async () => {
    try {
      const { data } = await axios.get(`https://chit-chat-6id8.onrender.com/api/v1/message/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setMessages(data.messages)
      socket.emit('join chat', chatId)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim().length) {
      return;
    }
    try {
      setSendIsLoading(true)
      const form = new FormData()
      form.append('content', inputMessage)
      form.append('chatId', chatId)
      const { data } = await axios.post(`https://chit-chat-6id8.onrender.com/api/v1/message/`, form, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setInputMessage("")
      socket.emit('new message', data)
    } catch (error) {
      console.log(error)
    }
    fetchAllMessages()
    setSendIsLoading(false)
  };

  useEffect(() => {
    setIsLoading(true)
    fetchAllMessages().then(() => {
      setIsLoading(false)
    })
    selectedChatCompare = chatId
  }, [userDetail])

  useEffect(() => {
    const handleNewMessage = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare !== newMessageReceived.chat.chat._id) {
        // give notification
        return;
      } else {
        setMessages((previousMessages) => [...previousMessages, newMessageReceived.chat]);
      }
    };

    socket.on('message received', handleNewMessage);

    return () => {
      socket.off('message received', handleNewMessage);
    };
  }, [selectedChatCompare, messages]);

  return (
    <>
      <Center py={6} >
        <Card maxW={'500px'} w={'full'} >
          <Box w='full' p={'10px'} border={'1px solid black'} alignItems={'center'}>
            <Link to={'/inbox'} onClick={() => { localStorage.setItem('selectedChat', "") }}>
              <Text fontSize='2xl'><IoArrowBackOutline /></Text>
            </Link>
          </Box>
          <Flex w="100%" h="500px" justify="center" align="center" >
            <Box p={2} h={'100%'} w={'full'}>
              <Flex w={'full'} h={'full'} flexDir="column">
                <Header userDetail={userDetail} />
                <Divider />
                {isLoading ?
                  <Center h={'full'}><Spinner color="cyan.700" /></Center>
                  :
                  <>
                    <Messages messages={messages} profile={userDetail.profile} />
                    <Divider />
                    <Footer
                      inputMessage={inputMessage}
                      setInputMessage={setInputMessage}
                      handleSendMessage={handleSendMessage}
                      sendIsLoading={sendIsLoading}
                    />
                  </>
                }
              </Flex>
            </Box>
          </Flex>
        </Card>
      </Center>
    </>
  );
};

export default Chat;

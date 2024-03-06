import React, { useEffect, useState } from 'react'
import { Avatar, Box, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const MessageCard = ({ content }) => {
    const [chatUser, setChatUser] = useState("")

    const handleChatClick = () => {
        localStorage.setItem('selectedChat', JSON.stringify(chatUser))
    }

    useEffect(() => {
        const loggedUser = localStorage.getItem('userId')
        const users = content.users
        for (const user of users) {
            if (user._id !== loggedUser) {
                setChatUser(user)
            }
        }
    }, [])

    return (
        <>
            <Box
                w={'full'}
                transition="0.3s ease"
                bg={useColorModeValue('white', 'gray.900')}
                border="1px"
                borderRadius={'10px'}
                borderRightColor={useColorModeValue('gray.200', 'gray.700')}
                borderLeftColor={useColorModeValue('gray.200', 'gray.700')}
                borderTopColor={useColorModeValue('gray.200', 'gray.700')}
                borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
                _hover={{
                    bg: 'cyan.700',
                    color: 'white',
                }}
            >
                <Link to={`/inbox/${content._id}`} minH='48px' style={{ textDecoration: 'none', width: "100%" }} onClick={handleChatClick}>
                    <Box p={2}>
                        <Flex flex='1' gap='4' alignItems='center'>
                            <Avatar name={chatUser.name} src={chatUser.profile} />
                            <Box>
                                <Heading size='sm' noOfLines={1}>{chatUser.name}</Heading>
                                <Text noOfLines={1} fontWeight={200}>{content.latestMessage?.content}</Text>
                            </Box>
                        </Flex>
                    </Box>
                </Link>

            </Box>
        </>
    )
}

export default MessageCard
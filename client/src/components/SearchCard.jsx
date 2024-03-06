import React from 'react'
import { Avatar, Box, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const MessageCard = ({ users }) => {
   
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
                <Link to={`/profile/${users.userName}`} minH='48px' style={{ textDecoration: 'none', width: "100%" }}>
                    <Box p={2}>
                        <Flex flex='1' gap='4' alignItems='center' >
                            <Avatar name={users.name} src={users.profile} />
                            <Box>
                                <Heading size='sm' noOfLines={1}>{users.name}</Heading>
                                <Text noOfLines={1}>{users.userName}</Text>
                            </Box>
                        </Flex>
                    </Box>
                </Link>
            </Box>
        </>
    )
}

export default MessageCard
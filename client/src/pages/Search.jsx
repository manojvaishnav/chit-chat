'use client'
import React from 'react'
import { useState } from 'react'
import {
    Stack,
    FormControl,
    Input,
    useColorModeValue,
    Heading,
    Text,
    Container,
    Center,
    Box,
    VStack,
    Divider,
    useToast,
    Spinner
} from '@chakra-ui/react'
import Searchcard from '../components/SearchCard'
import axios from 'axios';
import { useEffect } from 'react';

const SearchBox = () => {
    const toast = useToast()
    const token = localStorage.getItem('tokenValue')
    const [search, setSearch] = useState()
    const [userList, setUserList] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const [searchResult, setSearchResult] = useState([]);

    const getAllUsersList = async () => {
        setisLoading(true);
        try {
            await axios.get('https://chit-chat-6id8.onrender.com/api/v1/user/all/list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                setUserList(response.data.user)
            })
        } catch (error) {
            // Handle error
            toast({
                title: 'Something Went Wrong',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        } finally {
            setisLoading(false);
        }
    }

    const searchUserButton = () => {
        if (!search) {
            return
        }
        const result = userList.filter(user =>
            user.userName.toLowerCase().includes(search.toLowerCase()) ||
            user.name.toLowerCase().includes(search.toLowerCase())
        );
        setSearchResult(result);
    }

    useEffect(() => {
        getAllUsersList();
    }, [token]);


    return (
        <>
            <Center>
                <Center py={6} maxW={'500px'} w={'full'}>
                    <VStack w={'full'}>
                        <Container
                            maxW={'lg'}
                            bg={useColorModeValue('white', 'whiteAlpha.100')}
                            boxShadow={'xl'}
                            rounded={'lg'}
                            p={6}>
                            <Heading
                                as={'h2'}
                                fontSize={{ base: 'xl', sm: '2xl' }}
                                textAlign={'center'}
                                mb={5}>
                                Search
                            </Heading>
                            <Stack
                                direction={{ base: 'column', md: 'row' }}
                                as={'form'}
                                spacing={'12px'}
                                onSubmit={(e) => {
                                    e.preventDefault()
                                }}>
                                <FormControl>
                                    <Input
                                        variant={'solid'}
                                        borderWidth={1}
                                        color={'gray.800'}
                                        _placeholder={{
                                            color: 'gray.400',
                                        }}
                                        borderColor={useColorModeValue('gray.300', 'gray.700')}
                                        id={'email'}
                                        type={'text'}
                                        required
                                        placeholder={'Search'}
                                        aria-label={'Search'}
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value)
                                            searchUserButton()
                                        }}
                                    />
                                </FormControl>
                            </Stack>
                        </Container>
                        <Center py={6} w={'full'}>
                            <Box maxW={'500px'}
                                w={'full'}
                                h={'500px'}
                                bg={useColorModeValue('white', 'gray.800')}
                                boxShadow={'2xl'}
                                rounded={'md'}
                                overflowY={'scroll'}>
                                <VStack w={'full'} p={2}>
                                    <Text w={'full'} pl={'10px'} fontSize='2xl' fontFamily={'cursive'}>{search ? "Search Result" : "All Users"}</Text>
                                    <Divider />
                                    {
                                        search ? (
                                            searchResult.map((user, i) => <Searchcard users={user} key={i} />)
                                        ) : (
                                            <>
                                                {
                                                    isLoading ? <Spinner color='cyan.700' /> : userList.map((user, i) => <Searchcard users={user} key={i} />)
                                                }
                                            </>
                                        )
                                    }
                                </VStack>
                            </Box>
                        </Center>
                    </VStack>
                </Center>
            </Center>

        </>
    )
}

export default SearchBox
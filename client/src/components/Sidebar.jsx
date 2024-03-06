'use client'
import React, { useEffect, useState } from 'react'
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from '@chakra-ui/react'
import {
    FiMenu,
    FiChevronDown,
} from 'react-icons/fi'
import { FaCompass, FaSearch } from 'react-icons/fa'
import { FaSquarePlus } from 'react-icons/fa6'
import { IoMdHome } from 'react-icons/io'
import { AiFillMessage } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'

const LinkItems = [
    { name: 'Home', icon: IoMdHome, href: '/' },
    { name: 'Search', icon: FaSearch, href: '/search' },
    { name: 'Explore', icon: FaCompass, href: '/explore' },
    { name: 'Messages', icon: AiFillMessage, href: '/inbox' },
    { name: 'Create', icon: FaSquarePlus, href: '/create' },
]
const SidebarContent = ({ onClose, ...rest }) => {

    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="cursive" fontWeight="bold">
                    ChitChat
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon}>
                    <Link onClick={onClose} style={{ width: "100%" }} to={link.href} >{link.name}</Link>
                </NavItem>
            ))}
        </Box>
    )
}

const NavItem = ({ icon, children, ...rest }) => {
    return (
        <Box
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.700',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    )
}

const MobileNav = ({ onOpen, name, profile, username, handleLogout, ...rest }) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="cursive"
                fontWeight="bold">
                ChitChat
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={profile}
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{name}</Text>
                                    <Text fontSize="xs">@{username}</Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem ><Link to={`/profile/${username}`}>Profile</Link></MenuItem>
                            <MenuItem><Link to={'/saved'}>Saved Post</Link></MenuItem>
                            <MenuItem><Link to={'/liked'}>Liked Post</Link></MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    )
}

const Sidebar = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [uName, setUName] = useState()
    const [profile, setProfile] = useState()
    const [userName, setUserName] = useState()

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.setItem('tokenValue', "")
        localStorage.setItem('userEmail', "")
        localStorage.setItem('userUsername', "")
        localStorage.setItem('userProfile', "")
        localStorage.setItem('userName', "")
        localStorage.setItem('userId', "")
        navigate('/login')
    }

    const getDetails = () => {
        setUName(localStorage.getItem('userName'))
        setProfile(localStorage.getItem('userProfile'))
        setUserName(localStorage.getItem('userUsername'))
    }

    useEffect(() => {
        getDetails()
    }, [localStorage.getItem('userProfile'), localStorage.getItem('userUsername'), window.location.href])

    return (
        <Box h="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent backgroundColor={'#EDF2F7'}>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} name={uName} profile={profile} username={userName} handleLogout={handleLogout} />
            <Box ml={{ base: 0, md: 60 }} p="4" backgroundColor={'#EDF2F7'}>
                <div>{props.content}</div>
            </Box>
        </Box>
    )
}

export default Sidebar
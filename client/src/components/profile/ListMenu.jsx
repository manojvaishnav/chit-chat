import { Avatar, Box, Button, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom';

const ListMenu = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()



    return (
        <>
            <Text cursor={'pointer'} onClick={onOpen}>{props.name}</Text>
            <Modal isOpen={isOpen} onClose={onClose} size={'sm'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{props.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {
                            props.content?.map((data, i) => {
                                return <Link minH='48px' cursor={'pointer'} to={`/profile/${data.userName}`} onClick={onClose} key={i}>
                                    <Box p={2}>
                                        <Flex flex='1' gap='4' alignItems='center'>
                                            <Avatar name={data.name} src={data.profile} />

                                            <Box>
                                                <Heading size='sm' noOfLines={1}>{data.name}</Heading>
                                                <Text noOfLines={1}>@{data.userName}</Text>
                                            </Box>
                                        </Flex>
                                    </Box>
                                </Link>
                            })
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ListMenu
import React from 'react'
import {
    useDisclosure,
    GridItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    Image,
} from '@chakra-ui/react'
import HomePostCard from './home/HomePostCard'

const PostCard = ({ post, handelDeletePost }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <GridItem maxW='150px' maxH='150px' >
                <Image onClick={onOpen} cursor={'pointer'} src={post.photo} objectFit="cover" w="100%" h="100%" />
            </GridItem>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent >
                    <ModalCloseButton _hover={{
                        bg: 'cyan.700',
                        color: 'white',
                    }} />
                    <ModalBody mt={'10px'}>
                        <HomePostCard post={post} handelDeletePost={handelDeletePost} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default PostCard
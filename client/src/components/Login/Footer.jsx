import React from 'react'
import {
  Box,
  Container,
  Link,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { FaGithub, FaLinkedin, } from 'react-icons/fa'
import { AiFillInstagram } from "react-icons/ai";
import { MdEmail } from "react-icons/md";

const SocialButton = (props) => {
  return (
    <Link
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      display={'inline-flex'}
      alignItems={'center'}
      href={props.href}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      {props.icon}
    </Link>
  )
}


const Footer = () => {
  const date = new Date();

  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Text>© {date.getFullYear()} <a href='https://mkvaishnav.netlify.app/' target='_blank' style={{ color: '#ee2a7b', fontWeight: 'bold' }}>Manoj Vaishnav</a>. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label="Instagram" href="https://www.instagram.com/mr.mk_vaishnav/" icon={<AiFillInstagram />} />
          <SocialButton label="LinkedIn" href="https://www.linkedin.com/in/manoj-vaishnav/" icon={<FaLinkedin />} />
          <SocialButton label="Email" href="mailto:manojvaishnav989@gmail.com" icon={<MdEmail />} />
          <SocialButton label="Github" href="https://github.com/manojvaishnav" icon={<FaGithub />} />
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer







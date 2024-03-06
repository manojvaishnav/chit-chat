import React from 'react'
import Footer from '../components/Login/Footer'
import LoginForm from '../components/Login/LoginForm'
import { Center } from '@chakra-ui/react'

const Loginpage = () => {
  return (
    <>
      <Center>
        <LoginForm />
      </Center>
      <Footer />
    </>
  )
}

export default Loginpage
import React from 'react'
import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginpage from './pages/Loginpage.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx';
import Sidebar from './components/Sidebar.jsx'
import Explore from './pages/Explore.jsx'
import Inbox from './pages/Inbox.jsx'
import CreatePost from './pages/CreatePost.jsx'
import Profile from './pages/Profile.jsx';
import SavedPost from './pages/SavedPost.jsx'
import SearchBox from './pages/Search.jsx';
import Chats from './pages/Chats.jsx'
import LikedPost from './pages/LikedPost.jsx';
import ResetPassword from './pages/ResetPassword.jsx'

const App = () => {

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sidebar content={<Home />} />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/search" element={<Sidebar content={<SearchBox />} />} />
          <Route path="/explore" element={<Sidebar content={<Explore />} />} />
          <Route path="/inbox" element={<Sidebar content={<Inbox />} />} />
          <Route path="/inbox/:chatId" element={<Sidebar content={<Chats />} />} />
          <Route path="/create" element={<Sidebar content={<CreatePost />} />} />
          <Route path="/profile/:username" element={<Sidebar content={<Profile />} />} />
          <Route path="/saved" element={<Sidebar content={<SavedPost />} />} />
          <Route path="/liked" element={<Sidebar content={<LikedPost />} />} />
          <Route path="/*" element={<Sidebar content={<Home />} />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>

  )
}

export default App
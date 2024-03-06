import { Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { IoBookmark } from "react-icons/io5";
import { FiBookmark } from 'react-icons/fi'
import axios from 'axios';

const SavePostButton = ({ postId }) => {
    const token = localStorage.getItem('tokenValue')
    const [savedStatus, setSavedStatus] = useState(false)

    const getPostSavedStatus = async () => {
        try {
            await axios.get(`http://localhost:5000/api/v1/posts/saved/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                const isPostSaved = response.data.data.savedPost.some(post => post._id === postId);
                setSavedStatus(isPostSaved);
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSavedButton = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/v1/posts/saved/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                getPostSavedStatus()
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPostSavedStatus()
    }, [getPostSavedStatus])

    return (
        <>
            <Button w={'40px'} h={'40px'} size={'10px'} onClick={() => handleSavedButton(postId)}>
                {
                    savedStatus ? <IoBookmark /> : <FiBookmark />
                }
            </Button>
        </>
    )
}

export default SavePostButton
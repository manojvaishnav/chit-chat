import React, { useEffect, useRef } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";

const Messages = ({ messages,profile }) => {
  const loggedInUserId = localStorage.getItem('userId')
  
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  return (
    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
      {messages.map((item, index) => {
        if (item.sender._id === loggedInUserId) {
          return (
            <Flex key={index} w="100%" justify="flex-end">
              <Flex
                bg="cyan.700"
                color="white"
                maxW="350px"
                p={1}
                my={1}
              >
                <Text fontSize={'13px'}>{item.content}</Text>
              </Flex>
            </Flex>
          );
        } else {
          return (
            <Flex key={index} w="100%" alignItems={'inherit'} my={2}>
              <Avatar
                name='user'
                src={profile}
                bg="blue.300"
                size={'xs'}
              ></Avatar>
              <Flex
                bg="gray.100"
                color="black"
                maxW="350px"
                p={1}
              >
                <Text fontSize={'13px'}>{item.content}</Text>
              </Flex>
            </Flex>
          );
        }
      })}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Messages;

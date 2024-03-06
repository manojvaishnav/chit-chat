import React, { useEffect, useRef } from "react";
import { Flex, Input, Button, Spinner } from "@chakra-ui/react";

const Footer = ({ inputMessage, setInputMessage, handleSendMessage, sendIsLoading }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Flex w="100%" mt="5">
      <Input
        ref={inputRef}
        placeholder="Type Something..."
        borderColor={'cyan.700'}
        borderRadius="none"
        _focus={{
          border: "1px solid cyan",
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      {
        sendIsLoading ? <Button
          bg="cyan.700"
          color="white"
          borderRadius="none"
          _hover={{
            bg: "cyan.700",
            color: "white",
            border: "1px solid black",
          }}
          isDisabled={true}
        >
          <Spinner color="white"/>
        </Button> : <Button
          bg="cyan.700"
          color="white"
          borderRadius="none"
          _hover={{
            bg: "cyan.700",
            color: "white",
            border: "1px solid black",
          }}
          disabled={inputMessage.trim().length <= 0}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      }

    </Flex>
  );
};

export default Footer;

import React from "react";
import { Flex, Avatar, Text, } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = ({ userDetail }) => {
  return (
    <>
      <Link to={`/profile/${userDetail.userName}`}>
        <Flex w="100%">
          <Avatar size="md" name={userDetail.name} src={userDetail.profile}>
          </Avatar>
          <Flex flexDirection="column" mx="5" justify="center">
            <Text fontSize="15px" fontWeight="bold">
              {userDetail.name}
            </Text>
            <Text fontSize={'13px'} color="gray.500">@{userDetail.userName}</Text>
          </Flex>
        </Flex>
      </Link>
    </>
  );
};

export default Header;

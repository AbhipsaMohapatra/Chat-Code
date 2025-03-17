import React from "react";
import { useContext, useState, useEffect } from "react";
import { chatContext } from "../Context/context";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { Box, Button, useToast, Stack, Text, Image } from "@chakra-ui/react";
import { AddIcon, WarningIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/chatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState();
  const [newMessage, setNewMessage] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } =
    useContext(chatContext);
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      // const { data } = await axios.get(
      //   "/api/chat",
      //   config
      // );
      console.log(data);
      setChats(data);
    } catch (err) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={"3"}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={"3"}
        px={"3"}
        fontSize={{  base: "28px", md: "18px", lg: "20px" }}
        fontFamily={"Work sans"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat{" "}
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat);
                  setNewMessage(
                    chat.latestMessage ? chat.latestMessage.content : ""
                  );
                }}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage ? (
                  <Box display={"flex"} alignItems={"center"}>
                    <Image
                      src={chat.latestMessage.sender.pic}
                      alt={chat.latestMessage.sender.name}
                      boxSize="30px" // Adjust the size as needed
                      borderRadius="full"
                      mr={2} // Adds some spacing between the image and text
                    />
                    <Text fontSize="sm" color="green">
                      
                      {chat.latestMessage.sender._id===loggedUser._id?"You":chat.latestMessage.sender.name}:{" "}
                      {chat.latestMessage?.content}
                    </Text>
                  </Box>
                ) : (
                  <Text fontSize="sm" color="red.500">
                    No Messages Received yet
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

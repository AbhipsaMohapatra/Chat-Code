import React from "react";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { IconButton, Button } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import { chatContext } from "../../Context/context";
import { useToast } from "@chakra-ui/react";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain , fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = useContext(chatContext);

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already Present",

        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admins can Add",

        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupadd",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      // const { data } = await axios.put(
      //   "/api/chat/groupadd",
      //   { chatId: selectedChat._id, userId: user1._id },
      //   config
      // );
      setSelectedChat(data);
      setLoading(false);
      setFetchAgain(!fetchAgain);
      console.log("setFetchAgain:", setFetchAgain);
      console.log("fetchAgain:", fetchAgain);
    } catch (error) {
        setLoading(false);
      toast({
        title: "Some Error occured in Adding users",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only Admins can remove",

        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupremove",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      // const { data } = await axios.put(
      //   "/api/chat/groupremove",
      //   { chatId: selectedChat._id, userId: user1._id },
      //   config
      // );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setLoading(false);
      fetchMessages();
      setFetchAgain(!fetchAgain);
    } catch (error) {
        setLoading(false);
      toast({
        title: "Some Error occured in Removing users",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setGroupChatName(""); 
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    if (!query) {
      toast({
        title: "please enter something in search",
        // description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setSearch(query);

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${query}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Some Error occured in searching users",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        aria-label="Search database"
        onClick={onOpen}
        icon={<ViewIcon />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                type="text"
                placeholder="Update Name"
                onChange={(e) => setGroupChatName(e.target.value)}
                
                mb={3}
              />

              <Button
                variant={"solid"}
                colorScheme="blue"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                {" "}
                Update
              </Button>
            </FormControl>

            <FormControl display={"flex"}>
              <Input
                type="text"
                placeholder="Add Users to Group"
                onChange={(e) => handleSearch(e.target.value)}
                
                mb={1}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;

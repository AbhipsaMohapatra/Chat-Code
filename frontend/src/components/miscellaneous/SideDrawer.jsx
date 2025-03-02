import React from "react";
import { useContext } from "react";
import { chatContext } from "../../Context/context";
import { useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  Text,
  MenuList,
  useDisclosure,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { Search2Icon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Show,
  Hide,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import axios from "axios";
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/chatLogics";
import { motion, AnimatePresence } from "framer-motion";

const SideDrawer = () => {
  const MotionBox = motion(Box);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useContext(chatContext);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
   
    if (window.opener) {
      // Close the new tab if it was opened via window.open()
      window.close();
    } else {
      // Navigate back to home in the same tab
      navigate("/");
    }
    
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "please enter something in search",
        // description: "We've created your account for you.",
        status: "warning",
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
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      // const { data } = await axios.get(
      //   `/api/user?search=${search}`,
      //   config
      // );

      setLoading(false);
      setSearchResult(data);
      if (data.length === 0) {
        toast({
          title: "User not found",
          description: "No users matched your search query",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
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
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/chat",
        { userId },
        config
      );
      // const {data} =await axios.post("/api/chat",{userId},config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(false);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured in frtching chats",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip hasArrow label="Search Users to Chat" bg="black">
          <Button onClick={onOpen}>
            <Search2Icon />
            <Show above="md">
              <Text px={"4"}>Search Users</Text>
            </Show>
          </Button>
        </Tooltip>
        <Text fontSize={{ base: "xl", md: "2xl" }} fontFamily={"Work sans"}>
          Chat-A-Tive
        </Text>
        <div>
          <Menu m={2}>
            <MenuButton
              as={Button}
              bg={"white"}
              leftIcon={<BellIcon boxSize={5} />}
            >
              {/* Animated Notification Badge */}
              <AnimatePresence>
                {notification.length > 0 && (
                  <MotionBox
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 150,
                    }}
                    position="absolute"
                    top="-2px"
                    right="-2px"
                    background="red.500"
                    color="white"
                    fontSize="0.8em"
                    fontWeight="bold"
                    borderRadius="full"
                    px={2}
                    py={1}
                    boxShadow="0px 0px 8px rgba(255, 0, 0, 0.7)"
                  >
                    {notification.length}
                  </MotionBox>
                )}
              </AnimatePresence>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                name={user.name}
                src={user.pic}
                cursor={"pointer"}
                bg="teal.500"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          {" "}
          {/* Add this */}
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={"2"}>
              <Input
                type="text"
                placeholder="Search by email or address"
                size="md"
                mr={"2"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
        {/* Close it properly */}
        {/* console.log("Rendered Users:", searchResult); */}
      </Drawer>
    </>
  );
};

export default SideDrawer;

import React from "react";
import { Container, Box, Text, Button } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
// import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import Login from "./Login";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "../config/socket";
import { v4 as uuidv4 } from "uuid";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import CodePage from "./CodePage";
import { chatContext

 } from "../Context/context";
 import { useContext } from "react";

const Homepage = () => {
  const {user,setUser} = useContext(chatContext);
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  useEffect(() => {
    socket.connect();
  },[]);
  

  

  const joinRoom = () => {
    console.log("joinRoom function triggered");
    console.log("Room ID:", roomId, "User Name:", userName);
  
    // console.log(userName ,roomId)
    // console.log("Joining with Room ID:", roomId);
    if (roomId && userName) {
      // console.log("Joining with Room ID:", roomId);
      localStorage.setItem("roomId", roomId);
      localStorage.setItem("userName", userName);
      socket.emit("join", { roomId, userName });
      socket.emit("getUsers", roomId); // Request updated user list after joining
      setJoined(true);
  
      console.log("Navigating to code page");
      navigate("/code");
    } else {
      console.error("Missing roomId or userName");
    }
    // setRoomId((prev) => ""); // Ensures React correctly processes state update
    // setUserName((prev) => "");
  };

  const generateRoom = () => {
    const newRoomId = "CC-" + uuidv4().slice(0, 8); // Generates a unique ID
    setRoomId(newRoomId);
  };

  return (
    <Container  maxW="6xl"
    p="8"
    display="flex"
    flexDirection={{ base: "column", md: "row" }} /* Column on small, Row on medium+ */
    justifyContent="space-evenly"
    alignItems="center"
    width="100%"
    gap="8">
      <Box width={{ base: "100%", md: "50%" }} maxW="600px">
      <Box
        background={"white"}
        color="black"
        display="flex"
        justifyContent="center"
        width={"100%"}
        margin={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth="1px"
        p={4}
      >
        <Text fontSize="3xl" fontFamily={"Work sans"}>
          Chat-A-Tive
        </Text>
      </Box>
      <Box
        bg={"white"}
        width={"100%"}
        borderRadius={"lg"}
        borderWidth="1px"
        p="4"
        color="black"
      >
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList mb="1em">
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign-up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      </Box>
      <Box width={{ base: "100%", md: "50%" }} maxW="600px">
      <Box
        background={"white"}
        color="black"
        display="flex"
        justifyContent="center"
        width={"100%"}
        margin={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth="1px"
        p={4}
      >
        <Text fontSize="3xl" fontFamily={"Work sans"}>
          Code-It
        </Text>
      </Box>
        <Box  bg={"white"}
        width={"100%"}
        borderRadius={"lg"}
        borderWidth="1px"
        p="9"
        color="black">
          
          
          <FormControl isRequired>
            <FormLabel>Room Id</FormLabel>
            <Input
              type="text"
              placeholder="Room id"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
            />
          </FormControl>
          <FormControl isRequired marginTop={"6"}>
            <FormLabel>Your Name</FormLabel>
            <Input
              type="text"
              value={userName}
              placeholder="Enter your name"
              onChange={(e) => setUserName(e.target.value)}
            />
          </FormControl>
          <Button
            onClick={joinRoom}
            width={"100%"}
            colorScheme={"blue"}
            marginTop={"12"}
            fontSize={{base:"14px", md:"lg"}}
          >
            Join Room
          </Button>
          <Button
            onClick={generateRoom}
            width={"100%"}
            colorScheme={"red"}
            marginTop={"2"}
            fontSize={{base:"14px", md:"lg"}}
          >
            Generate Room Id
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Homepage;

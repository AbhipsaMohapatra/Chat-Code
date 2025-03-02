import React, { useState ,useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { useContext } from "react";
import { chatContext } from "../Context/context";
import { Box, Input, Text } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/chatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { Spinner } from "@chakra-ui/react";
import Lottie from "lottie-react";

import animationData from '../animation/typing.json'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react'
import './styles.css';
import ScrollableChat from "./ScrollableChat";
import { socket } from "../config/socket";
// import io from 'socket.io-client';


// const ENDPOINT = "http://localhost:5000";
var  selectedChatCompare;  //socket


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat , notification , setNotification } = useContext(chatContext);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping , setIsTyping] = useState(false);
  const [typing,setTyping] = useState(false);
  const toast = useToast();
  const [socketConnected , setSocketConnected] = useState(false);



  const fetchMessages = async ()=>{
    if(!selectedChat){
      return;
    }
    try {
      const config ={
        headers:{
          "Content-Type" : "application/json",
          Authorization:`Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const {data} = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,config);
      // const {data} = await axios.get(`/api/message/${selectedChat._id}`,config);
      console.log("Fetched Messages:", data); // Debugging 
      setMessages(data);
     
      setLoading(false);
       
  
      socket.emit('join chat',selectedChat._id)

      
    } catch (error) {
      toast({
        title: 'Some Error Occured In Fetching Messages',
        description: "Failed to load the message",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      
    }
  }
  useEffect(() => {
    // socket = io(ENDPOINT, { transports: ["websocket"], withCredentials: true });
    socket.connect();
    socket.emit("setup",user);
    socket.on("connected", ()=> setSocketConnected(true));
    socket.on('typing',()=>setIsTyping(true));
    socket.on('stop typing',()=>setIsTyping(false));
    socket.on("disconnect", () => {
      console.log("User disconnected from frontend");
  });


    return () => {
      socket.off("typing");
      socket.off("stop typing");
      socket.off("disconnect"); // Remove disconnect listener
      socket.disconnect(); // Disconnect the socket
    };
  
   
  }, [])
  

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
   
  
    
  }, [selectedChat])

  // useEffect(() => {
  //   socket.on("message received",(newMessageReceived)=>{
  //      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
  //       //give notification
  //      }
  //      else{
  //       // setMessages([...messages,newMessageReceived]);
  //       setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
  //      }
  //   })

  
    
  // })
  useEffect(() => {
    const messageListener = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Handle notifications
        if(!notification.includes(newMessageReceived)){
          setNotification((prevMessages)=>[newMessageReceived,...prevMessages]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };
  
    socket.on("message received", messageListener);
  
    return () => {
      socket.off("message received", messageListener); // Cleanup to avoid duplicate listeners
    };
  }, [selectedChat]);

  // console.log(notification,"....");
  
  
  


  const sendMessage = async (event) => {
    socket.emit('stop typing',selectedChat._id);
     if(event.key === "Enter" && newMessage){
       try {
        const config ={
          headers:{
            "Content-Type" : "application/json",
            Authorization:`Bearer ${user.token}`,
          },
        };
        console.log("Sending message:", newMessage, "to chat:", selectedChat._id);
        
        const {data} = await axios.post(`http://localhost:5000/api/message/`,{content:newMessage,chatId:selectedChat._id},config);
        
        console.log("Message sent successfully:", JSON.stringify(data, null, 2));

        // setMessages([...messages,data]);
        // setNewMessage("");
        // fetchMessages(); 
        socket.emit('new message',data);
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage("");
        // fetchMessages();



            // await fetchMessages();
         
        
       } catch (error) {
        toast({
          title: 'Some Error Occured',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        
       }
     }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing Indicator
    if(!socketConnected){
      return;
    }
    if(!typing){
      setTyping(true);
      socket.emit('typing',selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 5000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = (timeNow - lastTypingTime);
      if(timeDiff >= timerLength && typing){
        socket.emit("stop typing",selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

 

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ChevronLeftIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                />{" "}
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {" "}
            {loading ? (
              <Spinner
                size={"xl"}
                w={"20"}
                h={"20"}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="message"><ScrollableChat messages={messages}/></div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              mt={3}
              
              isRequired
            >
              {isTyping ? <Lottie  
               style={{marginBottom :15, marginLeft:0 , width:70}} animationData={animationData} loop={true}/> : null}

              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

import React from 'react'
import axios from 'axios';
import { useEffect,useState } from 'react';
import { chatContext } from '../Context/context';
import { useContext } from 'react';
import { Box } from '@chakra-ui/react';
import SideDrawer from './miscellaneous/SideDrawer'
import MyChats from './MyChats';
import ChatBox from './ChatBox';

const ChatPage =  () => {
  const {user} = useContext(chatContext);
  const [fetchAgain , setFetchAgain] = useState(false);
  
   
    
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box display={"flex"} justifyContent={"space-between"} w={"100%"} h={"91.5vh"} p={"10px"}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
      
    </div>
  )
}

export default ChatPage

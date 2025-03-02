import { Box } from '@chakra-ui/react'
import React from 'react'
import { useContext } from 'react'
import { chatContext } from '../Context/context'
import SingleChat from './singleChat'

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat} = useContext(chatContext);
  return (
    <Box
    display={{base:selectedChat? "flex":"none",md:"flex"}}
    alignItems={"center"}
    flexDirection={"column"} p={3} bg={"white"} w={{base:"100%",md:"68%"}} borderRadius="lg" borderWidth="1px"><SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>

    </Box>
  )
}

export default ChatBox

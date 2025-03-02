import React from "react";
import { useState } from "react";
import { Button,  FormControl,  Input, Stack, VStack ,FormLabel, InputRightElement} from "@chakra-ui/react";

import { InputGroup } from "@chakra-ui/react";
// import { createStandaloneToast } from "@chakra-ui/react";

import { useToast } from '@chakra-ui/react'
import axios from "axios"
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { useNavigate  } from 'react-router-dom';

const Login = () => {
  const toast = useToast();
  const [show,setShow] = useState(false);
  const [email,setEmail] = useState("");
  const [password , setPassword] = useState("");
   const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = ()=> setShow(!show);
  const submitHandler = async  ()=>{
    if(!email || !password){
      toast({
        title: 'Fill all the feilds',
        description: "Please fill the details",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false);
      return;

    }
    try{
      const config = {
        headers:{
          "Content-type":"application/json",

        },
      };
      const {data}  = await axios.post("http://localhost:5000/api/user/login",{
       email,password
      },config);
      // const {data}  = await axios.post("/api/user/login",{
      //  email,password
      // },config);
      toast({
        title: 'Login Sucessful',
        description: "Thank you !!",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:"top",
      })
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      // navigate("/chats");
      window.open("/chats", "_blank");

    }
    catch(e){
      console.error("Login Error:", e.response ? e.response.data : e.message);
      toast({
        title: 'There is some error in login',
        // description: `Your error is ${e}`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false);
    }

  }
  return (
    <VStack spacing={'5px'} color={'black'}>
         
          
          <FormControl  color="black" isRequired>
            <FormLabel>Email:</FormLabel>
            <Input  type="email" placeholder="Enter your Email" value={email} onChange={(e)=>setEmail(e.target.value)}></Input>
          </FormControl>
          
          <FormControl  color="black" isRequired>
            <FormLabel>Password:</FormLabel>
            <InputGroup>
            <Input type={show ? "text":"password"} value={password} placeholder="Enter password" onChange={(e)=>setPassword(e.target.value)}></Input>
            <InputRightElement width={'4.5rem'}>
            <Button h={'1.75rem'} size={"sm"} onClick={handleChange}>
              {show ? "Hide":"Show"}
    
    
              </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          
          
    
         
          <Button
          colorScheme="blue" width={'100%'} style={{marginTop:15}} fontSize={{base:"14px", md:"lg"}} onClick={submitHandler}>
            Login
          </Button>
          <Button variant={'solid'} colorScheme="red" width={"100%"} isLoading={loading} fontSize={{base:"14px", md:"lg"}} onClick={()=>{
            setEmail("example@gmail.com");
            setPassword("example123");
            console.log("clicked")
          }} >
            Guest User Credentials

          </Button>
        </VStack>
  )
}

export default Login

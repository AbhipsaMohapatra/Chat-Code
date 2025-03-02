import React from "react";
import { useState } from "react";
import { Button,  FormControl,  Input, Stack, VStack ,FormLabel, InputRightElement} from "@chakra-ui/react";
// import { Field } from "./ui/field"
// import { Field } from "@chakra-ui/react";
// import { InputGroup } from "./ui/input-group";
import { InputGroup } from "@chakra-ui/react";
// import { createStandaloneToast } from "@chakra-ui/react";

// import { toaster } from "./ui/toaster";
import axios from "axios"
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { useNavigate  } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'

const Signup = () => {
  const toast = useToast()
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = () => setShow(!show);
  const handleChange2 = () => setShow2(!show2);
  const postDetails = (pic) => {
    setLoading(true);
    console.log("Uploading image:", pic);

    if (pic === undefined) {
      
      toast({
        title: 'Picture not uploaded',
        description: "Please try to upload again",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
     
    return;
      
    }
    if (
      pic.type === "image/jpeg" ||
      pic.type === "image/png" ||
      pic.type === "image/avif"
    ) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "First-Chat-App");
      data.append("cloud_name", "divrqv1q7");
      fetch("https://api.cloudinary.com/v1_1/divrqv1q7/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Cloudinary Response:", data);
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      toast({
        title: 'There is some error in uploading the file ',
        description: "Your file type should be of jepg or png or avif",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
     
      setLoading(false);
      return;
    }
  };

const submitHandler = async()=>{
    setLoading(true);
    if(!name || !email || !password || !confirmpassword){
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if(password!=confirmpassword){
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try{
      const config = {
        headers:{
          "Content-type":"application/json",

        },
      };
      const {data}  = await axios.post("/api/user",{
        name,email,password,pic
      },config);
      toast({
        title: 'Your file is Successfully Regitered',
        description: "Data Submission successful",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:"top",
      })
      
      
      localStorage.setItem("userInfo", JSON.stringify(data));

      // navigate("/chats");
      window.open("/chats", "_blank");


    }
    catch(e){
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

    }
    setLoading(false);

}

  return (
    <VStack spacing={'5px'} color={'black'}>
      <FormControl id="first-name" color="black" isRequired>
        <FormLabel>Name:</FormLabel>
        <Input type="text" placeholder="Enter your name" onChange={(e)=>setName(e.target.value)}></Input>
      </FormControl>
      
      <FormControl id="email" color="black" isRequired>
        <FormLabel>Email:</FormLabel>
        <Input  type="email" placeholder="Enter your Email" onChange={(e)=>setEmail(e.target.value)}></Input>
      </FormControl>
      
      <FormControl id="password" color="black" isRequired>
        <FormLabel>Password:</FormLabel>
        <InputGroup>
        <Input type={show ? "text":"password"} placeholder="Enter password" onChange={(e)=>setPassword(e.target.value)}></Input>
        <InputRightElement width={'4.5rem'}>
        <Button h={'1.75rem'} size={"sm"} onClick={handleChange}>
          {show ? "Hide":"Show"}


          </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      
      <FormControl id="cpassword" color="black" isRequired>
        <FormLabel>Confirm Password:</FormLabel>
        <InputGroup>
        <Input type={show2 ? "text":"password"} placeholder="Enter confirm password" onChange={(e)=>setConfirmpassword(e.target.value)}></Input>
        <InputRightElement width={'5rem'}>
        <Button h={'1.75rem'} size={"sm"} onClick={handleChange2}>
          {show2 ? "Hide":"Show"}


          </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="file">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input type="file" p={'2'} accept="image/*" onChange={(e)=>postDetails(e.target.files[0])}>
        </Input>
      </FormControl>
      <Button
      colorScheme="blue" width={'100%'} style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>
        Sign-up
      </Button>
    </VStack>
  );
};

export default Signup;

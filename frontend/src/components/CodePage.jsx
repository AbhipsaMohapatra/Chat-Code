import { Container, Box, Text, Button, Textarea } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { useToast } from "@chakra-ui/react";
import { socket } from "../config/socket";
import { useNavigate } from "react-router-dom";

const CodePage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // const [roomId] = useState(localStorage.getItem("roomId") || "");
  // const [userName] = useState(localStorage.getItem("userName") || "");
  // const [roomId] = useState(location.state?.roomId || localStorage.getItem("roomId"));
  // const [userName] = useState(location.state?.userName || localStorage.getItem("userName"));
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  // const [cusers, setCusers] = useState([]);
  const [cusers, setCusers] = useState(() => {
    return JSON.parse(localStorage.getItem("cusers")) || [];
  });
  
  const [typing, setTyping] = useState("");
  const [output, setOutput] = useState("");
  const [version, setVersion] = useState("*");
  // useEffect(() => {
  //     socket.connect();

  //   });

  useEffect(() => {
    console.log(localStorage.getItem("roomId"))
    const storedRoomId = localStorage.getItem("roomId") || "";
    const storedUserName = localStorage.getItem("userName") || "";

    console.log(
      "📦 Retrieved from LocalStorage:",
      storedRoomId,
      storedUserName
    );

    if (!localStorage.getItem("roomId") || !localStorage.getItem("userName")) {
      console.log("🚨 No Room Data Found! Redirecting...");
      navigate("/");
      return;
    }

    setRoomId(storedRoomId); // ✅ This updates the state!
    setUserName(storedUserName);

    console.log(`🟢 CodePage Mounted: Joining Room ${storedRoomId}`);

    if (!socket.connected) {
      socket.connect();
    }

    
    
    socket.emit("join", { roomId: storedRoomId, userName: storedUserName });
    // socket.emit("getUsers", storedRoomId);  // Emit only after setting state


    const handleUserJoined = (users) => {
      console.log("Updated Users List:", users);
      setCusers(users);
      localStorage.setItem("cusers", JSON.stringify(users));
    };
    const handleLeftUser = (leftUser) => {
      toast({
        title: `${leftUser} left the room`,
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    };
    const handleUpdate = (updatedCode) => {
      console.log(updatedCode);
      setCode(updatedCode);
    };

    const handleTyping = (type) => {
      setTyping(`${type} is typing..`);
      setTimeout(() => {
        setTyping("");
      }, 2000);
    };

    const handleLanguage = (lang) => {
      setLanguage(lang);
    };

    const handleCompile = (response) => {
      console.log("Received compile response:", response);
      if (response?.run?.output) {
        setOutput(response.run.output);
      } else {
        console.error("Invalid response format:", response);
        setOutput(response?.run?.output || "Compilation failed.");
      }
    };

    const handleJoinSuccess = () => {
      console.log("✅ Join confirmed, requesting updated users list...");
      socket.emit("getUsers", storedRoomId);
  };

    socket.on("codeUpdate", handleUpdate);

    socket.on("UserJoined", handleUserJoined);
    socket.on("joinSuccess",handleJoinSuccess);

    socket.on("userLeft", handleLeftUser);
    socket.on("userTyping", handleTyping);
    socket.on("languageUpdate", handleLanguage);
    socket.on("codeResponse", handleCompile);

    return () => {
      console.log("🔴 CodePage Unmounted");
      console.log(`Disconnecting from room: ${roomId}`);
      socket.off("UserJoined", handleUserJoined);
      socket.off("joinSuccess",handleJoinSuccess);
      socket.off("userLeft", handleLeftUser);
      socket.off("codeUpdate", handleUpdate);
      socket.off("userTyping", handleTyping);
      socket.off("codeResponse", handleCompile);

      setCusers([]);
    };
  }, []);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied");

    toast({
      title: "Room id Copied Successfully",
      // description: "We've created your account for you.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });

    setTimeout(() => {
      setCopySuccess("");
    }, 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };
  const handleLeave = () => {
    socket.emit("userLeft", { roomId, userName });
    socket.disconnect(); // Disconnect the socket
    localStorage.removeItem("userId");
    localStorage.removeItem("roomId");
    localStorage.removeItem("userName");
    setRoomId(""); // Only clear state when user actually leaves
    setUserName("");
    navigate("/");
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  // const runCode = () => {
  //   socket.emit("compileCode", { code, roomId, language, version });
  // };
  let debounceTimer;

const runCode = () => {
  if (debounceTimer) clearTimeout(debounceTimer); // Clear previous timer

  debounceTimer = setTimeout(() => {
    socket.emit("compileCode", { code, roomId, language, version });
  }, 1000); // 3-second delay before sending request
};

  return (
    <div style={{ width: "100%" }}>
      <Box
        display="flex"
        flexWrap="wrap" // Ensures responsiveness
        justifyContent="space-between"
        w="100%"
        h="auto" // Adjust height dynamically
        p={[2, 4, 6]} // Responsive padding
      >
        <Box
          bg="black"
          flexBasis={["100%", "30%"]} // Full width on small, 30% on larger
          maxW="400px"
          minW="250px"
          height="auto"
          m={[2, 4, 6]}
          borderRadius="20"
          p="6"
        >
          <Text color={"white"} fontFamily={"Work sans"} fontSize={"lg"}>
            {" "}
            Code Room : {roomId}
          </Text>
          <Button
            onClick={copyRoomId}
            w={"full"}
            bg={"red.500"}
            mt="4"
            _hover={{ bg: "green.400" }}
          >
            Copy Id
          </Button>
          <Text color="white" mt="4">
            Users In Room:
          </Text>
          {cusers.map((user, index) => (
            
            <Box
              key={index}
              bg="gray.700" // Grey background
              color="white"
              p={2} // Responsive padding
              borderRadius="md" // Rounded corners
              width="100%" // Full width inside parent
              textAlign="center" // Center the text
              mt={2} // Margin between users
            >
              {user}
            </Box>
          ))}
          <Text color="white" mt={"2"}>
            {typing}
          </Text>
          <FormControl color={"white"} mt={"4"}>
            <FormLabel>Enter Your language</FormLabel>
            <Select
              placeholder="Select Language"
              className="language-selector"
              bg={"black"}
              color={"white"}
              borderColor={"white"}
              _hover={{ bg: "gray.700" }}
              value={language}
              onChange={handleLanguageChange}
            >
              <option
                style={{ background: "black", color: "white" }}
                value="javascript"
              >
                JavaScript
              </option>
              <option
                style={{ background: "black", color: "white" }}
                value="python"
              >
                Python
              </option>
              <option
                style={{ background: "black", color: "white" }}
                value="java"
              >
                Java
              </option>
              <option
                style={{ background: "black", color: "white" }}
                value="cpp"
              >
                C++
              </option>
            </Select>
            <Button marginTop={"10"} onClick={handleLeave}>
              Leave room
            </Button>
          </FormControl>
        </Box>

        <Box
          flexBasis={["100%", "65%"]}
          width="100%"
          minW="300px"
          bg="black"
          m={[2, 4, 6]}
          borderRadius="20"
          p="6"
        >
          <Editor
            height="60vh"
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
          <Button onClick={runCode} mt="4" colorScheme="blue">
            Run Code
          </Button>
          <Textarea
            value={output}
            placeholder="output will appear here"
            readOnly
            color={"white"}
            mt={"4"}
            bg="gray.800"
            borderColor="gray.600"
          ></Textarea>
        </Box>
      </Box>
    </div>
  );
};

export default CodePage;

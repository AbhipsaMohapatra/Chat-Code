import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Homepage from './components/Homepage'

// import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import { chatContext } from './Context/context'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom'; 
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import FirstPage from './components/FirstPage'

import './App.css'

import ChatPage from './components/ChatPage'
import CodePage from './components/CodePage'
import { socket } from './config/socket'

function App() {
  const [user,setUser] = useState();
  const navigate = useNavigate();
  const [selectedChat,setSelectedChat] = useState();
  const [chats,setChats] = useState([]);
  const [notification, setNotification] = useState([])
  

   useEffect(()=>{
    console.log("📦 Checking userInfo in localStorage");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if(!userInfo){
      console.log("🚨 No User Info Found! Redirecting...");
      navigate("/")

    }


     // ✅ Handle Code Room Navigation
     const storedRoomId = localStorage.getItem("roomId");
     const storedUserName = localStorage.getItem("userName");
 
     if (storedRoomId && storedUserName && window.location.pathname !== "/code") {
       console.log(`🔵 Auto-Joining Code Room: ${storedRoomId} as ${storedUserName}`);
       socket.connect();
       socket.emit("join", { roomId: storedRoomId, userName: storedUserName });
       navigate("/code"); // Automatically navigate to the code page
     }
   },[navigate]);



  return (
    <>
    
     <chatContext.Provider value={{ user, setUser ,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
      <div className='App'>
        <Routes> {/* ✅ Correct way to handle routing */}
          
          <Route path="/" element={<Homepage />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/code" element={<CodePage />} />
        </Routes>
      </div>
    </chatContext.Provider>
    
     
        
    </>
  )
}

export default App

import React, { useState } from "react";
import { useChat } from "../context/chatContext";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Misc/SideDrawer";
import MyChats from "../components/Shared/MyChats";
import ChatBox from "../components/Shared/ChatBox";
import "../App.css"


const ChatPage = () => {
  const { user } = useChat();
  const[fetchAgain,setFetchAgain] = useState(false);
  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        padding={"10px"}
        className="chat"
        >
          {user && <MyChats fetchAgain={fetchAgain}/>}
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
      </div>
    </>
  );
};

export default ChatPage;

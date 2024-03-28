import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    const { data } = await axios.get("/api/chats");
    console.log(data);
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);
  
  return (
    <>
      <div>
        <h1>Chat Page</h1>
        {chats?.map(({ chatName }, index) => {
          return <h1 key={index}>{chatName}</h1>;
        })}
      </div>
    </>
  );
};

export default ChatPage;

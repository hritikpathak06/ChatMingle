import React, { useEffect, useState } from "react";
import { useChat } from "../../context/chatContext";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import Loader from "../Misc/Loader";
import { getSender } from "../../helpers/Logics";
import GrupChatModel from "../Models/GrupChatModel";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = useChat();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  const getMyChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/v1/chat/mychats", config);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    getMyChats();
  }, [fetchAgain]);

  // console.log("My Chats: ", chats);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text children=" My Chats" />
          <GrupChatModel>
            <Button
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "15px" }}
              rightIcon={<FaPlus />}
            >
             Create Group
            </Button>
          </GrupChatModel>
        </Box>
        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll" h={"100%"}>
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#000" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Box>
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                  <Box>
                    {!chat.isGroupChat ? (
                      <Avatar src={chat.users[1].pic} />
                    ) : (
                      <Avatar src="" alt={"G"} name="G" bg={"black"} />
                    )}
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <Loader />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;

import React, { useEffect, useState } from "react";
import { useChat } from "../../context/chatContext";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";
import UpdateGroupChatModel from "../Models/UpdateGroupChatModel";
import { getSender, getSenderFull } from "../../helpers/Logics";
import ProfileModal from "../Models/ProfileModal";
import Loader from "./Loader";
import { IoIosSend } from "react-icons/io";
import axios from "axios";
import ScrollableChat from "../Shared/ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    useChat();

  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const typingHandler = async (e) => {
    setNewMessage(e.target.value);
  };

  const fetchMessage = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/v1/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      console.log("Data: ", data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessageHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/v1/message/send",
        {
          content: newMessage,
          chatId: selectedChat,
        },
        config
      );
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessage();
  }, [selectedChat]);

  console.log("Messages: ", messages);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<MdArrowBack />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Text>{getSender(user, selectedChat.users)}</Text>
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                <Text>{selectedChat.chatName.toUpperCase()}</Text>
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* Messages here */}
            {loading ? (
              <>
                <Loader />
              </>
            ) : (
              <>
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              </>
            )}
            <FormControl isRequired mt={3} display={"flex"}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
              <IconButton onClick={sendMessageHandler} colorScheme="orange">
                <IoIosSend />
              </IconButton>
            </FormControl>
          </Box>
        </>
      ) : (
        <>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            h={"100%"}
          >
            <Text fontSize={"4xl"} pb={3}>
              Click On A User To Chat
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default SingleChat;

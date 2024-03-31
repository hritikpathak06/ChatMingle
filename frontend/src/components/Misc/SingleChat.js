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
import Lottie from "react-lottie";
import { io } from "socket.io-client";
import animationData from "../Animations/typing.json";

// const ENDPOINT = "http://localhost:5000";
const ENDPOINT = "https://chatmingle-7t03.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    useChat();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConncted, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [file, setFile] = useState(null);

  const typingHandler = async (e) => {
    setNewMessage(e.target.value);
    if (!socketConncted) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDifference = timeNow - lastTypingTime;

      if (timeDifference >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
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
      // console.log("Data: ", data);
      setLoading(false);
      socket.emit("join-room", selectedChat._id);
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
    socket.emit("stop-typing", selectedChat._id);
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
      socket.emit("new-message", data);
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
  //   setFile(e.target.files[0]);

  //   const formData = new FormData();
  //   formData.append("chatId", selectedChat._id);
  //   formData.append("attachments", e.target.files[0]);

  //   try {
  //     const config = {
  //       headers: {
  //         "Content-type": "multipart/form-data",
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  //     const res = await axios.post(
  //       "/api/v1/message/send-attachments",
  //       formData,
  //       config
  //     );
  //     // Emit a socket event with the attachment data
  //     socket.emit("new-attachment", {
  //       chatId: selectedChat._id,
  //       attachment: res.data.attachment, // Assuming your server returns the attachment data
  //     });
  //     fetchMessage();
  //     console.log(res.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleChange = async (e) => {
    setFile(e.target.files[0]);

    const formData = new FormData();
    formData.append("chatId", selectedChat._id);
    formData.append("attachments", e.target.files[0]);

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/v1/message/send-attachments",
        formData,
        config
      );
      // Emit a send-attachment event to the server
      socket.emit("send-attachment", {
        chatId: selectedChat._id,
        attachments: data.message.attachments,
      });

      fetchMessage();
      setLoading(false);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message-recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //  Give Notifications
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("receive-attachment", (attachments) => {
      console.log("Received attachment:", attachments);
    });
  });

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
              display={{ base: "flex", md: "flex" }}
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
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            className="message_chat"
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
              {isTyping ? (
                <>
                  <Lottie
                    width={70}
                    style={{ marginLeft: 0, marginBottom: 15 }}
                    options={defaultOptions}
                  />
                </>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                // bg="#E0E0E0"
                type="file"
                bg={"black"}
                color={"white"}
                border={"2px solid white"}
                width={"10%"}
                onChange={handleChange}
              />
              <Input
                variant="filled"
                // bg="#E0E0E0"
                bg={"black"}
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                color={"white"}
                border={"2px solid white"}
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
            className="chat_page"
          >
            <Text fontSize={"4xl"} pb={3} color={"white"} fontWeight={900}>
              Click On A User To Chat
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default SingleChat;

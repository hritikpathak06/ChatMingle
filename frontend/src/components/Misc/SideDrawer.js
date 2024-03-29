import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useChat } from "../../context/chatContext";
import ProfileModal from "../Models/ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import UserList from "../Shared/UserList";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const toast = useToast();

  const { user, selectedChat, setSelectedChat, chats, setChats } = useChat();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Fill The Input",
        status: "warning",
        position: "top-left",
        duration: 5000,
        isClosable: true,
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/v1/user/allusers?search=${search}`,
        config
      );
      setSearchResult(data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Create Chat
  const createChatHandler = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/v1/chat/create",
        { userId },
        config
      );
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip
          label="Search User To Chat With"
          hasArrow
          placement="bottom-end"
        >
          <Button variant={"ghost"} onClick={onOpen} ref={btnRef}>
            <FaSearch />
            <Text variant="body" d={{ sm: "none", md: "flex" }}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"}>Chat Mingle</Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Menu>
            <MenuButton p={1}>
              <FaBell fontSize={"5xl"} />
              {/* Menu List */}
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton p={1}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search the users</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search By Name or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button colorScheme="orange" onClick={handleSearch}>
                Search
              </Button>
            </Box>
            {loading ? (
              <Loader />
            ) : (
              <>
                {searchResult?.map((user, index) => (
                  <UserList
                    key={index}
                    user={user}
                    handleFunction={() => createChatHandler(user._id)}
                  />
                ))}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

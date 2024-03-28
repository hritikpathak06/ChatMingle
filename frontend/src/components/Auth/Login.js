import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/user/login", {
        email,
        password,
      });
      setLoading(false);
      if (data.success) {
        toast({
          title: "Logged In ",
          description: data.message,
          status: "success",
          position: "top",
          duration: 9000,
          isClosable: true,
        });
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        navigate("/chats");
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Something Went wrong",
        status: "error",
        position: "top",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <VStack spacing={"5px"}>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired mb={2}>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mb={2}>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </FormControl>
          <Button
            colorScheme="blue"
            w={"100%"}
            style={{ marginTop: "15px" }}
            type="submit"
            isLoading={loading}
          >
            Login
          </Button>
        </form>
      </VStack>
    </>
  );
};

export default Login;

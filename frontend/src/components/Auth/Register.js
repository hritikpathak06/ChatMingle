import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const navigate = useNavigate();

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      return toast({
        title: "Wrong Password",
        description: "Password and Confirm Password Didn't Match",
        status: "error",
        position: "top",
        duration: 9000,
        isClosable: true,
      });
    }
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/user/register", {
        name,
        email,
        password,
      });
      setLoading(false);
      if (data) {
        toast({
          title: "Account Created ",
          description: data.message,
          status: "success",
          position: "top",
          duration: 9000,
          isClosable: true,
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
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

  // Todo to add Profile Picture
  const postDetails = (pics) => {};

  return (
    <>
      <VStack spacing={"5px"}>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired mb={2}>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
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
          <FormControl isRequired mb={2}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              placeholder="Enter Your Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Upload Your Picture</FormLabel>
            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={(e) => postDetails(e.target.value[0])}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            w={"100%"}
            style={{ marginTop: "15px" }}
            type="submit"
            isLoading={loading}
          >
            Register
          </Button>
        </form>
      </VStack>
    </>
  );
};

export default Register;

import React from "react";
import "../App.css";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

const HomePage = () => {
  return (
    <>
      <div className="app">
        <Container maxWidth="xl" centerContent>
          <Box
            display={"flex"}
            justifyContent={"center"}
            p={3}
            bg={"#fff"}
            w={"100%"}
            m={"40px 0 15px 0"}
            borderRadius={"lg"}
            borderWidth={"2px"}
          >
            <Text fontSize={"4xl"} fontFamily={"Poppins"}>
              Chat Mingle
            </Text>
          </Box>
          <Box
            bg={"#fff"}
            w={"100%"}
            p={4}
            borderRadius={"lg"}
            borderWidth={"2px"}
          >
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList mb={"1rem"}>
                <Tab w={"50%"}>Login</Tab>
                <Tab w={"50%"}>Register</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Register />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default HomePage;

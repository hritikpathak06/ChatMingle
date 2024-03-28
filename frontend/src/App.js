import React, { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Lazy Loading To Reduce The Loading of a page
const HomePage = lazy(() => import("./pages/HomePage"));
const ChatPage = lazy(() => import("./pages/ChatPage.js"));


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

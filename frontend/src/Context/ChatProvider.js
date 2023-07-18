import React, { createContext, useContext, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [notification, setNotification] = useState([]);

  return (
    <ChatContext.Provider
      value={{
        currentSelected,
        setCurrentSelected,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
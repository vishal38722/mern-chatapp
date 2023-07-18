import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
// import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, getUserRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(async () => {
    const currentUser = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const currentUser = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
    // if (currentChat) console.log("INSIDE ChatContainer.js, handleSendMsg, currentChatUser ", currentChat.username);
    // if (currentUser) console.log("INSIDE ChatContainer.js, handleSendMsg, currentUser ", currentUser.username);
    // console.log("Message Sent", msg);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", async (data) => {
        // if(currentChat._id!==data.from || currentChat._id===undefined) console.log("currentChat is different");
        // console.log("currentChat ", currentChat);
        // console.log("This is recieved data ", data);
        const response = await axios.get(`${getUserRoute}/${data.from}`);
        const userDetails = response.data;
        const test = () => {
          let s1 = new SpeechSynthesisUtterance(`You have a new message from ${userDetails.username}`);
          speechSynthesis.speak(s1);
          // console.log(`You have a new message from ${userDetails.username}`);
        }
        test();
        setArrivalMessage({ fromSelf: false, message: data.msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="img"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
            {isTyping ? <div style={{ color: "green" }}> typing... </div> : <></>}
          </div>
        </div>
        {/* <Logout />j */}
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} REACT_APP_LOCALHOST_KEY={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} isTyping={isTyping} setIsTyping={setIsTyping} currentChat={currentChat} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #080420;
    border: 1px solid black;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #0e75a1;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #2e3854;
      }
    }
  }
`;

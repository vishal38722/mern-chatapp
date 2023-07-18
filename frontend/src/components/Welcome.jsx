import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    const fetchUser = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      setUserName(data.username);
    }
    fetchUser();
    const test = () => {
      let s1 = new SpeechSynthesisUtterance(`Welcome ${userName}!`);
      speechSynthesis.speak(s1);
    }
    // console.log(`Welcome ${userName}!`);
    test();
  }, []);
  return (
    <Container>
      {/* <img src={Robot} alt="" /> */}
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  h3 {
    padding-top:4vh;
  }
  span {
    color: #4e0eff;
  }
`;

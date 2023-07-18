const express = require("express");
const cors = require("cors");
// const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send(`API is running on PORT ${process.env.PORT || 4000}`);
})

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT || 4000, () =>
  console.log(`Server started on http://localhost:${process.env.PORT || 4000}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    // origin: "https://v-chat-front.onrender.com",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
});

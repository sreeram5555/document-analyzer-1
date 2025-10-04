
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from './routes/documentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import userModel from './models/userModel.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: '*', credentials: true }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "https://document-analyzer-1-4x6b.onrender.com" } });
const ML_AGENT_URL = process.env.ML_AGENT_URL;


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/user", userRoutes);

io.on('connection', (socket) => {
  socket.on('sendMessage', async ({ userId, documentId, question, history }) => {
    try {
      const user = await userModel.findById(userId);
      if (!user) return;
      const document = user.files.id(documentId);
      if (!document) return;
      document.chatHistory.push({ role: 'user', content: question });
      await user.save();
      const mlApiResponse = await axios.post(`${ML_AGENT_URL}/chat/`, { user_id: userId, question, history });
      const agentResponse = mlApiResponse.data.response;
      document.chatHistory.push({ role: 'assistant', content: agentResponse });
      await user.save();
      socket.emit('receiveMessage', { role: 'assistant', content: agentResponse });
    } catch (error) {
      console.error("Socket.IO Error:", error.message);
      socket.emit('receiveMessage', { role: 'assistant', content: "Sorry, the AI service failed to respond." });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`${PORT}`));
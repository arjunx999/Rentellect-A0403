import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/send-message", sendMessage, verifyToken);

router.get("/get-messages", getMessages, verifyToken);

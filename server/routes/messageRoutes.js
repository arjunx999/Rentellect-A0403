import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/send-message", sendMessage, verifyToken);

router.get("/get-messages", getMessages, verifyToken);

export default router;
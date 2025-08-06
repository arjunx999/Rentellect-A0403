import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/send-message", verifyToken, sendMessage);

router.get("/get-messages/:otherUserId", verifyToken, getMessages);

export default router;
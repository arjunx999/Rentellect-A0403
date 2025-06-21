import express from "express";
import {
  getUser,
  getUserConversations,
  ownerBooks,
  rentedBooks,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", getUser, verifyToken);

router.get("/getConversations", getUserConversations, verifyToken);

router.get("/rentedBooks", rentedBooks, verifyToken);

router.get("/owner-stats", ownerBooks, verifyToken);

export default router;
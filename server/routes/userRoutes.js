import express from "express";
import {
  getUser,
  getUserConversations,
  ownerBooks,
  rentedBooks,
  getAllUsers,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getAllUsers)

router.get("/:id", verifyToken, getUser);

router.get("/getConversations/:userId", verifyToken, getUserConversations);

router.get("/rentedBooks", verifyToken, rentedBooks);

router.get("/owner-stats", verifyToken, ownerBooks);

export default router;

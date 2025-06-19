import express from "express";
import {
  getUser,
  getUserConversations,
  ownerBooks,
  rentedBooks,
} from "../controllers/userController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/:id", getUser, verifyToken);

router.get("/getConversations", getUserConversations, verifyToken);

router.get("/rentedBooks", rentedBooks, verifyToken);

router.get("/owner-stats", ownerBooks, verifyToken);

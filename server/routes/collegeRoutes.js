import express from "express";
import { getColleges } from "../controllers/collegeController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// get all colleges
router.get("/", verifyToken, getColleges);

export default router;

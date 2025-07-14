import express from "express";
import { upload } from "../middleware/multer.js";
import {
  bookReturn,
  deleteListing,
  getBookById,
  getBooks,
  listBook,
  rentBook,
  getBooksByCollege,
  saveCondition,
} from "../controllers/bookController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// list new book
router.post("/list-new", verifyToken, upload.array("bookImages", 4), listBook);
// "bookImages" should match the form field name in the frontend

// delete a listing
router.delete("/delete-listing/:id", verifyToken, deleteListing);

// save condition of book
// router.patch("/save-condition/:id", verifyToken, saveCondition);

// get all books
router.get("/", verifyToken, getBooks);

// get book by id
router.get("/:id", verifyToken, getBookById);

// get book by college
router.get("/get-by-college/:collegeid", verifyToken, getBooksByCollege);

// rent a book
router.post("/rent-book", verifyToken, rentBook);

// return a book
router.patch("/return-book/:id", verifyToken, bookReturn);

export default router;

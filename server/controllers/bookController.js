import { Book } from "../models/book.js";
import Razorpay from "razorpay";
import { User } from "../models/user.js";
import { College } from "../models/college.js";

export const listBook = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { title, author, price, isbn, rental_time, condition } = req.body;
    const imageUrls = req.files.map((file) => file.path);

    const newBook = new Book({
      owner: userId,
      title,
      author,
      price,
      isbn,
      rental_time,
      condition,
      photos: imageUrls,
      college: user.college,
    });

    const savedBook = await newBook.save();

    res
      .status(200)
      .json({ message: "Book listing successfull", book: savedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book listing not found" });
    }
    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: "Book listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition } = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book listing not found" });
    }

    book.condition = condition;
    const updatedBook = await book.save();

    res.status(200).json({
      message: "Condition saved successfully",
      book: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate("owner", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate("owner", "name");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const rentBook = async (req, res) => {
  try {
    const { amount, bookId, tenantId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.isRented) {
      return res.status(400).json({ message: "Book is already rented." });
    }
    const tenant = await User.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    book.tenant = tenantId;
    book.isRented = true;
    await book.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bookReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user.id;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.owner.toString() !== user) {
      return res.status(403).json({
        message: "Only the owner can modify rental status",
      });
    }

    book.isRented = false;
    book.tenant = null;

    await book.save();
    res.status(200).json({ message: "Book return successful", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
